# Secrets and Keys Required

**STOP! I cannot proceed without these credentials.**

This project requires the following API keys, tokens, and secrets to function properly. Please provide them by creating a `.env` file (which is gitignored) with the values below.

## Required Immediately

### 1. Groq AI (for embedded chat on all pages)
```
GROQ_API_KEY=your_groq_api_key_here
```
- Get from: https://console.groq.com/keys
- Purpose: Powers the AI chat interface on every page, limited to 5 messages/day per visitor
- Cost: Free tier available

### 2. Cloudflare Workers AI
```
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
```
- Get from: https://dash.cloudflare.com/profile/api-tokens
- Purpose: Cloudflare Workers AI integration, Pages deployment
- Required permissions: Workers AI, Pages, D1 (if using database)
- Note: You mentioned wrangler is authenticated, but I need the account ID for the Workers AI binding

### 3. Stripe (for payment processing)
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```
- Get from: https://dashboard.stripe.com/apikeys
- Purpose: Accept payments for freelance services
- Start with test keys (pk_test_, sk_test_) for development

## Verification Needed

### Already Authenticated (confirm these work)
- [ ] `gh` CLI - GitHub access (confirmed working)
- [ ] `wrangler` - Cloudflare Workers CLI
- [ ] `kaggle` - Kaggle CLI for notebooks/competitions
- [ ] `vercel` - Vercel CLI
- [ ] `supabase` - Supabase CLI
- [ ] `neon` - Neon CLI

### Questions About Your Cloudflare Setup
1. Is your Cloudflare account on the free tier or paid?
2. Do you have Workers AI enabled on your account?
3. What is your Cloudflare account ID? (Find it in the dashboard URL or sidebar)

## How to Provide

Create a `.env` file in the root of this project:

```bash
# .env (DO NOT COMMIT)
GROQ_API_KEY=gsk_...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

Then run:
```bash
source .env
# or
export $(cat .env | xargs)
```

## Why I Need These Now

1. **Groq AI**: Core feature - every page has an AI chat that answers questions about you and your work
2. **Cloudflare**: Deployment target - can't deploy without account access
3. **Stripe**: Payment integration - you asked for Stripe setup for freelance services

## What Happens Without Them

Without these keys, I would have to:
- Mock the AI chat (you said "fail fast and ugly, do not shim or mock")
- Put placeholders for payment (you said "do not put placeholders")
- Skip core functionality (you said "DO NOT DOWNGRADE your work")

**I am stopping here until you provide these credentials.**

---

Once you've added the `.env` file, let me know and I'll continue building the full interactive portfolio site with:
- Embedded Groq AI chat on every page
- Cloudflare Workers AI integration
- Full project showcase with stats
- Stripe payment integration
- All your vibe coding content and project details
