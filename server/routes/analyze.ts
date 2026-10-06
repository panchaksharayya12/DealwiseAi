import { Router, Request, Response } from 'express';
import { PropertyInput, AnalysisResult } from '../types';
import {
  calculateFinancialMetrics,
  calculateDealScore,
  calculate5YearProjections,
} from '../services/calculations';
import { enrichAnalysisWithAi } from '../services/openai';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { property, appreciationRate = 5 } = req.body;

    if (!property || typeof property !== 'object') {
      return res.status(400).json({
        error: 'Invalid request: property object is required.',
      });
    }

    const propData: PropertyInput = {
      propertyName: String(property.propertyName || 'Untitled Property').trim(),
      location: String(property.location || 'Unknown Location').trim(),
      propertyType: property.propertyType || 'Apartment',
      bhk: Number(property.bhk) || 1,
      builtUpArea: Number(property.builtUpArea) || 0,
      askingPrice: Number(property.askingPrice) || 0,
      expectedMonthlyRent: Number(property.expectedMonthlyRent) || 0,
      propertyAge: Number(property.propertyAge) || 0,
      floor: Number(property.floor) || 1,
      totalFloors: Number(property.totalFloors) || 1,
      parking: property.parking === 'Yes' ? 'Yes' : 'No',
      furnishing: property.furnishing || 'Unfurnished',
      monthlyMaintenance: Number(property.monthlyMaintenance) || 0,
      downPayment: Number(property.downPayment) || 0,
      loanInterestRate: Number(property.loanInterestRate) || 0,
      loanTenure: Number(property.loanTenure) || 0,
      otherExpenses: Number(property.otherExpenses) || 0,
    };

    if (propData.askingPrice <= 0) {
      return res.status(400).json({
        error: 'Validation error: Asking Price must be greater than zero.',
      });
    }

    if (propData.builtUpArea <= 0) {
      return res.status(400).json({
        error: 'Validation error: Built-up Area must be greater than zero.',
      });
    }

    // 1. Calculate deterministic financial metrics
    const financialMetrics = calculateFinancialMetrics(propData);

    // 2. Calculate deterministic deal score
    const dealScore = calculateDealScore(propData, financialMetrics);

    // 3. Calculate 5-year projections
    const projections = calculate5YearProjections(
      propData,
      financialMetrics,
      Number(appreciationRate) || 5
    );

    // 4. Enrich with AI if OpenAI is available, or deterministic generator if not
    const aiEnrichment = await enrichAnalysisWithAi(
      propData,
      financialMetrics,
      dealScore
    );

    const result: AnalysisResult = {
      id: property.id || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      property: propData,
      financialMetrics,
      dealScore,
      risks: aiEnrichment.risks,
      pros: aiEnrichment.pros,
      cons: aiEnrichment.cons,
      recommendation: aiEnrichment.recommendation,
      thingsToVerify: aiEnrichment.thingsToVerify,
      aiExplanation: aiEnrichment.aiExplanation,
      isAiGenerated: aiEnrichment.isAiGenerated,
      projections,
      appreciationRate: Number(appreciationRate) || 5,
    };

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('[Analyze Error]:', error);
    return res.status(500).json({
      error: 'An internal error occurred while analyzing the property deal.',
      details: error?.message || 'Unknown error',
    });
  }
});

export default router;
