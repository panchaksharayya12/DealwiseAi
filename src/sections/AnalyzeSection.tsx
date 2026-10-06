import React, { useState } from 'react';
import { PropertyInput, AnalysisResult, PropertyType, ParkingOption, FurnishingOption } from '../types';
import { SAMPLE_PROPERTY_1, SAMPLE_PROPERTY_2, SAMPLE_PROPERTY_3 } from '../utils/sampleData';
import { calculateFinancialMetrics, calculateDealScore, calculate5YearProjections, generateDeterministicInsights } from '../utils/calculations';
import { AnalysisDashboard } from '../components/AnalysisDashboard';
import { Reveal } from '../components/Reveal';
import { Sparkles, RotateCcw, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AnalyzeSectionProps {
  onCompareRequest?: (analysis: AnalysisResult) => void;
}

export const AnalyzeSection: React.FC<AnalyzeSectionProps> = ({ onCompareRequest }) => {
  const [formData, setFormData] = useState<PropertyInput>({
    propertyName: '',
    location: '',
    propertyType: 'Apartment',
    bhk: 2,
    builtUpArea: 1200,
    askingPrice: 8500000,
    expectedMonthlyRent: 32000,
    propertyAge: 4,
    floor: 8,
    totalFloors: 20,
    parking: 'Yes',
    furnishing: 'Semi-Furnished',
    monthlyMaintenance: 4000,
    downPayment: 2500000,
    loanInterestRate: 8.5,
    loanTenure: 20,
    otherExpenses: 25000,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  const handleInputChange = (field: keyof PropertyInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errorMessage) setErrorMessage(null);
  };

  const loadSample = (sample: PropertyInput) => {
    setFormData(sample);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setFormData({
      propertyName: '',
      location: '',
      propertyType: 'Apartment',
      bhk: 2,
      builtUpArea: 1000,
      askingPrice: 0,
      expectedMonthlyRent: 0,
      propertyAge: 0,
      floor: 1,
      totalFloors: 1,
      parking: 'Yes',
      furnishing: 'Unfurnished',
      monthlyMaintenance: 0,
      downPayment: 0,
      loanInterestRate: 8.5,
      loanTenure: 20,
    });
    setCurrentAnalysis(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.propertyName.trim()) {
      setErrorMessage('Please enter a Property Name.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please specify the Property Location.');
      return;
    }
    if (!formData.askingPrice || formData.askingPrice <= 0) {
      setErrorMessage('Please provide a valid Asking Price greater than 0.');
      return;
    }
    if (!formData.builtUpArea || formData.builtUpArea <= 0) {
      setErrorMessage('Please provide a valid Built-up Area in sq.ft.');
      return;
    }

    setLoading(true);

    try {
      // 1. Send to Express backend API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: formData,
          appreciationRate: 5,
        }),
      });

      if (response.ok) {
        const data: AnalysisResult = await response.json();
        setCurrentAnalysis(data);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      console.warn('[Analyze] Server fetch failed, running deterministic client engine:', err);
      // Deterministic Client Engine fallback
      const metrics = calculateFinancialMetrics(formData);
      const dealScore = calculateDealScore(formData, metrics);
      const projections = calculate5YearProjections(formData, metrics, 5);
      const insights = generateDeterministicInsights(formData, metrics, dealScore);

      const clientAnalysis: AnalysisResult = {
        id: `prop_local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        property: { ...formData },
        financialMetrics: metrics,
        dealScore,
        risks: insights.risks,
        pros: insights.pros,
        cons: insights.cons,
        recommendation: insights.recommendation,
        thingsToVerify: insights.thingsToVerify,
        aiExplanation: `Deterministic assessment: Score ${dealScore.overallScore}/100 (${dealScore.classification}). Gross yield: ${metrics.grossRentalYield}%, monthly cashflow: ₹${metrics.monthlyCashflow.toLocaleString()}.`,
        isAiGenerated: false,
        projections,
        appreciationRate: 5,
      };

      setCurrentAnalysis(clientAnalysis);
    } finally {
      setLoading(false);
      // Smooth scroll to analysis results
      setTimeout(() => {
        const resElem = document.getElementById('analysis-results');
        if (resElem) {
          resElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <section
      id="analyze"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-2 block">
              Deal Calculator & Diagnostics
            </span>
            <h2 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-white leading-tight">
              Analyze a property.
            </h2>
            <p className="mt-4 text-base text-zinc-400 font-light leading-relaxed">
              Enter the details. DealWise calculates the numbers and turns them into an easy-to-understand investment view.
            </p>
          </div>
        </Reveal>

        {/* Toolbar: Sample Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Sample Presets:</span>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_PROPERTY_1)}
              className="text-xs bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Try Sample Property (Bengaluru 2 BHK)</span>
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_PROPERTY_2)}
              className="hidden sm:inline-flex text-xs bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              Hyderabad 3 BHK
            </button>
            <button
              type="button"
              onClick={() => loadSample(SAMPLE_PROPERTY_3)}
              className="hidden md:inline-flex text-xs bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              Goa Villa
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>
        </div>

        {/* Property Input Form */}
        <form onSubmit={handleSubmit} className="liquid-glass rounded-2xl p-6 md:p-10 border border-white/15 shadow-2xl mb-12">
          {errorMessage && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3 text-sm text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Name */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Property Name <span className="text-white">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.propertyName}
                onChange={(e) => handleInputChange('propertyName', e.target.value)}
                placeholder="e.g. Prestige Green 2 BHK"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Location <span className="text-white">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. Whitefield, Bengaluru"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Property Type
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value as PropertyType)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Independent House">Independent House</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* BHK */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                BHK Configuration
              </label>
              <input
                type="number"
                min="0"
                max="12"
                value={formData.bhk}
                onChange={(e) => handleInputChange('bhk', parseInt(e.target.value) || 0)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Built-up Area */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Built-up Area (sq.ft) <span className="text-white">*</span>
              </label>
              <input
                type="number"
                required
                min="50"
                value={formData.builtUpArea || ''}
                onChange={(e) => handleInputChange('builtUpArea', parseFloat(e.target.value) || 0)}
                placeholder="1200"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Asking Price */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Asking Price (₹) <span className="text-white">*</span>
              </label>
              <input
                type="number"
                required
                min="10000"
                value={formData.askingPrice || ''}
                onChange={(e) => handleInputChange('askingPrice', parseFloat(e.target.value) || 0)}
                placeholder="8500000"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            {/* Expected Monthly Rent */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Expected Monthly Rent (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.expectedMonthlyRent || ''}
                onChange={(e) => handleInputChange('expectedMonthlyRent', parseFloat(e.target.value) || 0)}
                placeholder="32000"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            {/* Property Age */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Property Age (years)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.propertyAge}
                onChange={(e) => handleInputChange('propertyAge', parseInt(e.target.value) || 0)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Floor / Total Floors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                  Floor
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.floor}
                  onChange={(e) => handleInputChange('floor', parseInt(e.target.value) || 0)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                  Total Floors
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalFloors}
                  onChange={(e) => handleInputChange('totalFloors', parseInt(e.target.value) || 1)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Parking */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Parking Availability
              </label>
              <select
                value={formData.parking}
                onChange={(e) => handleInputChange('parking', e.target.value as ParkingOption)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
              >
                <option value="Yes">Yes (Dedicated)</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Furnishing Status
              </label>
              <select
                value={formData.furnishing}
                onChange={(e) => handleInputChange('furnishing', e.target.value as FurnishingOption)}
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Fully Furnished">Fully Furnished</option>
              </select>
            </div>

            {/* Monthly Maintenance */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Monthly Maintenance (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.monthlyMaintenance || ''}
                onChange={(e) => handleInputChange('monthlyMaintenance', parseFloat(e.target.value) || 0)}
                placeholder="4000"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Down Payment (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.downPayment || ''}
                onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
                placeholder="2500000"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            {/* Loan Interest Rate */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Loan Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="25"
                value={formData.loanInterestRate}
                onChange={(e) => handleInputChange('loanInterestRate', parseFloat(e.target.value) || 0)}
                placeholder="8.5"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-2">
                Loan Tenure (years)
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.loanTenure}
                onChange={(e) => handleInputChange('loanTenure', parseInt(e.target.value) || 0)}
                placeholder="20"
                className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-zinc-400 font-light">
              * Required fields. Calculations are deterministic and executed strictly without hallucination.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-8 py-3 rounded-xl font-medium text-sm md:text-base hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Analyzing your property...</span>
                </>
              ) : (
                <>
                  <span>Analyze Property</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Presentation Dashboard */}
        {currentAnalysis && (
          <AnalysisDashboard
            analysis={currentAnalysis}
            onCompareWithOthers={onCompareRequest}
          />
        )}
      </div>
    </section>
  );
};
