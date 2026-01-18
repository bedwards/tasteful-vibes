import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    tailwind(),
  ],
  vite: {
    define: {
      'process.env.GROQ_API_KEY': JSON.stringify(process.env.GROQ_API_KEY),
    },
  },
});
