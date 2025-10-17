'use client'
import React, { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sort } from '@/app/[username]/components/sort';
import { SearchBar, ToggleSearch } from '@/app/[username]/components/search';
import PinTab from '@/app/[username]/components/pin-tab';
import FolderTab from '@/app/[username]/components/folders/tab-content';
import { CanvasTab } from '@/app/[username]/components/canvas-tab';
import { useProfile, type TabKey } from '@/app/[username]/components/provider';
import { getTabCounts } from '@/utils/tabCount';



export const Container = (
) => {
    const { user } = useProfile();
    const [tab, setTab] = useState<TabKey>('pins');

    const counts = useMemo(() => getTabCounts({
        itemCount: user.itemCount,
        folderCount: user.folderCount,
        canvasCount: user.canvasCount
    }), [user]);

    return (
        <Tabs
            className="profile-tabs"
            defaultValue={tab}
            onValueChange={(value) => setTab(value as TabKey)}>
            <TabsList variant='profile'>
                <TabsTrigger value="pins" variant='profile'>
                    {counts.pins}
                </TabsTrigger>
                <TabsTrigger value="folders" variant='profile'>
                    {counts.folders}
                </TabsTrigger>
                <TabsTrigger value="canvas" variant='profile'>
                    {counts.canvas}
                </TabsTrigger>

                <div className='tab-filter'>
                    {tab === 'pins' && <ToggleSearch />}
                    <Sort tab={tab} />
                </div>
            </TabsList>
            {tab == 'pins' && <SearchBar />}

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