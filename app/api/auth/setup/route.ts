import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({ success: true, message: 'User already exists' });
    }

    const { error: userError } = await supabase.from('users').insert({
      id: userId,
      email: email,
      name: name || null,
    });

    if (userError) {
      console.error('User insert error:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .insert({
        user_id: userId,
        balance: 50,
      })
      .select('id')
      .single();

    if (walletError) {
      console.error('Wallet insert error:', walletError);
      return NextResponse.json({ error: walletError.message }, { status: 500 });
    }

    const { error: ledgerError } = await supabase.from('ledger_entries').insert({
      wallet_id: wallet.id,
      delta: 50,
      description: 'Welcome bonus credits',
      meta: { type: 'signup_bonus' },
    });

    if (ledgerError) {
      console.error('Ledger insert error:', ledgerError);
      return NextResponse.json({ error: ledgerError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
