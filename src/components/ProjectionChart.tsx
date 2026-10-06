import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PropertyInput, FinancialMetrics, ProjectionYear } from '../types';
import { calculate5YearProjections } from '../utils/calculations';
import { Info, TrendingUp, DollarSign } from 'lucide-react';

interface ProjectionChartProps {
  property: PropertyInput;
  financialMetrics: FinancialMetrics;
  initialAppreciationRate?: number;
}

export const ProjectionChart: React.FC<ProjectionChartProps> = ({
  property,
  financialMetrics,
  initialAppreciationRate = 5,
}) => {
  const [appreciationRate, setAppreciationRate] = useState<number>(initialAppreciationRate);

  const projections: ProjectionYear[] = calculate5YearProjections(
    property,
    financialMetrics,
    appreciationRate
  );

  const chartData = projections.map((p) => ({
    name: `Year ${p.year}`,
    propertyValue: p.propertyValue,
    cumulativeRent: p.cumulativeRentalIncome,
    estimatedTotalGain: p.estimatedTotalGain,
  }));

  const yr5 = projections[projections.length - 1];

  return (
    <div className="liquid-glass rounded-2xl p-6 md:p-8 border border-white/10 mt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-medium text-white">5-Year Growth & Income Projection</h3>
            <span className="text-[10px] font-mono uppercase bg-white/10 text-zinc-300 px-2 py-0.5 rounded border border-white/15">
              Illustrative estimate
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-light mt-1">
            Simulate property capital appreciation plus accumulated rental income over a 5-year holding horizon.
          </p>
        </div>

        {/* Appreciation rate slider */}
        <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-4 self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-mono text-zinc-400">
              Appreciation Assumption:
            </span>
            <span className="text-sm font-semibold text-white">
              {appreciationRate}% / year
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={appreciationRate}
            onChange={(e) => setAppreciationRate(parseFloat(e.target.value))}
            className="w-28 accent-white cursor-pointer"
            aria-label="Annual property appreciation assumption percentage"
          />
        </div>
      </div>

      {/* 5-Year High-level Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <span className="text-xs text-zinc-400 block mb-1">Estimated Value at Year 5</span>
          <span className="text-lg md:text-xl font-medium text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            ₹{yr5?.propertyValue.toLocaleString() || 0}
          </span>
          <span className="text-[11px] text-zinc-500 block mt-1">
            +₹{((yr5?.propertyValue || 0) - (property.askingPrice || 0)).toLocaleString()} capital gain
          </span>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <span className="text-xs text-zinc-400 block mb-1">5-Yr Cumulative Rental Income</span>
          <span className="text-lg md:text-xl font-medium text-white flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-zinc-300" />
            ₹{yr5?.cumulativeRentalIncome.toLocaleString() || 0}
          </span>
          <span className="text-[11px] text-zinc-500 block mt-1">
            Assumes conservative 4% annual rent step-up
          </span>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
          <span className="text-xs text-zinc-400 block mb-1">Estimated Combined Total Gain</span>
          <span className="text-lg md:text-xl font-medium text-white">
            ₹{yr5?.estimatedTotalGain.toLocaleString() || 0}
          </span>
          <span className="text-[11px] text-zinc-500 block mt-1">
            Capital appreciation + net cash accumulation
          </span>
        </div>
      </div>

      {/* Responsive Recharts Area Chart */}
      <div className="w-full h-72 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#71717a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#71717a" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="liquid-glass rounded-xl p-3 border border-white/20 shadow-xl text-xs space-y-1.5">
                      <p className="font-medium text-white">{label}</p>
                      <p className="text-zinc-200">
                        Asset Valuation: <span className="font-mono text-white">₹{Number(payload[0]?.value).toLocaleString()}</span>
                      </p>
                      <p className="text-zinc-400">
                        Cumulative Rent: <span className="font-mono text-zinc-300">₹{Number(payload[1]?.value).toLocaleString()}</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="propertyValue"
              stroke="#ffffff"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#valGrad)"
              name="Property Valuation"
            />
            <Area
              type="monotone"
              dataKey="cumulativeRent"
              stroke="#a1a1aa"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#rentGrad)"
              name="Cumulative Rent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mandatory Disclaimer Callout */}
      <div className="mt-4 flex items-start gap-2 bg-white/5 rounded-lg p-3 text-[11px] text-zinc-400 font-light border border-white/5">
        <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <span>
          <strong>Projections Disclaimer:</strong> Projections are illustrative computational scenarios based on constant parameters. Future capital appreciation and continuous tenancy are never guaranteed and depend entirely on micro-market conditions, supply pipeline, and economic variables.
        </span>
      </div>
    </div>
  );
};
