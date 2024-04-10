import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 8080;
export const GOOGLE_KEY: string = process.env.GOOGLE_KEY as string;
export const BACKEND_URL: string = process.env.BACKEND_URL as string;
export const AUTH0_BASE_URL: string = process.env.AUTH0_BASE_URL as string;

export const jwtCheck = auth({
    audience: BACKEND_URL,
    issuerBaseURL: AUTH0_BASE_URL,
    tokenSigningAlg: 'RS256'
});;