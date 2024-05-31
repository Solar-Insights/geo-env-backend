import { Database } from "@/db/utils/types";

export type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

export type InsertUser = Database["public"]["Tables"]["users"]["Insert"];

export type UpdateUser = Database["public"]["Tables"]["users"]["Update"];
