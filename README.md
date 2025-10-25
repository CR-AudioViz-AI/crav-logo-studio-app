# CRAV Logo Studio

A professional AI-powered logo creation and brand kit generator built with Next.js, Supabase, and Stripe.

## Features

- **AI Logo Generation**: Generate custom logos using AI with natural language descriptions
- **Credit-Based System**: Wallet and ledger system for managing credits
- **Project Management**: Create, edit, and organize logo projects
- **Vector Editor**: Edit and customize generated logos
- **Stripe Integration**: Purchase credit packs and subscriptions
- **Authentication**: Secure auth with Supabase
- **Export Options**: Export logos in multiple formats (SVG, PNG, PDF)

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **State Management**: Zustand
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Storage**: Supabase Storage

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- Supabase account
- Stripe account (for payments)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Local Development

1. **Clone the repository**

```bash
git clone https://github.com/your-org/crav-logo-studio.git
cd crav-logo-studio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials.

4. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Database Setup

The database schema is managed through Supabase migrations located in `supabase/migrations/`. The following tables are created:

- `users` - User profiles
- `wallets` - Credit balances
- `ledger_entries` - Transaction history
- `projects` - Logo projects
- `revisions` - Project version history
- `assets` - Project assets
- `orders` - Payment orders
- `subscriptions` - User subscriptions
- `templates` - Logo templates
- `shares` - Project sharing

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git init
git add -A
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:your-org/crav-logo-studio.git
git push -u origin main
```

2. **Deploy to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables from your `.env` file
- Deploy

### Deploy to Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**

- Go to [netlify.com](https://netlify.com)
- Create new site from Git
- Select your repository
- Build settings:
  - Build command: `npm run build`
  - Publish directory: `.next`
- Add environment variables
- Deploy

## Stripe Setup

1. **Create Stripe Products**

Create the following products in your Stripe Dashboard:

- Credit Packs:
  - 200 Credits - $9
  - 500 Credits - $19
  - 1000 Credits - $35

2. **Set up Webhooks**

Add a webhook endpoint in Stripe Dashboard:
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

3. **Copy Webhook Secret**

Add the webhook signing secret to your environment variables as `STRIPE_WEBHOOK_SECRET`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
crav-logo-studio/
├── app/                    # Next.js app directory
│   ├── (app)/             # Protected app routes
│   │   ├── projects/      # Projects page
│   │   ├── editor/        # Logo editor
│   │   ├── billing/       # Billing and credits
│   │   ├── settings/      # User settings
│   │   └── admin/         # Admin dashboard
│   ├── (site)/            # Public marketing pages
│   ├── api/               # API routes
│   ├── sign-in/           # Auth pages
│   └── sign-up/
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client config
│   ├── auth.ts           # Auth helpers
│   ├── wallet.ts         # Wallet operations
│   ├── stripe.ts         # Stripe helpers
│   └── types.ts          # TypeScript types
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Features in Detail

### Credit System

- Users receive 50 free credits upon signup
- Logo generation costs 5 credits per generation
- Credits can be purchased through Stripe
- All transactions are recorded in the ledger

### AI Logo Generation

- Users describe their desired logo
- System generates 4 variations
- Users can select and create a project from any variation
- Supports different styles and themes

### Project Management

- Create unlimited projects
- Track project status (DRAFT, ACTIVE, ARCHIVED)
- Manage visibility (PRIVATE, LINK, PUBLIC)
- Version history through revisions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Proprietary - CRAV Audio Visual AI

## Support

For support, email support@craudiovizai.com or open an issue in the GitHub repository.

<!-- Deployment triggered: 2025-10-25 01:27:27 UTC -->


<!-- Preview Deployment Trigger: 2025-10-25 02:09:14 -->

<!-- Preview Deploy: 2025-10-25 02:25:12 -->
