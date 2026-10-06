import { Router, Request, Response } from 'express';
import { isOpenAiAvailable } from '../services/openai';
import { isSupabaseAvailable } from '../services/supabase';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'DealWise AI Backend',
    version: '1.0.0',
    integrations: {
      openai: isOpenAiAvailable(),
      supabase: isSupabaseAvailable(),
    },
  });
});

export default router;
