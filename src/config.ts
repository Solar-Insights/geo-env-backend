import dotenv from "dotenv";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 8080;
export const GOOGLE_KEY: string = process.env.GOOGLE_KEY as string;
export const BACKEND_URL: string = process.env.BACKEND_URL as string;
export const AUTH0_BASE_URL: string = process.env.AUTH0_BASE_URL as string;

