import dotenv from "dotenv";

dotenv.config();

export const GOOGLE_KEY: string = process.env.GOOGLE_KEY as string;
export const PORT: number = Number(process.env.PORT);
