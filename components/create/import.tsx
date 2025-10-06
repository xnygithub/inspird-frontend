"use client";
import Image from "next/image";
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

interface Props {
    setCreateOpen: (open: boolean) => void;
    createOpen: boolean;
}


export const Import = ({ setCreateOpen, createOpen }: Props) => {
    const supabase = createClient();
    const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/pinterest-board`;

    const [username, setUsername] = useState("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Board["boards"][]>([]);

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

    const handleSelect = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const selectedBoards = formData.getAll("boards");
        console.log("Boards:", selectedBoards);
    };

    const TotalPinCount = data.reduce((acc, board) => acc + board.pin_count, 0);

    return (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="[&>button]:hidden flex-wrap bg-black max-h-[70vh] overflow-y-auto text-white">
                <DialogTitle hidden>Import Board</DialogTitle>
                <DialogDescription hidden>Import Board</DialogDescription>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <label htmlFor="username" hidden>Username</label>
                    <Input
                        id="username"
                        required={true}
                        value={username}
                        placeholder="Enter Pinterest Username.."
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Loading..." : "Import"}
                    </Button>
                </form>
                {data.length > 0 &&
                    <h1 className="font-semibold text-white/90 text-xl text-center">
                        We found {TotalPinCount} pins across {data.length} boards.
                    </h1>
                }
                {data.length > 0 && <form onSubmit={handleSelect} className="space-y-1">
                    {data.map(
                        (board: Board["boards"]) => (
                            <div className="group flex flex-row gap-4 cursor-pointer" key={board.id}>
                                <label
                                    key={board.id}
                                    htmlFor={board.id}
                                    className="group flex flex-row items-center gap-4 w-full cursor-pointer select-none"
                                >
                                    <input
                                        type="checkbox"
                                        id={board.id}
                                        name="boards"
                                        value={board.url}
                                        className="w-5 h-5" // you can style this
                                    />
                                    <div className="relative w-16 h-16 aspect-square">
                                        <Image
                                            fill
                                            quality={10}
                                            alt={board.name}
                                            src={board.image_cover_hd_url}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-white/70 group-hover:text-white/90 text-lg">{board.name}</p>
                                        <p className="text-white/60">{board.pin_count} Pins</p>
                                    </div>
                                </label>
                            </div>
                        )
                    )}
                    <div className="flex justify-center">
                        <Button type="submit" disabled={loading}>
                            Select
                        </Button>
                    </div>
                </form>
                }

                {error && <p>{error}</p>}
            </DialogContent>
        </Dialog >
    );
};
