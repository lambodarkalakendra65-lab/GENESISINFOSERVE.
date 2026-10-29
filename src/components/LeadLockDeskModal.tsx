import React from 'react';
import { LeadRecord, UserProfile } from '../types/crm';
import { Lock, Unlock, X, ShieldAlert, Clock, Phone, AlertCircle } from 'lucide-react';

interface LeadLockDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadRecord[];
  currentUser: UserProfile;
  onReleaseLock: (leadId: number) => void;
  onExtendLock: (leadId: number) => void;
}

export const LeadLockDeskModal: React.FC<LeadLockDeskModalProps> = ({
  isOpen,
  onClose,
  leads,
  currentUser,
  onReleaseLock,
  onExtendLock,
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const lockedLeads = leads.filter(
    (l) => l.lock && new Date(l.lock.expiresAt) > now
  );

  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2b4540] bg-[#0c1615] p-5 sm:p-6 shadow-2xl text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b2b28] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Real-Time Lead Lock Monitor
                <span className="rounded-full bg-amber-950 border border-amber-500/40 px-2 py-0.2 text-[10px] font-bold text-amber-300">
                  {lockedLeads.length} Active Locks
                </span>
              </h3>
              <p className="text-xs text-[#8ba39d]">
                Prevents duplicate calling &amp; outreach collision across 25 sales reps
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

        {/* Info callout */}
        <div className="rounded-xl bg-[#091513] border border-[#1b342e] p-3 text-xs text-[#8ba39d] mb-4 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-[#35d4b8] shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">How the Lead Lock System works:</strong> When any of the 25 reps opens or claims a lead, it is exclusively reserved for 15 minutes. Other reps are restricted from calling or emailing that lead to avoid embarrassing duplicate contact.
          </div>
        </div>

        {/* Locked Leads List */}
        {lockedLeads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#1f322f] p-8 text-center text-[#8ba39d] text-xs">
            No active locks right now. All leads are open for outreach.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {lockedLeads.map((l) => {
              const lock = l.lock!;
              const expTime = new Date(lock.expiresAt).getTime();
              const diff = Math.max(0, expTime - Date.now());
              const mins = Math.floor(diff / 60000);
              const secs = Math.floor((diff % 60000) / 1000);
              const timerStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

              const isMyLock = lock.lockedByUserId === currentUser.id;

              return (
                <div
                  key={l.id}
                  className={`rounded-xl border p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs ${
                    isMyLock
                      ? 'border-[#35d4b8]/50 bg-[#122723]'
                      : 'border-red-900/40 bg-[#170e0e]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="truncate max-w-xs">{l.n}</span>
                      <span className="rounded bg-[#0a1715] text-[#35d4b8] px-1.5 py-0.2 text-[10px]">
                        {l.c}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8ba39d] mt-1 flex items-center gap-2">
                      <span>Phone: <strong className="text-white">{l.p}</strong></span>
                      <span>•</span>
                      <span>City: {l.city}</span>
                    </div>
                    <div className="text-[11px] text-amber-300 font-semibold mt-1 flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>
                        Locked by: <strong className="text-white">{lock.lockedByUserName}</strong>
                        {isMyLock && ' (You)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right font-mono font-bold text-xs bg-[#070e0d] px-2.5 py-1.5 rounded-lg border border-[#1b2b28]">
                      <div className="text-[9px] uppercase text-[#7a9b94]">Time Left</div>
                      <div className="text-amber-400 text-sm">{timerStr}</div>
                    </div>

                    {isMyLock && (
                      <>
                        <button
                          onClick={() => onExtendLock(l.id)}
                          className="rounded-lg bg-[#1f564b] hover:bg-[#286f61] px-2.5 py-1.5 font-bold text-white text-[11px]"
                        >
                          +15m
                        </button>
                        <button
                          onClick={() => onReleaseLock(l.id)}
                          className="rounded-lg border border-[#35d4b8]/40 hover:bg-[#12312b] px-2.5 py-1.5 font-bold text-[#35d4b8] text-[11px]"
                        >
                          Unlock
                        </button>
                      </>
                    )}

                    {!isMyLock && isSuperAdmin && (
                      <button
                        onClick={() => onReleaseLock(l.id)}
                        className="rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-bold px-2.5 py-1.5 text-[11px]"
                        title="Super Admin override to release lock"
                      >
                        Force Unlock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
