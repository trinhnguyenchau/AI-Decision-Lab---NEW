import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Simulation,
  Scenario,
  Attempt,
  ScenarioResponse,
  NotebookEntry,
  KPISnapshot,
  Recommendation,
  KPIState,
  baselineKPIs,
  InstructorSettings,
  Rubric,
} from '../types';
import {
  getSimulation,
  getScenarios,
  getOrCreateAttempt,
  updateAttempt,
  getScenarioResponse,
  upsertScenarioResponse,
  getKPISnapshots,
  createKPISnapshot,
  getNotebookEntries,
  createNotebookEntry,
  deleteNotebookEntry,
  getRecommendation,
  upsertRecommendation,
  getInstructorSettings,
  getRubric,
} from './supabase';
import { applyKPIDeltas } from './calculations';

export function useAttemptStore(userId: string | null) {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [responses, setResponses] = useState<Record<string, ScenarioResponse>>({});
  const [snapshots, setSnapshots] = useState<KPISnapshot[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [currentKPIs, setCurrentKPIs] = useState<KPIState>(baselineKPIs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const sim = await getSimulation();
      setSimulation(sim);

      const sceneData = await getScenarios(sim.id);
      setScenarios(sceneData);

      const att = await getOrCreateAttempt(sim.id, userId);
      setAttempt(att);

      const snapData = await getKPISnapshots(att.id);
      setSnapshots(snapData);

      // Load responses for each scenario
      const respMap: Record<string, ScenarioResponse> = {};
      for (const scene of sceneData) {
        const resp = await getScenarioResponse(att.id, scene.id);
        if (resp) respMap[scene.id] = resp;
      }
      setResponses(respMap);

      // Compute current KPIs from snapshots
      if (snapData.length > 0) {
        const latest = snapData[snapData.length - 1];
        setCurrentKPIs({
          revenue: latest.revenue,
          profit: latest.profit,
          employees: latest.employees,
          productivity_index: latest.productivity_index,
          innovation_index: latest.innovation_index,
          trust_index: latest.trust_index,
          workforce_capability_index: latest.workforce_capability_index,
        });
      }

      const rec = await getRecommendation(att.id);
      if (rec) setRecommendation(rec);
    } catch (err) {
      console.error('Failed to load attempt:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStage = useCallback(async (stage: string) => {
    if (!attempt) return;
    setSaving(true);
    try {
      await updateAttempt(attempt.id, { current_stage: stage });
      setAttempt({ ...attempt, current_stage: stage });
    } finally {
      setSaving(false);
    }
  }, [attempt]);

  const saveAssumptions = useCallback(async (
    scenarioId: string,
    assumptions: Record<string, string | number>,
    outputs: Record<string, number>
  ) => {
    if (!attempt) return;
    const response = await getScenarioResponse(attempt.id, scenarioId);
    if (response?.locked_at) return; // Can't modify locked scenario

    await upsertScenarioResponse(attempt.id, scenarioId, {
      assumptions_used: assumptions,
      calculated_outputs: outputs,
    });
    const resp = await getScenarioResponse(attempt.id, scenarioId);
    if (resp) setResponses(prev => ({ ...prev, [scenarioId]: resp }));
  }, [attempt]);

  const selectDecision = useCallback(async (
    scenario: Scenario,
    optionId: 'A' | 'B' | 'C'
  ) => {
    if (!attempt) return;
    const response = await getScenarioResponse(attempt.id, scenario.id);
    if (response?.locked_at) return;

    const newKPIs = applyKPIDeltas(currentKPIs, optionId, scenario.decision_options);
    setCurrentKPIs(newKPIs);

    const checkpoint = `after_scenario_${scenario.order_index}`;
    await createKPISnapshot(attempt.id, checkpoint, {
      revenue: newKPIs.revenue,
      profit: newKPIs.profit,
      employees: newKPIs.employees,
      productivity_index: newKPIs.productivity_index,
      innovation_index: newKPIs.innovation_index,
      trust_index: newKPIs.trust_index,
      workforce_capability_index: newKPIs.workforce_capability_index,
    });

    const snapData = await getKPISnapshots(attempt.id);
    setSnapshots(snapData);

    await upsertScenarioResponse(attempt.id, scenario.id, {
      selected_option: optionId,
    });
    const resp = await getScenarioResponse(attempt.id, scenario.id);
    if (resp) setResponses(prev => ({ ...prev, [scenario.id]: resp }));
  }, [attempt, currentKPIs]);

  const saveReflection = useCallback(async (
    scenarioId: string,
    theory: string,
    text: string,
    questionAnswers: Record<string, string>
  ) => {
    if (!attempt) return;
    const response = await getScenarioResponse(attempt.id, scenarioId);
    if (response?.locked_at) return;

    await upsertScenarioResponse(attempt.id, scenarioId, {
      reflection_theory: theory,
      reflection_text: text,
      guiding_question_answers: questionAnswers,
    });
    const resp = await getScenarioResponse(attempt.id, scenarioId);
    if (resp) setResponses(prev => ({ ...prev, [scenarioId]: resp }));
  }, [attempt]);

  const lockScenario = useCallback(async (scenarioId: string) => {
    if (!attempt) return;
    await upsertScenarioResponse(attempt.id, scenarioId, {
      locked_at: new Date().toISOString(),
    });
    const resp = await getScenarioResponse(attempt.id, scenarioId);
    if (resp) setResponses(prev => ({ ...prev, [scenarioId]: resp }));
  }, [attempt]);

  const completeAttempt = useCallback(async () => {
    if (!attempt) return;
    await updateAttempt(attempt.id, {
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
    setAttempt({
      ...attempt,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });
  }, [attempt]);

  const saveRecommendation = useCallback(async (data: Partial<{
    major_decisions: string;
    data_used: string;
    assumptions_made: string;
    uncertainties_faced: string;
    economic_theories: string;
  }>) => {
    if (!attempt) return;
    const rec = await upsertRecommendation(attempt.id, data);
    setRecommendation(rec);
  }, [attempt]);

  const submitRecommendation = useCallback(async () => {
    if (!attempt || !recommendation) return;
    await upsertRecommendation(attempt.id, {
      submitted_at: new Date().toISOString(),
    });
    await completeAttempt();
    setRecommendation({
      ...recommendation,
      submitted_at: new Date().toISOString(),
    });
  }, [attempt, recommendation, completeAttempt]);

  return {
    simulation,
    scenarios,
    attempt,
    responses,
    snapshots,
    recommendation,
    currentKPIs,
    loading,
    saving,
    updateStage,
    saveAssumptions,
    selectDecision,
    saveReflection,
    lockScenario,
    completeAttempt,
    saveRecommendation,
    submitRecommendation,
    refresh: load,
  };
}

export function useNotebookStore(attemptId: string | null) {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!attemptId) return;
    try {
      setLoading(true);
      const data = await getNotebookEntries(attemptId);
      setEntries(data);
    } finally {
      setLoading(false);
    }
  }, [attemptId]);

  useEffect(() => { load(); }, [load]);

  const addEntry = useCallback(async (content: string, scenarioId?: string) => {
    if (!attemptId) return;
    const entry = await createNotebookEntry(attemptId, content, scenarioId);
    setEntries(prev => [entry, ...prev]);
    return entry;
  }, [attemptId]);

  const removeEntry = useCallback(async (entryId: string) => {
    await deleteNotebookEntry(entryId);
    setEntries(prev => prev.filter(e => e.id !== entryId));
  }, []);

  return {
    entries,
    loading,
    addEntry,
    removeEntry,
    refresh: load,
  };
}

export function useInstructorStore(simulationId: string | null) {
  const [settings, setSettings] = useState<InstructorSettings | null>(null);
  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!simulationId) return;
    try {
      setLoading(true);
      const setts = await getInstructorSettings(simulationId);
      const rub = await getRubric(simulationId);
      setSettings(setts);
      setRubric(rub);
    } finally {
      setLoading(false);
    }
  }, [simulationId]);

  useEffect(() => { load(); }, [load]);

  return {
    settings,
    rubric,
    loading,
    refresh: load,
  };
}

export function useNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const isActive = useCallback((path: string) => {
    return location.pathname === path;
  }, [location.pathname]);

  const currentSection = useCallback((): string => {
    const path = location.pathname;
    if (path === '/' || path === '/brief') return 'brief';
    if (path === '/operational-data') return 'operational-data';
    if (path === '/financials') return 'financials';
    if (path.startsWith('/scenario/')) return 'scenario';
    if (path === '/notebook') return 'notebook';
    if (path === '/history') return 'history';
    if (path === '/recommendation') return 'recommendation';
    return '';
  }, [location.pathname]);

  const currentScenarioIndex = useCallback((): number | null => {
    const match = location.pathname.match(/\/scenario\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }, [location.pathname]);

  const progress = useCallback((): { step: number; total: number } => {
    const section = currentSection();
    const scenarioIdx = currentScenarioIndex();
    const steps = ['brief', 'operational-data', 'financials', 'scenario-1', 'scenario-2', 'scenario-3', 'scenario-4', 'scenario-5', 'recommendation'];
    let step = 0;

    if (section === 'brief') step = 0;
    else if (section === 'operational-data') step = 1;
    else if (section === 'financials') step = 2;
    else if (section === 'scenario' && scenarioIdx) step = 2 + scenarioIdx;
    else if (section === 'recommendation') step = 8;

    return { step, total: 9 };
  }, [currentSection, currentScenarioIndex]);

  return {
    goTo,
    isActive,
    currentSection,
    currentScenarioIndex,
    progress,
  };
}

