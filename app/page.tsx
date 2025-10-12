'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, Palette, Download, Zap, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">CRAV Logo Studio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="/templates" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Templates
            </Link>
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Create Professional Logos in Minutes
            </h1>
            <p className="text-xl text-slate-600">
              AI-powered logo generation and a professional vector editor.
              All the tools you need to build your brand identity.
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Link href="/sign-up">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline">
                  Browse Templates
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              50 free credits on signup. No credit card required.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Wand2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generation</h3>
              <p className="text-slate-600">
                Describe your brand and let AI create unique logo concepts instantly.
                Multiple styles and variations to choose from.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vector Editor</h3>
              <p className="text-slate-600">
                Professional tools for fine-tuning. Bezier paths, boolean operations,
                typography controls, and more.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border shadow-sm">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Every Format</h3>
              <p className="text-slate-600">
                Export to SVG, PNG, PDF, EPS, and more. Generate mockups,
                social kits, and complete brand guidelines.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="text-slate-300">
                From concept to completion, all the tools to create a professional brand identity.
              </p>
              <ul className="grid md:grid-cols-2 gap-4 pt-8 text-left">
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>All logo types: wordmark, monogram, mascot, abstract, and more</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>Brand kit generator with colors, typography, and guidelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>Mockup templates for business cards, apparel, signage</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>Animation exports for modern digital branding</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>Commercial licensing included</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                  <span>Version history and collaboration tools</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Brand?</h2>
          <p className="text-slate-600 mb-8">
            Join thousands of creators building their visual identity with CRAV Logo Studio.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Get Started Free
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <span className="font-bold">CRAV Logo Studio</span>
              </div>
              <p className="text-sm text-slate-600">
                Professional logo creation and brand identity tools.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/templates">Templates</Link></li>
                <li><Link href="/features">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-600">
            © 2025 CRAV Logo Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
