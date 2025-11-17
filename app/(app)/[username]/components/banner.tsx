'use client'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { getCroppedImage } from '@/utils/crop'
import { createClient } from '@/utils/supabase/client'
import { getBannerUrl } from '@/utils/urls'
import { useUserContext } from '@/components/userContext'
import { useProfile } from '@/app/(app)/[username]/components/provider'

type BannerProps = { url: string }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png']

// TODO: Upload the banner to storage
// TODO: Add Zoom/Reset
// TODO: Clear previous context on crop complete

async function uploadBanner(blob: Blob) {
    const supabase = createClient()
    const uuid = crypto.randomUUID()
    const extension = blob.type.split('/')[1]
    const p = `user-banners/${uuid}.${extension}`
    const { data, error } = await supabase
        .storage
        .from('i')
        .upload(p, blob, {
            contentType: blob.type,
            cacheControl: '3600',
        })
    if (error) throw error
    return data.fullPath
}

async function updateBanner(path: string, userId: string) {
    const supabase = createClient()
    const bannerUrl = getBannerUrl() + path
    const { data, error } = await supabase
        .from('profiles')
        .update({ bannerUrl: bannerUrl })
        .eq('id', userId)
    if (error) throw error
    return data
}

export default function Banner(
    { url }: BannerProps
) {
    const { isMe } = useProfile()
    const { user } = useUserContext()

    const ref = useRef<HTMLDivElement | null>(null)
    const [bannerUrl, setBannerUrl] = useState(url)
    const [isCropping, setIsCropping] = useState(false)
    const [cropArea, setCropArea] = useState<Area | null>(null)

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
    const [lockSize, setLockSize] = useState<{ w: number; h: number } | null>(null);

    const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
        setCropArea(croppedAreaPixels)
    }

    const handleDiscard = () => {
        setBannerUrl(url)
        setIsCropping(false)
        setCrop({ x: 0, y: 0 })
    }

    const handleSave = async () => {
        if (!cropArea || !user) return
        const { blob, url } = await getCroppedImage(bannerUrl, cropArea)
        setBannerUrl(url)
        setIsCropping(false)
        try {
            const path = await uploadBanner(blob)
            await updateBanner(path, user.id)
        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return
        const reader = new FileReader()
        reader.onload = () => {
            setBannerUrl(String(reader.result))
            setIsCropping(true)
        }
        reader.readAsDataURL(file)
    }

    const onMediaLoaded = () => {
        if (!lockSize && ref.current) {
            const r = ref.current.getBoundingClientRect()
            setLockSize({ w: r.width, h: r.height })
        }
    }

    useEffect(() => {
        function update() {
            if (!ref.current) return
            const rect = ref.current.getBoundingClientRect()
            setContainerSize({ width: rect.width, height: rect.height })

        }
        update()
        window.addEventListener('resize', update)
        return () => window.removeEventListener('resize', update)
    }, [])


    return (
        <div ref={ref} className="w-full h-full">
            {!isCropping ? (
                <div className="group relative w-full h-full font-sans">
                    <Image
                        fill
                        alt="Banner"
                        src={bannerUrl}
                        sizes="100vw"
                        className={`brightness-70  object-cover transition-brightness duration-300 select-none pointer-events-none
                        ${isMe ? 'group-hover:brightness-50' : ''} `} />
                    {isMe &&
                        <div className="right-1/2 bottom-1/2 absolute flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-1/2 translate-y-1/2 duration-300">
                            <span className="text-primary text-lg">Replace Banner Image</span>
                            <span className="font-medium text-primary text-sm">Optimal dimensions: 1500x500</span>
                            <Button variant="genericRounded" className="mt-2 select-none"
                                onClick={() => document.getElementById('banner-input')?.click()}>
                                Replace Banner
                                <Input id="banner-input" type="file" hidden
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={handleChange} />
                            </Button>
                        </div>}
                </div>
            ) : (
                <div ref={ref} style={lockSize ? { minWidth: lockSize.w } : undefined}
                    className="left-1/2 absolute inset-0 w-full overflow-x-auto -translate-x-1/2">
                    <Cropper
                        crop={crop}
                        zoom={1}
                        showGrid={false}
                        image={bannerUrl}
                        objectFit="horizontal-cover"
                        aspect={containerSize.width / containerSize.height}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onMediaLoaded={onMediaLoaded}
                    />
                    <div className="bottom-3 left-3 z-10 absolute flex items-center gap-2">
                        <Button variant="genericRounded" onClick={handleSave}>Save</Button>
                        <Button variant="genericRounded" onClick={handleDiscard}>Cancel</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
