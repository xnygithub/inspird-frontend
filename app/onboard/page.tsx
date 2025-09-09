import { onboard } from '@/app/onboard/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if the user has already onboarded
    // Could be done if onboarding attribute is added to supabasemetadata

    if (!user) redirect('/login')

    return (
        <>
            <p>This is the onboarding page</p>
            <form action={onboard}>
                <label htmlFor="username">Username:</label>
                <input id="username" name="username" type="text" required />
                <button>Onboard</button>
            </form>
        </>
    )
}