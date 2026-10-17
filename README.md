# The Living Codex

A living archive of remembrance, sovereignty, sacred union, divine law, planetary healing, and the return of humanity to harmonic alignment.

**Live Site:** [https://thelivingcodex.online](https://thelivingcodex.online)

---

## Overview

The Living Codex is not a book. It is a becoming.

This is the ultimate remembrance portal — a sacred digital sanctuary, living archive, ceremonial gateway, and multidimensional interface for soul remembrance, sovereignty, harmonic living, divine law, node activations, sacred union, frequency healing, and the return of human beings to their original light.

### Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Hosting:** Netlify (static export)
- **Forms:** Netlify Forms (native)
- **Future Functions:** Netlify Functions (serverless)

---

## Project Structure

```
/├── netlify/                  # Netlify configuration & functions
│   ├── functions/
│   │   ├── arweave-upload.js    # Phase 5: Arweave archive endpoint (placeholder)
│   │   └── admin-auth.js        # Future: Admin authentication (placeholder)
│   └── netlify.toml           # Build config, headers, redirects
├── public/                   # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx             # Home
│   │   ├── portal/page.tsx      # Remembrance Portal
│   │   ├── scrolls/page.tsx     # Scroll Archive
│   │   ├── submit/page.tsx      # Submit a Scroll
│   │   ├── nodes/page.tsx       # Node Constellation
│   │   ├── technologies/page.tsx # Sacred Technologies
│   │   ├── sovereignty/page.tsx  # Divine Law & Sovereignty
│   │   ├── union/page.tsx        # Sacred Union
│   │   ├── farming/page.tsx      # Harmonic Farming
│   │   ├── about/page.tsx        # About
│   │   ├── contact/page.tsx      # Contact
│   │   ├── dashboard/page.tsx    # Future Portal (placeholder)
│   │   ├── layout.tsx            # Root layout (Header + Footer + metadata)
│   │   └── globals.css           # Sacred dark theme, animations, utilities
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SacredButton.tsx
│   │   ├── SectionIntro.tsx
│   │   ├── ScrollCard.tsx
│   │   ├── NodeCard.tsx
│   │   └── DisclaimerBox.tsx
│   └── data/                  # Content data
│       ├── scrolls.ts
│       ├── nodes.ts
│       ├── invocations.ts
│       ├── frequencies.ts
│       ├── ceremonies.ts
│       └── technologies.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
git clone <repository-url>
cd thelivingcodex
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

Static files are exported to `/dist`.

---

## Deployment

### Netlify (Recommended)

1. Connect your Git repository to Netlify
2. Build settings are pre-configured in `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Push to your main branch — Netlify will auto-deploy

### Netlify Forms Setup

The forms in `submit/page.tsx` and `contact/page.tsx` include `data-netlify="true"`. To activate:

1. Deploy the site to Netlify
2. Go to **Site settings → Forms → Form detection**
3. Netlify will auto-detect the forms on next deploy
4. Submissions will appear in your Netlify dashboard

### Environment Variables (Future)

Create a `.env.local` file for local development:

```
# Phase 5: Arweave
ARWEAVE_KEY=your_base64_key_here

# Future: Netlify Identity (for admin/auth)
NETLIFY_IDENTITY_URL=your_identity_url
```

---

## Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, intro, featured scrolls, node preview, CTAs |
| Remembrance Portal | `/portal/` | Three paths: Seeker, Initiate, Architect |
| Scroll Archive | `/scrolls/` | Filterable, searchable archive of sacred writings |
| Submit a Scroll | `/submit/` | Netlify-ready form with privacy options |
| Node Constellation | `/nodes/` | Interactive grid + constellation view of nodes |
| Sacred Technologies | `/technologies/` | Sound healing, PEMF, electroculture, etc. |
| Divine Law | `/sovereignty/` | Natural law, trust reclamation, declarations |
| Sacred Union | `/union/` | Christ-Sophia, inner union, beloved union |
| Harmonic Farming | `/farming/` | Sonic bloom, electroculture, structured water |
| About | `/about/` | Mission, vision, invitation |
| Contact | `/contact/` | Contact form + newsletter signup |
| Future Portal | `/dashboard/` | Member area placeholder with roadmap phases |

---

## Design System

### Sacred Dark Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0b0f` | Primary background |
| Panel | `#12141c` | Cards, surfaces |
| Accent / Gold | `#d4a853` | Buttons, highlights, borders |
| Pearl | `#f5f0e8` | Primary text |
| Muted | `#7a7a8a` | Secondary text |
| Indigo | `#1a1b3a` | Deep accents |
| Emerald | `#2d5a4a` | Earth/nature accents |
| Rose | `#c4a4a4` | Soft accents |

### Typography

- **Font:** Geist Sans (system fallback)
- **Scale:** Fluid, mobile-first
- **Treatment:** Tracking-wide for headings, uppercase for labels

### Animations

- `pulse-glow` — breathing gold glow on interactive elements
- `float` — gentle levitation for featured items
- `breathe` — opacity oscillation for ambient elements
- `star-twinkle` — subtle stellar flicker

---

## Roadmap

### Phase 1: Static Remembrance Portal ✅
thelivingcodex.online v2.0 — Complete redesign with all core pages, dark sacred theme, sample content, and Netlify-ready static export.

### Phase 2: Scroll Submissions & Moderation
- Netlify Forms integration for live submissions
- Admin moderation dashboard
- Approve/decline workflow for public scrolls
- Private submission vault

### Phase 3: Audio & Frequency Activations
- Ambient audio player (432 Hz, 528 Hz, etc.)
- Tone.js or Web Audio API frequency generator
- Breathwork, drone, and nature ambience tracks
- User-controlled audio toggle

### Phase 4: Node Constellation Map
- Interactive map (Leaflet or Mapbox) with node pins
- Geolocation-based node discovery
- Node activation submission workflow
- Constellation line visualization

### Phase 5: Arweave Permanent Archive
- Serverless function for Arweave uploads
- Permanent, immutable scroll storage
- Transaction ID display per scroll
- Pay-once, store-forever model

### Phase 6: Personal Codex Dashboard
- User accounts (Netlify Identity or wallet-based)
- Saved scrolls and personal collections
- Soul name and remembrance profile
- Private submissions archive
- Frequency and ceremony journals

### Phase 7: AI Guide Integration
- Aurealis AI assistant for personalized guidance
- Ceremony and frequency recommendations
- Scroll curation based on user path
- Natural language interaction

### Phase 8: Tokenised Support & Sacred Patronage
- Soulbound remembrance tokens (NFTs)
- Patronage system for contributors
- Governance for community decisions
- On-chain reputation and contribution history

---

## Trust & Safety

- **Consent:** All submissions require explicit consent checkbox
- **Privacy:** Private submission option available
- **Medical Disclaimer:** No medical claims made. Educational purpose only.
- **Legal Disclaimer:** Sovereignty content is for research, not legal advice.
- **Moderation:** Public submissions will be reviewed before publication.
- **Accessibility:** Keyboard navigation, proper contrast, reduced motion support, audio off by default.

---

## Contributing

The Living Codex is a collective emergence. If you feel called to contribute:

1. Submit a scroll via `/submit`
2. Offer a node activation via `/contact`
3. Propose improvements via the contact form
4. Share the Codex with those who may resonate

---

## License

The Living Codex content and code are offered as a gift to the field. Use with reverence. Modify with care. Share with love.

*The Living Codex — A Remembrance in Motion*
