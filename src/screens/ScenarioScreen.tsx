import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, AlertTriangle, Calculator } from 'lucide-react';
import { PageShell, LoadingSpinner } from '../components/layout/TopNav';
import { KpiCard } from '../components/ui/KpiCard';
import {
  AssumptionSlider,
  AssumptionToggle,
  DecisionOptionCard,
  HintDisclosure,
  CalculationBreakdown,
  EvidenceTable,
  ComparisonTable,
} from '../components/ui/Inputs';
import {
  ProbabilityBarChart,
  TrendLineChart,
  GaugeIndicator,
  KpiTrajectoryChart,
  ComparisonBarChart,
} from '../components/ui/Charts';
import {
  calculateScenario1,
  calculateScenario2,
  calculateScenario3,
  calculateClientProjection,
  formatCurrency,
} from '../lib/calculations';
import { Scenario, KPIState, baselineKPIs, DecisionOptionType } from '../types';

interface Props {
  userId: string | null;
  scenarios: Scenario[];
  currentKPIs: KPIState;
  responses: Record<string, {
    id: string;
    selected_option: DecisionOptionType | null;
    locked_at: string | null;
    assumptions_used: Record<string, string | number>;
    reflection_theory: string | null;
    reflection_text: string | null;
  }>;
  snapshots: { checkpoint: string }[];
  loading: boolean;
  onSaveAssumptions: (scenarioId: string, assumptions: Record<string, string | number>, outputs: Record<string, number>) => void;
  onSelectDecision: (scenario: Scenario, option: DecisionOptionType) => void;
  onSaveReflection: (scenarioId: string, theory: string, text: string, answers: Record<string, string>) => void;
  onLockScenario: (scenarioId: string) => void;
  onAddNote: (content: string, scenarioId: string) => void;
}

export function ScenarioScreen({
  userId,
  scenarios,
  currentKPIs,
  responses,
  snapshots,
  loading,
  onSaveAssumptions,
  onSelectDecision,
  onSaveReflection,
  onLockScenario,
  onAddNote,
}: Props) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scenarioIndex = parseInt(id || '1', 10);
  const scenario = scenarios.find(s => s.order_index === scenarioIndex);

  const [assumptions, setAssumptions] = useState<Record<string, string | number>>({});
  const [selectedOption, setSelectedOption] = useState<DecisionOptionType | null>(null);
  const [reflectionTheory, setReflectionTheory] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const response = scenario ? responses[scenario.id] : null;
  const isLocked = response?.locked_at != null;

  // Initialize from saved response
  useEffect(() => {
    if (response) {
      if (response.assumptions_used) {
        setAssumptions(response.assumptions_used);
      }
      if (response.selected_option) {
        setSelectedOption(response.selected_option);
      }
      if (response.reflection_theory) {
        setReflectionTheory(response.reflection_theory);
      }
      if (response.reflection_text) {
        setReflectionText(response.reflection_text);
      }
    } else if (scenario) {
      // Set defaults from scenario builder_assumptions
      const defaults: Record<string, string | number> = {};
      scenario.builder_assumptions.forEach(a => {
        defaults[a.id] = a.default;
      });
      setAssumptions(defaults);
    }
  }, [response, scenario]);

  const handleAssumptionChange = (id: string, value: string | number) => {
    const newAssumptions = { ...assumptions, [id]: value };
    setAssumptions(newAssumptions);
    if (scenario && outputs) {
      onSaveAssumptions(scenario.id, newAssumptions, outputs);
    }
  };

  // Calculate outputs based on scenario
  const outputs = useMemo<Record<string, number>>(() => {
    if (!scenario) return {};
    switch (scenario.order_index) {
      case 1: {
        const calc = calculateScenario1(assumptions);
        return {
          expectedProductivityGain: calc.expectedProductivityGain,
          expectedLabourSavings: calc.expectedLabourSavings,
          expectedImplementationCost: calc.expectedImplementationCost,
          expectedNetBenefitYear1: calc.expectedNetBenefitYear1,
          breakEvenMonths: calc.breakEvenMonths || 0,
        };
      }
      case 2: {
        const calc = calculateScenario2(assumptions);
        return {
          reductionSavings: calc.reductionSavings,
          severanceCost: calc.severanceCost,
          retrainingCost: calc.retrainingCost,
          capacityFreed: calc.capacityFreed,
        };
      }
      case 3: {
        const calc = calculateScenario3(assumptions);
        return {
          expectedLossNoSafeguard: calc.expectedLossNoSafeguard,
          expectedLossWithSafeguard: calc.expectedLossWithSafeguard,
          totalCostWithSafeguard: calc.totalCostWithSafeguard,
        };
      }
      default:
        return {};
    }
  }, [scenario, assumptions]);

  const handleSelectOption = (option: DecisionOptionType) => {
    if (isLocked || !scenario) return;
    setSelectedOption(option);
    onSelectDecision(scenario, option);
  };

  const handleSaveAndContinue = async () => {
    if (!scenario || !selectedOption) return;
    setIsSaving(true);
    try {
      await onSaveReflection(scenario.id, reflectionTheory, reflectionText, questionAnswers);
      await onLockScenario(scenario.id);
      if (scenarioIndex < 5) {
        navigate(`/scenario/${scenarioIndex + 1}`);
      } else {
        navigate('/recommendation');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    if (noteContent.trim() && scenario) {
      onAddNote(noteContent.trim(), scenario.id);
      setNoteContent('');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!scenario) return <div>Scenario not found</div>;

  const prevPath = scenarioIndex === 1 ? '/financials' : `/scenario/${scenarioIndex - 1}`;
  const nextPath = scenarioIndex === 5 ? '/recommendation' : `/scenario/${scenarioIndex + 1}`;
  const canContinue = selectedOption !== null;

  return (
    <PageShell kpis={currentKPIs} progress={{ step: 2 + scenarioIndex, total: 9 }} userId={userId}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
              Scenario {scenarioIndex} of 5
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{scenario.title}</h1>
        </div>

        {/* Narrative */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <p className="text-lg text-slate-700 leading-relaxed">{scenario.narrative}</p>
        </div>

        {/* Evidence Dashboard */}
        <EvidenceDashboard scenario={scenario} />

        {/* Scenario Builder Panel */}
        {scenario.builder_assumptions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Calculator className="w-5 h-5 text-slate-700" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Scenario Builder</h2>
            </div>

            <div className="space-y-6">
              {scenario.builder_assumptions.map((assumption) => (
                <div key={assumption.id}>
                  {assumption.type === 'slider' ? (
                    <AssumptionSlider
                      id={assumption.id}
                      label={assumption.label}
                      value={(assumptions[assumption.id] as number) || (assumption.default as number)}
                      min={assumption.min || 0}
                      max={assumption.max || 100}
                      step={assumption.step || 1}
                      unit={assumption.unit}
                      onChange={(v) => handleAssumptionChange(assumption.id, v)}
                      disabled={isLocked}
                    />
                  ) : (
                    <AssumptionToggle
                      id={assumption.id}
                      label={assumption.label}
                      options={assumption.options || []}
                      value={(assumptions[assumption.id] as string) || (assumption.default as string)}
                      onChange={(v) => handleAssumptionChange(assumption.id, v)}
                      disabled={isLocked}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculation Panel */}
        {Object.keys(outputs).length > 0 && (
          <CalculationPanel scenarioIndex={scenarioIndex} outputs={outputs} />
        )}

        {/* Guiding Questions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-slate-700" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Guiding Questions</h2>
          </div>

          <div className="space-y-4">
            {scenario.guiding_questions.map((q, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <p className="text-slate-700 font-medium mb-2">
                  {i + 1}. {q.question}
                </p>
                <HintDisclosure hint={q.hint} />
                {!isLocked && (
                  <textarea
                    className="w-full mt-3 p-3 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
                    rows={2}
                    placeholder="Your thoughts..."
                    value={questionAnswers[q.question] || ''}
                    onChange={(e) => setQuestionAnswers({ ...questionAnswers, [q.question]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Decision Options */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Decision Options</h2>
          <div className="space-y-4">
            {scenario.decision_options.map((option) => (
              <DecisionOptionCard
                key={option.id}
                id={option.id}
                label={option.label}
                description={option.description}
                kpiDeltas={option.kpiDeltas as unknown as {
                  revenue: number;
                  profit: number;
                  employees: number;
                  productivity: number;
                  innovation: number;
                  trust: number;
                  workforce_capability: number;
                }}
                selected={selectedOption === option.id}
                locked={isLocked}
                onSelect={() => handleSelectOption(option.id)}
              />
            ))}
          </div>
          {isLocked && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-500" />
              <p className="text-sm text-slate-600">
                This scenario is locked. Your decision has been recorded.
              </p>
            </div>
          )}
        </div>

        {/* Reflection Panel */}
        {scenario.reflection_config && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Reflection</h2>
            <p className="text-slate-700 mb-4">{scenario.reflection_config.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenario.reflection_config.theoryOptions.map((theory) => (
                <button
                  key={theory}
                  onClick={() => !isLocked && setReflectionTheory(theory)}
                  disabled={isLocked}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    reflectionTheory === theory
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  } ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <p className="font-medium text-slate-900">{theory}</p>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Justification
              </label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
                rows={3}
                placeholder="Explain your reasoning..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                disabled={isLocked}
              />
            </div>
          </div>
        )}

        {/* Notebook Quick Entry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Note</h2>
          <div className="flex gap-3">
            <textarea
              className="flex-1 p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={2}
              placeholder="Add a note to your decision notebook..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <button
              onClick={handleAddNote}
              disabled={!noteContent.trim()}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(prevPath)}
            className="px-6 py-2 text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {scenarioIndex === 1 ? 'Financials' : `Scenario ${scenarioIndex - 1}`}
          </button>
          <button
            onClick={handleSaveAndContinue}
            disabled={!canContinue || isSaving}
            className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : (
              <>
                Save & Continue
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

// Evidence Dashboard Component
function EvidenceDashboard({ scenario }: { scenario: Scenario }) {
  const evidence = scenario.evidence_data as Record<string, unknown>;

  return (
    <div className="mb-6">
      {scenario.order_index === 1 && evidence.currentSituation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <EvidenceTable
            title="Current Situation"
            rows={(evidence.currentSituation as { rows: { label: string; value: string }[] }).rows}
          />
          <EvidenceTable
            title="Vendor Claims"
            rows={(evidence.vendorClaims as { rows: { label: string; value: string }[] }).rows}
          />
        </div>
      )}

      {scenario.order_index === 1 && evidence.industrySurvey && (
        <ProbabilityBarChart
          outcomes={(evidence.industrySurvey as { outcomes: { label: string; probability: number; productivityGain: number }[] }).outcomes}
        />
      )}

      {scenario.order_index === 2 && evidence.currentSituation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <EvidenceTable
            title="Current Situation"
            rows={(evidence.currentSituation as { rows: { label: string; value: string }[] }).rows}
          />
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-900 mb-4">HR Survey Results</h4>
            <div className="flex justify-around">
              <GaugeIndicator
                value={(evidence.hrSurvey as { concernedJobSecurity: number }).concernedJobSecurity}
                label="Concerned about Job Security"
                color="rose"
              />
              <GaugeIndicator
                value={(evidence.hrSurvey as { willingToRetrain: number }).willingToRetrain}
                label="Willing to Retrain"
                color="emerald"
              />
            </div>
          </div>
        </div>
      )}

      {scenario.order_index === 3 && evidence.incident && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Incident Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Potential Contract Loss</span>
                <span className="font-semibold text-rose-600">
                  {formatCurrency((evidence.incident as { potentialContractLoss: number }).potentialContractLoss)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Client Retention</span>
                <span className="font-semibold text-slate-900">
                  {(evidence.incident as { currentRetention: number }).currentRetention}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Future Error Probability</span>
                <span className="font-semibold text-amber-600">
                  {(evidence.incident as { estimatedErrorProbability: number }).estimatedErrorProbability}%
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h4 className="font-semibold text-slate-900 mb-3">Management Proposal</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Human Review Cost</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency((evidence.managementProposal as { reviewCost: number }).reviewCost)}/yr
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Expected Error Reduction</span>
                <span className="font-semibold text-emerald-600">
                  {(evidence.managementProposal as { errorReduction: number }).errorReduction}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {scenario.order_index === 4 && evidence.comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ComparisonTable
            title="Competitive Comparison"
            columns={(evidence.comparison as { columns: string[] }).columns}
            rows={(evidence.comparison as { rows: { label: string; yourValue: string; rivalValue: string }[] }).rows}
          />
          <TrendLineChart
            title="5-Year Client Projection"
            data={calculateClientProjection(
              5,
              (evidence as { yourGrowthRate: number }).yourGrowthRate,
              (evidence as { rivalGrowthRate: number }).rivalGrowthRate
            )}
          />
        </div>
      )}

      {scenario.order_index === 5 && evidence.comparison && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <ComparisonTable
            title="Horizon vs. AI-Native Challenger"
            columns={(evidence.comparison as { columns: string[] }).columns}
            rows={(evidence.comparison as { rows: { label: string; yourValue: string; rivalValue: string }[] }).rows}
          />
          <ComparisonBarChart
            title="Revenue per Employee Gap"
            data={[
              { label: 'Horizon', horizon: 200000, challenger: 0 },
              { label: 'Clarity AI', horizon: 0, challenger: 333000 },
            ]}
          />
        </div>
      )}
    </div>
  );
}

// Calculation Panel Component
function CalculationPanel({ scenarioIndex, outputs }: { scenarioIndex: number; outputs: Record<string, number> }) {
  if (scenarioIndex === 1) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Calculator className="w-5 h-5 text-slate-700" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Calculated Outcomes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CalculationBreakdown
            title="Expected Benefits (Industry Survey)"
            lines={[
              { label: 'Expected Productivity Gain', value: `${outputs.expectedProductivityGain?.toFixed(1)}%` },
              { label: 'Expected Labour Savings', value: formatCurrency(outputs.expectedLabourSavings) },
            ]}
            result={{ label: 'Year 1 Net Benefit', value: formatCurrency(outputs.expectedNetBenefitYear1) }}
            note="Based on probability-weighted outcomes: 30% × 15%, 50% × 10%, 20% × 5%"
          />
          <CalculationBreakdown
            title="Implementation Costs"
            lines={[
              { label: 'AI Software', value: '$500,000' },
              { label: 'Training', value: '$300,000' },
              { label: 'Implementation', value: formatCurrency(outputs.expectedImplementationCost) },
            ]}
            result={{ label: 'Total One-time', value: formatCurrency(outputs.expectedImplementationCost) }}
          />
        </div>

        {outputs.breakEvenMonths != null && outputs.breakEvenMonths > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600">
              <strong>Break-even Period:</strong>{' '}
              {outputs.breakEvenMonths} months under current assumptions
            </p>
          </div>
        )}
      </div>
    );
  }

  if (scenarioIndex === 3) {
    const lossNoSafeguard = outputs.expectedLossNoSafeguard || 0;
    const lossWithSafeguard = outputs.totalCostWithSafeguard || 0;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Calculator className="w-5 h-5 text-slate-700" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Expected Loss Comparison</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Do Nothing</p>
            <p className="text-2xl font-bold text-slate-900">
              Expected Loss: {formatCurrency(lossNoSafeguard)}/yr
            </p>
            <p className="text-xs text-slate-400 mt-1">
              10% probability × $2M potential loss
            </p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-600 mb-1">Full Safeguard</p>
            <p className="text-2xl font-bold text-slate-900">
              Total Cost: {formatCurrency(lossWithSafeguard)}/yr
            </p>
            <p className="text-xs text-slate-400 mt-1">
              $300K review + $40K reduced expected loss
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Counterintuitive result:</strong> The full safeguard costs more in pure
            expected-value terms (<strong>{formatCurrency(lossWithSafeguard)}</strong>) than doing
            nothing (<strong>{formatCurrency(lossNoSafeguard)}</strong>). Consider: what factors
            might not be captured in this calculation?
          </p>
        </div>
      </div>
    );
  }

  return null;
}
