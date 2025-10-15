'use client'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sort from '@/app/[username]/components/sort';
import Search from '@/app/[username]/components/search';
import PinsContainer from '@/app/[username]/components/pin-tab';
import FoldersContainer from '@/app/[username]/components/folders/tab-content';
import CanvasContainer from '@/app/[username]/components/canvas-tab';
import ToggleSearch from '@/app/[username]/components/toggle-search';

function getTabCount(count: number, text: string) {
    return count + " " + (count === 1 ? text : text + "s")
}
const Container = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { user, isMe }: { user: any, isMe: boolean }
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState('pins');
    const [sort, setSort] = useState('latest');

    return (
        <Tabs className="profile-tabs" defaultValue={tab} onValueChange={setTab}>
            <TabsList variant='profile'>
                <TabsTrigger value="pins" variant='profile'>
                    {getTabCount(user.itemCount, "Pin")}
                </TabsTrigger>
                <TabsTrigger value="folders" variant='profile'>
                    {getTabCount(user.folderCount, "Folder")}
                </TabsTrigger>
                <TabsTrigger value="canvas" variant='profile'>
                    {getTabCount(user.canvasCount, "Canvas")}
                </TabsTrigger>
                <div className='top-0 right-0 absolute flex items-center gap-2 mr-[6px]'>
                    {tab === 'pins' && <ToggleSearch open={isOpen} setOpen={setIsOpen} />}
                    <Sort setSort={setSort} />
                </div>
            </TabsList>
            {tab == 'pins' && <Search open={isOpen} />}

            <TabsContent id="tabs-content" value="pins">
                <PinsContainer userId={user.id} />
            </TabsContent>
            <TabsContent id="tabs-content" value="folders">
                <FoldersContainer userId={user.id} isMe={isMe} />
            </TabsContent>
            <TabsContent id="tabs-content" value="canvas">
                <CanvasContainer userId={user.id} />
            </TabsContent>
        </Tabs>
    )
}

export default Container