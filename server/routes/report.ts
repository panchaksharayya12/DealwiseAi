import { Router, Request, Response } from 'express';
import { AnalysisResult } from '../types';

const router = Router();

router.post('/report', (req: Request, res: Response) => {
  try {
    const { analysis } = req.body;
    if (!analysis || !analysis.property) {
      return res.status(400).json({ error: 'Valid analysis payload required.' });
    }

    const typedAnalysis: AnalysisResult = analysis;

    // Structured metadata for PDF export or external webhook
    const reportMetadata = {
      reportId: `DWR-${Date.now().toString().slice(-6)}`,
      generatedAt: new Date().toISOString(),
      propertyName: typedAnalysis.property.propertyName,
      location: typedAnalysis.property.location,
      dealScore: typedAnalysis.dealScore.overallScore,
      classification: typedAnalysis.dealScore.classification,
      grossYield: typedAnalysis.financialMetrics.grossRentalYield,
      monthlyEmi: typedAnalysis.financialMetrics.monthlyEmi,
      monthlyCashflow: typedAnalysis.financialMetrics.monthlyCashflow,
      disclaimer:
        'DealWise AI provides analytical estimates for informational purposes only. This report does not constitute certified legal, financial, or appraisal advice. Verify all municipal approvals, title deeds, and market rents independently.',
    };

    return res.status(200).json({
      success: true,
      metadata: reportMetadata,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Failed to process deal report.',
      details: error?.message,
    });
  }
});

export default router;
