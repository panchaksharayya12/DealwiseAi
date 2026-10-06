import OpenAI from 'openai';
import {
  PropertyInput,
  FinancialMetrics,
  DealScoreBreakdown,
  RiskItem,
} from '../types';
import { generateDeterministicInsights } from './calculations';

const apiKey = process.env.OPENAI_API_KEY;
let openaiClient: OpenAI | null = null;

if (apiKey && apiKey.trim() !== '' && !apiKey.startsWith('your_')) {
  try {
    openaiClient = new OpenAI({ apiKey: apiKey.trim() });
  } catch (err) {
    console.warn('[OpenAI] Failed to initialize OpenAI client:', err);
    openaiClient = null;
  }
}

export function isOpenAiAvailable(): boolean {
  return openaiClient !== null;
}

/**
 * Enriches property analysis with AI qualitative insights.
 * Falls back deterministically if OpenAI is not available.
 */
export async function enrichAnalysisWithAi(
  property: PropertyInput,
  metrics: FinancialMetrics,
  dealScore: DealScoreBreakdown
): Promise<{
  pros: string[];
  cons: string[];
  risks: RiskItem[];
  recommendation: string;
  thingsToVerify: string[];
  aiExplanation: string;
  isAiGenerated: boolean;
}> {
  const fallback = generateDeterministicInsights(property, metrics, dealScore);

  if (!openaiClient) {
    return {
      ...fallback,
      aiExplanation: `Deterministic deal assessment: This property scores ${dealScore.overallScore}/100 (${dealScore.classification}). With an asking price of ₹${property.askingPrice?.toLocaleString()} and expected monthly rent of ₹${property.expectedMonthlyRent?.toLocaleString()}, the gross rental yield sits at ${metrics.grossRentalYield}% with an estimated monthly cashflow of ₹${metrics.monthlyCashflow.toLocaleString()}.`,
      isAiGenerated: false,
    };
  }

  try {
    const prompt = `You are DealWise AI, an expert real-estate investment analyst.
Analyze this user-provided property deal objectively:

Property Details:
- Name: ${property.propertyName}
- Location: ${property.location}
- Type: ${property.propertyType} (${property.bhk} BHK)
- Built-up Area: ${property.builtUpArea} sq.ft
- Asking Price: ₹${property.askingPrice?.toLocaleString()}
- Expected Monthly Rent: ₹${property.expectedMonthlyRent?.toLocaleString()}
- Property Age: ${property.propertyAge} years
- Floor: ${property.floor} of ${property.totalFloors}
- Parking: ${property.parking}
- Furnishing: ${property.furnishing}
- Monthly Maintenance: ₹${property.monthlyMaintenance?.toLocaleString()}
- Down Payment: ₹${property.downPayment?.toLocaleString()}
- Loan Interest: ${property.loanInterestRate}% for ${property.loanTenure} years

Calculated Financial Metrics (DO NOT CHANGE THESE NUMBERS):
- Price/sq.ft: ₹${metrics.pricePerSqFt?.toLocaleString()}
- Gross Rental Yield: ${metrics.grossRentalYield}%
- Net Rental Yield: ${metrics.netRentalYield}%
- Monthly EMI: ₹${metrics.monthlyEmi?.toLocaleString()}
- Monthly Cashflow: ₹${metrics.monthlyCashflow?.toLocaleString()}
- Loan-to-Value (LTV): ${metrics.ltvRatio}%
- Overall Deal Score: ${dealScore.overallScore}/100 (${dealScore.classification})

Return a clean, valid JSON object with the exact keys:
{
  "aiExplanation": "A concise 2-3 sentence executive assessment summarizing the deal fundamentals.",
  "pros": ["3 to 4 concise, high-impact bullet points on why this deal looks good"],
  "cons": ["2 to 4 honest bullet points on what needs attention or concern"],
  "recommendation": "A realistic, prudent 2-sentence recommendation for the buyer.",
  "thingsToVerify": ["5 essential due-diligence items specific to this property type and age"]
}
Strictly output JSON only.`;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are DealWise AI, a high-level real estate investment advisor. You return strictly valid JSON.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        pros: Array.isArray(parsed.pros) && parsed.pros.length ? parsed.pros : fallback.pros,
        cons: Array.isArray(parsed.cons) && parsed.cons.length ? parsed.cons : fallback.cons,
        risks: fallback.risks, // Keep deterministic risk engine for safety & precision
        recommendation: parsed.recommendation || fallback.recommendation,
        thingsToVerify: Array.isArray(parsed.thingsToVerify) && parsed.thingsToVerify.length ? parsed.thingsToVerify : fallback.thingsToVerify,
        aiExplanation: parsed.aiExplanation || 'AI analysis generated successfully.',
        isAiGenerated: true,
      };
    }
  } catch (error) {
    console.warn('[OpenAI] Error generating AI analysis, using fallback:', error);
  }

  return {
    ...fallback,
    aiExplanation: `Deterministic DealWise Analysis: The property receives a score of ${dealScore.overallScore}/100 (${dealScore.classification}). Financial ratios reflect a gross rental yield of ${metrics.grossRentalYield}% and monthly cashflow of ₹${metrics.monthlyCashflow.toLocaleString()}.`,
    isAiGenerated: false,
  };
}

/**
 * Handles conversational queries about the active property deal.
 */
export async function answerPropertyChat(
  property: PropertyInput,
  metrics: FinancialMetrics,
  dealScore: DealScoreBreakdown,
  userQuestion: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  if (openaiClient) {
    try {
      const systemPrompt = `You are DealWise AI Assistant, an elite real estate investment analyst.
You are evaluating this specific property:
- Property: ${property.propertyName} in ${property.location}
- Asking Price: ₹${property.askingPrice?.toLocaleString()} (₹${metrics.pricePerSqFt?.toLocaleString()}/sq.ft)
- Expected Monthly Rent: ₹${property.expectedMonthlyRent?.toLocaleString()}
- Gross Rental Yield: ${metrics.grossRentalYield}%
- Net Rental Yield: ${metrics.netRentalYield}%
- Monthly EMI: ₹${metrics.monthlyEmi?.toLocaleString()}
- Monthly Cashflow: ₹${metrics.monthlyCashflow?.toLocaleString()}
- LTV: ${metrics.ltvRatio}%
- Overall Deal Score: ${dealScore.overallScore}/100 (${dealScore.classification})

Guidelines:
- Answer the user's question directly, concisely, and analytically.
- Reference the exact calculated figures above.
- Never guarantee future price appreciation or returns.
- If asked about negotiation, give concrete data-backed negotiation suggestions.
- Keep your reply to 2-4 focused paragraphs or structured bullet points.`;

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map((h) => ({
          role: h.role,
          content: h.content,
        })),
        { role: 'user', content: userQuestion },
      ];

      const response = await openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.4,
        max_tokens: 600,
      });

      const reply = response.choices[0]?.message?.content;
      if (reply) return reply;
    } catch (err) {
      console.warn('[OpenAI Chat] Falling back to deterministic assistant:', err);
    }
  }

  // Deterministic Fallback Assistant:
  const q = userQuestion.toLowerCase();
  const askingPriceFormatted = `₹${(property.askingPrice || 0).toLocaleString()}`;
  const rentFormatted = `₹${(property.expectedMonthlyRent || 0).toLocaleString()}`;
  const emiFormatted = `₹${metrics.monthlyEmi.toLocaleString()}`;
  const cashflowFormatted = `₹${metrics.monthlyCashflow.toLocaleString()}`;

  if (q.includes('worth') || q.includes('price') || q.includes('valuation')) {
    return `At an asking price of ${askingPriceFormatted} (₹${metrics.pricePerSqFt.toLocaleString()} per sq.ft) and monthly rent of ${rentFormatted}, the gross rental yield is ${metrics.grossRentalYield}%. 

In top metro markets, healthy residential gross yields generally hover between 3.5% and 5.0%. If prevailing neighborhood yields are higher than ${metrics.grossRentalYield}%, the asking price may have a slight premium built in. We recommend cross-checking recently registered sale deeds for similar ${property.bhk} BHK units within 500 meters.`;
  }

  if (q.includes('risk') || q.includes('risky') || q.includes('danger') || q.includes('concern')) {
    const mainRisks = [];
    if (metrics.monthlyCashflow < 0) {
      mainRisks.push(`Negative Monthly Carry: You will experience a net monthly outgo of ₹${Math.abs(metrics.monthlyCashflow).toLocaleString()} because the EMI (${emiFormatted}) plus maintenance exceeds the rent (${rentFormatted}).`);
    }
    if (metrics.ltvRatio > 75) {
      mainRisks.push(`High Leverage (${metrics.ltvRatio}% LTV): Total interest over tenure totals ₹${metrics.totalInterest.toLocaleString()}, increasing your exposure to interest rate fluctuations.`);
    }
    if (property.propertyAge > 12) {
      mainRisks.push(`Asset Age (${property.propertyAge} yrs): Older construction may incur higher recurring maintenance and society repair levies.`);
    }

    if (mainRisks.length === 0) {
      return `This deal has a relatively balanced risk profile with a Deal Score of ${dealScore.overallScore}/100. Key risks are minimal leverage risks and general real-estate illiquidity. Ensure complete title and RERA clearance prior to signing.`;
    }

    return `Key areas of financial risk identified for this property:\n\n` +
      mainRisks.map((r, i) => `${i + 1}. ${r}`).join('\n\n') +
      `\n\nAlways ensure physical inspection of structural components and verify society sinking fund health.`;
  }

  if (q.includes('rent') || q.includes('yield') || q.includes('income')) {
    const targetRentFor4Pct = Math.round((property.askingPrice * 0.04) / 12);
    return `The current expected rent of ${rentFormatted}/month delivers a gross rental yield of ${metrics.grossRentalYield}%. 

To reach a benchmark 4.0% gross yield on this purchase price (${askingPriceFormatted}), you would need to achieve approximately ₹${targetRentFor4Pct.toLocaleString()}/month in rental income. Check whether furnishings, premium interior fitments, or corporate rentals could bridge that gap.`;
  }

  if (q.includes('down payment') || q.includes('downpayment') || q.includes('equity') || q.includes('loan')) {
    return `You currently have a down payment of ₹${property.downPayment?.toLocaleString()} (${(100 - metrics.ltvRatio).toFixed(1)}% equity), leaving a loan of ₹${metrics.loanAmount.toLocaleString()} with a monthly EMI of ${emiFormatted}.

Increasing your down payment by 10% would reduce your monthly EMI and substantially mitigate your monthly negative carry (${cashflowFormatted}/month), lowering overall interest payable across ${property.loanTenure} years.`;
  }

  if (q.includes('negotiate') || q.includes('offer') || q.includes('seller') || q.includes('discount')) {
    const discounted5Pct = Math.round(property.askingPrice * 0.95);
    const discounted10Pct = Math.round(property.askingPrice * 0.90);
    return `Negotiation Strategy:
1. Target Purchase Price: Consider initiating offers between ₹${discounted10Pct.toLocaleString()} (10% discount) and ₹${discounted5Pct.toLocaleString()} (5% discount).
2. Leverage Data Points: Highlight the current rental yield of ${metrics.grossRentalYield}% and the ${property.propertyAge}-year age of the asset.
3. Concessions: If the seller remains firm on price, request inclusion of covered parking, club membership charges, or deferred maintenance repairs in the agreed contract.`;
  }

  // General fallback
  return `DealWise Analysis Summary for ${property.propertyName}:
- Deal Score: ${dealScore.overallScore}/100 (${dealScore.classification})
- Gross Rental Yield: ${metrics.grossRentalYield}%
- Monthly EMI: ${emiFormatted}
- Net Monthly Cashflow: ${cashflowFormatted}

This property represents a ${dealScore.classification.toLowerCase()}. Focus on verifying title legality, ensuring tenant demand in ${property.location}, and maintaining a liquid emergency reserve to buffer the loan obligations.`;
}
