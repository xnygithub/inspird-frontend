import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import KenBurnsSlideshow from '../_components/gallery'
import { ChangePasswordForm } from '@/app/(auth)/_components/change-password'

export default function ChangePasswordPage() {
    return (
        <div className="grid lg:grid-cols-2 min-h-svh font-sans">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center md:justify-start gap-2">
                    <Link href="/login">
                        <Button
                            variant="icon"
                            type="button">
                            <ArrowLeft className="size-4" />
                        </Button>
                    </Link>
                    <a href="#" className="flex items-center gap-2 font-medium">
                        Inspird Inc.
                    </a>

                </div>
                <div className="flex flex-1 justify-center items-center">
                    <div className="w-full max-w-sm">
                        <ChangePasswordForm />
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
