import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// All RLS policies in this project are scoped `TO authenticated`, so every
// request needs a real Supabase Auth session — not just the anon API key.
// This signs the visitor in anonymously (reusing any existing session on
// reload), then makes sure a matching row exists in `users`, since
// `attempts.user_id` is a NOT NULL foreign key into that table.
export async function ensureAuthenticatedUser(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  let authUserId = sessionData.session?.user?.id;

  if (!authUserId) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      const isAnonDisabled = error.message.toLowerCase().includes('anonymous');
      throw new Error(
        isAnonDisabled
          ? 'Anonymous sign-ins are disabled for this Supabase project. In the Supabase dashboard, go to Authentication → Sign In / Providers and enable "Allow anonymous sign-ins", then reload.'
          : `Supabase sign-in failed: ${error.message}`
      );
    }
    authUserId = data.user?.id;
  }

  if (!authUserId) {
    throw new Error('Could not establish a Supabase session.');
  }

  const { error: userError } = await supabase
    .from('users')
    .upsert(
      {
        id: authUserId,
        role: 'student',
        name: 'Student',
        email: `${authUserId}@anonymous.ai-decision-lab.local`,
      },
      { onConflict: 'id' }
    );

  if (userError) {
    throw new Error(`Could not create student record: ${userError.message}`);
  }

  return authUserId;
}

export async function getSimulation() {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('slug', 'accounting-firm-ai-adoption')
    .single();

  if (error) throw error;
  return data;
}

export async function getScenarios(simulationId: string) {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('simulation_id', simulationId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getOrCreateAttempt(simulationId: string, userId: string) {
  const { data: existing } = await supabase
    .from('attempts')
    .select('*')
    .eq('simulation_id', simulationId)
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('attempts')
    .insert({
      user_id: userId,
      simulation_id: simulationId,
      status: 'in_progress',
      current_stage: 'brief',
      assumptions: {},
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAttempt(attemptId: string, updates: Partial<{
  current_stage: string;
  status: 'completed';
  assumptions: Record<string, string | number>;
}>) {
  const { error } = await supabase
    .from('attempts')
    .update(updates)
    .eq('id', attemptId);

  if (error) throw error;
}

export async function getScenarioResponse(attemptId: string, scenarioId: string) {
  const { data } = await supabase
    .from('scenario_responses')
    .select('*')
    .eq('attempt_id', attemptId)
    .eq('scenario_id', scenarioId)
    .maybeSingle();

  return data;
}

export async function upsertScenarioResponse(
  attemptId: string,
  scenarioId: string,
  updates: Partial<{
    assumptions_used: Record<string, string | number>;
    calculated_outputs: Record<string, number>;
    selected_option: string;
    reflection_theory: string;
    reflection_text: string;
    guiding_question_answers: Record<string, string>;
    locked_at: string;
  }>
) {
  const existing = await getScenarioResponse(attemptId, scenarioId);

  const { error } = existing
    ? await supabase
        .from('scenario_responses')
        .update(updates)
        .eq('id', existing.id)
    : await supabase
        .from('scenario_responses')
        .insert({
          attempt_id: attemptId,
          scenario_id: scenarioId,
          ...updates,
        });

  if (error) throw error;
  return getScenarioResponse(attemptId, scenarioId);
}

export async function getKPISnapshots(attemptId: string) {
  const { data, error } = await supabase
    .from('kpi_snapshots')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createKPISnapshot(
  attemptId: string,
  checkpoint: string,
  kpis: {
    revenue: number;
    profit: number;
    employees: number;
    productivity_index: number;
    innovation_index: number;
    trust_index: number;
    workforce_capability_index: number;
  }
) {
  const { error } = await supabase
    .from('kpi_snapshots')
    .insert({
      attempt_id: attemptId,
      checkpoint,
      ...kpis,
    });

  if (error) throw error;
}

export async function getNotebookEntries(attemptId: string) {
  const { data, error } = await supabase
    .from('notebook_entries')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createNotebookEntry(
  attemptId: string,
  content: string,
  scenarioId?: string
) {
  const { data, error } = await supabase
    .from('notebook_entries')
    .insert({
      attempt_id: attemptId,
      scenario_id: scenarioId || null,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotebookEntry(entryId: string) {
  const { error } = await supabase
    .from('notebook_entries')
    .delete()
    .eq('id', entryId);

  if (error) throw error;
}

export async function getRecommendation(attemptId: string) {
  const { data } = await supabase
    .from('recommendations')
    .select('*')
    .eq('attempt_id', attemptId)
    .maybeSingle();

  return data;
}

export async function upsertRecommendation(
  attemptId: string,
  updates: Partial<{
    major_decisions: string;
    data_used: string;
    assumptions_made: string;
    uncertainties_faced: string;
    economic_theories: string;
    submitted_at: string;
  }>
) {
  const existing = await getRecommendation(attemptId);

  const { data, error } = existing
    ? await supabase
        .from('recommendations')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single()
    : await supabase
        .from('recommendations')
        .insert({
          attempt_id: attemptId,
          ...updates,
        })
        .select()
        .single();

  if (error) throw error;
  return data;
}

export async function getInstructorSettings(simulationId: string) {
  const { data } = await supabase
    .from('instructor_settings')
    .select('*')
    .eq('simulation_id', simulationId)
    .maybeSingle();

  return data;
}

export async function getRubric(simulationId: string) {
  const { data } = await supabase
    .from('rubrics')
    .select('*')
    .eq('simulation_id', simulationId)
    .maybeSingle();

  return data;
}
