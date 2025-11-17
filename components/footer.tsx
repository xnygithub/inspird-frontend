import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import {
    FiTwitter,
    FiLinkedin,
    FiFacebook,
    FiInstagram
} from 'react-icons/fi'

const Footer = () => {
    return (
        <div className='flex flex-col items-center mt-auto mb-4 px-8 border-accent border-t'>
            <div className='md:grid md:grid-cols-5 my-8 w-full md:max-w-[1000px] font-sans'>
                <div className='flex flex-col gap-2 max-md:text-center'>
                    <span className={`${styles.title} inline-flex flex-col gap-1`}>
                        Inspird
                        <span className='text-muted-foreground text-sm whitespace-nowrap'> Made for designers, by designers.</span>
                    </span>
                    <span className='text-muted-foreground text-sm'> Follow Inspird on social media</span>
                    <div className='flex flex-row max-md:justify-center gap-2'>
                        <Button variant="icon">
                            <FiTwitter fill='currentColor' />
                        </Button>
                        <Button variant="icon">
                            <FiInstagram />
                        </Button>
                    </div>
                </div>
                <div className='hidden md:block'></div>

                <div className="block md:contents max-md:gap-4 max-md:grid max-md:grid-cols-1 max-md:mt-8">

                    <div className='flex flex-col gap-2'>
                        <span className={styles.title}>
                            Products
                        </span>
                        <Link href="/" className={styles.link}>Discover</Link>
                        <Link href="/" className={styles.link}>Pricing</Link>
                        <Link href="/" className={styles.link}>Canvas</Link>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className={styles.title}>
                            Links
                        </span>
                        <div className='flex flex-col gap-2'>
                            <Link href="/" className={styles.link}>Home</Link>
                            <Link href="/features" className={styles.link}>Features</Link>
                            <Link href="/sitemap" className={styles.link}>Sitemap</Link>
                            <Link href="/pricing" className={styles.link}>Pricing</Link>
                            <Link href="/login" className={styles.link}>Login</Link>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className={styles.title}>
                            Company
                        </span>
                        <div className='flex flex-col gap-2'>
                            <Link href="/faq" className={styles.link}>FAQ</Link>
                            <Link href="/about" className={styles.link}>About Us</Link>
                            <Link href="/contact-us" className={styles.link}>Contact Us</Link>
                            <Link href="/terms" className={styles.link}>Terms of Service</Link>
                            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                        </div>
                    </div>
                </div>
            </div>
            <span className='block self-end mx-4 font-sans text-muted-foreground text-xs'>© 2025 Inspird. All rights reserved.</span>
        </div>
    )
}

const styles = {
    title: 'font-semibold text-xl',
    link: 'text-muted-foreground text-sm hover:text-foreground transition-colors',
}

export default Footer