import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { grantCredits } from '@/lib/wallet-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, reason, meta } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    if (!reason) {
      return NextResponse.json({ error: 'Reason required' }, { status: 400 });
    }

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Add admin check here
    // For now, only allow granting to self in development
    if (user.id !== userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await grantCredits(userId, amount, reason, meta);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Grant credits error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
