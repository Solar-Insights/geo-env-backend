import { Database } from "@/db/utils/types";

export type SupabaseDeletedUsers = Database["public"]["Tables"]["deleted_users"]["Row"];

export type InsertDeletedUsers = Database["public"]["Tables"]["deleted_users"]["Insert"];

export type UpdateDeletedUsers = Database["public"]["Tables"]["deleted_users"]["Update"];
