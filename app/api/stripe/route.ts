import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";


async function updateUserSubscriptionStatus(
    userId: string,
    subscriptionStatus: string,
    subscriptionId: string
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({
            subscriptionStatus: subscriptionStatus,
            subscriptionId: subscriptionId
        })
        .eq("id", userId);
    if (error) {
        console.error("Error updating user subscription status" + error.message);
        return new NextResponse("Error updating user subscription status", { status: 500 });
    }
}


async function handleCheckoutSessionCompleted(event: Stripe.Event) {

    const userId = (event.data.object as Stripe.Checkout.Session).metadata?.userId;
    const stripeCustomerId = (event.data.object as Stripe.Checkout.Session).customer;

    if (!stripeCustomerId || !userId) {
        console.error("Missing stripeCustomerId or userId");
        return new NextResponse("Missing stripeCustomerId or userId", { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from("profiles")
        .update({ stripeCustomerId: stripeCustomerId })
        .eq("id", userId);

    if (error) return new NextResponse("Error storing stripe customer id", { status: 500 });
}

async function updateUserSubscriptionHistory(
    userId: string,
    subscriptionId: string,
    stripePriceId: string,
    startDate: number,
    endDate: number
) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("userSubscriptionHistory")
        .insert({
            userId: userId,
            subscriptionId: subscriptionId,
            stripePriceId: stripePriceId,
            startDate: new Date(startDate * 1000).toISOString(),
            endDate: new Date(endDate * 1000).toISOString(),
        });
    if (error) {
        return new NextResponse("Error updating user subscription history", { status: 500 });
    }
}

async function handleCustomerSubscriptionCreated(event: Stripe.Event) {
    const userId = (event.data.object as Stripe.Checkout.Session).metadata?.userId as string;
    const subscriptionId = (event.data.object as Stripe.Subscription).id;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!userId) {
        return new NextResponse("Missing userId", { status: 400 });
    }
    await updateUserSubscriptionStatus(userId, "active", subscriptionId);
    await updateUserSubscriptionHistory(
        userId,
        subscriptionId,
        sub.items.data[0].price.id,
        sub.items.data[0].current_period_start,
        sub.items.data[0].current_period_end
    );
}
async function handleCustomerSubscriptionDeleted(event: Stripe.Event) {
    const userId = (event.data.object as Stripe.Checkout.Session).metadata?.userId as string;
    const subscriptionId = (event.data.object as Stripe.Subscription).id;

    if (!userId) {
        return new NextResponse("Missing userId", { status: 400 });
    }
    await updateUserSubscriptionStatus(userId, "inactive", subscriptionId);
}


//cus_T3UeRrvr4x3nY8
export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = (await headers()).get("Stripe-Signature");
    if (!signature) {
        return new NextResponse("Missing Stripe-Signature", { status: 400 });
    }
    const webhookSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
    if (!webhookSecret) {
        return new NextResponse("Missing STRIPE_WEBHOOK_SIGNING_SECRET", { status: 500 });
    }
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        console.error(error);
        return new Response("Webhook verification failed", { status: 400 });
    }
    switch (event.type) {
        case "checkout.session.completed":
            await handleCheckoutSessionCompleted(event);
            break;
        case "customer.subscription.created":
            await handleCustomerSubscriptionCreated(event);
            break;
        case "customer.subscription.deleted":
            await handleCustomerSubscriptionDeleted(event);
            break;
        default:
            console.error("Unknown event type" + event.type);
        // throw new Error("Unknown event type");
    }


    revalidatePath("/", "layout");
    return new NextResponse(null, { status: 200 });
}