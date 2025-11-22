import { notFound } from "next/navigation";
import { storeQuery } from "@/lib/queries/search";
import { createClient } from "@/utils/supabase/server";
import { Container } from "@/app/(app)/search/components/container";

interface Props {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage(
    { searchParams }: Props
) {
    const sp = await searchParams;
    const q = sp?.q as string;
    const supabase = await createClient();

    if (!q) {
        return notFound()
    }

    const { data } = await supabase.auth.getUser();
    if (data?.user) void storeQuery(supabase, q);

    return (
        <div className="padding-top px-4 font-sans">
            <h1 className="mt-10 mb-4 font-semibold text-primary text-3xl">Results for {q}...</h1>
            <Container query={q} />
        </div>
    );
}