import React, { useState } from 'react';
import { PropertyInput, DealClassification } from '../types';
import { SAMPLE_PROPERTY_1, SAMPLE_PROPERTY_2, SAMPLE_PROPERTY_3 } from '../utils/sampleData';
import { calculateFinancialMetrics, calculateDealScore } from '../utils/calculations';
import { Reveal } from '../components/Reveal';
import { Plus, Trash2, Trophy, Scale, Check } from 'lucide-react';

interface ComparedItem {
  property: PropertyInput;
  metrics: ReturnType<typeof calculateFinancialMetrics>;
  score: ReturnType<typeof calculateDealScore>;
}

export const CompareSection: React.FC = () => {
  const [properties, setProperties] = useState<PropertyInput[]>([
    { ...SAMPLE_PROPERTY_1, id: 'comp_1' },
    { ...SAMPLE_PROPERTY_2, id: 'comp_2' },
  ]);

  const [newPropModal, setNewPropModal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<PropertyInput | null>(null);

  // Compute evaluations for each property
  const items: ComparedItem[] = properties.map((p) => {
    const metrics = calculateFinancialMetrics(p);
    const score = calculateDealScore(p, metrics);
    return { property: p, metrics, score };
  });

  // Calculate winners
  const highestYield = Math.max(...items.map((i) => i.metrics.grossRentalYield));
  const lowestPriceSqFt = Math.min(...items.map((i) => i.metrics.pricePerSqFt));
  const highestScore = Math.max(...items.map((i) => i.score.overallScore));
  const highestCashflow = Math.max(...items.map((i) => i.metrics.monthlyCashflow));

  const recommendedDeal = items.find((i) => i.score.overallScore === highestScore);

  const handleRemove = (id?: string) => {
    if (properties.length <= 2) {
      alert('Comparison requires at least two properties.');
      return;
    }
    setProperties(properties.filter((p) => p.id !== id));
  };

  const handleAddPreset = (preset: PropertyInput) => {
    setProperties([...properties, { ...preset, id: `comp_${Date.now()}` }]);
    setNewPropModal(false);
  };

  return (
    <section
      id="compare"
      className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-2 block">
                Multi-Property Benchmarking
              </span>
              <h2 className="text-3xl md:text-5xl font-normal tracking-[-0.03em] text-white leading-tight">
                Compare the deals.
              </h2>
              <p className="mt-3 text-sm md:text-base text-zinc-400 font-light">
                Side-by-side financial metric benchmarking. Identify which asset delivers superior yield and risk-adjusted return.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setNewPropModal(true)}
                className="bg-white text-black hover:bg-zinc-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property to Compare</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Recommended Deal Banner */}
        {recommendedDeal && (
          <Reveal>
            <div className="liquid-glass rounded-2xl p-6 border border-white/20 mb-8 bg-gradient-to-r from-white/10 to-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider text-zinc-300 block">
                      DealWise Recommendation
                    </span>
                    <h3 className="text-lg md:text-xl font-medium text-white">
                      {recommendedDeal.property.propertyName} ({recommendedDeal.score.overallScore}/100)
                    </h3>
                    <p className="text-xs text-zinc-300 font-light mt-0.5">
                      Wins overall ranking with a gross rental yield of {recommendedDeal.metrics.grossRentalYield}% and strongest risk balance.
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Status</span>
                  <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                    {recommendedDeal.score.classification}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Side by side comparison table / cards */}
        <div className="liquid-glass rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/15 bg-white/5">
                  <th className="p-4 md:p-6 text-xs font-mono uppercase text-zinc-400 w-1/4">
                    Comparison Metrics
                  </th>
                  {items.map((item, idx) => (
                    <th key={item.property.id || idx} className="p-4 md:p-6 w-1/3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono text-zinc-500 block mb-0.5">
                            OPTION 0{idx + 1}
                          </span>
                          <h4 className="text-base font-semibold text-white">
                            {item.property.propertyName}
                          </h4>
                          <span className="text-xs text-zinc-400 font-light">
                            {item.property.location}
                          </span>
                        </div>
                        {properties.length > 2 && (
                          <button
                            onClick={() => handleRemove(item.property.id)}
                            className="text-zinc-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Remove Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs md:text-sm">
                {/* Deal Score */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Overall Deal Score</td>
                  {items.map((item) => {
                    const isWinner = item.score.overallScore === highestScore;
                    return (
                      <td key={item.property.id} className="p-4 md:p-6">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-base font-bold ${isWinner ? 'text-white' : 'text-zinc-400'}`}>
                            {item.score.overallScore} / 100
                          </span>
                          {isWinner && (
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white text-black font-semibold">
                              Top Score
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-zinc-500 block mt-0.5 font-light">
                          {item.score.classification}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Asking Price */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Asking Price</td>
                  {items.map((item) => (
                    <td key={item.property.id} className="p-4 md:p-6 font-mono text-zinc-200">
                      ₹{item.property.askingPrice.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Built-up Area */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Built-up Area</td>
                  {items.map((item) => (
                    <td key={item.property.id} className="p-4 md:p-6 text-zinc-200">
                      {item.property.builtUpArea} sq.ft ({item.property.bhk} BHK)
                    </td>
                  ))}
                </tr>

                {/* Price / sq.ft */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Price / sq.ft</td>
                  {items.map((item) => {
                    const isWinner = item.metrics.pricePerSqFt === lowestPriceSqFt;
                    return (
                      <td key={item.property.id} className="p-4 md:p-6">
                        <span className={`font-mono ${isWinner ? 'text-white font-semibold' : 'text-zinc-300'}`}>
                          ₹{item.metrics.pricePerSqFt.toLocaleString()}
                        </span>
                        {isWinner && (
                          <span className="text-[10px] ml-2 font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-200">
                            Lowest
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Expected Rent */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Expected Monthly Rent</td>
                  {items.map((item) => (
                    <td key={item.property.id} className="p-4 md:p-6 font-mono text-zinc-200">
                      ₹{item.property.expectedMonthlyRent.toLocaleString()} / mo
                    </td>
                  ))}
                </tr>

                {/* Gross Rental Yield */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Gross Rental Yield</td>
                  {items.map((item) => {
                    const isWinner = item.metrics.grossRentalYield === highestYield;
                    return (
                      <td key={item.property.id} className="p-4 md:p-6">
                        <span className={`font-mono text-sm ${isWinner ? 'text-emerald-300 font-semibold' : 'text-zinc-300'}`}>
                          {item.metrics.grossRentalYield}%
                        </span>
                        {isWinner && (
                          <span className="text-[10px] ml-2 font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Highest Yield
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Monthly EMI */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Monthly EMI</td>
                  {items.map((item) => (
                    <td key={item.property.id} className="p-4 md:p-6 font-mono text-zinc-200">
                      ₹{item.metrics.monthlyEmi.toLocaleString()} / mo
                    </td>
                  ))}
                </tr>

                {/* Monthly Cashflow */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Net Monthly Carry</td>
                  {items.map((item) => {
                    const isWinner = item.metrics.monthlyCashflow === highestCashflow;
                    const isPositive = item.metrics.monthlyCashflow >= 0;
                    return (
                      <td key={item.property.id} className="p-4 md:p-6">
                        <span className={`font-mono ${isPositive ? 'text-emerald-300' : 'text-zinc-400'}`}>
                          {isPositive ? '+' : ''}₹{item.metrics.monthlyCashflow.toLocaleString()} / mo
                        </span>
                        {isWinner && (
                          <span className="text-[10px] ml-2 font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">
                            Best Cashflow
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Property Age */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 md:p-6 font-medium text-zinc-300">Asset Age & Parking</td>
                  {items.map((item) => (
                    <td key={item.property.id} className="p-4 md:p-6 text-zinc-300">
                      {item.property.propertyAge} yrs • Parking: {item.property.parking}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Property Modal */}
        {newPropModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-lg w-full border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-white" />
                  <span>Add Property to Benchmark</span>
                </h3>
                <button
                  onClick={() => setNewPropModal(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-zinc-400 mb-4 font-light">
                Choose a pre-configured investment property profile to instantly benchmark against your active deals.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleAddPreset(SAMPLE_PROPERTY_1)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 p-3.5 rounded-xl border border-white/10 transition-colors flex justify-between items-center group"
                >
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-zinc-200">
                      Bengaluru 2 BHK Apartment
                    </h4>
                    <span className="text-xs text-zinc-400 font-light">
                      ₹85L • 1,200 sq.ft • Rent ₹32k/mo
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </button>

                <button
                  onClick={() => handleAddPreset(SAMPLE_PROPERTY_2)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 p-3.5 rounded-xl border border-white/10 transition-colors flex justify-between items-center group"
                >
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-zinc-200">
                      Hyderabad 3 BHK High-Rise
                    </h4>
                    <span className="text-xs text-zinc-400 font-light">
                      ₹1.45 Cr • 1,850 sq.ft • Rent ₹58k/mo
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </button>

                <button
                  onClick={() => handleAddPreset(SAMPLE_PROPERTY_3)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 p-3.5 rounded-xl border border-white/10 transition-colors flex justify-between items-center group"
                >
                  <div>
                    <h4 className="text-sm font-medium text-white group-hover:text-zinc-200">
                      North Goa 4 BHK Villa
                    </h4>
                    <span className="text-xs text-zinc-400 font-light">
                      ₹2.80 Cr • 2,800 sq.ft • Rent ₹1.1L/mo
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-right">
                <button
                  onClick={() => setNewPropModal(false)}
                  className="text-xs text-zinc-400 hover:text-white px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
