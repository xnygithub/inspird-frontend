import Link from "next/link";
import Image from "next/image";
import { Dropdown } from "@/components/navbar/dropdown";
import { createClient } from "@/utils/supabase/server";
import { ModeToggle } from "@/components/navbar/theme-toggle";
import { SearchBar } from "@/components/search/search-bar";
import { UploadImage } from "@/components/navbar/upload";
import { CreateFolder } from "@/components/navbar/create-folder";
import SubscribeButton from "@/components/subscribe-button";

export const Navbar = async () => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null;

    const { data: user } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

    return (
        <div id="navbar">
            {data.user !== null ? (
                <>
                    <p>INSPIRD</p>
                    <SearchBar />
                    <div className="flex flex-row items-center gap-2">
                        {user.subscriptionStatus !== "active" && <SubscribeButton user={user} />}
                        <UploadImage />
                        <CreateFolder />
                        <ModeToggle />
                        <Link href={`/${user.username}`} className="relative">
                            <div className="relative w-8 h-8 overflow-hidden">
                                <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
                            </div>
                        </Link>
                        <Dropdown user={user} />
                    </div>
                </>
            ) : (
                <>
                    <Link href="/login"> <button>Login</button></Link>
                    <Link href="/login"><button>Signup</button></Link>
                </>
            )}
        </div>
    );
};
