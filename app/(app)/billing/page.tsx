'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CreditCard, History } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getLedgerEntries } from '@/lib/wallet';
import { PLANS, CREDIT_PACKS } from '@/lib/wallet';
import { LedgerEntry } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function BillingPage() {
  const { user, balance } = useAppStore();
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLedger();
    }
  }, [user]);

  const loadLedger = async () => {
    try {
      const entries = await getLedgerEntries(user!.id);
      setLedger(entries);
    } catch (error: unknown) {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Credits</h1>
          <p className="text-slate-600">Manage your subscription and credits</p>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Available Credits</p>
                <p className="text-4xl font-bold">{balance}</p>
              </div>
              <CreditCard className="h-16 w-16 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="credits">Credit Packs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.values(PLANS).map((plan) => (
                <Card key={plan.id} className={plan.id === 'PRO' ? 'border-blue-600' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {plan.id === 'PRO' && <Badge>Popular</Badge>}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-slate-900">{plan.priceDisplay}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant={plan.id === 'FREE' ? 'outline' : 'default'}>
                      {plan.id === 'FREE' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credits" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {CREDIT_PACKS.map((pack) => (
                <Card key={pack.id}>
                  <CardHeader>
                    <CardTitle>{pack.credits} Credits</CardTitle>
                    <CardDescription>
                      <span className="text-2xl font-bold text-slate-900">{pack.priceDisplay}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="w-full">Purchase</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : ledger.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No transactions yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ledger.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-3 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{entry.description}</p>
                          <p className="text-sm text-slate-500">
                            {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <span
                          className={`font-semibold ${
                            entry.delta > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {entry.delta > 0 ? '+' : ''}{entry.delta}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
