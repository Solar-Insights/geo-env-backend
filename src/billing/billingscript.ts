/*
    Run using npx tsx src/billing/billingscript.ts
*/
import dotenv from "dotenv";
import {loadStripe} from '@stripe/stripe-js';

dotenv.config();
const STRIPE_PUBLIC_KEY: string = process.env.STRIPE_PUBLIC_KEY as string;
const STRIPE_PRIVATE_KEY: string = process.env.STRIPE_PRIVATE_KEY as string;

const stripe = await loadStripe(STRIPE_PUBLIC_KEY);