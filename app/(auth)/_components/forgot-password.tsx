import Link from "next/link"
import { useActionState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { ArrowLeft, CircleCheck, Loader2 } from "lucide-react"
import { resetPassword } from "@/app/(auth)/change-password/actions"

const initialState = { error: false, message: '' }

export function ForgotPasswordForm() {

    const [
        resetPasswordState,
        resetPasswordAction,
        resetPasswordPending] = useActionState(resetPassword, initialState)


    return (
        <form action={resetPasswordAction} className="flex flex-col gap-6">
            <FieldGroup>
                <div className="relative flex flex-col items-center gap-1 text-center">
                    <h1 className="font-bold text-2xl">Reset password</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to reset your password
                    </p>
                    <Link href="/login">
                        <Button
                            variant="icon"
                            type="button"
                            className="top-0 left-0 absolute">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                </div>
                <Field >
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        required
                        disabled={resetPasswordPending}
                    />
                </Field>
                <Button
                    type="submit"
                    disabled={resetPasswordPending}
                >{resetPasswordPending ? <Loader2 className="size-4 animate-spin" /> : 'Forgot password'}
                </Button>
                {resetPasswordState.message && (
                    <div className="flex flex-col items-center gap-0.5 text-center">
                        <div className="flex items-center gap-2">
                            <CircleCheck className="size-4 text-green-500" />
                            <h1 className="font-semibold text-base">Password reset email sent</h1>
                        </div>
                        <p className="text-muted-foreground text-sm text-balance">
                            Check your email for a link to reset your password
                        </p>
                    </div>
                )}
            </FieldGroup>
        </form>
    )
}
