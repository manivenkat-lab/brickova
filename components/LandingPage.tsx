import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo from './Logo';

const LandingPage: React.FC<{ onDemoClick?: () => void }> = ({ onDemoClick }) => {
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);


  return (
    <div className="bg-beige-50 text-navy font-sans overflow-hidden">
      {/* SECTION 1 — HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 md:px-8 bg-gradient-to-b from-beige-100 to-beige-50 overflow-hidden border-b border-beige-200">
        <div className="absolute inset-0 z-0 hero-texture pointer-events-none opacity-30"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 relative z-20"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-[900] tracking-tighter leading-[1.1] font-montserrat text-navy pb-2">
              The AI Operating System for <span className="text-gold drop-shadow-sm">Real Estate</span>
            </h1>
            <p className="text-sm md:text-base font-semibold text-navy-muted max-w-lg leading-relaxed">
              Manage projects, inventory, construction, buyer engagement, and sales workflows through one intelligent platform.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button 
                onClick={() => {
                  if (onDemoClick) onDemoClick();
                  else document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="px-8 py-4 bg-navy text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gold transition-colors shadow-premium hover:shadow-elevated transform hover:-translate-y-1"
              >
                Request Demo
              </button>
              <button className="px-8 py-4 bg-white text-navy border border-beige-200 text-xs font-black uppercase tracking-widest rounded-2xl hover:border-navy transition-colors flex items-center gap-2 shadow-soft hover:shadow-premium transform hover:-translate-y-1">
                <i className="fa-solid fa-play"></i> Watch Overview
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] md:h-[600px] w-full"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-gold/20 to-navy/5 rounded-[2.5rem] blur-2xl z-0"></div>
            
            {/* Main Dashboard Panel */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[10%] left-[5%] right-[5%] h-[65%] bg-white/95 backdrop-blur-2xl border border-beige-200 rounded-3xl shadow-premium p-5 z-10 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-beige-100 pb-4">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                <div className="mx-auto flex items-center justify-center bg-beige-50 px-6 py-1.5 rounded-full border border-beige-100 shadow-inner">
                  <i className="fa-solid fa-lock text-[8px] text-navy-muted mr-2"></i>
                  <span className="text-[9px] font-mono font-bold text-navy-muted tracking-widest">app.brickova.com</span>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-12 gap-5">
                {/* Left Sidebar Mock */}
                <div className="col-span-3 space-y-4">
                   <div className="h-20 bg-gradient-to-br from-navy to-navy/90 rounded-2xl shadow-soft p-4 flex flex-col justify-center">
                     <div className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1">Total Assets</div>
                     <div className="text-xl font-black text-white">$4.2B</div>
                   </div>
                   <div className="h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-2xl border border-gold/20 p-4 relative overflow-hidden flex flex-col justify-between">
                     <div>
                       <div className="text-[8px] font-black text-navy-muted uppercase tracking-widest mb-1">Active Projects</div>
                       <div className="text-lg font-black text-navy">12</div>
                     </div>
                     <div className="w-full bg-white rounded-full h-1.5 mt-2 overflow-hidden shadow-inner">
                       <div className="bg-gold h-full w-[65%] rounded-full"></div>
                     </div>
                     <div className="text-[7px] font-bold text-navy-muted mt-2 text-right">65% Overall Completion</div>
                   </div>
                </div>
                
                {/* Right Content Mock */}
                <div className="col-span-9 space-y-5">
                   <div className="h-24 bg-white border border-beige-200 rounded-2xl shadow-sm p-5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-[8px] font-black text-navy-muted uppercase tracking-widest">AI Revenue Prediction</div>
                        <div className="text-2xl font-black text-navy">$124.5M <span className="text-[10px] text-green-500 bg-green-50 px-2 py-0.5 rounded-full ml-2"><i className="fa-solid fa-arrow-trend-up mr-1"></i>+14%</span></div>
                      </div>
                      <div className="w-14 h-14 rounded-full border-4 border-beige-100 border-t-gold border-r-gold shadow-sm flex items-center justify-center">
                        <div className="text-[10px] font-black text-navy">50%</div>
                      </div>
                   </div>
                   
                   <div className="h-32 bg-white border border-beige-200 rounded-2xl shadow-sm p-4 flex flex-col">
                      <div className="text-[8px] font-black text-navy-muted uppercase tracking-widest mb-4">Lead Engagement Activity</div>
                      <div className="flex-1 w-full px-2 flex items-end justify-between gap-2">
                        {[40, 70, 45, 90, 60, 85, 30, 55, 75, 100].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                            className="w-full bg-beige-100 rounded-t-md hover:bg-gold transition-colors relative group"
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-navy text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-elevated">
                              {h * 12}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 1 - Notification */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-[5%] right-[-5%] w-48 bg-white border border-beige-200 rounded-xl shadow-elevated p-3 z-30"
            >
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold"><i className="fa-solid fa-bolt text-[10px]"></i></div>
                <div>
                  <div className="text-[9px] font-black uppercase text-navy">AI Alert</div>
                  <div className="text-[8px] font-bold text-navy-muted">High intent buyer matched</div>
                </div>
              </div>
            </motion.div>

            {/* Floating Element 2 - Property Card */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[15%] left-[-10%] w-56 bg-white border border-beige-200 rounded-2xl shadow-elevated p-2 z-20"
            >
              <div className="h-24 bg-beige-100 rounded-xl mb-3 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="Property mock" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-[8px] font-black text-navy uppercase tracking-widest">$2.4M</div>
              </div>
              <div className="px-2 pb-2">
                <div className="text-[10px] font-black text-navy uppercase tracking-widest mb-1">Skyline Penthouse</div>
                <div className="flex gap-2">
                  <div className="text-[8px] font-bold text-navy-muted px-2 py-1 bg-beige-50 rounded">4 Beds</div>
                  <div className="text-[8px] font-bold text-navy-muted px-2 py-1 bg-beige-50 rounded">3 Baths</div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — ECOSYSTEM */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-navy-muted">Built for the Modern Real Estate Lifecycle</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { role: 'Property Developers', icon: 'fa-building' },
              { role: 'Construction Teams', icon: 'fa-helmet-safety' },
              { role: 'Brokerages', icon: 'fa-handshake' },
              { role: 'Sales Executives', icon: 'fa-chart-line' },
              { role: 'Marketing Agencies', icon: 'fa-bullhorn' },
              { role: 'Home Buyers', icon: 'fa-house-user' }
            ].map((item, i) => (
              <motion.div 
                key={item.role}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-6 py-4 bg-beige-50 rounded-2xl border border-beige-200 shadow-sm hover:shadow-md hover:border-gold/30 transition-all group cursor-default"
              >
                <i className={`fa-solid ${item.icon} text-navy-muted group-hover:text-gold transition-colors`}></i>
                <span className="text-sm font-bold text-navy">{item.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — THE BRICKOVA STANDARD */}
      <section className="py-32 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-[900] text-navy font-montserrat tracking-tight mb-6">Stop managing chaos.<br/>Start scaling growth.</h2>
            <p className="text-base font-medium text-navy-muted leading-relaxed">
              We recognized that the biggest bottleneck in real estate isn't capital—it's fragmented operations. Brickova replaces disconnected point solutions with a single, unified operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Left: The Old Way */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 md:p-14 rounded-[2rem] border border-beige-200 shadow-sm"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-alert/10 text-alert rounded-md text-[10px] font-black uppercase tracking-widest mb-10">
                The Old Way
              </div>
              <ul className="space-y-8">
                {[
                  { title: 'Siloed Communication', desc: 'Teams rely on scattered spreadsheets, WhatsApp groups, and messy email threads.' },
                  { title: 'Data Latency', desc: 'Inventory and pricing updates take hours or days to reach the frontline sales teams.' },
                  { title: 'Blind Spots', desc: 'Management lacks real-time visibility into construction progress and marketing ROI.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-alert mt-2 shrink-0"></div>
                    <div>
                      <h4 className="text-sm font-black text-navy mb-1">{item.title}</h4>
                      <p className="text-sm font-medium text-navy-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right: The Brickova Standard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-navy p-10 md:p-14 rounded-[2rem] shadow-premium text-white relative overflow-hidden"
            >
              <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[100%] bg-gold/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold rounded-md text-[10px] font-black uppercase tracking-widest mb-10 relative z-10">
                The Brickova Standard
              </div>
              <ul className="space-y-8 relative z-10">
                {[
                  { title: 'Unified Workspace', desc: 'A single source of truth connecting developers, brokers, and buyers instantly.' },
                  { title: 'Zero-Latency Sync', desc: 'Live inventory, dynamic pricing, and immediate updates pushed across the entire ecosystem.' },
                  { title: 'Predictive Clarity', desc: 'AI-driven forecasting and real-time dashboards that turn operational data into strategic leverage.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                    <div>
                      <h4 className="text-sm font-black text-white mb-1">{item.title}</h4>
                      <p className="text-sm font-medium text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — HOW BRICKOVA WORKS */}
      <section className="py-24 bg-white border-y border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-[900] text-navy font-montserrat tracking-tight mb-4">The New Workflow</h2>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-navy-muted">From Data to Decision</p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-beige-200 -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-12 relative">
              {[
                { title: 'Upload Project Data', desc: 'Ingest CAD, pricing sheets, and specs.', icon: 'fa-cloud-arrow-up' },
                { title: 'AI Structures Information', desc: 'Our engine automatically maps and categorizes assets.', icon: 'fa-microchip' },
                { title: 'Generate Interactive Experience', desc: 'Instantly create 3D views and digital twins.', icon: 'fa-vr-cardboard' },
                { title: 'Manage Inventory', desc: 'Real-time availability blocking and pricing rules.', icon: 'fa-boxes-stacked' },
                { title: 'Track Construction', desc: 'Visual timeline with automated milestone updates.', icon: 'fa-person-digging' },
                { title: 'Generate Leads', desc: 'Automated capture and qualification of high-intent prospects.', icon: 'fa-magnet' },
                { title: 'Engage Buyers', desc: 'AI assistant handles inquiries 24/7.', icon: 'fa-users-rays' },
                { title: 'Generate Business Insights', desc: 'Predictive analytics for sales velocity.', icon: 'fa-chart-simple' }
              ].map((step, i, arr) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 w-full md:w-auto text-center ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <h4 className="text-lg font-black text-navy">{step.title}</h4>
                    <p className="text-sm font-medium text-navy-muted mt-2">{step.desc}</p>
                  </div>
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-beige-50 border border-beige-200 shadow-soft flex items-center justify-center text-gold z-10 relative">
                    <i className={`fa-solid ${step.icon} text-xl`}></i>
                    {i !== arr.length - 1 && <div className="absolute top-full left-1/2 w-px h-12 bg-beige-200 -translate-x-1/2 md:hidden"></div>}
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PLATFORM OVERVIEW */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03] hero-texture"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-[900] text-white font-montserrat tracking-tight mb-4">A Complete Operating System</h2>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Built for Enterprise Scale</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Project Visualization', desc: 'Interactive master plans & units.', icon: 'fa-map' },
              { title: 'Inventory Management', desc: 'Live unit locking & pricing algorithms.', icon: 'fa-building-lock' },
              { title: 'Construction Tracking', desc: 'Drone integrations & phase updates.', icon: 'fa-crane' },
              { title: 'AI Buyer Assistant', desc: 'Automated triage and answering.', icon: 'fa-robot' },
              { title: 'Analytics Dashboard', desc: 'Sales velocity & campaign ROI.', icon: 'fa-gauge-high' },
              { title: 'Marketing Automation', desc: 'AI-generated brochures & campaigns.', icon: 'fa-bullhorn' }
            ].map((mod, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                  <i className={`fa-solid ${mod.icon} text-xl`}></i>
                </div>
                <h3 className="text-lg font-black text-white mb-2">{mod.title}</h3>
                <p className="text-sm font-medium text-white/60 leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — AI LAYER */}
      <section className="py-24 bg-beige-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-[900] text-navy font-montserrat tracking-tight mb-4">Intelligence at the Core</h2>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-navy-muted mb-16">AI Embedded Across Every Workflow</p>
          
          <div className="relative max-w-4xl mx-auto aspect-square md:aspect-video bg-white rounded-[3rem] border border-beige-200 shadow-premium p-8 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200')] opacity-5 bg-cover bg-center"></div>
            
            {/* Center Node */}
            <div className="absolute z-20 w-32 h-32 bg-navy rounded-full shadow-navy flex flex-col items-center justify-center text-white border-4 border-gold/30">
              <i className="fa-solid fa-brain text-3xl text-gold mb-2"></i>
              <span className="text-[10px] font-black tracking-widest uppercase">Brickova AI</span>
            </div>
            
            {/* Orbiting Nodes */}
            <div className="absolute inset-0 z-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <circle cx="50" cy="50" r="35" fill="none" stroke="#e9e6df" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="#e9e6df" strokeWidth="0.5" strokeDasharray="1 1" />
              </svg>
            </div>
            
            {/* Just visual positioning for nodes */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              <div className="absolute top-[15%] left-[20%] bg-white px-4 py-2 rounded-full shadow-soft border border-beige-200 text-[10px] font-black text-navy uppercase"><i className="fa-solid fa-sparkles text-gold mr-2"></i>Project Gen</div>
              <div className="absolute top-[15%] right-[20%] bg-white px-4 py-2 rounded-full shadow-soft border border-beige-200 text-[10px] font-black text-navy uppercase"><i className="fa-solid fa-sparkles text-gold mr-2"></i>Buyer Recs</div>
              <div className="absolute bottom-[20%] left-[15%] bg-white px-4 py-2 rounded-full shadow-soft border border-beige-200 text-[10px] font-black text-navy uppercase"><i className="fa-solid fa-sparkles text-gold mr-2"></i>Auto Marketing</div>
              <div className="absolute bottom-[20%] right-[15%] bg-white px-4 py-2 rounded-full shadow-soft border border-beige-200 text-[10px] font-black text-navy uppercase"><i className="fa-solid fa-sparkles text-gold mr-2"></i>Sales Intel</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PLATFORM BENEFITS */}
      <section className="py-24 bg-white border-y border-beige-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-[900] text-navy font-montserrat tracking-tight mb-16 text-center">Built for Scale & Speed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '3x', label: 'Faster Launches' },
              { value: '45%', label: 'Higher Engagement' },
              { value: '-60%', label: 'Manual Operations' },
              { value: '100%', label: 'Data Centralization' }
            ].map((metric, i) => (
              <div key={i} className="text-center space-y-2 border-b-2 border-transparent hover:border-gold pb-4 transition-colors">
                <div className="text-5xl md:text-6xl font-black text-navy">{metric.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-muted">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — FUTURE OF REAL ESTATE */}
      <section className="py-32 bg-navy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-fixed"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-[900] font-montserrat tracking-tighter mb-12">The Digital Infrastructure <br/>for Real Estate</h2>
          
          <div className="flex flex-col items-center gap-6 text-sm font-black uppercase tracking-widest">
            <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/20">Developers</div>
            <i className="fa-solid fa-arrow-down text-gold text-2xl"></i>
            <div className="px-8 py-5 bg-gold text-navy rounded-2xl shadow-premium scale-110">Brickova OS</div>
            <i className="fa-solid fa-arrow-down text-gold text-2xl"></i>
            <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/20">Brokers & Buyers</div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — ABOUT BRICKOVA */}
      <section className="py-24 bg-beige-50 border-b border-beige-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Logo className="h-16 w-auto mx-auto mb-8 opacity-80" />
          <p className="text-xl md:text-2xl font-medium text-navy leading-relaxed mb-6">
            Brickova is building the AI Operating System for Real Estate.
          </p>
          <p className="text-sm md:text-base font-medium text-navy-muted leading-relaxed">
            Our mission is to help developers launch, market, manage, and sell projects through intelligent automation and data-driven decision making.
          </p>
        </div>
      </section>

      {/* SECTION 10 — DEMO CTA */}
      <section id="demo" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy via-gold to-navy"></div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-[900] text-navy font-montserrat tracking-tighter mb-4">Transform Your Business with AI</h2>
          <p className="text-sm font-medium text-navy-muted mb-12">Join the waitlist to access the ultimate real estate operating system.</p>
          
          <button 
            onClick={() => {
              if (onDemoClick) onDemoClick();
            }} 
            className="inline-flex items-center gap-2 bg-navy text-white font-black text-sm uppercase tracking-widest px-12 py-5 rounded-full hover:bg-gold transition-colors shadow-navy group"
          >
            Book Your Demo <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
