"use client"
import { LoginForm } from './login'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SignupForm } from './signup'
import { ForgotPasswordForm } from './forgot-password'
import KenBurnsSlideshow from './gallery'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { ChangePasswordForm } from './change-password'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LoginPage() {
    const [path, setPath] = useState<string | null>(null)
    const supabase = createClient()

    const pathname = usePathname()
    useEffect(() => {
        setPath(pathname)
    }, [pathname])


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
                        {path === '/login' && <LoginForm />}
                        {path === '/signup' && <SignupForm />}
                        {path === '/forgot-password' && <ForgotPasswordForm />}
                        {path === '/change-password' && <ChangePasswordForm />}
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

