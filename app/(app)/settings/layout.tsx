import React from 'react'
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    UserRound,
    Settings,
    User,
    CreditCard,
    Palette,
    History,
    Telescope,
    FolderUp,
    FolderSymlink,
    ClipboardClock,
    Heart,
    Download,
    PaintbrushVertical,
    DatabaseBackup,
    LogOut,
} from 'lucide-react';
import Avatar from './components/avatar';
import { cn } from '@/lib/utils';

export default function SettingsLayout({
    children
}: {
    children: React.ReactNode
}) {

    return (
        <>

            <div className={cn(
                "padding-top flex md:mx-auto",
                "",
                "2xl:min-w-7xl 2xl:max-w-7xl",
                "lg:min-w-4xl lg:max-w-4xl",
                "px-4 ",
                "min-w-full min-h-[calc(100svh-var(--nav-height))")}>


                <div className='flex max-md:flex max-md:flex-col max-md:justify-center max-md:items-center mx-auto w-full font-sans'>

                    <div className={`flex flex-col gap-2 pt-12 w-60 h-full  shrink-0 relative max-md:hidden max-h-[calc(100svh-var(--nav-height))]`}>
                        {/* <Link
                            href='/'
                            className='inline-flex top-8 left-0 absolute items-center gap-2 bg-[rgba(43,74,43,0.99)] hover:bg-[rgba(81,145,81,0.99)] py-2 pr-4 pl-3 rounded-xl text-primary text-xs'>
                            <Undo2 size={16} className={iconStyles} />
                            Back to home
                        </Link> */}
                        <Avatar />
                        <div className='flex flex-col gap-1 pt-1 border-b'>
                            <span className='block px-2 font-medium dark:text-muted-foreground text-xs'>Profile and account</span>
                            <div className={subMenuStyles}>
                                <Link href='/settings/profile' className={tabStyles}>
                                    <UserRound size={16} className={iconStyles} />
                                    Profile
                                </Link>
                                <Link href='/settings/account' className={tabStyles}>
                                    <Settings size={16} className={iconStyles} />
                                    Account
                                </Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 pt-1 border-b'>
                            <span className='block px-2 font-medium dark:text-muted-foreground text-xs'>Site appearance and accessibility</span>
                            <div className={subMenuStyles}>
                                <Link href='/settings/appearance' className={tabStyles}>
                                    <Palette size={16} className={iconStyles} />
                                    Appearance
                                </Link>
                                <Link href='/settings/accessibility' className={tabStyles}>
                                    <User size={16} className={iconStyles} />
                                    Accessibility
                                </Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 pt-1 border-b'>
                            <span className='block px-2 font-medium dark:text-muted-foreground text-xs'>Canvas</span>
                            <div className={subMenuStyles}>
                                <Link href='/settings/canvas' className={tabStyles}>
                                    <PaintbrushVertical size={16} className={iconStyles} />
                                    Settings
                                </Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 pt-1 border-b'>
                            <span className='block px-2 font-medium dark:text-muted-foreground text-xs'>Billing and Subscriptions</span>
                            <div className={subMenuStyles}>
                                <Link href='/settings/explore-plans' className={tabStyles}>
                                    <Telescope size={16} className={iconStyles} />
                                    Explore plans
                                </Link>
                                <Link href='/settings/subscriptions' className={tabStyles}>
                                    <CreditCard size={16} className={iconStyles} />
                                    Subscriptions
                                </Link>
                                <Link href='/settings/payment-history' className={tabStyles}>
                                    <ClipboardClock size={16} className={iconStyles} />
                                    Payment history
                                </Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 pt-1 border-b'>
                            <span className='block px-2 font-medium dark:text-muted-foreground text-xs'>History and recommendations</span>
                            <div className={subMenuStyles}>
                                <Link href='/settings/browsing-history' className={tabStyles}>
                                    <History size={16} className={iconStyles} />
                                    Browsing History
                                </Link>
                                <Link href='/settings/recommendations' className={tabStyles}>
                                    <Heart size={16} className={iconStyles} />
                                    Recommendations
                                </Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 pt-1 border-b'>
                            <span className='block px-2 font-medium dark:text-muted-foreground text-xs'>Data and content</span>
                            <div className={subMenuStyles}>
                                <Link
                                    href='/settings/backups'
                                    className={tabStyles}>
                                    <DatabaseBackup size={16} className={iconStyles} />
                                    Backups
                                </Link>
                                <Link href='/settings/exporting' className={tabStyles}>
                                    <FolderSymlink size={16} className={iconStyles} />
                                    Exporting
                                </Link>
                                <Link href='/settings/import-content' className={tabStyles}>
                                    <FolderUp size={16} className={iconStyles} />
                                    Import content
                                </Link>

                                <Link href='/settings/export-your-data' className={tabStyles}>
                                    <Download size={16} className={iconStyles} />
                                    Export your data
                                </Link>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            className='opacity-80 hover:opacity-100 mt-auto mb-4 rounded-xl w-full font-normal text-sm cursor-pointer'>
                            <LogOut className='rotate-180' />
                            Logout
                        </Button>
                    </div>
                    <Separator orientation="vertical" className='max-md:hidden mx-8 my-auto data-[orientation=vertical]:h-[98%] min-h-[calc(100svh-var(--nav-height))]' />
                    <div className='md:pt-12 md:pb-8 w-full'>
                        {/* <MobileMenu /> */}

                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
const tabStyles = 'inline-flex gap-2 items-center font-normal text-primary text-sm hover:bg-accent hover:dark:bg-accent px-2 py-1.5 cursor-pointer rounded-xl';
const iconStyles = 'dark:text-muted-foreground';
const subMenuStyles = 'flex flex-col gap-0 pb-3 pt-1';