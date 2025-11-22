"use client"
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useUserContext } from "../userContext";
import { Search, X } from "lucide-react";
import { useNavbarStore } from "@/components/navbar/store";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";


import { useRef, useCallback, useEffect, useState } from "react";


//eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebouncedCallback<T extends any[]>(
    // AI Gen
    cb: (...args: T) => void,
    delay: number
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const fn = useCallback(
        (...args: T) => {
            cancel();
            timeoutRef.current = setTimeout(() => cb(...args), delay);
        },
        [cb, delay, cancel]
    );

    // clear timeout on unmount
    useEffect(() => cancel, [cancel]);

    return { run: fn, cancel };
}

export const SearchBar: React.FC = (
) => {
    const router = useRouter();
    const { history } = useUserContext();

    const [query, setQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const anchorRef = useRef<HTMLDivElement | null>(null);

    const open = useNavbarStore((state) => state.open);
    const setOpen = useNavbarStore((state) => state.setOpen);

    const {
        run: markStoppedTyping,
        cancel: cancelStopTimer // eslint-disable-line @typescript-eslint/no-unused-vars
    } = useDebouncedCallback(() => setIsTyping(false), 1000);

    useEffect(() => {
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


    useEffect(() => {
        const searchBar = document.getElementById("search-container");
        if (searchBar) searchBar.classList.add("search-default");

    }, []);

    return (
        <>
            {/* {typeof window !== "undefined" &&
                createPortal(
                    <div
                        className={cn(
                            "z-10 fixed inset-0 bg-black/50 transition-opacity",
                            open
                                ? "opacity-100 visible pointer-events-auto"
                                : "opacity-0 invisible pointer-events-none"
                        )}
                        onClick={() => setOpen(false)}
                    />,
                    document.body
                )} */}

            <Popover.Root open={open} onOpenChange={setOpen}>
                {/* Anchor defines the sizing variable used below */}
                <Popover.Anchor asChild >
                    <div
                        ref={anchorRef}
                        id="search-container"
                        onFocus={() => setOpen(true)}
                        className={`
                            z-10 relative transition-all duration-500 rounded-xl search-default
                            ${open ? "rounded-b-none border-t border-l border-r border-b" : ""}
                            ${open ? "xl:w-[700px] lg:w-[450px] w-[450px] " : "lg:w-[400px] w-[300px]"}`}
                    >
                        <form onSubmit={onSubmit} className="w-full">
                            <SearchBarInput
                                query={query}
                                inputRef={inputRef}
                                open={open}
                                setOpen={setOpen}
                                setQuery={setQuery}
                                markStoppedTyping={markStoppedTyping}
                                setIsTyping={setIsTyping}
                            />
                        </form>
                    </div>
                </Popover.Anchor>

                <Popover.Content
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
                    className="z-10 bg-navbar-popover p-0 border-r border-b border-l rounded-b-xl overflow-hidden"
                >
                    <div className="pt-4 h-72 overflow-auto font-sans no-scrollbar">
                        {query ? (
                            <>
                                <div className="px-3 w-4/5 text-muted-foreground text-xs truncate uppercase">Suggestions for “{query}”</div>
                                <ul className="p-1 text-primary">
                                    {isTyping ? (
                                        <>
                                            <SkeletonSearch />
                                            <SkeletonSearch />
                                        </>
                                    ) : (
                                        <>
                                            <RecentSearch query="last search 1" setQuery={setQuery} />
                                            <RecentSearch query="last search 2" setQuery={setQuery} />
                                        </>
                                    )}
                                </ul>
                            </>
                        ) : (
                            <HistoryItem history={history} setQuery={setQuery} />
                        )}
                    </div>
                </Popover.Content>
            </Popover.Root>

        </>
    );
};

const SkeletonSearch = () => {
    return (
        <div className="flex flex-row items-center space-x-2.5 px-1.5 py-1 w-full">
            <Skeleton className="flex-shrink-0 rounded-full w-8 h-8" />
            <Skeleton className="rounded-full w-full h-6" />
        </div>
    )
}

const HistoryItem = ({
    history,
    setQuery
}: {
    history: { id: string, query: string }[] | null;
    setQuery: (query: string) => void;
}) => {
    return (
        <>
            {history && history.length > 0 ? (
                <>
                    <div className="px-3.5 text-muted-foreground text-xs uppercase">Recent</div>
                    <ul className="px-1 text-primary">
                        {history.map((item) => (
                            <SearchHistory
                                key={item.id}
                                item={item}
                                setQuery={setQuery}
                            />
                        )
                        )}
                    </ul>
                </>
            ) : null}
        </>
    );
}

const SearchBarInput = ({
    query,
    inputRef,
    open,
    setOpen,
    setQuery,
    markStoppedTyping,
    setIsTyping
}: {
    query: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    open: boolean;
    setOpen: (open: boolean) => void;
    setQuery: (query: string) => void;
    markStoppedTyping: () => void;
    setIsTyping: (isTyping: boolean) => void;
}) => {
    return (

        <div className="flex items-center pl-4 w-full">
            <Search size={16} />
            <Input
                name="q"
                value={query}
                ref={inputRef}
                type="search"
                role="combobox"
                autoComplete="off"
                aria-expanded={open}
                aria-autocomplete="list"
                placeholder="Search your next inspiration"
                className={cn(
                    "dark:bg-transparent transition-all duration-300",
                    "px-4 h-12 border-none rounded-xl outline-none text-primary",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-muted-foreground placeholder:font-medium placeholder:font-sans")}
                onChange={(e) => {
                    if (!open) setOpen(true);
                    setQuery(e.target.value);
                    setIsTyping(true);
                    markStoppedTyping();
                }}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setOpen(false);
                        inputRef.current?.blur();
                    }
                }}
            />
        </div>
    )

}

const SearchHistory = ({
    item,
    setQuery
}: {
    item: { id: string, query: string };
    setQuery: (query: string) => void;
}
) => {
    return (
        <li onClick={() => setQuery(item.query)}
            className="flex flex-row justify-between items-center [&:has(>span:hover)]:bg-accent px-2.5 py-1 cursor-pointer">
            <span className="w-full">{item.query}</span>
            <Button variant="icon" className="hover:bg-accent py-0 cursor-pointer">
                <X className="w-4 h-4" />
            </Button>
        </li>
    )
}

const RecentSearch = ({
    query,
    setQuery
}: {
    query: string;
    setQuery: (query: string) => void;
}
) => {
    return (
        <li className="hover:bg-accent px-2 py-2 cursor-pointer" onClick={() => setQuery(query)}>{query}</li>
    )
}