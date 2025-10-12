import 'server-only';
import { createServerClient } from './supabase/server';

export async function chargeCreditsOrThrow(
  userId: string,
  amount: number,
  reason: string,
  meta?: any
) {
  if (amount <= 0) throw new Error('Amount must be > 0');

  const supabase = await createServerClient();

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', userId)
    .maybeSingle();

  if (walletError) throw walletError;
  if (!wallet) throw new Error('Wallet not found');

  const balance = Number(wallet.balance);
  if (balance < amount) {
    throw new Error('INSUFFICIENT_CREDITS');
  }

  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: balance - amount, updated_at: new Date().toISOString() })
    .eq('id', wallet.id);

  if (updateError) throw updateError;

  const { error: ledgerError } = await supabase
    .from('ledger_entries')
    .insert({
      wallet_id: wallet.id,
      delta: -amount,
      description: reason,
      meta: meta ?? null,
    });

  if (ledgerError) throw ledgerError;
}

export async function grantCredits(
  userId: string,
  amount: number,
  reason: string,
  meta?: any
) {
  const supabase = await createServerClient();

  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', userId)
    .maybeSingle();

  if (walletError) throw walletError;
  if (!wallet) throw new Error('Wallet not found');

  const balance = Number(wallet.balance);

  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: balance + amount, updated_at: new Date().toISOString() })
    .eq('id', wallet.id);

  if (updateError) throw updateError;

  const { error: ledgerError } = await supabase
    .from('ledger_entries')
    .insert({
      wallet_id: wallet.id,
      delta: amount,
      description: reason,
      meta: meta ?? null,
    });

  if (ledgerError) throw ledgerError;
}

export async function getCreditPrices() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'creditPrices')
    .maybeSingle();

  if (error) throw error;
  return data?.value as Record<string, number> || {};
}
