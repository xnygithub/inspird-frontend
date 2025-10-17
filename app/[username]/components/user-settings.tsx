"use client"
import React from 'react'
import { useSettingsModal } from '@/app/context/settings-modal'
import { Button } from '@/components/ui/button';

export default function UserSettings() {
    const { openSettings } = useSettingsModal();
    return (
        <Button
            size="lg"
            variant="genericRounded"
            onClick={() => openSettings('filtering')}>
            Settings
        </Button>
    )
}

export const ProfileSettings = () => {
    const { openSettings } = useSettingsModal();
    return (
        <Button
            size="lg"
            variant="genericRounded"
            onClick={() => openSettings('profile')}>
            Edit Profile
        </Button>
    )
}
