export type UserRole = 'super_admin' | 'employee';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  territory: string;
  targetCalls: number;
  avatarColor: string;
}

export type LeadCategory = 
  | 'IT Hardware'
  | 'Networking & CCTV'
  | 'Design software'
  | 'Security';

export type LeadSource = 'linkedin' | 'indiamart' | 'google_maps' | 'direct_import';

export interface ContactVerification {
  phoneVerified: boolean;
  phoneType: 'mobile' | 'landline' | 'direct';
  telecomCircle: string;
  whatsappActive: boolean;
  dndStatus: 'active' | 'exempt_b2b' | 'unknown';
  
  emailVerified: boolean;
  emailConfidence: number; // 0 - 100
  emailType: 'corporate' | 'public' | 'missing';
  mxRecordValid: boolean;
  
  gstin?: string;
  gstStatus?: 'verified' | 'unverified' | 'exempt';
  legalEntityName?: string;
  
  overallAccuracyScore: number; // 0 - 100
  verifiedAt: string;
}

export interface LeadLock {
  leadId: number;
  lockedByUserId: string;
  lockedByUserName: string;
  lockedAt: string;
  expiresAt: string; // ISO timestamp (15 min default)
}

export type CallResult = 'uthaya' | 'busy' | 'no' | 'wrong';
export type NextStep = 'interest' | 'quote' | 'demo' | 'won';

export interface LeadRecord {
  id: number;
  n: string; // Company / Institution Name
  a: string; // Area / Locality
  city: string;
  t: string; // Type (e.g., Engineering College, Architect Studio, Hospital, CA firm)
  p: string; // Primary phone
  p2?: string[]; // Alternate numbers
  c: LeadCategory;
  source: LeadSource;
  sourceUrl?: string;
  requirements?: string; // IndiaMART RFQ or LinkedIn requirement note
  budgetEst?: string;
  
  // Verification
  verification: ContactVerification;
  
  // User Assignment & Lock
  assignedToUserId?: string; // One of 25 employees or admin
  assignedToUserName?: string;
  lock?: LeadLock;
  
  // CRM Outreach State
  res?: CallResult | '';
  next?: NextStep | '';
  day?: string; // Day of last call
  note?: string;
  email?: string;
  cn?: string; // Contact person name / Decision Maker
  cnDesignation?: string; // e.g. IT Director, Principal, Purchase Head
  fu?: string; // Follow-up datetime ISO
  dp?: string[]; // Default products
  pr?: string[]; // Tagged products of interest
  qs?: string; // Quote software/hardware
  qu?: string; // Quote units
  qa?: string; // Quote amount
  mailsSentCount?: number;
  lastUpdated?: string;
  updatedBy?: string;
}

export type ActionType = 
  | 'LEAD_CREATED'
  | 'AUTO_GENERATED'
  | 'LOCK_ACQUIRED'
  | 'LOCK_EXTENDED'
  | 'LOCK_RELEASED'
  | 'LOCK_FORCE_UNLOCKED'
  | 'LEAD_ASSIGNED'
  | 'ROUND_ROBIN_DISTRIBUTED'
  | 'CALL_LOGGED'
  | 'STATUS_CHANGED'
  | 'NOTE_UPDATED'
  | 'EMAIL_SENT'
  | 'WHATSAPP_CLICKED'
  | 'VERIFICATION_EXECUTED'
  | 'EXPORT_DATA';

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: ActionType;
  leadId?: number;
  leadName?: string;
  details: string;
}

export interface AutoGenRequest {
  source: LeadSource | 'all';
  category: LeadCategory | 'All';
  city: string;
  targetCount: number;
  customKeyword?: string;
  autoAssign: boolean;
}
