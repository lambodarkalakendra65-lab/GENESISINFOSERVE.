import React, { useState } from 'react';
import { LeadRecord, UserProfile } from '../types/crm';
import { generateScript } from '../utils/pitchScripts';
import { FileText, X, Copy, Check, MessageSquare } from 'lucide-react';

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadRecord | null;
  currentUser: UserProfile;
}

export const ScriptModal: React.FC<ScriptModalProps> = ({
  isOpen,
  onClose,
  lead,
  currentUser,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen || !lead) return null;

  const script = generateScript(lead, currentUser);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#2b4540] bg-[#0c1615] p-5 sm:p-6 shadow-2xl text-white my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b2b28] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-black">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                Calling Pitch Script: {lead.n}
              </h3>
              <p className="text-xs text-[#8ba39d]">
                Category: <strong>{lead.c}</strong> • Representative: <strong>{currentUser.name}</strong>
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

        {/* Script Content */}
        <div className="space-y-3.5 text-xs">
          {/* 1. Opening Pitch */}
          <div className="rounded-xl border border-[#1b2b28] bg-[#08100f] p-3.5">
            <div className="flex items-center justify-between text-[#35d4b8] font-bold text-xs mb-1.5">
              <span>1. OPENING LINE (First 15 Seconds)</span>
              <button
                onClick={() => copyToClipboard(script.opening, 'open')}
                className="text-[11px] text-[#8ba39d] hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'open' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSection === 'open' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-gray-200 leading-relaxed italic">
              "{script.opening}"
            </p>
          </div>

          {/* 2. Qualifying Sawaal */}
          <div className="rounded-xl border border-[#1b2b28] bg-[#08100f] p-3.5">
            <div className="flex items-center justify-between text-amber-400 font-bold text-xs mb-1.5">
              <span>2. QUALIFYING QUESTIONS (Requirement Discovery)</span>
              <button
                onClick={() => copyToClipboard(script.questions, 'ask')}
                className="text-[11px] text-[#8ba39d] hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'ask' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSection === 'ask' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-gray-200 leading-relaxed italic">
              "{script.questions}"
            </p>
          </div>

          {/* 3. Value Proposition */}
          <div className="rounded-xl border border-[#1b2b28] bg-[#08100f] p-3.5">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-xs mb-1.5">
              <span>3. VALUE PROPOSITION (Genesis Advantage)</span>
              <button
                onClick={() => copyToClipboard(script.valueProp, 'val')}
                className="text-[11px] text-[#8ba39d] hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'val' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSection === 'val' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-gray-200 leading-relaxed">
              {script.valueProp}
            </p>
          </div>

          {/* 4. Closing Action */}
          <div className="rounded-xl border border-[#1b2b28] bg-[#08100f] p-3.5">
            <div className="flex items-center justify-between text-emerald-400 font-bold text-xs mb-1.5">
              <span>4. CLOSING STATEMENT (Quote / Meeting Commitment)</span>
              <button
                onClick={() => copyToClipboard(script.closing, 'close')}
                className="text-[11px] text-[#8ba39d] hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'close' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedSection === 'close' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-gray-200 leading-relaxed italic">
              "{script.closing}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end border-t border-[#1b2b28] pt-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-[#35d4b8] text-black font-extrabold px-5 py-2 text-xs hover:brightness-110"
          >
            Start Call Now
          </button>
        </div>
      </div>
    </div>
  );
};
