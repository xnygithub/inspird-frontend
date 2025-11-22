'use client';
import { SWRConfig } from 'swr';

export default function SWRProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <SWRConfig
            value={{
                revalidateIfStale: false,
                revalidateOnFocus: false,
                revalidateOnReconnect: false,
                dedupingInterval: 5000
            }}>
            {children}
        </SWRConfig>
    );
}
