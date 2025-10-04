"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Profile from "../forms/profile";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import { useCallback } from "react";
import { SettingsTab, useSettingsModal } from "@/app/context/settings-modal";

const TABS = [
    "profile",
    "account",
    "filtering",
    "subscription",
];

const getTab = (slug: string) => {
    const tab = TABS.find((tab) => tab === slug);
    if (!tab) return "profile";
    return tab as SettingsTab;
}
export default function DesktopContainer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { data }: { data: any }
) {
    const { currentTab, setCurrentTab } = useSettingsModal();
    const onTabChange = useCallback((next: string) => {
        if (next === currentTab) return;
        setCurrentTab(getTab(next));
    }, [currentTab, setCurrentTab]);

    return (
        <>
            <DialogHeader hidden>
                <DialogTitle hidden>Settings</DialogTitle>
            </DialogHeader>

            <Tabs value={currentTab} onValueChange={onTabChange} className="flex flex-row">
                <div className="flex flex-col justify-between">
                    <TabsList className="flex flex-col min-w-[175px] h-fit">
                        {TABS.map((tab) => (
                            <TabsTrigger key={tab} value={tab} className="flex flex-col">
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <Button variant="outline" onClick={signOut}>Logout</Button>
                </div>

                <TabsContent value="profile">
                    <Profile user={data} />
                </TabsContent>
                <TabsContent value="account">
                    <div className="bg-amber-100/10 h-full">Account</div>
                </TabsContent>
                <TabsContent value="filtering">
                    <div className="bg-amber-100/10 h-full">Filtering</div>
                </TabsContent>
                <TabsContent value="subscription">
                    <div className="bg-amber-100/10 h-full">Subscription</div>
                </TabsContent>
            </Tabs >
        </>
    );
}
