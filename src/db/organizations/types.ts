import { Database } from "@/db/utils/types";

export type SupabaseOrganization = Database["public"]["Tables"]["organizations"]["Row"];

export type InsertOrganization = Database["public"]["Tables"]["organizations"]["Insert"];

export type UpdateOrganization = Database["public"]["Tables"]["organizations"]["Update"];
