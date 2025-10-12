import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
    })
  : null;

let stripePromise: Promise<StripeJS | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
  }
  return stripePromise;
};

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceId: string;
  currency: string;
  type: 'subscription' | 'one_time';
}

export const STRIPE_PRODUCTS: Record<string, StripeProduct> = {
  CREDITS_200: {
    id: 'credits_200',
    name: '200 Credits',
    description: 'One-time credit pack',
    price: 900,
    priceId: 'price_credits_200',
    currency: 'usd',
    type: 'one_time',
  },
  CREDITS_500: {
    id: 'credits_500',
    name: '500 Credits',
    description: 'One-time credit pack',
    price: 1900,
    priceId: 'price_credits_500',
    currency: 'usd',
    type: 'one_time',
  },
  CREDITS_1000: {
    id: 'credits_1000',
    name: '1000 Credits',
    description: 'One-time credit pack',
    price: 3500,
    priceId: 'price_credits_1000',
    currency: 'usd',
    type: 'one_time',
  },
  PLAN_STARTER: {
    id: 'plan_starter',
    name: 'Starter Plan',
    description: 'Monthly subscription',
    price: 1200,
    priceId: 'price_plan_starter',
    currency: 'usd',
    type: 'subscription',
  },
  PLAN_PRO: {
    id: 'plan_pro',
    name: 'Pro Plan',
    description: 'Monthly subscription',
    price: 2900,
    priceId: 'price_plan_pro',
    currency: 'usd',
    type: 'subscription',
  },
  PLAN_STUDIO: {
    id: 'plan_studio',
    name: 'Studio Plan',
    description: 'Monthly subscription',
    price: 7900,
    priceId: 'price_plan_studio',
    currency: 'usd',
    type: 'subscription',
  },
};
