import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, ServicesPageData } from '../services/apiService';

interface ServicesPageProps {
  onDemoClick: () => void;
}

export default function ServicesPage({ onDemoClick }: ServicesPageProps) {
  const [data, setData] = useState<ServicesPageData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    wireframe: true,
    mep: false,
    iot: false,
    staging: true
  });
  
  const [activeView, setActiveView] = useState<'ISO' | 'FRONT' | 'TOP' | 'SIDE' | 'BACK'>('ISO');
  const [splitPercent, setSplitPercent] = useState(50);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  useEffect(() => {
    apiService.fetchServicesData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const toggleLayer = (l: string) => {
    setActiveLayers(prev => ({ ...prev, [l]: !prev[l] }));
  };

  const getViewImage = (view: 'ISO' | 'FRONT' | 'TOP' | 'SIDE' | 'BACK') => {
    switch (view) {
      case 'ISO': return '/3D Digital Images/ Isometric View.png';
      case 'TOP': return '/3D Digital Images/Top-Down View.png';
      case 'FRONT': return '/3D Digital Images/Front Elevation View.png';
      case 'SIDE': return '/3D Digital Images/Side Elevation View.png';
      case 'BACK': return '/3D Digital Images/Back Elevation View.png';
    }
  };

  const layersInfo = data?.simulationLayers || [];

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-circle-notch animate-spin text-4xl text-gold"></i>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Fetching Twin Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 L100,0 L100,100 Z" fill="#d4af37" />
            <path d="M0,100 L50,50 L50,100 Z" fill="#ffffff" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 font-montserrat"
          >
            Institutional-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200">Real Estate</span> Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From AI-powered digital twins to blockchain-verified transactions, experience the future of property lifecycle management.
          </motion.p>
        </div>
      </section>

      {/* 3D Digital Twin Viewer Section */}
      <section className="py-16 md:py-24 bg-beige-50 border-y border-beige-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tighter mb-2">Interactive 3D Digital Twins</h2>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-navy-muted">Real-time simulation engine</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Viewer Controls - Left */}
            <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
              <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-beige-200 shadow-premium">
                <h3 className="text-sm font-black uppercase tracking-widest text-navy mb-6">Simulation Layers</h3>
                <div className="space-y-4">
                  {layersInfo.map(layer => (
                    <button 
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className={`w-full flex items-start justify-between p-4 rounded-xl border transition-all text-left ${activeLayers[layer.id] ? 'border-navy bg-navy/5 shadow-soft' : 'border-beige-200 bg-white hover:border-beige-300'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full ${layer.color} shadow-sm mt-1 flex-shrink-0 ${activeLayers[layer.id] ? 'opacity-100' : 'opacity-20'}`}></div>
                        <div className="text-left">
                          <div className={`text-xs font-black uppercase tracking-wider ${activeLayers[layer.id] ? 'text-navy' : 'text-navy-muted'}`}>{layer.name}</div>
                          <div className="text-[10px] font-bold tracking-wider text-gold mt-0.5">{layer.title}</div>
                          <div className="text-[9px] font-medium leading-relaxed text-navy-muted/85 mt-1.5">{layer.desc}</div>
                        </div>
                      </div>
                      <div className={`w-8 h-4 rounded-full transition-colors relative mt-1 flex-shrink-0 ${activeLayers[layer.id] ? 'bg-navy' : 'bg-beige-200'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${activeLayers[layer.id] ? 'left-[18px]' : 'left-0.5'}`}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Viewer Canvas - Right (Image Linked) */}
            <div className="lg:col-span-8 order-1 lg:order-2 w-full">
              <div className="bg-[#EAE8E3] rounded-[2rem] relative aspect-[3/2] w-full overflow-hidden shadow-2xl border border-beige-200 group flex items-center justify-center">
                
                {/* 3D Static Image Container */}
                <div className="w-full h-full absolute inset-0 transition-transform duration-1000 ease-out">
                  <AnimatePresence mode="wait">
                    {/* Render corresponding view image */}
                    <motion.div 
                      key={activeView}
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 w-full h-full"
                    >
                       <img 
                         src={getViewImage(activeView)} 
                         alt={`${activeView} Floor Plan`} 
                         className={`w-full h-full object-cover transition-all duration-700 ${activeLayers.staging ? 'filter-none' : 'brightness-[0.72] saturate-[0.08] contrast-[1.08] sepia-[0.12]'}`}
                       />
                       
                       {/* Interactive SVG Zones Overlay mapped on top of image */}
                       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full drop-shadow-xl z-20">
                         {(data.roomsData[activeView] || []).map((room) => (
                           <g key={room.id}
                              onMouseEnter={() => setHoveredRoom(room.id)}
                              onMouseLeave={() => setHoveredRoom(null)}
                              className="cursor-pointer transition-all duration-300"
                           >
                             <path 
                               d={room.path} 
                               fill={room.fill}
                               stroke={hoveredRoom === room.id ? "rgba(212,175,55,1)" : "rgba(212,175,55,0.4)"}
                               strokeWidth={hoveredRoom === room.id ? "0.8" : "0.3"}
                               className={`transition-all duration-300 ${hoveredRoom === room.id ? 'opacity-100 saturate-150' : 'opacity-0 hover:opacity-100'}`}
                             />
                             {/* Isometric Floating Label */}
                             {hoveredRoom === room.id && (
                               <g>
                                 <rect x="35" y="10" width="30" height="8" rx="2" fill="rgba(10, 16, 29, 0.9)" stroke="rgba(212,175,55,0.5)" strokeWidth="0.5" />
                                 <text x="50" y="15.5" fill="white" fontSize="3.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.1em" opacity="1">
                                   {room.name.toUpperCase()}
                                 </text>
                               </g>
                             )}
                           </g>
                         ))}
                       </svg>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Layer 2: Wireframe Overlay (Mapped dynamically based on view) */}
                {activeLayers.wireframe && (
                  <motion.svg 
                    key={`wireframe-${activeView}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-10"
                  >
                    {activeView === 'ISO' && (
                      <g stroke="rgba(30, 58, 138, 0.8)" strokeWidth="0.5" fill="none">
                        <path d="M 20,60 L 60,80 L 98,50 L 60,35 Z" strokeDasharray="1 1" />
                        <path d="M 40,50 L 60,60 L 80,45" strokeDasharray="1 1" />
                      </g>
                    )}
                    {activeView === 'TOP' && (
                      <g stroke="rgba(30, 58, 138, 0.8)" strokeWidth="0.5" fill="none">
                        <rect x="15" y="20" width="70" height="65" strokeDasharray="1 1" />
                        <line x1="50" y1="20" x2="50" y2="85" strokeDasharray="1 1" />
                        <line x1="15" y1="65" x2="85" y2="65" strokeDasharray="1 1" />
                      </g>
                    )}
                    {activeView === 'FRONT' && (
                      <g stroke="rgba(30, 58, 138, 0.8)" strokeWidth="0.5" fill="none">
                        <path d="M 10,70 L 45,85 L 80,75 L 45,60 Z" strokeDasharray="1 1" />
                        <line x1="45" y1="30" x2="45" y2="85" strokeDasharray="1 1" />
                      </g>
                    )}
                    {activeView === 'SIDE' && (
                      <g stroke="rgba(30, 58, 138, 0.8)" strokeWidth="0.5" fill="none">
                        <path d="M 15,70 L 50,85 L 85,75" strokeDasharray="1 1" />
                        <line x1="50" y1="35" x2="50" y2="85" strokeDasharray="1 1" />
                      </g>
                    )}
                    {activeView === 'BACK' && (
                      <g stroke="rgba(30, 58, 138, 0.8)" strokeWidth="0.5" fill="none">
                        <path d="M 20,65 L 55,80 L 90,70" strokeDasharray="1 1" />
                        <line x1="55" y1="30" x2="55" y2="80" strokeDasharray="1 1" />
                      </g>
                    )}
                  </motion.svg>
                )}

                {/* Layer 3: MEP Systems Overlay */}
                {activeLayers.mep && (
                  <motion.svg 
                    key={`mep-${activeView}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-10"
                  >
                    <path d="M 40,50 L 65,65 L 85,50" stroke="#3b82f6" strokeWidth="1.2" fill="none" opacity="0.9" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 60,35 L 85,50" stroke="#fbbf24" strokeWidth="0.8" strokeDasharray="1 1" fill="none" opacity="0.9" strokeLinecap="round" />
                    <path d="M 45,70 L 60,80" stroke="#ef4444" strokeWidth="1" fill="none" opacity="0.9" strokeLinecap="round" />
                  </motion.svg>
                )}

                {/* Layer 4: IoT Sensors Overlay */}
                {activeLayers.iot && (
                  <motion.svg 
                    key={`iot-${activeView}`}
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-lg z-10"
                  >
                    <g fill="#10b981">
                      <circle cx="50" cy="50" r="1.5" />
                      <circle cx="75" cy="45" r="1.5" />
                      <circle cx="55" cy="70" r="1.5" />
                      <circle cx="35" cy="65" r="2" fill="#d4af37" />
                    </g>
                    <g stroke="#10b981" strokeWidth="0.3" strokeDasharray="0.5 1" fill="none" opacity="0.8">
                      <line x1="35" y1="65" x2="50" y2="50" />
                      <line x1="35" y1="65" x2="75" y2="45" />
                      <line x1="35" y1="65" x2="55" y2="70" />
                    </g>
                    <circle cx="35" cy="65" r="5" stroke="#d4af37" strokeWidth="0.5" fill="none" opacity="0.5">
                      <animate attributeName="r" values="0;10" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </motion.svg>
                )}
                
                {/* On-canvas view controllers - Elegant Top HUD */}
                <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between items-center gap-3 z-20">
                   <div className="bg-navy/80 backdrop-blur-md px-3 py-2 rounded-lg border border-navy/20 text-gold font-mono text-[9px] tracking-widest uppercase shadow-lg select-none">
                      Render: <span className="text-white">{activeView} VIEW</span>
                   </div>
                   
                   <div className="bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-xl border border-beige-200 shadow-premium flex gap-1">
                     {(['ISO', 'FRONT', 'TOP', 'SIDE', 'BACK'] as const).map(v => (
                       <button
                         key={v}
                         onClick={() => setActiveView(v)}
                         className={`px-3 py-1 text-[8px] font-black tracking-widest rounded-lg transition-all active:scale-95 ${activeView === v ? 'bg-navy text-gold shadow-md scale-105' : 'text-navy-muted hover:text-navy hover:bg-beige-50'}`}
                       >
                         {v}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>

          </div>

          {/* Virtual Staging Splitter */}
          <div className="mt-16 bg-white rounded-[2rem] p-6 md:p-12 border border-beige-200 shadow-premium max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tighter mb-2 font-montserrat">AI Virtual Staging</h3>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-navy-muted">Transform raw shells into luxury interiors instantly</p>
            </div>
            
            <div className="relative aspect-square md:aspect-[4/3] max-w-3xl mx-auto w-full rounded-2xl overflow-hidden cursor-ew-resize select-none border border-beige-200"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                setSplitPercent((x / rect.width) * 100);
              }}
              onTouchMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                setSplitPercent((x / rect.width) * 100);
              }}
            >
              {/* After (Furnished) */}
              <div className="absolute inset-0">
                <img src="/images/furnished_luxury_room_1781759361262.png" alt="Furnished" className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-navy/80 backdrop-blur text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">AI Staged</div>
              </div>
              
              {/* Before (Raw) */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}>
                <img src="/images/matching_raw_shell_1781759922600.png" alt="Raw" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">Raw Shell</div>
              </div>

              {/* Splitter Line */}
              <div className="absolute top-0 bottom-0 w-1 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)] z-10" style={{ left: `${splitPercent}%`, transform: 'translateX(-50%)' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gold shadow-lg flex items-center justify-center pointer-events-none">
                  <i className="fa-solid fa-arrows-left-right text-gold text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Breakdown */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tighter mb-2 font-montserrat">Ecosystem Architecture</h2>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-navy-muted">Full-stack solutions for the real estate lifecycle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {data.ecosystemCards.map((srv, i) => (
              <div key={i} className="group relative rounded-[2rem] overflow-hidden bg-beige-50 border border-beige-200 shadow-soft hover:shadow-premium transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  {/* Premium Desaturated and Dimmed background image matching Image 2 */}
                  <img 
                    src={srv.img} 
                    alt={srv.title} 
                    className="w-full h-full object-cover brightness-[0.4] saturate-[0.6] group-hover:scale-105 group-hover:brightness-[0.45] transition-all duration-700" 
                  />
                  {/* Sleek Blue/Navy backdrop filter/color tint overlay */}
                  <div className="absolute inset-0 bg-navy/35 mix-blend-multiply opacity-80 group-hover:opacity-65 transition-opacity"></div>
                </div>
                {/* Gold squircle badge in the top-left corner */}
                <div className="absolute top-6 left-6 bg-gold/15 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center border border-gold/25 shadow-md">
                  <i className={`fa-solid ${srv.icon} text-gold text-lg`}></i>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-2 text-left">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white font-montserrat">{srv.title}</h3>
                  <p className="text-xs font-semibold text-white/65 leading-relaxed uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2 text-gold font-montserrat">The Brickova Advantage</h2>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/65">Beyond legacy listing portals</p>
          </div>

          <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 md:p-6 text-xs font-black uppercase tracking-widest text-white/50 w-1/3">Feature</th>
                  <th className="p-4 md:p-6 text-xs font-black uppercase tracking-widest text-gold w-1/3 border-x border-white/10 bg-white/5 text-center">Brickova Enterprise</th>
                  <th className="p-4 md:p-6 text-xs font-black uppercase tracking-widest text-white/50 w-1/3 text-center">Legacy Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.comparisons.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 md:p-6 text-[10px] md:text-xs font-bold uppercase tracking-wider">{row.feat}</td>
                    <td className="p-4 md:p-6 border-x border-white/10 bg-white/5 text-center">
                      <i className="fa-solid fa-check text-green-400"></i>
                    </td>
                    <td className="p-4 md:p-6 text-center">
                      {row.them ? <i className="fa-solid fa-check text-white/30"></i> : <i className="fa-solid fa-xmark text-red-400/50"></i>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-beige-50 border-t border-beige-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-navy uppercase tracking-tighter mb-6 font-montserrat">Ready to upgrade?</h2>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-navy-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Deploy the ultimate real estate tech stack for your agency or portfolio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onDemoClick}
              className="px-8 py-4 bg-navy text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-gold transition-colors shadow-premium flex items-center gap-2 cursor-pointer"
            >
              Book Enterprise Demo <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button 
              onClick={() => window.scrollTo(0, 0)}
              className="px-8 py-4 bg-white text-navy border-2 border-navy text-xs font-black uppercase tracking-widest rounded-full hover:bg-navy hover:text-white transition-colors cursor-pointer"
            >
              Explore Market
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
