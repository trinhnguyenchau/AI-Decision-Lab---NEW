import React from 'react';
import { HelpCircle, RotateCcw } from 'lucide-react';

interface AssumptionSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  onReset?: () => void;
  disabled?: boolean;
}

export function AssumptionSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  onReset,
  disabled,
}: AssumptionSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
            {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}
            {unit && <span className="text-slate-500 ml-1">{unit}</span>}
          </span>
          {onReset && (
            <button
              onClick={onReset}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

interface AssumptionToggleProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AssumptionToggle({
  label,
  options,
  value,
  onChange,
  disabled,
}: AssumptionToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            disabled={disabled}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
              value === option
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

interface DecisionOptionCardProps {
  id: string;
  label: string;
  description: string;
  kpiDeltas: {
    revenue: number;
    profit: number;
    employees: number;
    productivity: number;
    innovation: number;
    trust: number;
    workforce_capability: number;
  };
  selected: boolean;
  locked: boolean;
  onSelect: () => void;
}

export function DecisionOptionCard({
  label,
  description,
  kpiDeltas,
  selected,
  locked,
  onSelect,
}: DecisionOptionCardProps) {
  return (
    <button
      onClick={onSelect}
      disabled={locked}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'border-slate-900 bg-slate-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      } ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          selected ? 'border-slate-900 bg-slate-900' : 'border-slate-300'
        }`}>
          {selected && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{label}</h4>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          {selected && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-medium text-slate-500 mb-2">IMPACT ON KPIS</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(kpiDeltas).map(([key, delta]) => (
                  <span
                    key={key}
                    className={`text-xs px-2 py-1 rounded ${
                      delta > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : delta < 0
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-50 text-slate-500'
                    }`}
                  >
                    {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {delta > 0 ? '+' : ''}{delta}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

interface HintDisclosureProps {
  hint: string;
  onOpen?: () => void;
}

export function HintDisclosure({ hint, onOpen }: HintDisclosureProps) {
  return (
    <details className="group" onToggle={(e) => {
      if ((e.target as HTMLDetailsElement).open && onOpen) onOpen();
    }}>
      <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 list-none">
        <HelpCircle className="w-4 h-4" />
        <span>Show hint</span>
      </summary>
      <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
        {hint}
      </div>
    </details>
  );
}

interface CalculationBreakdownProps {
  title: string;
  lines: { label: string; value: string | number; formula?: string }[];
  result: { label: string; value: string | number };
  note?: string;
}

export function CalculationBreakdown({ title, lines, result, note }: CalculationBreakdownProps) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <h4 className="font-semibold text-slate-900 mb-3">{title}</h4>
      <div className="space-y-2 text-sm">
        {lines.map((line, i) => (
          <div key={i} className="flex justify-between items-start">
            <span className="text-slate-600">{line.label}</span>
            <div className="text-right">
              <span className="font-mono text-slate-900">{line.value}</span>
              {line.formula && (
                <p className="text-xs text-slate-400 mt-0.5">{line.formula}</p>
              )}
            </div>
          </div>
        ))}
        <div className="border-t border-slate-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-700">{result.label}</span>
            <span className="font-semibold font-mono text-slate-900">{result.value}</span>
          </div>
        </div>
      </div>
      {note && (
        <p className="mt-3 text-xs text-slate-500 italic">{note}</p>
      )}
    </div>
  );
}

interface EvidenceTableProps {
  title?: string;
  rows: { label: string; value: string | number }[];
  columns?: string[];
}

export function EvidenceTable({ title, rows, columns }: EvidenceTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h4 className="font-semibold text-slate-900">{title}</h4>
        </div>
      )}
      <table className="w-full">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-2 text-sm text-slate-600">{row.label}</td>
              <td className="px-4 py-2 text-sm font-medium text-slate-900 text-right">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface ComparisonTableProps {
  title?: string;
  columns: string[];
  rows: { label: string; yourValue: string | number; rivalValue: string | number }[];
}

export function ComparisonTable({ title, columns, rows }: ComparisonTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {title && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h4 className="font-semibold text-slate-900">{title}</h4>
        </div>
      )}
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-2 text-left text-sm font-medium text-slate-600">Metric</th>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-2 text-right text-sm font-medium text-slate-600">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-4 py-2 text-sm text-slate-600">{row.label}</td>
              <td className={`px-4 py-2 text-sm font-medium text-right ${
                typeof row.yourValue === 'number' && typeof row.rivalValue === 'number'
                  ? row.yourValue < row.rivalValue ? 'text-rose-600' : 'text-emerald-600'
                  : 'text-slate-900'
              }`}>
                {row.yourValue}
              </td>
              <td className={`px-4 py-2 text-sm font-medium text-right ${
                typeof row.yourValue === 'number' && typeof row.rivalValue === 'number'
                  ? row.rivalValue < row.yourValue ? 'text-rose-600' : 'text-emerald-600'
                  : 'text-slate-900'
              }`}>
                {row.rivalValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
