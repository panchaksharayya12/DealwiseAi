import { Router, Request, Response } from 'express';
import {
  getSavedAnalyses,
  saveAnalysisRecord,
  deleteAnalysisRecord,
  isSupabaseAvailable,
} from '../services/supabase';
import { SavedAnalysisRecord } from '../types';

const router = Router();

// GET /api/analyses
router.get('/analyses', async (_req: Request, res: Response) => {
  try {
    const list = await getSavedAnalyses();
    return res.status(200).json({
      data: list,
      isSupabaseConnected: isSupabaseAvailable(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to retrieve saved analyses.',
      details: error?.message,
    });
  }
});

// POST /api/analyses
router.post('/analyses', async (req: Request, res: Response) => {
  try {
    const record: SavedAnalysisRecord = req.body;
    if (!record || !record.property_name) {
      return res.status(400).json({
        error: 'Invalid analysis record.',
      });
    }

    const saved = await saveAnalysisRecord({
      ...record,
      id: record.id || `prop_${Date.now()}`,
      created_at: record.created_at || new Date().toISOString(),
    });

    return res.status(201).json({
      data: saved,
      isSupabaseConnected: isSupabaseAvailable(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to save analysis.',
      details: error?.message,
    });
  }
});

// DELETE /api/analyses/:id
router.delete('/analyses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing analysis ID.' });
    }

    await deleteAnalysisRecord(id);
    return res.status(200).json({
      success: true,
      deletedId: id,
      isSupabaseConnected: isSupabaseAvailable(),
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to delete analysis.',
      details: error?.message,
    });
  }
});

export default router;
