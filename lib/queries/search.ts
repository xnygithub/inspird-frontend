import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from '@/database.types';

export const matchPosts = (
    client: SupabaseClient<Database>,
    embedding: number[]
) => {
    return client.rpc('match_posts', {
        // @ts-expect-error: query_embedding as actually a vector
        query_embedding: embedding,
        match_count: 12,
        include_private: false,
    });
}

export const deleteHistoryItem = (
    client: SupabaseClient,
    id: string
) => {
    return client.from('search_history').delete().eq('id', id);
}