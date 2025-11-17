import React from 'react'
import { CustomLink } from '@/components/ui/links'
import Image from 'next/image'
import tag from '@/public/tag.png'
import canvas from '@/public/canvas.png'
import filter from '@/public/filter.png'
import folderPreview from '@/public/folder-preview.jpg'

const LandingPage = () => {
    return (
        <div className='mt-16 font-sans font-semibold text-primary'>
            <h1 className="mx-4 text-6xl text-center">
                Build your visual library.
            </h1>
            <h2 className="mx-4 mt-2.5 text-muted-foreground md:text-xl text-center">
                Organize your images into custom folders and sections.
                <br />
                A flexible workspace that grows with your creative process.
            </h2>
            <div
                className="relative mx-auto my-12 px-6 max-lg:min-w-[1000px] max-w-[1500px]">
                <Image
                    src={folderPreview.src}
                    sizes="1500px"
                    height={500}
                    width={1500}
                    className="lg:w-full object-cover"
                    alt="Unauth"
                />
            </div>
            {/* <img src={folderPreview.src} alt="Unauth" className='brightness-[0.9] grayscale-[0.2] my-20 px-8 md:px-12 lg:px-80 w-full h-auto transition-all duration-300' /> */}

            <div className='flex flex-col mx-auto w-screen max-w-screen-2xl'>
                <div className='flex lg:flex-row flex-col mt-20 px-8'>
                    <div className="self-center w-full text-muted-foreground max-lg:text-center">
                        <div className='max-lg:text-sm'>Independent tagging system.</div>
                        <div className='text-white/90 max-md:text-4xl max-lg:text-5xl text-6xl'>
                            Tag your images.
                            <br />
                            Filter your search.
                        </div>
                        <div className='max-lg:mt-2 max-md:px-4 max-md:text-base max-lg:text-lg text-xl'>
                            Add various tags to your image.
                            <br />
                            Filter your search and find anything in seconds.
                        </div>

                    </div>
                    <div className="relative flex justify-center lg:justify-end max-lg:mt-8 w-full h-[600px] max-lg:h-[400px]">
                        {/* eslint-disable-next-line */}
                        <img
                            alt="Unauth"
                            src={tag.src}
                            sizes="100vw"
                            className="h-full object-contain"
                        />
                    </div>
                </div>

                <div className='flex lg:flex-row flex-col-reverse space-x-20 mt-20 px-8'>
                    <div className="relative flex justify-center lg:justify-start max-lg:mt-8 w-full h-[600px] max-lg:h-[400px]">
                        {/* eslint-disable-next-line */}
                        <img
                            alt="Unauth"
                            src={canvas.src}
                            sizes="100vw"
                            className="h-full object-contain"
                        />
                    </div>

                    <div className="self-center w-full">
                        <div className="mx-auto w-fit text-muted-foreground max-lg:text-center">
                            <div className='max-lg:text-sm'>Independent tagging system.</div>
                            <div className='text-white/90 max-md:text-4xl max-lg:text-5xl text-6xl'>
                                Create a canvas.
                                <br />
                                Visualise your ideas.
                            </div>
                            <div className='max-lg:mt-2 max-md:px-4 max-md:text-base max-lg:text-lg text-xl'>
                                Your ideas & references deserve a visual space.
                                <br />
                                Create and organize everything on one endless canvas.
                            </div>
                        </div>
                    </div>
                </div>


                <div className='flex lg:flex-row flex-col mt-20 px-8'>
                    <div className="self-center w-full text-muted-foreground max-lg:text-center">
                        <div className='max-lg:text-sm'>Search for new ideas.</div>
                        <div className='text-white/90 max-md:text-4xl max-lg:text-5xl text-6xl'>
                            Browse without noise.
                            <br />
                            Filter/Hide AI content.
                        </div>
                        <div className='max-lg:mt-2 max-md:px-4 max-md:text-base max-lg:text-lg text-xl max-md:text-balance'>
                            Explore a world of visuals with confidence.
                            <br />
                            Control what you see and how you see it.
                        </div>
                    </div>
                    <div className="relative flex justify-center lg:justify-end max-lg:mt-8 w-full h-[400px] max-lg:h-[400px]">
                        {/* eslint-disable-next-line */}
                        <img
                            alt="Unauth"
                            src={filter.src}
                            sizes="100vw"
                            className="h-full object-contain"
                        />
                    </div>
                </div>

            </div>
            <div className='flex flex-col items-center gap-4 my-20'>
                <div className='text-3xl text-center text-balance'>Feeling inspired? Get started now.</div>
                <CustomLink href='/login' text='Get Started' variant='default' className='px-12 py-6 rounded-full font-semibold text-md' />
            </div>
        </div>
    )
}

export default LandingPage