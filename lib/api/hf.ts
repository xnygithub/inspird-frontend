import "server-only";
import { unstable_cache } from "next/cache";

export const embedTextCached = unstable_cache(
    /**
      Embeds text using the Hugging Face API and caches the result.
      @param query - The text to embed.
      @returns The embedding as a number array or null if the request fails
    */

    async (query: string) => {
        const res = await fetch(process.env.NEXT_PUBLIC_HF_ENDPOINT!, {
            // Shareable data cache:
            next: {
                revalidate: 600,
                tags: [`embedText:${query}`]
            },
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN!}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: { text: query } })
        });
        if (!res.ok) return null
        const { embedding } = await res.json();
        if (!embedding) return null
        return embedding;
    },
    // Static portion of the cache key for this function
    // (function args also affect the key)
    [`embedTextCached`],
    { revalidate: 60 }
);