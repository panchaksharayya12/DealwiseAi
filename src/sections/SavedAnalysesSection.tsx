import React, { useEffect, useState } from 'react';
import { SavedAnalysisRecord } from '../types';
import { fetchSavedAnalyses, removeSavedAnalysis } from '../utils/storage';
import { Reveal } from '../components/Reveal';
import { BookmarkCheck, Trash2, ArrowUpRight, Database, HardDrive, RefreshCw } from 'lucide-react';

interface SavedAnalysesSectionProps {
  onOpenAnalysis: (record: SavedAnalysisRecord) => void;
}

export const SavedAnalysesSection: React.FC<SavedAnalysesSectionProps> = ({
  onOpenAnalysis,
}) => {
  const [analyses, setAnalyses] = useState<SavedAnalysisRecord[]>([]);
  const [isSupabase, setIsSupabase] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const { records, isSupabase: connected } = await fetchSavedAnalyses();
    setAnalyses(records);
    setIsSupabase(connected);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Delete this saved analysis?')) {
      await removeSavedAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <section
      id="saved-analyses"
      className="relative w-full py-20 px-6 md:px-12 lg:px-16 bg-black border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookmarkCheck className="w-5 h-5 text-white" />
                <h3 className="text-2xl md:text-3xl font-normal text-white tracking-tight">
                  My Analyses
                </h3>
              </div>
              <p className="text-xs md:text-sm text-zinc-400 font-light">
                Stored property evaluations and historical deal records.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Storage sync indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300">
                {isSupabase ? (
                  <>
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Supabase Cloud Active</span>
                  </>
                ) : (
                  <>
                    <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Local Storage Active</span>
                  </>
                )}
              </div>

              <button
                onClick={loadData}
                className="text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title="Refresh saved analyses"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </Reveal>

        {analyses.length === 0 ? (
          <div className="liquid-glass rounded-2xl p-10 border border-white/10 text-center">
            <BookmarkCheck className="w-8 h-8 text-zinc-500 mx-auto mb-3 opacity-60" />
            <h4 className="text-base font-medium text-white mb-1">No Saved Analyses Yet</h4>
            <p className="text-xs text-zinc-400 font-light max-w-sm mx-auto">
              Analyze any property above and click &quot;Save Analysis&quot; to archive it here for future reference or comparison.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyses.map((item) => (
              <div
                key={item.id}
                className="liquid-glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase bg-white/5 text-zinc-400 px-2 py-0.5 rounded border border-white/10">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
                      {item.deal_score.overallScore}/100
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    {item.property_name}
                  </h4>
                  <p className="text-xs text-zinc-400 font-light mb-4">
                    {item.location} • {item.property_data.builtUpArea} sq.ft
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-black/40 rounded-xl p-3 border border-white/5 mb-4">
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-mono">Asking Price</span>
                      <span className="font-mono text-zinc-200">
                        ₹{(item.property_data.askingPrice || 0).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-mono">Gross Yield</span>
                      <span className="font-mono text-emerald-300">
                        {item.financial_metrics.grossRentalYield}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    onClick={() => onOpenAnalysis(item)}
                    className="text-xs bg-white text-black hover:bg-zinc-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Open Deal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
