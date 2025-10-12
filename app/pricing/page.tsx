'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { PLANS, CREDIT_PACKS } from '@/lib/wallet';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">CRAV Logo Studio</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-600">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Object.values(PLANS).map((plan) => (
            <Card key={plan.id} className={plan.id === 'PRO' ? 'border-blue-600 shadow-lg relative' : ''}>
              {plan.id === 'PRO' && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
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
                <Link href="/sign-up" className="w-full">
                  <Button className="w-full" variant={plan.id === 'PRO' ? 'default' : 'outline'}>
                    {plan.id === 'FREE' ? 'Get Started' : 'Subscribe'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Credit Top-Up Packs</h2>
          <p className="text-center text-slate-600 mb-8">
            Need more credits? Purchase additional credit packs anytime.
          </p>
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
                  <Button className="w-full" variant="outline">
                    Purchase
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-slate-100 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Credit Usage Guide</h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-700">AI Logo Generation</span>
              <span className="font-semibold">5 credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">AI Re-style</span>
              <span className="font-semibold">2 credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Vectorize Image</span>
              <span className="font-semibold">3 credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Mockup Set</span>
              <span className="font-semibold">1 credit</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Brand Kit PDF</span>
              <span className="font-semibold">5 credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Animation Export</span>
              <span className="font-semibold">5 credits</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
