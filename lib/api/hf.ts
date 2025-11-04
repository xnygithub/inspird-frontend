export const embedText = (
    q: string
) => fetch(process.env.NEXT_PUBLIC_HF_ENDPOINT!,
    {
        next: { revalidate: 600 },
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN!}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: { text: q } })
    })