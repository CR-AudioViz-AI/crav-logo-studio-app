import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { chargeCreditsOrThrow } from '@/lib/wallet-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { amount, reason, meta } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({ error: 'Reason required' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await chargeCreditsOrThrow(user.id, amount, reason, meta);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'INSUFFICIENT_CREDITS') {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }
    console.error('Charge credits error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
