import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export const MobileNavbar = async () => {
    const supabase = await createClient()
    const { data } = await supabase
        .from("profiles")
        .select("username, avatarUrl")
        .single();

    if (!data) return null;

    return (
        <div id="mobile-navbar">
            <Link href={`/${data.username}`} className="relative">
                <div className="relative w-12 h-12 overflow-hidden">
                    <Image
                        fill
                        alt="Avatar"
                        src={data.avatarUrl}
                        className="object-cover" />
                </div>
            </Link>
        </div>
    );
};
