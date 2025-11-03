"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type SettingsTab = "profile" | "account" | "filtering" | "subscription";

type SettingsModalContext = {
    open: boolean;
    currentTab: SettingsTab;
    openSettings: (tab?: SettingsTab) => void;
    closeSettings: () => void;
    setCurrentTab: (tab: SettingsTab) => void;
};

const Ctx = createContext<SettingsModalContext | null>(null);

function getHref(tab: SettingsTab) {

    switch (tab) {
        case "account":
            return "/settings/account";
        case "filtering":
            return "/settings/filtering";
        case "subscription":
            return "/settings/subscription";
        default:
            return "/settings/profile";
    }
}

export function SettingsModalProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [currentTab, _setCurrentTab] = useState<SettingsTab>("profile");
    const previousUrlRef = useRef<string | null>(null);

    const pushSettingsUrl = useCallback((tab: SettingsTab) => {
        const href = getHref(tab);
        try {
            window.history.pushState(null, "", href);
        } catch { }
    }, []);

    const replaceSettingsUrl = useCallback((tab: SettingsTab) => {
        const href = getHref(tab);
        try {
            window.history.replaceState(null, "", href);
        } catch { }
    }, []);

    const openSettings = useCallback((tab?: SettingsTab) => {
        if (!open) {
            try {
                previousUrlRef.current =
                    window.location.pathname +
                    window.location.search +
                    window.location.hash;
            } catch {
                previousUrlRef.current = "/";
            }
        }
        const nextTab = tab ?? "profile";
        _setCurrentTab(nextTab);
        setOpen(true);
        pushSettingsUrl(nextTab);
    }, [open, pushSettingsUrl]);

    const closeSettings = useCallback(() => {
        setOpen(false);
        const prev = previousUrlRef.current;
        if (prev) {
            try {
                window.history.replaceState(null, "", prev);
            } catch { }
        }
        try {
            document.cookie = "openSettings=; Max-Age=0; Path=/";
            document.cookie = "openSettingsTab=; Max-Age=0; Path=/";
        } catch { }
        previousUrlRef.current = null;
    }, []);

    const setCurrentTab = useCallback((tab: SettingsTab) => {
        _setCurrentTab(tab);
        replaceSettingsUrl(tab);
    }, [replaceSettingsUrl]);

    const value = useMemo<SettingsModalContext>(() => (
        { open, currentTab, openSettings, closeSettings, setCurrentTab }
    ),
        [open, currentTab, openSettings, closeSettings, setCurrentTab]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettingsModal() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useSettingsModal must be used within SettingsModalProvider");
    return ctx;
}


