import { Database } from "@/db/utils/types";

export type SupabaseQuotas = Database["public"]["Tables"]["quotas"]["Row"];

export type InsertQuotas = Database["public"]["Tables"]["quotas"]["Insert"];

export type UpdateQuotas = Database["public"]["Tables"]["quotas"]["Update"];
