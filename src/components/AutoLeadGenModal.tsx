import React, { useState } from 'react';
import { LeadCategory, LeadSource, AutoGenRequest, LeadRecord } from '../types/crm';
import { Sparkles, X, CheckCircle2, ShieldCheck, RefreshCw, Layers, MapPin, Globe } from 'lucide-react';

interface AutoLeadGenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (newLeads: LeadRecord[]) => void;
}

export const AutoLeadGenModal: React.FC<AutoLeadGenModalProps> = ({
  isOpen,
  onClose,
  onGenerated,
}) => {
  const [source, setSource] = useState<LeadSource | 'all'>('all');
  const [category, setCategory] = useState<LeadCategory | 'All'>('All');
  const [city, setCity] = useState<string>('Mumbai & MMR');
  const [targetCount, setTargetCount] = useState<number>(8);
  const [customKeyword, setCustomKeyword] = useState<string>('');
  const [autoAssign, setAutoAssign] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [previewLeads, setPreviewLeads] = useState<LeadRecord[] | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg('');
    setPreviewLeads(null);

    const payload: AutoGenRequest = {
      source,
      category,
      city,
      targetCount,
      customKeyword: customKeyword.trim() || undefined,
      autoAssign,
    };

    try {
      const response = await fetch('/api/leads/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to auto-generate leads');
      }

      setPreviewLeads(data.leads || []);
      onGenerated(data.leads || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred during automated lead extraction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2b4540] bg-[#0c1615] p-5 sm:p-6 shadow-2xl text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b2b28] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#35d4b8] to-[#124239] text-[#06231d]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                Auto Lead Generation Engine
                <span className="rounded-full bg-[#183933] border border-[#23584e] px-2 py-0.2 text-[10px] font-bold text-[#35d4b8]">
                  AI Powered
                </span>
              </h3>
              <p className="text-xs text-[#8ba39d]">
                Auto-discover real verified commercial leads from LinkedIn, IndiaMART &amp; Google Maps
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

        {/* Configuration Body */}
        {!previewLeads ? (
          <div className="space-y-4">
            {/* 1. Target Channel Selection */}
            <div>
              <label className="text-xs font-bold text-[#35d4b8] block mb-1.5">
                1. Select Auto-Ingestion Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Channels', sub: 'Cross-platform search' },
                  { id: 'linkedin', label: 'LinkedIn', sub: 'Decision makers & CTOs' },
                  { id: 'indiamart', label: 'IndiaMART', sub: 'Active buyer RFQs' },
                  { id: 'google_maps', label: 'Google Maps', sub: 'Commercial places' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSource(s.id as any)}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      source === s.id
                        ? 'border-[#35d4b8] bg-[#14322c] text-white shadow-sm ring-1 ring-[#35d4b8]/30'
                        : 'border-[#1b2b28] bg-[#091110] text-[#8ba39d] hover:border-[#2b4540] hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{s.label}</div>
                    <div className="text-[10px] text-[#718b85] mt-0.5">{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Category & Product Line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#35d4b8] block mb-1.5">
                  2. Business Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-[#1b2b28] bg-[#091110] px-3 py-2 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
                >
                  <option value="All">All Categories (Mixed Portfolio)</option>
                  <option value="IT Hardware">IT Hardware (Laptops, Desktops, Servers, Workstations)</option>
                  <option value="Design software">Design Software (Autodesk, Adobe, V-Ray, Lumion)</option>
                  <option value="Networking & CCTV">Networking &amp; CCTV (Switches, Cabling, 4K Cameras)</option>
                  <option value="Security">Security &amp; Firewall (Sophos, Fortinet, M365, Antivirus)</option>
                </select>
              </div>

              {/* 3. Target City / Region */}
              <div>
                <label className="text-xs font-bold text-[#35d4b8] block mb-1.5">
                  3. Target City / Region
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-[#1b2b28] bg-[#091110] px-3 py-2 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
                >
                  <option value="Mumbai & MMR">Mumbai &amp; Mumbai Metropolitan Region</option>
                  <option value="Navi Mumbai">Navi Mumbai (Vashi, Belapur, Panvel, Kharghar)</option>
                  <option value="Thane">Thane &amp; Ghodbunder Industrial Hub</option>
                  <option value="Pune">Pune (Hinjewadi, Baner, Wakad, Bhosari)</option>
                  <option value="Bengaluru">Bengaluru (Whitefield, Koramangala, Electronic City)</option>
                  <option value="Delhi NCR">Delhi NCR (Gurgaon, Noida, Okhla)</option>
                  <option value="Ahmedabad">Ahmedabad &amp; Surat (Gujarat Tech &amp; CA Belt)</option>
                </select>
              </div>
            </div>

            {/* 4. Requirement Search Keywords */}
            <div>
              <label className="text-xs font-bold text-[#35d4b8] block mb-1.5">
                4. Requirement Focus &amp; Keywords (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Colleges needing computer lab refresh, Architects upgrading Revit 3D, Hospitals wanting CCTV"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                className="w-full rounded-xl border border-[#1b2b28] bg-[#091110] px-3 py-2 text-xs text-white placeholder-[#58726e] focus:border-[#35d4b8] focus:outline-none"
              />
            </div>

            {/* 5. Count & Auto-Assignment */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#08100f] border border-[#1b2b28] p-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#8ba39d]">Leads to Generate:</span>
                <div className="flex items-center gap-1.5">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTargetCount(num)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                        targetCount === num
                          ? 'bg-[#35d4b8] text-black shadow'
                          : 'bg-[#12221f] text-[#8ba39d] hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAssign}
                  onChange={(e) => setAutoAssign(e.target.checked)}
                  className="rounded border-[#2b4540] text-[#35d4b8] focus:ring-0"
                />
                <span className="text-white font-medium">
                  Auto-Distribute across 25 Sales Reps (Round-Robin)
                </span>
              </label>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="rounded-xl border border-red-500/40 bg-red-950/60 p-3 text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#1f322f] px-4 py-2 text-xs font-semibold text-[#8ba39d] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleGenerate}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#35d4b8] to-[#25a38c] px-5 py-2.5 text-xs sm:text-sm font-extrabold text-[#05251e] shadow-lg shadow-[#35d4b8]/20 hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Extracting &amp; Verifying Contacts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate &amp; Verify Leads</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success & Preview View */
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-[#143d34] border border-[#35d4b8]/40 p-3 text-xs text-[#a7f3e6]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#35d4b8]" />
                <span>
                  Successfully generated and verified <strong>{previewLeads.length} genuine leads</strong>!
                  Added to active calling desk.
                </span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {previewLeads.map((l) => (
                <div
                  key={l.id}
                  className="rounded-xl border border-[#1b2b28] bg-[#08100f] p-3 text-xs flex items-start justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {l.n}
                      <span className="rounded bg-[#122824] text-[#35d4b8] px-1.5 py-0.2 text-[10px]">
                        {l.c}
                      </span>
                    </div>
                    <div className="text-[#8ba39d] text-[11px] mt-0.5">
                      {l.cn && <span>Contact: <strong>{l.cn}</strong> ({l.cnDesignation}) • </span>}
                      <span>{l.p}</span> • <span>{l.city}</span>
                    </div>
                    <div className="text-gray-300 text-[11px] mt-1 italic">
                      "{l.requirements}"
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 font-bold text-[10px]">
                      {l.verification.overallAccuracyScore}% Verified
                    </span>
                    {l.assignedToUserName && (
                      <div className="text-[10px] text-[#35d4b8] mt-1">
                        → {l.assignedToUserName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewLeads(null)}
                className="rounded-xl border border-[#1f322f] px-4 py-2 text-xs font-semibold text-[#8ba39d] hover:text-white"
              >
                Generate Another Batch
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#35d4b8] text-black font-extrabold px-5 py-2 text-xs hover:brightness-110"
              >
                Open in Calling Desk
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
