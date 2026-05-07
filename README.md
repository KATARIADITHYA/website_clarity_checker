# Clarity — Website Messaging Analyzer

An AI-powered tool that scores how clearly a website communicates its value to a first-time visitor. Paste any URL and get a 1–10 clarity score, a breakdown across five dimensions, and three actionable suggestions — powered by Claude.

---

## Getting Started

### Prerequisites

- Node.js 18+
- An Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/website_clarity_checker.git
cd website_clarity_checker

# Install dependencies
npm install

# Add your API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

# Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Other Commands

```bash
npm run build      # Production build
npm run start      # Run production build
npm run lint       # Lint the codebase
```

---

## Architecture

```
website_clarity_checker/
│
├── app/                          # Next.js 15 App Router
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # POST /api/analyze — calls Claude
│   ├── components/
│   │   ├── ClarityApp.tsx        # Main client UI (input, loading, result)
│   │   ├── ClarityApp.module.css # All UI styles
│   │   ├── ScoreRing.tsx         # Animated SVG score ring
│   │   ├── MetricBar.tsx         # Animated dimension bar
│   │   └── MetricBar.module.css
│   ├── globals.css               # Design tokens, fonts, animations
│   ├── layout.tsx                # Root layout + metadata
│   └── page.tsx                  # Entry point → renders ClarityApp
│
├── lib/
│   ├── config.ts                 # Reads ANTHROPIC_API_KEY from .env.local
│   ├── prompt.ts                 # Claude scoring prompt
│   ├── scraper.ts                # Fetches + extracts visible text from URL
│   └── types.ts                  # Shared TypeScript interfaces
│
├── .env.local                    # API key (git-ignored)
├── next.config.ts
├── tsconfig.json
└── package.json
```

### Request Flow

```
Browser
  │
  │  POST /api/analyze  { url }
  ▼
app/api/analyze/route.ts
  │
  ├── lib/scraper.ts        Fetches the URL server-side, strips HTML tags,
  │                         returns up to 3000 chars of visible copy
  │
  ├── lib/prompt.ts         Builds the Claude prompt with hostname + page text
  │
  └── Anthropic SDK         Sends to claude-sonnet-4-20250514, parses JSON
          │
          ▼
      { score, grade, rationale, metrics[5], summary, suggestions[3] }
          │
          ▼
     ClarityApp.tsx         Renders score ring, metric bars, summary, suggestions
```

### Key Design Decisions

| Decision | Reason |
|---|---|
| Server-side scraping | Avoids CORS issues; API key never exposed to browser |
| Claude API in route handler | Key read from `.env.local` at request time, not build time |
| CSS Modules | Scoped styles without Tailwind overhead |
| No database | Stateless — every analysis is a fresh Claude call |

---

## Scoring System

Each analysis scores the website on **five dimensions**, each rated 1–10. The overall score is a weighted average.

### The Five Dimensions

| Dimension | What it measures |
|---|---|
| **Value Proposition** | Is there a clear, specific statement of what the product does? |
| **Target Audience** | Is it immediately obvious who this is built for? |
| **Outcome Clarity** | Does the copy describe what users *achieve*, not just what the product does? |
| **Jargon & Buzzwords** | Is the language plain and concrete? (10 = zero jargon, 1 = buzzword soup) |
| **Call to Action** | Is the desired next step obvious and compelling? |

### Overall Score Scale

| Score | Grade | Meaning |
|---|---|---|
| 10 | A+ | Flawless — visitor knows in 5 seconds what it does, who it's for, and why it's better |
| 9 | A+ | Near-perfect — crystal clear on all five dimensions, trivial polish needed |
| 8 | A | Strong — clear value prop and audience, outcome implied but not explicit |
| 7 | B | Good — mostly clear, one dimension is noticeably weak or missing |
| 6 | C | Adequate — core idea present but requires effort; jargon slows comprehension |
| 5 | C | Mediocre — visitor has to think hard; audience or outcome is unclear |
| 4 | D | Weak — vague on what they do or who it's for; value is buried |
| 3 | D | Poor — hard to tell what the business does without prior knowledge |
| 2 | F | Very poor — generic; could apply to any company in the sector |
| 1 | F | Completely unclear — indecipherable to a first-time visitor |

### Score Color Coding

| Range | Color | Meaning |
|---|---|---|
| 8–10 | Teal | Clear |
| 6–7 | Amber | Adequate |
| 1–5 | Red | Needs work |

### Scoring Philosophy

Claude is instructed to **bias toward accuracy over flattery**. A polished-looking site with vague copy should score 5–6, not 8. Design quality does not influence the score — only the words on the page do.

---

## Tech Stack

- **Framework** — Next.js 15 (App Router)
- **Language** — TypeScript
- **AI** — Claude Sonnet (`claude-sonnet-4-20250514`) via Anthropic SDK
- **Styling** — CSS Modules with custom design tokens
- **Fonts** — DM Serif Display, DM Mono, Instrument Sans (Google Fonts)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key from console.anthropic.com |

---

## Limitations

- JavaScript-heavy SPAs (React/Next.js sites) return minimal HTML — Claude falls back to its training knowledge for well-known domains
- Only homepage text is analyzed — not subpages like `/pricing` or `/about`
- Images, videos, and visual design are not evaluated — text copy only
- Some sites block server-side fetch requests

---

## License

MIT
