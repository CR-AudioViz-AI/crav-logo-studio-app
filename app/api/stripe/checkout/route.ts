import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { stripe, STRIPE_PRODUCTS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const product = STRIPE_PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: product.type === 'subscription' ? 'subscription' : 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
            ...(product.type === 'subscription' && {
              recurring: {
                interval: 'month',
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/billing`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        productId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
