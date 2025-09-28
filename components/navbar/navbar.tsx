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
    const { data, error } = await supabase
        .from("profiles").select("*").single();

    if (error) return null;

    return (
        <div id="navbar">
            {data ? (
                <>
                    <Link href="/">INSPIRD</Link>
                    <SearchBar />
                    <div className="flex flex-row items-center gap-2">
                        {data.subscriptionStatus !== "active" && <SubscribeButton user={data} />}
                        <Create />
                        <ModeToggle />
                        <Link href={`/${data.username}`} className="relative">
                            <div className="relative w-8 h-8 overflow-hidden">
                                <Image src={data.avatarUrl} alt="Avatar" fill className="object-cover" />
                            </div>
                        </Link>
                        <Dropdown username={data.username} />
                    </div>
                </>
            ) : (
                <>
                    <Link href="/login"><button>Login</button></Link>
                    <Link href="/login"><button>Signup</button></Link>
                </>
            )}
        </div>
    );
};
