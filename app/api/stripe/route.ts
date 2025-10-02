import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/utils/supabase/admin";


const getWebhookSecret = () => {
    if (process.env.STRIPE_WEBHOOK_VERCEL_SIGNING_SECRET) {
        return process.env.STRIPE_WEBHOOK_VERCEL_SIGNING_SECRET;
    }
    return process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
}

async function updateUserSubscriptionStatus(
    userId: string,
    subscriptionStatus: string,
    subscriptionId: string
) {
    const supabase = await createAdminClient();
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
        throw new Error("Missing stripeCustomerId or userId");
    }

    const supabase = await createAdminClient();
    const { error } = await supabase
        .from("profiles")
        .update({ stripeCustomerId: stripeCustomerId })
        .eq("id", userId);

    if (error) {
        console.error("Error storing stripe customer id" + error.message);
        throw new Error("Error storing stripe customer id" + error.message);
    }
}

async function updateUserSubscriptionHistory(
    userId: string,
    subscriptionId: string,
    stripePriceId: string,
    startDate: number,
    endDate: number
) {
    const supabase = await createAdminClient();
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
        console.error("Error updating user subscription history" + error.message);
        throw new Error("Error updating user subscription history" + error.message);
    }
}

async function handleCustomerSubscriptionCreated(event: Stripe.Event) {
    const userId = (event.data.object as Stripe.Checkout.Session).metadata?.userId as string;
    const subscriptionId = (event.data.object as Stripe.Subscription).id;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!userId) {
        throw new Error("Missing userId");
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
        throw new Error("Missing userId");
    }
    await updateUserSubscriptionStatus(userId, "inactive", subscriptionId);
}


//cus_T3UeRrvr4x3nY8
export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = (await headers()).get("Stripe-Signature");
    if (!signature) {
        throw new Error("Missing Stripe-Signature");
    }
    const webhookSecret = getWebhookSecret();
    if (!webhookSecret) {
        throw new Error("Missing STRIPE_WEBHOOK_SIGNING_SECRET");
    }
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        console.error(error);
        throw new Error("Webhook verification failed");
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