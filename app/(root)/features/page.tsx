'use client'
import { motion } from 'framer-motion'

export default function Features() {
    return (
        <div className='mt-32 select-none'>
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeIn" }}
                className="block font-sans font-semibold text-3xl md:text-5xl text-center transition-all duration-300">
                Features.
            </motion.span>
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="block mt-2 font-sans text-muted-foreground text-base md:text-xl text-center transition-all duration-300">
                What can you do with Inspird?
            </motion.span>
        </div>
    )
}
