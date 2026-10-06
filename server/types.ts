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
  builtUpArea: number;
  askingPrice: number;
  expectedMonthlyRent: number;
  propertyAge: number;
  floor: number;
  totalFloors: number;
  parking: ParkingOption;
  furnishing: FurnishingOption;
  monthlyMaintenance: number;
  downPayment: number;
  loanInterestRate: number;
  loanTenure: number;
  otherExpenses?: number;
}

export interface FinancialMetrics {
  pricePerSqFt: number;
  annualRent: number;
  grossRentalYield: number;
  annualMaintenance: number;
  netRentalIncome: number;
  netRentalYield: number;
  loanAmount: number;
  monthlyEmi: number;
  totalLoanPayment: number;
  totalInterest: number;
  estimatedRoi: number;
  monthlyCashflow: number;
  ltvRatio: number;
}

export interface DealScoreBreakdown {
  overallScore: number;
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
