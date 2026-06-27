export type UserRole = 'student' | 'instructor';
export type AttemptStatus = 'in_progress' | 'completed';
export type WorkedSolutionsPolicy = 'never' | 'after_submission' | 'always';
export type DecisionOptionType = 'A' | 'B' | 'C';

export interface KPIState {
  revenue: number;
  profit: number;
  employees: number;
  productivity_index: number;
  innovation_index: number;
  trust_index: number;
  workforce_capability_index: number;
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  cohort_id: string | null;
}

export interface Cohort {
  id: string;
  name: string;
  instructor_id: string;
}

export interface Simulation {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export interface BuilderAssumption {
  id: string;
  label: string;
  type: 'slider' | 'select';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  default: string | number;
  unit?: string;
}

export interface DecisionOption {
  id: DecisionOptionType;
  label: string;
  description: string;
  kpiDeltas: KPIState;
}

export interface GuidingQuestion {
  question: string;
  hint: string;
}

export interface ReflectionConfig {
  theoryOptions: string[];
  question: string;
}

export interface Scenario {
  id: string;
  simulation_id: string;
  order_index: number;
  title: string;
  narrative: string;
  evidence_data: Record<string, unknown>;
  builder_assumptions: BuilderAssumption[];
  decision_options: DecisionOption[];
  reflection_config: ReflectionConfig;
  guiding_questions: GuidingQuestion[];
}

export interface Attempt {
  id: string;
  user_id: string;
  simulation_id: string;
  status: AttemptStatus;
  current_stage: string;
  started_at: string;
  completed_at: string | null;
  is_preview: boolean;
  assumptions: Record<string, string | number>;
}

export interface ScenarioResponse {
  id: string;
  attempt_id: string;
  scenario_id: string;
  assumptions_used: Record<string, string | number>;
  calculated_outputs: Record<string, number>;
  selected_option: DecisionOptionType | null;
  reflection_theory: string | null;
  reflection_text: string | null;
  guiding_question_answers: Record<string, string>;
  locked_at: string | null;
}

export interface NotebookEntry {
  id: string;
  attempt_id: string;
  scenario_id: string | null;
  content: string;
  created_at: string;
}

export interface KPISnapshot {
  id: string;
  attempt_id: string;
  checkpoint: string;
  revenue: number;
  profit: number;
  employees: number;
  productivity_index: number;
  innovation_index: number;
  trust_index: number;
  workforce_capability_index: number;
}

export interface Recommendation {
  id: string;
  attempt_id: string;
  major_decisions: string;
  data_used: string;
  assumptions_made: string;
  uncertainties_faced: string;
  economic_theories: string;
  submitted_at: string | null;
}

export interface RubricCriterion {
  name: string;
  description: string;
  maxScore: number;
}

export interface Rubric {
  id: string;
  simulation_id: string;
  criteria: RubricCriterion[];
}

export interface RubricScore {
  id: string;
  attempt_id: string;
  criterion_name: string;
  score: number | null;
  comment: string | null;
  scored_by: string | null;
  finalized: boolean;
}

export interface InstructorSettings {
  id: string;
  simulation_id: string;
  hints_enabled: boolean;
  worked_solutions_policy: WorkedSolutionsPolicy;
  assumption_overrides: Record<string, unknown>;
}

export const baselineKPIs: KPIState = {
  revenue: 20,
  profit: 2,
  employees: 100,
  productivity_index: 100,
  innovation_index: 100,
  trust_index: 100,
  workforce_capability_index: 100,
};

export const BASELINE_FIGURES = {
  annualLabourCost: 10000000,
  annualRevenue: 20000000,
  employees: 100,
  administrativeLabourCost: 4000000,
  reportDraftingLabourCost: 1000000,
  revenuePerEmployee: 200000,
  aiSoftwareCost: 500000,
  staffTrainingCost: 300000,
};
