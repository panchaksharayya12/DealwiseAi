import { Router, Request, Response } from 'express';
import { PropertyInput } from '../types';
import { calculateFinancialMetrics, calculateDealScore } from '../services/calculations';

const router = Router();

router.post('/compare', async (req: Request, res: Response) => {
  try {
    const { properties } = req.body;

    if (!Array.isArray(properties) || properties.length < 2) {
      return res.status(400).json({
        error: 'Comparison requires at least 2 properties.',
      });
    }

    const compared = properties.map((prop: PropertyInput, index: number) => {
      const safeProp: PropertyInput = {
        id: prop.id || `prop_comp_${index + 1}`,
        propertyName: prop.propertyName || `Property ${index + 1}`,
        location: prop.location || 'Unknown Location',
        propertyType: prop.propertyType || 'Apartment',
        bhk: Number(prop.bhk) || 1,
        builtUpArea: Number(prop.builtUpArea) || 1000,
        askingPrice: Number(prop.askingPrice) || 1000000,
        expectedMonthlyRent: Number(prop.expectedMonthlyRent) || 10000,
        propertyAge: Number(prop.propertyAge) || 0,
        floor: Number(prop.floor) || 1,
        totalFloors: Number(prop.totalFloors) || 1,
        parking: prop.parking || 'Yes',
        furnishing: prop.furnishing || 'Unfurnished',
        monthlyMaintenance: Number(prop.monthlyMaintenance) || 0,
        downPayment: Number(prop.downPayment) || 0,
        loanInterestRate: Number(prop.loanInterestRate) || 8.5,
        loanTenure: Number(prop.loanTenure) || 20,
        otherExpenses: Number(prop.otherExpenses) || 0,
      };

      const metrics = calculateFinancialMetrics(safeProp);
      const score = calculateDealScore(safeProp, metrics);

      return {
        property: safeProp,
        metrics,
        score,
      };
    });

    // Identify winners in key metrics
    let bestYieldIndex = 0;
    let lowestPriceSqFtIndex = 0;
    let highestCashflowIndex = 0;
    let highestScoreIndex = 0;

    compared.forEach((item, idx) => {
      if (item.metrics.grossRentalYield > compared[bestYieldIndex].metrics.grossRentalYield) {
        bestYieldIndex = idx;
      }
      if (item.metrics.pricePerSqFt < compared[lowestPriceSqFtIndex].metrics.pricePerSqFt) {
        lowestPriceSqFtIndex = idx;
      }
      if (item.metrics.monthlyCashflow > compared[highestCashflowIndex].metrics.monthlyCashflow) {
        highestCashflowIndex = idx;
      }
      if (item.score.overallScore > compared[highestScoreIndex].score.overallScore) {
        highestScoreIndex = idx;
      }
    });

    const recommendedProperty = compared[highestScoreIndex];

    return res.status(200).json({
      items: compared,
      highlights: {
        bestYieldId: compared[bestYieldIndex].property.id,
        lowestPriceSqFtId: compared[lowestPriceSqFtIndex].property.id,
        highestCashflowId: compared[highestCashflowIndex].property.id,
        highestScoreId: compared[highestScoreIndex].property.id,
      },
      recommendedDeal: {
        id: recommendedProperty.property.id,
        propertyName: recommendedProperty.property.propertyName,
        score: recommendedProperty.score.overallScore,
        classification: recommendedProperty.score.classification,
        reason: `Highest overall Deal Score (${recommendedProperty.score.overallScore}/100) with a gross rental yield of ${recommendedProperty.metrics.grossRentalYield}% and balanced risk metrics.`,
      },
    });
  } catch (error: any) {
    console.error('[Compare Error]:', error);
    return res.status(500).json({
      error: 'Failed to process property comparison.',
      details: error?.message || 'Unknown error',
    });
  }
});

export default router;
