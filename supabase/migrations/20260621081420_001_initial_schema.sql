-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('student', 'instructor');

-- Attempt status enum
CREATE TYPE attempt_status AS ENUM ('in_progress', 'completed');

-- Worked solutions policy enum
CREATE TYPE worked_solutions_policy AS ENUM ('never', 'after_submission', 'always');

-- Decision option enum
CREATE TYPE decision_option AS ENUM ('A', 'B', 'C');

-- Cohorts table
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  instructor_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role user_role NOT NULL DEFAULT 'student',
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cohort_id UUID REFERENCES cohorts(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update cohorts to reference instructor
ALTER TABLE cohorts ADD CONSTRAINT fk_instructor FOREIGN KEY (instructor_id) REFERENCES users(id);

-- Simulations table
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenarios table
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulation_id UUID REFERENCES simulations(id) NOT NULL,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  narrative TEXT NOT NULL,
  evidence_data JSONB NOT NULL DEFAULT '{}',
  builder_assumptions JSONB NOT NULL DEFAULT '[]',
  decision_options JSONB NOT NULL DEFAULT '[]',
  reflection_config JSONB NOT NULL DEFAULT '{}',
  guiding_questions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attempts table
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  simulation_id UUID REFERENCES simulations(id) NOT NULL,
  status attempt_status NOT NULL DEFAULT 'in_progress',
  current_stage TEXT DEFAULT 'brief',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_preview BOOLEAN DEFAULT FALSE,
  assumptions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenario responses table
CREATE TABLE scenario_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) NOT NULL,
  scenario_id UUID REFERENCES scenarios(id) NOT NULL,
  assumptions_used JSONB NOT NULL DEFAULT '{}',
  calculated_outputs JSONB NOT NULL DEFAULT '{}',
  selected_option decision_option,
  reflection_theory TEXT,
  reflection_text TEXT,
  guiding_question_answers JSONB NOT NULL DEFAULT '{}',
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, scenario_id)
);

-- Notebook entries table
CREATE TABLE notebook_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) NOT NULL,
  scenario_id UUID REFERENCES scenarios(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KPI snapshots table
CREATE TABLE kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) NOT NULL,
  checkpoint TEXT NOT NULL,
  revenue NUMERIC DEFAULT 20,
  profit NUMERIC DEFAULT 2,
  employees INTEGER DEFAULT 100,
  productivity_index NUMERIC DEFAULT 100,
  innovation_index NUMERIC DEFAULT 100,
  trust_index NUMERIC DEFAULT 100,
  workforce_capability_index NUMERIC DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) UNIQUE NOT NULL,
  major_decisions TEXT,
  data_used TEXT,
  assumptions_made TEXT,
  uncertainties_faced TEXT,
  economic_theories TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rubrics table
CREATE TABLE rubrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulation_id UUID REFERENCES simulations(id) NOT NULL,
  criteria JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rubric scores table
CREATE TABLE rubric_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES attempts(id) NOT NULL,
  criterion_name TEXT NOT NULL,
  score NUMERIC,
  comment TEXT,
  scored_by UUID REFERENCES users(id),
  finalized BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructor settings table
CREATE TABLE instructor_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  simulation_id UUID REFERENCES simulations(id) NOT NULL,
  hints_enabled BOOLEAN DEFAULT TRUE,
  worked_solutions_policy worked_solutions_policy DEFAULT 'after_submission',
  assumption_overrides JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenario_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_settings ENABLE ROW LEVEL SECURITY;