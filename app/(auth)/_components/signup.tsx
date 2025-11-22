import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signup } from '@/app/(auth)/login/actions'
import { useActionState, useId, useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"

const initialState = { error: false, message: '' }

export function SignupForm() {

    const [signUpState, signUpAction, signUpPending] = useActionState(signup, initialState)
    const pwId = useId();
    const confirmId = useId();

    const pwRef = useRef<HTMLInputElement>(null);
    const confirmRef = useRef<HTMLInputElement>(null);

    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pw, setPw] = useState("");
    const [confirm, setConfirm] = useState("");
    const [mismatch, setMismatch] = useState(false);
    const [loading, setLoading] = useState(false);


    function validateMatch(nextConfirm = confirm, nextPw = pw) {
        const noMatch = nextConfirm.length > 0 && nextConfirm !== nextPw;
        setMismatch(noMatch);

        if (confirmRef.current) {
            confirmRef.current.setCustomValidity(noMatch ? "Passwords do not match." : "");
            if (!noMatch) confirmRef.current.reportValidity();
        }
    }

    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            validateMatch();
            if (pw !== confirm) {
                setMismatch(true);
                setLoading(false);
            } else {
                console.log(pw, confirm);
                // signUpAction( new FormData(props.form));
                setLoading(false);
            }
        }, 500);
    }

    return (
        <form >
            <FieldGroup >
                <div className="relative flex flex-col items-center gap-1 text-center">
                    <h1 className="font-bold text-2xl">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to create your account
                    </p>
                    <Link href="/login">
                        <Button
                            variant="icon"
                            type="button"
                            className="top-0 left-0 absolute rounded-full">
                            <ArrowLeft />
                        </Button>
                    </Link>
                </div>
                <Field >
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                        required
                        id="username"
                        type="text"
                        name="username"
                    />
                </Field>
                <Field >
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        required
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                    />
                </Field>
                <Field >
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <Input
                        required
                        id={pwId}
                        ref={pwRef}
                        name="password"
                        type={showPw ? "text" : "password"}
                        autoComplete="new-password"
                        onChange={(e) => setPw(e.target.value)}
                        className="mt-1 px-3 py-2 border rounded-md w-full"
                    />
                </Field>
                <Field >
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
                    </div>
                    <Input
                        required
                        id={confirmId}
                        ref={confirmRef}
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        aria-invalid={mismatch ? "true" : "false"}
                        aria-describedby={mismatch ? `${confirmId}-error` : undefined}
                        className={`mt-1 w-full rounded-md border px-3 py-2 `}
                    />
                    {mismatch && <p className="flex items-center gap-1 mt-1 text-destructive text-sm"><AlertCircle className="size-4" /> Passwords do not match.</p>}
                    {signUpState.error && <p className="text-destructive text-xs">{signUpState.message}</p>}
                </Field>
                <Field>
                    <Button
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                        disabled={loading}>
                        {loading ? <Loader2 className="size-4 animate-spin" /> : 'Sign up'}
                    </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button variant="outline" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Sign up with Google
                    </Button>
                    <FieldDescription className="text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup >
        </form >
    )
}
