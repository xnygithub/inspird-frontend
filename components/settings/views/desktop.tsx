import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Profile from "../forms/profile"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/login/actions"

const TabList = [
    { label: "Profile" },
    { label: "Account" },
    { label: "Filtering" },
    { label: "Subscription" }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DesktopContainer({ data }: { data: any }) {
    return (
        <>
            <DialogHeader hidden>
                <DialogTitle hidden>Settings</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="Profile" className="flex flex-row">
                <div className="flex flex-col justify-between">
                    <TabsList className="flex flex-col min-w-[175px] h-fit">
                        {TabList.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.label} className="flex flex-col">
                                <div className="font-medium">{tab.label}</div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <Button variant="outline" onClick={signOut}>Logout</Button>
                </div>
                <TabsContent value="Profile" >
                    <Profile user={data} />
                </TabsContent>
                <TabsContent value="Account">
                    <div className="bg-amber-100/10 h-full">Account</div>
                </TabsContent>
                <TabsContent value="Filtering">
                    <div className="bg-amber-100/10 h-full">Filtering</div>
                </TabsContent>
                <TabsContent value="Subscription">
                    <div className="bg-amber-100/10 h-full">Subscription</div>
                </TabsContent>
            </Tabs>
        </ >
    )
}
