import Link from "next/link";
import { Avatar } from "@/components/navbar/profile";
import { Create } from "@/components/create/dropdown";
import { createClient } from "@/utils/supabase/server";
import { Dropdown } from "@/components/navbar/dropdown";
import { getProfileCached } from "@/lib/queries/profile";
import { SearchBar } from "@/components/search/search-bar";
import SubscribeButton from "@/components/subscribe-button";
import { Button } from "@/components/ui/button";

export const Navbar = async () => {
    const supabase = await createClient()
    const { data: currentUser } = await supabase.auth.getUser()

    let res = null
    if (currentUser.user !== null) {
        const id = currentUser.user.id
        res = await getProfileCached(id)
    }

    return (
        <div id="navbar">
            {currentUser.user !== null ? (
                <>
                    <Link href="/">INSPIRD</Link>
                    <SearchBar />
                    <div className="flex flex-row items-center gap-2">
                        {res.subscriptionStatus !== "active" && <SubscribeButton user={res} />}
                        <Create />
                        <Avatar res={res} />
                        <Dropdown username={res.username} />
                    </div>
                </>
            ) : (
                <div className="flex flex-row justify-end items-center gap-2 w-full">
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Signup</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};
