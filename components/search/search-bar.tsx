"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <>
            <div
                id="search-container"
                className={` ${isSearchDropdownOpen ? 'w-[475px]' : 'w-[300px]'}`}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsSearchDropdownOpen(false); }}
                tabIndex={-1}
            >
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isSearchDropdownOpen && (
                    <div id="search-dropdown">
                        <p>{searchQuery}</p>
                    </div>
                )}
            </div>

        </>
    );
};


