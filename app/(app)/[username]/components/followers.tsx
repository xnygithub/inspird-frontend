"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DialogProps {
    tab: string
    open: boolean
    setOpen: (open: boolean) => void
}

interface ItemProps {
    name: string
    username: string
    buttonText: string
}

interface ButtonProps {
    followers: number
    following: number
}

const FollowerItem = (
    { name, username, buttonText }: ItemProps
) => {
    return (
        <div className="flex justify-between items-center gap-2 hover:bg-accent px-4 py-2.5 w-full font-sans cursor-pointer">
            <div className="flex items-center gap-2.5">
                <img src="https://placehold.co/50x50" alt="Follower" className="rounded-full" />
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="opacity-80 text-sm">@{username}</p>
                </div>
            </div>
            <Button variant="genericRounded" className="group relative w-22">
                <span className="group-hover:hidden">{buttonText === 'Follow' ? buttonText : "Unfollow"}</span>
                <span className="hidden group-hover:inline">{buttonText === 'Follow' ? "Unfollow" : "Follow"}</span>
            </Button>
        </div>
    )
}

const FollowerDialog = (
    { tab, open, setOpen }: DialogProps
) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent showCloseButton={false} className="flex flex-col items-center px-0 rounded-3xl w-[425px] min-h-[600px]">
                <DialogHeader hidden>
                    <DialogTitle>{tab === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue={tab} className="items-center w-full">
                    <TabsList variant="profile" className="mb-4">
                        <TabsTrigger value="followers" variant="profile">Followers</TabsTrigger>
                        <TabsTrigger value="following" variant="profile">Following</TabsTrigger>
                    </TabsList>
                    <TabsContent value="followers" className="items-center w-full">
                        <div className="flex flex-col gap-2">
                            <FollowerItem name="John Doe" username="john_doe" buttonText="Follow" />
                            <FollowerItem name="John Doe" username="john_doe" buttonText="Follow" />
                        </div>
                    </TabsContent>
                    <TabsContent value="following" className="items-center w-full">
                        <div className="flex flex-col gap-2">
                            <FollowerItem name="Mary Jane" username="mary_jane" buttonText="Unfollow" />
                            <FollowerItem name="Mary Jane" username="mary_jane" buttonText="Unfollow" />
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

type Tab = 'followers' | 'following'
type Props = { followers: number, following: number };
const FollowersButton = (
    { followers, following }: Props
) => {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState<Tab>('followers')

    const handleClick = (tab: Tab) => {
        setTab(tab); setOpen(true)
    }

    return (
        <div className="flex gap-8 mt-4 [&_button]:text-base">
            <Button
                size="wrap"
                variant="followButton"
                onClick={() => handleClick('followers')}>
                {followers} Followers
            </Button>
            <Button
                size="wrap"
                variant="followButton"
                onClick={() => { setTab("following"); setOpen(true) }}>
                {following} Following
            </Button>
            <FollowerDialog tab={tab} open={open} setOpen={setOpen} />
        </div>
    )
}


export { FollowersButton }