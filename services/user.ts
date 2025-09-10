import { createClient } from "@/utils/supabase/server";

export async function getUserProfileByUsername(username: string) {
    const supabase = await createClient();
    // TODO: Filter out private posts from the count
    const currentUser = await supabase.auth.getUser();

    // Get core user data
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (error) return null


    // Count the number of post and saved items
    const { count: postCount, error: postError } = await supabase
        .from("posts")
        .select('*', { count: 'exact', head: true })
        .eq("user_id", data.id)

    const { count: savedItemsCount, error: savedItemsError } = await supabase
        .from("saved_items")
        .select('*', { count: 'exact', head: true })
        .eq("userId", data.id)

    if (postError) throw new Error(postError.message);
    if (savedItemsError) throw new Error(savedItemsError.message);

    data.post_count = postCount;
    data.saved_items_count = savedItemsCount;
    data.is_me = data.auth_sub === currentUser.data.user?.id;
    return data;
}

export async function createUser(user: { email: string; name: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("users")
        .insert(user)
        .single();

    if (error) throw new Error(error.message);
    return data;
}