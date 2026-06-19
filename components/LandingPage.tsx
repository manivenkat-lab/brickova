import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onDemoClick?: () => void;
  onFeaturesClick?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onDemoClick, onFeaturesClick }) => {
  return (
    <div className="bg-beige-50 text-navy font-sans overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-8 bg-gradient-to-b from-beige-100 to-beige-50 overflow-hidden border-b border-beige-200">
        {/* Subtle architectural grid pattern */}
        <div className="absolute inset-0 z-0 hero-texture pointer-events-none opacity-40"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Copy Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/15 text-gold border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              <i className="fa-solid fa-sparkles"></i> Next-Gen Real Estate OS
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-[900] tracking-tighter leading-[1.05] font-montserrat text-navy">
              Build Smarter.<br />
              <span className="text-gold">Sell Faster.</span><br />
              Manage Everything.
            </h1>
            
            <p className="text-sm md:text-base font-semibold text-navy-muted max-w-lg leading-relaxed">
              The AI-powered operating system for real-estate developers, builders, and construction companies. Take control of your projects, inventory, and sales from a single, intelligent platform.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button 
                onClick={onDemoClick}
                className="px-8 py-4 bg-navy text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gold transition-all duration-300 shadow-premium hover:shadow-elevated transform hover:-translate-y-0.5 active:scale-95"
              >
                Request a Demo
              </button>
              <button 
                onClick={onFeaturesClick}
                className="px-8 py-4 bg-white text-navy border border-beige-300 text-xs font-black uppercase tracking-widest rounded-2xl hover:border-navy transition-all duration-300 shadow-soft hover:shadow-premium transform hover:-translate-y-0.5 active:scale-95"
              >
                Explore Features
              </button>
            </div>
          </motion.div>

          {/* Premium Visual / Mockup Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 w-full relative"
          >
            {/* Glowing gradient background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-gold/15 via-navy/5 to-gold/5 rounded-[3rem] blur-3xl z-0 pointer-events-none"></div>

            {/* Premium Flat Product Mockup (Highly Responsive & Clean) */}
            <div className="relative z-10 w-full max-w-xl mx-auto bg-white rounded-3xl shadow-premium border border-beige-200 overflow-hidden flex flex-col">
              {/* Mock Browser Header */}
              <div className="h-10 bg-beige-100/70 border-b border-beige-200 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                </div>
                <div className="text-[10px] font-bold text-navy-muted tracking-wider uppercase bg-white px-4 py-1 rounded-md border border-beige-200">
                  <i className="fa-solid fa-lock text-[8px] mr-1"></i> app.brickova.in
                </div>
                <div className="w-6"></div>
              </div>

              {/* Mock Dashboard Layout */}
              <div className="flex flex-1 min-h-[320px]">
                {/* Sidebar */}
                <div className="w-[20%] border-r border-beige-200 p-3 bg-beige-50/30 flex flex-col gap-4">
                  <div className="h-4 bg-navy/10 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-2.5 bg-navy/5 rounded w-full flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span></div>
                    <div className="h-2.5 bg-navy/5 rounded w-5/6"></div>
                    <div className="h-2.5 bg-navy/5 rounded w-4/5"></div>
                    <div className="h-2.5 bg-navy/5 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Dashboard Main View */}
                <div className="flex-1 p-4 md:p-6 space-y-4">
                  {/* Status row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-beige-50 p-2.5 rounded-xl border border-beige-200 text-center">
                      <div className="text-[9px] font-black uppercase text-navy-muted">Active Sites</div>
                      <div className="text-sm md:text-base font-black text-navy">12</div>
                    </div>
                    <div className="bg-beige-50 p-2.5 rounded-xl border border-beige-200 text-center">
                      <div className="text-[9px] font-black uppercase text-navy-muted">Sales Velocity</div>
                      <div className="text-sm md:text-base font-black text-navy text-green-700">+38%</div>
                    </div>
                    <div className="bg-navy text-white p-2.5 rounded-xl text-center">
                      <div className="text-[9px] font-black uppercase text-gold">Units Sold</div>
                      <div className="text-sm md:text-base font-black">148</div>
                    </div>
                  </div>

                  {/* Core Chart & Status Visuals */}
                  <div className="border border-beige-200 rounded-xl p-3 space-y-2 bg-beige-50/10">
                    <div className="flex justify-between items-center pb-2 border-b border-beige-100">
                      <span className="text-[10px] font-black uppercase tracking-wider text-navy">AI-Driven Lead Flow</span>
                      <span className="text-[9px] font-bold text-navy-muted">Real-Time</span>
                    </div>
                    <div className="h-20 flex items-end justify-between gap-1.5 pt-2">
                      {[35, 60, 45, 80, 50, 95, 70].map((h, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-gold rounded-t-sm" style={{ height: `${h}%` }}></div>
                          <span className="text-[7px] text-navy-muted uppercase font-bold">M{idx+1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Timeline status */}
                  <div className="bg-white border border-beige-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-soft">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center text-xs">
                        <i className="fa-solid fa-helmet-safety"></i>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-navy uppercase leading-tight">Construction Milestones</div>
                        <div className="text-[8px] text-navy-muted font-semibold uppercase">Tower B Slab Pouring Completed</div>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-green-700 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">On Schedule</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra decorative floating badge, strategically placed with no clutter */}
            <div className="absolute -bottom-4 -right-2 md:-right-6 bg-navy text-white px-4 py-3 rounded-2xl border border-white/10 shadow-premium z-20 hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div className="text-left">
                <div className="text-[9px] font-black text-gold uppercase tracking-wider">Brickova Copilot</div>
                <div className="text-[10px] font-bold text-white/80 whitespace-nowrap">Pricing recommendation generated</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section className="py-20 md:py-28 bg-white border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-700 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              The Current Reality
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase font-montserrat">
              Managing Real Estate is Chaos.
            </h2>
            <p className="text-sm font-semibold text-navy-muted">
              Fragmented pipelines, disconnected data systems, and delayed updates create operational bottlenecks at every level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: "Siloed Teams & Delays",
                desc: "Disconnected teams lead to construction delays and cost overruns.",
                icon: "fa-users-slash",
                color: "text-red-700 bg-red-50"
              },
              {
                title: "Lost Sales Opportunities",
                desc: "Poor lead tracking results in lost sales and wasted marketing budgets.",
                icon: "fa-filter-circle-xmark",
                color: "text-orange-700 bg-orange-50"
              },
              {
                title: "Operational Bottlenecks",
                desc: "Lack of real-time inventory visibility creates operational bottlenecks.",
                icon: "fa-cubes",
                color: "text-yellow-700 bg-yellow-50"
              },
              {
                title: "Slow Decision-Making",
                desc: "Outdated spreadsheets make decision-making slow and inaccurate.",
                icon: "fa-file-excel",
                color: "text-slate-700 bg-slate-100"
              }
            ].map((problem, i) => (
              <div 
                key={i} 
                className="bg-beige-50 p-6 md:p-8 rounded-[2rem] border border-beige-200 flex flex-col justify-between group hover:border-red-500/30 hover:shadow-premium transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${problem.color} mb-6`}>
                  <i className={`fa-solid ${problem.icon}`}></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-navy">{problem.title}</h3>
                  <p className="text-xs font-semibold text-navy-muted leading-relaxed uppercase tracking-wider">{problem.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION */}
      <section className="py-20 md:py-28 bg-beige-50/50 border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-800 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                The Answer
              </div>
              <h2 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase font-montserrat">
                One Platform.<br />Total Control.
              </h2>
              <p className="text-sm md:text-base font-semibold text-navy-muted leading-relaxed">
                Brickova replaces scattered tools with a seamless AI operating system designed specifically for the real estate and construction industry. From laying the foundation to handing over the keys, we automate the heavy lifting so you can focus on growth.
              </p>
              
              <ul className="space-y-3 pt-2">
                {[
                  "No more scattered spreadsheets and mismatched files.",
                  "Zero delay between on-site reporting and sales bookings.",
                  "Instant analytics built for developers and builders."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-black text-navy uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-gold/15 text-gold flex items-center justify-center text-[10px]"><i className="fa-solid fa-check"></i></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              {/* Abstract technical wireframe illustration of unification */}
              <div className="w-full aspect-[4/3] rounded-[2rem] bg-navy border border-white/10 shadow-premium p-8 relative overflow-hidden flex flex-col justify-between text-white text-left">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent z-0"></div>
                <div className="absolute -bottom-1/3 -right-1/3 w-80 h-80 bg-gold/5 blur-3xl rounded-full"></div>
                
                <div className="relative z-10 flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gold animate-pulse"></div>
                    <span className="text-[10px] font-black tracking-widest uppercase">Brickova Core OS</span>
                  </div>
                  <span className="text-[8px] font-bold tracking-widest text-gold uppercase px-2 py-1 bg-white/5 rounded border border-white/10">Connected</span>
                </div>

                {/* Centralized Nodes Visualizer */}
                <div className="relative z-10 flex items-center justify-center py-6">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <div className="absolute w-24 h-24 rounded-full border border-gold/40 flex items-center justify-center bg-navy z-20">
                      <span className="text-[10px] font-black tracking-widest text-gold uppercase text-center">AI ENGINE</span>
                    </div>
                    {/* Orbiting labels representing unified modules */}
                    <div className="absolute top-0 bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white -translate-y-2">Projects</div>
                    <div className="absolute right-0 bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white translate-x-2">Inventory</div>
                    <div className="absolute bottom-0 bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white translate-y-2">Sales CRM</div>
                    <div className="absolute left-0 bg-white/10 border border-white/10 rounded-xl px-2.5 py-1 text-[8px] font-black uppercase tracking-widest text-white -translate-x-2">Buyers</div>
                  </div>
                </div>

                <div className="relative z-10 text-[9px] font-black text-white/50 uppercase tracking-widest border-t border-white/10 pt-4 flex justify-between">
                  <span>SYSTEM LATENCY: 0ms</span>
                  <span className="text-gold">INTELLIGENCE STACK ENABLED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "HOW IT WORKS" FLOW */}
      <section className="py-20 md:py-28 bg-white border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 text-gold border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Simple Workflow
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase font-montserrat">
              How it Works
            </h2>
            <p className="text-sm font-semibold text-navy-muted">
              Streamline operations in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Horizontal connection line on desktop */}
            <div className="absolute top-16 left-[15%] right-[15%] h-[1.5px] bg-beige-200 hidden md:block z-0"></div>

            {[
              {
                step: "1",
                title: "Connect Teams",
                desc: "Break down silos between engineering, operations, and sales instantly.",
                icon: "fa-network-wired"
              },
              {
                step: "2",
                title: "Track Progress",
                desc: "Monitor real-time updates directly from the construction site to the office.",
                icon: "fa-compass-drafting"
              },
              {
                step: "3",
                title: "Close Sales",
                desc: "Automate inventory blocking and lead nurturing to accelerate transactions.",
                icon: "fa-circle-check"
              }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 relative z-10 group">
                <div className="w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center text-xl font-black border-4 border-white shadow-premium group-hover:bg-gold transition-colors duration-300">
                  <i className={`fa-solid ${step.icon}`}></i>
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-gold uppercase tracking-widest">Step 0{step.step}</div>
                  <h3 className="text-base font-black text-navy uppercase tracking-tight">{step.title}</h3>
                  <p className="text-xs font-semibold text-navy-muted max-w-xs leading-relaxed uppercase tracking-wider">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CORE FEATURES SECTION */}
      <section id="features-section" className="py-20 md:py-28 bg-beige-50/50 border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 text-gold border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase font-montserrat">
              Core Features
            </h2>
            <p className="text-sm font-semibold text-navy-muted">
              Purpose-built tools to accelerate sales and manage active real estate developments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Intelligent Project Management",
                desc: "Track timelines, allocate resources, and monitor daily progress with ease.",
                icon: "fa-bars-progress"
              },
              {
                title: "Real-Time Construction Tracking",
                desc: "Get on-site updates directly to your dashboard.",
                icon: "fa-helmet-safety"
              },
              {
                title: "Smart Inventory Management",
                desc: "Know exactly what is available, blocked, or sold in real-time.",
                icon: "fa-building-lock"
              },
              {
                title: "Automated CRM & Lead Gen",
                desc: "Capture, nurture, and convert buyers faster with AI-assisted workflows.",
                icon: "fa-address-card"
              },
              {
                title: "Proactive Buyer Engagement",
                desc: "Keep your clients updated and happy from booking to possession.",
                icon: "fa-user-check"
              },
              {
                title: "AI-Powered Analytics",
                desc: "Make data-driven decisions with predictive insights and custom reports.",
                icon: "fa-chart-pie"
              }
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className="bg-white p-8 rounded-3xl border border-beige-200 hover:border-gold/30 hover:shadow-premium hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between min-h-[180px]"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center text-lg mb-6">
                  <i className={`fa-solid ${feat.icon}`}></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-navy">{feat.title}</h3>
                  <p className="text-[11px] font-semibold text-navy-muted leading-relaxed uppercase tracking-wider">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE BRICKOVA */}
      <section className="py-20 md:py-28 bg-white border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-navy/5 text-navy/60 border border-navy/15 rounded-full text-[10px] font-black uppercase tracking-widest">
              The Edge
            </div>
            <h2 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase font-montserrat">
              Why Choose Brickova?
            </h2>
            <p className="text-sm font-semibold text-navy-muted">
              Built exclusively for developers and modern builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Industry-Specific AI",
                desc: "Built exclusively for the nuances of real estate and construction. No generic software bloat.",
                icon: "fa-brain"
              },
              {
                title: "End-to-End Visibility",
                desc: "Eliminate silos between your engineering, operations, and sales teams for one source of truth.",
                icon: "fa-eye"
              },
              {
                title: "Rapid Implementation",
                desc: "Modern, clean, and intuitive design that your team will actually want to use day-to-day.",
                icon: "fa-bolt-lightning"
              }
            ].map((why, idx) => (
              <div key={idx} className="text-center space-y-4 group p-6">
                <div className="w-14 h-14 bg-navy text-white rounded-2xl flex items-center justify-center text-xl mx-auto shadow-soft group-hover:scale-105 transition-transform duration-300">
                  <i className={`fa-solid ${why.icon} text-gold`}></i>
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy">{why.title}</h3>
                <p className="text-xs font-semibold text-navy-muted max-w-xs mx-auto leading-relaxed uppercase tracking-wider">{why.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRUST SECTION */}
      <section className="py-20 bg-beige-50/50 border-b border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/15 text-gold border border-gold/20 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto">
            Trusted Framework
          </div>
          <h2 className="text-2xl md:text-4xl font-[900] text-navy tracking-tighter uppercase font-montserrat">
            Built for Modern Builders.
          </h2>
          <p className="text-xs md:text-sm font-semibold text-navy-muted max-w-xl mx-auto uppercase tracking-wider leading-relaxed">
            Join forward-thinking developers upgrading their operations with next-generation construction technology.
          </p>
        </div>
      </section>

      {/* 8. DEMO / CONTACT CTA SECTION */}
      <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden text-center">
        {/* Background design accents */}
        <div className="absolute inset-0 z-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-fixed"></div>
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-gold via-white to-gold"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl md:text-5xl font-[900] font-montserrat tracking-tighter uppercase">
            Ready to upgrade your real estate operations?
          </h2>
          <p className="text-xs md:text-sm font-black text-slate-300 uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            Stop managing chaos and start scaling your business. See Brickova in action today.
          </p>
          
          <div className="pt-4">
            <button 
              onClick={onDemoClick}
              className="inline-flex items-center gap-2 bg-gold text-navy font-black text-xs uppercase tracking-widest px-10 py-5 rounded-full hover:bg-white transition-colors duration-300 shadow-premium active:scale-95"
            >
              Book Your Free Demo Now <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
