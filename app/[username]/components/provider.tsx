"use client";
import { UserProfile } from "@/types/users";
import { createContext, useContext, useState } from "react";
interface ProviderProps {
    user: UserProfile;
    isMe: boolean;
    children: React.ReactNode;
}

const Ctx = createContext<ProviderContext | undefined>(undefined);

interface ProviderContext {
    user: UserProfile;
    isMe: boolean;
    sort: SortState;
    handleSort: (tab: TabKey, value: 'latest' | 'oldest') => void;
}

export type TabKey = 'pins' | 'folders' | 'canvas';
export type SortValue = 'latest' | 'oldest';
export type SortState = Record<TabKey, SortValue>;

export const ProfileProvider = (
    { user, isMe, children }: ProviderProps) => {
    const [sort, setSort] = useState<SortState>({
        pins: 'latest',
        folders: 'oldest',
        canvas: 'latest',
    });

    const handleSort = (tab: TabKey, value: 'latest' | 'oldest') => {
        setSort((prev: SortState) => ({ ...prev, [tab]: value }));
    };



    return <>
        <Ctx.Provider
            value={{ user, isMe, sort, handleSort }}>
            {children}
        </Ctx.Provider>
    </>;
}

export function useProfile() {
    const context = useContext(Ctx);
    if (!context) throw new Error("useProfile must be used within ProfileProvider");
    return context;
}