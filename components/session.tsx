"use client"
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useEffect } from "react";

export const Session = () => {

    const [hydrated, setHydrated] = useState(false)
    const [token, setToken] = useState<string>("")
    const supabase = createClient()

    const getSession = async () => {
        const { data } = await supabase.auth.getSession()
        setToken(data.session?.access_token ?? "")
    }
    useEffect(() => {
        setHydrated(true)
        void getSession()
    }, [hydrated, getSession])

    if (!hydrated) return null
    return (
        <>
            <pre>{JSON.stringify(token, null, 2)}</pre>
        </>
    )
}
