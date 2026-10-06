import {
  PropertyInput,
  FinancialMetrics,
  DealScoreBreakdown,
  RiskItem,
  ProjectionYear,
  DealClassification
} from '../types';

export function calculateFinancialMetrics(property: PropertyInput): FinancialMetrics {
  const builtUpArea = Math.max(1, Number(property.builtUpArea) || 1);
  const askingPrice = Math.max(1, Number(property.askingPrice) || 0);
  const monthlyRent = Math.max(0, Number(property.expectedMonthlyRent) || 0);
  const monthlyMaintenance = Math.max(0, Number(property.monthlyMaintenance) || 0);
  const downPayment = Math.max(0, Math.min(askingPrice, Number(property.downPayment) || 0));
  const interestRate = Math.max(0, Number(property.loanInterestRate) || 0);
  const tenureYears = Math.max(0, Number(property.loanTenure) || 0);

  const pricePerSqFt = Math.round(askingPrice / builtUpArea);
  const annualRent = monthlyRent * 12;
  const grossRentalYield = Number(((annualRent / askingPrice) * 100).toFixed(2));

  const annualMaintenance = monthlyMaintenance * 12;
  const netRentalIncome = annualRent - annualMaintenance;
  const netRentalYield = Number(((netRentalIncome / askingPrice) * 100).toFixed(2));

  const loanAmount = Math.max(0, askingPrice - downPayment);
  let monthlyEmi = 0;
  let totalLoanPayment = 0;
  let totalInterest = 0;

  if (loanAmount > 0 && tenureYears > 0) {
    const monthlyRate = (interestRate / 100) / 12;
    const totalMonths = tenureYears * 12;

    if (monthlyRate > 0) {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyEmi = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));
    } else {
      monthlyEmi = Math.round(loanAmount / totalMonths);
    }

    totalLoanPayment = monthlyEmi * totalMonths;
    totalInterest = Math.max(0, totalLoanPayment - loanAmount);
  }

  const monthlyCashflow = Math.round(monthlyRent - monthlyMaintenance - monthlyEmi);
  const ltvRatio = Number(((loanAmount / askingPrice) * 100).toFixed(1));

  let estimatedRoi = 0;
  const initialEquity = downPayment > 0 ? downPayment : askingPrice;
  const annualCashflow = monthlyCashflow * 12;
  if (initialEquity > 0) {
    estimatedRoi = Number(((annualCashflow / initialEquity) * 100).toFixed(2));
  }

  return {
    pricePerSqFt,
    annualRent,
    grossRentalYield,
    annualMaintenance,
    netRentalIncome,
    netRentalYield,
    loanAmount,
    monthlyEmi,
    totalLoanPayment,
    totalInterest,
    estimatedRoi,
    monthlyCashflow,
    ltvRatio,
  };
}

export function calculateDealScore(
  property: PropertyInput,
  metrics: FinancialMetrics
): DealScoreBreakdown {
  let rentalScore = 50;
  const yieldVal = metrics.grossRentalYield;
  if (yieldVal >= 6.0) rentalScore = 96;
  else if (yieldVal >= 5.0) rentalScore = 88;
  else if (yieldVal >= 4.0) rentalScore = 80;
  else if (yieldVal >= 3.0) rentalScore = 68;
  else if (yieldVal >= 2.0) rentalScore = 52;
  else rentalScore = 32;

  let loanScore = 75;
  if (metrics.loanAmount === 0) {
    loanScore = 95;
  } else {
    if (metrics.ltvRatio <= 50) loanScore = 90;
    else if (metrics.ltvRatio <= 70) loanScore = 82;
    else if (metrics.ltvRatio <= 80) loanScore = 70;
    else if (metrics.ltvRatio <= 90) loanScore = 55;
    else loanScore = 40;

    if (metrics.monthlyEmi > 0) {
      const emiToRent = metrics.monthlyEmi / (metrics.annualRent / 12 || 1);
      if (emiToRent > 1.5) loanScore -= 15;
      else if (emiToRent > 1.0) loanScore -= 8;
      else if (emiToRent < 0.7) loanScore += 5;
    }
  }
  loanScore = Math.max(15, Math.min(100, loanScore));

  let financialScore = 65;
  if (metrics.netRentalYield >= 4.5) financialScore = 92;
  else if (metrics.netRentalYield >= 3.5) financialScore = 82;
  else if (metrics.netRentalYield >= 2.5) financialScore = 70;
  else if (metrics.netRentalYield >= 1.5) financialScore = 55;
  else financialScore = 38;

  if (metrics.monthlyCashflow >= 5000) financialScore += 6;
  else if (metrics.monthlyCashflow < 0) {
    const deficitRatio = Math.abs(metrics.monthlyCashflow) / (metrics.annualRent / 12 || 1);
    if (deficitRatio > 0.4) financialScore -= 12;
    else financialScore -= 6;
  }
  financialScore = Math.max(10, Math.min(100, financialScore));

  let priceScore = 75;
  if (metrics.pricePerSqFt < 4000) priceScore = 88;
  else if (metrics.pricePerSqFt < 8000) priceScore = 82;
  else if (metrics.pricePerSqFt < 14000) priceScore = 74;
  else if (metrics.pricePerSqFt < 22000) priceScore = 65;
  else priceScore = 55;

  if (metrics.grossRentalYield >= 4.5 && priceScore >= 70) priceScore += 5;
  priceScore = Math.max(10, Math.min(100, priceScore));

  let riskScore = 80;
  if (property.propertyAge > 20) riskScore -= 16;
  else if (property.propertyAge > 12) riskScore -= 8;
  else if (property.propertyAge <= 3) riskScore += 5;

  if (property.expectedMonthlyRent > 0) {
    const maintRatio = property.monthlyMaintenance / property.expectedMonthlyRent;
    if (maintRatio > 0.25) riskScore -= 14;
    else if (maintRatio > 0.15) riskScore -= 6;
  }

  if (property.parking === 'No') riskScore -= 8;
  riskScore = Math.max(10, Math.min(100, riskScore));

  const overall = Math.round(
    financialScore * 0.35 +
    rentalScore * 0.20 +
    priceScore * 0.20 +
    loanScore * 0.15 +
    riskScore * 0.10
  );

  const clampedOverall = Math.max(1, Math.min(100, overall));

  let classification: DealClassification = 'Fair Deal';
  let summary = '';

  if (clampedOverall >= 80) {
    classification = 'Strong Deal';
    summary = 'Solid fundamentals, attractive rental yields relative to financing costs, and a balanced risk profile.';
  } else if (clampedOverall >= 60) {
    classification = 'Fair Deal';
    summary = 'Reasonable parameters overall, with acceptable yields; moderate attention needed on financing or maintenance expenses.';
  } else if (clampedOverall >= 40) {
    classification = 'Needs Review';
    summary = 'Several metrics indicate potential friction, such as compressed rental yields, high debt obligation, or recurring overhead.';
  } else {
    classification = 'Risky Deal';
    summary = 'High debt exposure, negative monthly cashflow, or disproportionate asking price versus rental income power.';
  }

  return {
    overallScore: clampedOverall,
    classification,
    financialScore,
    rentalScore,
    priceScore,
    loanScore,
    riskScore,
    summary,
  };
}

export function generateDeterministicInsights(
  property: PropertyInput,
  metrics: FinancialMetrics,
  score: DealScoreBreakdown
): {
  pros: string[];
  cons: string[];
  risks: RiskItem[];
  recommendation: string;
  thingsToVerify: string[];
} {
  const pros: string[] = [];
  const cons: string[] = [];
  const risks: RiskItem[] = [];

  if (metrics.grossRentalYield >= 4.0) {
    pros.push(`Attractive gross rental yield of ${metrics.grossRentalYield}%, above average urban residential benchmarks.`);
  } else if (metrics.grossRentalYield >= 3.0) {
    pros.push(`Stable rental yield of ${metrics.grossRentalYield}%, providing steady baseline income.`);
  }

  if (metrics.monthlyCashflow >= 0) {
    pros.push(`Positive monthly net cashflow (estimated ₹${metrics.monthlyCashflow.toLocaleString()} / month) after maintenance and EMI.`);
  }

  if (metrics.ltvRatio <= 65) {
    pros.push(`Conservative Loan-to-Value (LTV) ratio of ${metrics.ltvRatio}%, reducing debt vulnerability.`);
  }

  if (property.parking === 'Yes') {
    pros.push('Dedicated parking included, enhancing tenant retention and resale liquidity.');
  }

  if (property.propertyAge <= 5) {
    pros.push(`Modern asset age (${property.propertyAge} years), minimizing immediate renovation and major capital expenditure.`);
  }

  if (metrics.pricePerSqFt < 8000) {
    pros.push(`Competitive acquisition price per sq.ft of ₹${metrics.pricePerSqFt.toLocaleString()}.`);
  }

  if (metrics.grossRentalYield < 3.0) {
    cons.push(`Low gross rental yield (${metrics.grossRentalYield}%); rental cashflow is modest compared to capital deployed.`);
  }

  if (metrics.monthlyCashflow < 0) {
    cons.push(`Negative monthly cashflow: Monthly EMI + maintenance exceeds rent by ₹${Math.abs(metrics.monthlyCashflow).toLocaleString()}.`);
  }

  if (metrics.ltvRatio > 75) {
    cons.push(`High debt reliance with ${metrics.ltvRatio}% LTV, creating elevated interest expense of ₹${metrics.totalInterest.toLocaleString()}.`);
  }

  if (property.monthlyMaintenance > 0 && property.expectedMonthlyRent > 0) {
    const maintPct = ((property.monthlyMaintenance / property.expectedMonthlyRent) * 100).toFixed(1);
    if (Number(maintPct) > 18) {
      cons.push(`Maintenance fee represents ${maintPct}% of monthly rent, eroding net operating margins.`);
    }
  }

  if (property.propertyAge > 12) {
    cons.push(`Property is ${property.propertyAge} years old; potential depreciation and periodic upkeep may impact returns.`);
  }

  if (property.parking === 'No') {
    cons.push('Lack of reserved parking could lower future tenant demand and appraisal value.');
  }

  if (pros.length === 0) {
    pros.push('Provides tangible real estate collateral with potential long-term capital appreciation.');
    pros.push('Located in an established residential or commercial segment.');
  }
  if (cons.length === 0) {
    cons.push('Real estate assets carry illiquidity risk and transaction exit frictions (stamp duty, brokerage).');
  }

  if (metrics.monthlyCashflow < -5000) {
    risks.push({
      title: 'Significant Monthly Cash Flow Deficit',
      severity: 'High',
      description: `Your monthly outgo (EMI + maintenance) exceeds the estimated rent by ₹${Math.abs(metrics.monthlyCashflow).toLocaleString()} each month. You must fund this shortfall from active income.`,
    });
  } else if (metrics.monthlyCashflow < 0) {
    risks.push({
      title: 'Minor Negative Monthly Carry',
      severity: 'Medium',
      description: `The monthly rent is slightly lower than the combined debt service and maintenance by ₹${Math.abs(metrics.monthlyCashflow).toLocaleString()}.`,
    });
  }

  if (metrics.ltvRatio >= 80) {
    risks.push({
      title: 'Elevated Leverage (High LTV)',
      severity: 'High',
      description: `With an LTV of ${metrics.ltvRatio}%, total interest payable will reach ₹${metrics.totalInterest.toLocaleString()} over ${property.loanTenure} years. Any interest rate hike will increase your debt burden.`,
    });
  } else if (metrics.ltvRatio >= 70) {
    risks.push({
      title: 'Moderate Debt Burden',
      severity: 'Medium',
      description: `Financing ${metrics.ltvRatio}% of the property value requires disciplined loan service management.`,
    });
  } else {
    risks.push({
      title: 'Healthy Equity Cushion',
      severity: 'Low',
      description: `Low to moderate leverage (${metrics.ltvRatio}% LTV) shields you against market fluctuations.`,
    });
  }

  if (metrics.grossRentalYield < 2.5) {
    risks.push({
      title: 'Compressed Rental Yield',
      severity: 'High',
      description: `A ${metrics.grossRentalYield}% yield is below bank fixed deposits and inflation rates. The investment relies almost entirely on speculative price appreciation rather than cashflow.`,
    });
  }

  if (property.propertyAge > 15) {
    risks.push({
      title: 'Aging Building Structure',
      severity: 'Medium',
      description: `At ${property.propertyAge} years old, verify structural waterproofing, plumbing, elevator replacement funds, and upcoming society sinking fund levies.`,
    });
  }

  let recommendation = '';
  if (score.overallScore >= 80) {
    recommendation = `DealWise recommends proceeding to thorough due diligence. The property demonstrates attractive yield metrics (${metrics.grossRentalYield}%) and sustainable debt leverage. Prioritize physical inspection and title verification.`;
  } else if (score.overallScore >= 60) {
    recommendation = `This is a viable deal with caveats. Consider negotiating the asking price downward by 5–10% or increasing your down payment to improve monthly cashflow before committing.`;
  } else if (score.overallScore >= 40) {
    recommendation = `Exercise caution. The current financial equation shows high recurring carrying costs relative to rental yield. Unless you expect strong above-average capital appreciation, renegotiate the price or financing structure.`;
  } else {
    recommendation = `High risk profile detected. The numbers indicate negative monthly carry, low yields, or elevated leverage. DealWise advises seeking alternative properties or negotiating a substantially reduced purchase price.`;
  }

  const thingsToVerify = [
    'Clear and marketable title deed with 30-year chain of ownership documents',
    'RERA registration status, sanction plan approval, and completion/occupancy certificate (CC/OC)',
    'Encumbrance certificate (EC) from the sub-registrar confirming absence of legal mortgages',
    'Actual recent sale deeds of comparable properties in the immediate 500m radius',
    'Current society maintenance dues, sinking fund reserves, and upcoming special repair assessments',
    'Local rental absorption rates and realistic prevailing market rents with local brokers',
    'Property tax paid receipts and utility clearance certificates (electricity, water, sewerage)',
    'Bank loan eligibility and project approval (APF) from leading financial institutions'
  ];

  return {
    pros,
    cons,
    risks,
    recommendation,
    thingsToVerify,
  };
}

export function calculate5YearProjections(
  property: PropertyInput,
  metrics: FinancialMetrics,
  appreciationRate = 5
): ProjectionYear[] {
  const askingPrice = property.askingPrice || 0;
  const annualRent = metrics.annualRent;
  const annualMaintenance = metrics.annualMaintenance;
  const annualEmi = metrics.monthlyEmi * 12;

  const projections: ProjectionYear[] = [];
  let cumulativeRent = 0;
  let cumulativeCashflow = 0;

  for (let year = 1; year <= 5; year++) {
    const propertyValue = Math.round(
      askingPrice * Math.pow(1 + appreciationRate / 100, year)
    );

    const annualRentalIncome = Math.round(
      annualRent * Math.pow(1 + 0.04, year - 1)
    );
    cumulativeRent += annualRentalIncome;

    const yearlyCashflow = annualRentalIncome - (annualMaintenance + annualEmi);
    cumulativeCashflow += yearlyCashflow;

    const capitalGain = propertyValue - askingPrice;
    const estimatedTotalGain = capitalGain + cumulativeCashflow;

    projections.push({
      year,
      propertyValue,
      annualRentalIncome,
      cumulativeRentalIncome: cumulativeRent,
      cumulativeCashflow,
      estimatedTotalGain,
    });
  }

  return projections;
}
