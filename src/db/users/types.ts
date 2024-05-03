import { Database } from "@/db/types";

export type InsertUser = Database["public"]["Tables"]["users"]["Insert"];

export type UpdateUser = Database["public"]["Tables"]["users"]["Update"];