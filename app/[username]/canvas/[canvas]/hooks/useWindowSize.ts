"use client";
import { useEffect, useState } from "react";


export function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const apply = () =>
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        apply();
        window.addEventListener("resize", apply);
        return () => window.removeEventListener("resize", apply);
    }, []);
    return size;
}