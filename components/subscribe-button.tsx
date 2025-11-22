"use client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useUserContext } from "./userContext";
import { Button } from "@/components/ui/button";
import { subscribe } from "@/app/actions/stripe";
import { useNavbarStore } from "@/components/navbar/store";

export const SubscribeButton = (
) => {
    const router = useRouter();
    const { user } = useUserContext();

    console.log("user", user);
    const [isLoading, startTransition] = useTransition();
    const open = useNavbarStore((state) => state.open);


    const handleSubscribe = async () => {
        if (!user) return;
        startTransition(async () => {
            const url = await subscribe({
                email: user.email,
                userId: user.id
            });
            if (url) router.push(url);
            else console.error("Failed to subscribe");
        });
    };

    if (!user || user.subscriptionStatus === "active") return null;
    return (
        <Button
            variant="genericRounded"
            className={cn(
                "transition-all duration-200",
                open ? "max-[1075px]:opacity-100" : "max-[925px]:opacity-0 max-[925px]:pointer-events-none opacity-100 pointer-events-auto",
                "font-sans font-medium text-sm")}
            disabled={isLoading}
            onClick={handleSubscribe}>
            Upgrade
        </Button>
    );
}