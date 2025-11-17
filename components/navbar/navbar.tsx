import Link from "next/link";
import { Avatar } from "@/components/navbar/profile";
import { Create } from "@/components/create/dropdown";
import { Dropdown } from "@/components/navbar/dropdown";
import { SearchBar } from "@/components/search/search-bar";
import { SubscribeButton } from "@/components/subscribe-button";
import { MenuSheet } from "@/components/navbar/anon-nav";
import { createClient } from "@/utils/supabase/server";


export const Navbar = async () => {

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    return (
        <div id="navbar" className="nav-default">
            <Link href="/" className="font-sans text-lg tracking-tight scale-y-95">
                INSPIRD
            </Link>
            <SearchBar />
            {data.user ? (
                <div className="flex flex-row items-center gap-2">
                    <SubscribeButton />
                    <Create />
                    <Avatar />
                    <Dropdown />
                </div>
            ) : (
                <div className="flex flex-row justify-end items-center gap-4 w-full font-sans font-medium text-sm">
                    <Link href="/login">
                        Login
                    </Link>
                    <Link href="/signup" className="bg-primary hover:brightness-85 px-4 py-1.5 rounded-full text-primary-foreground transition-all duration-200">
                        Signup
                    </Link>
                    <MenuSheet />
                </div>
            )}
        </div>
    );
};
