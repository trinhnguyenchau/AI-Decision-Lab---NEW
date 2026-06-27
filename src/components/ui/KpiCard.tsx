import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number;
  unit?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function KpiCard({ label, value, delta, unit, icon, size = 'md' }: KpiCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const valueClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-2xl font-bold',
    lg: 'text-3xl font-bold',
  };

  const getDeltaColor = () => {
    if (!delta) return 'text-slate-500';
    // For trust/innovation/capability indices, higher is always better
    // For profit/revenue, higher is good
    // For employees, context matters but we'll show green for growth
    if (delta > 0) return 'text-emerald-600';
    if (delta < 0) return 'text-rose-600';
    return 'text-slate-500';
  };

  const DeltaIcon = delta && delta > 0 ? TrendingUp : delta && delta < 0 ? TrendingDown : Minus;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${sizeClasses[size]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <p className={`${valueClasses[size]} text-slate-900`}>
            {value}
            {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
          </p>
          {delta !== undefined && (
            <div className={`flex items-center gap-1 mt-1 ${getDeltaColor()}`}>
              <DeltaIcon className="w-4 h-4" />
              <span className="text-sm font-medium">
                {delta > 0 ? '+' : ''}{delta.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-slate-50 rounded-lg text-slate-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface KpiStripProps {
  kpis: {
    revenue: number;
    profit: number;
    employees: number;
    productivity_index: number;
    innovation_index: number;
    trust_index: number;
    workforce_capability_index: number;
  };
  baseline?: {
    revenue: number;
    profit: number;
    employees: number;
    productivity_index: number;
    innovation_index: number;
    trust_index: number;
    workforce_capability_index: number;
  };
}

export function KpiStrip({ kpis, baseline }: KpiStripProps) {
  const cards = [
    {
      label: 'Revenue',
      value: `$${kpis.revenue.toFixed(1)}M`,
      delta: baseline ? kpis.revenue - baseline.revenue : undefined,
    },
    {
      label: 'Profit',
      value: `$${kpis.profit.toFixed(1)}M`,
      delta: baseline ? kpis.profit - baseline.profit : undefined,
    },
    {
      label: 'Employees',
      value: kpis.employees,
      delta: baseline ? kpis.employees - baseline.employees : undefined,
    },
    {
      label: 'Productivity',
      value: kpis.productivity_index,
      delta: baseline ? kpis.productivity_index - baseline.productivity_index : undefined,
    },
    {
      label: 'Innovation',
      value: kpis.innovation_index,
      delta: baseline ? kpis.innovation_index - baseline.innovation_index : undefined,
    },
    {
      label: 'Trust Index',
      value: kpis.trust_index,
      delta: baseline ? kpis.trust_index - baseline.trust_index : undefined,
    },
    {
      label: 'Workforce Capability',
      value: kpis.workforce_capability_index,
      delta: baseline ? kpis.workforce_capability_index - baseline.workforce_capability_index : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((card) => (
        <KpiCard
          key={card.label}
          label={card.label}
          value={card.value}
          delta={card.delta}
          size="sm"
        />
      ))}
    </div>
  );
}
