"use client"
import React from 'react'
import { useUserContext } from '@/components/userContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Section, Title } from '@/app/(app)/settings/components/group';
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"


const AccountSettingsPage = () => {
    const { user } = useUserContext();

    if (!user) return null;
    return (
        <>
            {/* Page title and description */}
            <Title
                title='Account'
                description='Manage your account settings.'
            />

            {/* Change username */}
            <Section
                heading='Change username'
                description='
                Update your username here. 
                They can only be changed once every 30 days.'
            >
                <form className='space-y-6 w-full'>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='username'
                            className='dark:text-muted-foreground text-xs'>
                            Username
                        </Label>
                        <Input
                            id='username'
                            type='text'
                            autoComplete='off'
                            defaultValue={user.username}
                            placeholder='New username'
                            className='md:max-w-xs'
                        />
                    </div>
                </form>
            </Section>

            {/* Change password */}
            <Section
                heading='Change password'
                description='
                Update your password here.'
            >
                <form className='space-y-6 w-full'>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='password'
                            className='dark:text-muted-foreground text-xs'>
                            Current password
                        </Label>
                        <Input id='password' type='password'
                            autoComplete='off'
                            placeholder='Current password'
                            className='md:max-w-xs'
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='newPassword'
                            className='dark:text-muted-foreground text-xs'>
                            New password
                        </Label>
                        <Input id='newPassword' type='password'
                            autoComplete='off'
                            placeholder='New password'
                            className='md:max-w-xs'
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='confirmPassword'
                            className='dark:text-muted-foreground text-xs'>
                            Confirm new password
                        </Label>
                        <Input id='confirmPassword' type='password'
                            autoComplete='off'
                            placeholder='Confirm new password'
                            className='md:max-w-xs'
                        />
                    </div>
                </form>
            </Section>

            <Section
                heading='Content Filtering'
                description='
                Choose what content you want to see.'>

                <form className='space-y-3 w-full md:max-w-xs dark:text-muted-foreground'>
                    <div className='flex flex-row justify-end text-primary text-xs'>
                        <div className='flex flex-row gap-6 px-5'>
                            <span>Show</span>
                            <span>Blur</span>
                            <span>Hide</span>
                        </div>
                    </div>
                    <div className='flex flex-row justify-between'>
                        <Label
                            htmlFor='contentFiltering'
                            className='text-sm'>
                            NSFW Content
                        </Label>
                        <RadioGroup
                            defaultValue="show"
                            className='flex flex-row justify-center items-center gap-8 px-6 py-3 border border-border rounded-md'>
                            <RadioGroupItem value="show" id="r1" />
                            <RadioGroupItem value="blur" id="r2" />
                            <RadioGroupItem value="hide" id="r2" />
                        </RadioGroup>

                    </div>
                    <div className='flex flex-row justify-between'>
                        <Label
                            htmlFor='aiContent'
                            className='text-sm'>
                            AI Generated Content
                        </Label>
                        <RadioGroup
                            defaultValue="show"
                            className='flex flex-row justify-center items-center gap-8 px-6 py-3 border border-border rounded-md'>
                            <RadioGroupItem value="show" id="r1" />
                            <RadioGroupItem value="blur" id="r2" />
                            <RadioGroupItem value="hide" id="r2" />
                        </RadioGroup>

                    </div>
                </form>
            </Section>


            {/* Export your data */}
            <Section
                heading='Export your data'
                description='
                Export your account data.
                This process will take 7 days to complete and will be emailed to you.'
            >
                <button className={cn(
                    "bg-primary hover:bg-primary/90 font-sans",
                    "px-5 py-2  text-primary-foreground text-xs",
                    "font-medium cursor-pointer")}>Export data
                </button>
            </Section>
        </>
    )
}



export default AccountSettingsPage