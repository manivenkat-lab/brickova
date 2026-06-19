import { PropertyType, PropertyCategory } from '../types';

export interface RoomHotspot {
  id: string;
  name: string;
  path: string;
  fill: string;
}

export interface EcosystemCard {
  title: string;
  desc: string;
  icon: string;
  img: string;
}

export interface AdvantageComparison {
  feat: string;
  us: boolean;
  them: boolean;
}

export interface SimulationLayer {
  id: string;
  name: string;
  title: string;
  color: string;
  desc: string;
}

export interface ServicesPageData {
  roomsData: Record<'ISO' | 'FRONT' | 'TOP' | 'SIDE' | 'BACK', RoomHotspot[]>;
  ecosystemCards: EcosystemCard[];
  comparisons: AdvantageComparison[];
  simulationLayers: SimulationLayer[];
}

export interface ApartmentUnit {
  id: string;
  floor: number;
  number: string;
  status: 'AVAILABLE' | 'BLOCKED' | 'SOLD';
  bhk: string;
  sqft: number;
  price: number;
}

export interface LeadCard {
  id: string;
  name: string;
  interest: string;
  budget: string;
  stage: 'leads' | 'nurtured' | 'visit' | 'blocked' | 'closed';
}

export interface TimelineStage {
  name: string;
  status: string;
  progress: number;
  date: string;
  desc: string;
  contractor: string;
}

export interface FeaturesPageData {
  units: ApartmentUnit[];
  leads: LeadCard[];
  timeline: TimelineStage[];
}

export interface AboutMilestone {
  year: string;
  title: string;
  desc: string;
  icon: string;
}

export interface CoreValue {
  title: string;
  desc: string;
  icon: string;
}

export interface AboutPageData {
  milestones: AboutMilestone[];
  coreValues: CoreValue[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AppointmentSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface ContactPageData {
  faqs: FAQItem[];
  availableSlots: AppointmentSlot[];
}

// ----------------------------------------------------
// DYNAMIC MOCK DATA
// ----------------------------------------------------

const MOCK_SERVICES_DATA: ServicesPageData = {
  roomsData: {
    ISO: [
      { id: 'living', name: 'Living Area', path: 'M 8,35 L 34,35 L 34,58 L 13,58 Z', fill: 'rgba(212, 175, 55, 0.25)' },
      { id: 'kitchen', name: 'Kitchen & Dining', path: 'M 36,10 L 64,10 L 64,50 L 36,50 Z', fill: 'rgba(30, 58, 138, 0.25)' },
      { id: 'master', name: 'Master Suite', path: 'M 64,52 L 91,52 L 91,80 L 64,80 Z', fill: 'rgba(30, 58, 138, 0.25)' },
      { id: 'bath', name: 'Luxury Bath', path: 'M 65,15 L 90,15 L 90,52 L 65,52 Z', fill: 'rgba(212, 175, 55, 0.25)' },
      { id: 'bedroom2', name: 'Guest Suite (B2)', path: 'M 26,52 L 46,52 L 46,85 L 26,85 Z', fill: 'rgba(212, 175, 55, 0.25)' }
    ],
    TOP: [
      { id: 'living', name: 'Living Area', path: 'M 15,35 L 42,35 L 42,65 L 15,65 Z', fill: 'rgba(212, 175, 55, 0.25)' },
      { id: 'kitchen', name: 'Kitchen & Dining', path: 'M 42,10 L 68,10 L 68,52 L 42,52 Z', fill: 'rgba(30, 58, 138, 0.25)' },
      { id: 'master', name: 'Master Suite', path: 'M 64,60 L 88,60 L 88,88 L 64,88 Z', fill: 'rgba(30, 58, 138, 0.25)' },
      { id: 'bath', name: 'Luxury Bath', path: 'M 68,18 L 88,18 L 88,58 L 68,58 Z', fill: 'rgba(212, 175, 55, 0.25)' },
      { id: 'bedroom2', name: 'Guest Suite (B2)', path: 'M 25,56 L 46,56 L 46,88 L 25,88 Z', fill: 'rgba(212, 175, 55, 0.25)' }
    ],
    FRONT: [
      { id: 'living', name: 'Living Area', path: 'M 22,28 L 50,28 L 50,78 L 22,78 Z', fill: 'rgba(212, 175, 55, 0.25)' },
      { id: 'kitchen', name: 'Kitchen & Dining', path: 'M 50,28 L 76,28 L 76,78 L 50,78 Z', fill: 'rgba(30, 58, 138, 0.25)' }
    ],
    BACK: [
      { id: 'kitchen', name: 'Kitchen & Dining', path: 'M 30,35 L 66,35 L 66,70 L 30,70 Z', fill: 'rgba(30, 58, 138, 0.25)' },
      { id: 'bedroom2', name: 'Guest Suite (B2)', path: 'M 16,38 L 22,38 L 22,66 L 16,66 Z', fill: 'rgba(212, 175, 55, 0.25)' },
      { id: 'bath', name: 'Luxury Bath', path: 'M 88,30 L 92,30 L 92,72 L 88,72 Z', fill: 'rgba(212, 175, 55, 0.25)' }
    ],
    SIDE: [
      { id: 'master', name: 'Master Suite', path: 'M 17,35 L 42,35 L 42,70 L 17,70 Z', fill: 'rgba(30, 58, 138, 0.25)' },
      { id: 'bath', name: 'Luxury Bath', path: 'M 66,35 L 91,35 L 91,70 L 66,70 Z', fill: 'rgba(212, 175, 55, 0.25)' }
    ]
  },
  ecosystemCards: [
    {
      title: 'AI Property Copilot',
      desc: 'Intelligent pricing analysis, automated description generation, and 24/7 buyer qualification via our proprietary LLM architecture.',
      icon: 'fa-robot',
      img: '/images/ai_property_copilot_1781760137989.png'
    },
    {
      title: 'Direct P2P Marketplace',
      desc: 'Bypass intermediary friction. Verified buyers connect instantly with authenticated asset owners through secure smart contracts.',
      icon: 'fa-handshake',
      img: '/images/p2p_marketplace_1781760148754.png'
    },
    {
      title: 'Multi-Tier CRM pipelines',
      desc: 'Institutional-grade deal tracking for elite agencies. Funnel management, automated follow-ups, and conversion analytics.',
      icon: 'fa-chart-network', // fallback
      img: '/images/crm_pipelines_1781760162210.png'
    },
    {
      title: 'Blockchain Title Verification',
      desc: 'Immutable property histories. Ensure clean titles and fast-track due diligence with distributed ledger technology.',
      icon: 'fa-link',
      img: '/images/blockchain_title_1781760175171.png'
    }
  ],
  comparisons: [
    { feat: 'AI Property Analysis', us: true, them: false },
    { feat: 'Interactive 3D Digital Twins', us: true, them: false },
    { feat: 'Direct Zero-Commission P2P', us: true, them: false },
    { feat: 'Integrated CRM Pipeline', us: true, them: false },
    { feat: 'Basic Photo Listings', us: true, them: true },
  ],
  simulationLayers: [
    { 
      id: 'wireframe', 
      name: 'Structural', 
      title: 'Concrete & Steel Structural Framework', 
      color: 'bg-slate-400', 
      desc: 'High-performance reinforced concrete and steel structural systems engineered for strength, safety, seismic resilience, and architectural precision.' 
    },
    { 
      id: 'mep', 
      name: 'MEP Systems', 
      title: 'Building Services Engineering', 
      color: 'bg-blue-400', 
      desc: 'Fully coordinated HVAC, electrical, plumbing, fire safety, and utility systems designed for operational efficiency, sustainability, and occupant comfort.' 
    },
    { 
      id: 'iot', 
      name: 'Smart IoT', 
      title: 'Intelligent Building Automation', 
      color: 'bg-green-400', 
      desc: 'Integrated smart sensors, connected devices, automated controls, energy monitoring, security surveillance, and real-time building analytics.' 
    },
    { 
      id: 'staging', 
      name: 'Virtual Staging', 
      title: 'AI Interior Experience', 
      color: 'bg-gold', 
      desc: 'Generate photorealistic interior concepts with AI-powered furnishings, premium materials, lighting scenarios, and customizable design styles for immersive property presentation.' 
    }
  ]
};

const generateInitialUnits = (): ApartmentUnit[] => {
  const list: ApartmentUnit[] = [];
  for (let f = 5; f >= 1; f--) {
    for (let u = 1; u <= 4; u++) {
      const id = `${f}0${u}`;
      let status: 'AVAILABLE' | 'BLOCKED' | 'SOLD' = 'AVAILABLE';
      if ((f === 4 && u === 2) || (f === 2 && u === 4)) status = 'BLOCKED';
      if ((f === 5 && u === 1) || (f === 3 && u === 3) || (f === 1 && u === 2)) status = 'SOLD';

      list.push({
        id,
        floor: f,
        number: `Unit ${id}`,
        status,
        bhk: u % 2 === 0 ? '3 BHK' : '2 BHK',
        sqft: u % 2 === 0 ? 1850 : 1420,
        price: u % 2 === 0 ? 12500000 : 9200000,
      });
    }
  }
  return list;
};

const MOCK_FEATURES_DATA: FeaturesPageData = {
  units: generateInitialUnits(),
  leads: [
    { id: 'l1', name: 'Rohan Kuruvilla', interest: '3 BHK Garden Villa', budget: '₹1.8 Cr', stage: 'leads' },
    { id: 'l2', name: 'Dr. Sneha Murthy', interest: '2 BHK Smart Apt', budget: '₹95 Lakhs', stage: 'nurtured' },
    { id: 'l3', name: 'Amit & Ritu Goel', interest: '4 BHK Sky Penthouse', budget: '₹4.2 Cr', stage: 'visit' },
    { id: 'l4', name: 'Vikram Malhotra', interest: '3 BHK Corner Flat', budget: '₹1.4 Cr', stage: 'blocked' },
    { id: 'l5', name: 'Kavitha Rao', interest: 'Commercial Office Space', budget: '₹2.8 Cr', stage: 'closed' }
  ],
  timeline: [
    { name: "Excavation", status: "Completed", progress: 100, date: "July 2025", desc: "Foundation pit completed, soil reinforcement anchors installed.", contractor: "L&T Infra Group" },
    { name: "Foundation Pouring", status: "Completed", progress: 100, date: "Oct 2025", desc: "Piling and main concrete foundation raft fully cured and certified.", contractor: "L&T Infra Group" },
    { name: "Slab & Core", status: "In Progress", progress: 65, date: "March 2026", desc: "Tower A slab casting at level 14. Core vertical shear walls under structure inspection.", contractor: "UltraTech PMC" },
    { name: "MEP Piping", status: "Scheduled", progress: 0, date: "August 2026", desc: "Mechanical, electrical, plumbing routing installations for lower block towers.", contractor: "Voltas Systems" },
    { name: "Finishing & Handover", status: "Scheduled", progress: 0, date: "Dec 2026", desc: "Interior drywall, flooring, landscaping, and regulatory occupancy checks.", contractor: "Brickova Ops" }
  ]
};

const MOCK_ABOUT_DATA: AboutPageData = {
  milestones: [
    { year: "2025", title: "Genesis & Seed Conception", desc: "K. Mani Venkat starts the Brickova prototype layout in Hyderabad district HQ.", icon: "fa-rocket" },
    { year: "2026", title: "AI Digital Twin & Platform Launch", desc: "Successfully mapped isometric blueprint layouts, synchronizing real-time IoT feeds and CRM workflows.", icon: "fa-cubes" }
  ],
  coreValues: [
    { title: "Transparency First", desc: "Direct owner connections. No commission models, no shadow valuations.", icon: "fa-eye" },
    { title: "Operational Velocity", desc: "We deploy construction site intelligence tools that cut project delays by 22%.", icon: "fa-gauge-high" },
    { title: "Institutional Safety", desc: "Decentralized title validation audits and client KYC validation layers.", icon: "fa-shield-halved" }
  ]
};

const MOCK_CONTACT_DATA: ContactPageData = {
  faqs: [
    { question: "What is Brickova Operating System?", answer: "Brickova is an end-to-end intelligent PropTech OS that unifies construction progress tracker sheets, direct buyer networks, and AI sales pipelines in a single workspace." },
    { question: "Is Brickova currently active for commercial launches?", answer: "Brickova is currently in its MVP phase, conducting invite-only developer pilots in Hyderabad and Bangalore." },
    { question: "How does the zero-commission direct model operate?", answer: "Sellers list directly. Buyers connect directly. Blockchain ledgers verify clear titles and transaction credentials, bypassing broker fees." }
  ],
  availableSlots: [
    { id: "s1", time: "10:00 AM - 11:00 AM", available: true },
    { id: "s2", time: "11:30 AM - 12:30 PM", available: true },
    { id: "s3", time: "02:00 PM - 03:00 PM", available: false },
    { id: "s4", time: "03:30 PM - 04:30 PM", available: true },
    { id: "s5", time: "05:00 PM - 06:00 PM", available: true }
  ]
};

// ----------------------------------------------------
// API METHODS
// ----------------------------------------------------

export const apiService = {
  async fetchServicesData(): Promise<ServicesPageData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SERVICES_DATA), 400);
    });
  },

  async fetchFeaturesData(): Promise<FeaturesPageData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FEATURES_DATA), 400);
    });
  },

  async fetchAboutData(): Promise<AboutPageData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ABOUT_DATA), 350);
    });
  },

  async fetchContactData(): Promise<ContactPageData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_CONTACT_DATA), 350);
    });
  },

  async submitContactForm(data: any): Promise<{ success: boolean }> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("https://formsubmit.co/ajax/info@brickova.in", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          resolve({ success: true });
        } else {
          throw new Error("Formsubmit failed");
        }
      } catch (e) {
        reject(e);
      }
    });
  }
};
