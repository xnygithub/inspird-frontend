import Link from "next/link";
import Image from "next/image";
import { Create } from "@/components/create/dropdown";
import { createClient } from "@/utils/supabase/server";
import { Dropdown } from "@/components/navbar/dropdown";
import { getProfileCached } from "@/lib/queries/profile";
import { SearchBar } from "@/components/search/search-bar";
import SubscribeButton from "@/components/subscribe-button";
import { ModeToggle } from "@/components/navbar/theme-toggle";


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
                        <ModeToggle />
                        <Link href={`/${res.username}`} className="relative">
                            <div className="relative w-8 h-8 overflow-hidden">
                                <Image
                                    src={res.avatarUrl}
                                    alt="Avatar"
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </Link>
                        <Dropdown username={res.username} />
                    </div>
                </>
            ) : (
                <div className="flex flex-row justify-end items-center gap-2 w-full">
                    <Link href="/login"><button>Login</button></Link>
                    <Link href="/login"><button>Signup</button></Link>
                </div>
            )}
        </div>
    );
};
