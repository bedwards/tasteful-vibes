/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly GROQ_API_KEY: string;
  readonly STRIPE_PUBLISHABLE_KEY: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly CLOUDFLARE_ACCOUNT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
