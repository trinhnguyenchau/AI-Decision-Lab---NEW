import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Brain, Target, TrendingUp } from 'lucide-react';
import { PageShell } from '../components/layout/TopNav';
import { KpiCard } from '../components/ui/KpiCard';
import { baselineKPIs } from '../types';

interface Props {
  userId: string | null;
}

export function CompanyBrief({ userId }: Props) {
  const navigate = useNavigate();

  return (
    <PageShell kpis={baselineKPIs} progress={{ step: 0, total: 9 }} userId={userId}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-medium mb-4">
            Managing Partner Briefing
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Horizon Accounting Group</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            You have been retained as a strategic consultant to advise the Managing Partner on
            adopting generative AI technology across the firm. Your recommendations will shape
            the competitive position and future of every employee.
          </p>
        </div>

        {/* Narrative Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Firm Overview</h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Horizon Accounting Group is a mid-sized accounting firm employing <strong>100 staff</strong>{" "}
              and serving <strong>500+ clients</strong>. The firm generates <strong>$20 million in annual revenue</strong> {" "}
               with <strong>$10 million in labor costs</strong>.
            </p>
            <p>
              The accounting industry is rapidly adopting AI-powered document processing, with early
              adopters reporting significant productivity gains. However, the technology also raises
              concerns about job displacement, accuracy risks, and the changing nature of client
              relationships.
            </p>
            <p>
              The Managing Partner has made it clear: the objective is not pure profit maximization.
              The firm must balance multiple objectives:
            </p>
          </div>
        </div>

        {/* Engagement Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BarChart3, label: 'Data Analysis', desc: 'Analyze operational and financial metrics' },
            { icon: TrendingUp, label: 'Economic Reasoning', desc: 'Apply cost-benefit frameworks' },
            { icon: Target, label: 'Managing Uncertainty', desc: 'Navigate ambiguous outcomes' },
            { icon: Brain, label: 'Strategic Decisions', desc: 'Make high-stakes recommendations' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:border-slate-300 transition-colors"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">{item.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Starting KPIs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Starting Conditions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Revenue" value="$20M" size="sm" />
            <KpiCard label="Profit" value="$2M" size="sm" />
            <KpiCard label="Employees" value={100} size="sm" />
            <KpiCard label="Profit Margin" value="10%" size="sm" />
            <KpiCard label="Productivity Index" value={100} size="sm" />
            <KpiCard label="Innovation Index" value={100} size="sm" />
            <KpiCard label="Trust Index" value={100} size="sm" />
            <KpiCard label="Workforce Capability" value={100} size="sm" />
          </div>
          <p className="text-sm text-slate-500 mt-4 italic">
            These indices are benchmarked to an industry standard of 100. Your decisions will
            affect each dimension differently.
          </p>
        </div>

        {/* Assessment Philosophy */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800">
            <strong>Assessment Note:</strong> You will not be assessed on whether your decisions
            were "correct." You will be assessed on whether your decisions were economically
            defensible, based on sound reasoning, and appropriately accounted for uncertainty.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/operational-data')}
            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            Review Operational Data
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
