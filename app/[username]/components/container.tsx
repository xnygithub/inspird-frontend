'use client'
import React, { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sort } from '@/app/[username]/components/sort';
import Search from '@/app/[username]/components/search';
import PinTab from '@/app/[username]/components/pin-tab';
import FolderTab from '@/app/[username]/components/folders/tab-content';
import { CanvasTab } from '@/app/[username]/components/canvas-tab';
import ToggleSearch from '@/app/[username]/components/toggle-search';
import { useProfile, type TabKey } from '@/app/[username]/components/provider';


function getTabCount(
    count: number, text: string
) {
    return count + " " + (count === 1 ? text : text + "s")
}
export const Container = (
) => {
    const { user } = useProfile();
    const [isOpen, setIsOpen] = useState(false);
    const [tab, setTab] = useState<TabKey>('pins');

    const pinCount = useMemo(() => getTabCount(user.itemCount, "Pin"), [user.itemCount]);
    const folderCount = useMemo(() => getTabCount(user.folderCount, "Folder"), [user.folderCount]);
    const canvasCount = useMemo(() => getTabCount(user.canvasCount, "Canvas"), [user.canvasCount]);

    return (
        <Tabs
            className="profile-tabs"
            defaultValue={tab}
            onValueChange={(value) => setTab(value as TabKey)}>
            <TabsList variant='profile'>
                <TabsTrigger value="pins" variant='profile'>
                    {pinCount}
                </TabsTrigger>
                <TabsTrigger value="folders" variant='profile'>
                    {folderCount}
                </TabsTrigger>
                <TabsTrigger value="canvas" variant='profile'>
                    {canvasCount}
                </TabsTrigger>

                <div className='tab-filter'>
                    {tab === 'pins' && <ToggleSearch open={isOpen} setOpen={setIsOpen} />}
                    <Sort tab={tab} />
                </div>
            </TabsList>
            {tab == 'pins' && <Search open={isOpen} />}

            <TabsContent value="pins">
                <PinTab />
            </TabsContent>
            <TabsContent value="folders">
                <FolderTab />
            </TabsContent>
            <TabsContent value="canvas">
                <CanvasTab />
            </TabsContent>
        </Tabs>
    )
}

export default Container