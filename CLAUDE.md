# Tasteful Vibes - Portfolio Website

Comprehensive marketing portfolio for Brian Edwards - Vibe Coding Expert & AI-First Developer.

**Live Site**: https://tasteful-vibes.pages.dev
**GitHub**: https://github.com/bedwards/tasteful-vibes

## Philosophy

This is a LARGE, comprehensive marketing site. Always add content, never remove. Tackle large scope. The site should scare readers into action - they will be outcompeted if they don't embrace vibe coding.

## Tech Stack

- **Framework**: Astro (static + server routes)
- **Styling**: Tailwind CSS with custom terminal theme
- **Hosting**: Cloudflare Pages
- **AI Chat**: Groq API (via server-side API route)
- **Payments**: Stripe (pending implementation)

## Project Structure

```
/
├── src/
│   ├── pages/           # Astro pages
│   │   ├── api/         # Server-side API routes (prerender: false)
│   │   └── *.astro      # Static pages
│   ├── components/      # Astro components (vanilla JS, no React)
│   ├── layouts/         # Page layouts
│   └── styles/          # Global CSS with terminal theme
├── public/              # Static assets
│   └── screenshots/     # Project screenshots (HUMAN-SCREENSHOTS-NEEDED.md)
├── projects/            # Git submodules (TODO: issue #3, #20)
├── HUMAN-*.md           # Files requiring human input
└── dist/                # Build output (gitignored)
```

## Commands

```bash
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run preview                       # Preview production build
npx wrangler pages deploy dist        # Deploy to Cloudflare
gh issue list                         # View GitHub issues
gh api rate_limit --jq '.resources.graphql'  # Check API rate limits
```

## Design Decisions (Confirmed via User Questions)

- **Style**: Terminal/coder aesthetic, dark mode, monospace fonts
- **Tone**: AGGRESSIVE - provocative thought leader, urgent about AI adoption
- **Pricing**: HIDDEN - contact for quotes, builds exclusivity
- **Primary CTA**: EMAIL CONTACT - direct for serious inquiries
- **Blog**: AGGREGATE SUBSTACKS - pull in posts from 8 Substacks

## Verticals

Create dedicated pages for each target customer:
- `/education` - Google Classroom, scheduling, attendance (issue #14)
- `/healthcare` - Folk Care, EVV, HIPAA compliance (issue #15)
- `/music` - Bitwig plugins, VST/CLAP in Rust (issue #16)
- `/gaming` - Roblox, MCP servers (issue #17)
- `/data` - Kaggle, PyTorch, visualization (issue #18)
- `/ecommerce` - Shopify, distributed commerce (issue #9)
- `/enterprise` - MSP, workflow automation (issue #19)

## Environment Variables

Stored in `.env` (gitignored):
- `GROQ_API_KEY` - AI chat
- `STRIPE_PUBLISHABLE_KEY` - Payments (client-safe)
- `STRIPE_SECRET_KEY` - Payments (server-only)
- `CLOUDFLARE_ACCOUNT_ID` - Deployment

Set Cloudflare secrets:
```bash
npx wrangler pages secret put GROQ_API_KEY --project-name tasteful-vibes
```

## GitHub Issues

All work is tracked in GitHub issues. Always create issues for new features.

**Completed:**
- ~~#4: Build homepage~~ ✅
- ~~#5: AI chat implementation~~ ✅

**Key Open Issues:**
- #2: Integrate Substack feeds
- #3: Git submodule all repos
- #6: Stripe payment integration
- #14-19: Vertical pages (Education, Healthcare, Music, Gaming, Data Science, Enterprise)
- #20: Comprehensive project statistics
- #21: Testimonials section
- #22: Claude session logs and prompts
- #23: Animated terminal typing effect (NEW)
- #24: Interactive code playground (NEW)
- #25: Live GitHub activity feed (NEW)
- #26: Video demos of vibe coding (NEW)

## Values (MUST PRESERVE)

**Will work with:**
- Open source projects
- Charitable organizations
- Music & arts
- Gaming (Roblox, etc.)
- Environmental causes
- Science & AI research
- Education technology

**Will NOT work with:**
- Defense contractors
- US federal government contracts

### Articulated Values (from user questionnaire)

**No Defense Contracts - Why:**
- Ethical pacifism - fundamental opposition to military applications
- Personal history shaped this conviction
- Preference for civilian/humanitarian tech
- Political stance against current military/defense policies

**No Federal Government - Why:**
- Bureaucracy incompatible with vibe coding speed
- Political disagreement with federal policies
- Avoid security clearance requirements
- Prefer autonomy from government oversight

**Open Source - Why:**
- Community impact - work benefits many, not just one company
- Transparency - believe in open, auditable code
- Learning & sharing - collective knowledge growth
- Anti-monopoly - counterbalance big tech consolidation

**Charitable Causes Priority:**
- Healthcare access (Folk Care mission)
- Education equity through technology
- Environmental/climate action
- Local community and mutual aid

**Music:**
- Active musician
- Technical interest in audio engineering, VST plugins
- Creative fuel while coding
- Industry passion - build tools for musicians

**Environment:**
- Climate urgency - AI can help solve crisis
- Sustainable tech and efficiency
- Local ecology and conservation
- Anti-waste (oppose crypto mining, etc.)

**Science/AI:**
- Capability frontier - watching breakthroughs happen
- Practical applications (vibe coding)
- Democratization - powerful AI accessible to all
- Understanding intelligence - fundamental questions

**Scare Tactics Marketing:**
- Genuine concern - people falling dangerously behind
- Competitive advantage - early adopters win
- Industry transformation - adapt or die
- Personal mission to spread vibe coding

## Client Engagement

**Engagement Models:**
- Project-based fixed price
- Hourly consulting
- Retainer arrangements
- Equity/revenue share for startups

**Pricing Approach:** Value-based messaging (focus on ROI, not hourly rates)

**Ideal Clients:**
- Startups needing MVP fast
- Established teams needing training
- Non-profits/mission-driven orgs
- Solo founders/indie hackers

**Training Approach:**
- Hands-on workshops (build something real together)
- Pair programming on their codebase
- Ongoing mentorship with regular check-ins
- NO recorded courses - personal approach only

## Design Preferences

**Animation:** Minimal - subtle hovers, basic transitions
**Content Density:** Progressive - sparse to dense as you scroll
**Features to Add:**
- Animated terminal typing effect
- Interactive code playground
- Live GitHub activity feed
- Video demos of vibe coding

**Avoid:**
- Stock photos
- Corporate buzzwords
- Gimmicky animations
- Generic icons

## Key People to Reference

- Andrej Karpathy (coined "vibe coding")
- Boris Cherny (head of Claude Code at Anthropic)
- Nate B Jones (AI hiring/career advice)
- Sholto Douglas (Anthropic)

## Substacks to Aggregate (Issue #2)

1. https://vibingcode.substack.com (Vibing Code)
2. https://neighborhoodlab.substack.com (Neighborhood Lab | Folk Care)
3. https://graphyard.substack.com (Graphyard)
4. https://lluminate.substack.com (LLuMinate)
5. https://unaccounted.substack.com (Unaccounted)
6. https://schmidhuber.substack.com (Schmidhuber)
7. https://weeklyvibe.substack.com (Weekly Vibe)
8. https://codingvibe.substack.com (Coding Vibe)

## AI Chat Implementation

- Groq API with llama-3.1-70b-versatile model
- 5 messages/day limit (localStorage tracking)
- Context injection per page
- Server-side API route at `/api/chat`
- Vanilla JS component (no React for Cloudflare compatibility)

## Important Rules

1. **Never remove content** - always add
2. **Keep CLAUDE.md and README.md up to date**
3. **Create GitHub issues for all new work**
4. **Commit and push frequently**
5. **No placeholders** - full content only
6. **No secrets in committed code**
7. **Aggressive marketing tone** throughout
8. **Large scope** - this is a comprehensive site

## Content Guidelines

- No student PII in any content
- No secrets in committed code
- Dark mode preferred for screenshots
- Redact personal information in examples

## Deployment

1. Build: `npm run build`
2. Deploy: `npx wrangler pages deploy dist --project-name tasteful-vibes`
3. Production URL: https://tasteful-vibes.pages.dev
4. Secrets are set via Cloudflare dashboard or wrangler CLI
