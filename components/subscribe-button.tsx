"use client";
import { subscribe } from "../actions/actions";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Profile } from "@/app/generated/prisma";

type Props = {
    user: Profile;
};

export default function SubscribeButton({ user }: Props) {
    const router = useRouter();
    const [isLoading, startTransition] = useTransition();

    const handleSubscribe = async () => {
        startTransition(async () => {
            const url = await subscribe({
                email: user.email,
                userId: user.id
            });
            if (url) router.push(url);
            else console.error("Failed to subscribe");
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