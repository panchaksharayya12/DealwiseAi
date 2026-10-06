import { AnalysisResult, SavedAnalysisRecord } from '../types';

const LOCAL_STORAGE_KEY = 'dealwise_saved_analyses';

function getLocalAnalyses(): SavedAnalysisRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[Storage] Failed to read from localStorage:', err);
    return [];
  }
}

function setLocalAnalyses(records: SavedAnalysisRecord[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('[Storage] Failed to write to localStorage:', err);
  }
}

export async function fetchSavedAnalyses(): Promise<{
  records: SavedAnalysisRecord[];
  isSupabase: boolean;
}> {
  try {
    const res = await fetch('/api/analyses');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data) && data.data.length > 0) {
        // Sync local storage with server
        setLocalAnalyses(data.data);
        return { records: data.data, isSupabase: Boolean(data.isSupabaseConnected) };
      }
    }
  } catch (err) {
    console.warn('[Storage] Backend fetch failed, falling back to local storage:', err);
  }

  // Fallback to local storage
  const localData = getLocalAnalyses();
  return { records: localData, isSupabase: false };
}

export async function saveAnalysisToStorage(analysis: AnalysisResult): Promise<SavedAnalysisRecord> {
  const record: SavedAnalysisRecord = {
    id: analysis.id || `prop_${Date.now()}`,
    created_at: analysis.createdAt || new Date().toISOString(),
    property_name: analysis.property.propertyName,
    location: analysis.property.location,
    property_data: analysis.property,
    financial_metrics: analysis.financialMetrics,
    deal_score: analysis.dealScore,
    ai_analysis: {
      pros: analysis.pros,
      cons: analysis.cons,
      risks: analysis.risks,
      recommendation: analysis.recommendation,
      thingsToVerify: analysis.thingsToVerify,
      aiExplanation: analysis.aiExplanation,
    },
  };

  // 1. Save locally first
  const current = getLocalAnalyses();
  const existingIdx = current.findIndex((r) => r.id === record.id);
  if (existingIdx >= 0) {
    current[existingIdx] = record;
  } else {
    current.unshift(record);
  }
  setLocalAnalyses(current);

  // 2. Also try sending to backend / Supabase
  try {
    await fetch('/api/analyses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  } catch (err) {
    console.warn('[Storage] Backend save failed, stored locally in browser:', err);
  }

  return record;
}

export async function removeSavedAnalysis(id: string): Promise<boolean> {
  // 1. Remove from local storage
  const current = getLocalAnalyses();
  const filtered = current.filter((r) => r.id !== id);
  setLocalAnalyses(filtered);

  // 2. Try removing from server
  try {
    await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[Storage] Server deletion failed, local copy removed:', err);
  }

  return true;
}
