import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import Profile from "../forms/profile"

type View = "Settings" | "Account" | "Subscription" | "Filtering" | "Profile"

const TabList = [
    { label: "Profile", description: "Manage your profile settings" },
    { label: "Account", description: "Manage your account settings" },
    { label: "Filtering", description: "Manage your filtering settings" },
    { label: "Subscription", description: "Manage your subscriptions" },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MobileContainer({ data }: { data: any }) {
    const [view, setView] = useState<View>("Settings")
    const open = (v: Exclude<View, "Settings">) => setView(v)
    return (
        <>
            <DialogHeader className="relative flex justify-center items-center py-6 border-b">
                {view !== "Settings" && (
                    <button
                        type="button"
                        onClick={() => setView("Settings")}
                        aria-label="Go back"
                        className="top-1/2 left-0 absolute ml-5 -translate-y-1/2">
                        <ChevronLeft />
                    </button>
                )}
                <DialogTitle >{view}</DialogTitle>
            </DialogHeader>
            {view === "Settings" && (
                <ul className="space-y-3">
                    {TabList.map((tab) => (
                        <li key={tab.label}>
                            <button
                                type="button"
                                onClick={() => open(tab.label as Exclude<View, "Settings">)}
                                className="p-4 border-b w-full text-left">
                                <div className="font-medium">{tab.label}</div>
                                <div className="text-muted-foreground text-sm">{tab.description}</div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {view === "Profile" && <Profile user={data} />}
            {view === "Account" && <div className="p-4">Account coming soon</div>}
            {view === "Filtering" && <div className="p-4">Filtering coming soon</div>}
            {view === "Subscription" && <div className="p-4">Subscription coming soon</div>}
        </>
    )
}
