import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { chargeCreditsOrThrow, getCreditPrices } from '@/lib/wallet-server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, count = 4 } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get credit cost from settings
    const prices = await getCreditPrices(cookieStore);
    const creditCost = prices['logo.concept'] || 5;

    // Charge credits before generation
    try {
      await chargeCreditsOrThrow(
        cookieStore,
        user.id,
        creditCost,
        'AI logo generation',
        { prompt, style, count }
      );
    } catch (error: any) {
      if (error.message === 'INSUFFICIENT_CREDITS') {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
      }
      throw error;
    }

    // Generate placeholder logos
    // TODO: Replace with actual AI generation when ready
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
