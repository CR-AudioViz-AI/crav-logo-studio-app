import { supabase } from './supabase/client';
import { Wallet, LedgerEntry } from './types';

export async function getWallet(userId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getBalance(userId: string): Promise<number> {
  const wallet = await getWallet(userId);
  return wallet?.balance || 0;
}

export async function chargeCredits(
  userId: string,
  amount: number,
  description: string,
  meta?: any
): Promise<boolean> {
  const wallet = await getWallet(userId);

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  if (wallet.balance < amount) {
    return false;
  }

  const { error: updateError } = await supabase
    .from('wallets')
    .update({
      balance: wallet.balance - amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', wallet.id);

  if (updateError) throw updateError;

  const { error: ledgerError } = await supabase
    .from('ledger_entries')
    .insert({
      wallet_id: wallet.id,
      delta: -amount,
      description,
      meta,
    });

  if (ledgerError) throw ledgerError;

  return true;
}

export async function grantCredits(
  userId: string,
  amount: number,
  description: string,
  meta?: any
): Promise<void> {
  const wallet = await getWallet(userId);

  if (!wallet) {
    throw new Error('Wallet not found');
  }

  const { error: updateError } = await supabase
    .from('wallets')
    .update({
      balance: wallet.balance + amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', wallet.id);

  if (updateError) throw updateError;

  const { error: ledgerError } = await supabase
    .from('ledger_entries')
    .insert({
      wallet_id: wallet.id,
      delta: amount,
      description,
      meta,
    });

  if (ledgerError) throw ledgerError;
}

export async function getLedgerEntries(userId: string): Promise<LedgerEntry[]> {
  const wallet = await getWallet(userId);

  if (!wallet) {
    return [];
  }

  const { data, error } = await supabase
    .from('ledger_entries')
    .select('*')
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export const CREDIT_COSTS = {
  AI_LOGO_GENERATION: 5,
  AI_RESTYLE: 2,
  VECTORIZE: 3,
  MOCKUP_SET: 1,
  BRAND_KIT_PDF: 5,
  ANIMATION_EXPORT: 5,
} as const;

export const CREDIT_PACKS = [
  { id: 'CREDITS_200', credits: 200, price: 900, priceDisplay: '$9' },
  { id: 'CREDITS_500', credits: 500, price: 1900, priceDisplay: '$19' },
  { id: 'CREDITS_1000', credits: 1000, price: 3500, priceDisplay: '$35' },
] as const;

export const PLANS = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    priceDisplay: 'Free',
    credits: 50,
    features: [
      '50 starter credits',
      'Watermark on exports',
      'Limited templates',
      'Basic exports (SVG, PNG)',
    ],
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 1200,
    priceDisplay: '$12/mo',
    credits: 300,
    features: [
      '300 monthly credits',
      'No watermark',
      'Vector editor access',
      'All export formats',
      'Template library',
    ],
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 2900,
    priceDisplay: '$29/mo',
    credits: 1000,
    features: [
      '1000 monthly credits',
      'Brand Kit PDF generator',
      'Mockup templates',
      'Priority support',
      'Custom fonts',
    ],
  },
  STUDIO: {
    id: 'STUDIO',
    name: 'Studio',
    price: 7900,
    priceDisplay: '$79/mo',
    credits: 4000,
    features: [
      '4000 monthly credits',
      'Animation exports',
      'Team seats (3)',
      'Priority queue',
      'White-label options',
    ],
  },
} as const;
