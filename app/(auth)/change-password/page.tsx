
"use client"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import KenBurnsSlideshow from '../../login/gallery'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

export default function ChangePasswordPage() {
    const supabase = createClient()

    useEffect(() => {
        const { data: sub } = supabase.auth.onAuthStateChange(async (event) => {
            if (event === "PASSWORD_RECOVERY") {
                const newPassword = prompt("Enter your new password");
                if (newPassword) {
                    const { error } = await supabase.auth.updateUser({ password: newPassword });
                    if (error) alert(error.message);
                    else alert("Password updated!");
                }
            }
        });

        return () => {
            sub.subscription.unsubscribe();
        };
    }, []);

    return (
        <div className="padding-top grid lg:grid-cols-2 min-h-svh font-sans">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center md:justify-start gap-2">
                    <Link href="/login">
                        <Button
                            variant="icon"
                            type="button"
                            className="rounded-full">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <a href="#" className="flex items-center gap-2 font-medium">
                        Inspird Inc.
                    </a>

                </div>
                <div className="flex flex-1 justify-center items-center">
                    <div className="padding-bottom w-full max-w-sm">
                        <form className="flex flex-col gap-6">
                            <FieldGroup>
                                <div className="relative flex flex-col items-center gap-1 text-center">
                                    <h1 className="font-bold text-2xl">Reset password</h1>
                                    <p className="text-muted-foreground text-sm text-balance">
                                        Enter your new password below to change your password
                                    </p>
                                    <Link href="/forgot-password">
                                        <Button
                                            variant="icon"
                                            type="button"
                                            className="top-0 left-0 absolute rounded-full">
                                            <ArrowLeft className="size-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <Field >
                                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        name="new-password"
                                        placeholder="New password"
                                        required
                                    />
                                </Field>
                                <Field >
                                    <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
                                    <Input
                                        id="confirm-new-password"
                                        type="password"
                                        name="confirm-new-password"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </Field>
                                <Button
                                    type="submit"
                                    className="rounded-xl"
                                >Change password</Button>
                            </FieldGroup>
                        </form>
                    </div>
                </div>
            </div>
            <KenBurnsSlideshow
                slideDuration={20000}
                fadeDuration={2000}
                className="hidden lg:block relative overflow-hidden"
            />
        </div>
    )
}
