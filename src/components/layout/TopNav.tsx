import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Book, History, Menu, X } from 'lucide-react';
import { KpiStrip } from '../ui/KpiCard';
import { KPIState, baselineKPIs } from '../../types';

interface TopNavProps {
  kpis: KPIState;
  progress: { step: number; total: number };
  showKPIs?: boolean;
  userId: string | null;
}

export function TopNav({ kpis, progress, showKPIs = true, userId }: TopNavProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const stages = [
    { path: '/brief', label: 'Brief' },
    { path: '/operational-data', label: 'Data' },
    { path: '/financials', label: 'Financials' },
    { path: '/scenario/1', label: 'S1' },
    { path: '/scenario/2', label: 'S2' },
    { path: '/scenario/3', label: 'S3' },
    { path: '/scenario/4', label: 'S4' },
    { path: '/scenario/5', label: 'S5' },
    { path: '/recommendation', label: 'Report' },
  ];

  const currentIndex = stages.findIndex(s => location.pathname.startsWith(s.path));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900">AI Decision Lab</h1>
                <p className="text-xs text-slate-500">Accounting Firm Simulation</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {stages.map((stage, i) => {
              const isPast = i < currentIndex;
              const isCurrent = i === currentIndex;
              const isLocked = i > currentIndex + 1;

              return (
                <React.Fragment key={stage.path}>
                  {i > 0 && <div className="w-4 h-0.5 bg-slate-200 mx-1" />}
                  <Link
                    to={isLocked ? '#' : stage.path}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      isCurrent
                        ? 'bg-slate-900 text-white'
                        : isPast
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'text-slate-400'
                    } ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}
                    onClick={e => isLocked && e.preventDefault()}
                  >
                    {stage.label}
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/notebook"
                className={`p-2 rounded-lg transition-colors ${
                  location.pathname === '/notebook'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
                title="Decision Notebook"
              >
                <Book className="w-5 h-5" />
              </Link>
              <Link
                to="/history"
                className={`p-2 rounded-lg transition-colors ${
                  location.pathname === '/history'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
                title="Decision History"
              >
                <History className="w-5 h-5" />
              </Link>
            </div>
            <button
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 px-4 py-3 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {stages.map((stage, i) => {
                const isCurrent = i === currentIndex;
                return (
                  <Link
                    key={stage.path}
                    to={stage.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg text-center ${
                      isCurrent
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {stage.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <Link
                to="/notebook"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg text-center flex items-center justify-center gap-2"
              >
                <Book className="w-4 h-4" />
                Notebook
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg text-center flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Link>
            </div>
          </div>
        )}

        {/* KPI Strip */}
        {showKPIs && (
          <div className="px-4 pb-3 border-t border-slate-200 pt-3 overflow-x-auto">
            <KpiStrip kpis={kpis} baseline={baselineKPIs} />
          </div>
        )}
      </div>
    </header>
  );
}

export function PageShell({
  children,
  kpis,
  progress,
  userId,
  showKPIs = true,
}: {
  children: React.ReactNode;
  kpis: KPIState;
  progress: { step: number; total: number };
  userId: string | null;
  showKPIs?: boolean;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav kpis={kpis} progress={progress} showKPIs={showKPIs} userId={userId} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

export function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-6 shadow-sm text-center">
        <h2 className="text-lg font-semibold text-rose-700 mb-2">Couldn't connect</h2>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
