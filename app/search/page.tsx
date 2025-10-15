import { embedText } from "@/lib/api/hf";
import { Database } from "@/database.types";
import { matchPosts } from "@/lib/queries/search";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import MasonryComponent from "@/app/search/components/masonry";

interface Props {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// TODO: Add pagination 
//    a. Figure out how to handle embedding client side
//    b. Perhaps cache embeddings server side for a given q
// TODO: Handle errors all errors (check actual hf json ok code)
// TODO: Validate q

const supabase = await createClient();

async function storeQuery(
    client: SupabaseClient<Database>, userId: string, query: string
) {
    const { error } = await client.from('search_history')
        .insert({ query })
    if (error) {
        console.error(error.message)
    }
}


export default async function SearchPage(
    { searchParams }: Props
) {
    const sp = await searchParams;
    const q = sp?.q;

    const res = await embedText(q as string);

    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
        void storeQuery(supabase, user.user.id, q as string)
            .catch(console.error);
    }

    if (!res.ok) {
        console.error(res.statusText)
        return <div> An error occurred</div>
    }

    const { embedding } = await res.json()
    const { data, error } = await matchPosts(supabase, embedding);

    if (error) {
        console.error(error.message)
        return <div> An error occurred</div>
    }


    return (
        <div className="mt-8">
            <h1 className="opacity-80 px-4 font-semibold text-xl">Results for {q}...</h1>
            <div className="mt-4 px-4">
                {data && <MasonryComponent data={data} />}
            </div>
        </div>
    );
}