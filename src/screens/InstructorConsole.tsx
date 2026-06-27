import React from 'react';
import { Users, BarChart3, FileCheck, Settings, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: string | null;
  simulationId: string | null;
}

export function InstructorConsole({ userId }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">Instructor Console</h1>
                <p className="text-xs text-slate-500">AI Decision Lab</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              Instructor Mode
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Managing an AI-Enabled Accounting Firm</h2>
          <p className="text-slate-600 mt-1">Monitor student progress, review submissions, and configure simulation settings.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-500">Total Students</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
            <p className="text-xs text-slate-400 mt-1">No students enrolled yet</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-500">Completed</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
            <p className="text-xs text-slate-400 mt-1">Reports submitted</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-slate-500">Pending Review</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">0</p>
            <p className="text-xs text-slate-400 mt-1">Reports awaiting grading</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-slate-500">Avg. Time</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">--</p>
            <p className="text-xs text-slate-400 mt-1">Time to complete</p>
          </div>
        </div>

        {/* Completion Funnel */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Stage Completion</h3>
          <div className="space-y-3">
            {[
              { stage: 'Company Brief', count: 0, total: 0 },
              { stage: 'Operational Data', count: 0, total: 0 },
              { stage: 'Financial Dashboard', count: 0, total: 0 },
              { stage: 'Scenario 1: Generative AI Arrives', count: 0, total: 0 },
              { stage: 'Scenario 2: Workforce Restructuring', count: 0, total: 0 },
              { stage: 'Scenario 3: Hallucination Crisis', count: 0, total: 0 },
              { stage: 'Scenario 4: Competitive Disruption', count: 0, total: 0 },
              { stage: 'Scenario 5: The AI-Native Challenger', count: 0, total: 0 },
              { stage: 'Executive Recommendation', count: 0, total: 0 },
            ].map((item) => (
              <div key={item.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.stage}</span>
                  <span className="text-slate-900 font-medium">{item.count}/{item.total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500 rounded-full"
                    style={{ width: `${item.total > 0 ? (item.count / item.total * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {['Scenario 1', 'Scenario 2', 'Scenario 3', 'Scenario 4', 'Scenario 5'].map((s) => (
            <div key={s} className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">{s} Decisions</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-24">Option A:</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-500 rounded-full" style={{ width: '33%' }} />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">0%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-24">Option B:</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full" style={{ width: '33%' }} />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">0%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 w-24">Option C:</span>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: '34%' }} />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">0%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4 text-center">No data available yet</p>
            </div>
          ))}
        </div>

        {/* Simulation Configuration */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Simulation Configuration</h3>
            <button className="text-sm text-slate-500 hover:text-slate-700">Edit Settings</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Hints</p>
              <p className="font-medium text-slate-900">Enabled</p>
              <p className="text-xs text-slate-400">Students can view hints</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Worked Solutions</p>
              <p className="font-medium text-slate-900">After Submission</p>
              <p className="text-xs text-slate-400">Unlocked after report submission</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Rubric</p>
              <p className="font-medium text-slate-900">5 Criteria (100 pts)</p>
              <p className="text-xs text-slate-400">Economic reasoning, data analysis, etc.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function InstructorSubmissionReview() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="font-bold text-slate-900">Submission Review</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-slate-500">No submissions to review yet.</p>
      </main>
    </div>
  );
}
