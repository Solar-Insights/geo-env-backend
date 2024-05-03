import { Database } from "@/db/types";

export type InsertRequest = Database["public"]["Tables"]["requests"]["Insert"];

export type UpdateRequest = Database["public"]["Tables"]["requests"]["Update"];