export type PropertyType = 
  | 'Apartment'
  | 'Villa'
  | 'Independent House'
  | 'Plot'
  | 'Commercial'
  | 'Other';

export type ParkingOption = 'Yes' | 'No';

export type FurnishingOption = 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';

export type DealClassification = 'Risky Deal' | 'Needs Review' | 'Fair Deal' | 'Strong Deal';

export type RiskSeverity = 'Low' | 'Medium' | 'High';

export interface PropertyInput {
  id?: string;
  propertyName: string;
  location: string;
  propertyType: PropertyType;
  bhk: number;
  builtUpArea: number; // sq.ft
  askingPrice: number; // in local currency (e.g., INR)
  expectedMonthlyRent: number;
  propertyAge: number; // in years
  floor: number;
  totalFloors: number;
  parking: ParkingOption;
  furnishing: FurnishingOption;
  monthlyMaintenance: number;
  downPayment: number;
  loanInterestRate: number; // annual percentage, e.g. 8.5
  loanTenure: number; // in years, e.g. 20
  otherExpenses?: number;
}

export interface FinancialMetrics {
  pricePerSqFt: number;
  annualRent: number;
  grossRentalYield: number; // percentage
  annualMaintenance: number;
  netRentalIncome: number;
  netRentalYield: number; // percentage
  loanAmount: number;
  monthlyEmi: number;
  totalLoanPayment: number;
  totalInterest: number;
  estimatedRoi: number; // percentage
  monthlyCashflow: number; // rent - maintenance - emi
  ltvRatio: number; // percentage (Loan-To-Value)
}

export interface DealScoreBreakdown {
  overallScore: number; // 0 - 100
  classification: DealClassification;
  financialScore: number;
  rentalScore: number;
  priceScore: number;
  loanScore: number;
  riskScore: number;
  summary: string;
}

export interface RiskItem {
  id?: string;
  title: string;
  severity: RiskSeverity;
  description: string;
}

export interface ProjectionYear {
  year: number;
  propertyValue: number;
  annualRentalIncome: number;
  cumulativeRentalIncome: number;
  cumulativeCashflow: number;
  estimatedTotalGain: number;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  property: PropertyInput;
  financialMetrics: FinancialMetrics;
  dealScore: DealScoreBreakdown;
  risks: RiskItem[];
  pros: string[];
  cons: string[];
  recommendation: string;
  thingsToVerify: string[];
  aiExplanation?: string;
  isAiGenerated?: boolean;
  projections: ProjectionYear[];
  appreciationRate: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface SavedAnalysisRecord {
  id: string;
  created_at: string;
  property_name: string;
  location: string;
  property_data: PropertyInput;
  financial_metrics: FinancialMetrics;
  deal_score: DealScoreBreakdown;
  ai_analysis: {
    pros: string[];
    cons: string[];
    risks: RiskItem[];
    recommendation: string;
    thingsToVerify: string[];
    aiExplanation?: string;
  };
}
