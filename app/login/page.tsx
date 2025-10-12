"use client"
import { login, signup } from '@/app/login/actions'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const initialState = { error: false, message: '' }
export default function LoginPage() {
    const [signInState, signInAction, signInPending] = useActionState(login, initialState)
    const [signUpState, signUpAction, signUpPending] = useActionState(signup, initialState)

    return (
        <div className='mx-auto w-[300px]'>
            <Tabs defaultValue="login">
                <TabsList className='self-center'>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <form action={signInAction} className="flex flex-col">
                        <Label htmlFor="email">Email:</Label>
                        <Input id="email" name="email" type="email" required />
                        <Label htmlFor="password">Password:</Label>
                        <Input id="password" name="password" type="password" required />
                        {signInState.error && <p className='text-red-500'>{signInState?.message}</p>}
                        <Button disabled={signInPending} className='self-center mt-2'>Log in</Button>
                    </form>
                </TabsContent>
                <TabsContent value="signup">
                    <form action={signUpAction} className="flex flex-col">
                        <Label htmlFor="email">Email:</Label>
                        <Input id="email" name="email" type="email" required />
                        <Label htmlFor="password">Password:</Label>
                        <Input id="password" name="password" type="password" required />
                        {signUpState.error && <p className='text-red-500'>{signUpState?.message}</p>}
                        <Button disabled={signUpPending} className='self-center mt-2'>Sign up</Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}