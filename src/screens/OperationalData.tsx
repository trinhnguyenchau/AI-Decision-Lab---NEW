import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, FileText, ArrowRight } from 'lucide-react';
import { PageShell } from '../components/layout/TopNav';
import { baselineKPIs, BASELINE_FIGURES } from '../types';

interface Props {
  userId: string | null;
}

export function OperationalData({ userId }: Props) {
  const navigate = useNavigate();

  // Derived metrics
  const revenuePerEmployee = BASELINE_FIGURES.annualRevenue / BASELINE_FIGURES.employees;
  const adminTimePercent = 40;
  const reportDraftingPercentOfAdmin = 25;
  const reportDraftingPercentOfTotal = adminTimePercent * (reportDraftingPercentOfAdmin / 100);

  return (
    <PageShell kpis={baselineKPIs} progress={{ step: 1, total: 9 }} userId={userId}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/brief')}
              className="text-slate-400 hover:text-slate-600 text-sm"
            >
              ← Back to Brief
            </button>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Operational Data</h1>
          <p className="text-slate-600 mt-2">
            Understanding the current staffing and workload allocation is essential before
            evaluating AI adoption scenarios.
          </p>
        </div>

        {/* Staffing Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Users className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Staffing Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-slate-900">100</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Active Clients</p>
              <p className="text-3xl font-bold text-slate-900">500+</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-1">Revenue per Employee</p>
              <p className="text-3xl font-bold text-slate-900">${(revenuePerEmployee / 1000).toFixed(0)}K</p>
              <p className="text-xs text-slate-400 mt-1">Derived: $20M / 100 employees</p>
            </div>
          </div>
        </div>

        {/* Time Allocation Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Clock className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Time Allocation Analysis</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Time Breakdown */}
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-4">Staff Time Distribution</h3>
              <div className="space-y-4">
                {/* Administrative */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Administration</span>
                    <span className="font-medium text-slate-900">40%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Includes compliance, reporting, scheduling, and document preparation
                  </p>
                </div>

                {/* Client Work */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Client Services</span>
                    <span className="font-medium text-slate-900">50%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct client interactions, audits, tax preparation, advisory services
                  </p>
                </div>

                {/* Training and Development */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Training & Development</span>
                    <span className="font-medium text-slate-900">10%</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Breakdown */}
            <div className="bg-slate-50 rounded-xl p-5">
              <h3 className="text-sm font-medium text-slate-600 mb-4">Administration Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">Drafting Reports</span>
                  </div>
                  <span className="font-semibold text-slate-900">25%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-slate-700">Data Entry & Verification</span>
                  <span className="font-semibold text-slate-900">35%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-slate-700">Scheduling & Coordination</span>
                  <span className="font-semibold text-slate-900">20%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-sm text-slate-700">Compliance Documentation</span>
                  <span className="font-semibold text-slate-900">20%</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-900 text-white rounded-lg">
                <p className="text-sm">
                  <strong>Key Insight:</strong> Report drafting alone represents{' '}
                  <strong>{reportDraftingPercentOfTotal.toFixed(0)}% of total firm time</strong>
                  {' '}(40% admin × 25% drafting).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <ArrowRight className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Financial Impact Calculations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Administrative Labour Cost</p>
              <p className="text-2xl font-bold text-slate-900">$4,000,000</p>
              <p className="text-xs text-slate-400 mt-1">
                $10M total × 40% admin time
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-500 mb-2">Report-Drafting Labour Cost</p>
              <p className="text-2xl font-bold text-slate-900">$1,000,000</p>
              <p className="text-xs text-slate-400 mt-1">
                $4M admin × 25% report drafting
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              These figures will be used in Scenario 1 when calculating potential
              productivity gains from AI adoption. The choice of which cost base to
              apply (administrative vs. report-drafting only) will significantly
              affect the projected ROI.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/brief')}
            className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Back to Brief
          </button>
          <button
            onClick={() => navigate('/financials')}
            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            Review Financial Dashboard
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
