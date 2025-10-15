"use client";
import { useEffect, useRef } from "react";
import { SettingsTab, useSettingsModal } from "./context/settings-modal";


export default function SettingsBootstrap(
    { shouldOpen, initialTab }: { shouldOpen: boolean; initialTab?: SettingsTab }
) {
    const { openSettings } = useSettingsModal();
    const bootstrappedRef = useRef(false);

    useEffect(() => {
        if (!shouldOpen) return;
        if (bootstrappedRef.current) return;
        bootstrappedRef.current = true;
        try {
            document.cookie = "openSettings=; Max-Age=0; Path=/";
            document.cookie = "openSettingsTab=; Max-Age=0; Path=/";
        } catch { }
        openSettings(initialTab);
    }, [shouldOpen, initialTab, openSettings]);

    return null;
}
