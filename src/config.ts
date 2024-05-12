import dotenv from "dotenv";

dotenv.config();

export const GOOGLE_KEY: string = process.env.GOOGLE_KEY as string;
export const PORT: number = Number(process.env.PORT) || 0;

export const BACKEND_URL: string = process.env.BACKEND_URL as string;
export const AUTH0_BASE_URL: string = process.env.AUTH0_BASE_URL as string;
export const AUTH0_CLIENT_ID: string = process.env.AUTH0_CLIENT_ID as string;
export const AUTH0_CLIENT_SECRET: string = process.env.AUTH0_CLIENT_SECRET as string;

export const SUPABASE_URL = process.env.SUPABASE_URL as string;
export const SUPABASE_KEY = process.env.SUPABASE_KEY as string;
