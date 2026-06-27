import { BASELINE_FIGURES, KPIState, DecisionOption, DecisionOptionType } from '../types';

// Scenario 1 Calculations
export function calculateScenario1(assumptions: Record<string, string | number>): {
  expectedProductivityGain: number;
  expectedLabourSavings: number;
  expectedImplementationCost: number;
  expectedNetBenefitYear1: number;
  expectedNetBenefitYear2Plus: number;
  breakEvenMonths: number | null;
  vendorClaimComparison: {
    productivityGain: number;
    labourSavings: number;
    netBenefitYear1: number;
  };
} {
  const productivityBasis = assumptions.productivity_gain_basis as string || 'Industry Survey (Expected)';
  const costStructure = assumptions.ai_cost_structure as string || 'Annual Subscription';
  const calcBaseChoice = assumptions.calculation_base as string || 'Administrative Labour Cost ($4.0M)';

  const calculationBase = calcBaseChoice.includes('Administrative')
    ? BASELINE_FIGURES.administrativeLabourCost
    : BASELINE_FIGURES.reportDraftingLabourCost;

  // Industry survey expected values
  const optimisticWeight = 0.30;
  const expectedWeight = 0.50;
  const conservativeWeight = 0.20;

  const expectedProductivityGain =
    optimisticWeight * 15 +
    expectedWeight * 10 +
    conservativeWeight * 5;

  const expectedAdditionalCost =
    optimisticWeight * 0 +
    expectedWeight * 100000 +
    conservativeWeight * 200000;

  const expectedLabourSavings = (expectedProductivityGain / 100) * calculationBase;
  const oneTimeImplementationCost = BASELINE_FIGURES.staffTrainingCost + expectedAdditionalCost;

  const annualAICost = costStructure === 'Annual Subscription'
    ? BASELINE_FIGURES.aiSoftwareCost
    : 0;

  const oneTimeAICost = costStructure === 'One-time License'
    ? BASELINE_FIGURES.aiSoftwareCost
    : 0;

  const totalOneTimeCost = oneTimeImplementationCost + oneTimeAICost;

  const expectedNetBenefitYear1 = expectedLabourSavings - annualAICost - totalOneTimeCost;
  const expectedNetBenefitYear2Plus = expectedLabourSavings - annualAICost;

  const monthlyNetSavings = (expectedLabourSavings - annualAICost) / 12;
  const breakEvenMonths = monthlyNetSavings > 0
    ? Math.ceil(totalOneTimeCost / monthlyNetSavings)
    : null;

  // Vendor claim comparison
  const vendorProductivityGain = 15;
  const vendorLabourSavings = (vendorProductivityGain / 100) * calculationBase;
  const vendorNetBenefitYear1 = vendorLabourSavings - annualAICost - totalOneTimeCost;

  return {
    expectedProductivityGain,
    expectedLabourSavings,
    expectedImplementationCost: totalOneTimeCost,
    expectedNetBenefitYear1,
    expectedNetBenefitYear2Plus,
    breakEvenMonths,
    vendorClaimComparison: {
      productivityGain: vendorProductivityGain,
      labourSavings: vendorLabourSavings,
      netBenefitYear1: vendorNetBenefitYear1,
    },
  };
}

// Scenario 2 Calculations
export function calculateScenario2(assumptions: Record<string, string | number>): {
  reductionSavings: number;
  severanceCost: number;
  retrainingCost: number;
  capacityFreed: number;
  demandGrowth: number;
} {
  const severanceMultiplier = (assumptions.severance_multiplier as number) || 0;
  const hybridReduction = (assumptions.hybrid_reduction_pct as number) || 8;

  const averageSalary = BASELINE_FIGURES.annualLabourCost / BASELINE_FIGURES.employees;

  // Option A: 20% reduction
  const reductionCount = 20;
  const reductionSavings = reductionCount * averageSalary;
  const severanceCost = reductionCount * averageSalary * severanceMultiplier;

  // Option B: Retrain
  const retrainingCost = 250000 + 200000; // Staff training + AI maintenance

  // Capacity analysis
  const capacityFreed = BASELINE_FIGURES.administrativeLabourCost * 0.30;
  const demandGrowth = 0.10; // 10% client demand growth

  return {
    reductionSavings,
    severanceCost,
    retrainingCost,
    capacityFreed,
    demandGrowth,
  };
}

// Scenario 3 Calculations
export function calculateScenario3(assumptions: Record<string, string | number>): {
  expectedLossNoSafeguard: number;
  expectedLossWithSafeguard: number;
  safeguardCost: number;
  totalCostWithSafeguard: number;
  highRiskOnlyCost: number;
  highRiskOnlyLoss: number;
} {
  const humanReview = assumptions.human_review_coverage as string || 'None';
  const highRiskPct = (assumptions.high_risk_coverage_pct as number) || 60;

  const errorProbability = 0.10;
  const potentialLoss = 2000000;
  const reviewCost = 300000;
  const errorReduction = 0.80;

  const expectedLossNoSafeguard = errorProbability * potentialLoss;

  const reducedErrorProbability = errorProbability * (1 - errorReduction);
  const expectedLossWithSafeguard = reducedErrorProbability * potentialLoss;
  const totalCostWithSafeguard = reviewCost + expectedLossWithSafeguard;

  // High-risk only option
  const highRiskOnlyEffectiveness = errorReduction * (highRiskPct / 100);
  const highRiskOnlyCost = reviewCost * (highRiskPct / 100);
  const highRiskOnlyErrorProb = errorProbability * (1 - highRiskOnlyEffectiveness);
  const highRiskOnlyLoss = highRiskOnlyErrorProb * potentialLoss;

  return {
    expectedLossNoSafeguard,
    expectedLossWithSafeguard,
    safeguardCost: reviewCost,
    totalCostWithSafeguard,
    highRiskOnlyCost,
    highRiskOnlyLoss,
  };
}

// Scenario 4/5 Projections
export function calculateClientProjection(years: number, yourGrowth: number, rivalGrowth: number): {
  year: number;
  yourClients: number;
  rivalClients: number;
}[] {
  const baseYourClients = 100;
  const baseRivalClients = 100;

  const projections = [];
  for (let year = 0; year <= years; year++) {
    projections.push({
      year,
      yourClients: Math.round(baseYourClients * Math.pow(1 + yourGrowth, year)),
      rivalClients: Math.round(baseRivalClients * Math.pow(1 + rivalGrowth, year)),
    });
  }
  return projections;
}

// Apply KPI deltas
export function applyKPIDeltas(
  currentKPIs: KPIState,
  option: DecisionOptionType,
  decisionOptions: DecisionOption[]
): KPIState {
  const selectedOption = decisionOptions.find(o => o.id === option);
  if (!selectedOption) return currentKPIs;

  return {
    revenue: currentKPIs.revenue + selectedOption.kpiDeltas.revenue,
    profit: currentKPIs.profit + selectedOption.kpiDeltas.profit,
    employees: Math.max(0, currentKPIs.employees + selectedOption.kpiDeltas.employees),
    productivity_index: Math.max(0, currentKPIs.productivity_index + selectedOption.kpiDeltas.productivity),
    innovation_index: Math.max(0, currentKPIs.innovation_index + selectedOption.kpiDeltas.innovation),
    trust_index: Math.max(0, currentKPIs.trust_index + selectedOption.kpiDeltas.trust),
    workforce_capability_index: Math.max(0, currentKPIs.workforce_capability_index + selectedOption.kpiDeltas.workforce_capability),
  };
}

// Format currency
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

// Format percentage
export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
