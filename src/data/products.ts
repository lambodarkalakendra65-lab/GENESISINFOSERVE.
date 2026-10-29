export interface ProductItem {
  group: 'Software' | 'Hardware' | 'Parts' | 'Services';
  name: string;
  description: string;
  category: 'Design software' | 'Security' | 'IT Hardware' | 'Networking & CCTV';
}

export const PRODUCT_GROUPS: Array<'Software' | 'Hardware' | 'Parts' | 'Services'> = [
  'Software',
  'Hardware',
  'Parts',
  'Services',
];

export const PRODUCT_GROUP_LABELS: Record<string, string> = {
  Software: 'SOFTWARE LICENSING',
  Hardware: 'IT INFRASTRUCTURE & HARDWARE',
  Parts: 'WORKSTATION & SERVER COMPONENTS',
  Services: 'PROFESSIONAL SERVICES & AMC',
};

export const ALL_PRODUCTS: ProductItem[] = [
  // Software
  {
    group: 'Software',
    name: 'Autodesk (AutoCAD / Revit / 3ds Max)',
    description: 'Gold Partner: AutoCAD, Revit, 3ds Max, Maya, AEC Collection, multi-seat team licensing and renewals.',
    category: 'Design software',
  },
  {
    group: 'Software',
    name: 'Adobe Creative Cloud',
    description: 'Enterprise Creative Cloud & Acrobat Pro subscriptions for design and corporate teams.',
    category: 'Design software',
  },
  {
    group: 'Software',
    name: 'Trimble (SketchUp Pro / Tekla)',
    description: '3D modeling, BIM and structural engineering design licensing for architects and civil consultants.',
    category: 'Design software',
  },
  {
    group: 'Software',
    name: 'Microsoft 365 & Windows Server',
    description: 'Office 365, Windows Server CALs, Azure cloud licenses for corporate and CA/legal firms.',
    category: 'Security',
  },
  {
    group: 'Software',
    name: 'Chaos (V-Ray & Enscape)',
    description: 'High-end photorealistic rendering software for architects and visualization studios.',
    category: 'Design software',
  },
  {
    group: 'Software',
    name: 'Lumion 3D',
    description: 'Real-time architectural rendering and video walkthrough generator.',
    category: 'Design software',
  },
  {
    group: 'Software',
    name: 'D5 Render',
    description: 'GPU-accelerated ray tracing engine for architects and interior designers.',
    category: 'Design software',
  },
  {
    group: 'Software',
    name: 'Antivirus & Endpoint Security',
    description: 'Enterprise EDR, ransomware shield, centralized cloud console for 10-500 nodes.',
    category: 'Security',
  },

  // Hardware
  {
    group: 'Hardware',
    name: 'Enterprise Laptops',
    description: 'HP EliteBook, Dell Latitude, Lenovo ThinkPad bulk supply with on-site warranty.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'HP & Dell Workstations',
    description: 'Specialization: HP Z-series & Dell Precision towers for heavy 3D CAD/BIM processing.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'Rack & Tower Servers',
    description: 'Dell PowerEdge, HP ProLiant dual-Xeon/EPYC servers for virtualization and databases.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'Storage & Backup (NAS/SAN)',
    description: 'Synology & QNAP multi-bay NAS, auto snapshot backup appliances for corporate data.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'Printers & Large Format Plotters',
    description: 'HP DesignJet A0/A1 plotters for architects and multi-function laser network copiers.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'Monitors & Color-Accurate Displays',
    description: 'Dell UltraSharp, BenQ color-calibrated 4K monitors, dual-display setups.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'Networking & Managed Switches',
    description: 'Cisco, Aruba, D-Link 24/48-port PoE managed switches, Cat6A structured cabling.',
    category: 'Networking & CCTV',
  },
  {
    group: 'Hardware',
    name: 'Next-Gen Firewall (Fortinet / Sophos)',
    description: 'UTM appliance with intrusion prevention, SSL-VPN, web filtering, DPDP compliance.',
    category: 'Security',
  },
  {
    group: 'Hardware',
    name: 'CCTV Surveillance & NVR',
    description: '4K IP dome/bullet cameras, 64-channel NVR with 30-day redundant RAID storage.',
    category: 'Networking & CCTV',
  },
  {
    group: 'Hardware',
    name: 'Online UPS & Power Backup',
    description: 'APC, Vertiv 1kVA to 30kVA online pure sine-wave UPS for server rooms and workstations.',
    category: 'IT Hardware',
  },
  {
    group: 'Hardware',
    name: 'Interactive Displays & Projectors',
    description: '75"/86" touch smart boards, 4K laser projectors for academic classrooms and boardrooms.',
    category: 'IT Hardware',
  },

  // Components & Parts
  {
    group: 'Parts',
    name: 'Processors (Intel Core / Xeon / AMD Ryzen)',
    description: 'High clock speed CPUs for CAD/Revit single-thread performance & rendering.',
    category: 'IT Hardware',
  },
  {
    group: 'Parts',
    name: 'Motherboards & Chipsets',
    description: 'Workstation motherboards with PCIe 5.0, ECC memory support, dual 10G LAN.',
    category: 'IT Hardware',
  },
  {
    group: 'Parts',
    name: 'RAM & ECC Memory',
    description: 'DDR4/DDR5 32GB/64GB sticks, ECC registered memory for server & workstation stability.',
    category: 'IT Hardware',
  },
  {
    group: 'Parts',
    name: 'NVMe SSDs & Enterprise HDDs',
    description: 'Samsung 990 Pro Gen4 SSDs, WD Gold 16TB enterprise storage drives.',
    category: 'IT Hardware',
  },
  {
    group: 'Parts',
    name: 'NVIDIA RTX & Quadro Graphics Cards',
    description: 'NVIDIA RTX 4080/4090 and RTX A4000/A5000 professional GPUs for V-Ray and Lumion.',
    category: 'IT Hardware',
  },
  {
    group: 'Parts',
    name: 'SMPS Power Supply & Cabinets',
    description: '80+ Gold/Platinum modular 750W-1200W power supplies, airflow chassis.',
    category: 'IT Hardware',
  },

  // Services
  {
    group: 'Services',
    name: 'BIM Modeling & Coordination',
    description: 'LOD 300 to 500 clash detection and BIM implementation services.',
    category: 'Design software',
  },
  {
    group: 'Services',
    name: 'Software Training & Certification',
    description: 'Authorized corporate training workshops for architectural and design teams.',
    category: 'Design software',
  },
  {
    group: 'Services',
    name: 'Comprehensive AMC & IT Support',
    description: 'Annual Maintenance Contracts with guaranteed 4-hour SLA and standby hardware.',
    category: 'IT Hardware',
  },
];
