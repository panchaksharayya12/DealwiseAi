import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { ProjectionChart } from './ProjectionChart';
import { AskDealWise } from './AskDealWise';
import { generateDealPdf } from '../utils/pdfGenerator';
import { saveAnalysisToStorage } from '../utils/storage';
import {
  Download,
  Bookmark,
  Check,
  CheckCircle,
  AlertTriangle,
  FileCheck2,
  Scale,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  onCompareWithOthers?: (analysis: AnalysisResult) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onCompareWithOthers,
}) => {
  const { property, financialMetrics, dealScore, risks, pros, cons, recommendation, thingsToVerify } = analysis;
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await saveAnalysisToStorage(analysis);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadPdf = () => {
    generateDealPdf(analysis);
  };

  // Color & Badge based on classification
  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'text-white border-white/40 bg-white/10';
    if (score >= 60) return 'text-zinc-200 border-zinc-400 bg-white/5';
    if (score >= 40) return 'text-amber-200 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-200 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn" id="analysis-results">
      {/* Top Banner: Property Identity & Actions */}
      <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase bg-white/10 text-zinc-300 px-2 py-0.5 rounded border border-white/15">
                Valuation Report
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-normal text-white tracking-tight">
              {property.propertyName}
            </h2>
            <p className="text-sm md:text-base text-zinc-300 font-light mt-1">
              {property.location} • {property.propertyType} • {property.bhk} BHK • {property.builtUpArea} sq.ft • Age {property.propertyAge} yrs
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium flex items-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved to Analyses</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-zinc-300" />
                  <span>Save Analysis</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPdf}
              className="bg-white text-black hover:bg-zinc-200 px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium flex items-center gap-2 transition-colors shadow-lg active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Generate Deal Report</span>
            </button>

            {onCompareWithOthers && (
              <button
                onClick={() => onCompareWithOthers(analysis)}
                className="liquid-glass text-zinc-300 hover:text-white border border-white/15 px-4 py-2.5 rounded-xl text-xs md:text-sm font-light flex items-center gap-1.5 transition-colors"
              >
                <Scale className="w-4 h-4" />
                <span>Compare</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}
          </div>
        </div>

        {/* Executive Recommendation Banner */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 block mb-0.5">
                Executive Assessment
              </span>
              <p className="text-sm text-zinc-200 font-light leading-relaxed max-w-3xl">
                {recommendation || dealScore.summary}
              </p>
            </div>
          </div>

          <div className="text-xs text-zinc-500 font-mono shrink-0">
            {analysis.isAiGenerated ? 'AI Assisted • Verified Calculation' : 'Deterministic Scoring Engine'}
          </div>
        </div>
      </div>

      {/* Deal Score & Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overall Deal Score Display */}
        <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                OVERALL DEAL SCORE
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getScoreBadgeClass(dealScore.overallScore)}`}>
                {dealScore.classification}
              </span>
            </div>

            <div className="my-4 flex items-baseline gap-2">
              <span className="text-6xl md:text-7xl font-bold tracking-tight text-white">
                <AnimatedCounter value={dealScore.overallScore} duration={900} />
              </span>
              <span className="text-2xl font-light text-zinc-500">/ 100</span>
            </div>

            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              {dealScore.summary}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-zinc-400 font-mono space-y-1">
            <div className="flex justify-between">
              <span>80–100: Strong Deal</span>
              <span>60–79: Fair Deal</span>
            </div>
            <div className="flex justify-between">
              <span>40–59: Needs Review</span>
              <span>0–39: Risky Deal</span>
            </div>
          </div>
        </div>

        {/* Right: Transparent Weighted Score Breakdown */}
        <div className="lg:col-span-2 liquid-glass rounded-2xl p-6 md:p-8 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Transparent Score Breakdown</h3>
              <span className="text-xs font-mono text-zinc-400">Deterministic Ratios</span>
            </div>

            <div className="space-y-4">
              {/* Financial Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Financial Health (35% weight)</span>
                  <span className="font-mono text-white">{dealScore.financialScore} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-1000"
                    style={{ width: `${dealScore.financialScore}%` }}
                  />
                </div>
              </div>

              {/* Rental Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Rental Yield Power (20% weight)</span>
                  <span className="font-mono text-white">{dealScore.rentalScore} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-zinc-300 transition-all duration-1000"
                    style={{ width: `${dealScore.rentalScore}%` }}
                  />
                </div>
              </div>

              {/* Price Efficiency Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Price Efficiency (20% weight)</span>
                  <span className="font-mono text-white">{dealScore.priceScore} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 transition-all duration-1000"
                    style={{ width: `${dealScore.priceScore}%` }}
                  />
                </div>
              </div>

              {/* Loan Burden Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Loan & Leverage Burden (15% weight)</span>
                  <span className="font-mono text-white">{dealScore.loanScore} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-zinc-400 transition-all duration-1000"
                    style={{ width: `${dealScore.loanScore}%` }}
                  />
                </div>
              </div>

              {/* Risk Indicators Score */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-300 font-medium">Risk Buffer (10% weight)</span>
                  <span className="font-mono text-white">{dealScore.riskScore} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-zinc-500 transition-all duration-1000"
                    style={{ width: `${dealScore.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-zinc-500 font-light">
            Calculated algorithmically from purchase capital, debt service coverage, carrying costs, and asset parameters.
          </p>
        </div>
      </div>

      {/* Core Financial Metric Cards Grid (Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Price / sq.ft */}
        <div className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[11px] uppercase font-mono text-zinc-400 block mb-1">Price / sq.ft</span>
          <span className="text-lg md:text-xl font-semibold text-white block">
            ₹<AnimatedCounter value={financialMetrics.pricePerSqFt} />
          </span>
          <span className="text-[10px] text-zinc-500 font-light mt-1 block">
            {property.builtUpArea} sq.ft area
          </span>
        </div>

        {/* Expected Monthly Rent */}
        <div className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[11px] uppercase font-mono text-zinc-400 block mb-1">Monthly Rent</span>
          <span className="text-lg md:text-xl font-semibold text-white block">
            ₹<AnimatedCounter value={property.expectedMonthlyRent} />
          </span>
          <span className="text-[10px] text-zinc-500 font-light mt-1 block">
            ₹{(financialMetrics.annualRent).toLocaleString()}/yr
          </span>
        </div>

        {/* Gross Rental Yield */}
        <div className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[11px] uppercase font-mono text-zinc-400 block mb-1">Rental Yield</span>
          <span className="text-lg md:text-xl font-semibold text-white block">
            <AnimatedCounter value={financialMetrics.grossRentalYield} decimals={2} suffix="%" />
          </span>
          <span className="text-[10px] text-zinc-500 font-light mt-1 block">
            Net: {financialMetrics.netRentalYield}%
          </span>
        </div>

        {/* Monthly EMI */}
        <div className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[11px] uppercase font-mono text-zinc-400 block mb-1">Estimated EMI</span>
          <span className="text-lg md:text-xl font-semibold text-white block">
            ₹<AnimatedCounter value={financialMetrics.monthlyEmi} />
          </span>
          <span className="text-[10px] text-zinc-500 font-light mt-1 block">
            {property.loanInterestRate}% @ {property.loanTenure} yrs
          </span>
        </div>

        {/* Estimated Loan Amount */}
        <div className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[11px] uppercase font-mono text-zinc-400 block mb-1">Loan Amount</span>
          <span className="text-lg md:text-xl font-semibold text-white block">
            ₹<AnimatedCounter value={financialMetrics.loanAmount} />
          </span>
          <span className="text-[10px] text-zinc-500 font-light mt-1 block">
            {financialMetrics.ltvRatio}% LTV ratio
          </span>
        </div>

        {/* Net Monthly Cashflow */}
        <div className="liquid-glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
          <span className="text-[11px] uppercase font-mono text-zinc-400 block mb-1">Monthly Carry</span>
          <span className={`text-lg md:text-xl font-semibold block ${financialMetrics.monthlyCashflow >= 0 ? 'text-emerald-300' : 'text-zinc-200'}`}>
            {financialMetrics.monthlyCashflow >= 0 ? '+' : ''}₹<AnimatedCounter value={financialMetrics.monthlyCashflow} />
          </span>
          <span className="text-[10px] text-zinc-500 font-light mt-1 block">
            Rent - Maint - EMI
          </span>
        </div>
      </div>

      {/* Pros & Cons Section (Section 19) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why this deal looks good */}
        <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-zinc-200" />
              <span>Why this deal looks good</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-400">
              Advantages
            </span>
          </div>

          <ul className="space-y-3">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-2" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What needs attention */}
        <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-zinc-400" />
              <span>What needs attention</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-zinc-400">
              Friction Points
            </span>
          </div>

          <ul className="space-y-3">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-2" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Risk Analysis Section (Section 20) */}
      <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-white">Risk Flags & Due Diligence</h3>
              <p className="text-xs text-zinc-400 font-light">
                Automated detection of leverage vulnerability, operational drag, and structural caveats.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {risks.length} Risk Flag{risks.length === 1 ? '' : 's'} Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {risks.map((risk, idx) => (
            <div key={idx} className="bg-black/40 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white">{risk.title}</span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      risk.severity === 'High'
                        ? 'text-rose-300 border-rose-500/40 bg-rose-500/10'
                        : risk.severity === 'Medium'
                        ? 'text-amber-300 border-amber-500/40 bg-amber-500/10'
                        : 'text-zinc-300 border-zinc-500/40 bg-zinc-500/10'
                    }`}
                  >
                    {risk.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed mt-1">
                  {risk.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Things to verify before buying */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck2 className="w-4 h-4 text-zinc-300" />
            <h4 className="text-sm font-medium text-white">Things the buyer should verify before purchasing</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {thingsToVerify.map((item, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/5 rounded-lg p-2.5 text-xs text-zinc-300 font-light border border-white/5">
                <span className="text-zinc-500 font-mono text-[11px] shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-zinc-500 font-light leading-relaxed">
          <strong>Analytical Disclaimer:</strong> DealWise AI provides deterministic analytical estimates and qualitative AI interpretations. It is not a certified legal, tax, or investment advisory service. Title legality, municipal sanctions, and market rents should be independently verified with licensed professionals.
        </div>
      </div>

      {/* 5-Year Projection Interactive Chart */}
      <ProjectionChart
        property={property}
        financialMetrics={financialMetrics}
        initialAppreciationRate={analysis.appreciationRate}
      />

      {/* Interactive AI Chat Assistant */}
      <AskDealWise
        property={property}
        financialMetrics={financialMetrics}
        dealScore={dealScore}
      />
    </div>
  );
};
