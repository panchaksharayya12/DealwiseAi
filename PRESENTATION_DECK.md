# DealWise AI — Presentation Deck (PPT)

> **Tagline:** Know the deal before you buy.  
> **Topic:** AI-Powered Real Estate Deal Analyzer & Investment Intelligence Platform  
> **Presenter:** Panchaksharayya  
> **Target Audience:** Investors, Developers, Academic Evaluators, Homebuyers  

---

## Slide 1: Title Slide

### DEALWISE AI
#### "Know the deal before you buy."
*AI-Powered Real Estate Deal Analyzer & Valuation Intelligence Platform*

- **Author:** Panchaksharayya
- **Repository:** https://github.com/panchaksharayya12/DealwiseAi
- **Date:** October 2026
- **Stack:** React • TypeScript • Vite • Tailwind CSS • Express • Node.js • Supabase • OpenAI

---

## Slide 2: The Core Problem

### Real Estate Buying is Broken
1. **The Price Illusion:** Buyers evaluate properties by asking price and location, ignoring yields and carrying costs.
2. **Hidden Carrying Deficits:** Monthly EMI + maintenance often exceeds rent by tens of thousands of rupees without the buyer realizing it.
3. **AI Hallucinations in Finance:** Generic LLMs invent numbers, miscalculate loan amortization, and give dangerously inaccurate financial advice.
4. **Broker-Biased Platforms:** Conventional real-estate listing websites are incentivized to sell, not to protect the buyer from bad deals.

---

## Slide 3: The DealWise AI Solution

### Objective Quantitative Due-Diligence
- **100% Deterministic Financial Modeling:** Real estate math is calculated by verified TypeScript routines, never hallucinated by AI.
- **Transparent 5-Pillar Deal Score (0–100):** Clear classification into *Strong Deal*, *Fair Deal*, *Needs Review*, or *Risky Deal*.
- **Risk Taxonomy & Detection:** Automated identification of high LTV leverage, negative cashflow carry, and aging construction risks.
- **Contextual AI Advisory:** AI used strictly for natural-language synthesis, qualitative negotiation leverage, and due-diligence checklists.

---

## Slide 4: Key Platform Capabilities

### 10 Core Modules in One Platform
1. **Deterministic Financial Calculator** (Price/sqft, EMI, Yields, ROI)
2. **Proprietary Deal Scoring Matrix** (0–100 Weighted Score)
3. **Automated Risk Taxonomy** (High / Medium / Low Severity)
4. **Pros & Cons Synthesis** (Why this deal looks good vs. What needs attention)
5. **Interactive 5-Year Growth Projections** (Recharts dynamic scenario simulation)
6. **Ask DealWise AI Assistant** (In-context conversational property inquiries)
7. **Side-by-Side Property Benchmarking** (Multi-deal comparison with automated winners)
8. **Pre-Purchase Due-Diligence Checklist** (8 vital physical & legal verification points)
9. **One-Click Deal Report PDF Export** (Executive-grade diligence documents via jsPDF)
10. **Dual-Layer Persistence** (Supabase cloud sync + offline browser localStorage)

---

## Slide 5: Deterministic Financial Engine

### Rigorous Actuarial & Real Estate Mathematics
- **Gross Rental Yield:**
  $$\text{Gross Yield} = \left(\frac{\text{Expected Monthly Rent} \times 12}{\text{Asking Price}}\right) \times 100$$
- **Net Rental Yield:**
  $$\text{Net Yield} = \left(\frac{(\text{Rent} - \text{Maintenance}) \times 12}{\text{Asking Price}}\right) \times 100$$
- **Standard Reducing Balance EMI:**
  $$\text{EMI} = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$
- **Monthly Net Cashflow:**
  $$\text{Cashflow} = \text{Monthly Rent} - \text{Maintenance} - \text{Monthly EMI}$$
- **Total Interest & LTV:**
  Exact amortization calculations tracking total interest paid across loan tenure.

---

## Slide 6: The 5-Pillar Deal Score (0–100)

### Transparent Weighted Scoring Matrix
$$\text{Score} = (0.35 \times \text{Financial}) + (0.20 \times \text{Rental}) + (0.20 \times \text{Price}) + (0.15 \times \text{Loan}) + (0.10 \times \text{Risk})$$

- **Financial Health (35%):** Net yields, cashflow coverage ratio, cash-on-cash ROI.
- **Rental Yield Power (20%):** Performance benchmarked against metropolitan residential rates.
- **Price Efficiency (20%):** Price per sq.ft affordability and space yield sanity.
- **Loan Burden (15%):** Loan-to-Value (LTV) exposure and EMI-to-income coverage.
- **Risk Buffer (10%):** Construction age depreciation, maintenance drag, dedicated parking.

**Classification Tiers:**
- 80–100: **Strong Deal**
- 60–79: **Fair Deal**
- 40–59: **Needs Review**
- 0–39: **Risky Deal**

---

## Slide 7: Risk Analysis & Pre-Purchase Verification

### Protecting Buyer Capital Before Commitment
- **Automated Risk Flags:**
  - High LTV Debt Vulnerability (>75% LTV)
  - Severe Monthly Cashflow Deficit (EMI + Maintenance > Rent)
  - Maintenance Drag (>18% of rental income)
  - Asset Age Depreciation (>15 years old)
- **8-Point Due Diligence Checklist:**
  1. 30-year chain title deeds & ownership verification
  2. RERA registration status & approved sanction plans
  3. Encumbrance Certificate (EC) from sub-registrar
  4. Registered sale deeds of 500m comparable properties
  5. Society sinking fund health & upcoming capital levies
  6. Local rental demand & broker lease absorption rates
  7. Property tax paid receipts & utility clearance
  8. Bank APF loan eligibility & project sanctions

---

## Slide 8: Interactive 5-Year Projections

### Dynamic Scenario Simulation Powered by Recharts
- **Simulates holding period economics over Years 1 to 5.**
- **User-Adjustable Assumption Slider:** Test appreciation scenarios from 0% to 12% annually (default: 5%).
- **Compounded Capital Growth:** Asset valuation modeling combined with conservative 4% annual rental step-ups.
- **Cumulative Wealth Accrual:** Plots property equity gain alongside accumulated cash distributions.
- **Transparent Regulatory Labeling:** Prominently tagged as *"Illustrative computational estimate; future appreciation is not guaranteed."*

---

## Slide 9: Ask DealWise AI Assistant

### Active Property Context Inquiries
- **Conversational Real Estate Advisor:** Contextually grounded with the exact property metrics and deal score.
- **Sample Inquiry Prompts:**
  - *"Is this property worth the asking price?"*
  - *"What is making this deal risky?"*
  - *"How much rent would I need for better returns?"*
  - *"Should I consider a higher down payment?"*
  - *"What should I negotiate with the seller?"*
- **Dual-Engine Architecture:**
  - Powered by OpenAI GPT-4o-mini when API key is provided.
  - Automatic **Deterministic Fallback Engine** answering with exact numerical calculations if no key is configured. Zero crashes.

---

## Slide 10: Multi-Property Benchmarking

### Side-by-Side Deal Comparison
- **Evaluate multiple property opportunities head-to-head.**
- **Automatic Winner Highlights:**
  - Best Rental Yield
  - Lowest Price per sq.ft
  - Best Monthly Cashflow
  - Highest Overall Deal Score
- **Pre-loaded Presets & Custom Deals:** Compare Bangalore 2 BHK vs. Hyderabad High-Rise vs. Goa Villa with one click.
- **DealWise Recommended Deal Banner:** Explains why the winning property offers superior risk-adjusted return.

---

## Slide 11: Executive Due-Diligence PDF Reports

### One-Click Institutional-Grade PDF Generation
- Generated on the client using `jsPDF` for zero latency and privacy.
- **Contains:**
  - DealWise AI Branding & Report ID
  - Property Specifications & Asking Price
  - Score Badge & 5-Factor Breakdown
  - Full Metrics Table (Yields, EMI, LTV, Cashflow)
  - Pros, Cons, and Severity-Ranked Risk Flags
  - 5-Year Projection Summary Table
  - Due Diligence Verification Checklist
  - Legal & Financial Statutory Disclaimer

---

## Slide 12: System Architecture & Technical Stack

### Clean Full-Stack Engineering
- **Frontend:**
  - React 18, TypeScript, Vite
  - Tailwind CSS + Liquid Glass Visual Language
  - Recharts (Interactive SVG Charts)
  - Lucide React (Minimal iconography)
  - jsPDF (Vector PDF generator)
- **Backend:**
  - Node.js & Express REST API (TypeScript with `tsx`)
  - Deterministic Valuation & Actuarial Amortization Routines
  - OpenAI GPT-4o-mini SDK
  - Supabase Database Integration
- **Universal Host Binding:**
  - Configured with `0.0.0.0` for full Windows IPv4 (`127.0.0.1`), IPv6 (`localhost`), and LAN access.

---

## Slide 13: UI/UX Aesthetic — The Liquid Glass Style

### VEX-Inspired Cinematic Fintech Visuals
- **Color Philosophy:** Pure Black (`#000000`), Pure White (`#FFFFFF`), Zinc Grays (`#71717a`).
- **Strictly Prohibited:** Purple, Indigo, neon cards, cartoon illustrations.
- **Raw Background Video:** Fullscreen architectural hero video with zero dimming overlays.
- **Liquid Glass CSS Class (`.liquid-glass`):**
  - Luminosity blending mode
  - `backdrop-filter: blur(4px)`
  - Linear specular border gradients (180deg)
  - Specular inset light shadows
- **Micro-Interactions:** Character-by-character animated headings, smooth cubic counter animations, and IntersectionObserver scroll reveals.

---

## Slide 14: Future Roadmap & Extensibility

### Evolution Path for DealWise AI
1. **Listing Portal Ingestion:** Chrome extension & API connectors to ingest listings directly from portals.
2. **Geospatial & Micro-Market Comps:** Integration with GIS mapping to cross-reference registered sale deed records within 500m.
3. **Automated Document OCR & RERA Verification:** Upload sale agreements or sanction plans for automated clause and RERA validity extraction.
4. **Mortgage Lender Integration:** Direct pre-approval loan comparisons from top retail banks.
5. **Portfolio Tracking:** Multi-asset monitoring for real estate portfolio investors.

---

## Slide 15: Conclusion & Q&A

### DealWise AI — "Know the deal before you buy."
- **Summary:**
  - Fully functional, production-ready real estate deal analyzer.
  - Deterministic mathematical accuracy eliminates AI financial hallucinations.
  - Premium cinematic UI designed for modern investors.
  - Zero-config local execution with seamless cloud scalability.

**Repository:** [https://github.com/panchaksharayya12/DealwiseAi](https://github.com/panchaksharayya12/DealwiseAi)  
**Live Local Preview:** `http://localhost:5173`  

*Thank you! Questions and discussions are welcome.*
