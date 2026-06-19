import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock types
type UnitStatus = 'AVAILABLE' | 'BLOCKED' | 'SOLD';
interface ApartmentUnit {
  id: string;
  floor: number;
  number: string;
  status: UnitStatus;
  bhk: string;
  sqft: number;
  price: number;
}

interface LeadCard {
  id: string;
  name: string;
  interest: string;
  budget: string;
  stage: 'leads' | 'nurtured' | 'visit' | 'blocked' | 'closed';
}

const FeaturesPage: React.FC<{ onDemoClick?: () => void }> = ({ onDemoClick }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'crm' | 'timeline' | 'ai'>('inventory');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. Interactive Inventory State
  const initialUnits: ApartmentUnit[] = [];
  for (let f = 5; f >= 1; f--) {
    for (let u = 1; u <= 4; u++) {
      const id = `${f}0${u}`;
      // Seed initial states
      let status: UnitStatus = 'AVAILABLE';
      if ((f === 4 && u === 2) || (f === 2 && u === 4)) status = 'BLOCKED';
      if ((f === 5 && u === 1) || (f === 3 && u === 3) || (f === 1 && u === 2)) status = 'SOLD';

      initialUnits.push({
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

  const [units, setUnits] = useState<ApartmentUnit[]>(initialUnits);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('502');

  const selectedUnit = units.find(u => u.id === selectedUnitId) || units[0];

  const handleToggleUnitBlock = (id: string) => {
    setUnits(prev => prev.map(u => {
      if (u.id === id) {
        let newStatus: UnitStatus = 'AVAILABLE';
        if (u.status === 'AVAILABLE') newStatus = 'BLOCKED';
        else if (u.status === 'BLOCKED') newStatus = 'AVAILABLE';
        else return u; // Can't block/unblock sold units
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  // 2. Interactive CRM State
  const [leads, setLeads] = useState<LeadCard[]>([
    { id: 'l1', name: 'Rohan Kuruvilla', interest: '3 BHK Garden Villa', budget: '₹1.8 Cr', stage: 'leads' },
    { id: 'l2', name: 'Dr. Sneha Murthy', interest: '2 BHK Smart Apt', budget: '₹95 Lakhs', stage: 'nurtured' },
    { id: 'l3', name: 'Amit & Ritu Goel', interest: '4 BHK Sky Penthouse', budget: '₹4.2 Cr', stage: 'visit' },
    { id: 'l4', name: 'Vikram Malhotra', interest: '3 BHK Corner Flat', budget: '₹1.4 Cr', stage: 'blocked' },
    { id: 'l5', name: 'Kavitha Rao', interest: 'Commercial Office Space', budget: '₹2.8 Cr', stage: 'closed' }
  ]);

  const advanceLeadStage = (leadId: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const stages: LeadCard['stage'][] = ['leads', 'nurtured', 'visit', 'blocked', 'closed'];
        const nextIndex = (stages.indexOf(l.stage) + 1) % stages.length;
        return { ...l, stage: stages[nextIndex] };
      }
      return l;
    }));
  };

  // 3. Timeline State
  const [selectedTimelineIndex, setSelectedTimelineIndex] = useState<number>(2);
  const timelineStages = [
    { name: "Excavation", status: "Completed", progress: 100, date: "July 2025", desc: "Foundation pit completed, soil reinforcement anchors installed.", contractor: "L&T Infra Group" },
    { name: "Foundation Pouring", status: "Completed", progress: 100, date: "Oct 2025", desc: "Piling and main concrete foundation raft fully cured and certified.", contractor: "L&T Infra Group" },
    { name: "Slab & Core", status: "In Progress", progress: 65, date: "March 2026", desc: "Tower A slab casting at level 14. Core vertical shear walls under structure inspection.", contractor: "UltraTech PMC" },
    { name: "MEP Piping", status: "Scheduled", progress: 0, date: "August 2026", desc: "Mechanical, electrical, plumbing routing installations for lower block towers.", contractor: "Voltas Systems" },
    { name: "Finishing & Handover", status: "Scheduled", progress: 0, date: "Dec 2026", desc: "Interior drywall, flooring, landscaping, and regulatory occupancy checks.", contractor: "Brickova Ops" }
  ];

  // 4. AI Sandbox state
  const [activeAIQuery, setActiveAIQuery] = useState<string | null>(null);
  const [aiOutput, setAiOutput] = useState<string>('Select an analytical query below to trigger Brickova Copilot insights.');

  const triggerAIQuery = (queryType: string) => {
    setActiveAIQuery(queryType);
    setAiOutput('Initializing neural models... compiling pipeline telemetry...');
    setTimeout(() => {
      if (queryType === 'velocity') {
        setAiOutput(`[BRICKOVA REPORT - SALES VELOCITY FORECAST]
Analyzing Jubilee Hills & Gachibowli Q3 Absorption rates.
Current Inventory: 42 Units.
Forecasted absorption: 18 units / month (+12% MoM increase).
Recommendation: Incremental price increase of 2.5% for all available 3 BHK premium configurations (floors 8-15) starting next fiscal week.`);
      } else if (queryType === 'timeline') {
        setAiOutput(`[BRICKOVA REPORT - TIMELINE RISK ASSESSMENT]
Active Sites monitored: 2.
Risk alerts detected: Volatility in cement transit cargo.
Potential impact: 4-day delay in Slab Pouring level 16.
Mitigation strategy: Auto-route scheduling to local backup mix supplier. Construction deadline buffer: preserved.`);
      } else if (queryType === 'leads') {
        setAiOutput(`[BRICKOVA REPORT - CONVERSION ATTRIBUTION]
Lead pipeline size: 148 active.
Conversion hot-spot: 'Site Visit Scheduled' to 'Unit Blocked' holds a 72% success rate.
Friction zone: Initial qualification drop-off in Gachibowli campaign.
AI Action: Automatically triggering tailored WhatsApp interactive brochure to cold leads.`);
      }
    }, 800);
  };

  return (
    <div className="bg-beige-50 min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Decorative Blueprint Background element */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 z-0 pointer-events-none opacity-[0.03] rotate-45">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-navy fill-none" strokeWidth="0.5">
          <circle cx="50" cy="50" r="40" />
          <rect x="20" y="20" width="60" height="60" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-navy font-black uppercase tracking-widest text-[9px] mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Operational Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-[900] text-navy tracking-tighter leading-tight font-montserrat uppercase">
            Interactive <span className="text-gold">Features</span>
          </h1>
          <p className="text-sm font-semibold text-navy-muted leading-relaxed uppercase tracking-wider">
            Explore live sandbox modules demonstrating how Brickova OS unifies data flow across engineering, sales, and executive management.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-4xl mx-auto">
          {[
            { id: 'inventory', name: 'Smart Inventory', icon: 'fa-building-circle-check' },
            { id: 'crm', name: 'CRM Pipeline', icon: 'fa-network-wired' },
            { id: 'timeline', name: 'Project Timeline', icon: 'fa-timeline' },
            { id: 'ai', name: 'AI Copilot Terminal', icon: 'fa-terminal' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${activeTab === tab.id ? 'bg-navy text-white border-navy shadow-premium scale-105' : 'bg-white text-navy border-beige-200 hover:border-gold/30 shadow-soft hover:shadow-premium'}`}
            >
              <i className={`fa-solid ${tab.icon} ${activeTab === tab.id ? 'text-gold' : 'text-navy-muted'}`}></i>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Dynamic Display Panel */}
        <div className="bg-white rounded-3xl border border-beige-200 shadow-premium overflow-hidden p-6 md:p-8 min-h-[480px] flex flex-col">
          
          <AnimatePresence mode="wait">
            
            {/* TABS 1: SMART INVENTORY */}
            {activeTab === 'inventory' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1"
              >
                {/* Visual Tower Layout */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                  <div className="border-b border-beige-200 pb-3 flex justify-between items-center text-left">
                    <div>
                      <h3 className="text-base font-black text-navy uppercase tracking-tight">Tower A Apartment Grid</h3>
                      <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest mt-0.5">Click any unit to inspect and block availability</p>
                    </div>
                    {/* Status Legends */}
                    <div className="flex gap-3 text-[8px] font-black uppercase tracking-wider">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-green-500"></span> Available</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500"></span> Blocked</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-500"></span> Sold</span>
                    </div>
                  </div>

                  {/* Grid Tower representation */}
                  <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto w-full">
                    {units.map((unit) => {
                      let bgClass = 'bg-green-500/10 border-green-500 text-green-700 hover:bg-green-500/20';
                      if (unit.status === 'BLOCKED') bgClass = 'bg-orange-500/10 border-orange-500 text-orange-700 hover:bg-orange-500/20';
                      if (unit.status === 'SOLD') bgClass = 'bg-red-500/5 border-red-500/30 text-red-500 opacity-60 cursor-not-allowed';

                      return (
                        <button
                          key={unit.id}
                          disabled={unit.status === 'SOLD'}
                          onClick={() => setSelectedUnitId(unit.id)}
                          className={`p-2.5 sm:p-4 border rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none font-montserrat ${bgClass} ${selectedUnitId === unit.id ? 'ring-2 ring-navy ring-offset-2 scale-105' : ''}`}
                        >
                          <span className="text-xs md:text-sm font-black tracking-tight">{unit.id}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest mt-1 opacity-70">{unit.bhk}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="text-[10px] font-black text-navy-muted uppercase tracking-[0.2em] text-center pt-2">
                    Tower Core Grid: Fully synchronized with Sales Desk
                  </div>
                </div>

                {/* Sidebar Inspection */}
                <div className="lg:col-span-4 bg-beige-50 p-6 rounded-[2rem] border border-beige-200 flex flex-col justify-between text-left">
                  <div className="space-y-6">
                    <div className="border-b border-beige-200 pb-3">
                      <span className="text-[9px] font-black text-gold uppercase tracking-widest">Selected Unit</span>
                      <h4 className="text-xl font-black text-navy font-montserrat mt-0.5">{selectedUnit.number}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-black uppercase tracking-wider text-navy">
                      <div>
                        <div className="text-[8px] text-navy-muted">BHK Configuration</div>
                        <div className="text-sm mt-0.5">{selectedUnit.bhk}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-navy-muted">Super Area</div>
                        <div className="text-sm mt-0.5">{selectedUnit.sqft} Sq.Ft</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[8px] text-navy-muted">Base Price (INR)</div>
                        <div className="text-sm mt-0.5">₹{(selectedUnit.price / 100000).toFixed(2)} Lakhs</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[8px] text-navy-muted">Availability Status</div>
                        <div className="mt-1 flex">
                          <span className={`px-2.5 py-1 rounded text-[8px] font-black ${selectedUnit.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                            {selectedUnit.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <button
                      onClick={() => handleToggleUnitBlock(selectedUnit.id)}
                      className={`w-full py-3.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer border ${selectedUnit.status === 'AVAILABLE' ? 'bg-navy text-white hover:bg-gold border-navy' : 'bg-white text-navy border-beige-300 hover:border-navy'}`}
                    >
                      {selectedUnit.status === 'AVAILABLE' ? 'Block Unit' : 'Release Unit'}
                    </button>
                    <button
                      onClick={onDemoClick}
                      className="w-full py-3.5 bg-white border border-gold text-gold text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gold/5 transition-colors cursor-pointer"
                    >
                      Trigger Purchase Workflow
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TABS 2: CRM KANBAN */}
            {activeTab === 'crm' && (
              <motion.div 
                key="crm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col flex-1 space-y-6"
              >
                <div className="border-b border-beige-200 pb-3 flex flex-wrap justify-between items-center text-left gap-4">
                  <div>
                    <h3 className="text-base font-black text-navy uppercase tracking-tight">Active CRM Deal Flow</h3>
                    <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest mt-0.5">Click on any customer card to advance their purchase funnel stage</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase text-navy-muted">Projected Pipeline Value</span>
                    <div className="text-base font-black text-navy">₹12.65 Crore</div>
                  </div>
                </div>

                 {/* Kanban grid columns */}
                <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto pb-4 max-w-full no-scrollbar">
                  {(['leads', 'nurtured', 'visit', 'blocked', 'closed'] as const).map(stage => {
                    const stageLeads = leads.filter(l => l.stage === stage);
                    const stageLabels = {
                      leads: { name: 'Leads Captured', bg: 'bg-slate-100 border-slate-200 text-slate-700' },
                      nurtured: { name: 'AI Nurtured', bg: 'bg-blue-50 border-blue-200 text-blue-800' },
                      visit: { name: 'Site Visit', bg: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
                      blocked: { name: 'Unit Blocked', bg: 'bg-orange-50 border-orange-200 text-orange-800' },
                      closed: { name: 'Closed Deal', bg: 'bg-green-50 border-green-200 text-green-800' }
                    };

                    return (
                      <div key={stage} className="bg-beige-50/50 border border-beige-200 rounded-2xl p-3 flex flex-col gap-3 min-w-[240px] md:min-w-0 flex-shrink-0 flex-1">
                        <div className={`p-2 rounded-xl border text-[9px] font-black uppercase tracking-wider text-center ${stageLabels[stage].bg}`}>
                          {stageLabels[stage].name} ({stageLeads.length})
                        </div>

                        <div className="flex-1 space-y-2">
                          <AnimatePresence>
                            {stageLeads.map(lead => (
                              <motion.div
                                key={lead.id}
                                layoutId={lead.id}
                                onClick={() => advanceLeadStage(lead.id)}
                                className="bg-white border border-beige-200 p-3 rounded-xl hover:border-gold/30 hover:shadow-soft transition-all cursor-pointer text-left space-y-2 group"
                              >
                                <div className="text-xs font-black text-navy flex items-center justify-between">
                                  {lead.name}
                                  <i className="fa-solid fa-chevron-right text-[8px] text-navy-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
                                </div>
                                <div className="text-[9px] font-bold text-navy-muted uppercase tracking-wider">
                                  {lead.interest}
                                </div>
                                <div className="text-[9px] font-black text-gold uppercase tracking-wider">
                                  {lead.budget}
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TABS 3: PROJECT TIMELINE */}
            {activeTab === 'timeline' && (
              <motion.div 
                key="timeline"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1"
              >
                {/* Milestone flow selector */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div>
                    <h3 className="text-base font-black text-navy uppercase tracking-tight">Active Construction Milestones</h3>
                    <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest mt-0.5">Click any stage node to review telemetry reports and logistics</p>
                  </div>

                  <div className="relative pl-6 space-y-8 border-l border-beige-200">
                    {timelineStages.map((stage, idx) => {
                      const isActive = selectedTimelineIndex === idx;
                      let iconClass = 'fa-circle-check text-green-700';
                      let nodeClass = 'border-green-600 bg-green-500/10';
                      if (stage.status === 'In Progress') {
                        iconClass = 'fa-circle-notch animate-spin text-navy';
                        nodeClass = 'border-navy bg-white ring-2 ring-navy/20';
                      } else if (stage.status === 'Scheduled') {
                        iconClass = 'fa-circle text-beige-300';
                        nodeClass = 'border-beige-200 bg-white';
                      }

                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedTimelineIndex(idx)}
                          className="relative cursor-pointer group"
                        >
                          {/* Circle indicator node */}
                          <div className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-transform ${isActive ? 'scale-110 shadow-soft' : ''} ${nodeClass}`}>
                            <i className={`fa-solid ${iconClass} text-[10px]`}></i>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-[8px] font-black text-navy-muted uppercase tracking-wider">{stage.date}</span>
                            <h4 className={`text-sm font-black uppercase tracking-tight ${isActive ? 'text-gold' : 'text-navy group-hover:text-gold'}`}>
                              {stage.name}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Construction details summary box */}
                <div className="lg:col-span-5 bg-beige-50 p-6 rounded-[2rem] border border-beige-200 text-left flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="border-b border-beige-200 pb-3">
                      <span className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Milestone Details</span>
                      <h4 className="text-base font-black text-navy font-montserrat uppercase mt-0.5">
                        {timelineStages[selectedTimelineIndex].name}
                      </h4>
                    </div>

                    <div className="space-y-3 font-semibold text-xs uppercase tracking-wider text-navy">
                      <div>
                        <span className="text-[8px] text-navy-muted">Logistics Status</span>
                        <div className="mt-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black ${timelineStages[selectedTimelineIndex].status === 'Completed' ? 'bg-green-100 text-green-800' : timelineStages[selectedTimelineIndex].status === 'In Progress' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'}`}>
                            {timelineStages[selectedTimelineIndex].status}
                          </span>
                        </div>
                      </div>

                      {timelineStages[selectedTimelineIndex].status === 'In Progress' && (
                        <div>
                          <span className="text-[8px] text-navy-muted">Real-Time Progress</span>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 h-2 bg-beige-200 rounded-full overflow-hidden">
                              <div className="h-full bg-gold rounded-full" style={{ width: `${timelineStages[selectedTimelineIndex].progress}%` }}></div>
                            </div>
                            <span className="text-[10px] font-black">{timelineStages[selectedTimelineIndex].progress}%</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="text-[8px] text-navy-muted">Primary Contractor</span>
                        <div className="text-[10px] mt-0.5">{timelineStages[selectedTimelineIndex].contractor}</div>
                      </div>

                      <div>
                        <span className="text-[8px] text-navy-muted">In Situ Report</span>
                        <p className="text-[10px] text-navy-muted normal-case font-medium leading-relaxed mt-1">
                          {timelineStages[selectedTimelineIndex].desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onDemoClick}
                    className="w-full mt-6 py-3.5 bg-navy text-white hover:bg-gold text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer"
                  >
                    View Active Site Footage
                  </button>
                </div>
              </motion.div>
            )}

            {/* TABS 4: AI COPILOT SANDBOX */}
            {activeTab === 'ai' && (
              <motion.div 
                key="ai"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1"
              >
                {/* Console Buttons */}
                <div className="lg:col-span-5 space-y-6 text-left flex flex-col justify-center">
                  <div>
                    <h3 className="text-base font-black text-navy uppercase tracking-tight">Brickova Copilot Terminal</h3>
                    <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest mt-0.5">Click queries below to fetch insights from predictive modules</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'velocity', label: 'Sales Velocity Forecast', query: 'Analyze Sales absorption trends' },
                      { id: 'timeline', label: 'Construction Risk Mitigation', query: 'Verify timeline logistical risks' },
                      { id: 'leads', label: 'Lead Funnel Friction Zone', query: 'Review pipeline drop-offs' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => triggerAIQuery(btn.id)}
                        className={`p-4 border rounded-2xl flex flex-col items-start transition-all cursor-pointer text-left ${activeAIQuery === btn.id ? 'bg-navy/5 border-gold shadow-premium' : 'bg-white border-beige-200 hover:border-gold/30 shadow-soft'}`}
                      >
                        <span className="text-[10px] font-black text-navy uppercase tracking-wide">{btn.label}</span>
                        <span className="text-[8px] font-semibold text-navy-muted uppercase mt-0.5">{btn.query}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Console Terminal View */}
                <div className="lg:col-span-7 bg-[#0A101D] text-white p-6 rounded-[2rem] border border-white/5 font-mono text-[10px] text-left flex flex-col justify-between shadow-2xl relative min-h-[320px]">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="space-y-4 relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                      </div>
                      <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Terminal: Brickova AI v1.0.4</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 font-medium">
                        {aiOutput}
                      </pre>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex justify-between items-center relative z-10">
                    <span className="text-gold uppercase tracking-wider text-[8px] font-black flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span> SYSTEM STATUS: ONLINE
                    </span>
                    <button
                      onClick={onDemoClick}
                      className="px-4 py-2 border border-white/20 hover:border-gold hover:text-gold transition-colors text-[8px] font-black uppercase tracking-widest rounded-lg cursor-pointer"
                    >
                      Request API Integration
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </div>
  );
};

export default FeaturesPage;
