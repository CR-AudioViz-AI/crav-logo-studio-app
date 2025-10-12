import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { grantCredits } from '@/lib/wallet-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // TODO: Add proper PayPal webhook verification using transmission headers
    // and PAYPAL_WEBHOOK_ID in production

    const supabase = await createServerClient();

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = event.resource;
      const userId = resource.custom_id;
      const sku = resource.purchase_units?.[0]?.reference_id;

      if (!userId || !sku) {
        return NextResponse.json({ ok: true });
      }

      // Get credit amount from SKU
      const { data: skuData } = await supabase
        .from('skus')
        .select('amount_credits')
        .eq('sku', sku)
        .maybeSingle();

      if (skuData?.amount_credits) {
        await grantCredits(
          userId,
          skuData.amount_credits,
          `PayPal: ${sku}`,
          { paypal_event_id: event.id }
        );

        // Record order
        await supabase.from('orders').insert({
          user_id: userId,
          provider: 'PAYPAL',
          external_id: resource.id,
          amount: Math.round(parseFloat(resource.amount?.value || '0') * 100),
          currency: resource.amount?.currency_code || 'USD',
          status: 'COMPLETED',
          meta: { sku, event_id: event.id }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
