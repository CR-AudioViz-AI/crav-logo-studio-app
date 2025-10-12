import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    const supabase = createServerClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const productId = session.metadata?.productId;

        if (!userId) break;

        const { data: wallet } = await supabase
          .from('wallets')
          .select('id, balance')
          .eq('user_id', userId)
          .single();

        if (!wallet) break;

        let creditsToGrant = 0;
        let description = '';

        if (productId?.startsWith('CREDITS_')) {
          const creditAmount = parseInt(productId.split('_')[1]);
          creditsToGrant = creditAmount;
          description = `Purchased ${creditAmount} credits`;
        } else if (productId?.startsWith('PLAN_')) {
          const planCredits: Record<string, number> = {
            PLAN_STARTER: 300,
            PLAN_PRO: 1000,
            PLAN_STUDIO: 4000,
          };
          creditsToGrant = planCredits[productId] || 0;
          description = `Monthly subscription credits`;
        }

        if (creditsToGrant > 0) {
          await supabase
            .from('wallets')
            .update({ balance: wallet.balance + creditsToGrant })
            .eq('id', wallet.id);

          await supabase.from('ledger_entries').insert({
            wallet_id: wallet.id,
            delta: creditsToGrant,
            description,
            meta: { productId, sessionId: session.id },
          });
        }

        await supabase.from('orders').insert({
          user_id: userId,
          provider: 'STRIPE',
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'COMPLETED',
          external_id: session.id,
          meta: { productId },
        });

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata?.userId;

        if (!userId) break;

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          provider: 'STRIPE',
          external_id: subscription.id,
          status: subscription.status.toUpperCase(),
          plan: subscription.metadata?.plan || 'STARTER',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          meta: { subscription },
          updated_at: new Date().toISOString(),
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;

        await supabase
          .from('subscriptions')
          .update({
            status: 'CANCELED',
            updated_at: new Date().toISOString(),
          })
          .eq('external_id', subscription.id);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
