import { Database } from "@/db/utils/types";

export type SupabaseRequest = Database["public"]["Tables"]["requests"]["Row"];

export type InsertRequest = Database["public"]["Tables"]["requests"]["Insert"];

export type UpdateRequest = Database["public"]["Tables"]["requests"]["Update"];
