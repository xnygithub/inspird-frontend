"use client"
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import KenBurnsSlideshow from '../_components/gallery'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoginForm } from '../_components/login'
import { SignupForm } from '../_components/signup'
import { ForgotPasswordForm } from '@/app/(auth)/_components/forgot-password'
import { ChangePasswordForm } from '@/app/(auth)/_components/change-password'

export default function LoginPage() {

    const path = usePathname()

    return (
        <div className="grid lg:grid-cols-2 min-h-svh font-sans">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center md:justify-start items-center gap-2">
                    {path !== '/login' && <Link href="/login">
                        <Button
                            variant="icon"
                            type="button"
                            className="rounded-full">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>}
                    <Link href="/">
                        <span className='font-sans font-medium'> Inspird</span>
                    </Link>
                </div>
                <div className="flex flex-1 justify-center items-center">
                    <div className="w-full max-w-sm">
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

