-- RLS Policies for cohorts
CREATE POLICY "select_own_cohort" ON cohorts FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "insert_cohort_instructor" ON cohorts FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "update_cohort_instructor" ON cohorts FOR UPDATE
  TO authenticated USING (true);

-- RLS Policies for users
CREATE POLICY "select_own_user" ON users FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "insert_own_user" ON users FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_user" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id);

-- RLS Policies for simulations (read-only for all authenticated)
CREATE POLICY "select_simulations" ON simulations FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for scenarios (read-only for all authenticated)
CREATE POLICY "select_scenarios" ON scenarios FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for attempts
CREATE POLICY "select_own_attempts" ON attempts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_attempts" ON attempts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_attempts" ON attempts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for scenario_responses
CREATE POLICY "select_own_responses" ON scenario_responses FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = scenario_responses.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "insert_own_responses" ON scenario_responses FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = scenario_responses.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "update_own_responses" ON scenario_responses FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = scenario_responses.attempt_id AND attempts.user_id = auth.uid())
  );

-- RLS Policies for notebook_entries
CREATE POLICY "select_own_notes" ON notebook_entries FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = notebook_entries.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "insert_own_notes" ON notebook_entries FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = notebook_entries.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "delete_own_notes" ON notebook_entries FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = notebook_entries.attempt_id AND attempts.user_id = auth.uid())
  );

-- RLS Policies for kpi_snapshots
CREATE POLICY "select_own_snapshots" ON kpi_snapshots FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = kpi_snapshots.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "insert_own_snapshots" ON kpi_snapshots FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = kpi_snapshots.attempt_id AND attempts.user_id = auth.uid())
  );

-- RLS Policies for recommendations
CREATE POLICY "select_own_recommendations" ON recommendations FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = recommendations.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "insert_own_recommendations" ON recommendations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = recommendations.attempt_id AND attempts.user_id = auth.uid())
  );
CREATE POLICY "update_own_recommendations" ON recommendations FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM attempts WHERE attempts.id = recommendations.attempt_id AND attempts.user_id = auth.uid())
  );

-- RLS Policies for rubrics (read-only for students)
CREATE POLICY "select_rubrics" ON rubrics FOR SELECT
  TO authenticated USING (true);

-- RLS Policies for rubric_scores (instructors only for write)
CREATE POLICY "select_own_rubric_scores" ON rubric_scores FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "insert_rubric_scores" ON rubric_scores FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "update_rubric_scores" ON rubric_scores FOR UPDATE
  TO authenticated USING (true);

-- RLS Policies for instructor_settings (read-only for students)
CREATE POLICY "select_instructor_settings" ON instructor_settings FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "update_instructor_settings" ON instructor_settings FOR UPDATE
  TO authenticated USING (true);