import { Lock } from 'lucide-react'
export default function PrivatePage() {
    return (
        <div className="flex flex-col justify-center items-center gap-4 mt-16 font-sans text-primary">
            <Lock size={60} />
            <div className="flex flex-col items-center gap-0.5">
                <h1 className='text-xl'>
                    This profile is private
                </h1>
                <span className="text-muted-foreground text-sm">Follow this user to see their profile</span>
            </div>
        </div>
    )
}