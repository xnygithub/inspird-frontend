'use client';
import test from '@/public/test.jpeg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { getBannerUrl } from '@/utils/urls';
import { useUserContext } from '@/components/userContext'

// --------- Constants ---------
const ASPECT_RATIO = 30 / 5;
const VIEWPORT_HEIGHT = 300;
const MIN_WIDTH = VIEWPORT_HEIGHT * ASPECT_RATIO;

// --------- Types ---------
type Size = { width: number; height: number };

type ImageResultProps = {
    img: HTMLImageElement;
    width: number;
    height: number;
}

type UserBannerProps = {
    url: string;
    uploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type BannerCropperProps = {
    image: string;
    size: Size;
    handleCropComplete: (banner: string) => void;
}

// --------- Helper functions ---------
function loadImage(url: string): Promise<ImageResultProps> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve({
            img,
            width: img.naturalWidth,
            height: img.naturalHeight
        });
        img.onerror = (e) => reject(e);
        img.src = url;
    });
}

function validateImage(file: File) {
    if (!file) return false;
    if (file.size > 5 * 1024 * 1024) return false;
    if (!file.type.startsWith('image/')) return false;
    if (!file.type.includes('jpeg')
        && !file.type.includes('png')
        && !file.type.includes('jpg')) return false;
    return true;
}

async function cropImage(
    size: Size,
    cropY: number,
    imageSrc: string,
    cropHeight: number
): Promise<Blob> {

    const { img } = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    canvas.width = size.width;
    canvas.height = cropHeight;

    ctx.drawImage(
        img, // Image to draw
        0, cropY, // Where to start from on the image (x, y)
        size.width, cropHeight, // Where to draw to on the image (width, height)
        0, 0, // Where to start drawing on the canvas (x, y)
        size.width, cropHeight // Where to draw to on the canvas (width, height)
    );

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to create blob'));
            resolve(blob);
        }, 'image/jpeg', 0.95);
    });
}

// --------- Components ---------
function UserBanner({ url, uploadFile }: UserBannerProps) {
    return (
        <div className="group relative space-y-2 w-full"
            style={{ height: `${VIEWPORT_HEIGHT}px` }}>
            <Image
                src={url}
                fill
                alt="Banner"
                className="group-hover:brightness-75 w-full h-full object-cover transition-all duration-500" />
            <Button
                type="button"
                className="right-2 bottom-2 absolute opacity-0 group-hover:opacity-100 text-xs transition-opacity duration-500"
                variant="ghost"
                onClick={() => document.getElementById('image')?.click()}>
                Replace Image
            </Button>
            <Input
                id="image"
                type="file"
                hidden
                accept="image/jpeg,image/png,image/jpg"
                onChange={uploadFile}
            />
        </div>
    );
}

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


function BannerContainer({ url }: { url: string }) {
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<Size | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);

    async function uploadFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !validateImage(file)) {
            console.error('File is invalid', file);
            return;
        }
        const preview = URL.createObjectURL(file);
        loadImage(preview).then(({ width, height }) => {
            setSize({ width, height });
            setImage(preview);
            setFile(file);
            setIsCropping(true);
        }).catch((error) => {
            console.error('Failed to load image', error);
        });
    }

    function tearDownState() {
        setFile(null);
        setSize(null);
        setImage(null);
        setIsCropping(false);
    }

    function handleCropComplete(newImage: string) {
        setBanner(newImage);
        tearDownState();
    }

    return (
        <>
            {isCropping && size && image ?
                <BannerCropper image={image} size={size} handleCropComplete={handleCropComplete} /> :
                <UserBanner url={banner || url} uploadFile={uploadFile} />}
        </>
    );
}



function BannerCropper({
    image,
    size,
    handleCropComplete
}: BannerCropperProps
): React.ReactNode {
    const { user } = useUserContext()

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const [cropY, setCropY] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(MIN_WIDTH);
    const dragState = useRef<{ startYScreen: number; startCropYImage: number } | null>(null);
    const cropHeight = useMemo(() => size.width / ASPECT_RATIO, [size]);

    async function cropImageHandler() {
        if (!user) throw new Error('User not found');
        const blob = await cropImage(size, cropY, image, cropHeight);
        try {
            const path = await uploadBanner(blob)
            await updateBanner(path, user.id)
            const newImage = URL.createObjectURL(blob);
            handleCropComplete(newImage);
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        if (!wrapperRef.current) return;
        const el = wrapperRef.current;

        const updateWidth = () => {
            const raw = el.clientWidth;
            setContainerWidth(Math.max(raw, MIN_WIDTH));
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    // Clamp crop so we don't go past the bottom of the image
    const maxCropYImage = Math.max(0, size.height - cropHeight);
    const safeCropYImage = Math.min(Math.max(cropY, 0), maxCropYImage);

    if (safeCropYImage !== cropY) {
        // keep state sane if image size changes, etc.
        setCropY(safeCropYImage);
    }

    // Scale: how big is the image on screen?
    const scale = containerWidth / size.width;
    const imageHeightScreen = size.height * scale;
    const cropTopScreen = safeCropYImage * scale;

    // --- Drag logic (vertical only) ---

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        dragState.current = {
            startYScreen: e.clientY,
            startCropYImage: safeCropYImage,
        };
    };

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!dragState.current) return;
        const deltaScreen = e.clientY - dragState.current.startYScreen;
        const deltaImage = deltaScreen / scale; // convert screen px → image px

        let next = dragState.current.startCropYImage + deltaImage;
        if (next < 0) next = 0;
        if (next > maxCropYImage) next = maxCropYImage;

        setCropY(next);
    };

    function endDrag() {
        dragState.current = null;
    };


    return (
        <div className="w-full">
            <div
                ref={wrapperRef}
                className="relative mx-auto"
                style={{ width: '100%', minWidth: MIN_WIDTH }}>
                <div
                    className="relative overflow-hidden cursor-grab"
                    style={{ width: '100%', height: VIEWPORT_HEIGHT }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image || test.src}
                        alt="Banner"
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: -cropTopScreen,      // slide image up/down
                            width: containerWidth,    // always fills width
                            height: imageHeightScreen,
                            userSelect: 'none',
                            pointerEvents: 'none',
                        }}
                        draggable={false}
                    />
                </div>
            </div>
            <Button
                type="button"
                className="text-xs"
                variant="genericRounded"
                onClick={cropImageHandler}>
                Crop Image
            </Button>
        </div>
    );
}


export default BannerContainer;