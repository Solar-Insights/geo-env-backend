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
          billed: boolean
          billing_date: string
          building_insights_requests: number
          id: string
          max_members_count: number
          paid: boolean
          team_id: string
        }
        Insert: {
          billed?: boolean
          billing_date: string
          building_insights_requests?: number
          id?: string
          max_members_count?: number
          paid?: boolean
          team_id?: string
        }
        Update: {
          billed?: boolean
          billing_date?: string
          building_insights_requests?: number
          id?: string
          max_members_count?: number
          paid?: boolean
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
      teams: {
        Row: {
          billing_day: number
          contact_email: string
          contact_name: string
          contact_phone_number: string
          created_at: string
          id: string
          pricing_tier: Database["public"]["Enums"]["pricingTier"]
          team_name: string
        }
        Insert: {
          billing_day?: number
          contact_email?: string
          contact_name?: string
          contact_phone_number?: string
          created_at?: string
          id?: string
          pricing_tier?: Database["public"]["Enums"]["pricingTier"]
          team_name?: string
        }
        Update: {
          billing_day?: number
          contact_email?: string
          contact_name?: string
          contact_phone_number?: string
          created_at?: string
          id?: string
          pricing_tier?: Database["public"]["Enums"]["pricingTier"]
          team_name?: string
        }
        Relationships: []
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
          team_id: string
        }
        Insert: {
          auth0_id?: string
          avatar?: string
          created_at?: string
          email?: string
          is_admin?: boolean
          is_deleted?: boolean
          name?: string
          team_id?: string
        }
        Update: {
          auth0_id?: string
          avatar?: string
          created_at?: string
          email?: string
          is_admin?: boolean
          is_deleted?: boolean
          name?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
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
