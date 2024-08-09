export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billing: {
        Row: {
          billing_date: string
          id: string
          max_building_insights_requests: number
          max_members_count: number
          organization_id: string
        }
        Insert: {
          billing_date: string
          id: string
          max_building_insights_requests: number
          max_members_count: number
          organization_id: string
        }
        Update: {
          billing_date?: string
          id?: string
          max_building_insights_requests?: number
          max_members_count?: number
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_team_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_day: number
          contact_email: string
          contact_name: string
          contact_phone_number: string
          created_at: string
          customer_id: string
          id: string
          organization_name: string
          pricing_tier: Database["public"]["Enums"]["pricingTier"]
        }
        Insert: {
          billing_day?: number
          contact_email: string
          contact_name: string
          contact_phone_number: string
          created_at?: string
          customer_id: string
          id: string
          organization_name: string
          pricing_tier?: Database["public"]["Enums"]["pricingTier"]
        }
        Update: {
          billing_day?: number
          contact_email?: string
          contact_name?: string
          contact_phone_number?: string
          created_at?: string
          customer_id?: string
          id?: string
          organization_name?: string
          pricing_tier?: Database["public"]["Enums"]["pricingTier"]
        }
        Relationships: []
      }
      quotas: {
        Row: {
          max_building_insights_requests: number
          max_members_count: number
          pricing_tier: Database["public"]["Enums"]["pricingTier"]
        }
        Insert: {
          max_building_insights_requests: number
          max_members_count: number
          pricing_tier: Database["public"]["Enums"]["pricingTier"]
        }
        Update: {
          max_building_insights_requests?: number
          max_members_count?: number
          pricing_tier?: Database["public"]["Enums"]["pricingTier"]
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id: string
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_team_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["auth0_id"]
          },
        ]
      }
      users: {
        Row: {
          auth0_id: string
          avatar: string
          created_at: string
          email: string
          is_admin: boolean
          is_deleted: boolean
          name: string
          organization_id: string
        }
        Insert: {
          auth0_id: string
          avatar: string
          created_at?: string
          email: string
          is_admin?: boolean
          is_deleted?: boolean
          name: string
          organization_id: string
        }
        Update: {
          auth0_id?: string
          avatar?: string
          created_at?: string
          email?: string
          is_admin?: boolean
          is_deleted?: boolean
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricingTier: "starter" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
