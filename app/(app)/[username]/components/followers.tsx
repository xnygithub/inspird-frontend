"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

enum Tab {
    Followers = 'followers',
    Following = 'following'
}

type DialogProps = {
    tab: Tab
    open: boolean
    setOpen: (open: boolean) => void
}

type FItemProps = {
    name: string
    username: string
    buttonText: string
}

type FButtonProps = {
    followers: number,
    following: number
};


function FollowerItem({
    name,
    username,
    buttonText
}: FItemProps
) {
    return (
        <div className="flex justify-between items-center gap-2 hover:bg-accent px-4 py-3 w-full font-sans cursor-pointer">
            <div className="flex items-center gap-2.5">
                <img src="https://placehold.co/40x40" alt="Follower" className="rounded-md" />
                <div>
                    <div className="font-medium text-[15px]">{name}</div>
                    <div className="opacity-80 text-xs">@{username}</div>
                </div>
            </div>
            <Button variant="genericRounded" className="group relative px-4 py-2 w-22 h-fit text-xs">
                <span className="group-hover:hidden">{buttonText === 'Follow' ? buttonText : "Unfollow"}</span>
                <span className="hidden group-hover:inline">{buttonText === 'Follow' ? "Unfollow" : "Follow"}</span>
            </Button>
        </div>
    )
}

function FollowerDialog({
    tab,
    open,
    setOpen
}: DialogProps
) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                showCloseButton={false}
                className="flex flex-col items-center px-3 rounded-3xl w-[400px] min-h-[600px]">
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
                            <FollowerItem name="Mary Jane" username="mary_jane" buttonText="Unfollow" />
                        </div>
                    </TabsContent>
                    <TabsContent value="following" className="items-center w-full">
                        <div className="flex flex-col gap-2">
                            <FollowerItem name="Mary Jane" username="mary_jane" buttonText="Unfollow" />
                            <FollowerItem name="John Doe" username="john_doe" buttonText="Follow" />

                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

function FollowersButton({
    followers,
    following
}: FButtonProps
) {
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState<Tab>(Tab.Followers)

    function openTab(tab: Tab) {
        setTab(tab);
        setOpen(true)
    }

    return (
        <div className="flex gap-2 mt-4">
            <Button
                size="wrap"
                variant="followButton"
                onClick={() => openTab(Tab.Followers)}>
                {followers} Followers
            </Button>
            <Button
                size="wrap"
                variant="followButton"
                onClick={() => openTab(Tab.Following)}>
                {following} Following
            </Button>
            <FollowerDialog
                tab={tab}
                open={open}
                setOpen={setOpen} />
        </div>
    )
}

export { FollowersButton }