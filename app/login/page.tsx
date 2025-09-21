import { login, signup } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// TODO: Remove readOnly field after testing
const email = process.env.EMAIL
const password = process.env.PASSWORD

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/')

    return (
        <form>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required readOnly value={email} />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required readOnly value={password} />
            <button formAction={login}>Log in</button>
            <button formAction={signup}>Sign up</button>
        </form>
    )
}