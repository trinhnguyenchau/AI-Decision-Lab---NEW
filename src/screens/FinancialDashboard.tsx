import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Settings, ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/TopNav';
import { KpiCard } from '../components/ui/KpiCard';
import { AssumptionToggle, AssumptionSlider } from '../components/ui/Inputs';
import { baselineKPIs, BASELINE_FIGURES } from '../types';

interface Props {
  userId: string | null;
}

export function FinancialDashboard({ userId }: Props) {
  const navigate = useNavigate();

  // Scenario Builder assumptions
  const [aiCostStructure, setAiCostStructure] = useState('Annual Subscription');
  const [salaryInflation, setSalaryInflation] = useState(0);
  const [clientGrowth, setClientGrowth] = useState(0);

  // Derived metrics
  const profitMargin = ((BASELINE_FIGURES.annualRevenue - 10000000) / BASELINE_FIGURES.annualRevenue * 100);

  // Projections based on assumptions
  const year1LabourCost = BASELINE_FIGURES.annualLabourCost * (1 + salaryInflation / 100);
  const year1Revenue = BASELINE_FIGURES.annualRevenue * (1 + clientGrowth / 100);

  return (
    <PageShell kpis={baselineKPIs} progress={{ step: 2, total: 9 }} userId={userId}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/operational-data')}
              className="text-slate-400 hover:text-slate-600 text-sm"
            >
              ← Back to Operational Data
            </button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Dashboard</h1>
          <p className="text-slate-600 mt-2">
            Review the baseline financials and AI investment cost structure before
            beginning Scenario 1.
          </p>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard
            label="Annual Revenue"
            value="$20M"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KpiCard
            label="Annual Profit"
            value="$2M"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KpiCard
            label="Annual Labour Cost"
            value="$10M"
            icon={<Settings className="w-5 h-5" />}
          />
          <KpiCard
            label="Profit Margin"
            value={`${profitMargin.toFixed(0)}%`}
            icon={<ArrowRight className="w-5 h-5" />}
          />
        </div>

        {/* Investment & Implementation Costs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">AI Investment & Implementation Costs</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">AI Software Cost</p>
              <p className="text-2xl font-bold text-slate-900">$500,000</p>
              <p className="text-xs text-slate-400 mt-1">
                {aiCostStructure === 'Annual Subscription'
                  ? 'Recurring annual expense'
                  : 'One-time license fee'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Staff Training Cost</p>
              <p className="text-2xl font-bold text-slate-900">$300,000</p>
              <p className="text-xs text-slate-400 mt-1">One-time implementation cost</p>
            </div>
          </div>

          {/* AI Cost Structure Toggle */}
          <div className="border-t border-slate-200 pt-6">
            <AssumptionToggle
              id="ai_cost_structure"
              label="AI Cost Structure"
              options={['Annual Subscription', 'One-time License']}
              value={aiCostStructure}
              onChange={setAiCostStructure}
            />
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                {aiCostStructure === 'Annual Subscription' ? (
                  <>
                    <strong>Annual Subscription:</strong> $500,000 per year, ongoing.
                    Lower upfront risk but higher total cost over time.
                  </>
                ) : (
                  <>
                    <strong>One-time License:</strong> $500,000 upfront, no recurring fee.
                    Higher initial investment but potential for long-term savings.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Builder Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Settings className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Scenario Builder Assumptions</h2>
              <p className="text-sm text-slate-500">
                These assumptions will carry forward into all scenarios
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <AssumptionSlider
              id="salary_inflation"
              label="Annual Salary Inflation"
              value={salaryInflation}
              min={0}
              max={8}
              step={0.5}
              unit="%"
              onChange={setSalaryInflation}
            />

            <AssumptionSlider
              id="client_growth"
              label="Annual Client Demand Growth"
              value={clientGrowth}
              min={0}
              max={20}
              step={1}
              unit="%"
              onChange={setClientGrowth}
            />
          </div>

          {/* Projection Preview */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <h3 className="text-sm font-medium text-slate-600 mb-3">Year 1 Projection (with current assumptions)</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Projected Labour Cost:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  ${(year1LabourCost / 1000000).toFixed(1)}M
                </span>
              </div>
              <div>
                <span className="text-slate-500">Projected Revenue:</span>
                <span className="ml-2 font-semibold text-slate-900">
                  ${(year1Revenue / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These assumptions will be used throughout the simulation
            and can be revisited at any time from the Scenario Builder. Your decisions in
            each scenario will build upon these baseline assumptions.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/operational-data')}
            className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Operational Data
          </button>
          <button
            onClick={() => navigate('/scenario/1')}
            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            Begin Scenario 1
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
