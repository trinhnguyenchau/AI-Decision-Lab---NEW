-- Insert the simulation
INSERT INTO simulations (id, slug, title, description) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'accounting-firm-ai-adoption',
  'Managing an AI-Enabled Accounting Firm',
  'Navigate AI adoption decisions at Horizon Accounting Group, balancing productivity, profit, and workforce considerations.'
);

-- Insert all 5 scenarios
-- Scenario 1: Generative AI Arrives
INSERT INTO scenarios (simulation_id, order_index, title, narrative, evidence_data, builder_assumptions, decision_options, reflection_config, guiding_questions) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  1,
  'Generative AI Arrives',
  'A major vendor has launched an AI platform for accounting firms. Early adopter competitors are already promoting faster turnaround times. The Managing Partner at Horizon Accounting Group has asked for your recommendation on whether to adopt this technology, and if so, how aggressively. The firm currently generates $20M in annual revenue with $10M in labor costs. 40% of staff time is spent on administration, with 25% of that time dedicated to drafting reports. The vendor claims 12-15% productivity gains with 50% reduction in report preparation time, but industry surveys suggest more modest and uncertain outcomes. Your recommendation will shape the firm''s competitive position and affect every employee.',
  '{
    "currentSituation": {
      "rows": [
        {"label": "Annual Revenue", "value": "$20,000,000"},
        {"label": "Annual Profit", "value": "$2,000,000"},
        {"label": "Time on Administration", "value": "40%"},
        {"label": "Admin Time on Drafting Reports", "value": "25%"},
        {"label": "Annual Labour Cost", "value": "$10,000,000"},
        {"label": "AI Software Cost", "value": "$500,000/year"},
        {"label": "Staff Training Cost", "value": "$300,000"}
      ]
    },
    "vendorClaims": {
      "rows": [
        {"label": "Productivity Gain", "value": "12-15%", "confidence": "optimistic"},
        {"label": "Report Prep Time Reduction", "value": "50%", "confidence": "optimistic"},
        {"label": "Admin Hours Reduction", "value": "10-15%", "confidence": "optimistic"}
      ]
    },
    "industrySurvey": {
      "outcomes": [
        {"label": "Optimistic Outcome", "probability": 30, "productivityGain": 15, "additionalCost": 0},
        {"label": "Expected Outcome", "probability": 50, "productivityGain": 10, "additionalCost": 100000},
        {"label": "Conservative Outcome", "probability": 20, "productivityGain": 5, "additionalCost": 200000}
      ]
    }
  }',
  '[
    {"id": "productivity_gain_basis", "label": "Productivity Gain Basis", "type": "select", "options": ["Industry Survey (Expected)", "Vendor Claim (Optimistic)"], "default": "Industry Survey (Expected)"},
    {"id": "ai_cost_structure", "label": "AI Cost Structure", "type": "select", "options": ["Annual Subscription", "One-time License"], "default": "Annual Subscription"},
    {"id": "calculation_base", "label": "Calculation Base", "type": "select", "options": ["Administrative Labour Cost ($4.0M)", "Report-Drafting Labour Cost ($1.0M)"], "default": "Administrative Labour Cost ($4.0M)"}
  ]',
  '[
    {"id": "A", "label": "Rapid Adoption", "description": "Roll out AI firm-wide immediately with full vendor support package", "kpiDeltas": {"revenue": 0.5, "profit": -0.3, "employees": 0, "productivity": 12, "innovation": 15, "trust": -5, "workforce_capability": 5}},
    {"id": "B", "label": "Gradual Adoption", "description": "Pilot with tax preparation team, expand if successful over 12 months", "kpiDeltas": {"revenue": 0.2, "profit": 0.1, "employees": 0, "productivity": 8, "innovation": 8, "trust": 2, "workforce_capability": 8}},
    {"id": "C", "label": "Wait and Observe", "description": "Monitor competitor experiences for 18 months before deciding", "kpiDeltas": {"revenue": 0, "profit": 0.2, "employees": 0, "productivity": 0, "innovation": -5, "trust": 0, "workforce_capability": 0}}
  ]',
  '{
    "theoryOptions": ["GPT Theory of Investment", "Solow Growth Model", "Innovation Economics", "Traditional Cost-Benefit Analysis"],
    "question": "Which economic theory best explains your decision?"
  }',
  '[
    {"question": "How much should we trust vendor claims versus independent survey data?", "hint": "Consider the incentives of each source and the sample sizes involved"},
    {"question": "What is the break-even period for this investment under different assumptions?", "hint": "Calculate when cumulative savings exceed total costs including implementation"},
    {"question": "How would you communicate this recommendation to skeptical partners?", "hint": "Address uncertainty directly and propose risk mitigation strategies"}
  ]'
);

-- Scenario 2: Workforce Restructuring
INSERT INTO scenarios (simulation_id, order_index, title, narrative, evidence_data, builder_assumptions, decision_options, reflection_config, guiding_questions) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  2,
  'Workforce Restructuring',
  'Following your decision on AI adoption, the firm has achieved a 30% reduction in administrative workload. However, client demand is growing at 10% annually, and there are new costs: AI maintenance at $200,000/year and additional staff training at $250,000. The leadership team is divided: some argue for reducing headcount to capture the efficiency gains, while others advocate for retraining staff to handle higher-value work and the growing client base. An internal HR survey reveals 55% of employees are concerned about job security, but 70% are willing to learn new skills. The average employee salary is $100,000, and any severance costs are uncertain but could add significantly to restructuring expenses.',
  '{
    "currentSituation": {
      "rows": [
        {"label": "Admin Workload Reduction", "value": "30%"},
        {"label": "Client Demand Growth", "value": "10%/year"},
        {"label": "AI Maintenance Cost", "value": "$200,000/year"},
        {"label": "Staff Training Cost", "value": "$250,000"},
        {"label": "Average Employee Salary", "value": "$100,000"}
      ]
    },
    "hrSurvey": {
      "concernedJobSecurity": 55,
      "willingToRetrain": 70
    }
  }',
  '[
    {"id": "severance_multiplier", "label": "Severance/Transition Cost Multiplier", "type": "slider", "min": 0, "max": 1, "step": 0.1, "default": 0, "unit": "× annual salary"},
    {"id": "hybrid_reduction_pct", "label": "Hybrid Headcount Reduction", "type": "slider", "min": 5, "max": 15, "step": 1, "default": 8, "unit": "%"}
  ]',
  '[
    {"id": "A", "label": "Reduce Workforce 20%", "description": "Lay off 20 employees to capture full efficiency gains as profit", "kpiDeltas": {"revenue": 0, "profit": 1.0, "employees": -20, "productivity": 3, "innovation": -5, "trust": -15, "workforce_capability": -10}},
    {"id": "B", "label": "Retrain Workforce", "description": "Invest in comprehensive retraining, maintain all employees", "kpiDeltas": {"revenue": 0, "profit": -0.2, "employees": 0, "productivity": 2, "innovation": 5, "trust": 10, "workforce_capability": 15}},
    {"id": "C", "label": "Hybrid Approach", "description": "Moderate reduction with retraining for remaining staff", "kpiDeltas": {"revenue": 0, "profit": 0.3, "employees": -8, "productivity": 2, "innovation": 2, "trust": -3, "workforce_capability": 5}}
  ]',
  '{
    "theoryOptions": ["Labor Market Signaling", "Human Capital Theory", "Creative Destruction", "Stakeholder Theory"],
    "question": "Which economic framework best explains your workforce decision?"
  }',
  '[
    {"question": "Can freed capacity from efficiency gains cover the 10% client demand growth?", "hint": "Analyze whether remaining staff can absorb new clients without quality decline"},
    {"question": "What are the hidden costs of layoffs beyond severance?", "hint": "Consider recruitment costs, institutional knowledge loss, and productivity dips"},
    {"question": "How does employee trust affect firm performance?", "hint": "HR data shows 70% willing to retrain - how might this change under each option?"}
  ]'
);

-- Scenario 3: Hallucination Crisis
INSERT INTO scenarios (simulation_id, order_index, title, narrative, evidence_data, builder_assumptions, decision_options, reflection_config, guiding_questions) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  3,
  'Hallucination Crisis',
  'An AI-generated financial report contained a significant error that was caught by a client before it caused financial harm. The error was an AI "hallucination" - a fabricated number that looked plausible but was incorrect. While no money was lost, the client is deeply concerned and is considering ending their $2M annual contract. Client retention currently stands at 95%, but this incident has exposed a risk: analysts estimate a 10% probability of similar errors occurring in the future. Management proposes a human review system that would cost $300,000 annually and is expected to reduce errors by 80%. However, this would slow turnaround times and add costs. The fundamental question: what is the economic value of client trust, and what cannot be easily measured?',
  '{
    "incident": {
      "potentialContractLoss": 2000000,
      "currentRetention": 95,
      "estimatedErrorProbability": 10
    },
    "managementProposal": {
      "reviewCost": 300000,
      "errorReduction": 80
    }
  }',
  '[
    {"id": "human_review_coverage", "label": "Human Review Coverage", "type": "select", "options": ["None", "High-risk Outputs Only", "All Outputs"], "default": "None"},
    {"id": "high_risk_coverage_pct", "label": "High-risk Coverage Percentage", "type": "slider", "min": 40, "max": 80, "step": 10, "default": 60, "unit": "%"}
  ]',
  '[
    {"id": "A", "label": "Maintain Current System", "description": "Accept the risk, rely on client vigilance and occasional errors", "kpiDeltas": {"revenue": 0, "profit": 0.3, "employees": 0, "productivity": 0, "innovation": 0, "trust": -10, "workforce_capability": 0}},
    {"id": "B", "label": "Human Review - All Outputs", "description": "Implement comprehensive review of all AI-generated content", "kpiDeltas": {"revenue": 0, "profit": -0.3, "employees": 0, "productivity": -1, "innovation": 0, "trust": 12, "workforce_capability": 3}},
    {"id": "C", "label": "Human Review - High-Risk Only", "description": "Targeted review of client-facing and critical reports", "kpiDeltas": {"revenue": 0, "profit": -0.1, "employees": 0, "productivity": 0, "innovation": 0, "trust": 6, "workforce_capability": 2}}
  ]',
  '{
    "theoryOptions": ["Information Asymmetry", "Principal-Agent Theory", "Risk Premium Theory", "Reputational Economics"],
    "question": "What economic principle best explains the trust calculus?"
  }',
  '[
    {"question": "Calculate the expected annual loss with and without the safeguard", "hint": "Expected loss = probability × potential loss"},
    {"question": "Why might the rational choice (expected value) not be the right choice?", "hint": "Consider what cannot be measured: reputation, client referrals, employee morale"},
    {"question": "How would you explain this decision to the affected client?", "hint": "Balance transparency with confidence in your risk management"}
  ]'
);

-- Scenario 4: Competitive Disruption
INSERT INTO scenarios (simulation_id, order_index, title, narrative, evidence_data, builder_assumptions, decision_options, reflection_config, guiding_questions) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  4,
  'Competitive Disruption',
  'A well-established rival firm, Sterling & Associates, has made a major AI investment and is now aggressively marketing their AI-powered services. The competitive landscape has shifted: Sterling now processes clients at $700 per client versus your $1,000, and their client base is growing at 15% annually compared to your 3%. They operate with 0.7 staff per client versus your 1.0. Sterling is winning new business and even poaching some of your long-term clients with faster turnaround promises. Market analysts project this divergence will accelerate over the next five years if you maintain current operations. The board is pressuring for a response, but the options each carry significant tradeoffs.',
  '{
    "comparison": {
      "columns": ["Your Firm", "Sterling & Associates"],
      "rows": [
        {"label": "Cost per Client", "yourValue": "$1,000", "rivalValue": "$700"},
        {"label": "Client Growth Rate", "yourValue": "3%", "rivalValue": "15%"},
        {"label": "Staff per Client", "yourValue": "1.0", "rivalValue": "0.7"}
      ]
    },
    "projectionYears": 5,
    "yourGrowthRate": 0.03,
    "rivalGrowthRate": 0.15
  }',
  '[
    {"id": "investment_level", "label": "AI Investment Level", "type": "slider", "min": 200000, "max": 1000000, "step": 100000, "default": 500000, "unit": "$"}
  ]',
  '[
    {"id": "A", "label": "Match AI Investment", "description": "Major capital investment to match Sterling capabilities", "kpiDeltas": {"revenue": 0.2, "profit": -0.4, "employees": 0, "productivity": 10, "innovation": 10, "trust": 0, "workforce_capability": 3}},
    {"id": "B", "label": "Differentiate Through Expertise", "description": "Emphasize personalized service and partner-level attention", "kpiDeltas": {"revenue": 0.1, "profit": 0.1, "employees": 0, "productivity": 0, "innovation": 3, "trust": 8, "workforce_capability": 6}},
    {"id": "C", "label": "Partner with Technology Providers", "description": "Form strategic alliances with AI vendors for shared risk", "kpiDeltas": {"revenue": 0.1, "profit": -0.1, "employees": 0, "productivity": 6, "innovation": 12, "trust": 2, "workforce_capability": 4}}
  ]',
  '{
    "theoryOptions": ["First-Mover Advantage", "Strategic Positioning", "Cooperative Game Theory", "Resource-Based View"],
    "question": "Which strategic framework best informs your competitive response?"
  }',
  '[
    {"question": "Project the 5-year client divergence if current trends continue", "hint": "Use compound growth: clients(year) = base × (1 + rate)^year"},
    {"question": "Is there a sustainable advantage in being the human-touch alternative?", "hint": "Some clients will pay premium for personalized service - how large is that market?"},
    {"question": "What are the risks of a price war with an AI-enabled competitor?", "hint": "Consider both firms cost structures and margin flexibility"}
  ]'
);

-- Scenario 5: The AI-Native Challenger
INSERT INTO scenarios (simulation_id, order_index, title, narrative, evidence_data, builder_assumptions, decision_options, reflection_config, guiding_questions) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  5,
  'The AI-Native Challenger',
  'A new entrant has joined the market: Clarity AI, founded by former tech executives, operates with just 30 employees but serves a growing client base generating $10M in revenue. Their revenue per employee is $333,000 - dramatically higher than your $200,000. Clarity AI represents a new paradigm: they are AI-native, built from the ground up around automated processes, not retrofitting AI onto traditional workflows. They are positioning for the technology-forward segment of the market and have already captured several startup clients from your firm. The fundamental question facing Horizon: transform radically to become AI-native, acquire AI capabilities through merger, or double down on premium human expertise for clients who value relationships over efficiency.',
  '{
    "comparison": {
      "columns": ["Horizon", "Clarity AI"],
      "rows": [
        {"label": "Number of Employees", "yourValue": "100", "challengerValue": "30"},
        {"label": "Annual Revenue", "yourValue": "$20M", "challengerValue": "$10M"},
        {"label": "Revenue per Employee", "yourValue": "$200K", "challengerValue": "$333K"},
        {"label": "Client Segment", "yourValue": "Mixed", "challengerValue": "Tech-forward"}
      ]
    }
  }',
  '[
    {"id": "transformation_aggressiveness", "label": "Transformation Aggressiveness", "type": "slider", "min": 10, "max": 30, "step": 5, "default": 20, "unit": "% headcount reduction"},
    {"id": "acquisition_premium", "label": "Acquisition Premium Willingness", "type": "slider", "min": 10, "max": 50, "step": 5, "default": 25, "unit": "% premium"}
  ]',
  '[
    {"id": "A", "label": "Full Organizational Transformation", "description": "Radical restructuring to become AI-native, with significant workforce changes", "kpiDeltas": {"revenue": 0.4, "profit": -0.6, "employees": -15, "productivity": 20, "innovation": 20, "trust": -5, "workforce_capability": 5}},
    {"id": "B", "label": "Acquire AI Capability", "description": "Acquire an AI-focused firm to gain technology and talent", "kpiDeltas": {"revenue": 0.5, "profit": -1.0, "employees": 5, "productivity": 12, "innovation": 15, "trust": 0, "workforce_capability": 3}},
    {"id": "C", "label": "Focus on Premium Human Expertise", "description": "Position exclusively for clients who value human relationships", "kpiDeltas": {"revenue": 0.3, "profit": 0.3, "employees": 0, "productivity": 0, "innovation": 0, "trust": 15, "workforce_capability": 12}}
  ]',
  '{
    "theoryOptions": ["Disruptive Innovation Theory", "Comparative Advantage", "Two-Sided Market Theory", "Organizational Ecology"],
    "question": "Which theory best explains your strategic choice?"
  }',
  '[
    {"question": "Is there a sustainable market for premium human-centric accounting?", "hint": "Consider industries with regulatory complexity or high-stakes decisions"},
    {"question": "What can traditional firms do that AI-native firms cannot replicate?", "hint": "Think about relationship depth, institutional memory, and complex judgment"},
    {"question": "What are the cultural and operational risks of radical transformation?", "hint": "Transformation failure rates are high - what could cause this to fail?"}
  ]'
);

-- Insert default instructor settings
INSERT INTO instructor_settings (simulation_id, hints_enabled, worked_solutions_policy)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', true, 'after_submission');

-- Insert rubric
INSERT INTO rubrics (simulation_id, criteria) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '[
    {"name": "Economic Reasoning", "description": "Demonstrates sound economic logic in decision-making", "maxScore": 25},
    {"name": "Data Analysis", "description": "Appropriately interprets and uses quantitative evidence", "maxScore": 25},
    {"name": "Uncertainty Management", "description": "Acknowledges and addresses uncertainty in recommendations", "maxScore": 20},
    {"name": "Strategic Thinking", "description": "Connects decisions to long-term firm objectives", "maxScore": 15},
    {"name": "Communication", "description": "Clearly articulates rationale and addresses stakeholders", "maxScore": 15}
  ]'
);