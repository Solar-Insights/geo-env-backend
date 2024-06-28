import dotenv from "dotenv";

dotenv.config();

// Server
export const GOOGLE_KEY: string = process.env.GOOGLE_KEY as string; // API Key
export const PORT: number = Number(process.env.PORT) || 0; // Server port

// Authentication
export const BACKEND_URL: string = process.env.BACKEND_URL as string; // Backend API Identifier
export const AUTH0_BASE_URL: string = process.env.AUTH0_BASE_URL as string; // Authentication url (seen when logging in)
export const AUTH0_CLIENT_ID: string = process.env.AUTH0_CLIENT_ID as string; // Credential for token
export const AUTH0_CLIENT_SECRET: string = process.env.AUTH0_CLIENT_SECRET as string; // Credential for token

// Database
export const SUPABASE_URL = process.env.SUPABASE_URL as string; // DB url endpoint
export const SUPABASE_KEY = process.env.SUPABASE_KEY as string; // Credential for DB usage 

// Email
export const GMAIL_SENDER = process.env.GMAIL_SENDER as string; // Sender to send emails from
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD as string; // Password for sender
export const EMAIL_RECEIVER = process.env.EMAIL_RECEIVER as string; // Receiver to emails sent from the server
