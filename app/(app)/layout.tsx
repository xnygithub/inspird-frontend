import { UserObject, UserSearchHistory } from "@/types/users";
import { Database } from "@/database.types";
import { Navbar } from "@/components/navbar/navbar";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { UserProvider } from "@/components/userContext";
import { MobileNavbar } from "@/components/navbar/mobile-nav";

async function getUser(
    client: SupabaseClient<Database>,
    user: User | null
) {
    if (!user) return null;
    const { data } = await client
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
    return data ?? null;
}

async function getHistory(
    client: SupabaseClient<Database>,
    user: User | null
) {
    if (!user) return null;
    const { data } = await client
        .from("search_history")
        .select("*")
        .eq("userId", user.id);
    return data ?? [];
}

export default async function AppLayout({
    children
}: {
    children: React.ReactNode
}) {

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    let user: UserObject | null = null;
    let history: UserSearchHistory[] | null = null;

    if (data.user) {
        user = await getUser(supabase, data.user);
        history = await getHistory(supabase, data.user);
    }

    return (
        <>
            <UserProvider user={user} history={history}>
                <Navbar />
                {children}
                <MobileNavbar />
            </UserProvider>
        </>
    );
}
