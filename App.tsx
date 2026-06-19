
import React, { useState, useEffect, useMemo } from 'react';
import { Property, PropertyType, PropertyCategory, BHKType, SearchFilters, MembershipTier, Agent, Agency, Lead, UserRole, AppUser } from './types';
import { MOCK_PROPERTIES, INDIAN_CITIES, MOCK_AGENTS, MOCK_BLOGS, CURRENCY_SYMBOLS } from './constants';
import PropertyCard from './components/PropertyCard';
import PropertyDetails from './components/PropertyDetails';
import CustomerDashboard from './components/CustomerDashboard';
import AgentDashboard from './components/AgentDashboard';
import AgencyDashboard from './components/AgencyDashboard';
import SellerLoginView from './components/SellerLoginView';
import AIAssistant from './components/AIAssistant';
import AgentRegistrationView from './components/AgentRegistrationView';
import Pricing from './components/Pricing';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import Logo from './components/Logo';
import LandingPage from './components/LandingPage';
import DemoPage from './components/DemoPage';
import ServicesPage from './components/ServicesPage';
import FeaturesPage from './components/FeaturesPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsPage from './components/TermsPage';
import { getProperties, subscribeToProperties } from './services/propertyService';
import { subscribeToAuthChanges, getCurrentUserDoc, logout as firebaseLogout } from './services/authService';
import { runConnectionTest } from './services/testService';
import { getAgencyByAdmin, joinAgencyByCode } from './services/agencyService';
import { createLead } from './services/leadService';
import { logActivity } from './services/activityService';
import { doc, getDoc, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

type ViewState = 'MARKET' | 'DETAILS' | 'SELLERS' | 'AGENTS' | 'SHORTLIST' | 'PRICING' | 'ABOUT' | 'CONTACT' | 'DEMO' | 'FEATURES' | 'SERVICES' | 'PRIVACY' | 'TERMS';

const ModernBuildingSilhouette = () => (
  <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full z-0 pointer-events-none opacity-[0.05] overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1503387762-592dec5832f2?auto=format&fit=crop&q=80&w=1200" 
      alt="Modern Building" 
      className="w-full h-full object-cover object-right-bottom grayscale"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-beige-50/80 to-beige-50"></div>
  </div>
);

const ArchitecturalBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.02] overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
      alt="Architecture" 
      className="w-full h-full object-cover grayscale"
      referrerPolicy="no-referrer"
    />
  </div>
);

const BlueprintCorner = () => (
  <div className="fixed -top-20 -right-20 w-96 h-96 z-0 pointer-events-none opacity-[0.04] rotate-12">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <g stroke="#0f172a" strokeWidth="0.5" fill="none">
        <rect x="10" y="10" width="180" height="180" />
        <line x1="10" y1="10" x2="190" y2="190" />
        <line x1="190" y1="10" x2="10" y2="190" />
        <circle cx="100" cy="100" r="80" />
        <circle cx="100" cy="100" r="40" />
        <path d="M10,100 L190,100 M100,10 L100,190" strokeDasharray="2 2" />
      </g>
    </svg>
  </div>
);

const BuildingSkyline = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] overflow-hidden select-none">
    <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 450" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skylineFadeApp" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#faf9f6', stopOpacity: 0 }} />
          <stop offset="20%" style={{ stopColor: '#0f172a', stopOpacity: 0.1 }} />
          <stop offset="80%" style={{ stopColor: '#0f172a', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#faf9f6', stopOpacity: 1 }} />
        </linearGradient>
        <mask id="fadeMaskApp3D">
          <rect x="0" y="0" width="1200" height="450" fill="url(#skylineFadeApp)" />
        </mask>
      </defs>
      
      <g stroke="#0f172a" fill="none" mask="url(#fadeMaskApp3D)" strokeLinecap="round" strokeLinejoin="round">
        {Array.from({ length: 45 }).map((_, i) => {
          const x = (i * 30) % 1200;
          const h = 50 + Math.random() * 320;
          const w = 24 + Math.random() * 35;
          const depth = 10 + Math.random() * 12;
          const floors = Math.floor(h / 14);
          
          return (
            <g key={i} transform={`translate(${x}, ${450 - h})`} opacity={0.1 + Math.random() * 0.2}>
              <g strokeWidth="0.5">
                <path d={`M${w},0 L${w + depth},-${depth/2} L${w + depth},${h - depth/2} L${w},${h} Z`} fill="#0f172a" opacity="0.06" />
                <path d={`M0,0 L${depth},-${depth/2} L${w + depth},-${depth/2} L${w},0 Z`} fill="#ffffff" opacity="0.15" />
                <rect x="0" y="0" width={w} height={h} />
              </g>
              <g opacity="0.2">
                {Array.from({ length: floors }).map((_, f) => (
                  <line key={f} x1="0" y1={f * 14} x2={w} y2={f * 14} strokeWidth="0.2" />
                ))}
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  </div>
);

const ThreeDLightLines = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* 3D Wireframe Cityscape - Glowing Gold */}
      <g stroke="url(#buildingGradient)" strokeWidth="0.8" fill="none" filter="url(#glow)" opacity="0.15">
        {/* Left Cluster */}
        <g transform="translate(50, 450) scale(0.8)">
          <rect x="0" y="0" width="40" height="200" />
          <line x1="0" y1="0" x2="15" y2="-15" />
          <line x1="40" y1="0" x2="55" y2="-15" />
          <line x1="55" y1="-15" x2="55" y2="185" />
          <line x1="15" y1="-15" x2="55" y2="-15" />
        </g>
        <g transform="translate(120, 420) scale(0.9)">
          <rect x="0" y="0" width="50" height="250" />
          <line x1="0" y1="0" x2="20" y2="-20" />
          <line x1="50" y1="0" x2="70" y2="-20" />
          <line x1="70" y1="-20" x2="70" y2="230" />
          <line x1="20" y1="-20" x2="70" y2="-20" />
        </g>

        {/* Center Landmark Tower */}
        <g transform="translate(520, 300)">
          {/* Main Spire */}
          <path d="M50,-80 L65,0 L35,0 Z" strokeWidth="1.5" />
          <rect x="0" y="0" width="100" height="500" />
          <line x1="0" y1="0" x2="30" y2="-30" />
          <line x1="100" y1="0" x2="130" y2="-30" />
          <line x1="130" y1="-30" x2="130" y2="470" />
          <line x1="30" y1="-30" x2="130" y2="-30" />
          
          {/* Window Grids */}
          {Array.from({ length: 15 }).map((_, i) => (
            <g key={i} opacity="0.3">
              <line x1="10" y1={20 + i * 30} x2="90" y2={20 + i * 30} strokeWidth="0.2" />
              <line x1="30" y1={20 + i * 30} x2="50" y2={-10 + i * 30} strokeWidth="0.2" />
            </g>
          ))}
        </g>

        {/* Right Cluster */}
        <g transform="translate(850, 380) scale(1.1)">
          <rect x="0" y="0" width="70" height="320" />
          <line x1="0" y1="0" x2="-25" y2="-25" />
          <line x1="70" y1="0" x2="45" y2="-25" />
          <line x1="45" y1="-25" x2="45" y2="295" />
          <line x1="-25" y1="-25" x2="45" y2="-25" />
        </g>
        <g transform="translate(1000, 460) scale(0.85)">
          <rect x="0" y="0" width="60" height="180" />
          <line x1="0" y1="0" x2="-15" y2="-15" />
          <line x1="60" y1="0" x2="45" y2="-15" />
          <line x1="45" y1="-15" x2="45" y2="165" />
          <line x1="-15" y1="-15" x2="45" y2="-15" />
        </g>

        {/* Horizon Line */}
        <line x1="0" y1="780" x2="1200" y2="780" strokeWidth="0.5" opacity="0.2" />
      </g>
      
      {/* Pulsing Beacon Lights */}
      <g fill="#d4af37">
        <circle cx="570" cy="220" r="2">
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="140" cy="400" r="1.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="900" cy="355" r="1.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  </div>
);

const ArchitecturalDrafting = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] overflow-hidden select-none">
    <svg className="w-full h-full" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#0f172a" strokeWidth="0.5" fill="none" strokeDasharray="4 4">
        {/* Complex Floor plan style lines */}
        <path d="M50,50 L450,50 L450,350 L50,350 Z" />
        <path d="M100,50 L100,350 M400,50 L400,350" />
        <path d="M50,150 L450,150 M50,250 L450,250" />
        
        {/* Circle structural element */}
        <path d="M650,100 L950,100 L950,400 L650,400 Z" />
        <circle cx="800" cy="250" r="100" />
        <path d="M650,250 L950,250 M800,100 L800,400" />
        <circle cx="800" cy="250" r="40" strokeDasharray="none" strokeWidth="0.3" />
        
        {/* Bottom drafting area */}
        <path d="M150,500 L550,500 L550,750 L150,750 Z" />
        <path d="M150,625 L550,625 M350,500 L350,750" />
        <path d="M200,500 L200,750 M500,500 L500,750" />
        
        {/* Right side technical area */}
        <path d="M750,550 L1100,550 L1100,750 L750,750 Z" />
        <path d="M750,650 L1100,650" />
        <path d="M925,550 L925,750" />
        
        {/* Dimension lines */}
        <g strokeDasharray="none" strokeWidth="0.3">
          <line x1="50" y1="30" x2="450" y2="30" />
          <line x1="50" y1="25" x2="50" y2="35" />
          <line x1="450" y1="25" x2="450" y2="35" />
          
          <line x1="30" y1="50" x2="30" y2="350" />
          <line x1="25" y1="50" x2="35" y2="50" />
          <line x1="25" y1="350" x2="35" y2="350" />
          
          {/* Compass-like element */}
          <g transform="translate(1100, 100)">
            <circle cx="0" cy="0" r="40" />
            <line x1="-40" y1="0" x2="40" y2="0" />
            <line x1="0" y1="-40" x2="0" y2="40" />
            <text x="-5" y="-45" fontSize="10" fill="#0f172a" stroke="none" fontFamily="monospace">N</text>
          </g>
        </g>
        
        {/* Coordinate marks and Technical Labels */}
        <g fontSize="9" fontFamily="monospace" fill="#0f172a" opacity="0.6" stroke="none">
          <text x="20" y="30">SHEET_A-102</text>
          <text x="1080" y="30">REV_04</text>
          <text x="20" y="780">SCALE: 1/4" = 1'-0"</text>
          <text x="1080" y="780">
            <tspan x="1080" dy="-10">BRICKOVA</tspan>
          </text>
          
          {/* Grid markers */}
          <text x="50" y="365">A</text><text x="150" y="365">B</text><text x="250" y="365">C</text><text x="350" y="365">D</text><text x="450" y="365">E</text>
          <text x="35" y="50">1</text><text x="35" y="150">2</text><text x="35" y="250">3</text><text x="35" y="350">4</text>
        </g>
      </g>
    </svg>
  </div>
);

const CategoryShortcuts = ({ onSelect, activeCategory }: { onSelect: (cat: string) => void, activeCategory?: string }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-4xl mx-auto mt-8 px-4">
    {[
      { id: 'Apartment', icon: 'fa-building', label: 'Apartments' },
      { id: 'Villa', icon: 'fa-house-chimney', label: 'Villas' },
      { id: 'Plot', icon: 'fa-map', label: 'Plots' },
      { id: 'Commercial', icon: 'fa-shop', label: 'Commercial' }
    ].map(cat => (
      <button 
        key={cat.id}
        onClick={() => onSelect(cat.id)}
        className={`p-5 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all duration-300 flex flex-col items-center gap-4 group active:scale-95 ${activeCategory === cat.id ? 'bg-navy border-navy shadow-premium' : 'bg-white border-beige-200 shadow-soft hover:shadow-premium hover:-translate-y-1.5 hover:border-gold/30'}`}
      >
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${activeCategory === cat.id ? 'bg-white/10 text-gold' : 'bg-beige-50 text-navy group-hover:bg-navy group-hover:text-white'}`}>
          <i className={`fa-solid ${cat.icon} text-lg md:text-2xl`}></i>
        </div>
        <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${activeCategory === cat.id ? 'text-white' : 'text-navy'}`}>{cat.label}</span>
      </button>
    ))}
  </div>
);

const TrustSection = () => (
  <section className="py-16 md:py-24 bg-white border-y border-beige-100">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center space-y-3 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tighter">Why Choose Brickova</h2>
        <p className="text-[10px] md:text-xs font-black text-navy-muted uppercase tracking-[0.3em] opacity-60">The Gold Standard in Real Estate Transactions</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { title: 'Verified Listings', desc: 'Every asset undergoes a rigorous multi-point verification protocol.', icon: 'fa-shield-halved' },
          { title: 'Direct Owner Deals', desc: 'Eliminate intermediary latency and engage directly with asset holders.', icon: 'fa-handshake-simple' },
          { title: 'Secure Transactions', desc: 'Institutional-grade security for all your property documentation.', icon: 'fa-lock' },
          { title: 'Smart CRM for Agents', desc: 'Advanced pipeline management and lead tracking for top producers.', icon: 'fa-chart-line' }
        ].map((item, i) => (
          <div key={i} className="bg-beige-50 p-8 md:p-10 rounded-[2rem] border border-beige-200 space-y-5 group hover:bg-white hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-navy text-white rounded-2xl flex items-center justify-center text-xl shadow-navy group-hover:scale-110 transition-transform duration-300">
              <i className={`fa-solid ${item.icon} text-gold`}></i>
            </div>
            <h3 className="text-sm md:text-base font-black text-navy uppercase tracking-tight">{item.title}</h3>
            <p className="text-[10px] md:text-xs text-navy-muted font-medium leading-relaxed uppercase tracking-wider opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StatsStrip = () => (
  <section className="py-12 bg-navy text-white border-y border-white/10">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/10">
        {[
          { value: '1200+', label: 'Properties', icon: 'fa-building' },
          { value: '85+', label: 'Agents', icon: 'fa-user-tie' },
          { value: '15+', label: 'Cities', icon: 'fa-map-location-dot' },
          { value: '300+', label: 'Happy Buyers', icon: 'fa-face-smile' }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center space-y-2 group">
            <i className={`fa-solid ${stat.icon} text-2xl md:text-3xl text-gold/80 group-hover:text-gold group-hover:scale-110 transition-all duration-300 mb-2`}></i>
            <span className="text-2xl md:text-3xl font-black tracking-tighter">{stat.value}</span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CityExploration = ({ onCitySelect }: { onCitySelect: (city: string) => void }) => (
  <section className="py-16 md:py-24 bg-beige-50/50">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tighter">Explore Properties by City</h2>
          <p className="text-[10px] md:text-xs font-black text-navy-muted uppercase tracking-[0.3em] opacity-60">Discover Prime Real Estate Across Major Metros</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {[
          { name: 'Hyderabad', img: 'https://images.unsplash.com/photo-1616423641454-996649479695?auto=format&fit=crop&q=80&w=800' },
          { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=400' },
          { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&q=80&w=400' },
          { name: 'Pune', img: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&q=80&w=400' },
          { name: 'Chennai', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=400' }
        ].map(city => (
          <div 
            key={city.name} 
            onClick={() => onCitySelect(city.name)}
            className="relative h-48 md:h-64 rounded-2xl md:rounded-[2rem] overflow-hidden group cursor-pointer shadow-soft hover:shadow-premium transition-all duration-300 hover:-translate-y-1.5"
          >
            <img 
              src={city.img} 
              alt={city.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <h4 className="text-white font-black uppercase tracking-widest text-xs md:text-sm mb-1">{city.name}</h4>
              <span className="text-[8px] md:text-[9px] font-bold text-gold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                View Listings <i className="fa-solid fa-arrow-right text-[7px]"></i>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NavDropdown = ({ label, items }: { label: string, items: { label: string, onClick: () => void }[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="relative group h-full flex items-center"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-muted hover:text-navy flex items-center gap-1.5 transition-colors">
        {label}
        <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      <div className={`absolute top-full left-0 pt-2 w-48 transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
        <div className="bg-white rounded-2xl shadow-premium border border-beige-200 overflow-hidden flex flex-col py-2">
          {items.map((item, i) => (
            <button 
              key={i} 
              onClick={() => { setIsOpen(false); item.onClick(); }}
              className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-navy hover:text-gold hover:bg-beige-50 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mhomes_shortlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [agencies, setAgencies] = useState<Agency[]>(() => {
    const saved = localStorage.getItem('mhomes_agencies');
    return saved ? JSON.parse(saved) : [];
  });
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('mhomes_agents');
    return saved ? JSON.parse(saved) : MOCK_AGENTS;
  });

  const [view, setView] = useState<ViewState>('MARKET');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'AED' | 'EUR'>('INR');
  const [user, setUser] = useState<AppUser | null>(null);
  const [agentUser, setAgentUser] = useState<Agent | null>(null);
  const [currentAgency, setCurrentAgency] = useState<Agency | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAgency = async () => {
      if (user?.agencyId) {
        try {
          const agencyDoc = await getDoc(doc(db, "agencies", user.agencyId));
          if (agencyDoc.exists()) {
            setCurrentAgency({ id: agencyDoc.id, ...agencyDoc.data() } as Agency);
          }
        } catch (error) {
          console.error("Error fetching agency:", error);
        }
      } else {
        setCurrentAgency(null);
      }
    };
    fetchAgency();
  }, [user?.agencyId]);

  useEffect(() => {
    runConnectionTest();
    
    // Real-time listener for all properties
    const q = query(collection(db, "properties"));
    const unsubscribeProperties = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as Property));
      
      // Sort in memory by createdAt
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      
      setProperties(data);
      setLoading(false);
    });

    const unsubscribeAuth = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getCurrentUserDoc(firebaseUser.uid);
        if (userDoc) {
          setUser(userDoc);
          if (userDoc.role === UserRole.AGENT || userDoc.role === UserRole.AGENCY_ADMIN) {
            // Map Firestore user to Agent type for UI compatibility
            const agent: Agent = {
              id: userDoc.uid,
              name: userDoc.displayName,
              photo: userDoc.photo,
              agency: '', // Will be fetched if needed or left empty
              agencyId: userDoc.agencyId || '',
              role: userDoc.role,
              experience: 5,
              rating: 5,
              soldCount: 0,
              email: userDoc.email,
              phone: userDoc.phone,
              specialization: [],
              tier: MembershipTier.PRO_AGENT
            };
            setAgentUser(agent);
          }
        }
      } else {
        setUser(null);
        setAgentUser(null);
      }
    });

    return () => {
      unsubscribeProperties();
      unsubscribeAuth();
    };
  }, []);

  // Removed redundant user-specific property subscription to use global listener
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'ALL',
    type: 'ALL',
    bhk: 'ALL',
    minPrice: 0,
    maxPrice: 2000000000
  });

  useEffect(() => { 
    try {
      localStorage.setItem('mhomes_v8_db', JSON.stringify(properties)); 
    } catch (e) {
      console.warn("Storage quota limit reached for properties database.");
    }
  }, [properties]);

  useEffect(() => { 
    try {
      localStorage.setItem('mhomes_shortlist', JSON.stringify(shortlistedIds)); 
    } catch (e) {
      console.warn("Storage quota limit reached for shortlist.");
    }
  }, [shortlistedIds]);

  const currencyRates = { INR: 1, USD: 83.5, AED: 22.7, EUR: 91 };

  const formatPriceShorthand = (price: number, type: PropertyType | string | undefined) => {
    const isRent = type === PropertyType.RENT;
    let basePrice = price;
    if (currency !== 'INR') { 
      basePrice = price / currencyRates[currency]; 
      const symbol = CURRENCY_SYMBOLS[currency];
      return `${symbol}${Math.round(basePrice).toLocaleString()}${isRent ? ' /mo' : ''}`;
    }

    let formatted = '';
    if (price >= 10000000) {
      formatted = `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      formatted = `₹${(price / 100000).toFixed(2)} L`;
    } else {
      formatted = `₹${price?.toLocaleString() || '0'}`;
    }

    return isRent ? `${formatted} /mo` : formatted;
  };

  const toggleShortlist = (id: string) => {
    setShortlistedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const displayProperties = useMemo(() => {
    if (properties.length >= 6) return properties;
    // Fill with mock data for demo if needed
    const placeholders = MOCK_PROPERTIES.slice(0, 6 - properties.length).map(p => ({
      ...p,
      id: `demo-${p.id}`,
      isDemo: true
    }));
    return [...properties, ...placeholders];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    const base = view === 'SHORTLIST' ? displayProperties.filter(p => shortlistedIds.includes(p.id)) : displayProperties;
    return base.filter(p => {
      const titleMatch = (p.title || '').toLowerCase().includes((filters.query || '').toLowerCase());
      const locationMatch = (p.location || '').toLowerCase().includes((filters.query || '').toLowerCase());
      const matchQuery = titleMatch || locationMatch;
      const matchCat = filters.category === 'ALL' || p.category === filters.category;
      const matchBhk = filters.bhk === 'ALL' || p.bhk === filters.bhk;
      const matchType = filters.type === 'ALL' || p.type === filters.type;
      const matchPropType = !filters.propertyType || filters.propertyType === 'ALL' || 
        p.propertyType === filters.propertyType || 
        p.category === filters.propertyType ||
        (filters.propertyType === 'Apartment' && p.propertyType === 'Flat') ||
        (filters.propertyType === 'Flat' && p.propertyType === 'Apartment') ||
        (filters.propertyType === 'Commercial' && p.plotType === 'Commercial') ||
        (filters.propertyType === 'Commercial' && p.category === PropertyCategory.PLOT);
      
      const price = p.price || 0;
      const matchPrice = price >= filters.minPrice && price <= filters.maxPrice;

      return matchQuery && matchCat && matchBhk && matchType && matchPropType && matchPrice;
    });
  }, [displayProperties, filters, view, shortlistedIds]);

  const handleAddProperty = (p: Property) => { /* Handled by onSnapshot */ };
  const handleUpdateProperty = (updated: Property) => { /* Handled by onSnapshot */ };
  const handleDeleteProperty = (id: string) => { /* Handled by onSnapshot */ };

  const handleAgentLogout = async () => { 
    await firebaseLogout();
    setAgentUser(null); 
    setUser(null);
    setView('MARKET'); 
  };
  const handleSellerLogout = async () => { 
    await firebaseLogout();
    setUser(null); 
    setAgentUser(null);
    setView('MARKET'); 
  };

  const handleCreateLead = async (leadData: any) => {
    // Lead is already created in Firestore by PropertyDetails
    // We can log activity here if needed, but PropertyDetails could also do it.
    if (user) {
      await logActivity({
        userId: user.uid,
        userName: user.displayName,
        action: 'Captured Lead',
        leadId: leadData.id || 'unknown',
        leadName: leadData.name
      });
    }
  };

  const handleAgentRegistration = (updatedUser: AppUser) => {
    setUser(updatedUser);
    
    // Map to Agent type for UI compatibility
    const agent: Agent = {
      id: updatedUser.uid,
      name: updatedUser.displayName,
      photo: updatedUser.photo,
      agency: '',
      agencyId: updatedUser.agencyId || '',
      role: updatedUser.role,
      experience: 5,
      rating: 5,
      soldCount: 0,
      email: updatedUser.email,
      phone: updatedUser.phone,
      specialization: [],
      tier: MembershipTier.PRO_AGENT
    };
    setAgentUser(agent);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-beige-50 text-navy font-sans selection:bg-gold selection:text-white flex flex-col relative">
      <ArchitecturalBackground />
      <BlueprintCorner />
      <nav className="h-14 md:h-16 flex items-center sticky top-0 z-[100] glass-nav">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 cursor-pointer group" onClick={() => { setView('MARKET'); setFilters({...filters, bhk: 'ALL', category: 'ALL'}); }}>
            <Logo className="h-9 md:h-10 w-auto shadow-soft group-hover:scale-105 transition-all" />
            <span className="text-[10px] sm:text-sm md:text-base font-black text-navy tracking-tight md:tracking-[0.05em] uppercase font-montserrat">Brickova</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => { setView('MARKET'); window.scrollTo(0,0); }} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-muted hover:text-navy transition-all">Home</button>
            <button onClick={() => { setView('FEATURES'); window.scrollTo(0,0); }} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-muted hover:text-navy transition-all">Features</button>
            <button onClick={() => { setView('SERVICES'); window.scrollTo(0,0); }} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-muted hover:text-navy transition-all">Services</button>
            <button onClick={() => { setView('ABOUT'); window.scrollTo(0,0); }} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-muted hover:text-navy transition-all">About Us</button>
            <button onClick={() => { setView('CONTACT'); window.scrollTo(0,0); }} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-muted hover:text-navy transition-all">Contact Us</button>
            
            <button onClick={() => { setView('DEMO'); window.scrollTo(0,0); }} className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-navy hover:bg-gold rounded-full transition-all ml-4 shadow-soft">Book Demo</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {(user || agentUser) && (
              <div className="w-8 h-8 rounded-full border-2 border-gold p-0.5 shadow-soft shrink-0">
                 <img src={user?.photo || agentUser?.photo} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              </div>
            )}
            <div className="md:hidden flex items-center gap-2">
               <button onClick={() => setIsMobileMenuOpen(true)} className="w-9 h-9 flex items-center justify-center text-navy active:scale-90 transition-transform">
                  <i className="fa-solid fa-bars text-xl"></i>
               </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden flex items-center justify-around bg-white/80 backdrop-blur-md border-b border-beige-200 px-2 py-3 sticky top-14 z-[90] shadow-sm">
         <button onClick={() => { setView('MARKET'); window.scrollTo(0,0); }} className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all ${view === 'MARKET' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Home</button>
         <button onClick={() => { setView('FEATURES'); window.scrollTo(0,0); }} className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all ${view === 'FEATURES' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Features</button>
         <button onClick={() => { setView('SERVICES'); window.scrollTo(0,0); }} className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all ${view === 'SERVICES' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Services</button>
         <button onClick={() => { setView('DEMO'); window.scrollTo(0,0); }} className={`text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition-all ${view === 'DEMO' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Book Demo</button>
      </div>

      <div className={`fixed inset-0 bg-navy/50 backdrop-blur-sm z-[200] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`absolute top-0 right-0 w-64 h-full bg-white shadow-premium transform transition-transform duration-300 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-beige-200 flex items-center justify-between">
            <span className="text-sm font-black text-navy uppercase tracking-widest">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-navy-muted hover:text-navy bg-beige-50 rounded-full">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy-muted">Explore</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setIsMobileMenuOpen(false); setView('MARKET'); window.scrollTo(0,0); }} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Home</button>
                <button onClick={() => { setIsMobileMenuOpen(false); setView('FEATURES'); window.scrollTo(0,0); }} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Features</button>
                <button onClick={() => { setIsMobileMenuOpen(false); setView('SERVICES'); window.scrollTo(0,0); }} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Services</button>
                <button onClick={() => { setIsMobileMenuOpen(false); setView('DEMO'); window.scrollTo(0,0); }} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Book Demo</button>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-navy-muted">Company</h3>
              <div className="flex flex-col gap-2">
                <button onClick={() => { setIsMobileMenuOpen(false); setView('ABOUT'); }} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">About Us</button>
                <button onClick={() => { setIsMobileMenuOpen(false); setView('CONTACT'); }} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Contact Us</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <i className="fa-solid fa-circle-notch animate-spin text-4xl text-gold"></i>
            </div>
          </div>
        ) : (
          <>
            {view === 'MARKET' && (
          <div className="duration-700">
            <LandingPage 
              onDemoClick={() => { setView('DEMO'); window.scrollTo(0,0); }} 
              onFeaturesClick={() => { setView('FEATURES'); window.scrollTo(0,0); }}
            />

            {(filters.query || filters.category !== 'ALL' || filters.bhk !== 'ALL' || filters.propertyType) && (
              <div id="inventory-section" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tighter">
                      Available Inventory
                    </h2>
                    <p className="text-[10px] md:text-xs font-black text-navy-muted uppercase tracking-[0.3em] opacity-60">
                      Direct Listings from Verified Owners
                    </p>
                  </div>
                </div>
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
                    {filteredProperties.map(p => (
                      <PropertyCard key={p.id} property={p} isShortlisted={shortlistedIds.includes(p.id)} onToggleShortlist={() => toggleShortlist(p.id)} onSelect={(p) => { setSelectedProperty(p); setView('DETAILS'); }} formatPrice={(price) => formatPriceShorthand(price, p.type)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 md:py-32 bg-white rounded-[2rem] border border-beige-100 shadow-soft max-w-2xl mx-auto px-6">
                    <i className="fa-solid fa-folder-open text-3xl md:text-4xl text-beige-200 mb-6"></i>
                    <p className="text-navy-muted font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[9px] md:text-[10px]">No matches found for your criteria</p>
                  </div>
                )}
              </div>
            )}

            {view === 'MARKET' && (
              <div className="hidden"></div>
            )}
          </div>
        )}

        {view === 'DETAILS' && selectedProperty && (
          <div className="max-w-7xl mx-auto px-0 md:px-8 flex-1">
            <PropertyDetails 
              property={selectedProperty} 
              isShortlisted={shortlistedIds.includes(selectedProperty.id)} 
              onToggleShortlist={() => toggleShortlist(selectedProperty.id)} 
              onBack={() => setView('MARKET')} 
              formatPrice={(price) => formatPriceShorthand(price, selectedProperty.type)} 
              onCaptureLead={handleCreateLead}
              currentUser={user}
            />
          </div>
        )}
        {view === 'SELLERS' && (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
            {!user ? (
              <SellerLoginView onLoginSuccess={setUser} />
            ) : (
               <CustomerDashboard 
                 properties={properties}
                 shortlistedIds={shortlistedIds}
                 onToggleShortlist={toggleShortlist}
                 onAddProperty={handleAddProperty}
                 onUpdateProperty={handleUpdateProperty}
                 onDeleteProperty={handleDeleteProperty}
                 onViewProperty={(p) => { setSelectedProperty(p); setView('DETAILS'); }}
                 onLogout={handleSellerLogout}
                 initialView="LISTINGS"
               />
            )}
          </div>
        )}
        {view === 'SHORTLIST' && (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
               <CustomerDashboard 
                 properties={properties}
                 shortlistedIds={shortlistedIds}
                 onToggleShortlist={toggleShortlist}
                 onAddProperty={handleAddProperty}
                 onUpdateProperty={handleUpdateProperty}
                 onDeleteProperty={handleDeleteProperty}
                 onViewProperty={(p) => { setSelectedProperty(p); setView('DETAILS'); }}
                 onLogout={handleSellerLogout}
                 initialView="VAULT"
               />
          </div>
        )}
        {view === 'AGENTS' && (
          <div className="max-w-7xl mx-auto w-full px-0 md:px-8">
            {!user ? (
              <SellerLoginView onLoginSuccess={setUser} />
            ) : !agentUser ? (
              <AgentRegistrationView currentUser={user} onRegistrationSuccess={handleAgentRegistration} existingAgencies={agencies} />
            ) : agentUser.role === UserRole.AGENCY_ADMIN ? (
              <AgencyDashboard 
                 properties={properties} 
                 onEdit={(p) => { setSelectedProperty(p); setView('DETAILS'); }} 
                 onDelete={handleDeleteProperty} 
                 onAddProperty={handleAddProperty} 
                 onBackToMarket={() => setView('MARKET')} 
                 agentProfile={agentUser} 
                 agency={(currentAgency || { id: '', name: 'Empty Agency', adminUid: '', code: '', slotLimit: 15, slotUsed: 0, active: true, createdAt: new Date() }) as Agency}
                 allAgents={agents} 
                 onLogout={handleAgentLogout} 
                 isSidebarOpen={isSidebarOpen}
                 setIsSidebarOpen={setIsSidebarOpen}
               />
            ) : (
              <AgentDashboard 
                 properties={properties} 
                 onEdit={(p) => { setSelectedProperty(p); setView('DETAILS'); }} 
                 onDelete={handleDeleteProperty} 
                 onAddProperty={handleAddProperty} 
                 onBackToMarket={() => setView('MARKET')} 
                 agentProfile={agentUser} 
                 allAgents={agents} 
                 onLogout={handleAgentLogout} 
                 isSidebarOpen={isSidebarOpen}
                 setIsSidebarOpen={setIsSidebarOpen}
               />
            )}
          </div>
        )}
        {view === 'PRICING' && (
          <Pricing />
        )}
        {view === 'ABOUT' && <AboutPage />}
        {view === 'CONTACT' && <ContactPage />}
        {view === 'DEMO' && <DemoPage />}
        {view === 'FEATURES' && (
          <FeaturesPage onDemoClick={() => { setView('DEMO'); window.scrollTo(0,0); }} />
        )}
        {view === 'SERVICES' && (
          <ServicesPage onDemoClick={() => { setView('DEMO'); window.scrollTo(0,0); }} />
        )}
        {view === 'PRIVACY' && (
          <PrivacyPolicyPage onBackToHome={() => { setView('MARKET'); window.scrollTo(0,0); }} />
        )}
        {view === 'TERMS' && (
          <TermsPage onBackToHome={() => { setView('MARKET'); window.scrollTo(0,0); }} />
        )}
      </>
    )}
      </main>
      
      {!loading && (
      <footer className="bg-navy py-12 md:py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20">
            <div className="col-span-1 sm:col-span-2 md:col-span-1 space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <Logo className="w-10 h-10 shadow-soft" />
                <span className="text-xl font-black uppercase tracking-widest font-montserrat">Brickova</span>
              </div>
              <p className="text-xs text-white/40 font-medium leading-relaxed uppercase tracking-wider">
                India's premier real estate network for direct owner transactions and institutional-grade asset management.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Platform</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                <li onClick={() => { setView('ABOUT'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li onClick={() => { setView('FEATURES'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Features</li>
                <li onClick={() => { setView('SERVICES'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Services</li>
                <li onClick={() => { setView('AGENTS'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Partner Hub</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Explore</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                <li onClick={() => { setFilters({ ...filters, query: 'Hyderabad' }); setView('MARKET'); }} className="hover:text-white transition-colors cursor-pointer">Hyderabad</li>
                <li onClick={() => { setFilters({ ...filters, query: 'Bangalore' }); setView('MARKET'); }} className="hover:text-white transition-colors cursor-pointer">Bangalore</li>
                <li onClick={() => { setFilters({ ...filters, query: 'Mumbai' }); setView('MARKET'); }} className="hover:text-white transition-colors cursor-pointer">Mumbai</li>
                <li onClick={() => { setFilters({ ...filters, query: 'Pune' }); setView('MARKET'); }} className="hover:text-white transition-colors cursor-pointer">Pune</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Legal</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-white/60">
                <li onClick={() => { setView('TERMS'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li onClick={() => { setView('PRIVACY'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li onClick={() => { setView('PRIVACY'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Cookie Protocol</li>
                <li onClick={() => { setView('CONTACT'); window.scrollTo(0,0); }} className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-center md:text-left">
              © 2026 Brickova. All rights reserved.
            </p>
            <div className="flex gap-8">
              <i className="fa-brands fa-twitter text-white/20 hover:text-gold transition-colors cursor-pointer text-lg"></i>
              <a href="https://www.instagram.com/brickova_?igsh=dzNneGJwejZqNjN2&utm_source=qr" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram text-white/20 hover:text-gold transition-colors cursor-pointer text-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
};

export default App;
