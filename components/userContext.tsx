"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RawUser } from "@/types/users";
import { createClient } from "@/utils/supabase/client";

type UserContextType = {
    user: RawUser | null;
    setUser: (user: RawUser | null) => void;
    updateUser: (data: Partial<RawUser>) => void;
    refetchUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider(
    { children, initialUser }: { children: ReactNode, initialUser: RawUser | null }
) {
    const [user, setUser] = useState<RawUser | null>(initialUser);

    const updateUser = async (data: Partial<RawUser>) => {
        setUser({ ...user, ...data } as RawUser);
    }

    const refetchUser = async () => {
        if (!user?.id) return
        const supabase = createClient()
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
        setUser(data)
    }

    return (
        <UserContext.Provider value={{ user, setUser, updateUser, refetchUser }}>
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
