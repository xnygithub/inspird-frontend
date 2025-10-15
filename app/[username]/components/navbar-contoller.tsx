"use client"
import { useEffect } from "react";

export default function NavTransparencyController(
    { showBanner }: { showBanner: boolean }
) {

    useEffect(() => {
        const nav = document.getElementById("navbar");
        const searchBar = document.getElementById("navbar-search-input");
        if (!nav || !showBanner || !searchBar) return;

        const handleScroll = () => {
            const isAtTop = window.scrollY <= 0;
            nav.classList.toggle("nav-transparent", isAtTop);
            nav.classList.toggle("nav-default", !isAtTop);
            searchBar.classList.toggle("search-bar-transparent", isAtTop);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            nav.classList.remove("nav-transparent");
            nav.classList.add("nav-default");
            searchBar.classList.remove("search-bar-transparent");
        };
    }, [showBanner]);

    return null;
}