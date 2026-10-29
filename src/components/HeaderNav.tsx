import React, { useState } from 'react';
import { UserProfile } from '../types/crm';
import { TEAM_MEMBERS } from '../data/team';
import { 
  ShieldCheck, 
  UserCheck, 
  ChevronDown, 
  Sparkles, 
  Lock, 
  Activity, 
  Users, 
  Download,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface HeaderNavProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  activeLockCount: number;
  onOpenLeadGen: () => void;
  onOpenLockDesk: () => void;
  onOpenActivityLog: () => void;
  onOpenTeamDesk: () => void;
  onExportExcel: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentUser,
  onSelectUser,
  activeLockCount,
  onOpenLeadGen,
  onOpenLockDesk,
  onOpenActivityLog,
  onOpenTeamDesk,
  onExportExcel,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const superAdmins = TEAM_MEMBERS.filter((m) => m.role === 'super_admin');
  const employees = TEAM_MEMBERS.filter((m) => m.role === 'employee');

  const filteredAdmins = superAdmins.filter(
    (a) => a.name.toLowerCase().includes(userSearch.toLowerCase()) || a.territory.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredEmployees = employees.filter(
    (e) => e.name.toLowerCase().includes(userSearch.toLowerCase()) || e.territory.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <header className="relative z-30 border-b border-[#1b2b28] bg-[#0c1615]/95 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#35d4b8] to-[#164e43] text-black shadow-lg shadow-[#35d4b8]/20">
            <Building2 className="h-6 w-6 text-[#041a15]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-white text-base sm:text-lg">
                GENESIS INFOSERVE
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#14302a] border border-[#235349] px-2 py-0.5 text-[10px] font-semibold text-[#35d4b8]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#35d4b8] animate-ping" />
                Live Desk
              </span>
            </div>
            <p className="text-xs text-[#8ba39d]">
              Enterprise Auto Lead Gen • Calling Desk • Realtime Lock
            </p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Auto Lead Gen Button */}
          <button
            onClick={onOpenLeadGen}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#35d4b8] to-[#2eb89f] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#05251e] shadow-md shadow-[#35d4b8]/20 transition-all hover:brightness-110 active:scale-95"
            title="Auto-generate verified leads from LinkedIn, IndiaMART, Google Maps"
          >
            <Sparkles className="h-4 w-4" />
            <span>Auto Lead Gen</span>
          </button>

          {/* Active Locks Desk */}
          <button
            onClick={onOpenLockDesk}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
              activeLockCount > 0
                ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50'
                : 'border-[#1f322f] bg-[#111d1b] text-[#eef5f3] hover:border-[#35d4b8]/50'
            }`}
            title="View Active Lead Locks across 25 Employees"
          >
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Lead Locks</span>
            {activeLockCount > 0 && (
              <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-black text-black">
                {activeLockCount}
              </span>
            )}
          </button>

          {/* Activity Logs */}
          <button
            onClick={onOpenActivityLog}
            className="flex items-center gap-1.5 rounded-xl border border-[#1f322f] bg-[#111d1b] px-3 py-2 text-xs font-semibold text-[#eef5f3] transition-all hover:border-[#35d4b8]/50 active:scale-95"
            title="Detailed Activity Logging & Audit Trail"
          >
            <Activity className="h-3.5 w-3.5 text-[#35d4b8]" />
            <span className="hidden sm:inline">Activity Logs</span>
          </button>

          {/* Team Management (Super Admin & Overview) */}
          <button
            onClick={onOpenTeamDesk}
            className="flex items-center gap-1.5 rounded-xl border border-[#1f322f] bg-[#111d1b] px-3 py-2 text-xs font-semibold text-[#eef5f3] transition-all hover:border-[#35d4b8]/50 active:scale-95"
            title="Team of 25 Employees & 2 Super Admins"
          >
            <Users className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Team (27)</span>
          </button>

          {/* Export Backup */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1 rounded-xl border border-[#1f322f] bg-[#111d1b] px-2.5 py-2 text-xs font-semibold text-[#8ba39d] transition-all hover:text-white hover:border-[#35d4b8]/40"
            title="Export Excel Backup"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Excel</span>
          </button>

          {/* User Profile & RBAC Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 rounded-xl border border-[#2b4540] bg-[#122320] px-3 py-1.5 text-left transition-all hover:border-[#35d4b8] active:scale-95"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr ${currentUser.avatarColor} text-[11px] font-bold text-white shadow`}
              >
                {currentUser.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="hidden sm:block text-xs leading-tight">
                <div className="font-bold text-white flex items-center gap-1">
                  {currentUser.name}
                  {currentUser.role === 'super_admin' ? (
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <UserCheck className="h-3 w-3 text-[#35d4b8]" />
                  )}
                </div>
                <div className="text-[10px] text-[#8ba39d]">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : 'Sales Executive'}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#8ba39d]" />
            </button>

            {/* Profile Selection Modal/Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-80 max-h-[80vh] overflow-y-auto rounded-2xl border border-[#2b4540] bg-[#0d1817] p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="mb-2 px-2 pt-1 pb-2 border-b border-[#1b2b28]">
                  <p className="text-xs font-semibold text-[#35d4b8] mb-1">
                    Switch User Profile (RBAC Simulation)
                  </p>
                  <p className="text-[11px] text-[#8ba39d]">
                    Test the system as Super Admin or any of the 25 Sales Executives.
                  </p>
                  <input
                    type="text"
                    placeholder="Search name or territory..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="mt-2 w-full rounded-lg border border-[#24332f] bg-[#070e0d] px-2.5 py-1.5 text-xs text-white placeholder-[#5a726d] focus:border-[#35d4b8] focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Super Admins */}
                {filteredAdmins.length > 0 && (
                  <div className="mb-2">
                    <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                      2 Super Admins (Full Control)
                    </div>
                    {filteredAdmins.map((admin) => (
                      <button
                        key={admin.id}
                        onClick={() => {
                          onSelectUser(admin);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition-all ${
                          currentUser.id === admin.id
                            ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                            : 'hover:bg-[#142320] text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr ${admin.avatarColor} text-[10px] font-bold text-white`}
                          >
                            {admin.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white flex items-center gap-1">
                              {admin.name}
                              <ShieldCheck className="h-3 w-3 text-amber-400" />
                            </div>
                            <div className="text-[10px] text-amber-300/80">
                              {admin.designation}
                            </div>
                          </div>
                        </div>
                        {currentUser.id === admin.id && (
                          <CheckCircle2 className="h-4 w-4 text-amber-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* 25 Employees */}
                <div>
                  <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-[#35d4b8] uppercase">
                    25 Sales Executives (Lead Locked Calling)
                  </div>
                  <div className="space-y-1">
                    {filteredEmployees.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          onSelectUser(emp);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left transition-all ${
                          currentUser.id === emp.id
                            ? 'bg-[#15342d] border border-[#35d4b8]/50 text-[#35d4b8]'
                            : 'hover:bg-[#142320] text-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr ${emp.avatarColor} text-[9px] font-bold text-white`}
                          >
                            {emp.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">
                              {emp.name}
                            </div>
                            <div className="text-[10px] text-[#8ba39d]">
                              {emp.territory}
                            </div>
                          </div>
                        </div>
                        {currentUser.id === emp.id && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#35d4b8]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
