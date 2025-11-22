'use client'
import { Textarea } from "@/components/ui/textarea"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { contactUs } from "./actions"
import { toast } from "sonner"

export default function ContactUs() {

    const formAction = async (formData: FormData) => {
        await contactUs(formData)
        toast.success('Message sent successfully')
    }

    return (
        <div className="flex flex-1 justify-center items-center h-full min-h-svh">
            <div className="w-full max-w-sm">
                <form action={formAction} className="flex flex-col gap-6">
                    <FieldGroup>
                        <div className="flex flex-col gap-1">
                            <h1 className="font-bold text-4xl text-center">Get in touch with us</h1>
                            <h2 className="font-medium text-muted-foreground text-xl text-center">We&apos;ll get back as soon as possible</h2>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="name">Name</FieldLabel>
                            <Input id="name" type="text" name="name" placeholder="Your name" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="email" name="email" placeholder="Your email" required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="message">Your message</FieldLabel>
                            <Textarea
                                placeholder="Write a message to us"
                                className="h-32 resize-none no-scrollbar"
                                name="message"
                                required
                            />
                        </Field>
                        <Field>
                            <Button type="submit">
                                Send Message
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}
