"use client"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { editAccountInputSchema, type EditAccountInput } from "@/lib/zod/settings.schema";
import { updateAccount } from "@/app/actions/settings";
import Avatar from "./avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
}

export default function Profile({ user }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(editAccountInputSchema),
        defaultValues: {
            username: user.username,
            displayName: user.displayName,
            profilePrivate: user.profilePrivate,
        },
    })

    const handleUpdate = async (data: EditAccountInput) => {
        await updateAccount(data);
    }

    return (
        <>
            <Avatar user={user} />
            <form
                onSubmit={handleSubmit(handleUpdate)}
                className="flex flex-col items-center gap-2"
            >
                <label htmlFor="username" className="w-full text-[20px]">Username</label>
                <Input {...register("username")} className="w-full text-[20px]" />
                <p>{errors.username?.message as string}</p>


                <label htmlFor="displayName" className="w-full text-[20px]">Display Name</label>
                <Input {...register("displayName")} className="w-full text-[20px]" />
                <p>{errors.displayName?.message as string}</p>

                <label htmlFor="profilePrivate" className="w-full text-[20px]">Profile Private</label>
                <Input {...register("profilePrivate")} type="checkbox" className="mr-auto" />
                <p>{errors.profilePrivate?.message as string}</p>

                <Button type="submit" className="w-full text-[20px]">Update</Button>

            </form>
        </>
    )
}