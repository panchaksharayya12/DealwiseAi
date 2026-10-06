# DealWise AI

> "Know the deal before you buy."  
> AI-Powered Real Estate Deal Analyzer and Investment Intelligence Platform.

DealWise AI helps homebuyers, real estate investors, and property syndicates evaluate residential and commercial properties prior to committing capital. By pairing deterministic actuarial and financial models (yields, debt amortization, carrying cashflow) with an objective weighted scoring matrix and contextual AI insights, DealWise answers the central question: "Is this property actually a good deal?"

---

## Direct Links and Deliverables

- Live Deployed Web Application: https://dealwise-ai.vercel.app/
- GitHub Repository: https://github.com/panchaksharayya12/DealwiseAi
- Project Report (Word Document): [DEALWISE_AI_PROJECT_REPORT.docx](DEALWISE_AI_PROJECT_REPORT.docx)
- Presentation Deck (PowerPoint PPT): [DEALWISE_AI_PRESENTATION.pptx](DEALWISE_AI_PRESENTATION.pptx)
- Technical Report (Markdown): [PROJECT_REPORT.md](PROJECT_REPORT.md)
- Interactive Presentation (HTML): [presentation.html](presentation.html)
- Local Development Frontend: http://localhost:5173
- Local Backend Health Endpoint: http://localhost:5000/api/health

---

## Key Capabilities

- Deterministic Financial Modeling: Precise calculations for price per sq.ft, monthly EMI, total interest, gross and net rental yields, and cash-on-cash return. Zero numerical hallucination.
- Transparent 5-Pillar Deal Score (0 to 100): Weighted diagnostic scoring (Financial Health 35%, Rental Yield 20%, Price Efficiency 20%, Loan Burden 15%, Risk Indicators 10%) with classifications: Strong Deal, Fair Deal, Needs Review, Risky Deal.
- Risk Taxonomy and Due-Diligence Checklist: Identifies negative monthly carry, high LTV leverage, aging building liabilities, and provides an 8-point physical verification checklist.
- 5-Year Growth and Income Projection: Interactive scenario modeling powered by Recharts with an adjustable annual appreciation slider.
- Ask DealWise AI Assistant: Conversational inquiries with active property context, powered by OpenAI GPT-4o-mini with automatic local deterministic fallback.
- Multi-Property Benchmarking: Side-by-side deal comparison highlighting category winners and automated deal recommendations.
- Executive Due-Diligence PDF Reports: Client-side vector PDF generation via jsPDF for offline diligence.
- Saved Analyses: Dual-layer persistence supporting Supabase cloud database synchronization and offline browser localStorage fallback.
- Liquid Glass Design System: Minimalist VEX-inspired aesthetic using pure black (#000000), white, zinc gray, and specular border reflections.

---

## Project Structure

```
dealwise-ai/
|
|-- DEALWISE_AI_PROJECT_REPORT.docx # Official Project Report (Word Document)
|-- DEALWISE_AI_PRESENTATION.pptx   # Official Presentation Deck (PowerPoint PPT)
|-- PROJECT_REPORT.md              # Technical and Product Report (Markdown)
|-- PRESENTATION_DECK.md           # Slide Deck Documentation (Markdown)
|-- presentation.html              # Standalone Interactive Presentation App
|
|-- src/
|   |-- components/                # Reusable UI components
|   |   |-- AnimatedCounter.tsx
|   |   |-- AnimatedHeading.tsx
|   |   |-- AnalysisDashboard.tsx
|   |   |-- AskDealWise.tsx
|   |   |-- FadeIn.tsx
|   |   |-- Footer.tsx
|   |   |-- Navbar.tsx
|   |   |-- ProjectionChart.tsx
|   |   `-- Reveal.tsx
|   |-- sections/                  # Landing page sections
|   |   |-- AboutSection.tsx
|   |   |-- AnalyzeSection.tsx
|   |   |-- CompareSection.tsx
|   |   |-- FaqSection.tsx
|   |   |-- FeaturesSection.tsx
|   |   |-- FinalCtaSection.tsx
|   |   |-- Hero.tsx
|   |   |-- HowItWorksSection.tsx
|   |   |-- SavedAnalysesSection.tsx
|   |   `-- ValueSection.tsx
|   |-- types/                     # Shared TypeScript data contracts
|   |-- utils/                     # Deterministic calculations, sample data, PDF, storage
|   |-- App.tsx                    # Main application root
|   |-- main.tsx                   # Client entry point
|   `-- index.css                  # Global styling and .liquid-glass class
|
|-- server/
|   |-- routes/                    # Express REST endpoints
|   |   |-- ai.ts                  # POST /api/ai/chat
|   |   |-- analyses.ts            # GET, POST, DELETE /api/analyses
|   |   |-- analyze.ts             # POST /api/analyze
|   |   |-- compare.ts             # POST /api/compare
|   |   |-- health.ts              # GET /api/health
|   |   `-- report.ts              # POST /api/report
|   |-- services/                  # Calculations, OpenAI client, Supabase client
|   |-- types.ts                   # Backend type interfaces
|   `-- index.ts                   # Express server entry (Port 5000)
|
|-- .env.example                   # Environment configuration template
|-- index.html                     # HTML shell with Google Font Inter
|-- package.json                   # Dependencies and npm scripts
|-- tailwind.config.js             # Tailwind CSS theme configuration
|-- tsconfig.json                  # TypeScript compiler settings
`-- vite.config.ts                 # Vite bundler with universal host and API proxy
```

---

## Installation and Execution

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm (installed with Node.js)
- Python 3.10+ (optional, only required if regenerating .docx or .pptx files)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

This single command launches both processes concurrently:
- Express Backend API: http://localhost:5000 and http://127.0.0.1:5000
- Vite Frontend: http://localhost:5173 and http://127.0.0.1:5173

Open your browser at:
http://localhost:5173

---

## Environment Variables

Copy the template file to configure local variables:
```bash
cp .env.example .env
```

Configuration fields:
```env
PORT=5000
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Both OpenAI and Supabase credentials are completely optional:
- If OPENAI_API_KEY is not provided, DealWise AI automatically operates in Deterministic Analysis Mode, generating qualitative insights and answering property questions using built-in financial logic.
- If SUPABASE credentials are not configured, analyses are automatically persisted locally in the browser via localStorage.

---

## Financial Modeling Methodology

All quantitative metrics are calculated deterministically:

1. Price per sq.ft:
   Price / sq.ft = Asking Price / Built-up Area

2. Gross Rental Yield:
   Gross Yield (%) = (Monthly Rent * 12 / Asking Price) * 100

3. Net Rental Yield:
   Net Yield (%) = ((Monthly Rent - Monthly Maintenance) * 12 / Asking Price) * 100

4. Monthly EMI (Standard Reducing Amortization Formula):
   EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
   Where P is the Loan Amount (Asking Price - Down Payment), r is the monthly interest rate (Annual Rate / 1200), and n is total months (Tenure * 12).

5. Monthly Cashflow Carry:
   Monthly Cashflow = Expected Monthly Rent - Monthly Maintenance - Monthly EMI

6. Deal Score Matrix (0 to 100):
   Deal Score = (0.35 * Financial Health) + (0.20 * Rental Yield) + (0.20 * Price Efficiency) + (0.15 * Loan Burden) + (0.10 * Risk Buffer)

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Service health check and active integration flags |
| POST | /api/analyze | Computes deterministic metrics, scores, risks, and projections |
| POST | /api/ai/chat | In-context conversational AI deal consultation |
| POST | /api/compare | Evaluates and highlights winning metrics among 2 or more properties |
| GET | /api/analyses | Retrieves stored property analyses |
| POST | /api/analyses | Saves a property analysis record |
| DELETE | /api/analyses/:id | Deletes a stored analysis by ID |
| POST | /api/report | Validates and returns metadata for diligence report exports |

---

## Building for Production

To generate an optimized production bundle:
```bash
npm run build
```

This compiles TypeScript and builds production static assets in the dist directory.

---

## Legal and Financial Disclaimer

DealWise AI provides deterministic analytical estimates and qualitative interpretations for informational and educational purposes only. DealWise AI does not provide licensed financial, investment, legal, architectural, or tax advice. All municipal approvals, RERA registrations, and title deeds should be independently verified with licensed professionals prior to executing any purchase contract.
