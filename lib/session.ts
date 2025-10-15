import { createClient } from "@/utils/supabase/client"

export const getUserId = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    return { supabase, userId: session?.user.id || null }
}