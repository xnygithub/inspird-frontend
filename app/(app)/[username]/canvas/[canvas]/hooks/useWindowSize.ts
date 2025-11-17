"use client";
import { useEffect, useState } from "react";

export function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        const apply = () =>
            setSize({
                width: window.innerWidth,
                height: window.innerHeight - 64
            });
        apply();
        window.addEventListener("resize", apply);
        return () => window.removeEventListener("resize", apply);
    }, [hydrated]);

    return size;
}