import React, { useState } from 'react';
import { UserProfile, LeadRecord } from '../types/crm';
import { TEAM_MEMBERS } from '../data/team';
import { Users, X, ShieldCheck, UserCheck, Shuffle, PhoneCall, Lock, Award } from 'lucide-react';

interface TeamDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadRecord[];
  currentUser: UserProfile;
  onAutoDistribute: () => void;
}

export const TeamDeskModal: React.FC<TeamDeskModalProps> = ({
  isOpen,
  onClose,
  leads,
  currentUser,
  onAutoDistribute,
}) => {
  const [search, setSearch] = useState('');
  const isSuperAdmin = currentUser.role === 'super_admin';

  if (!isOpen) return null;

  const today = new Date().toDateString();
  const now = new Date();

  // Metrics for each team member
  const teamStats = TEAM_MEMBERS.map((member) => {
    const memberLeads = leads.filter((l) => l.assignedToUserId === member.id);
    const callsToday = memberLeads.filter((l) => l.day === today && l.res).length;
    const activeLocks = memberLeads.filter(
      (l) => l.lock && new Date(l.lock.expiresAt) > now
    ).length;
    const dealsWon = memberLeads.filter((l) => l.next === 'won').length;

    return {
      ...member,
      assignedCount: memberLeads.length,
      callsToday,
      activeLocks,
      dealsWon,
    };
  });

  const unassignedCount = leads.filter((l) => !l.assignedToUserId).length;

  const filteredTeam = teamStats.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.territory.toLowerCase().includes(search.toLowerCase()) ||
      m.designation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#2b4540] bg-[#0c1615] p-5 sm:p-6 shadow-2xl text-white my-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#1b2b28] pb-3 mb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Team Directory (25 Employees &amp; 2 Super Admins)
              </h3>
              <p className="text-xs text-[#8ba39d]">
                Role-based access, territory assignments, active lead locks, and daily targets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8ba39d] hover:bg-[#142320] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Super Admin Distribution Action Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#0e1d1b] border border-[#23433c] p-3 text-xs mb-4">
          <div>
            <strong className="text-white">Unassigned Pool:</strong>{' '}
            <span className="text-[#35d4b8] font-bold text-sm">{unassignedCount} leads</span> ready
            for distribution.
            <div className="text-[#8ba39d] text-[11px] mt-0.5">
              Round-robin automatically allocates leads equally across all 25 active sales representatives.
            </div>
          </div>

          {isSuperAdmin && (
            <button
              onClick={onAutoDistribute}
              disabled={unassignedCount === 0}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#35d4b8] to-[#25a38c] px-3.5 py-2 font-bold text-[#04201a] shadow hover:brightness-110 active:scale-95 disabled:opacity-40"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span>Round-Robin Auto-Distribute</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search representative by name, designation or territory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#1b2b28] bg-[#08100f] px-3 py-2 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
          />
        </div>

        {/* Members Grid / List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filteredTeam.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl border p-3 flex flex-wrap items-center justify-between gap-3 text-xs ${
                m.role === 'super_admin'
                  ? 'border-amber-500/30 bg-amber-950/20'
                  : 'border-[#1b2b28] bg-[#091211]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${m.avatarColor} font-bold text-white text-xs shadow`}
                >
                  {m.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>

                <div className="min-w-0">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="truncate">{m.name}</span>
                    {m.role === 'super_admin' ? (
                      <span className="rounded bg-amber-950 border border-amber-500/40 text-amber-300 px-1.5 py-0.2 text-[9px] font-bold">
                        SUPER ADMIN
                      </span>
                    ) : (
                      <span className="rounded bg-[#132c27] text-[#35d4b8] px-1.5 py-0.2 text-[9px] font-semibold">
                        SALES REP
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#8ba39d] mt-0.5">
                    {m.designation} • <strong>{m.territory}</strong>
                  </div>
                  <div className="text-[10px] text-[#5e7772]">
                    {m.email} • {m.phone}
                  </div>
                </div>
              </div>

              {/* Stats for Rep */}
              <div className="flex items-center gap-4 shrink-0 text-center">
                <div>
                  <div className="text-[10px] text-[#8ba39d] uppercase">Assigned</div>
                  <div className="text-sm font-bold text-white">{m.assignedCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8ba39d] uppercase">Calls Today</div>
                  <div className="text-sm font-bold text-[#35d4b8]">
                    {m.callsToday} / {m.targetCalls}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8ba39d] uppercase">Active Locks</div>
                  <div className="text-sm font-bold text-amber-300">{m.activeLocks}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#8ba39d] uppercase">Deals Won</div>
                  <div className="text-sm font-bold text-emerald-400">{m.dealsWon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end border-t border-[#1b2b28] pt-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#1f322f] px-4 py-2 text-xs font-semibold text-[#8ba39d] hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
