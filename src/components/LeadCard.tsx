import React, { useState, useEffect } from 'react';
import { LeadRecord, UserProfile, CallResult, NextStep } from '../types/crm';
import { TEAM_MEMBERS } from '../data/team';
import { ALL_PRODUCTS, PRODUCT_GROUPS, PRODUCT_GROUP_LABELS } from '../data/products';
import { generateScript, generateEmailContent } from '../utils/pitchScripts';
import { cleanDigits, isIndianMobile } from '../utils/verification';
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  Mail,
  FileText,
  Clock,
  Calendar,
  ChevronDown,
  Building,
  User,
  MapPin,
  ExternalLink,
  RefreshCw,
  Download,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';

interface LeadCardProps {
  lead: LeadRecord;
  currentUser: UserProfile;
  onUpdateLead: (id: number, updates: Partial<LeadRecord>) => void;
  onAcquireLock: (leadId: number) => void;
  onReleaseLock: (leadId: number) => void;
  onExtendLock: (leadId: number) => void;
  onReverify: (leadId: number) => void;
  onOpenScript: (lead: LeadRecord) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  currentUser,
  onUpdateLead,
  onAcquireLock,
  onReleaseLock,
  onExtendLock,
  onReverify,
  onOpenScript,
}) => {
  const [showProducts, setShowProducts] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [countdown, setCountdown] = useState<string>('');
  const [isLockExpired, setIsLockExpired] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const isSuperAdmin = currentUser.role === 'super_admin';
  const hasLock = !!lead.lock;
  const isLockedByMe = hasLock && lead.lock?.lockedByUserId === currentUser.id;
  const isLockedByOther = hasLock && lead.lock?.lockedByUserId !== currentUser.id;

  // Live timer for lock countdown
  useEffect(() => {
    if (!lead.lock) {
      setCountdown('');
      setIsLockExpired(false);
      return;
    }

    const updateTimer = () => {
      const expTime = new Date(lead.lock!.expiresAt).getTime();
      const diff = expTime - Date.now();

      if (diff <= 0) {
        setCountdown('Expired');
        setIsLockExpired(true);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setCountdown(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        setIsLockExpired(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [lead.lock]);

  // Lead initials for avatar
  const initials = lead.n
    .split(' ')
    .filter((w) => /[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'GL';

  // Hue calculation for visual branding
  let hue = 160;
  for (let i = 0; i < lead.n.length; i++) {
    hue = (hue * 31 + lead.n.charCodeAt(i)) % 360;
  }

  // Pre-generate pitch & email content
  const scriptContent = generateScript(lead, currentUser);
  const emailContent = generateEmailContent(lead, currentUser);

  // Phone helpers
  const primaryPhone = lead.p || '';
  const digits = cleanDigits(primaryPhone);
  const isMob = isIndianMobile(primaryPhone);
  const telHref = `tel:+${digits}`;
  const whatsappHref = `https://wa.me/${digits.startsWith('91') ? digits : '91' + digits}?text=${encodeURIComponent(
    scriptContent.whatsappMessage
  )}`;

  // Email helper links
  const mailtoHref = `mailto:${encodeURIComponent(lead.email || '')}?subject=${encodeURIComponent(
    emailContent.subject
  )}&body=${encodeURIComponent(emailContent.bodyText)}`;
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    lead.email || ''
  )}&su=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.bodyText)}`;
  const outlookHref = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(
    lead.email || ''
  )}&subject=${encodeURIComponent(emailContent.subject)}&body=${encodeURIComponent(emailContent.bodyText)}`;

  // Handle call outcome
  const handleSetCallResult = (res: CallResult) => {
    const isNew = lead.res !== res;
    onUpdateLead(lead.id, {
      res: isNew ? res : '',
      day: isNew ? new Date().toDateString() : '',
    });
  };

  const handleSetNextStep = (next: NextStep) => {
    const isNew = lead.next !== next;
    onUpdateLead(lead.id, {
      next: isNew ? next : '',
    });
  };

  // Toggle product interest
  const handleToggleProduct = (productName: string) => {
    const current = lead.pr || lead.dp || [];
    const updated = current.includes(productName)
      ? current.filter((p) => p !== productName)
      : [...current, productName];
    onUpdateLead(lead.id, { pr: updated });
  };

  // Re-verify trigger
  const handleTriggerReverify = () => {
    setVerifying(true);
    onReverify(lead.id);
    setTimeout(() => setVerifying(false), 700);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    if (!lead.fu) return '';
    const dateObj = new Date(lead.fu);
    if (isNaN(dateObj.getTime())) return '';
    const startStr = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endStr = new Date(dateObj.getTime() + 15 * 60000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Call: ${lead.n}`
    )}&dates=${startStr}/${endStr}&details=${encodeURIComponent(
      `Calling: ${lead.cn || lead.n} at ${lead.p}\nNotes: ${lead.note || ''}`
    )}`;
  };

  return (
    <section
      data-lead-id={lead.id}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isLockedByOther
          ? 'border-red-900/60 bg-[#140e0e]/95 opacity-85 shadow-lg'
          : isLockedByMe
          ? 'border-[#35d4b8] bg-[#0c1a17] shadow-xl shadow-[#35d4b8]/10 ring-1 ring-[#35d4b8]/40'
          : 'border-[#1b2b28] bg-[#101c1a]/90 hover:border-[#2b4540] hover:shadow-lg'
      } p-4 sm:p-5 mb-4`}
    >
      {/* 1. Realtime Lead Lock Banner / Warning */}
      {isLockedByOther && (
        <div className="mb-3.5 flex items-center justify-between rounded-xl bg-red-950/80 border border-red-500/40 px-3.5 py-2 text-xs text-red-200 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-red-400 shrink-0" />
            <span>
              <strong>🔒 Lead Locked by {lead.lock?.lockedByUserName}:</strong> Outreach in
              progress (Timer: <strong>{countdown}</strong>). Duplicate calling blocked.
            </span>
          </div>
          {isSuperAdmin && (
            <button
              onClick={() => onReleaseLock(lead.id)}
              className="rounded-lg bg-red-800/80 hover:bg-red-700 px-2.5 py-1 text-[11px] font-bold text-white shrink-0 ml-2"
            >
              Force Unlock
            </button>
          )}
        </div>
      )}

      {isLockedByMe && (
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#143d34] border border-[#35d4b8]/50 px-3.5 py-2 text-xs text-[#a2f5e7]">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-[#35d4b8] shrink-0" />
            <span>
              <strong>🔒 Lead Locked to You:</strong> Exclusive outreach active (
              <span className="font-mono font-bold text-white text-sm">{countdown}</span> remaining)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExtendLock(lead.id)}
              className="rounded-lg bg-[#1f564b] hover:bg-[#286f61] px-2.5 py-1 text-[11px] font-bold text-white transition-colors"
            >
              +15m Extend
            </button>
            <button
              onClick={() => onReleaseLock(lead.id)}
              className="rounded-lg bg-[#0a231e] hover:bg-[#071a16] border border-[#35d4b8]/40 px-2.5 py-1 text-[11px] font-bold text-[#7fe8d6] transition-colors"
            >
              Release Lock
            </button>
          </div>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar Icon */}
          <div
            style={{
              background: `linear-gradient(135deg, hsl(${hue}, 60%, 25%), hsl(${hue}, 50%, 15%))`,
              borderColor: `hsl(${hue}, 60%, 40%)`,
            }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-sm font-black text-white shadow-md"
          >
            {initials}
          </div>

          {/* Company Title & Meta */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate max-w-md">
                {lead.n}
              </h2>
              {/* Category Pill */}
              <span className="rounded-md bg-[#13302b] border border-[#1d4d44] px-2 py-0.5 text-[10px] font-bold text-[#35d4b8]">
                {lead.c}
              </span>

              {/* Source Badge */}
              {lead.source === 'linkedin' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-950/70 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  LinkedIn Sales Nav
                </span>
              )}
              {lead.source === 'indiamart' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  IndiaMART Verified RFQ
                </span>
              )}
              {lead.source === 'google_maps' && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Google Maps Place
                </span>
              )}
            </div>

            <p className="text-xs text-[#8ba39d] mt-1 flex flex-wrap items-center gap-1.5">
              <span>{lead.a}</span>
              <span>•</span>
              <span className="font-semibold text-gray-300">{lead.city}</span>
              <span>•</span>
              <span>{lead.t}</span>
              {lead.assignedToUserName && (
                <>
                  <span>•</span>
                  <span className="text-[#35d4b8] font-medium">
                    Assigned: {lead.assignedToUserName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Lock & Claim Button on Top Right */}
        <div className="flex items-center gap-2">
          {!hasLock && (
            <button
              onClick={() => onAcquireLock(lead.id)}
              className="flex items-center gap-1.5 rounded-xl border border-[#35d4b8]/50 bg-[#14322c] hover:bg-[#1a4038] px-3 py-1.5 text-xs font-bold text-[#35d4b8] transition-all active:scale-95 shadow-sm"
              title="Lock lead exclusively for 15 minutes to prevent duplicate outreach"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Claim &amp; Lock (15m)</span>
            </button>
          )}

          {/* Super Admin Reassignment Selector */}
          {isSuperAdmin && (
            <div className="flex items-center gap-1 text-xs text-[#8ba39d]">
              <select
                value={lead.assignedToUserId || ''}
                onChange={(e) => {
                  const targetEmp = TEAM_MEMBERS.find((m) => m.id === e.target.value);
                  onUpdateLead(lead.id, {
                    assignedToUserId: targetEmp ? targetEmp.id : undefined,
                    assignedToUserName: targetEmp ? targetEmp.name : undefined,
                  });
                }}
                className="rounded-lg border border-[#233532] bg-[#0c1615] px-2 py-1 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
              >
                <option value="">Unassigned Pool</option>
                {TEAM_MEMBERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.role === 'super_admin' ? `★ ${u.name} (Admin)` : u.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 2. Contact Verification & Accuracy Row */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#0a1413] border border-[#1b2b28] px-3 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Accuracy Score */}
          <div
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-bold text-[11px] ${
              lead.verification?.overallAccuracyScore >= 85
                ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{lead.verification?.overallAccuracyScore || 85}% Accuracy</span>
          </div>

          {/* Telecom Circle & Phone Badge */}
          <span className="text-[#8ba39d]">
            {lead.verification?.telecomCircle || 'Mumbai & Maharashtra Metro'}
          </span>

          {lead.verification?.whatsappActive && (
            <span className="inline-flex items-center gap-0.5 text-emerald-400 font-medium">
              <CheckCircle className="h-3 w-3" /> WA Verified
            </span>
          )}

          {/* GST Status */}
          {lead.verification?.gstin && (
            <span className="hidden sm:inline-block rounded bg-[#10201d] px-1.5 py-0.5 text-[10px] font-mono text-gray-300 border border-[#1b2b28]">
              GST: {lead.verification.gstin}
            </span>
          )}
        </div>

        {/* Re-verify Button */}
        <button
          onClick={handleTriggerReverify}
          disabled={verifying}
          className="flex items-center gap-1 text-[11px] text-[#35d4b8] hover:text-[#7ee8d6] transition-colors"
          title="Perform real-time contact details verification"
        >
          <RefreshCw className={`h-3 w-3 ${verifying ? 'animate-spin' : ''}`} />
          <span>{verifying ? 'Verifying...' : 'Re-verify'}</span>
        </button>
      </div>

      {/* 3. Decision Maker & Requirements Highlight */}
      <div className="mt-3 rounded-xl bg-[#0e1917] border border-[#1d2d2a] p-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b2b28] pb-2 mb-2">
          <div className="flex items-center gap-2 text-white font-medium">
            <User className="h-3.5 w-3.5 text-[#35d4b8]" />
            <span>
              Decision Maker: <strong className="text-[#e2f7f3]">{lead.cn || 'Management / IT Head'}</strong>
            </span>
            {lead.cnDesignation && (
              <span className="text-[#8ba39d]">({lead.cnDesignation})</span>
            )}
          </div>
          {lead.budgetEst && (
            <div className="text-amber-300 font-bold">
              Est. Budget: {lead.budgetEst}
            </div>
          )}
        </div>
        <div className="text-[#b4c9c4] text-xs leading-relaxed">
          <strong>Identified Need:</strong> {lead.requirements || 'Commercial IT equipment procurement & software licensing upgrade requirements.'}
        </div>
      </div>

      {/* 4. Action Bar (Direct Call, WhatsApp, Email, Script, Excel) */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        {/* Primary Phone Call */}
        <a
          href={isLockedByOther ? undefined : telHref}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition-all ${
            isLockedByOther
              ? 'bg-[#1b2725] text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#35d4b8] to-[#25a38c] text-[#03231b] shadow-md shadow-[#35d4b8]/20 hover:brightness-110 active:scale-95'
          }`}
          title={isLockedByOther ? 'Locked by another representative' : 'Call Primary Contact'}
        >
          <Phone className="h-4 w-4" />
          <span>{primaryPhone}</span>
        </a>

        {/* WhatsApp Button */}
        {isMob && (
          <a
            href={isLockedByOther ? undefined : whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
              isLockedByOther
                ? 'border-gray-800 bg-[#121918] text-gray-600 cursor-not-allowed'
                : 'border-emerald-600/50 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40 active:scale-95'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        )}

        {/* Email Deep Links */}
        <div className="relative inline-block">
          <a
            href={isLockedByOther ? undefined : gmailHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              isLockedByOther
                ? 'border-gray-800 bg-[#121918] text-gray-600 cursor-not-allowed'
                : 'border-[#1f322f] bg-[#12221f] text-white hover:border-[#35d4b8]/50 active:scale-95'
            }`}
            title="Open pre-drafted email in Gmail with Genesis branding"
          >
            <Mail className="h-3.5 w-3.5 text-[#35d4b8]" />
            <span>Gmail</span>
          </a>
        </div>

        <a
          href={isLockedByOther ? undefined : outlookHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
            isLockedByOther
              ? 'border-gray-800 bg-[#121918] text-gray-600 cursor-not-allowed'
              : 'border-[#1f322f] bg-[#12221f] text-white hover:border-[#35d4b8]/50 active:scale-95'
          }`}
          title="Open pre-drafted email in Outlook"
        >
          <Mail className="h-3.5 w-3.5 text-blue-400" />
          <span>Outlook</span>
        </a>

        {/* Sales Pitch Script Helper */}
        <button
          onClick={() => onOpenScript(lead)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#1f322f] bg-[#12221f] px-3 py-2 text-xs font-semibold text-amber-300 hover:border-amber-400/50 transition-all active:scale-95"
          title="View customized cold-calling pitch script"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Pitch Script</span>
        </button>

        {/* Alternate Phones if any */}
        {lead.p2 && lead.p2.length > 0 && (
          <div className="flex items-center gap-1">
            {lead.p2.map((alt, idx) => (
              <a
                key={idx}
                href={isLockedByOther ? undefined : `tel:+${cleanDigits(alt)}`}
                className="rounded-lg border border-[#1f322f] bg-[#0c1615] px-2.5 py-1.5 text-xs text-[#8ba39d] hover:text-white"
              >
                Alt: {alt}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* 5. Contact Details & Follow-up Drawer */}
      <div className="mt-3.5 border-t border-[#1b2b28] pt-3">
        <details
          open={showContactDetails}
          onToggle={(e: any) => setShowContactDetails(e.target.open)}
          className="group"
        >
          <summary className="flex items-center justify-between text-xs font-semibold text-[#8ba39d] hover:text-white cursor-pointer list-none py-1">
            <span className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-[#35d4b8]" />
              <span>Contact details &amp; Follow-up scheduling</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Email Field */}
            <div>
              <label className="text-[11px] font-medium text-[#8ba39d] block mb-1">
                Corporate Email Address
              </label>
              <input
                type="email"
                disabled={isLockedByOther}
                value={lead.email || ''}
                onChange={(e) => onUpdateLead(lead.id, { email: e.target.value })}
                placeholder="e.g. ithead@company.com"
                className="w-full rounded-lg border border-[#1f322f] bg-[#08100f] px-2.5 py-1.5 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="text-[11px] font-medium text-[#8ba39d] block mb-1">
                Decision Maker / Contact Person
              </label>
              <input
                type="text"
                disabled={isLockedByOther}
                value={lead.cn || ''}
                onChange={(e) => onUpdateLead(lead.id, { cn: e.target.value })}
                placeholder="e.g. Mr. Shah / Dr. Kulkarni"
                className="w-full rounded-lg border border-[#1f322f] bg-[#08100f] px-2.5 py-1.5 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
              />
            </div>

            {/* Follow-up Datetime */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-[#8ba39d]">
                  Follow-up Date &amp; Time
                </label>
                {lead.fu && (
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[#35d4b8] hover:underline flex items-center gap-0.5"
                  >
                    <Calendar className="h-2.5 w-2.5" /> G-Calendar
                  </a>
                )}
              </div>
              <input
                type="datetime-local"
                disabled={isLockedByOther}
                value={lead.fu || ''}
                onChange={(e) => onUpdateLead(lead.id, { fu: e.target.value })}
                className="w-full rounded-lg border border-[#1f322f] bg-[#08100f] px-2.5 py-1.5 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
              />
            </div>
          </div>
        </details>
      </div>

      {/* 6. Call Result & Next Step Matrices */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-[#1b2b28] pt-3.5">
        {/* Call Result */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8ba39d] mb-1.5">
            📞 Call Result
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'uthaya' as CallResult, label: 'Uthaya nahi', color: 'border-gray-600 hover:border-gray-400' },
              { id: 'busy' as CallResult, label: 'Busy, baad mein', color: 'border-amber-600 hover:border-amber-400 text-amber-300' },
              { id: 'no' as CallResult, label: 'Interested nahi', color: 'border-red-600 hover:border-red-400 text-red-300' },
              { id: 'wrong' as CallResult, label: 'Galat number', color: 'border-rose-800 hover:border-rose-600 text-rose-400' },
            ].map((item) => {
              const isSelected = lead.res === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isLockedByOther}
                  onClick={() => handleSetCallResult(item.id)}
                  className={`rounded-xl border py-2 px-1 text-center text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-white text-black border-white shadow-md'
                      : `bg-[#0c1615] text-[#b3c7c2] ${item.color}`
                  } ${isLockedByOther ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                >
                  {isSelected && '✓ '}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Step */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#8ba39d] mb-1.5">
            ➡ Aage ka Step
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'interest' as NextStep, label: 'Interested hai', color: 'border-emerald-600 text-emerald-300' },
              { id: 'quote' as NextStep, label: 'Quote bheja', color: 'border-blue-600 text-blue-300' },
              { id: 'demo' as NextStep, label: 'Demo / meeting', color: 'border-cyan-600 text-cyan-300' },
              { id: 'won' as NextStep, label: 'Deal ho gayi', color: 'border-[#35d4b8] text-[#35d4b8]' },
            ].map((item) => {
              const isSelected = lead.next === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isLockedByOther}
                  onClick={() => handleSetNextStep(item.id)}
                  className={`rounded-xl border py-2 px-1 text-center text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#35d4b8] to-[#209f87] text-[#02221b] border-transparent font-bold shadow-md'
                      : `bg-[#0c1615] ${item.color}`
                  } ${isLockedByOther ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                >
                  {isSelected && '✓ '}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quote Value Inputs (shows when quote/demo/won is chosen) */}
      {['quote', 'demo', 'won'].includes(lead.next || '') && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl bg-[#091513] border border-[#23433c] p-3 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#35d4b8] block mb-1">
              Quoted Hardware / Software
            </label>
            <input
              type="text"
              disabled={isLockedByOther}
              placeholder="e.g. 50x HP Z-Book + Autodesk AEC"
              value={lead.qs || ''}
              onChange={(e) => onUpdateLead(lead.id, { qs: e.target.value })}
              className="w-full rounded-lg border border-[#1f322f] bg-[#0c1615] px-2.5 py-1 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#35d4b8] block mb-1">
              Total Units / Seats
            </label>
            <input
              type="text"
              disabled={isLockedByOther}
              placeholder="e.g. 50"
              value={lead.qu || ''}
              onChange={(e) => onUpdateLead(lead.id, { qu: e.target.value })}
              className="w-full rounded-lg border border-[#1f322f] bg-[#0c1615] px-2.5 py-1 text-xs text-white focus:border-[#35d4b8] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#35d4b8] block mb-1">
              Quoted Amount (₹ INR)
            </label>
            <input
              type="text"
              disabled={isLockedByOther}
              placeholder="e.g. 35,00,000"
              value={lead.qa || ''}
              onChange={(e) => onUpdateLead(lead.id, { qa: e.target.value })}
              className="w-full rounded-lg border border-[#1f322f] bg-[#0c1615] px-2.5 py-1 text-xs text-white font-bold text-emerald-400 focus:border-[#35d4b8] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 7. Product Interest Drawer */}
      <div className="mt-3">
        <details
          open={showProducts}
          onToggle={(e: any) => setShowProducts(e.target.open)}
          className="group rounded-xl border border-[#1b2b28] bg-[#0c1615] p-2.5"
        >
          <summary className="flex items-center justify-between text-xs font-semibold text-[#8ba39d] hover:text-white cursor-pointer list-none">
            <span className="flex items-center gap-1.5">
              <span>🏷 Product interest</span>
              {lead.pr && lead.pr.length > 0 && (
                <span className="rounded-full bg-[#183933] border border-[#255e54] px-2 py-0.2 text-[10px] font-bold text-[#35d4b8]">
                  {lead.pr.length} selected
                </span>
              )}
            </span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-3 space-y-3 pt-2 border-t border-[#182725]">
            {PRODUCT_GROUPS.map((group) => {
              const groupProducts = ALL_PRODUCTS.filter((p) => p.group === group);
              const tagged = lead.pr || lead.dp || [];
              return (
                <div key={group}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#5f7d77] mb-1.5">
                    {PRODUCT_GROUP_LABELS[group]}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {groupProducts.map((prod) => {
                      const isTagged = tagged.includes(prod.name);
                      return (
                        <button
                          key={prod.name}
                          disabled={isLockedByOther}
                          onClick={() => handleToggleProduct(prod.name)}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                            isTagged
                              ? 'bg-[#35d4b8] text-[#06231d] font-bold'
                              : 'bg-[#101e1c] text-[#8ba39d] border border-[#1f322f] hover:text-white hover:border-[#35d4b8]/40'
                          }`}
                        >
                          {isTagged && '✓ '}
                          {prod.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </details>
      </div>

      {/* 8. Notes Textarea */}
      <div className="mt-3">
        <textarea
          disabled={isLockedByOther}
          placeholder="Note: kisse baat hui, kya requirement hai, feedback..."
          value={lead.note || ''}
          onChange={(e) => onUpdateLead(lead.id, { note: e.target.value })}
          rows={2}
          className="w-full rounded-xl border border-[#1b2b28] bg-[#0c1615] p-2.5 text-xs text-white placeholder-[#516b66] focus:border-[#35d4b8] focus:outline-none transition-colors"
        />
      </div>

      {/* Footer Info */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5e7974]">
        <div>
          Source: <strong className="text-[#8ba39d]">{lead.source.toUpperCase()}</strong>
          {lead.lastUpdated && (
            <span>
              {' '}
              • Updated: {new Date(lead.lastUpdated).toLocaleDateString('en-IN')}
            </span>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${lead.n} ${lead.a} ${lead.city}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#35d4b8] flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          <span>Maps search</span>
        </a>
      </div>
    </section>
  );
};
