"use client"
import { useEffect } from "react";

export default function NavTransparencyController(
    { showBanner }: { showBanner: boolean }
) {
    useEffect(() => {
        const nav = document.getElementById("navbar");
        const search = document.getElementById("search-container");
        if (!nav || !showBanner || !search) return;

        const handleScroll = () => {
            const isAtTop = window.scrollY <= 0;
            nav.classList.toggle("nav-transparent", isAtTop);
            nav.classList.toggle("nav-default", !isAtTop);

            search.classList.toggle("search-bar-transparent", isAtTop);
            search.classList.toggle("search-bar-default", !isAtTop);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            nav.classList.remove("nav-transparent");
            nav.classList.add("nav-default");

            search.classList.remove("search-bar-default");
            search.classList.remove("search-bar-transparent");
        };
    }, [showBanner]);

    return null;
}