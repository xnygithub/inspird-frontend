import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'

export default async function FAQPage() {
    return (
        <div className="padding-top my-20 min-h-screen font-sans">
            <div className="mx-auto max-md:px-6 md:w-[40rem] text-primary">
                <h1 className="font-bold text-4xl text-center">FAQ</h1>
                <p className="text-gray-500 text-sm text-end">Last updated: 06/11/2025</p>

                <Accordion type="single" collapsible className='top-32'>
                    {FaqItems.map((item) => (
                        <AccordionItem value={item.question} key={item.question}>
                            <AccordionTrigger className='text-lg cursor-pointer'>
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className='text-muted-foreground [&>b]:text-primary/80'>
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div >
    )
}


const FaqItems: {
    question: string,
    answer: string | React.ReactNode
}[] = [
        {
            question: 'Is Inspird free to use?',
            answer: 'Yes, Inspird is free to use with basic features. There are various limitations to the free plan. \n\
            Premium plans allows you to unlock more features & limits. Revenue generated helps fund the development of the platform \n\
            and covers server costs.'
        },
        {
            question: 'What makes Inspird different?',
            answer: 'Inspird is a platform that allows you to create \n\
            and share your own images. We are not an AI image generator, \n\
            we are a platform that allows you to create and share your own images.'
        },
        {
            question: 'Are images uploaded used to train AI?',
            answer: 'No, images uploaded are not used to train AI. \n\
            However we may use them to improve our models that are used to \n\
            correctly identify/label AI, NSFW and other content.'
        },
        {
            question: 'Are AI/NSFW images allowed?',
            answer:
                <>
                    Yes, AI/NSFW images are allowed. However, when uploading images it&apos;s
                    your responsibility to ensure any images uploaded are correctly
                    marked/tagged as AI. Failure to do so may result in the image being removed
                    and further offences can lead to account restrictions and/or suspension.
                    <b><span className='block mt-1' > Explicit images are not allowed.</span></b>
                </>,
        },
        {
            question: 'Are videos allowed?',
            answer: 'Images are currently not supported since we want to be an image-based platform.\n\
                However, we may consider adding video support in the future.'
        },
        {
            question: 'Can I import images from Pinterest?',
            answer: 'Yes, you can import images from Pinterest.'
        },
    ]