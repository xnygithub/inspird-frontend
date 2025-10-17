"use client"
import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Recent from "@/components/search/recent";
import { useUserContext } from "../userContext";

export const SearchBar: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const anchorRef = React.useRef<HTMLDivElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const { history } = useUserContext();


    React.useEffect(() => {
        if (open) {
            const { overflow } = document.body.style;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = overflow;
            };
        }
    }, [open]);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = (formData.get('q') as string).trim();
        if (!q) return;
        router.push(`/search?${new URLSearchParams({ q }).toString()}`);
    }

    return (
        <>
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
                        <form
                            onSubmit={onSubmit}
                            role="search"
                            className="w-full">
                            <Input
                                name="q"
                                type="search"
                                autoComplete="off"
                                placeholder="Search"
                                id="navbar-search-input"
                                className="border-none rounded-2xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0 font-sanspx-6 text-white placeholder:text-white transition-all duration-500"
                                ref={inputRef}
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
                            />
                        </form>
                    </div>
                </Popover.Anchor>

                <Popover.Content
                    align="start"
                    sideOffset={5}
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
                    className="z-50 bg-background p-0 border-r border-b border-l rounded-2xl overflow-hidden"
                >
                    <div className="h-72 overflow-auto no-scrollbar">
                        {query ? (
                            <>
                                <div className="opacity-60 px-3 pt-4 text-xs uppercase tracking-wide">Suggestions for “{query}”</div>
                                <ul className="p-2">
                                    <li className="hover:bg-accent px-3 py-2 rounded-md cursor-pointer" onClick={() => setQuery("last search 1")}>last search 1</li>
                                    <li className="hover:bg-accent px-3 py-2 rounded-md cursor-pointer" onClick={() => setQuery("last search 2")}>last search 2</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                {history && history.length > 0 && (
                                    <>
                                        <div className="opacity-60 px-3 pt-4 font-sans text-sm uppercase tracking-wide">Recent</div>
                                        <ul className="flex flex-row items-start gap-2.5 p-2 pl-3 max-h-1/4 overflow-x-hidden">
                                            {history.map((item) => (<Recent key={item.id} query={item} setQuery={setQuery} />))}
                                        </ul>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </Popover.Content>
            </Popover.Root>
        </>
    );
};
