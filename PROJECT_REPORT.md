# DealWise AI — Comprehensive Project Report

**Product Name:** DealWise AI  
**Tagline:** "Know the deal before you buy."  
**Repository:** https://github.com/panchaksharayya12/DealwiseAi  
**Live Deployed Application:** https://dealwise-ai.vercel.app/  
**Word Document Report:** [DEALWISE_AI_PROJECT_REPORT.docx](DEALWISE_AI_PROJECT_REPORT.docx)  
**PowerPoint Presentation Deck:** [DEALWISE_AI_PRESENTATION.pptx](DEALWISE_AI_PRESENTATION.pptx)  
**Author:** Panchaksharayya  
**Date:** October 2026 | Document Version: 1.0.0 (Production Release)  

---

## 1. Executive Summary

Real estate acquisitions represent one of the single largest financial commitments an individual or institution ever makes. However, the vast majority of property purchases are executed based on emotional impressions, promotional brochures, or superficial price comparisons, rather than rigorous quantitative diligence.

**DealWise AI** is a production-grade full-stack real-estate investment analysis platform that answers the definitive question: **"Is this property actually a good deal?"**

By pairing **100% deterministic mathematical calculations** (eliminating LLM numerical hallucination) with an **objective weighted scoring matrix** and **AI-powered qualitative reasoning**, DealWise AI transforms raw property inputs into actionable investment intelligence, comprehensive risk warnings, multi-property benchmarking, and investor-ready PDF due-diligence reports.

---

## 2. Problem Statement & Market Need

### 2.1 The Core Market Friction
1. **The "Price vs. Value" Illusion:** Buyers often fixate on gross asking price without computing capitalization yield, net operating income, or debt carrying burdens.
2. **Hidden Negative Cashflow:** High loan-to-value (LTV) ratios paired with society maintenance and rising interest rates frequently lead to recurring out-of-pocket cash deficits that catch buyers off guard.
3. **AI Hallucination in Finance:** Relying solely on generic conversational AI for financial computations results in inaccurate EMI figures, incorrect interest tallies, and fabricated metrics.
4. **Lack of Accessible Due-Diligence Tools:** Institutional real estate private equity platforms are cost-prohibitive, while consumer listing portals are incentivized by broker commissions to make every property look attractive.

### 2.2 The DealWise Solution
- **Deterministic Math Engine:** All financial calculations (yields, amortization, interest, ROI) are computed through verifiable TypeScript routines.
- **Transparent 5-Pillar Deal Score:** Algorithmic score (0–100) benchmarked across Financial Health, Rental Power, Price Efficiency, Debt Burden, and Structural Risk.
- **Contextual AI Advisory:** AI is deployed strictly for qualitative synthesis, due-diligence checklists, and risk explanations, grounded in calculated numbers.
- **Dual-Mode Persistence:** Operates offline with local browser storage, and syncs automatically with Supabase cloud when configured.

---

## 3. System Architecture & Tech Stack

```
+--------------------------------------------------------------------------+
|                            USER INTERFACE (BROWSER)                      |
|  React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts   |
|  Liquid Glass Effect (.liquid-glass) + Character Motion + jsPDF Engine   |
+------------------------------------+-------------------------------------+
                                     |
                          REST API Requests (/api/*)
                                     v
+--------------------------------------------------------------------------+
|                       EXPRESS / NODE.JS BACKEND (TSX)                    |
|  - Request Validation & Schema Sanitization                              |
|  - Deterministic Valuation & Amortization Engine                         |
|  - Multi-Property Benchmark Comparator Engine                            |
|  - Optional OpenAI GPT-4o-mini Service (with deterministic fallback)     |
|  - Optional Supabase Client (with memory/localStorage fallback)          |
+-------------------+----------------------------------+-------------------+
                    |                                  |
                    v                                  v
+------------------------------------+   +---------------------------------+
|       OPENAI API (OPTIONAL)        |   |       SUPABASE DATABASE         |
|  GPT-4o-mini Contextual Assistant  |   |   Table: property_analyses      |
+------------------------------------+   +---------------------------------+
```

### 3.1 Technology Selection Justification
- **Frontend — React & TypeScript:** Ensures strict typing across all property entities, financial metrics, and score breakdowns.
- **Bundler — Vite:** Provides lightning-fast Hot Module Replacement (HMR) and optimized build chunks.
- **Styling — Tailwind CSS & Liquid Glass:** Custom `.liquid-glass` implementation using luminosity blending, backdrop-filter blur, and gradient specular borders, achieving an Apple/VEX-level fintech aesthetic without bloated UI libraries.
- **Backend — Express & Node.js:** High-throughput, lightweight REST API handling mathematical modeling, AI prompt orchestration, and database persistence.
- **Charts — Recharts:** Smooth SVG-based responsive rendering for 5-year growth and rental income area charts.
- **PDF Generation — jsPDF:** Client-side zero-latency vector PDF generation of investor reports.

---

## 4. Deterministic Financial Modeling

All financial computations are executed deterministically using standard actuarial and real estate valuation principles:

### 4.1 Core Formulas
1. **Price per Square Foot:**
   $$\text{Price/sq.ft} = \frac{\text{Asking Price}}{\text{Built-up Area}}$$

2. **Gross Rental Yield:**
   $$\text{Gross Rental Yield (\%)} = \left(\frac{\text{Monthly Rent} \times 12}{\text{Asking Price}}\right) \times 100$$

3. **Net Rental Yield:**
   $$\text{Net Rental Yield (\%)} = \left(\frac{(\text{Monthly Rent} - \text{Monthly Maintenance}) \times 12}{\text{Asking Price}}\right) \times 100$$

4. **Estimated Monthly EMI (Reducing Balance Amortization Formula):**
   $$\text{EMI} = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$
   *Where:*
   - $P = \text{Loan Amount} = \max(0, \text{Asking Price} - \text{Down Payment})$
   - $r = \frac{\text{Annual Interest Rate}}{12 \times 100}$
   - $n = \text{Loan Tenure in Years} \times 12$

5. **Total Interest Payable:**
   $$\text{Total Interest} = (\text{EMI} \times n) - P$$

6. **Net Monthly Cashflow (Monthly Carry):**
   $$\text{Monthly Cashflow} = \text{Expected Monthly Rent} - \text{Monthly Maintenance} - \text{Monthly EMI}$$

7. **Cash-on-Cash ROI:**
   $$\text{Cash-on-Cash ROI (\%)} = \left(\frac{\text{Annual Net Cashflow}}{\text{Down Payment}}\right) \times 100$$

---

## 5. Proprietary Deal Score Matrix

The DealWise AI scoring system generates an aggregate score between **0 and 100** based on a weighted multi-factor evaluation:

$$\text{Deal Score} = (0.35 \times S_{\text{financial}}) + (0.20 \times S_{\text{rental}}) + (0.20 \times S_{\text{price}}) + (0.15 \times S_{\text{loan}}) + (0.10 \times S_{\text{risk}})$$

### 5.1 Score Breakdown Pillars
| Pillar | Weight | Evaluation Criteria |
|---|---|---|
| **Financial Health** | 35% | Net rental yield benchmarks, net monthly cashflow coverage, and cash-on-cash equity yield. |
| **Rental Yield Power** | 20% | Gross rental yield relative to residential metro benchmarks (e.g., >5.5% = exceptional, 4.0–5.4% = good, <2.5% = low). |
| **Price Efficiency** | 20% | Price/sq.ft relative to asset configuration and capital yield sanity. |
| **Loan & Debt Burden** | 15% | Loan-to-Value (LTV) ratio, monthly debt service coverage (EMI vs. rent ratio). |
| **Risk Buffer** | 10% | Property age depreciation liabilities, maintenance-to-rent drag ratio, and dedicated parking availability. |

### 5.2 Classification Tiers
- **80 – 100: Strong Deal** (Solid fundamentals, attractive yields, manageable debt, positive/minimal carry).
- **60 – 79: Fair Deal** (Viable opportunity with reasonable parameters; minor price negotiation or down payment bump advised).
- **40 – 59: Needs Review** (Friction points detected: low rental yields, high maintenance drag, or elevated leverage).
- **0 – 39: Risky Deal** (High leverage vulnerability, severe monthly cashflow deficit, or excessive asking price).

---

## 6. Features & User Experience Workflow

1. **Cinematic Hero Entry:**
   - Raw background video displaying contemporary architectural landscapes without dark overlays.
   - Character-by-character entrance animation for *"Know the deal before you buy."*
   - Real-time indicator badge: *"Price • ROI • Rent • Risk • AI"*.

2. **Interactive Property Analyzer:**
   - Supports Apartments, Villas, Independent Houses, Plots, Commercial spaces.
   - Pre-loaded sample presets:
     - *Bengaluru 2 BHK Apartment (Whitefield)*
     - *Hyderabad 3 BHK High-Rise (Hitec City)*
     - *North Goa 4 BHK Villa*
   - Immediate form validation preventing invalid or empty submissions.

3. **Analysis Dashboard & Metrics Grid:**
   - Animated count-up metrics for Price/sq.ft, Monthly Rent, Gross Yield, Net Yield, EMI, Loan Amount, and Monthly Carry.
   - Transparent progress bars illustrating the exact sub-score components.

4. **Automated Pros, Cons & Risk Taxonomy:**
   - Evaluates severity (*High*, *Medium*, *Low*) on cashflow deficits, LTV leverage, and asset aging.
   - 8-point physical verification checklist (RERA status, encumbrance certificates, 30-year chain deeds, society sinking fund health).

5. **5-Year Growth & Income Projection:**
   - Interactive slider adjusting annual property appreciation assumption (0% to 12%).
   - Dynamic Recharts area graph modeling asset valuation growth alongside accumulated rental distributions.
   - Prominently labeled with regulatory disclaimer: *"Illustrative scenario estimate; future returns are not guaranteed."*

6. **Ask DealWise AI Assistant:**
   - Context-aware conversational interface receiving current property parameters.
   - Answers inquiries on valuation fairness, seller negotiation angles, rental yield improvements, and debt restructuring.
   - Deterministic local assistant fallback when OpenAI API key is not supplied.

7. **Multi-Property Comparison Matrix:**
   - Benchmarks two or more properties side-by-side.
   - Automatically highlights winning metrics (highest yield, lowest price/sq.ft, best monthly cashflow, highest score).
   - Dynamic *"DealWise Recommended Deal"* banner.

8. **One-Click Deal Report PDF Generation:**
   - Client-side vector PDF generation via `jsPDF`.
   - Formatted with DealWise header, property specs, metrics table, score breakdown, pros/cons, risk matrix, and statutory disclaimer.

9. **Saved Analyses Archive ("My Analyses"):**
   - Dual-persistence engine: stores analyses in browser `localStorage` and syncs with Supabase if credentials exist.
   - View, open, or delete saved analyses at any time.

---

## 7. Backend API Specification

| Route | Method | Payload / Params | Response | Description |
|---|---|---|---|---|
| `/api/health` | `GET` | None | `{ status: "ok", integrations: {...} }` | Service health & integration status |
| `/api/analyze` | `POST` | `{ property: PropertyInput, appreciationRate?: number }` | `AnalysisResult` | Performs deterministic math, scoring, and AI enrichment |
| `/api/ai/chat` | `POST` | `{ property, financialMetrics, dealScore, userQuestion, history }` | `{ reply: string, timestamp: string }` | Context-aware AI deal consultation |
| `/api/compare` | `POST` | `{ properties: PropertyInput[] }` | `{ items, highlights, recommendedDeal }` | Compares 2+ properties and computes category winners |
| `/api/analyses` | `GET` | None | `{ data: SavedAnalysisRecord[], isSupabaseConnected: boolean }` | Retrieves all saved property analyses |
| `/api/analyses` | `POST` | `SavedAnalysisRecord` | `{ data, isSupabaseConnected }` | Persists a property evaluation |
| `/api/analyses/:id` | `DELETE` | `id: string` | `{ success: true, deletedId }` | Removes a saved analysis record |
| `/api/report` | `POST` | `{ analysis: AnalysisResult }` | `{ success: true, metadata }` | Verifies and formats export metadata |

---

## 8. Verification & Quality Assurance Results

| Test Scenario | Expected Outcome | Result |
|---|---|---|
| **TypeScript Compilation (`tsc -b`)** | Zero type errors across client & server | **PASSED** (Exit code 0) |
| **Vite Production Build (`vite build`)** | Minified, tree-shaken static assets in `/dist` | **PASSED** (Exit code 0) |
| **Universal Host Binding (`0.0.0.0`)** | Accessible via `localhost:5173`, `127.0.0.1:5173`, and LAN IP | **PASSED** (HTTP 200) |
| **Backend REST Endpoints** | `/api/health`, `/api/analyze`, `/api/ai/chat`, `/api/compare` | **PASSED** (HTTP 200 / 201) |
| **Zero-Config Local Mode** | Operates without requiring OpenAI or Supabase keys | **PASSED** (Deterministic fallback active) |
| **Client-Side PDF Export** | Formatted PDF downloads cleanly via `jsPDF` | **PASSED** (Verified) |
| **Mobile Responsiveness** | Responsive navigation drawer, single-column cards, scrollable tables | **PASSED** (Verified) |

---

## 9. Conclusion

DealWise AI bridges the critical gap between raw real estate marketing and objective financial clarity. By providing deterministic mathematical modeling, a transparent Deal Score, risk detection, and context-aware AI advisory in a modern visual interface, the platform empowers users to make informed, data-backed buying decisions.

**Project Status:** 100% Complete, Production-Ready, and Fully Functional.

