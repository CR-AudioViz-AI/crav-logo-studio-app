import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, count = 4 } = await req.json();

    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.balance < 5) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    await supabase
      .from('wallets')
      .update({ balance: wallet.balance - 5 })
      .eq('user_id', user.id);

    await supabase.from('ledger_entries').insert({
      wallet_id: (await supabase.from('wallets').select('id').eq('user_id', user.id).single()).data!.id,
      delta: -5,
      description: 'AI logo generation',
      meta: { prompt, style, count },
    });

    const logos = Array.from({ length: count }, (_, i) => ({
      id: `logo-${Date.now()}-${i}`,
      svg: generatePlaceholderSVG(prompt, i),
      preview: `data:image/svg+xml,${encodeURIComponent(generatePlaceholderSVG(prompt, i))}`,
    }));

    return NextResponse.json({ logos });
  } catch (error: any) {
    console.error('Logo generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generatePlaceholderSVG(prompt: string, index: number): string {
  const colors = [
    { bg: '#3B82F6', text: '#FFFFFF' },
    { bg: '#10B981', text: '#FFFFFF' },
    { bg: '#F59E0B', text: '#FFFFFF' },
    { bg: '#EF4444', text: '#FFFFFF' },
  ];

  const color = colors[index % colors.length];
  const initial = prompt.charAt(0).toUpperCase();

  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="${color.bg}"/>
    <text x="200" y="250" font-family="Arial, sans-serif" font-size="180" font-weight="bold" fill="${color.text}" text-anchor="middle">${initial}</text>
  </svg>`;
}
