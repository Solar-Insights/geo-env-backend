import { Database } from "@/db/types";

export type SupabaseBilling = Database["public"]["Tables"]["billing"]["Row"];

export type InsertBilling = Database["public"]["Tables"]["billing"]["Insert"];

export type UpdateBilling = Database["public"]["Tables"]["billing"]["Update"];
