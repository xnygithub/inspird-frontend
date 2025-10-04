"use client"
import React from 'react'
import { useSettingsModal } from '@/app/context/settings-modal'
import { Button } from '@/components/ui/button';

export default function UserSettings() {
    const { openSettings } = useSettingsModal();
    return (
        <div className="space-x-2">
            <Button onClick={() => openSettings()}>Profile</Button>
            <Button onClick={() => openSettings("account")}>Account</Button>
        </div>
    )
}
