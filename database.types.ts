export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      canvas_doc: {
        Row: {
          createdAt: string
          data: Json
          id: string
          isPrivate: boolean
          slug: string
          title: string
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          data?: Json
          id?: string
          isPrivate?: boolean
          slug: string
          title: string
          updatedAt?: string
          userId?: string
        }
        Update: {
          createdAt?: string
          data?: Json
          id?: string
          isPrivate?: boolean
          slug?: string
          title?: string
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "canvas_doc_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      folder_posts: {
        Row: {
          createdAt: string
          folderId: string
          id: string
          postId: string
          savedItemsId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          folderId: string
          id?: string
          postId: string
          savedItemsId: string
          userId?: string
        }
        Update: {
          createdAt?: string
          folderId?: string
          id?: string
          postId?: string
          savedItemsId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "folder_posts_folderId_userId_fkey"
            columns: ["folderId", "userId"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id", "userId"]
          },
          {
            foreignKeyName: "folder_posts_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folder_posts_userId_savedItemsId_fkey"
            columns: ["userId", "savedItemsId"]
            isOneToOne: false
            referencedRelation: "saved_items"
            referencedColumns: ["userId", "id"]
          },
        ]
      }
      folders: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          isPrivate: boolean
          name: string
          slug: string
          thumbnail: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id?: string
          isPrivate?: boolean
          name: string
          slug: string
          thumbnail?: string | null
          updatedAt?: string
          userId?: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          isPrivate?: boolean
          name?: string
          slug?: string
          thumbnail?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          createdAt: string
          embedding: string | null
          id: string
          isAiGenerated: boolean
          isNsfw: boolean
          isPrivate: boolean
          mediaAltText: string
          mediaAspectRatio: number
          mediaHeight: number
          mediaSize: number
          mediaType: Database["public"]["Enums"]["MediaType"]
          mediaUrl: string
          mediaWidth: number
          processingStatus: Database["public"]["Enums"]["ProcessingStatus"]
          userId: string
        }
        Insert: {
          createdAt?: string
          embedding?: string | null
          id?: string
          isAiGenerated?: boolean
          isNsfw?: boolean
          isPrivate?: boolean
          mediaAltText: string
          mediaAspectRatio: number
          mediaHeight: number
          mediaSize: number
          mediaType?: Database["public"]["Enums"]["MediaType"]
          mediaUrl: string
          mediaWidth: number
          processingStatus?: Database["public"]["Enums"]["ProcessingStatus"]
          userId?: string
        }
        Update: {
          createdAt?: string
          embedding?: string | null
          id?: string
          isAiGenerated?: boolean
          isNsfw?: boolean
          isPrivate?: boolean
          mediaAltText?: string
          mediaAspectRatio?: number
          mediaHeight?: number
          mediaSize?: number
          mediaType?: Database["public"]["Enums"]["MediaType"]
          mediaUrl?: string
          mediaWidth?: number
          processingStatus?: Database["public"]["Enums"]["ProcessingStatus"]
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatarUrl: string
          bannerUrl: string
          createdAt: string
          displayName: string
          email: string
          hasOnboarded: boolean
          id: string
          profilePrivate: boolean
          stripeCustomerId: string | null
          subscriptionId: string | null
          subscriptionStatus: string | null
          username: string
        }
        Insert: {
          avatarUrl?: string
          bannerUrl?: string
          createdAt?: string
          displayName: string
          email: string
          hasOnboarded?: boolean
          id: string
          profilePrivate?: boolean
          stripeCustomerId?: string | null
          subscriptionId?: string | null
          subscriptionStatus?: string | null
          username: string
        }
        Update: {
          avatarUrl?: string
          bannerUrl?: string
          createdAt?: string
          displayName?: string
          email?: string
          hasOnboarded?: boolean
          id?: string
          profilePrivate?: boolean
          stripeCustomerId?: string | null
          subscriptionId?: string | null
          subscriptionStatus?: string | null
          username?: string
        }
        Relationships: []
      }
      saved_items: {
        Row: {
          createdAt: string
          id: string
          postId: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          postId: string
          userId?: string
        }
        Update: {
          createdAt?: string
          id?: string
          postId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_items_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_items_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          createdAt: string
          id: string
          query: string
          userId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          query: string
          userId?: string
        }
        Update: {
          createdAt?: string
          id?: string
          query?: string
          userId?: string
        }
        Relationships: []
      }
      userSubscriptionHistory: {
        Row: {
          endDate: string
          id: number
          startDate: string
          stripePriceId: string
          subscriptionId: string
          userId: string
        }
        Insert: {
          endDate: string
          id?: number
          startDate: string
          stripePriceId: string
          subscriptionId: string
          userId?: string
        }
        Update: {
          endDate?: string
          id?: number
          startDate?: string
          stripePriceId?: string
          subscriptionId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "userSubscriptionHistory_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      folder_dropdown: {
        Args: { post_id: string }
        Returns: {
          containsPost: boolean
          id: string
          isPrivate: boolean
          name: string
          postCount: number
          thumbnail: string
        }[]
      }
      folder_media_counts: {
        Args: { p_slug: string; p_user: string }
        Returns: {
          count: number
          media_type: Database["public"]["Enums"]["MediaType"]
        }[]
      }
      folders_summary: {
        Args: { user_id: string }
        Returns: {
          createdAt: string
          description: string
          id: string
          isPrivate: boolean
          lastUpdated: string
          name: string
          ownerUsername: string
          postCount: number
          previews: string[]
          slug: string
          thumbnail: string
        }[]
      }
      generate_username_from_email_unique: {
        Args: { email: string }
        Returns: string
      }
      get_folder: {
        Args: { f_slug: string; p_username: string }
        Returns: Json
      }
      get_folder_posts: {
        Args: { f_id: string }
        Returns: {
          folderPostId: string
          id: string
          isAiGenerated: boolean
          isNsfw: boolean
          isPrivate: boolean
          isSaved: boolean
          mediaAltText: string
          mediaAspectRatio: number
          mediaHeight: number
          mediaUrl: string
          mediaWidth: number
          ownerId: string
          ownerUsername: string
          saveId: string
        }[]
      }
      get_folder_with_counts: {
        Args: { f_slug: string; p_username: string }
        Returns: {
          createdAt: string
          description: string
          id: string
          isPrivate: boolean
          lastUpdated: string
          mediaCounts: Json
          name: string
          ownerUserId: string
          ownerUsername: string
          slug: string
          thumbnail: string
        }[]
      }
      get_posts: {
        Args: { user_uuid: string }
        Returns: {
          createdAt: string
          id: string
          isAiGenerated: boolean
          isNsfw: boolean
          isPrivate: boolean
          isSaved: boolean
          mediaAltText: string
          mediaAspectRatio: number
          mediaHeight: number
          mediaUrl: string
          mediaWidth: number
          ownerId: string
          ownerUsername: string
          saveId: string
        }[]
      }
      get_profile: {
        Args: { p_username: string }
        Returns: {
          avatarUrl: string
          bannerUrl: string
          canvasCount: number
          createdAt: string
          displayName: string
          folderCount: number
          id: string
          isPro: string
          itemCount: number
          profilePrivate: boolean
          username: string
        }[]
      }
      match_posts: {
        Args: {
          include_private?: boolean
          match_count: number
          query_embedding: string
        }
        Returns: {
          id: string
          isSaved: boolean
          mediaHeight: number
          mediaUrl: string
          mediaWidth: number
          ownerId: string
          ownerUsername: string
        }[]
      }
      match_posts_to_post: {
        Args: { match_count?: number; min_similarity?: number; post_id: string }
        Returns: {
          id: string
          isSaved: boolean
          mediaHeight: number
          mediaUrl: string
          mediaWidth: number
          ownerId: string
          ownerUsername: string
        }[]
      }
    }
    Enums: {
      MediaType: "image" | "video" | "gif"
      ProcessingStatus: "not_started" | "in_progress" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      MediaType: ["image", "video", "gif"],
      ProcessingStatus: ["not_started", "in_progress", "completed", "failed"],
    },
  },
} as const
