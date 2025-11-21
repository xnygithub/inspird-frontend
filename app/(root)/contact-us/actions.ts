"use server"

type ContactUsData = {
    name: string
    email: string
    message: string
}

export async function contactUs(
    formData: FormData
) {
    const data = Object.fromEntries(formData.entries()) as ContactUsData
    return { error: false, message: 'Message sent successfully' }
}