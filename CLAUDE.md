# Tasteful Vibes - Portfolio Website

Portfolio website for Brian Edwards showcasing vibe coding expertise, projects, and freelance services.

## Tech Stack

- **Framework**: Astro with React islands
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages
- **AI**: Cloudflare Workers AI + Groq API for chat
- **Payments**: Stripe
- **Database**: Cloudflare D1 (for rate limiting chat)

## Project Structure

```
/
├── src/
│   ├── pages/           # Astro pages
│   ├── components/      # React/Astro components
│   ├── layouts/         # Page layouts
│   ├── content/         # Markdown content for projects
│   └── styles/          # Global styles
├── public/
│   └── screenshots/     # Project screenshots
├── projects/            # Git submodules of actual projects
├── functions/           # Cloudflare Workers functions
└── HUMAN-*.md           # Files requiring human input
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
wrangler pages dev   # Test with Workers locally
wrangler deploy      # Deploy to Cloudflare Pages
```

## Key Directories

- `src/content/projects/` - Project markdown files with frontmatter
- `projects/` - Git submodules of all portfolio projects
- `functions/api/` - Cloudflare Workers API endpoints

## Environment Variables

Required in `.env` (see HUMAN-SECRETS-NEEDED.md):
- `GROQ_API_KEY` - Groq AI API key for chat
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account
- `CLOUDFLARE_API_TOKEN` - Cloudflare API access
- `STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `STRIPE_SECRET_KEY` - Stripe secret key

## Content Guidelines

- No student PII in any content
- No secrets in committed code
- Dark mode preferred for screenshots
- Markdown files in `src/content/` for all project descriptions

## Git Workflow

- Main branch: `main`
- Feature branches: `feature/[name]`
- Use git worktrees for parallel development
- Document all work in GitHub issues
- Commit frequently with descriptive messages

## AI Chat Implementation

Each page has an embedded Groq AI chat that:
1. Is scoped to the content of that page
2. Limits users to 5 messages/day (localStorage tracking)
3. Answers questions about Brian and his work
4. Falls back gracefully if rate limited

## Project Verticals

Organize projects by target customer vertical:
- **Education**: Google Classroom automation, scheduling, student data
- **Healthcare**: Folk Care, med-record-space, scheduling systems
- **Music/Audio**: Bitwig plugins, audio processing, composition tools
- **Gaming**: Roblox development, game mechanics
- **E-commerce**: Shopify tools, inventory management
- **Data/ML**: Kaggle competitions, data visualization
- **Vibe Coding**: Meta-tools, Claude Code workflows

## Code Style

- TypeScript strict mode
- Prettier for formatting
- ESLint for linting
- Prefer functional components
- Use Astro components where possible, React for interactivity

## Testing

- Run `npm test` before commits
- Test chat rate limiting manually
- Verify all external links
- Check responsive design on mobile

## Deployment

1. Push to `main` triggers Cloudflare Pages deployment
2. Preview deployments for PRs
3. Production URL: https://tasteful-vibes.pages.dev

## Important Notes

- Never commit `.env` files
- Keep HUMAN-*.md files updated
- Update this file as architecture evolves
- Projects submodules are read-only references
