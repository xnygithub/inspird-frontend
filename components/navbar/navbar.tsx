import Link from "next/link";
import Image from "next/image";
import { Dropdown } from "@/components/navbar/dropdown";
import { createClient } from "@/utils/supabase/server";
import { ModeToggle } from "@/components/navbar/theme-toggle";
import { SearchBar } from "@/components/search/search-bar";
import { UploadImage } from "@/components/navbar/upload";
import { CreateFolder } from "@/components/navbar/create-folder";

export const Navbar = async () => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    return (
        <div id="navbar">
            {data.user !== null ? (
                <>
                    <p>INSPIRD</p>
                    <SearchBar />
                    <div className="flex flex-row items-center gap-2">
                        <UploadImage />
                        <CreateFolder />
                        <ModeToggle />
                        <Link href={`/${data.user?.user_metadata.username}`} className="relative">
                            <div className="relative w-8 h-8 overflow-hidden">
                                <Image src={data.user?.user_metadata.avatarURL} alt="Avatar" fill className="object-cover" />
                            </div>
                        </Link>
                        <Dropdown user={data.user} />
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
