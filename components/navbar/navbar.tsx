import Link from "next/link";
import Image from "next/image";
import { Dropdown } from "@/components/navbar/dropdown";
import { createClient } from "@/utils/supabase/server";
import { ModeToggle } from "@/components/navbar/theme-toggle";
import { SearchBar } from "@/components/search/search-bar";
import { Create } from "@/components/create/dropdown";
import SubscribeButton from "@/components/subscribe-button";

export const Navbar = async () => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()


    let res = null
    if (data.user !== null) {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .single();
        res = data
    }

    return (
        <div id="navbar">
            {data.user !== null ? (
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
