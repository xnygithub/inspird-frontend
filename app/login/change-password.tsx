
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ChangePasswordForm() {


    return (
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
    )
}
