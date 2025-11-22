import React from 'react'
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Section, Title } from '@/app/(app)/settings/components/group';
import { createClient } from '@/utils/supabase/server';
import { CircleAlert } from 'lucide-react';
import { Avatar } from '@/components/avatar'

const fetchSettings = async () => {
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not found');

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();
    if (error) throw error;
    return data;
}

const ProfileSettingsPage = async () => {

    const user = await fetchSettings();
    // if (!user) return null;

    return (
        <>
            <Title
                title='Profile'
                description='
                All details and fields here are visible to 
                other users when your profile is public.'
            />
            <Section
                heading='Your Profile'
                description='
                Manage your public profile.'>
                <Avatar url={user.avatarUrl} />

                {/* Core profile information */}
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
                            className='md:max-w-xs'
                            defaultValue={user.username}
                            placeholder='Username'
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='displayName'
                            className='dark:text-muted-foreground text-xs' >
                            Display Name</Label>
                        <Input
                            id='displayName'
                            type='text'
                            autoComplete='off'
                            defaultValue={user.displayName}
                            placeholder='Display Name'
                            className='md:max-w-xs' />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='profileVisibility'
                            className='dark:text-muted-foreground text-xs' >
                            Profile Visibility</Label>
                        <Select value={user.profilePrivate ? 'private' : 'public'}>
                            <SelectTrigger id='profileVisibility' className='w-40 min-w-40'>
                                <SelectValue placeholder="Select a visibility" />
                            </SelectTrigger>
                            <SelectContent className='' align='start'>
                                <SelectItem value='public'>Public</SelectItem>
                                <SelectItem value='private'>Private</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className='inline-flex items-center gap-1 mt-1 dark:text-muted-foreground text-xs'>
                            <CircleAlert size={16} />
                            Setting your profile to private will make it only visible to you.
                        </p>
                    </div>
                </form>
            </Section>

            {/* Workspace information */}
            <Section
                heading='Your Workspace'
                description='
                Add your website and work related information to your profile.'>
                <form className='space-y-6 w-full'>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='website'
                            className='dark:text-muted-foreground text-xs' >
                            Website
                        </Label>
                        <Input
                            id='website'
                            type='text'
                            autoComplete='off'
                            placeholder='www.example.com'
                            className='md:max-w-xs'
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='company'
                            className='dark:text-muted-foreground text-xs' >
                            Company
                        </Label>
                        <Input
                            id='company'
                            type='text'
                            autoComplete='off'
                            placeholder='Example Inc.'
                            className='md:max-w-xs'
                        />
                    </div>
                </form>
            </Section>

            {/* Socials */}
            <Section
                heading='Your Socials'
                description='
                Add your social handles to your profile.'>
                <form className='space-y-6 w-full'>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='twitterHandle'
                            className='dark:text-muted-foreground text-xs' >
                            Twitter
                        </Label>
                        <Input
                            id='twitterHandle'
                            type='text'
                            autoComplete='off'
                            placeholder='@ twitter'
                            className='md:max-w-xs'
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='instagramHandle'
                            className='dark:text-muted-foreground text-xs'>
                            Instagram
                        </Label>
                        <Input
                            id='instagramHandle'
                            type='text'
                            autoComplete='off'
                            placeholder='@ instagram'
                            className='md:max-w-xs'
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label
                            htmlFor='youtubeHandle'
                            className='dark:text-muted-foreground text-xs' >
                            Youtube
                        </Label>
                        <Input
                            id='youtubeHandle'
                            type='text'
                            autoComplete='off'
                            placeholder='@ youtube'
                            className='md:max-w-xs'
                        />
                    </div>
                </form>
            </Section>
        </>
    )
}


export default ProfileSettingsPage