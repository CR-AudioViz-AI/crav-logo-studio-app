import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ balance: wallet?.balance || 0 });
  } catch (error: any) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
