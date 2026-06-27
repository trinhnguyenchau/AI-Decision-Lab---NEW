import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CompanyBrief } from './screens/CompanyBrief';
import { OperationalData } from './screens/OperationalData';
import { FinancialDashboard } from './screens/FinancialDashboard';
import { ScenarioScreen } from './screens/ScenarioScreen';
import { DecisionNotebook } from './screens/DecisionNotebook';
import { DecisionHistory } from './screens/DecisionHistory';
import { ExecutiveRecommendation } from './screens/ExecutiveRecommendation';
import { InstructorConsole } from './screens/InstructorConsole';
import { LoadingSpinner, ErrorScreen } from './components/layout/TopNav';
import { useAttemptStore, useNotebookStore, useNavigation } from './lib/store';
import { useAuth } from './lib/auth';
import { baselineKPIs } from './types';

function AppRoutes() {
  const { userId, loading: authLoading, error: authError, retry: retryAuth } = useAuth();
  const {
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
    saveRecommendation,
    submitRecommendation,
  } = useAttemptStore(userId);

  const { progress } = useNavigation();

  const notebook = useNotebookStore(attempt?.id || null);

  if (authError) return <ErrorScreen message={authError} onRetry={retryAuth} />;
  if (authLoading || !userId || loading) return <LoadingSpinner />;

  // Determine if instructor mode
  const isInstructor = false; // TODO: Implement role-based routing

  if (isInstructor) {
    return (
      <Routes>
        <Route path="/instructor/*" element={<InstructorConsole userId={userId} simulationId={simulation?.id || null} />} />
        <Route path="*" element={<Navigate to="/instructor" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/brief" replace />} />
      <Route
        path="/brief"
        element={
          <CompanyBrief userId={userId} />
        }
      />
      <Route
        path="/operational-data"
        element={
          <OperationalData userId={userId} />
        }
      />
      <Route
        path="/financials"
        element={
          <FinancialDashboard userId={userId} />
        }
      />
      <Route
        path="/scenario/:id"
        element={
          <ScenarioScreen
            userId={userId}
            scenarios={scenarios}
            currentKPIs={currentKPIs}
            responses={responses}
            snapshots={snapshots}
            loading={loading}
            onSaveAssumptions={saveAssumptions}
            onSelectDecision={selectDecision}
            onSaveReflection={saveReflection}
            onLockScenario={lockScenario}
            onAddNote={notebook.addEntry}
          />
        }
      />
      <Route
        path="/notebook"
        element={
          <DecisionNotebook
            userId={userId}
            entries={notebook.entries}
            scenarios={scenarios}
            currentKPIs={currentKPIs}
            progress={progress()}
            onAddEntry={notebook.addEntry}
            onDeleteEntry={notebook.removeEntry}
          />
        }
      />
      <Route
        path="/history"
        element={
          <DecisionHistory
            userId={userId}
            scenarios={scenarios}
            responses={responses}
            snapshots={snapshots}
            currentKPIs={currentKPIs}
            progress={progress()}
          />
        }
      />
      <Route
        path="/recommendation"
        element={
          <ExecutiveRecommendation
            userId={userId}
            scenarios={scenarios}
            responses={responses}
            notebookEntries={notebook.entries}
            recommendation={recommendation}
            currentKPIs={currentKPIs}
            attemptStatus={attempt?.status || 'in_progress'}
            onSaveRecommendation={saveRecommendation}
            onSubmitRecommendation={submitRecommendation}
          />
        }
      />
      <Route path="*" element={<Navigate to="/brief" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
