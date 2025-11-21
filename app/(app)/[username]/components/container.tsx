'use client'
import React, { useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sort } from '@/app/(app)/[username]/components/sort';
import { SearchBar, ToggleSearch } from '@/app/(app)/[username]/components/search';
import PinTab from '@/app/(app)/[username]/components/tab-pin';
import FolderTab from '@/app/(app)/[username]/components/tab-folder';
import { CanvasTab } from '@/app/(app)/[username]/components/tab-canvas';
import { useProfile, type TabKey } from '@/app/(app)/[username]/components/provider';

function Container() {
    const { user } = useProfile();
    const [tab, setTab] = useState<TabKey>('pins');

    const counts = useMemo(() => getTabCounts({
        itemCount: user.itemCount,
        folderCount: user.folderCount,
        canvasCount: user.canvasCount
    }), [user]);


    return (
        <Tabs
            className="mx-[1rem] mt-12"
            defaultValue={tab}
            onValueChange={(value) => setTab(value as TabKey)}>
            <TabsList variant='profile' >
                <TabsTrigger value="pins" variant='profile'>
                    {counts.pins}
                </TabsTrigger>
                <TabsTrigger value="folders" variant='profile'>
                    {counts.folders}
                </TabsTrigger>
                <TabsTrigger value="canvas" variant='profile'>
                    {counts.canvas}
                </TabsTrigger>

                <div className='top-0 right-0 absolute flex flex-row gap-2 mr-8 max-md:mr-4 transition-all duration-300'>
                    {tab === 'pins' && <ToggleSearch />}
                    <Sort tab={tab} />
                </div>
            </TabsList>
            {tab == 'pins' && <SearchBar />}

            <TabsContent value="pins"><PinTab /></TabsContent>
            <TabsContent value="folders" ><FolderTab /></TabsContent>
            <TabsContent value="canvas" ><CanvasTab /></TabsContent>
        </Tabs>
    )
}

function getTabCount(
    count: number,
    text: string
) {
    return count + " " + (count === 1 ? text : text + "s")
}

function getTabCounts(
    counts: {
        itemCount: number,
        folderCount: number,
        canvasCount: number
    }
) {
    return {
        pins: getTabCount(counts.itemCount, "Pin"),
        folders: getTabCount(counts.folderCount, "Folder"),
        canvas: getTabCount(counts.canvasCount, "Canvas")
    }
}

export default Container