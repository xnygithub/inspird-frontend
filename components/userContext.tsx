"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UserObject } from "@/types/users";
import { createClient } from "@/utils/supabase/client";

type UserContextType = {
    user: UserObject | null;
    history: { id: string, query: string }[] | null;
    setUser: (user: UserObject | null) => void;
    setHistory: (history: { id: string, query: string }[] | null) => void;
    updateUser: (data: Partial<UserObject>) => void;
    refetchUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
    user: UserObject | null;
    history: { id: string, query: string }[] | null;
}

export function UserProvider(
    { children, user, history }: UserProviderProps
) {
    const [userState, setUserState] = useState<UserObject | null>(user);
    const [historyState, setHistoryState] = useState<{ id: string, query: string }[] | null>(history);

    const updateUser = (data: Partial<UserObject>) => {
        setUserState((prev) => ({ ...prev, ...data }) as UserObject);
    }

    const refetchUser = async () => {
        if (!user?.id) return
        const supabase = createClient()
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
        if (data) setUserState(data);
    }

    return (
        <UserContext.Provider value={{
            user: userState,
            history: historyState,
            setUser: setUserState,
            setHistory: setHistoryState,
            updateUser,
            refetchUser,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within an UserProvider");
    }
    return context;
}
