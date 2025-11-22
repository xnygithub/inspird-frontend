import React from 'react';
import Link from 'next/link';
import { PlusOutlinedIcon } from "@/components/ui/icons/ant-design-plus-outlined";
import { HomeFilledIcon } from "@/components/ui/icons/home";
import { SearchIcon } from "@/components/ui/icons/search";
import { Avatar } from "@/components/navbar/profile";

export const MobileNavbar = async () => {
    return (
        <div className={styles.div}>
            <Link href="/home">
                <HomeFilledIcon size={28} className={styles.icon} />
            </Link>
            <SearchIcon size={28} className={styles.icon} />
            <PlusOutlinedIcon size={28} className={styles.icon} />
            <Avatar />
        </div>
    );
};

const styles = {
    div: "bg-navbar md:hidden right-0 bottom-0 left-0 fixed flex flex-row justify-between items-center px-16 border-border border-t h-[var(--nav-height)] select-none",
    icon: "text-muted-foreground hover:text-foreground active:scale-90 transition-all duration-200 cursor-pointer",
}
