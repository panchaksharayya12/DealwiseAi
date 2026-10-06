import { jsPDF } from 'jspdf';
import { AnalysisResult } from '../types';

export function generateDealPdf(analysis: AnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { property, financialMetrics, dealScore, risks, pros, cons, recommendation, thingsToVerify, projections } = analysis;

  const primaryDark: [number, number, number] = [15, 15, 18];
  const accentGray: [number, number, number] = [90, 90, 95];
  const lightBg: [number, number, number] = [245, 245, 247];

  let y = 18;

  // Header Banner
  doc.setFillColor(...primaryDark);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('DEALWISE AI', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('INVESTMENT DUE-DILIGENCE & VALUATION REPORT', 14, 18);

  doc.text(
    `DATE: ${new Date(analysis.createdAt).toLocaleDateString()}`,
    196,
    15,
    { align: 'right' }
  );

  y = 34;

  // Property Header
  doc.setTextColor(...primaryDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(property.propertyName || 'Property Deal', 14, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...accentGray);
  doc.text(`${property.location} • ${property.propertyType} • ${property.bhk} BHK • ${property.builtUpArea} sq.ft`, 14, y);
  y += 10;

  // Score Banner Box
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, y, 182, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...primaryDark);
  doc.text(`Overall Deal Score: ${dealScore.overallScore} / 100 — ${dealScore.classification}`, 20, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...accentGray);
  doc.text(
    `Score Breakdown: Financial: ${dealScore.financialScore}  |  Rental: ${dealScore.rentalScore}  |  Price: ${dealScore.priceScore}  |  Loan: ${dealScore.loanScore}  |  Risk: ${dealScore.riskScore}`,
    20,
    y + 16
  );
  y += 30;

  // Executive Recommendation
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryDark);
  doc.text('EXECUTIVE RECOMMENDATION', 14, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  const recLines = doc.splitTextToSize(recommendation || dealScore.summary, 182);
  doc.text(recLines, 14, y);
  y += recLines.length * 4.5 + 6;

  // Core Financial Metrics Table Grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryDark);
  doc.text('FINANCIAL BENCHMARKS & METRICS', 14, y);
  y += 6;

  const metricRows = [
    [
      { label: 'Asking Price', value: `INR ${(property.askingPrice || 0).toLocaleString()}` },
      { label: 'Price / sq.ft', value: `INR ${financialMetrics.pricePerSqFt.toLocaleString()}` },
      { label: 'Expected Rent', value: `INR ${(property.expectedMonthlyRent || 0).toLocaleString()} / mo` },
    ],
    [
      { label: 'Gross Rental Yield', value: `${financialMetrics.grossRentalYield}%` },
      { label: 'Net Rental Yield', value: `${financialMetrics.netRentalYield}%` },
      { label: 'Monthly EMI', value: `INR ${financialMetrics.monthlyEmi.toLocaleString()} / mo` },
    ],
    [
      { label: 'Down Payment', value: `INR ${(property.downPayment || 0).toLocaleString()}` },
      { label: 'Loan Amount', value: `INR ${financialMetrics.loanAmount.toLocaleString()}` },
      { label: 'Monthly Cashflow', value: `INR ${financialMetrics.monthlyCashflow.toLocaleString()} / mo` },
    ],
  ];

  const colWidth = 60.6;
  const rowHeight = 12;

  metricRows.forEach((row) => {
    row.forEach((col, colIdx) => {
      const cellX = 14 + colIdx * colWidth;
      doc.setFillColor(250, 250, 250);
      doc.rect(cellX, y, colWidth - 2, rowHeight, 'F');
      doc.setDrawColor(220, 220, 225);
      doc.rect(cellX, y, colWidth - 2, rowHeight, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(110, 110, 115);
      doc.text(col.label, cellX + 3, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...primaryDark);
      doc.text(col.value, cellX + 3, y + 9.5);
    });
    y += rowHeight + 2;
  });

  y += 4;

  // Pros & Cons
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryDark);
  doc.text('KEY ADVANTAGES & ATTENTION POINTS', 14, y);
  y += 5;

  const topPros = pros.slice(0, 3);
  topPros.forEach((pro) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 110, 60);
    doc.text(`[+] ${pro}`, 14, y);
    y += 4.5;
  });

  const topCons = cons.slice(0, 3);
  topCons.forEach((con) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(160, 40, 40);
    doc.text(`[-] ${con}`, 14, y);
    y += 4.5;
  });

  y += 4;

  // Risks
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryDark);
  doc.text('RISK FLAGS', 14, y);
  y += 5;

  const topRisks = risks.slice(0, 3);
  topRisks.forEach((risk) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(140, 50, 30);
    doc.text(`* [${risk.severity.toUpperCase()}] ${risk.title}`, 14, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    const rLines = doc.splitTextToSize(risk.description, 180);
    doc.text(rLines, 18, y);
    y += rLines.length * 3.8 + 2;
  });

  // 5-Year Projection Summary
  if (projections && projections.length > 0 && y < 240) {
    y += 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryDark);
    doc.text('5-YEAR PROJECTION SUMMARY (Illustrative Estimate)', 14, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(60, 60, 60);
    const pText = projections.map(p => `Yr ${p.year}: Value INR ${p.propertyValue.toLocaleString()} | Cum. Rent INR ${p.cumulativeRentalIncome.toLocaleString()}`).join('   ');
    const pLines = doc.splitTextToSize(pText, 182);
    doc.text(pLines, 14, y);
    y += pLines.length * 4 + 4;
  }

  // Pre-purchase verification items
  if (y < 255) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...primaryDark);
    doc.text('THINGS TO VERIFY BEFORE PURCHASE', 14, y);
    y += 5;

    thingsToVerify.slice(0, 3).forEach((item) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(70, 70, 70);
      doc.text(`[ ] ${item}`, 14, y);
      y += 4;
    });
  }

  // Footer Disclaimer
  doc.setDrawColor(210, 210, 215);
  doc.line(14, 282, 196, 282);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 135);
  doc.text(
    'DISCLAIMER: DealWise AI provides deterministic analytical estimates for informational purposes only. DealWise AI is not a registered financial advisor or legal counsel. Future property values and rental incomes are estimates, not guarantees. Verify all documentation, RERA approvals, and market comps independently.',
    14,
    286,
    { maxWidth: 182 }
  );

  // Save the PDF
  const filename = `DealWise_${(property.propertyName || 'Property').replace(/\s+/g, '_')}_Analysis.pdf`;
  doc.save(filename);
}
