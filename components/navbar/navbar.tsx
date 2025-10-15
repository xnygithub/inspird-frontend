import Link from "next/link";
import { Avatar } from "@/components/navbar/profile";
import { Create } from "@/components/create/dropdown";
import { Dropdown } from "@/components/navbar/dropdown";
import { SearchBar } from "@/components/search/search-bar";
import SubscribeButton from "@/components/subscribe-button";
import { Button } from "@/components/ui/button";
import { RawUser } from "@/types/users";

export const Navbar = async (
    { user }: { user: RawUser | null }
) => {

    return (
        <div id="navbar" className="nav-default">
            {!!user ? (
                <>
                    <Link href="/">
                        <span className="font-semibold text-xl">INSPIRD</span>
                    </Link>
                    <SearchBar />
                    <div className="flex flex-row items-center gap-2">
                        {user.subscriptionStatus !== "active" && <SubscribeButton user={user} />}
                        <Create />
                        <Avatar />
                        <Dropdown />
                    </div>
                </>
            ) : (
                <div className="flex flex-row justify-end items-center gap-2 w-full">
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                    <Link href="/login">
                        <Button>Signup</Button>
                    </Link>
                </div>
            )}
        </div>
    );
};
