import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { paypalClient, isPayPalConfigured } from '@/lib/paypal';
import paypal from '@paypal/checkout-server-sdk';

export async function POST(req: NextRequest) {
  try {
    if (!isPayPalConfigured()) {
      return NextResponse.json({ error: 'PayPal not configured' }, { status: 503 });
    }

    const { sku } = await req.json();

    if (!sku) {
      return NextResponse.json({ error: 'SKU required' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: skuData, error: skuError } = await supabase
      .from('skus')
      .select('*')
      .eq('sku', sku)
      .eq('provider', 'PAYPAL')
      .maybeSingle();

    if (skuError || !skuData) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
    }

    // Get price from metadata or use default
    const price = skuData.meta?.price || '10.00';

    const request = new paypal.orders.OrdersCreateRequest();
    request.headers['Prefer'] = 'return=representation';
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: sku,
        custom_id: user.id,
        amount: {
          currency_code: 'USD',
          value: price
        },
        description: `${skuData.amount_credits || 0} credits`
      }],
      application_context: {
        brand_name: 'CRAV Logo Studio',
        return_url: `${req.headers.get('origin')}/billing?paypal_status=success`,
        cancel_url: `${req.headers.get('origin')}/billing?paypal_status=cancel`
      }
    });

    const order = await paypalClient.execute(request);
    const approveLink = order.result.links?.find((l: any) => l.rel === 'approve')?.href;

    return NextResponse.json({
      id: order.result.id,
      approveUrl: approveLink
    });
  } catch (error: any) {
    console.error('PayPal order error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
