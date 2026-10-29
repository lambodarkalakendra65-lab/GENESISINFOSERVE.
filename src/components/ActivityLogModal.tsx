import React, { useState } from 'react';
import { ActivityLog, ActionType } from '../types/crm';
import { Activity, X, Search, Filter, Download } from 'lucide-react';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
}

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.leadName && log.leadName.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: ActionType) => {
    switch (action) {
      case 'CALL_LOGGED':
        return <span className="rounded bg-blue-950 border border-blue-500/40 text-blue-300 px-1.5 py-0.5 text-[10px] font-bold">CALL LOGGED</span>;
      case 'LOCK_ACQUIRED':
        return <span className="rounded bg-amber-950 border border-amber-500/40 text-amber-300 px-1.5 py-0.5 text-[10px] font-bold">LOCK ACQUIRED</span>;
      case 'LOCK_RELEASED':
      case 'LOCK_FORCE_UNLOCKED':
        return <span className="rounded bg-gray-800 border border-gray-600 text-gray-300 px-1.5 py-0.5 text-[10px] font-bold">UNLOCKED</span>;
      case 'AUTO_GENERATED':
        return <span className="rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.5 text-[10px] font-bold">AUTO GENERATED</span>;
      case 'LEAD_ASSIGNED':
      case 'ROUND_ROBIN_DISTRIBUTED':
        return <span className="rounded bg-purple-950 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 text-[10px] font-bold">ASSIGNED</span>;
      case 'VERIFICATION_EXECUTED':
        return <span className="rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-1.5 py-0.5 text-[10px] font-bold">VERIFIED</span>;
      default:
        return <span className="rounded bg-[#172b27] text-[#35d4b8] px-1.5 py-0.5 text-[10px] font-bold">{action}</span>;
    }
  };

  const exportLogsCsv = () => {
    const headers = ['Timestamp', 'Representative', 'Role', 'Action', 'Target Lead', 'Details'];
    const rows = filteredLogs.map((l) => [
      new Date(l.timestamp).toLocaleString('en-IN'),
      l.userName,
      l.userRole,
      l.action,
      l.leadName || '',
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis_activity_audit_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#2b4540] bg-[#0c1615] p-5 sm:p-6 shadow-2xl text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b2b28] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#35d4b8] to-[#124b40] text-[#06231d]">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Detailed Activity Logging &amp; Audit Trail
                <span className="rounded-full bg-[#16302a] border border-[#23584e] px-2 py-0.2 text-[10px] font-bold text-[#35d4b8]">
                  {filteredLogs.length} Records
                </span>
              </h3>
              <p className="text-xs text-[#8ba39d]">
                Immutable activity trail of calling, lead claims, locks, assignments &amp; outcomes
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

        {/* Filter controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
          <div className="flex flex-1 items-center gap-2 min-w-[200px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8ba39d]" />
              <input
                type="text"
                placeholder="Search rep name, lead, details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#1b2b28] bg-[#08100f] pl-8 pr-3 py-1.5 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
              />
            </div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="rounded-xl border border-[#1b2b28] bg-[#08100f] px-2.5 py-1.5 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
            >
              <option value="ALL">All Actions</option>
              <option value="CALL_LOGGED">Calls Logged</option>
              <option value="LOCK_ACQUIRED">Locks Acquired</option>
              <option value="LOCK_RELEASED">Locks Released</option>
              <option value="AUTO_GENERATED">Auto Generated</option>
              <option value="LEAD_ASSIGNED">Lead Assigned</option>
              <option value="VERIFICATION_EXECUTED">Verifications</option>
            </select>
          </div>

          <button
            onClick={exportLogsCsv}
            className="flex items-center gap-1.5 rounded-xl border border-[#1f322f] bg-[#12221f] px-3 py-1.5 text-xs font-semibold text-[#35d4b8] hover:bg-[#182f2a]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Log table */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#8ba39d]">
              No activity matching the filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl border border-[#1b2b28] bg-[#08100f] p-3 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <strong className="text-white">{log.userName}</strong>
                    <span className="text-[#8ba39d]">({log.userRole})</span>
                    {getActionBadge(log.action)}
                  </div>
                  <span className="text-[#59746f] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}{' '}
                    • {new Date(log.timestamp).toLocaleDateString('en-IN')}
                  </span>
                </div>
                {log.leadName && (
                  <div className="text-[#8ba39d] text-[11px]">
                    Lead: <strong className="text-[#d8f5ef]">{log.leadName}</strong>
                  </div>
                )}
                <div className="text-gray-300 text-xs mt-0.5 leading-relaxed">
                  {log.details}
                </div>
              </div>
            ))
          )}
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
