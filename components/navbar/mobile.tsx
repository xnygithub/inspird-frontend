import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export const MobileNavbar = async () => {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null;

    const { data: user } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

    return (
        <div id="mobile-navbar">
            <Link href={`/${user.username}`} className="relative">
                <div className="relative w-12 h-12 overflow-hidden">
                    <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
                </div>
            </Link>
        </div>
    );
};
