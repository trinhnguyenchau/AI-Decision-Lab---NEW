import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageShell } from '../components/layout/TopNav';
import {
  Scenario,
  KPIState,
  ScenarioResponse,
  NotebookEntry,
  Recommendation,
} from '../types';

interface Props {
  userId: string | null;
  scenarios: Scenario[];
  responses: Record<string, ScenarioResponse>;
  notebookEntries: NotebookEntry[];
  recommendation: Recommendation | null;
  currentKPIs: KPIState;
  attemptStatus: 'in_progress' | 'completed';
  onSaveRecommendation: (data: Partial<{
    major_decisions: string;
    data_used: string;
    assumptions_made: string;
    uncertainties_faced: string;
    economic_theories: string;
  }>) => void;
  onSubmitRecommendation: () => void;
}

export function ExecutiveRecommendation({
  userId,
  scenarios,
  responses,
  notebookEntries,
  recommendation,
  currentKPIs,
  attemptStatus,
  onSaveRecommendation,
  onSubmitRecommendation,
}: Props) {
  const navigate = useNavigate();
  const isSubmitted = attemptStatus === 'completed';

  const [majorDecisions, setMajorDecisions] = useState('');
  const [dataUsed, setDataUsed] = useState('');
  const [assumptionsMade, setAssumptionsMade] = useState('');
  const [uncertaintiesFaced, setUncertaintiesFaced] = useState('');
  const [economicTheories, setEconomicTheories] = useState('');

  // Load from saved recommendation
  useEffect(() => {
    if (recommendation) {
      setMajorDecisions(recommendation.major_decisions || '');
      setDataUsed(recommendation.data_used || '');
      setAssumptionsMade(recommendation.assumptions_made || '');
      setUncertaintiesFaced(recommendation.uncertainties_faced || '');
      setEconomicTheories(recommendation.economic_theories || '');
    }
  }, [recommendation]);

  // Auto-populate from decisions
  const decisionSummary = useMemo(() => {
    return scenarios.map((scenario) => {
      const response = responses[scenario.id];
      const decision = scenario.decision_options.find(o => o.id === response?.selected_option);
      const theory = response?.reflection_theory;
      return { scenario, response, decision, theory };
    });
  }, [scenarios, responses]);

  // Filter relevant notebook entries
  const relevantNotes = useMemo(() => {
    return notebookEntries.filter(e => e.scenario_id);
  }, [notebookEntries]);

  const wordCount = useMemo(() => {
    const allText = [majorDecisions, dataUsed, assumptionsMade, uncertaintiesFaced, economicTheories].join(' ');
    return allText.split(/\s+/).filter(w => w.length > 0).length;
  }, [majorDecisions, dataUsed, assumptionsMade, uncertaintiesFaced, economicTheories]);

  const allSectionsFilled = useMemo(() => {
    return majorDecisions.trim() &&
      dataUsed.trim() &&
      assumptionsMade.trim() &&
      uncertaintiesFaced.trim() &&
      economicTheories.trim();
  }, [majorDecisions, dataUsed, assumptionsMade, uncertaintiesFaced, economicTheories]);

  const handleSave = () => {
    onSaveRecommendation({
      major_decisions: majorDecisions,
      data_used: dataUsed,
      assumptions_made: assumptionsMade,
      uncertainties_faced: uncertaintiesFaced,
      economic_theories: economicTheories,
    });
  };

  const handleSubmit = () => {
    if (!allSectionsFilled) return;
    handleSave();
    onSubmitRecommendation();
  };

  // Check all scenarios are decided
  const allScenariosDecided = scenarios.every(s => responses[s.id]?.selected_option);

  if (!allScenariosDecided) {
    return (
      <PageShell kpis={currentKPIs} progress={{ step: 8, total: 9 }} userId={userId}>
        <div className="max-w-2xl mx-auto text-center py-16">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Incomplete Scenario Work</h1>
          <p className="text-slate-600 mb-8">
            You need to complete all five scenarios before submitting your executive recommendation.
          </p>
          {scenarios.filter(s => !responses[s.id]?.selected_option).map((s) => (
            <div key={s.id} className="mb-2">
              <button
                onClick={() => navigate(`/scenario/${s.order_index}`)}
                className="text-slate-700 hover:text-slate-900 underline"
              >
                Complete Scenario {s.order_index}: {s.title}
              </button>
            </div>
          ))}
        </div>
      </PageShell>
    );
  }

  if (isSubmitted) {
    return (
      <PageShell kpis={currentKPIs} progress={{ step: 8, total: 9 }} userId={userId}>
        <div className="max-w-2xl mx-auto text-center py-16">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Recommendation Submitted</h1>
          <p className="text-slate-600 mb-8">
            Your executive recommendation has been submitted and is now available for instructor review.
            Thank you for completing the AI Decision Lab simulation.
          </p>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-left">
            <h2 className="font-semibold text-slate-900 mb-4">Your Decision Summary</h2>
            <div className="space-y-3">
              {decisionSummary.map(({ scenario, decision, theory }) => (
                <div key={scenario.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-slate-600">{scenario.order_index}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{scenario.title}</p>
                    <p className="text-sm text-slate-600">{decision?.label}</p>
                    {theory && <p className="text-xs text-slate-400">Framework: {theory}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell kpis={currentKPIs} progress={{ step: 8, total: 9 }} userId={userId}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">CEO Report: Executive Recommendation</h1>
          <p className="text-slate-600 mt-2">
            Synthesize your analysis into a final report for the Managing Partner.
          </p>
        </div>

        {/* Assessment Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Assessment Philosophy</p>
              <p className="text-sm text-amber-700 mt-1">
                You are not being assessed on whether your decisions were correct.
                You are being assessed on whether your decisions were economically defensible,
                based on sound reasoning, and appropriately accounted for uncertainty.
              </p>
            </div>
          </div>
        </div>

        {/* Decision Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <h2 className="font-semibold text-slate-900 mb-3">Your Decisions</h2>
          <div className="grid grid-cols-5 gap-2">
            {decisionSummary.map(({ scenario, decision }) => (
              <div key={scenario.id} className="text-center p-2 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">S{scenario.order_index}</p>
                <p className="text-xs font-medium text-slate-900 truncate" title={decision?.label}>
                  {decision?.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Major Decisions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <h2 className="text-lg font-semibold text-slate-900">Major Decisions</h2>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Summarize your key recommendations across the five scenarios. What did you decide and why?
            </p>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={4}
              value={majorDecisions}
              onChange={(e) => setMajorDecisions(e.target.value)}
              placeholder="e.g., I recommended rapid AI adoption because..."
            />
            {relevantNotes.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">Your notes from scenarios:</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {relevantNotes.slice(0, 3).map((note) => (
                    <li key={note.id} className="truncate">{note.content}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Data Used */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <h2 className="text-lg font-semibold text-slate-900">Data Used</h2>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              What quantitative evidence and metrics informed your decisions?
            </p>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
              value={dataUsed}
              onChange={(e) => setDataUsed(e.target.value)}
              placeholder="e.g., The industry survey showed a 10.5% expected productivity gain..."
            />
          </div>

          {/* Assumptions Made */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <h2 className="text-lg font-semibold text-slate-900">Assumptions Made</h2>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              What assumptions did you rely on? Where did you have to fill gaps in information?
            </p>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
              value={assumptionsMade}
              onChange={(e) => setAssumptionsMade(e.target.value)}
              placeholder="e.g., I assumed salary inflation of 3% per year..."
            />
          </div>

          {/* Uncertainties Faced */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <h2 className="text-lg font-semibold text-slate-900">Uncertainties Faced</h2>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Where did you face significant uncertainty? How did it affect your recommendations?
            </p>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
              value={uncertaintiesFaced}
              onChange={(e) => setUncertaintiesFaced(e.target.value)}
              placeholder="e.g., The vendor claims vs survey data discrepancy created uncertainty..."
            />
          </div>

          {/* Economic Theories */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-medium">5</span>
              <h2 className="text-lg font-semibold text-slate-900">Economic Frameworks</h2>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              Which economic theories or frameworks informed your analysis? How did they shape your thinking?
            </p>

            {/* Show theories from each scenario */}
            <div className="mb-3 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">Your selected frameworks from each scenario:</p>
              <div className="flex flex-wrap gap-2">
                {decisionSummary.map(({ scenario, theory }) => (
                  <span key={scenario.id} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600">
                    S{scenario.order_index}: {theory || 'Not selected'}
                  </span>
                ))}
              </div>
            </div>

            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
              value={economicTheories}
              onChange={(e) => setEconomicTheories(e.target.value)}
              placeholder="e.g., I drew on Solow Growth Model to understand productivity impacts..."
            />
          </div>
        </div>

        {/* Word Count & Actions */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-sm text-slate-500">
            Word count: <span className={`font-medium ${wordCount > 500 ? 'text-slate-900' : 'text-amber-600'}`}>{wordCount}</span>
            <span className="text-slate-400 ml-1">(target: ~300-500 words)</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={!allSectionsFilled}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </div>

        {/* Section Completion */}
        <div className="mt-4 flex items-center gap-2">
          {[
            { filled: majorDecisions.trim(), label: 'Major Decisions' },
            { filled: dataUsed.trim(), label: 'Data Used' },
            { filled: assumptionsMade.trim(), label: 'Assumptions' },
            { filled: uncertaintiesFaced.trim(), label: 'Uncertainties' },
            { filled: economicTheories.trim(), label: 'Frameworks' },
          ].map((section) => (
            <span
              key={section.label}
              className={`px-2 py-1 rounded text-xs font-medium ${
                section.filled
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {section.filled ? <CheckCircle className="w-3 h-3 inline mr-1" /> : null}
              {section.label}
            </span>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
