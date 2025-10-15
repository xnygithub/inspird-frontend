
export async function getCroppedImage(
    imageSrc: string,
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
): Promise<{ blob: Blob; url: string }> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get canvas context')

    const { width, height, x, y } = croppedAreaPixels
    canvas.width = width
    canvas.height = height

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height)

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Failed to create blob'))
            const url = URL.createObjectURL(blob)
            resolve({ blob, url })
        }, 'image/jpeg', 0.95)
    })
}


function createImage(url: string) {
    return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.addEventListener('load', () => resolve(img))
        img.addEventListener('error', (e) => reject(e))
        img.setAttribute('crossOrigin', 'anonymous')
        img.src = url
    })
}