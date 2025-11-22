import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'
import React from 'react'

const AccordionTerms = () => {

    return (
        <div className="max-md:px-12 pl-12 max-md:w-full min-w-xs">
            <Accordion type="single" collapsible className='top-32 sticky text-primary'>
                <AccordionItem value="item-1">
                    <AccordionTrigger className='text-base cursor-pointer'>
                        Terms of Service
                    </AccordionTrigger>
                    <AccordionContent >
                        <ul className="flex flex-col gap-1 text-muted-foreground [&>li]:hover:text-primary [&>li]:hover:underline [&>li]:transition-all [&>li]:duration-200">
                            <li><Link href="/terms#terms-content-title">Terms of Service</Link></li>
                            <li><Link href="/terms#service-content">The Service</Link></li>
                            <li><Link href="/terms#using-inspird">Using Inspird</Link></li>
                            <li><Link href="/terms#your-user-content">Your User Content</Link></li>
                            <li><Link href="/terms#eligibility-and-access">Eligibility and Access</Link></li>
                            <li><Link href="/terms#license-terms">License Terms</Link></li>
                            <li><Link href="/terms#content-sharing">Content Sharing</Link></li>
                            <li><Link href="/terms#content-license">Content License</Link></li>
                            <li><Link href="/terms#content-retention">Content Retention</Link></li>
                            <li><Link href="/terms#user-feedback">User Feedback</Link></li>
                            <li><Link href="/terms#reporting-system">Reporting System</Link></li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className='text-base cursor-pointer'>
                        Privacy Policy
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="flex flex-col gap-1 text-muted-foreground [&>li]:hover:text-primary [&>li]:hover:underline [&>li]:transition-all [&>li]:duration-200">
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                            <li><Link href="/privacy#introduction">Introduction</Link></li>
                            <li><Link href="/privacy#definitions">Definitions</Link></li>
                            <li><Link href="/privacy#Usage">Usage</Link></li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className='text-base cursor-pointer'>
                        Data usage
                    </AccordionTrigger>
                    <AccordionContent>
                        <ul className="flex flex-col gap-1 text-muted-foreground [&>li]:hover:text-primary [&>li]:hover:underline [&>li]:transition-all [&>li]:duration-200">
                            <li><Link href="#">Data usage</Link></li>
                            <li><Link href="#">What we collect</Link></li>
                            <li><Link href="#">Retention of Data</Link></li>
                            <li><Link href="#">Transfer of Data</Link></li>
                            <li><Link href="#">Disclosure of Data</Link></li>
                            <li><Link href="#">Security of Data</Link></li>

                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div >
    )
}

export default AccordionTerms