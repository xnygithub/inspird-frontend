"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

type Props = {
    email: string;
    userId: string;
};

const getBaseUrl = () => {
    return process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'
}

async function getUserStripeCustomerId(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("profiles")
        .select("stripeCustomerId")
        .eq("id", userId)
        .single();
    if (error) {
        throw new Error(error.message);
    }
    return data.stripeCustomerId;
}

export const subscribe = async ({ email, userId }: Props) => {
    const priceId = process.env.STRIPE_PRICE_ID_PRO;
    if (!priceId) {
        throw new Error("STRIPE_PRICE_ID_PRO is not set");
    }
    const stripeCustomerId = await getUserStripeCustomerId(userId);
    const base: Stripe.Checkout.SessionCreateParams = {
        mode: "subscription",
        payment_method_types: ["card"],
        success_url: `${getBaseUrl()}/`,
        cancel_url: `${getBaseUrl()}/`,
        metadata: { userId, email },
        subscription_data: { metadata: { userId, email } },
        line_items: [{ price: priceId, quantity: 1 }],
    };
    const customerFields = stripeCustomerId
        ? { customer: stripeCustomerId }
        : { customer_email: email };

    const { url } = await stripe.checkout.sessions.create({ ...base, ...customerFields });


    return url;
};