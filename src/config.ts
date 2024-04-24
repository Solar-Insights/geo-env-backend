import dotenv from "dotenv";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 0;
export const GOOGLE_KEY: string = process.env.GOOGLE_KEY as string;
export const BACKEND_URL: string = process.env.BACKEND_URL as string;
export const AUTH0_BASE_URL: string = process.env.AUTH0_BASE_URL as string;
export const AUTH_MODE: boolean = process.env.AUTH_MODE === "true";
export const AUTH0_TESTING_CLIENT_ID = process.env.AUTH0_TESTING_CLIENT_ID as string;
export const AUTH0_TESTING_CLIENT_SECRET = process.env.AUTH0_TESTING_CLIENT_SECRET as string;