import React from 'react';
import { UserProfile, LeadRecord } from '../types/crm';
import { PhoneCall, Clock, Lock, CheckCircle2, DollarSign, Layers } from 'lucide-react';

interface KpiCardsProps {
  currentUser: UserProfile;
  leads: LeadRecord[];
  onFilterClick: (type: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  currentUser,
  leads,
  onFilterClick,
}) => {
  const today = new Date().toDateString();

  // Calls today (for current user if employee, or total if super admin)
  const isSuperAdmin = currentUser.role === 'super_admin';

  const myLeads = leads.filter((l) => l.assignedToUserId === currentUser.id);
  const relevantLeads = isSuperAdmin ? leads : myLeads;

  const callsMadeToday = relevantLeads.filter((l) => l.day === today && l.res).length;
  const targetCalls = currentUser.targetCalls || 40;
  const progressPct = Math.min(100, Math.round((callsMadeToday / targetCalls) * 100));

  // Follow-ups due
  const now = new Date();
  const followupsDue = relevantLeads.filter((l) => {
    if (!l.fu || l.next === 'won') return false;
    const fuDate = new Date(l.fu);
    return !isNaN(fuDate.getTime()) && fuDate <= now;
  }).length;

  // Active locks
  const activeLocks = leads.filter((l) => l.lock && new Date(l.lock.expiresAt) > now);
  const myLocks = activeLocks.filter((l) => l.lock?.lockedByUserId === currentUser.id);

  // High accuracy verified count
  const verifiedCount = leads.filter(
    (l) => l.verification && l.verification.overallAccuracyScore >= 80
  ).length;

  // Pipeline sum
  const pipelineValue = leads.reduce((sum, l) => {
    if (l.qa) {
      const clean = parseFloat(String(l.qa).replace(/[^\d.]/g, ''));
      if (!isNaN(clean)) return sum + clean;
    }
    return sum;
  }, 0);

  // Formatter for INR
  const formatInr = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
      {/* Top Welcome & Daily Calling Dial Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#1f322f] bg-gradient-to-r from-[#0d1a18] via-[#0e1d1b] to-[#122320] p-4 sm:p-5 shadow-xl mb-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                {currentUser.role === 'super_admin' ? 'Super Admin Console' : 'Calling Desk Desk'}
              </span>
              <span className="text-[11px] text-[#8ba39d]">
                • Territory: <strong className="text-white">{currentUser.territory}</strong>
              </span>
            </div>
            <h1 className="mt-1 text-xl sm:text-2xl font-extrabold text-white">
              Welcome, {currentUser.name}
            </h1>
            <p className="mt-0.5 text-xs text-[#8ba39d]">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {' • '}
              {isSuperAdmin
                ? 'Showing Organization Overview for all 25 Reps'
                : 'Showing Your Assigned Leads & Active Locks'}
            </p>
          </div>

          {/* Daily Calling Target Ring */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-[#2b4540] bg-[#071312]/80 px-4 py-2.5">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-[#192b27]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#35d4b8] transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[12px] font-extrabold text-[#35d4b8]">
                {progressPct}%
              </span>
            </div>
            <div>
              <div className="text-xs text-[#8ba39d]">Calls Today</div>
              <div className="text-lg font-black text-white">
                <span className="text-[#35d4b8]">{callsMadeToday}</span>
                <span className="text-[#52706a] text-sm"> / {targetCalls}</span>
              </div>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#182a27] mt-1">
                <div
                  className="h-full bg-gradient-to-r from-[#35d4b8] to-[#7ee8d6] transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* Calls Today */}
        <button
          onClick={() => onFilterClick('aaj')}
          className="flex flex-col items-start rounded-xl border border-[#1f322f] bg-[#111d1b] p-3 text-left transition-all hover:border-[#35d4b8] hover:translate-y-[-2px] active:scale-98"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#35d4b8]/10 text-[#35d4b8] border border-[#35d4b8]/20 mb-2">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {callsMadeToday}
            <span className="text-xs font-normal text-[#8ba39d]">/{targetCalls}</span>
          </div>
          <div className="text-[11px] font-medium text-[#8ba39d]">Calls Aaj</div>
        </button>

        {/* Follow-ups Due */}
        <button
          onClick={() => onFilterClick('fu')}
          className="flex flex-col items-start rounded-xl border border-[#1f322f] bg-[#111d1b] p-3 text-left transition-all hover:border-amber-400 hover:translate-y-[-2px] active:scale-98"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {followupsDue}
            {followupsDue > 0 && (
              <span className="ml-1 text-[10px] font-bold text-amber-400">Due</span>
            )}
          </div>
          <div className="text-[11px] font-medium text-[#8ba39d]">Follow-ups</div>
        </button>

        {/* Lead Locks Active */}
        <button
          onClick={() => onFilterClick('my_locks')}
          className="flex flex-col items-start rounded-xl border border-[#1f322f] bg-[#111d1b] p-3 text-left transition-all hover:border-cyan-400 hover:translate-y-[-2px] active:scale-98"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2">
            <Lock className="h-4 w-4" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {myLocks.length}
            <span className="text-xs font-normal text-[#8ba39d]">
              {' '}
              ({activeLocks.length} team)
            </span>
          </div>
          <div className="text-[11px] font-medium text-[#8ba39d]">Active Locks</div>
        </button>

        {/* Total Leads */}
        <button
          onClick={() => onFilterClick('sab')}
          className="flex flex-col items-start rounded-xl border border-[#1f322f] bg-[#111d1b] p-3 text-left transition-all hover:border-blue-400 hover:translate-y-[-2px] active:scale-98"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <Layers className="h-4 w-4" />
          </div>
          <div className="text-xl font-extrabold text-white">{leads.length}</div>
          <div className="text-[11px] font-medium text-[#8ba39d]">
            {isSuperAdmin ? 'Total Leads' : 'My Assigned'}
          </div>
        </button>

        {/* Verified Leads */}
        <button
          onClick={() => onFilterClick('verified')}
          className="flex flex-col items-start rounded-xl border border-[#1f322f] bg-[#111d1b] p-3 text-left transition-all hover:border-emerald-400 hover:translate-y-[-2px] active:scale-98"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="text-xl font-extrabold text-white">
            {verifiedCount}
            <span className="text-[10px] font-bold text-emerald-400 ml-1">
              {Math.round((verifiedCount / (leads.length || 1)) * 100)}%
            </span>
          </div>
          <div className="text-[11px] font-medium text-[#8ba39d]">Verified Contacts</div>
        </button>

        {/* Pipeline Value */}
        <button
          onClick={() => onFilterClick('quotes')}
          className="flex flex-col items-start rounded-xl border border-[#1f322f] bg-[#111d1b] p-3 text-left transition-all hover:border-fuchsia-400 hover:translate-y-[-2px] active:scale-98"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 mb-2">
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-fuchsia-300">
            {formatInr(pipelineValue)}
          </div>
          <div className="text-[11px] font-medium text-[#8ba39d]">Quote Pipeline</div>
        </button>
      </div>
    </div>
  );
};
