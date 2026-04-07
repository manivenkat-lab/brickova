
import React, { useState, useEffect, useMemo } from 'react';
import { Property, PropertyType, PropertyCategory, BHKType, SearchFilters, MembershipTier, Agent, Agency, Lead, UserRole, AppUser } from './types';
import { MOCK_PROPERTIES, INDIAN_CITIES, MOCK_AGENTS, MOCK_BLOGS, CURRENCY_SYMBOLS, PRICING_PLANS } from './constants';
import { initializePayment } from './services/paymentService';
import PropertyCard from './components/PropertyCard';
import PropertyDetails from './components/PropertyDetails';
import CommandCenter from './components/CommandCenter';
import OwnerDashboard from './components/OwnerDashboard';
import SellerLoginView from './components/SellerLoginView';
import AIAssistant from './components/AIAssistant';
import AgentRegistrationView from './components/AgentRegistrationView';
import Pricing from './components/Pricing';
import PaymentStatus from './components/PaymentStatus';
import Logo from './components/Logo';
import UserMenuDrawer from './components/UserMenuDrawer';
import { getProperties, subscribeToProperties } from './services/propertyService';
import { subscribeToAuthChanges, getCurrentUserDoc, logout as firebaseLogout, updatePlan, updateListingsUsed } from './services/authService';
import { runConnectionTest } from './services/testService';
import { getAgencyByAdmin, joinAgencyByCode } from './services/agencyService';
import { createLead } from './services/leadService';
import { logActivity } from './services/activityService';
import { doc, getDoc, query, collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Building2, Home, Map, Store, ShieldCheck, Handshake, Lock, BarChart3, Building, UserRound, MapPin, Smile, ArrowRight, ChevronDown, Menu, Bookmark, Loader2, Search, FolderOpen, Globe, Check } from 'lucide-react';

type ViewState = 'MARKET' | 'DETAILS' | 'SELLERS' | 'AGENTS' | 'SHORTLIST' | 'PRICING';

const ModernBuildingSilhouette = () => (
  <div className="absolute right-0 bottom-0 w-full md:w-1/2 h-full z-0 pointer-events-none opacity-[0.05] overflow-hidden">
    <img 
      src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" 
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
      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000" 
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

const IsoBuilding = ({ x, y, w, d, h, delay = 0, isGold = false }: any) => {
  const pBottom = `0,0`;
  const pRight = `${w},${-w/2}`;
  const pLeft = `${-d},${-d/2}`;
  const pBack = `${w-d},${-(w+d)/2}`;
  
  const pTopBottom = `0,${-h}`;
  const pTopRight = `${w},${-h - w/2}`;
  const pTopLeft = `${-d},${-h - d/2}`;
  const pTopBack = `${w-d},${-h - (w+d)/2}`;

  const strokeColor = isGold ? "#d4af37" : "#0f172a";
  const strokeOpacity = isGold ? "0.4" : "0.15";
  const leftFill = isGold ? "#d4af37" : "#0f172a";
  const rightFill = isGold ? "#d4af37" : "#0f172a";
  const topFill = isGold ? "#d4af37" : "#0f172a";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points={`${pBottom} ${pLeft} ${pTopLeft} ${pTopBottom}`} fill={leftFill} fillOpacity={isGold ? "0.05" : "0.01"} stroke={strokeColor} strokeWidth="0.5" strokeOpacity={strokeOpacity} />
      <polygon points={`${pBottom} ${pRight} ${pTopRight} ${pTopBottom}`} fill={rightFill} fillOpacity={isGold ? "0.08" : "0.02"} stroke={strokeColor} strokeWidth="0.5" strokeOpacity={strokeOpacity} />
      <polygon points={`${pTopBottom} ${pTopRight} ${pTopBack} ${pTopLeft}`} fill={topFill} fillOpacity={isGold ? "0.15" : "0.03"} stroke={strokeColor} strokeWidth="0.5" strokeOpacity={strokeOpacity} />
      
      <polyline points={`${pTopLeft} ${pTopBottom} ${pTopRight}`} fill="none" stroke="#d4af37" strokeWidth="0.5" strokeOpacity="0.3">
        <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${3 + delay}s`} repeatCount="indefinite" />
      </polyline>
    </g>
  );
};

const IsometricCityscape = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block opacity-70">
    <svg viewBox="0 0 1200 800" className="w-full h-full" preserveAspectRatio="xMidYMax slice">
      {/* Left Cluster */}
      <g transform="translate(250, 650)">
        <IsoBuilding x={-120} y={-60} w={70} d={70} h={140} delay={1} />
        <IsoBuilding x={-50} y={-20} w={60} d={90} h={220} delay={2} />
        <IsoBuilding x={50} y={30} w={80} d={60} h={160} delay={0} />
        <IsoBuilding x={0} y={70} w={50} d={50} h={280} delay={3} isGold={true} />
        <IsoBuilding x={-80} y={100} w={60} d={60} h={110} delay={1.5} />
      </g>

      {/* Right Cluster */}
      <g transform="translate(950, 650)">
        <IsoBuilding x={60} y={-70} w={80} d={70} h={170} delay={2} />
        <IsoBuilding x={-40} y={-30} w={60} d={80} h={240} delay={1} />
        <IsoBuilding x={-110} y={20} w={70} d={60} h={150} delay={0.5} />
        <IsoBuilding x={-10} y={60} w={55} d={55} h={300} delay={2.5} isGold={true} />
        <IsoBuilding x={70} y={90} w={65} d={65} h={130} delay={1.8} />
      </g>
    </svg>
  </div>
);

const CategoryShortcuts = ({ onSelect, activeCategory }: { onSelect: (cat: string) => void, activeCategory?: string }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto mt-8 px-4">
    {[
      { id: 'Apartment', icon: Building2, label: 'Apartments' },
      { id: 'Villa', icon: Home, label: 'Villas' },
      { id: 'Plot', icon: Map, label: 'Plots' },
      { id: 'Commercial', icon: Store, label: 'Commercial' }
    ].map(cat => (
      <button 
        key={cat.id}
        onClick={() => onSelect(cat.id)}
        className={`w-full h-full p-5 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all duration-300 flex flex-col items-center justify-center gap-4 group active:scale-95 ${activeCategory === cat.id ? 'bg-navy border-navy shadow-premium' : 'bg-white border-beige-200 shadow-soft hover:shadow-premium hover:-translate-y-1.5 hover:border-gold/30'}`}
      >
        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${activeCategory === cat.id ? 'bg-white/10 text-gold' : 'bg-beige-50 text-navy group-hover:bg-navy group-hover:text-white'}`}>
          <cat.icon className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${activeCategory === cat.id ? 'text-white' : 'text-navy'}`}>{cat.label}</span>
      </button>
    ))}
  </div>
);

const TrustSection = () => (
  <section className="py-16 md:py-24 bg-white/20 backdrop-blur-sm border-y border-beige-100/20">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="text-center space-y-3 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-display font-semibold text-navy uppercase tracking-tight">Why Choose Brickova</h2>
        <p className="subtitle-premium opacity-70">The Gold Standard in Real Estate Transactions</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[
          { title: 'Verified Listings', desc: 'Every asset undergoes a rigorous multi-point verification protocol.', icon: ShieldCheck },
          { title: 'Direct Owner Deals', desc: 'Eliminate intermediary latency and engage directly with asset holders.', icon: Handshake },
          { title: 'Secure Transactions', desc: 'Institutional-grade security for all your property documentation.', icon: Lock },
          { title: 'Smart CRM for Agents', desc: 'Advanced pipeline management and lead tracking for top producers.', icon: BarChart3 }
        ].map((item, i) => (
          <div key={i} className="bg-beige-50 p-8 md:p-10 rounded-[2rem] border border-beige-200 space-y-5 group hover:bg-white hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-navy text-white rounded-2xl flex items-center justify-center text-xl shadow-navy group-hover:scale-110 transition-transform duration-300">
              <item.icon className="w-7 h-7 text-gold" />
            </div>
            <h3 className="text-sm md:text-base font-bold text-navy uppercase tracking-tight">{item.title}</h3>
            <p className="text-[10px] md:text-xs text-navy-muted font-normal leading-relaxed uppercase tracking-wider opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StatsStrip = () => (
  <section className="py-12 bg-navy/90 backdrop-blur-md text-white border-y border-white/5">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-white/10">
        {[
          { value: '1200+', label: 'Properties', icon: Building },
          { value: '85+', label: 'Agents', icon: UserRound },
          { value: '15+', label: 'Cities', icon: MapPin },
          { value: '300+', label: 'Happy Buyers', icon: Smile }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center justify-center text-center space-y-2 group">
            <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-gold/80 group-hover:text-gold group-hover:scale-110 transition-all duration-300 mb-2" />
            <span className="text-2xl md:text-3xl font-bold tracking-tighter">{stat.value}</span>
            <span className="subtitle-premium text-white/60">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CityExploration = ({ onCitySelect }: { onCitySelect: (city: string) => void }) => (
  <section className="py-16 md:py-24 bg-beige-50/10 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-navy uppercase tracking-tight">Explore Properties by City</h2>
          <p className="subtitle-premium opacity-70">Discover Prime Real Estate Across Major Metros</p>
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
              <h4 className="text-white font-bold uppercase tracking-widest text-xs md:text-sm mb-1">{city.name}</h4>
              <span className="text-[8px] md:text-[9px] font-semibold text-gold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                View Listings <ArrowRight className="w-2.5 h-2.5" />
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
      <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-navy-muted hover:text-navy flex items-center gap-1.5 transition-colors">
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
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

const CurrencyDropdown = ({ currency, setCurrency }: { currency: string, setCurrency: (c: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { val: 'INR', label: 'INR (₹)' },
    { val: 'USD', label: 'USD ($)' },
    { val: 'AED', label: 'AED (د.إ)' },
    { val: 'EUR', label: 'EUR (€)' }
  ];
  
  return (
    <div 
      className="relative hidden sm:flex items-center group h-full z-[100] cursor-pointer"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="bg-white text-[9px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-[1rem] border border-beige-200 text-navy shadow-xs hover:shadow-soft hover:border-gold/40 flex items-center gap-2 transition-all duration-300">
        <span className="opacity-90">{options.find(o => o.val === currency)?.label || currency}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-300 opacity-60 ${isOpen ? 'rotate-180 text-gold opacity-100' : ''}`} />
      </button>
      
      <div className={`absolute top-[110%] right-0 pt-1 w-36 transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-90 invisible'}`}>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_-10px_rgba(15,23,42,0.15)] border border-beige-200/60 overflow-hidden flex flex-col py-1.5">
          {options.map((opt) => (
            <button 
              key={opt.val} 
              onClick={() => { setIsOpen(false); setCurrency(opt.val); }}
              className={`text-left px-4 py-3 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between ${currency === opt.val ? 'text-gold bg-beige-50/50' : 'text-navy-muted hover:text-navy hover:bg-beige-50'}`}
            >
              <span className="translate-x-0 group-hover:translate-x-1 transition-transform">{opt.label}</span>
              {currency === opt.val && <Check className="w-3 h-3 animate-fade-in text-gold" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomSelect = ({ value, onChange, options, placeholder }: { value: string, onChange: (val: any) => void, options: {val: string, label: string}[], placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.val === value)?.label || placeholder;
  return (
    <div className="relative w-full h-full flex items-center group cursor-pointer" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button className="w-full flex items-center justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-navy outline-none bg-transparent py-2">
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-navy opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180 opacity-100 text-gold' : ''}`} />
      </button>
      
      <div className={`absolute top-[100%] left-0 md:-left-4 right-[-10px] md:right-[-20px] pt-4 z-50 transition-all duration-300 origin-top ${isOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
        <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_-15px_rgba(15,23,42,0.2)] border border-beige-200/80 overflow-hidden flex flex-col py-2 min-w-[200px] w-full max-w-[240px]">
          {options.map((opt) => (
            <button 
              key={opt.val} 
              onClick={() => { setIsOpen(false); onChange(opt.val); }}
              className={`text-left px-5 py-3.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-between group/btn ${value === opt.val ? 'text-gold bg-beige-50' : 'text-navy-muted hover:text-navy hover:bg-beige-50/50'}`}
            >
              <span className="translate-x-0 group-hover/btn:translate-x-1 transition-transform">{opt.label}</span>
              {value === opt.val && <Check className="w-3 h-3 text-gold animate-fade-in" />}
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'leads' | 'team' | 'analytics'>('dashboard');
  const [paymentResult, setPaymentResult] = useState<{ status: 'SUCCESS' | 'FAILURE', plan?: MembershipTier } | null>(null);

  useEffect(() => {
    const fetchAgency = async () => {
      if (user?.agencyId && db) {
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
    let unsubscribeProperties = () => {};
    
    if (db) {
      const q = query(collection(db, "properties"));
      unsubscribeProperties = onSnapshot(q, (snap) => {
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
      }, (error) => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
    } else {
      console.warn("Firestore 'db' is not initialized. Using mock data.");
      setLoading(false);
    }

    const unsubscribeAuth = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getCurrentUserDoc(firebaseUser.uid);
        if (userDoc) {
          setUser(userDoc);
          // Redirect to pricing if no plan is explicitly set
          if (!userDoc.plan) {
            setView('PRICING');
          }
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
              tier: userDoc.plan || MembershipTier.FREE
            };
            setAgentUser(agent);
          }
        }
      } else {
        setUser(null);
        setAgentUser(null);
      }
    });

    // Safety timeout to ensure loading screen is cleared even if Firebase hangs
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => {
      unsubscribeProperties();
      unsubscribeAuth();
      clearTimeout(safetyTimeout);
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
  const [idSearch, setIdSearch] = useState('');

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
      formatted = `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      formatted = `₹${(price / 100000).toFixed(1)} L`;
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
      // Dedicated ID search takes priority
      if (idSearch.trim()) {
        const idQ = idSearch.trim().replace('#', '').toLowerCase();
        const idMatch = (p.propertyCode || '').toLowerCase().includes(idQ);
        if (!idMatch) return false;
      }
      const searchQuery = (filters.query || '').trim();
      const isIdSearch = searchQuery.startsWith('#');
      const cleanQuery = isIdSearch ? searchQuery.slice(1).toLowerCase() : searchQuery.toLowerCase();
      let matchQuery = true;
      if (cleanQuery) {
        if (isIdSearch) {
          matchQuery = (p.propertyCode || '').toLowerCase() === cleanQuery || (p.propertyCode || '').toLowerCase().startsWith(cleanQuery);
        } else {
          const titleMatch = (p.title || '').toLowerCase().includes(cleanQuery);
          const locationMatch = (p.location || '').toLowerCase().includes(cleanQuery);
          const codeMatch = (p.propertyCode || '').toLowerCase().includes(cleanQuery);
          matchQuery = titleMatch || locationMatch || codeMatch;
        }
      }
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
      return matchQuery && matchCat && matchBhk && matchType && matchPropType;
    });
  }, [displayProperties, filters, view, shortlistedIds, idSearch]);

  const handleSelectPlan = async (plan: MembershipTier) => {
    if (!user) {
      setView('SELLERS'); // Redirect to login
      alert("Please login to upgrade your plan.");
      return;
    }
    
    try {
      const planInfo = (PRICING_PLANS as any)[plan];
      if (planInfo && planInfo.price > 0) {
        const paymentSuccess = await initializePayment(
          { ...planInfo, id: plan },
          { name: user.displayName, email: user.email, phone: user.phone }
        );
        
        if (!paymentSuccess) {
          setPaymentResult({ status: 'FAILURE' });
          return;
        }
      }

      await updatePlan(user.uid, plan);
      setPaymentResult({ status: 'SUCCESS', plan });
      
      const updatedUser = await getCurrentUserDoc(user.uid);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Payment/Plan update error:", error);
      setPaymentResult({ status: 'FAILURE' });
    }
  };

  const handleAddProperty = async (p: Property) => {
    if (!user) return;
    try {
      const newCount = (user.listingsUsed || 0) + 1;
      await updateListingsUsed(user.uid, newCount);
      setUser({ ...user, listingsUsed: newCount });
    } catch (error) {
      console.error("Error updating listings count:", error);
    }
  };
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
      tier: MembershipTier.BASIC
    };
    setAgentUser(agent);
  };

  return (
    <div className="min-h-screen bg-beige-50 text-navy font-sans selection:bg-gold selection:text-white flex flex-col relative">
      <ArchitecturalBackground />
      <BlueprintCorner />
      
      {/* Global Architectural Skin - Spanning Entire Height */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="relative w-full h-full">
          {/* Station 1: Header (Fixed/Sticky) */}
          <div className="sticky top-0 w-full h-screen">
            <BuildingSkyline />
            <ArchitecturalDrafting />
            <ThreeDLightLines />
            <ModernBuildingSilhouette />
            <IsometricCityscape />
          </div>

          {/* Station 2: Middle (Absolute Scrolled Position) */}
          <div className="absolute top-[150vh] left-0 w-full opacity-60 scale-x-[-1]">
             <BuildingSkyline />
             <ArchitecturalDrafting />
             <IsometricCityscape />
          </div>

          {/* Station 3: Bottom (Absolute Scrolled Position) */}
          <div className="absolute top-[300vh] left-0 w-full opacity-40">
             <BuildingSkyline />
             <ThreeDLightLines />
             <IsometricCityscape />
          </div>

          {/* Station 4: Footer area */}
          <div className="absolute bottom-0 left-0 w-full opacity-80 scale-125">
             <ArchitecturalDrafting />
             <IsometricCityscape />
          </div>
        </div>
      </div>
      <nav className="h-14 md:h-16 flex items-center sticky top-0 z-[100] glass-nav">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4 cursor-pointer group" onClick={() => { setView('MARKET'); setFilters({...filters, bhk: 'ALL', category: 'ALL'}); }}>
            <Logo className="h-9 md:h-10 w-auto shadow-soft group-hover:scale-105 transition-all" />
            <span className="text-[10px] sm:text-sm md:text-base font-bold text-navy tracking-tight uppercase font-sans">Brickova</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavDropdown 
              label="Buy & Rent" 
              items={[
                { label: 'Apartments', onClick: () => { setView('MARKET'); setFilters({...filters, propertyType: 'Apartment'}); } },
                { label: 'Villas', onClick: () => { setView('MARKET'); setFilters({...filters, propertyType: 'Villa'}); } },
                { label: 'Plots', onClick: () => { setView('MARKET'); setFilters({...filters, propertyType: 'Plot'}); } },
                { label: 'Commercial', onClick: () => { setView('MARKET'); setFilters({...filters, propertyType: 'Commercial'}); } }
              ]} 
            />
            <NavDropdown 
              label="Sell Property" 
              items={[
                { label: 'List Property', onClick: () => setView('SELLERS') },
                { label: 'Agent Dashboard', onClick: () => setView('SELLERS') }
              ]} 
            />
            <NavDropdown 
              label="Partner Hub" 
              items={[
                { label: 'Join as Agent', onClick: () => setView('AGENTS') },
                { label: 'Join as Agency', onClick: () => setView('AGENTS') },
                { label: 'Pricing Plans', onClick: () => setView('PRICING') }
              ]} 
            />
            <NavDropdown 
              label="About" 
              items={[
                { label: 'About Brickova', onClick: () => {} },
                { label: 'Contact', onClick: () => {} }
              ]} 
            />
            <button onClick={() => setView('SHORTLIST')} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'SHORTLIST' ? 'text-navy' : 'text-navy-muted hover:text-navy'}`}>Vault {shortlistedIds.length > 0 && <span className="bg-gold text-white min-w-[1rem] h-[1rem] rounded-full flex items-center justify-center text-[7px] font-bold px-1">{shortlistedIds.length}</span>}</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setIsUserMenuOpen(true)} className="hidden md:block text-navy hover:text-gold transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <CurrencyDropdown currency={currency} setCurrency={setCurrency} />
            {(user || agentUser) && (
              <div 
                onClick={() => {
                  if (user?.role === UserRole.AGENT || user?.role === UserRole.AGENCY_ADMIN) {
                    setView('AGENTS');
                    setActiveTab('dashboard');
                  } else {
                    setView('SELLERS');
                  }
                  setIsUserMenuOpen(false);
                }}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-gold p-0.5 shadow-premium shrink-0 cursor-pointer hover:scale-110 transition-transform active:scale-95 group relative overflow-hidden"
              >
                 <img src={user?.photo || agentUser?.photo} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                 <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            )}
            <div className="md:hidden flex items-center gap-2">
               <button onClick={() => setView('SHORTLIST')} className="w-9 h-9 flex items-center justify-center text-navy relative active:scale-90 transition-transform">
                  <Bookmark className="w-5 h-5" />
                  {shortlistedIds.length > 0 && <span className="absolute top-1 right-1 bg-gold text-white w-4 h-4 rounded-full text-[7px] flex items-center justify-center font-bold shadow-soft">{shortlistedIds.length}</span>}
               </button>
               <button onClick={() => setIsUserMenuOpen(true)} className="w-9 h-9 flex items-center justify-center text-navy active:scale-90 transition-transform">
                  <Menu className="w-6 h-6" />
               </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="md:hidden flex items-center justify-around bg-white/80 backdrop-blur-md border-b border-beige-200 px-2 py-3 sticky top-14 z-[90] shadow-sm">
         <button onClick={() => setView('MARKET')} className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${view === 'MARKET' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Explore</button>
         <button onClick={() => setView('SELLERS')} className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${view === 'SELLERS' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Sell</button>
         <button onClick={() => setView('AGENTS')} className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${view === 'AGENTS' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted'}`}>Agents</button>
      </div>

      <UserMenuDrawer 
        isOpen={isUserMenuOpen} 
        onClose={() => setIsUserMenuOpen(false)} 
        user={user}
        onNavigate={(action, navFilters) => {
          if (action === 'LOGOUT') {
            handleAgentLogout();
          } else if (action === 'DASHBOARD') {
            setView('AGENTS');
            setActiveTab('dashboard');
          } else if (action === 'LEADS') {
            setView('AGENTS');
            setActiveTab('leads');
          } else if (action === 'LISTINGS') {
            setView('AGENTS');
            setActiveTab('listings');
          } else if (action === 'TEAM') {
            setView('AGENTS');
            setActiveTab('team');
          } else if (action === 'MARKET') {
            setView('MARKET');
            if (navFilters) setFilters(prev => ({ ...prev, ...navFilters }));
          } else if (action === 'SHORTLIST') {
            setView('SHORTLIST');
          } else if (action === 'SELLERS') {
            setView('SELLERS');
          } else if (action === 'AGENTS') {
            setView('AGENTS');
          } else if (action === 'PRICING') {
            setView('PRICING');
          }
          setIsUserMenuOpen(false);
        }}
      />

      {/* Payment Status Modal */}
      {paymentResult && (
        <PaymentStatus 
          status={paymentResult.status}
          planName={paymentResult.plan ? (PRICING_PLANS as any)[paymentResult.plan]?.name : undefined}
          onClose={() => setPaymentResult(null)}
          onDashboard={() => {
            setPaymentResult(null);
            if (user?.role === UserRole.AGENT || user?.role === UserRole.AGENCY_ADMIN) {
              setView('AGENTS');
              setActiveTab('dashboard');
            } else {
              setView('SELLERS');
            }
          }}
        />
      )}

      <main className="flex-1">
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-gold" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">Synchronizing Asset Data...</p>
            </div>
          </div>
        ) : (
          <>
            {(view === 'MARKET' || view === 'SHORTLIST') && (
          <div className="duration-700">
            <header className="relative min-h-[25vh] md:min-h-[25vh] lg:min-h-[30vh] flex flex-col items-center justify-center text-center px-4 md:px-8 overflow-hidden bg-gradient-to-b from-white/40 via-beige-50/40 to-transparent border-b border-beige-100/10 py-8 md:py-12 lg:py-14">
              <div className="absolute inset-0 z-0 hero-texture pointer-events-none"></div>
              <div className="relative z-10 w-full max-w-6xl mx-auto space-y-5 md:space-y-6">
                <div className="space-y-3 md:space-y-4 px-2">
                  {view === 'SHORTLIST' ? (
                    <>
                      <h1 className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight text-navy uppercase leading-tight font-display px-4">
                        YOUR PRIVATE SELECTION
                      </h1>
                      <p className="max-w-xl mx-auto text-navy-muted font-medium text-[10px] md:text-[12px] uppercase tracking-wider opacity-80 leading-relaxed px-6">
                        Curated assets in your personal vault.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-navy/5 border border-navy/10 text-navy font-bold uppercase tracking-widest text-[8px] md:text-[10px] mx-auto">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
                        Institutional Grade Real Estate
                      </div>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-[900] text-navy tracking-tight leading-[0.95]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        THE FUTURE OF <br className="hidden md:block" />
                        <span className="text-slate-700 italic">ASSET EXCHANGE</span>
                      </h1>
                      <p className="mt-4 md:mt-6 text-[10px] md:text-xs text-slate-600 font-semibold max-w-2xl mx-auto leading-relaxed uppercase tracking-widest">
                        Buy and sell properties directly with owners. <br className="hidden md:block" />
                        No middlemen. Verified property listings.
                      </p>
                    </>
                  )}
                </div>
                
                {view === 'MARKET' && (
                  <>
                    {/* Dedicated Property ID Search */}
                    <div className="max-w-md mx-auto mb-4 mx-2 relative z-50">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                          <span className="text-[11px] font-black text-gold uppercase tracking-widest">#</span>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Enter Property ID (e.g. 1001)" 
                          className="w-full pl-10 pr-12 py-3.5 bg-white/95 backdrop-blur-xl rounded-full border-2 border-gold/20 text-sm font-bold text-navy outline-none placeholder:text-navy-muted/30 tracking-wider text-center focus:border-gold/60 focus:shadow-[0_0_20px_rgba(184,146,106,0.15)] transition-all duration-300" 
                          value={idSearch} 
                          onChange={(e) => setIdSearch(e.target.value.replace(/[^0-9]/g, ''))} 
                          maxLength={4}
                        />
                        {idSearch && (
                          <button 
                            onClick={() => setIdSearch('')} 
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-navy-muted hover:text-navy transition-colors"
                          >
                            <span className="text-sm">×</span>
                          </button>
                        )}
                      </div>

                      {/* Popup Results Panel */}
                      {idSearch && (() => {
                        const idQ = idSearch.trim().toLowerCase();
                        const matches = displayProperties.filter(p => (p.propertyCode || '').toLowerCase().includes(idQ));
                        return (
                          <div className="absolute left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(15,23,42,0.2)] border border-beige-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="px-5 py-3 border-b border-beige-100 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-navy-muted uppercase tracking-widest">{matches.length} Result{matches.length !== 1 ? 's' : ''} Found</span>
                              <span className="text-[9px] font-black text-gold uppercase tracking-widest">#{idSearch}</span>
                            </div>
                            {matches.length > 0 ? (
                              <div className="max-h-[300px] overflow-y-auto">
                                {matches.map(p => (
                                  <button
                                    key={p.id}
                                    onClick={() => { setSelectedProperty(p); setView('DETAILS'); setIdSearch(''); }}
                                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-beige-50 transition-all border-b border-beige-50 last:border-0 group/item text-left"
                                  >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-beige-200 shrink-0">
                                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200'} alt={p.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 bg-gold/10 border border-gold/20 rounded text-[8px] font-black text-gold uppercase tracking-widest">#{p.propertyCode}</span>
                                        {p.isVerified && <ShieldCheck className="w-3 h-3 text-green-500" />}
                                      </div>
                                      <p className="text-[12px] font-bold text-navy truncate leading-tight">{p.title}</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-3 h-3 text-gold" />
                                        <span className="text-[9px] font-semibold text-navy-muted uppercase tracking-wider truncate">{p.location}</span>
                                      </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <p className="text-[13px] font-black text-navy">₹{(p.price || 0) >= 10000000 ? `${(p.price / 10000000).toFixed(1)}Cr` : (p.price || 0) >= 100000 ? `${(p.price / 100000).toFixed(1)}L` : p.price?.toLocaleString()}</p>
                                      <p className="text-[8px] font-bold text-navy-muted uppercase tracking-wider">{p.sqft} sqft</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-navy-muted opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="py-8 text-center">
                                <p className="text-[11px] font-bold text-navy-muted uppercase tracking-widest">No property found with ID #{idSearch}</p>
                                <p className="text-[9px] font-semibold text-navy-muted/50 uppercase tracking-wider mt-1">Try a different code</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-[2rem] p-1.5 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] border border-beige-200/60 hover:shadow-[0_20px_40px_-5px_rgba(184,146,106,0.15)] hover:border-gold/30 transition-all duration-500 flex flex-col md:flex-row items-stretch gap-1 md:gap-0 mx-2">
                      <div className="flex-[2] flex items-center px-5 md:px-7 py-3 md:py-4 border-b md:border-b-0 md:border-r border-beige-100/50 group">
                        <Search className="w-4 h-4 text-navy opacity-30 group-focus-within:opacity-100 group-focus-within:text-gold transition-colors mr-3.5" />
                        <input type="text" placeholder="Search by ID (#1234), city or project..." className="bg-transparent w-full text-[10px] md:text-xs font-bold text-navy outline-none placeholder:text-navy-muted/40 uppercase tracking-widest placeholder:font-semibold" value={filters.query} onChange={(e) => setFilters({...filters, query: e.target.value})} />
                      </div>
                      
                      <div className="flex-1 flex items-center px-5 md:px-6 py-2 md:py-3 border-b md:border-b-0 md:border-r border-beige-100/50 relative">
                        <CustomSelect 
                          value={filters.category} 
                          onChange={(val) => setFilters({...filters, category: val})}
                          placeholder="All Categories"
                          options={[
                            {val: 'ALL', label: 'All Categories'},
                            {val: PropertyCategory.PLOT, label: 'Plots / Land'},
                            {val: PropertyCategory.DEVELOPED, label: 'Flats / Villas'}
                          ]}
                        />
                      </div>

                      <div className="flex-1 flex items-center px-5 md:px-6 py-2 md:py-3 relative">
                        <CustomSelect 
                          value={filters.bhk} 
                          onChange={(val) => setFilters({...filters, bhk: val})}
                          placeholder="BHK Config"
                          options={[
                            {val: 'ALL', label: 'BHK Config'},
                            {val: BHKType.BHK1, label: '1 BHK'},
                            {val: BHKType.BHK2, label: '2 BHK'},
                            {val: BHKType.BHK3, label: '3 BHK'},
                            {val: BHKType.BHK4, label: '4+ BHK'}
                          ]}
                        />
                      </div>

                      <button className="bg-navy hover:bg-navy-ultra text-white px-8 md:px-12 py-4 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-lg hover:shadow-xl rounded-full active:scale-95 transition-all duration-300 m-1 flex-shrink-0">
                        Search
                      </button>
                    </div>
                    <CategoryShortcuts 
                      activeCategory={filters.propertyType}
                      onSelect={(cat) => {
                        setFilters(prev => ({
                          ...prev, 
                          propertyType: prev.propertyType === cat ? 'ALL' : cat
                        }));
                        const el = document.getElementById('inventory-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }} 
                    />
                  </>
                )}
              </div>
            </header>

            {view === 'MARKET' && (
              <section className="py-12 md:py-16 bg-transparent">
                <div className="max-w-[1600px] mx-auto px-6 md:px-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
                    <div className="space-y-2">
                      <h2 className="text-2xl md:text-4xl font-display font-semibold text-navy uppercase tracking-tight">Featured Properties</h2>
                      <p className="subtitle-premium opacity-70">Handpicked Premium Assets for Discerning Investors</p>
                    </div>
                    <button onClick={() => {
                      const el = document.getElementById('inventory-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }} className="text-[10px] font-bold uppercase tracking-widest text-gold hover:underline">View All Properties</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
                    {displayProperties.slice(0, 3).map(p => (
                      <PropertyCard 
                        key={p.id}
                        property={p} 
                        isShortlisted={shortlistedIds.includes(p.id)} 
                        onToggleShortlist={() => toggleShortlist(p.id)} 
                        onSelect={(p) => { setSelectedProperty(p); setView('DETAILS'); }} 
                        formatPrice={(price) => formatPriceShorthand(price, p.type)} 
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {view === 'MARKET' && (
              <>
                <CityExploration onCitySelect={(city) => {
                  setFilters(prev => ({ ...prev, query: city }));
                  const el = document.getElementById('inventory-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} />
                <StatsStrip />
                <TrustSection />
              </>
            )}

            {(view === 'SHORTLIST' || filters.query || filters.category !== 'ALL' || filters.bhk !== 'ALL' || filters.propertyType) && (
              <div id="inventory-section" className="max-w-[1600px] mx-auto px-6 md:px-10 py-12 md:py-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-4xl font-display font-semibold text-navy uppercase tracking-tight">
                      {view === 'SHORTLIST' ? 'YOUR PRIVATE SELECTION' : 'Available Inventory'}
                    </h2>
                    <p className="subtitle-premium opacity-70">
                      {view === 'SHORTLIST' ? 'Curated assets in your personal vault' : 'Direct Listings from Verified Owners'}
                    </p>
                  </div>
                </div>
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
                    {filteredProperties.map(p => (
                      <PropertyCard key={p.id} property={p} isShortlisted={shortlistedIds.includes(p.id)} onToggleShortlist={() => toggleShortlist(p.id)} onSelect={(p) => { setSelectedProperty(p); setView('DETAILS'); }} formatPrice={(price) => formatPriceShorthand(price, p.type)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 md:py-32 bg-white rounded-[2rem] border border-beige-100 shadow-soft max-w-2xl mx-auto px-6">
                    <FolderOpen className="w-10 h-10 md:w-12 md:h-12 text-beige-200 mb-6 mx-auto" />
                    <p className="text-navy-muted font-bold uppercase tracking-widest text-[10px] md:text-[11px]">No matches found for your criteria</p>
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
              <OwnerDashboard 
                properties={properties} 
                onAddProperty={handleAddProperty} 
                onUpdateProperty={handleUpdateProperty} 
                onDeleteProperty={handleDeleteProperty} 
                onUpdateAvailability={() => {}} 
                role="OWNER" 
                onLogout={handleSellerLogout} 
                user={user}
                onUpgrade={() => setView('PRICING')}
              />
            )}
          </div>
        )}
        {view === 'AGENTS' && (
          <div className="max-w-7xl mx-auto w-full px-0 md:px-8">
            {!user ? (
              <SellerLoginView onLoginSuccess={setUser} />
            ) : !agentUser ? (
              <AgentRegistrationView currentUser={user} onRegistrationSuccess={handleAgentRegistration} existingAgencies={agencies} />
            ) : (
              <CommandCenter 
                properties={properties} 
                onEdit={(p) => { setSelectedProperty(p); setView('DETAILS'); }} 
                onDelete={handleDeleteProperty} 
                onAddProperty={handleAddProperty} 
                onBackToMarket={() => setView('MARKET')} 
                agentProfile={agentUser} 
                agency={currentAgency || undefined}
                allAgents={agents} 
                allLeads={[]} 
                onUpdateLead={() => {}} 
                onLogout={handleAgentLogout} 
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                onUpgrade={() => setView('PRICING')}
              />
            )}
          </div>
        )}
        {view === 'PRICING' && (
          <Pricing onSelectPlan={handleSelectPlan} currentPlan={user?.plan} />
        )}
      </>
    )}
      </main>
      
      <footer className="bg-navy py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 md:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-navy shadow-soft">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold uppercase tracking-widest font-display">Brickova</span>
              </div>
              <p className="text-xs text-white/40 font-medium leading-relaxed uppercase tracking-wider">
                India's premier real estate network for direct owner transactions and institutional-grade asset management.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold">Platform</h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">How it Works</li>
                <li className="hover:text-white transition-colors cursor-pointer">Partner Hub</li>
                <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold">Explore</h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                <li className="hover:text-white transition-colors cursor-pointer">Hyderabad</li>
                <li className="hover:text-white transition-colors cursor-pointer">Bangalore</li>
                <li className="hover:text-white transition-colors cursor-pointer">Mumbai</li>
                <li className="hover:text-white transition-colors cursor-pointer">Pune</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold">Legal</h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-white/60">
                <li><a href="/legal/TERMS_OF_SERVICE.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a></li>
                <li><a href="/legal/PRIVACY_POLICY.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
                <li><a href="/legal/COOKIE_PROTOCOL.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Cookie Protocol</a></li>
                <li><a href="/legal/CONTACT_SUPPORT.md" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
              © 2026 Brickova. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Globe className="w-5 h-5 text-white/20 hover:text-gold transition-colors cursor-pointer" />
              <Globe className="w-5 h-5 text-white/20 hover:text-gold transition-colors cursor-pointer" />
              <Globe className="w-5 h-5 text-white/20 hover:text-gold transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
      <AIAssistant properties={properties} />
    </div>
  );
};

export default App;
