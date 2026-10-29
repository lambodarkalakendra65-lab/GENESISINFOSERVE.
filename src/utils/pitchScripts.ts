import { LeadRecord, UserProfile } from '../types/crm';

interface ScriptTemplate {
  tag: string;
  open: string;
  ask: string;
  value: string;
  close: string;
  waText: string;
}

export const VERTICAL_SCRIPTS: Record<string, ScriptTemplate> = {
  'Design software': {
    tag: 'Autodesk & CAD/BIM Reseller',
    open: 'Hum Autodesk (AutoCAD, Revit, 3ds Max), Adobe, Trimble SketchUp, Chaos V-Ray aur Lumion ke authorised Gold Partner solutions dete hain.',
    ask: 'Aap AutoCAD / Revit / 3ds Max kaun sa version use kar rahe hain? Kitne systems pe chal raha hai aur subscription kab renew honi hai?',
    value: 'Genuine software licence, renewal pe exclusive pricing, multi-seat team discount, cloud collaboration aur team software training.',
    close: 'Main aapko aapki team size ke hisaab se ek formal quotation bhej deta hoon. Kis email ya WhatsApp number par share karun?',
    waText: 'Namaste! Main Genesis Infoserve, Mumbai se. Hum Autodesk (AutoCAD/Revit/3ds Max), Adobe, V-Ray aur Lumion ke authorised licences aur renewals provide karte hain. Kya aapko upcoming renewals ya fresh seats ke liye quotation share karun?',
  },
  'Security': {
    tag: 'Firewall, Cyber Security & M365',
    open: 'Hum enterprise IT infrastructure, next-gen firewall (Fortinet/Sophos), endpoint encryption aur secure cloud backup ke solutions dete hain.',
    ask: 'Aapke office mein confidential client documents (tax, legal, accounts) kaise protect hote hain? DPDP Act compliance aur automatic cloud backup setup hai?',
    value: 'Ransomware protection, centralized endpoint security, DPDP compliance, Microsoft 365 licensing aur 4-hour SLA AMC support. Free security health check offer kar rahe hain.',
    close: 'Hum aapke office ke liye complimentary IT & Data Security audit arrange kar sakte hain. Kis date aur time pe technical team call kare?',
    waText: 'Namaste! Main Genesis Infoserve se. Hum corporate data protection, firewall appliances (Sophos/Fortinet) aur Microsoft 365 enterprise solutions provide karte hain. Kya aapke firm ke liye quick IT security review discuss kar sakte hain?',
  },
  'IT Hardware': {
    tag: 'Enterprise Laptops, Workstations & Servers',
    open: 'Hum HP, Dell aur Lenovo ke enterprise laptops, specialized CAD/BIM workstations, servers aur computer parts (RAM, SSD, GPU) bulk rate pe deliver karte hain.',
    ask: 'Aapke office / campus mein kitne workstations aur laptops chal rahe hain? Koi lab refresh ya naya batch purchase planned hai?',
    value: 'Tier-1 direct brand pricing, on-site warranty, pre-configured workstations with NVIDIA RTX GPUs, aur flexible AMC support.',
    close: 'Main aapke required specs ke according competitive pricing quote email kar deta hoon. Kitne units ki requirement consider kar rahe hain?',
    waText: 'Namaste! Main Genesis Infoserve se. Hum bulk enterprise laptops (Dell/HP/Lenovo), heavy-duty workstations aur server infrastructure direct supply karte hain, installation aur warranty ke sath. Kya aapko upcoming purchase ke liye quote share karun?',
  },
  'Networking & CCTV': {
    tag: 'Campus Wi-Fi, Structured Cabling & 4K CCTV',
    open: 'Hum campus-wide managed networking (Cisco/Aruba), structured Cat6A cabling, high-speed Wi-Fi access points aur 4K CCTV surveillance implement karte hain.',
    ask: 'Campus / office mein Wi-Fi speed aur coverage kaisa hai? CCTV recording kitne din ki retain hoti hai aur koi naya wing add ho raha hai?',
    value: 'Single-vendor turnkey execution: managed switches, PoE cabling, IP dome cameras, NVR with RAID backup aur free physical site survey.',
    close: 'Hamare network engineer site survey ke liye visit kar sakte hain. Is hafte kaun sa din convenient hoga?',
    waText: 'Namaste! Genesis Infoserve se. Hum campus Wi-Fi networking, enterprise switches aur high-definition CCTV surveillance systems deliver karte hain. Kya aapke premises ke liye free site survey plan karein?',
  },
};

export function generateScript(lead: LeadRecord, currentUser?: UserProfile): {
  opening: string;
  questions: string;
  valueProp: string;
  closing: string;
  whatsappMessage: string;
} {
  const repName = currentUser?.name || 'Mohnish Poojari';
  const tmpl = VERTICAL_SCRIPTS[lead.c] || VERTICAL_SCRIPTS['IT Hardware'];

  const opening = `Namaste, main ${repName} bol raha hoon Genesis Infoserve, Mumbai se. ${tmpl.open} Kya 2 minute aapke business IT requirements par baat ho sakti hai?`;
  const questions = tmpl.ask;
  const valueProp = tmpl.value;
  const closing = tmpl.close;
  const whatsappMessage = `Namaste ${lead.cn ? lead.cn : ''}, main ${repName} Genesis Infoserve se. ${tmpl.waText}`;

  return {
    opening,
    questions,
    valueProp,
    closing,
    whatsappMessage,
  };
}

export function generateEmailContent(lead: LeadRecord, currentUser?: UserProfile): {
  subject: string;
  bodyText: string;
  bodyHtml: string;
} {
  const repName = currentUser?.name || 'Mohnish Poojari';
  const repDesignation = currentUser?.designation || 'Sales Executive';
  const repPhone = currentUser?.phone || '+91 72492 95879';
  const repEmail = currentUser?.email || 'mohnish.p@genesisinfoserve.com';
  const recipient = lead.cn || 'Sir/Madam';

  const subject = `IT Infrastructure & Technology Solutions for ${lead.n} - Genesis Infoserve Pvt. Ltd.`;

  const bodyText = `Dear ${recipient},

Greetings from Genesis Infoserve Pvt. Ltd.!

Hope you are doing well. In reference to ${lead.n}'s technology and computing infrastructure requirements, I would like to formally introduce Genesis Infoserve Pvt. Ltd., an authorized and premier partner for enterprise IT Infrastructure and Software Solutions.

With our experienced and certified engineering team, we are associated with world-leading brands:
• Microsoft Gold Partner
• HP & Dell Premier Enterprise Partner
• Autodesk Gold Certified Partner
• Fortinet & Sophos Network Security Partner

Key Solutions We Deliver:
1. Software Licensing: Autodesk (AutoCAD, Revit, 3ds Max, AEC Collection), Adobe Creative Cloud, Trimble SketchUp, Microsoft 365, Antivirus EDR.
2. High-Performance Hardware: Specialized HP & Dell Workstations (CAD/BIM/AI), Commercial Laptops, Servers, and NVMe/SAN Storage.
3. Network & Security: Fortinet/Sophos UTM Firewalls, Cisco/Aruba Managed Switches, 4K CCTV Surveillance.
4. Annual Maintenance & Upgrades: Comprehensive AMC, hardware refresh, and component upgrades (RAM, SSD, GPUs).

We would be pleased to share competitive commercial quotes or arrange a consultation meeting.

Best Regards,
${repName}
${repDesignation}
GENESIS INFOSERVE PVT. LTD.
Email: ${repEmail} | Phone: ${repPhone}
Website: www.genesisinfoserve.com | Mumbai, India`;

  const bodyHtml = `
<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #222;">
  <p>Dear <strong>${recipient}</strong>,</p>
  
  <p><strong>Greetings from Genesis Infoserve Pvt. Ltd.!</strong></p>
  
  <p>Hope you are doing well. In reference to <strong>${lead.n}</strong>'s technology and computing infrastructure requirements, I would like to introduce Genesis Infoserve Pvt. Ltd., an authorized premier partner for enterprise IT Infrastructure and Software Solutions.</p>
  
  <p>With our experienced and certified technical team, we are associated with world-leading brands:</p>
  <ul>
    <li><strong>Microsoft</strong> Authorized Enterprise Reseller</li>
    <li><strong>HP &amp; Dell</strong> Commercial Workstation &amp; Server Partner</li>
    <li><strong>Autodesk</strong> Gold Certified Partner (AutoCAD / Revit / 3ds Max)</li>
    <li><strong>Fortinet &amp; Sophos</strong> Cybersecurity &amp; Firewall Reseller</li>
  </ul>
  
  <p><strong>Key Solutions We Deliver:</strong></p>
  <ol>
    <li><strong>Software Licensing:</strong> Autodesk AEC Collection, Adobe Creative Cloud, Trimble SketchUp, Microsoft 365.</li>
    <li><strong>High-Performance Hardware:</strong> HP Z-series &amp; Dell Precision Workstations, Enterprise Laptops, Rack Servers.</li>
    <li><strong>Network &amp; Security:</strong> Next-Gen Firewalls, Managed PoE Switches, 4K CCTV Surveillance Systems.</li>
    <li><strong>AMC &amp; Infrastructure Support:</strong> 4-hour SLA Annual Maintenance Contracts and lab component upgrades.</li>
  </ol>
  
  <p>We would be pleased to share a customized commercial proposal or arrange a technical demo.</p>
  
  <br>
  <div style="border-top: 2px solid #35d4b8; padding-top: 12px; margin-top: 16px;">
    <strong>${repName}</strong><br>
    <span style="color: #666;">${repDesignation}</span><br>
    <strong style="color: #0b4b41;">GENESIS INFOSERVE PVT. LTD.</strong><br>
    <span>Email: <a href="mailto:${repEmail}">${repEmail}</a> | Phone: ${repPhone}</span><br>
    <span>Web: <a href="https://www.genesisinfoserve.com">www.genesisinfoserve.com</a> | Pan-India Delivery</span>
  </div>
</div>`;

  return { subject, bodyText, bodyHtml };
}
