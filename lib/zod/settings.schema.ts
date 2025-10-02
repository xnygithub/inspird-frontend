import { z } from "zod";

const MIN_MESSAGE = "Must be at least 3 characters long";
const MAX_MESSAGE = "Must be less than 25 characters long";
const USERNAME_MESSAGE = "Only lowercase letters, numbers, and underscores are allowed";
const DISPLAY_NAME_MESSAGE = "Only letters, numbers, and underscores are allowed";

export const editAccountInputSchema = z.object({
    username: z.string()
        .min(3, { message: MIN_MESSAGE })
        .max(25, { message: MAX_MESSAGE })
        .regex(/^[a-z0-9_.]+$/, { message: USERNAME_MESSAGE }),
    displayName: z.string()
        .min(3, { message: MIN_MESSAGE })
        .max(25, { message: MAX_MESSAGE })
        .regex(/^[a-zA-Z0-9_.]+$/, { message: DISPLAY_NAME_MESSAGE }),
    profilePrivate: z.boolean(),
});
export type EditAccountInput = z.infer<typeof editAccountInputSchema>;

