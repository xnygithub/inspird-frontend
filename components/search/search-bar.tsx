"use client"
import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";

export const SearchBar: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
        if (open) {
            const { overflow } = document.body.style;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = overflow;
            };
        }
    }, [open]);

    return (
        <>
            {/* Overlay (dim background) */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-500 z-40 ${open ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                style={{ pointerEvents: open ? "auto" : "none" }}
                onClick={() => setOpen(false)}
            />

            <Popover.Root open={open} onOpenChange={setOpen}>
                {/* Anchor defines the sizing variable used below */}
                <Popover.Anchor asChild className="z-50">
                    <div
                        id="search-container"
                        ref={anchorRef}
                        className={`relative flex transition-[width] duration-500 ease-in-out ${open ? "w-[475px]" : "w-[300px]"
                            }`}
                        // keep the input in focus to keep the panel open
                        onFocus={() => setOpen(true)}
                    >
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Search"
                            value={query}
                            onChange={(e) => {
                                if (!open) setOpen(true);
                                setQuery(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setOpen(false);
                                    inputRef.current?.blur();
                                }
                            }}
                            aria-autocomplete="list"
                            aria-expanded={open}
                            role="combobox"
                            className="focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                </Popover.Anchor>

                <Popover.Content
                    align="start"
                    sideOffset={0}
                    // Keep focus on the input:
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    // Don't close when interacting with the anchor (the input):
                    onInteractOutside={(e) => {
                        const target = e.target as Node;
                        if (anchorRef.current?.contains(target)) e.preventDefault();
                    }}
                    // Match the anchor width
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                    className="z-50 bg-background p-0 border-r border-b border-l overflow-hidden"
                >
                    <div className="h-72 overflow-auto no-scrollbar">
                        {query ? (
                            <>
                                <div className="opacity-60 px-3 pt-2 text-xs uppercase tracking-wide">Suggestions for “{query}”</div>
                                <ul className="p-2">
                                    <li className="hover:bg-accent px-3 py-2 rounded-md cursor-pointer" onClick={() => setQuery("last search 1")}>last search 1</li>
                                    <li className="hover:bg-accent px-3 py-2 rounded-md cursor-pointer" onClick={() => setQuery("last search 2")}>last search 2</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <div className="opacity-60 px-3 pt-2 text-xs uppercase tracking-wide">Recent</div>
                                <ul className="p-2">
                                    <li className="hover:bg-accent px-3 py-2 rounded-md cursor-pointer" onClick={() => setQuery("last search 1")}>last search 1</li>
                                    <li className="hover:bg-accent px-3 py-2 rounded-md cursor-pointer" onClick={() => setQuery("last search 2")}>last search 2</li>
                                </ul>
                            </>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Root>
        </>
    );
};
