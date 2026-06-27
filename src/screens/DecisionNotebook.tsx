import React, { useState, useMemo } from 'react';
import { BookOpen, Trash2, Search, Filter, Plus } from 'lucide-react';
import { PageShell } from '../components/layout/TopNav';
import { NotebookEntry, Scenario, KPIState } from '../types';

interface Props {
  userId: string | null;
  entries: NotebookEntry[];
  scenarios: Scenario[];
  currentKPIs: KPIState;
  progress: { step: number; total: number };
  onAddEntry: (content: string, scenarioId?: string) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function DecisionNotebook({
  userId,
  entries,
  scenarios,
  currentKPIs,
  progress,
  onAddEntry,
  onDeleteEntry,
}: Props) {
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScenario, setFilterScenario] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch = searchQuery === '' ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesScenario = filterScenario === null ||
        entry.scenario_id === filterScenario;
      return matchesSearch && matchesScenario;
    });
  }, [entries, searchQuery, filterScenario]);

  const handleAdd = () => {
    if (newContent.trim()) {
      onAddEntry(newContent.trim());
      setNewContent('');
    }
  };

  const getScenarioTitle = (scenarioId: string | null) => {
    if (!scenarioId) return 'General';
    const scenario = scenarios.find(s => s.id === scenarioId);
    return scenario ? `S${scenario.order_index}: ${scenario.title}` : 'General';
  };

  return (
    <PageShell kpis={currentKPIs} progress={progress} showKPIs={false} userId={userId}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Decision Notebook</h1>
              <p className="text-slate-600">Your notes and reflections throughout the simulation</p>
            </div>
          </div>
        </div>

        {/* Add New Entry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Add New Entry</h2>
          <div className="flex gap-3">
            <textarea
              className="flex-1 p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slate-200"
              rows={3}
              placeholder="Write your thoughts, analysis, or key insights..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <button
              onClick={handleAdd}
              disabled={!newContent.trim()}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search entries..."
              className="flex-1 border-none focus:outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              value={filterScenario || ''}
              onChange={(e) => setFilterScenario(e.target.value || null)}
            >
              <option value="">All entries</option>
              <option value="null">General</option>
              {scenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  S{scenario.order_index}: {scenario.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Entries List */}
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              {searchQuery || filterScenario
                ? 'No entries match your filters'
                : 'No entries yet. Start adding notes from any screen!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                        {getScenarioTitle(entry.scenario_id)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Delete this entry?')) {
                        onDeleteEntry(entry.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
