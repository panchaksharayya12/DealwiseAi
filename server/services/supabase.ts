import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SavedAnalysisRecord } from '../types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project')
) {
  try {
    supabase = createClient(supabaseUrl.trim(), supabaseAnonKey.trim());
  } catch (err) {
    console.warn('[Supabase] Failed to initialize Supabase client:', err);
    supabase = null;
  }
}

// In-memory fallback repository for local mode
const inMemoryAnalyses: SavedAnalysisRecord[] = [];

export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

export async function getSavedAnalyses(): Promise<SavedAnalysisRecord[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('property_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[Supabase] Error fetching analyses, using memory store:', error.message);
        return [...inMemoryAnalyses];
      }
      return data || [];
    } catch (err) {
      console.warn('[Supabase] Network exception fetching analyses:', err);
      return [...inMemoryAnalyses];
    }
  }
  return [...inMemoryAnalyses];
}

export async function saveAnalysisRecord(
  record: SavedAnalysisRecord
): Promise<SavedAnalysisRecord> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('property_analyses')
        .upsert([record])
        .select()
        .single();

      if (error) {
        console.warn('[Supabase] Error upserting analysis, saving in memory store:', error.message);
        const existingIdx = inMemoryAnalyses.findIndex((a) => a.id === record.id);
        if (existingIdx >= 0) inMemoryAnalyses[existingIdx] = record;
        else inMemoryAnalyses.unshift(record);
        return record;
      }
      return data;
    } catch (err) {
      console.warn('[Supabase] Exception saving record:', err);
    }
  }

  // Fallback to in-memory store
  const existingIdx = inMemoryAnalyses.findIndex((a) => a.id === record.id);
  if (existingIdx >= 0) {
    inMemoryAnalyses[existingIdx] = record;
  } else {
    inMemoryAnalyses.unshift(record);
  }
  return record;
}

export async function deleteAnalysisRecord(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('property_analyses')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('[Supabase] Error deleting analysis, deleting from memory store:', error.message);
      }
    } catch (err) {
      console.warn('[Supabase] Exception deleting record:', err);
    }
  }

  const idx = inMemoryAnalyses.findIndex((a) => a.id === id);
  if (idx >= 0) {
    inMemoryAnalyses.splice(idx, 1);
  }
  return true;
}
