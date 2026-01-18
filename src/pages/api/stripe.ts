import type { APIRoute } from 'astro';

export const prerender = false;

interface PricingOption {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  mode: 'payment' | 'subscription';
}

const PRICING_OPTIONS: Record<string, PricingOption> = {
  'consultation': {
    id: 'consultation',
    name: 'Initial Consultation',
    description: '1-hour video call to discuss your project, requirements, and vibe coding approach',
    price: 15000, // $150
    mode: 'payment',
  },
  'workflow-audit': {
    id: 'workflow-audit',
    name: 'Workflow Audit',
    description: 'Comprehensive review of your development process with AI acceleration recommendations',
    price: 50000, // $500
    mode: 'payment',
  },
  'workshop-half': {
    id: 'workshop-half',
    name: 'Half-Day Workshop',
    description: '4-hour hands-on workshop for your team on vibe coding with Claude Code',
    price: 150000, // $1,500
    mode: 'payment',
  },
  'workshop-full': {
    id: 'workshop-full',
    name: 'Full-Day Workshop',
    description: '8-hour intensive workshop with practical exercises on your actual codebase',
    price: 250000, // $2,500
    mode: 'payment',
  },
  'retainer-basic': {
    id: 'retainer-basic',
    name: 'Basic Retainer',
    description: '10 hours/month of consulting, code reviews, and async support',
    price: 200000, // $2,000/month
    mode: 'subscription',
  },
  'retainer-pro': {
    id: 'retainer-pro',
    name: 'Pro Retainer',
    description: '25 hours/month including pair programming sessions and priority support',
    price: 450000, // $4,500/month
    mode: 'subscription',
  },
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId || !PRICING_OPTIONS[priceId]) {
      return new Response(JSON.stringify({ error: 'Invalid price option' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Access Cloudflare environment from locals.runtime.env
    const runtime = (locals as any).runtime;
    const stripeSecretKey = runtime?.env?.STRIPE_SECRET_KEY || import.meta.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not configured');
      return new Response(JSON.stringify({ error: 'Payment system not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const option = PRICING_OPTIONS[priceId];

    // Create Stripe checkout session via API
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': option.mode,
        'success_url': successUrl || `${new URL(request.url).origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': cancelUrl || `${new URL(request.url).origin}/payment/cancel`,
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': option.name,
        'line_items[0][price_data][product_data][description]': option.description,
        'line_items[0][price_data][unit_amount]': option.price.toString(),
        ...(option.mode === 'subscription' ? {
          'line_items[0][price_data][recurring][interval]': 'month',
        } : {}),
        'line_items[0][quantity]': '1',
        'payment_method_types[0]': 'card',
        'customer_email': body.email || '',
      }).toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      console.error('Stripe API error:', errorText);
      return new Response(JSON.stringify({ error: 'Payment session creation failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const session = await stripeResponse.json();

    return new Response(JSON.stringify({
      sessionId: session.id,
      url: session.url,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Stripe API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// GET endpoint to retrieve pricing options
export const GET: APIRoute = async () => {
  const options = Object.values(PRICING_OPTIONS).map(opt => ({
    id: opt.id,
    name: opt.name,
    description: opt.description,
    price: opt.price / 100, // Convert cents to dollars for display
    mode: opt.mode,
  }));

  return new Response(JSON.stringify({ options }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
