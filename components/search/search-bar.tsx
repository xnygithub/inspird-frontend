"use client";
import { useState } from "react";

export const SearchBar = () => {
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    return (
        <>
            <div
                id="search-container"
                className={`${isSearchDropdownOpen ? 'w-[500px]' : 'w-[300px]'}`}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsSearchDropdownOpen(false);
                    }
                }}
                tabIndex={-1}
            >
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setSearchQuery("")}>Search</button>
                {isSearchDropdownOpen && (
                    <div id="search-dropdown">
                        <p>{searchQuery}</p>
                    </div>
                )}
            </div>

        </>
    );
};


