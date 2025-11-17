import { Database } from "@/database.types";
export type User = Database["public"]["Functions"]["get_profile"]["Returns"][number]
export type UserObject = Database["public"]["Tables"]["profiles"]["Row"]
export type UserProfile = Database["public"]["Functions"]["get_profile"]["Returns"][number]
export type UserSearchHistory = Database["public"]["Tables"]["search_history"]["Row"]