import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, LeadRecord, ActivityLog } from './types/crm';
import { TEAM_MEMBERS } from './data/team';
import { HeaderNav } from './components/HeaderNav';
import { KpiCards } from './components/KpiCards';
import { FilterBar } from './components/FilterBar';
import { LeadCard } from './components/LeadCard';
import { AutoLeadGenModal } from './components/AutoLeadGenModal';
import { LeadLockDeskModal } from './components/LeadLockDeskModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { TeamDeskModal } from './components/TeamDeskModal';
import { ScriptModal } from './components/ScriptModal';
import { cleanDigits, isIndianMobile } from './utils/verification';
import { AlertCircle, CheckCircle, RefreshCw, Plus, Sparkles, Lock } from 'lucide-react';

export default function App() {
  // Current logged in user profile (Defaults to Mohnish Poojari - Super Admin & Sales Head)
  const [currentUser, setCurrentUser] = useState<UserProfile>(TEAM_MEMBERS[1]);

  // Core Data
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [activeTab, setActiveTab] = useState<string>('aaj');
  const [selectedCategory, setSelectedCategory] = useState<string>('Sab');
  const [selectedCity, setSelectedCity] = useState<string>('Sab shehar');
  const [selectedProduct, setSelectedProduct] = useState<string>('Sab products');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unverifiedOnly, setUnverifiedOnly] = useState<boolean>(false);

  // Modals
  const [showLeadGenModal, setShowLeadGenModal] = useState<boolean>(false);
  const [showLockDeskModal, setShowLockDeskModal] = useState<boolean>(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState<boolean>(false);
  const [showTeamDeskModal, setShowTeamDeskModal] = useState<boolean>(false);
  const [scriptModalLead, setScriptModalLead] = useState<LeadRecord | null>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch leads and activity logs from API
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to load leads from server:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/activity-logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setActivityLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchLogs();
    // Live polling every 10 seconds for real-time team lock sync
    const interval = setInterval(() => {
      fetchLeads();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Lead Lock Management Handlers
  const handleAcquireLock = async (leadId: number) => {
    try {
      const res = await fetch('/api/leads/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (data.success && data.lock) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, lock: data.lock } : l))
        );
        showToast(`🔒 Exclusive 15-minute lock acquired for ${currentUser.name}!`);
        fetchLogs();
      } else {
        showToast(`⚠️ ${data.message || 'Cannot lock lead'}`);
        fetchLeads();
      }
    } catch (err) {
      console.error('Lock error:', err);
      showToast('Error claiming lead lock');
    }
  };

  const handleReleaseLock = async (leadId: number) => {
    try {
      const res = await fetch('/api/leads/release-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => {
            if (l.id === leadId) {
              const copy = { ...l };
              delete copy.lock;
              return copy;
            }
            return l;
          })
        );
        showToast('🔓 Lead lock released back to pool.');
        fetchLogs();
      }
    } catch (err) {
      console.error('Unlock error:', err);
    }
  };

  const handleExtendLock = async (leadId: number) => {
    try {
      const res = await fetch('/api/leads/extend-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (data.success && data.lock) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, lock: data.lock } : l))
        );
        showToast('⏱️ Lead lock extended by 15 minutes.');
        fetchLogs();
      }
    } catch (err) {
      console.error('Extend error:', err);
    }
  };

  // 3. Lead Update Handler
  const handleUpdateLead = async (id: number, updates: Partial<LeadRecord>) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, lastUpdated: new Date().toISOString() } : l))
    );

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          actorUserId: currentUser.id,
          actorName: currentUser.name,
          actorRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (data.success && data.lead) {
        setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
        fetchLogs();
      }
    } catch (err) {
      console.error('Update lead failed:', err);
    }
  };

  // 4. Contact Details Re-verification
  const handleReverify = async (leadId: number) => {
    const targetLead = leads.find((l) => l.id === leadId);
    if (!targetLead) return;

    try {
      const res = await fetch('/api/leads/verify-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          phone: targetLead.p,
          email: targetLead.email,
          companyName: targetLead.n,
          city: targetLead.city,
          actorUserId: currentUser.id,
          actorName: currentUser.name,
          actorRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (data.success && data.verification) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, verification: data.verification } : l))
        );
        showToast(`✓ Contact verified: ${data.verification.overallAccuracyScore}% accuracy score`);
        fetchLogs();
      }
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  // 5. Round-Robin Auto-Distribution (Super Admin)
  const handleAutoDistribute = async () => {
    try {
      const res = await fetch('/api/leads/auto-distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminUserId: currentUser.id,
          adminUserName: currentUser.name,
          adminRole: currentUser.role,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`✓ ${data.message || 'Leads distributed across 25 sales reps'}`);
        fetchLeads();
        fetchLogs();
      }
    } catch (err) {
      console.error('Auto distribute failed:', err);
    }
  };

  // 6. Export to Excel
  const handleExportExcel = () => {
    const headers = [
      'ID',
      'Company Name',
      'Category',
      'Type',
      'City',
      'Area',
      'Phone',
      'Email',
      'Contact Person',
      'Designation',
      'Source',
      'Accuracy Score',
      'Assigned Rep',
      'Call Result',
      'Next Step',
      'Follow-up',
      'Quoted Hardware/Software',
      'Quoted Amount',
      'Notes',
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.n.replace(/"/g, '""')}"`,
      l.c,
      l.t,
      l.city,
      `"${l.a.replace(/"/g, '""')}"`,
      l.p,
      l.email || '',
      `"${(l.cn || '').replace(/"/g, '""')}"`,
      `"${(l.cnDesignation || '').replace(/"/g, '""')}"`,
      l.source,
      `${l.verification?.overallAccuracyScore || 85}%`,
      l.assignedToUserName || 'Unassigned',
      l.res || 'Pending',
      l.next || '',
      l.fu || '',
      `"${(l.qs || '').replace(/"/g, '""')}"`,
      l.qa || '',
      `"${(l.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis_leads_backup_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('✓ Lead records exported to CSV/Excel');
  };

  // 7. Computed Cities list
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.city) set.add(l.city);
    });
    return Array.from(set).sort();
  }, [leads]);

  // 8. Filter Leads Pipeline
  const filteredLeads = useMemo(() => {
    const today = new Date().toDateString();
    const now = new Date();
    const isSuperAdmin = currentUser.role === 'super_admin';

    return leads.filter((lead) => {
      // Unverified check
      if (unverifiedOnly && lead.verification?.overallAccuracyScore >= 80) {
        return false;
      }

      // Tab filters
      if (activeTab === 'aaj') {
        // Today's desk: assigned to current user (or all if super admin), uncalled today or busy
        if (!isSuperAdmin && lead.assignedToUserId && lead.assignedToUserId !== currentUser.id) {
          return false;
        }
        const calledToday = lead.day === today && lead.res && lead.res !== 'busy';
        if (calledToday) return false;
      } else if (activeTab === 'fu') {
        // Follow-ups due
        if (!lead.fu || lead.next === 'won') return false;
        if (!isSuperAdmin && lead.assignedToUserId && lead.assignedToUserId !== currentUser.id) {
          return false;
        }
      } else if (activeTab === 'my_locks') {
        // Locks active for current user
        if (!lead.lock || lead.lock.lockedByUserId !== currentUser.id) {
          return false;
        }
      } else if (activeTab === 'indiamart') {
        if (lead.source !== 'indiamart') return false;
      } else if (activeTab === 'linkedin') {
        if (lead.source !== 'linkedin') return false;
      } else if (activeTab === 'google_maps') {
        if (lead.source !== 'google_maps') return false;
      } else if (activeTab === 'sab') {
        // All leads: if sales rep, show their assigned leads by default unless searching
        if (!isSuperAdmin && lead.assignedToUserId && lead.assignedToUserId !== currentUser.id && !searchQuery) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'Sab' && lead.c !== selectedCategory) {
        return false;
      }

      // City filter
      if (selectedCity !== 'Sab shehar' && lead.city !== selectedCity) {
        return false;
      }

      // Product filter
      if (selectedProduct !== 'Sab products') {
        const tagged = lead.pr || lead.dp || [];
        if (!tagged.includes(selectedProduct)) return false;
      }

      // Search text filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const haystack = [
          lead.n,
          lead.p,
          lead.a,
          lead.city,
          lead.t,
          lead.email || '',
          lead.cn || '',
          lead.note || '',
          lead.requirements || '',
          lead.assignedToUserName || '',
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [
    leads,
    activeTab,
    selectedCategory,
    selectedCity,
    selectedProduct,
    searchQuery,
    unverifiedOnly,
    currentUser,
  ]);

  // Active locks across team
  const activeLockCount = useMemo(() => {
    const now = new Date();
    return leads.filter((l) => l.lock && new Date(l.lock.expiresAt) > now).length;
  }, [leads]);

  return (
    <div className="min-h-screen bg-[#070d0c] text-[#e8f2ef] pb-16">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#35d4b8] bg-[#0c1a17] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}

      {/* 1. Header Navigation & RBAC Profile Switcher */}
      <HeaderNav
        currentUser={currentUser}
        onSelectUser={(u) => {
          setCurrentUser(u);
          showToast(`Switched active desk to ${u.name} (${u.role === 'super_admin' ? 'Super Admin' : 'Sales Rep'})`);
        }}
        activeLockCount={activeLockCount}
        onOpenLeadGen={() => setShowLeadGenModal(true)}
        onOpenLockDesk={() => setShowLockDeskModal(true)}
        onOpenActivityLog={() => setShowActivityLogModal(true)}
        onOpenTeamDesk={() => setShowTeamDeskModal(true)}
        onExportExcel={handleExportExcel}
      />

      {/* 2. KPI Cards & Calling Dial */}
      <KpiCards
        currentUser={currentUser}
        leads={leads}
        onFilterClick={(type) => {
          if (type === 'my_locks') setActiveTab('my_locks');
          else if (type === 'fu') setActiveTab('fu');
          else if (type === 'aaj') setActiveTab('aaj');
          else if (type === 'sab') setActiveTab('sab');
          else if (type === 'verified') setUnverifiedOnly(false);
        }}
      />

      {/* 3. Filter Bar & Controls */}
      <FilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cities={availableCities}
        totalFilteredCount={filteredLeads.length}
        unverifiedOnly={unverifiedOnly}
        setUnverifiedOnly={setUnverifiedOnly}
      />

      {/* 4. Leads List Main View */}
      <main className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        {loading ? (
          <div className="rounded-2xl border border-[#1b2b28] bg-[#0d1716] p-12 text-center text-[#8ba39d]">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#35d4b8] mb-2" />
            <p className="text-xs">Connecting to Genesis Enterprise Lead Database...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1f322f] bg-[#0c1615] p-12 text-center text-[#8ba39d]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#142623] text-[#35d4b8] mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No leads match this view</h3>
            <p className="text-xs mt-1 max-w-md mx-auto text-[#718b85]">
              Generate genuine buyer leads from LinkedIn, IndiaMART, and Google Maps, or clear the applied filters.
            </p>
            <button
              onClick={() => setShowLeadGenModal(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#35d4b8] to-[#2cbfa6] px-4 py-2 text-xs font-extrabold text-[#05251e] shadow hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              <span>Auto Generate Leads Now</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                currentUser={currentUser}
                onUpdateLead={handleUpdateLead}
                onAcquireLock={handleAcquireLock}
                onReleaseLock={handleReleaseLock}
                onExtendLock={handleExtendLock}
                onReverify={handleReverify}
                onOpenScript={(l) => setScriptModalLead(l)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AutoLeadGenModal
        isOpen={showLeadGenModal}
        onClose={() => setShowLeadGenModal(false)}
        onGenerated={(newLeads) => {
          fetchLeads();
          fetchLogs();
          showToast(`⚡ ${newLeads.length} leads generated & verified!`);
        }}
      />

      <LeadLockDeskModal
        isOpen={showLockDeskModal}
        onClose={() => setShowLockDeskModal(false)}
        leads={leads}
        currentUser={currentUser}
        onReleaseLock={handleReleaseLock}
        onExtendLock={handleExtendLock}
      />

      <ActivityLogModal
        isOpen={showActivityLogModal}
        onClose={() => setShowActivityLogModal(false)}
        logs={activityLogs}
      />

      <TeamDeskModal
        isOpen={showTeamDeskModal}
        onClose={() => setShowTeamDeskModal(false)}
        leads={leads}
        currentUser={currentUser}
        onAutoDistribute={handleAutoDistribute}
      />

      <ScriptModal
        isOpen={!!scriptModalLead}
        onClose={() => setScriptModalLead(null)}
        lead={scriptModalLead}
        currentUser={currentUser}
      />
    </div>
  );
}
