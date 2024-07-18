import { STRIPE_PRIVATE_KEY } from '@/server/utils/env';
import { Stripe } from 'stripe';

export const stripe = new Stripe(STRIPE_PRIVATE_KEY);
