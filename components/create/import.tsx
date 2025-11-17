"use client";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Board } from "@/types/import";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";


// TODO: Consider moving this logic to the server side
export const Test = ({
    setCreateOpen,
    createOpen
}: {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}) => {
    const supabase = createClient();
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/pinterest-board`;

    const [username, setUsername] = useState("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Board["boards"][]>([]);

    const importUrl = `https://rg7yqmsst7.execute-api.eu-west-1.amazonaws.com/prod/run`;

    const getAccessToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        if (!accessToken) return null;
        return accessToken;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        setLoading(true);
        const res = await fetch(`${functionUrl}?username=${encodeURIComponent(username)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!res.ok) {
            setError("Error importing Pinterest Board");
            setLoading(false);
            return;
        }
        const data = await res.json();
        setData(data.boards);
        setLoading(false);
    }

    const submitImport = async (board: string, token: string) => {
        const res = await fetch(`${importUrl}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ board_url: board })
        });
        if (!res.ok) {
            toast.error(`Failed to import board`);
            return;
        }
        toast.success("Import job started");
    }

    const handleSelect = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedBoard = formData.get("boardsUrl") as string;
        if (!selectedBoard) {
            return;
        }
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        await submitImport(selectedBoard, accessToken);
    };

    const TotalPinCount = data.reduce((acc, board) => acc + board.pin_count, 0);

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent showCloseButton={false} className="bg-popover rounded-[1.5rem] w-md max-w-md font-sans text-white no-scrollbar">
                <DialogTitle hidden>Import Board</DialogTitle>
                <DialogDescription hidden>Import Board</DialogDescription>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label htmlFor="username" hidden>Username</label>
                    <h1 className="mb-3 font-semibold text-xl text-center">Import Pinterest Board</h1>
                    <Input
                        id="username"
                        required={true}
                        value={username}
                        placeholder="Enter Pinterest Username.."
                        className="px-4 border-0 rounded-full ring-0 focus-visible:ring-0 w-[100%] text-primary text-sm placeholder:text-sm"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button type="submit" disabled={loading} variant="genericRounded" className="mt-2">
                        {loading ? <Loader2Icon className="animate-spin" /> : "Import"}
                    </Button>
                </form>
                <div className="mt-4 max-h-[30vh] overflow-y-auto no-scrollbar">
                    {data.length > 0 && <form onSubmit={handleSelect} className="space-y-1">
                        <h1 className="font-semibold text-primary text-xl text-center">
                            We found {TotalPinCount} pins across {data.length} boards.
                        </h1>
                        {data.map(
                            (board: Board["boards"]) => (
                                <div className="group flex flex-row gap-4 cursor-pointer" key={board.id}>
                                    <label
                                        key={board.id}
                                        htmlFor={board.id}
                                        className="group flex flex-row items-center gap-4 w-full cursor-pointer select-none"
                                    >
                                        <input
                                            type="radio"
                                            id={board.id}
                                            name="boardsUrl"
                                            value={board.url}
                                            className="w-5 h-5" // you can style this
                                        />
                                        <div className="relative w-16 h-16 aspect-square">
                                            <Image
                                                fill
                                                quality={10}
                                                alt={board.name}
                                                src={board.image_cover_hd_url}
                                                className="rounded-xl object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-semibold text-primary">{board.name}</p>
                                            <p className="text-muted-foreground text-sm">{board.pin_count} Pins</p>
                                        </div>
                                    </label>
                                </div>
                            )
                        )}
                        <div className="flex justify-center">
                            <Button type="submit" disabled={loading} variant="genericRounded" className="mt-2">
                                Select
                            </Button>
                        </div>
                    </form>
                    }
                </div>


                {error && <p>{error}</p>}
            </DialogContent>
        </Dialog >
    );
};

export const Import = ({
    setCreateOpen,
    createOpen
}: {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}) => {

    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const submit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsOpen(true);
        }, 1000);
    }

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent
                showCloseButton={false}
                className={cn(isOpen ? "w-xl min-w-xl min-h-80" : "min-h-40", "transition-all duration-700 bg-popover rounded-[1.5rem]  font-sans text-primary")}>
                <DialogTitle hidden>Import Board</DialogTitle>
                <DialogDescription hidden>Import Board</DialogDescription>
                <div className={cn("overflow-hidden")}>
                    <Button
                        disabled={loading}
                        variant="genericRounded"
                        className="mt-2 w-full"
                        onClick={submit}>
                        {loading ? <Loader2Icon className="animate-spin" /> : "Import"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    );
};

