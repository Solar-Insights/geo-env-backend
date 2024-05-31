import { Database } from "@/db/utils/types";

export type SupabaseTeam = Database["public"]["Tables"]["teams"]["Row"];

export type InsertTeam = Database["public"]["Tables"]["teams"]["Insert"];

export type UpdateTeam = Database["public"]["Tables"]["teams"]["Update"];
