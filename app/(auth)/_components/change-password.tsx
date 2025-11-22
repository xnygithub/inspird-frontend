"use client"
import Link from "next/link"
import { useActionState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { updatePassword } from "@/app/(auth)/change-password/actions"

const initialState = { error: false, message: '' }
export function ChangePasswordForm() {

    const [state, action, pending] = useActionState(updatePassword, initialState)

    return (
        <form action={action} className="flex flex-col gap-6">
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
                            className="top-0 left-0 absolute">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                </div>
                <Field >
                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
                    <Input
                        required
                        type="password"
                        id="new-password"
                        disabled={pending}
                        name="new-password"
                        placeholder="New password"
                    />
                </Field>
                <Field >
                    <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
                    <Input
                        required
                        type="password"
                        disabled={pending}
                        id="confirm-new-password"
                        name="confirm-new-password"
                        placeholder="Confirm new password"
                    />
                </Field>
                <Button type="submit">
                    {pending ? <Loader2 className="size-4 animate-spin" /> : 'Change password'}
                </Button>
                {state.error && <p className="text-destructive text-xs">{state.message}</p>}
            </FieldGroup>
        </form>
    )
}
