"use client";
import { subscribe } from "../actions/actions";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

type Props = {
    user: User;
};

export default function SubscribeButton({ user }: Props) {
    const router = useRouter();
    const [isLoading, startTransition] = useTransition();
    console.log("user", user);

    const handleSubscribe = async () => {
        startTransition(async () => {
            const url = await subscribe({
                authSub: user.id,
                email: user.email!,
                userId: user.user_metadata.id
            });
            if (url) {
                router.push(url);
            } else {
                console.error("Failed to subscribe");
            }
        });
    };

    return (
        <Button
            disabled={isLoading}
            onClick={handleSubscribe}>
            Subscribe
        </Button>
    );
}