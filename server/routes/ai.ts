import { Router, Request, Response } from 'express';
import { answerPropertyChat } from '../services/openai';
import { calculateFinancialMetrics, calculateDealScore } from '../services/calculations';
import { PropertyInput } from '../types';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { property, financialMetrics, dealScore, userQuestion, history = [] } = req.body;

    if (!userQuestion || typeof userQuestion !== 'string' || !userQuestion.trim()) {
      return res.status(400).json({
        error: 'Validation error: userQuestion is required.',
      });
    }

    if (!property || typeof property !== 'object') {
      return res.status(400).json({
        error: 'Validation error: property details are required to answer questions accurately.',
      });
    }

    const propData: PropertyInput = property;
    const metrics = financialMetrics || calculateFinancialMetrics(propData);
    const score = dealScore || calculateDealScore(propData, metrics);

    const reply = await answerPropertyChat(
      propData,
      metrics,
      score,
      userQuestion.trim(),
      history
    );

    return res.status(200).json({
      reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[AI Chat Error]:', error);
    return res.status(500).json({
      error: 'Failed to generate AI response.',
      details: error?.message || 'Unknown error',
    });
  }
});

export default router;
