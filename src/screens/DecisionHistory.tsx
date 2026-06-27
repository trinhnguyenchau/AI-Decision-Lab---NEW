import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Eye, TrendingUp } from 'lucide-react';
import { PageShell } from '../components/layout/TopNav';
import { KpiCard } from '../components/ui/KpiCard';
import { KpiTrajectoryChart } from '../components/ui/Charts';
import {
  Scenario,
  KPIState,
  KPISnapshot,
  baselineKPIs,
  ScenarioResponse,
} from '../types';

interface Props {
  userId: string | null;
  scenarios: Scenario[];
  responses: Record<string, ScenarioResponse>;
  snapshots: KPISnapshot[];
  currentKPIs: KPIState;
  progress: { step: number; total: number };
}

export function DecisionHistory({
  userId,
  scenarios,
  responses,
  snapshots,
  currentKPIs,
  progress,
}: Props) {
  const navigate = useNavigate();

  // Build decision summary
  const decisionSummary = scenarios.map((scenario) => {
    const response = responses[scenario.id];
    const decision = scenario.decision_options.find(o => o.id === response?.selected_option);
    return {
      scenario,
      response,
      decision,
    };
  });

  // Sort snapshots for chart
  const sortedSnapshots = [...snapshots].sort((a, b) => {
    const order = ['baseline', 'after_scenario_1', 'after_scenario_2', 'after_scenario_3', 'after_scenario_4', 'after_scenario_5'];
    return order.indexOf(a.checkpoint) - order.indexOf(b.checkpoint);
  });

  // Include baseline in chart
  const chartData = [
    {
      checkpoint: 'Baseline',
      revenue: baselineKPIs.revenue,
      profit: baselineKPIs.profit,
      productivity_index: baselineKPIs.productivity_index,
      innovation_index: baselineKPIs.innovation_index,
      trust_index: baselineKPIs.trust_index,
    },
    ...sortedSnapshots.map(s => ({
      checkpoint: s.checkpoint.replace('after_scenario_', 'S'),
      revenue: s.revenue,
      profit: s.profit,
      productivity_index: s.productivity_index,
      innovation_index: s.innovation_index,
      trust_index: s.trust_index,
    })),
  ];

  return (
    <PageShell kpis={currentKPIs} progress={progress} showKPIs={false} userId={userId}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <History className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Decision History</h1>
              <p className="text-slate-600">Review your decisions and their impact on firm KPIs</p>
            </div>
          </div>
        </div>

        {/* KPI Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">KPI Comparison: Starting vs. Current</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Revenue', base: baselineKPIs.revenue, current: currentKPIs.revenue, unit: '$M' },
              { label: 'Profit', base: baselineKPIs.profit, current: currentKPIs.profit, unit: '$M' },
              { label: 'Employees', base: baselineKPIs.employees, current: currentKPIs.employees, unit: '' },
              { label: 'Productivity', base: baselineKPIs.productivity_index, current: currentKPIs.productivity_index, unit: '' },
              { label: 'Innovation', base: baselineKPIs.innovation_index, current: currentKPIs.innovation_index, unit: '' },
              { label: 'Trust Index', base: baselineKPIs.trust_index, current: currentKPIs.trust_index, unit: '' },
              { label: 'Capability', base: baselineKPIs.workforce_capability_index, current: currentKPIs.workforce_capability_index, unit: '' },
            ].map((kpi) => {
              const delta = typeof kpi.current === 'number' && typeof kpi.base === 'number'
                ? kpi.current - kpi.base
                : 0;
              return (
                <div key={kpi.label} className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">{kpi.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-900">
                      {kpi.unit === '$M' ? '$' : ''}{kpi.current}{kpi.unit}
                    </span>
                  </div>
                  <div className={`text-xs font-medium ${delta > 0 ? 'text-emerald-600' : delta < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(1) !== '0.0' ? delta.toFixed(1) : '0'}
                    {delta.toFixed(1) !== '0.0' && ' change'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* KPI Trajectory Chart */}
        {sortedSnapshots.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-slate-700" />
              <h2 className="text-lg font-semibold text-slate-900">KPI Trajectory</h2>
            </div>
            <KpiTrajectoryChart checkpoints={chartData} />
          </div>
        )}

        {/* Decision Summary Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Scenario Decisions</h2>
          </div>

          {decisionSummary.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No decisions recorded yet
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Scenario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Decision</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Key KPI Deltas</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {decisionSummary.map(({ scenario, response, decision }, i) => (
                  <tr key={scenario.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">S{scenario.order_index}: {scenario.title}</p>
                        <p className="text-xs text-slate-500">Decision {i + 1} of 5</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {decision ? (
                        <div>
                          <p className="font-medium text-slate-900">{decision.label}</p>
                          <p className="text-xs text-slate-500">{decision.description}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not decided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {decision ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {decision.kpiDeltas.revenue !== 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${decision.kpiDeltas.revenue > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              Rev: {decision.kpiDeltas.revenue > 0 ? '+' : ''}{decision.kpiDeltas.revenue}M
                            </span>
                          )}
                          {decision.kpiDeltas.trust !== 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${decision.kpiDeltas.trust > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              Trust: {decision.kpiDeltas.trust > 0 ? '+' : ''}{decision.kpiDeltas.trust}
                            </span>
                          )}
                          {decision.kpiDeltas.employees !== 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${decision.kpiDeltas.employees > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              Staff: {decision.kpiDeltas.employees > 0 ? '+' : ''}{decision.kpiDeltas.employees}
                            </span>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        response?.locked_at
                          ? 'bg-slate-100 text-slate-600'
                          : response?.selected_option
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {response?.locked_at ? 'Locked' : response?.selected_option ? 'Pending lock' : 'Incomplete'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Review Buttons */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3">
          {scenarios.map((scenario) => {
            const response = responses[scenario.id];
            return (
              <button
                key={scenario.id}
                onClick={() => navigate(`/scenario/${scenario.order_index}`)}
                className="p-3 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">S{scenario.order_index}</span>
                  <Eye className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 truncate">{scenario.title}</p>
                {response?.selected_option && (
                  <p className="text-xs text-slate-500 mt-1">
                    {scenario.decision_options.find(o => o.id === response.selected_option)?.label}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
