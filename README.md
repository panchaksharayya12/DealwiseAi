# DealWise AI

> **"Know the deal before you buy."**  
> AI-Powered Real Estate Deal Analyzer & Investment Intelligence Platform.

DealWise AI helps homebuyers, real estate investors, and property enthusiasts evaluate properties before committing capital. By combining deterministic mathematical models (yields, amortization, cashflow) with an objective scoring matrix and AI-powered insights, DealWise answers the central question: **"Is this property actually a good deal?"**

---

## 🌟 Key Features

- **Deterministic Financial Engine**: Precision calculations for price per sq.ft, monthly EMI, total interest, gross/net rental yields, and cash-on-cash return.
- **Transparent Deal Score (0–100)**: Weighted score (Financial Health 35%, Rental Yield 20%, Price Efficiency 20%, Loan Burden 15%, Risk Indicators 10%) with classifications: *Strong Deal*, *Fair Deal*, *Needs Review*, *Risky Deal*.
- **Risk Taxonomy & Due-Diligence Checklist**: Identifies negative monthly carry, high LTV leverage, aging building risks, and provides a 8-point physical verification checklist.
- **5-Year Growth & Income Projection**: Interactive scenario modeling powered by Recharts with adjustable annual appreciation assumptions.
- **Ask DealWise AI Assistant**: Interactive conversational inquiries with active property context (supports OpenAI GPT-4o-mini with deterministic local fallback).
- **Side-by-Side Property Comparison**: Benchmark multiple properties head-to-head with automated category winners.
- **Deal Report PDF Generation**: One-click download of executive-grade investment diligence reports.
- **Saved Analyses ("My Analyses")**: Persistent deal archiving with optional Supabase database sync and automatic localStorage fallback.
- **Cinematic VEX-Inspired Design**: Raw background hero video, liquid glass styling (`.liquid-glass`), character-by-character animations, and zero distracting gradients.

---

## 🏗️ Project Structure

```
dealwise-ai/
│
├── src/
│   ├── components/            # Reusable UI widgets
│   │   ├── AnimatedCounter.tsx   # Smooth numeric counter
│   │   ├── AnimatedHeading.tsx   # Char-by-char hero animation
│   │   ├── AnalysisDashboard.tsx # Comprehensive metrics dashboard
│   │   ├── AskDealWise.tsx       # Interactive property AI assistant
│   │   ├── FadeIn.tsx            # Configurable fade-in component
│   │   ├── Footer.tsx            # Global footer with working anchors
│   │   ├── Navbar.tsx            # Liquid glass floating navbar
│   │   ├── ProjectionChart.tsx   # Recharts 5-year scenario model
│   │   └── Reveal.tsx            # IntersectionObserver scroll entrance
│   ├── sections/              # Landing page sections
│   │   ├── AboutSection.tsx
│   │   ├── AnalyzeSection.tsx
│   │   ├── CompareSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── FinalCtaSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── SavedAnalysesSection.tsx
│   │   └── ValueSection.tsx
│   ├── types/                 # Shared TypeScript interfaces
│   ├── utils/                 # Deterministic calculations, sample data, PDF, storage
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Client React DOM entry
│   └── index.css              # Global styles & .liquid-glass definition
│
├── server/
│   ├── routes/                # Express REST endpoints
│   │   ├── ai.ts              # POST /api/ai/chat
│   │   ├── analyses.ts        # GET, POST, DELETE /api/analyses
│   │   ├── analyze.ts         # POST /api/analyze
│   │   ├── compare.ts         # POST /api/compare
│   │   ├── health.ts          # GET /api/health
│   │   └── report.ts          # POST /api/report
│   ├── services/              # Calculations, OpenAI, Supabase clients
│   ├── types.ts               # Server data contracts
│   └── index.ts               # Express server entry point (Port 5000)
│
├── .env.example               # Environment variables template
├── index.html                 # HTML shell with Inter Google Font
├── package.json               # Dependencies and run scripts
├── tailwind.config.js         # Tailwind color and typography theme
├── tsconfig.json              # TypeScript compilation setup
└── vite.config.ts             # Vite bundler with /api proxy
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (installed with Node)

### 2. Installation
Open your terminal in the `dealwise-ai` folder and run:
```bash
npm install
```

### 3. Running the Application Locally
Run the combined development server with:
```bash
npm run dev
```

This single command starts:
- **Express Backend**: Running on `http://localhost:5000`
- **Vite Frontend**: Running on `http://localhost:5173` (with `/api` proxy automatically routing requests to backend)

Open your browser at:
```
http://localhost:5173
```

---

## ⚙️ Environment Variables

Create a file named `.env` in the root folder (or copy from `.env.example`):

```bash
cp .env.example .env
```

Default configuration in `.env`:
```env
PORT=5000
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

> **Note**: Both `OPENAI_API_KEY` and `SUPABASE_*` credentials are completely **optional**.
> - If `OPENAI_API_KEY` is not provided, DealWise AI automatically runs in **Deterministic Analysis Mode**, using built-in financial intelligence without crashing.
> - If `SUPABASE_*` is not configured, analyses are saved locally in the browser's **localStorage** automatically.

---

## 🗄️ Supabase Configuration (Optional)

If you wish to store property evaluations in Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run this SQL script:

```sql
create table if not exists public.property_analyses (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  property_name text not null,
  location text not null,
  property_data jsonb not null,
  financial_metrics jsonb not null,
  deal_score jsonb not null,
  ai_analysis jsonb not null
);

-- Optional Row Level Security
alter table public.property_analyses enable row level security;
create policy "Allow anonymous all access" on public.property_analyses
  for all using (true) with check (true);
```

3. Copy your project's URL and Anon Key into `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

## 🤖 OpenAI Configuration (Optional)

To enable GPT-4o-mini real-time conversational analysis:
1. Get an API key from [platform.openai.com](https://platform.openai.com).
2. Add it to `.env`:
```env
OPENAI_API_KEY=sk-...
```

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check, service status, and active integrations |
| `POST` | `/api/analyze` | Calculates financial metrics, scores, risks, and projections |
| `POST` | `/api/ai/chat` | AI conversational Q&A given property context and numbers |
| `POST` | `/api/compare` | Evaluates and highlights winners among 2+ properties |
| `GET` | `/api/analyses` | Fetches saved analyses list |
| `POST` | `/api/analyses` | Saves a property analysis record |
| `DELETE` | `/api/analyses/:id`| Deletes a saved analysis by ID |
| `POST` | `/api/report` | Returns formatted metadata for deal PDF reports |

---

## 🧮 How Calculations Work

All quantitative outputs are calculated deterministically:

1. **Price per sq.ft**:  
   $$\text{Price/sq.ft} = \frac{\text{Asking Price}}{\text{Built-up Area}}$$

2. **Gross Rental Yield**:  
   $$\text{Gross Yield} = \frac{\text{Monthly Rent} \times 12}{\text{Asking Price}} \times 100$$

3. **Net Rental Yield**:  
   $$\text{Net Yield} = \frac{(\text{Monthly Rent} - \text{Monthly Maintenance}) \times 12}{\text{Asking Price}} \times 100$$

4. **Monthly EMI** (Standard Amortization Formula):  
   $$\text{EMI} = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$  
   Where $P$ is Loan Amount ($\text{Asking Price} - \text{Down Payment}$), $r$ is monthly interest rate ($\frac{\text{Rate}}{12 \times 100}$), and $n$ is total months ($\text{Tenure} \times 12$).

5. **Deal Score Formula (0–100)**:  
   $$\text{Deal Score} = (0.35 \times \text{Financial}) + (0.20 \times \text{Rental}) + (0.20 \times \text{Price}) + (0.15 \times \text{Loan}) + (0.10 \times \text{Risk})$$

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```

This compiles TypeScript and generates production-ready static assets in the `dist` directory.

---

## ⚖️ Legal Disclaimer

DealWise AI provides deterministic analytical estimates and qualitative AI interpretations for educational and decision-support purposes only. DealWise AI does not provide certified legal, architectural, appraisal, or financial advisory services. All municipal approvals, RERA certificates, and title deeds should be verified with licensed independent professionals.
