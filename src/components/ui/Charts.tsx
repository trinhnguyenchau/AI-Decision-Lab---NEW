import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface ProbabilityBarChartProps {
  outcomes: {
    label: string;
    probability: number;
    productivityGain?: number;
    additionalCost?: number;
  }[];
}

export function ProbabilityBarChart({ outcomes }: ProbabilityBarChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-900 mb-4">Industry Survey: Probability-Weighted Outcomes</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={outcomes} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="label" width={120} />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Probability']}
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="probability" fill="#64748b" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {outcomes.map((outcome) => (
          <div key={outcome.label} className="p-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">{outcome.label}</p>
            <p className="font-semibold text-slate-900">{outcome.productivityGain}% gain</p>
            {outcome.additionalCost !== undefined && (
              <p className="text-xs text-slate-500">
                {outcome.additionalCost > 0 ? `+$${(outcome.additionalCost / 1000)}K cost` : 'No extra cost'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface TrendLineChartProps {
  title: string;
  data: {
    year: number;
    yourClients: number;
    rivalClients: number;
  }[];
  yLabel?: string;
}

export function TrendLineChart({ title, data, yLabel = 'Clients' }: TrendLineChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-900 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tickFormatter={(v) => `Year ${v}`} />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="yourClients"
            stroke="#1e293b"
            strokeWidth={2}
            dot={{ fill: '#1e293b' }}
            name="Your Firm"
          />
          <Line
            type="monotone"
            dataKey="rivalClients"
            stroke="#64748b"
            strokeWidth={2}
            dot={{ fill: '#64748b' }}
            name="Competitor"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GaugeIndicatorProps {
  value: number;
  label: string;
  color?: 'slate' | 'amber' | 'emerald' | 'rose';
}

export function GaugeIndicator({ value, label, color = 'slate' }: GaugeIndicatorProps) {
  const colorClasses = {
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    rose: 'bg-rose-100 text-rose-700',
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl border border-slate-200">
      <svg viewBox="0 0 100 60" className="w-24 h-16">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          transform="rotate(-90 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={circumference * 0.25}
          transform="rotate(-90 50 50)"
          className={color === 'amber' ? 'text-amber-500' : color === 'emerald' ? 'text-emerald-500' : color === 'rose' ? 'text-rose-500' : 'text-slate-500'}
        />
        <text x="50" y="55" textAnchor="middle" className="text-lg font-bold fill-slate-900">
          {value}%
        </text>
      </svg>
      <p className="text-sm text-slate-600 mt-1">{label}</p>
    </div>
  );
}

interface KpiTrajectoryChartProps {
  checkpoints: {
    checkpoint: string;
    revenue: number;
    profit: number;
    productivity_index: number;
    innovation_index: number;
    trust_index: number;
  }[];
}

export function KpiTrajectoryChart({ checkpoints }: KpiTrajectoryChartProps) {
  if (checkpoints.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-900 mb-4">KPI Trajectory</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={checkpoints}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="checkpoint" tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 'auto']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Revenue ($M)" />
          <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Profit ($M)" />
          <Line type="monotone" dataKey="trust_index" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} name="Trust" />
          <Line type="monotone" dataKey="innovation_index" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Innovation" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ComparisonBarChartProps {
  title: string;
  data: {
    label: string;
    horizon: number;
    challenger: number;
  }[];
}

export function ComparisonBarChart({ title, data }: ComparisonBarChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h4 className="font-semibold text-slate-900 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar dataKey="horizon" fill="#1e293b" name="Horizon" radius={[4, 4, 0, 0]} />
          <Bar dataKey="challenger" fill="#64748b" name="Challenger" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Simple DonutChart for fallback
interface DonutChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
}

export function DonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativeAngle = -90;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      {title && <h4 className="font-semibold text-slate-900 mb-4">{title}</h4>}
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-40 h-40">
          {data.map((segment, i) => {
            const angle = (segment.value / total) * 360;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (cumulativeAngle * Math.PI) / 180;

            const x1 = 50 + 40 * Math.cos(startRad);
            const y1 = 50 + 40 * Math.sin(startRad);
            const x2 = 50 + 40 * Math.cos(endRad);
            const y2 = 50 + 40 * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={segment.color || `hsl(${(i * 60) % 360}, 70%, 60%)`}
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div className="ml-4 text-sm">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: d.color || `hsl(${(i * 60) % 360}, 70%, 60%)` }}
              />
              <span className="text-slate-600">{d.label}: {d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
