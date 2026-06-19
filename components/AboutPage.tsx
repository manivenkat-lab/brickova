import React, { useState, useEffect } from 'react';
import { apiService, AboutMilestone, CoreValue } from '../services/apiService';

const AboutPage: React.FC = () => {
  const [milestones, setMilestones] = useState<AboutMilestone[]>([]);
  const [coreValues, setCoreValues] = useState<CoreValue[]>([]);
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Call separate About Page API
    apiService.fetchAboutData().then(data => {
      setMilestones(data.milestones);
      setCoreValues(data.coreValues);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-circle-notch animate-spin text-4xl text-gold"></i>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-muted">Aligning Core Values...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Decorative background blur shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-beige-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-navy font-black uppercase tracking-widest text-[9px] mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Operational Mission
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-navy tracking-tighter leading-tight font-montserrat uppercase">
            About <span className="text-gold">Brickova</span>
          </h1>
          <p className="text-xs md:text-sm text-navy-muted font-bold tracking-wider max-w-xl mx-auto leading-relaxed uppercase">
            Unifying project management, construction tracking, and real estate sales under one intelligent platform.
          </p>
        </div>

        {/* Content Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch mb-20">
          {/* Story Column */}
          <div className="lg:col-span-7 bg-beige-50 p-8 md:p-12 rounded-[2rem] border border-beige-200 flex flex-col justify-center space-y-6 text-left">
            <h2 className="text-lg md:text-2xl font-black text-navy uppercase tracking-tight font-montserrat border-b border-beige-300 pb-3">
              Our Story
            </h2>
            <p className="text-xs md:text-sm text-navy-muted leading-relaxed uppercase tracking-wider font-semibold">
              The real estate and construction industry builds the future, yet it often relies on technology from the past.
            </p>
            <p className="text-xs md:text-sm text-navy-muted leading-relaxed uppercase tracking-wider font-semibold">
              Brickova was founded by <strong>K. Mani Venkat</strong> with a clear realization: developers and builders are losing time, money, and sleep dealing with fragmented systems, disconnected teams, and manual data entry.
            </p>
            <p className="text-xs md:text-sm text-navy-muted leading-relaxed uppercase tracking-wider font-semibold">
              We created Brickova to fix this. We are an AI-powered operating system built strictly for the unique demands of real estate.
            </p>
          </div>

          {/* Problem We Solve Column */}
          <div className="lg:col-span-5 bg-navy text-white p-8 md:p-12 rounded-[2rem] border border-navy flex flex-col justify-center space-y-6 text-left relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-gold/15 blur-3xl rounded-full pointer-events-none"></div>
            
            <h2 className="text-lg md:text-2xl font-black text-gold uppercase tracking-tight font-montserrat border-b border-white/10 pb-3 relative z-10">
              The Problem We Solve
            </h2>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed uppercase tracking-wider font-semibold relative z-10">
              Site managers use one tool, the sales team uses another, and leadership is left trying to piece together the truth using spreadsheets.
            </p>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed uppercase tracking-wider font-semibold relative z-10">
              Brickova unifies project management, construction tracking, inventory, and CRM into one intuitive, AI-driven platform.
            </p>
          </div>
        </div>

        {/* Dynamic & Interactive Timeline Milestones Section */}
        {milestones.length > 0 && (
          <div className="bg-beige-50/50 rounded-[2rem] border border-beige-200 p-8 md:p-12 mb-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tighter mb-2 font-montserrat">Operational Evolution</h3>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-navy-muted">Milestones that shaped Brickova OS</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Selector Nodes */}
              <div className="lg:col-span-4 flex flex-col gap-3 text-left">
                {milestones.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMilestoneIndex(idx)}
                    className={`p-5 rounded-2xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between ${selectedMilestoneIndex === idx ? 'bg-navy border-navy text-gold shadow-premium' : 'bg-white border-beige-200 text-navy hover:border-gold/30 shadow-soft'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMilestoneIndex === idx ? 'bg-gold/15 text-gold' : 'bg-beige-50 text-navy-muted'}`}>
                        <i className={`fa-solid ${m.icon}`}></i>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Year</span>
                        <div className="text-sm font-black font-montserrat mt-0.5">{m.year}</div>
                      </div>
                    </div>
                    <i className="fa-solid fa-chevron-right text-[8px] opacity-60"></i>
                  </button>
                ))}
              </div>
              
              {/* Right Detail Card */}
              <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-beige-200 shadow-premium text-left min-h-[220px] flex flex-col justify-center space-y-4">
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em]">Target Accomplishment</span>
                <h4 className="text-xl font-black text-navy font-montserrat uppercase border-b border-beige-100 pb-2">
                  {milestones[selectedMilestoneIndex].title}
                </h4>
                <p className="text-xs md:text-sm text-navy-muted leading-relaxed font-semibold uppercase tracking-wider">
                  {milestones[selectedMilestoneIndex].desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Core Values Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {coreValues.map((val, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-beige-200 hover:border-gold/30 hover:shadow-premium transition-all duration-300 flex flex-col justify-between min-h-[240px] text-left">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-lg mb-6">
                <i className={`fa-solid ${val.icon}`}></i>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-navy mb-2 font-montserrat">{val.title}</h3>
                <p className="text-xs text-navy-muted leading-relaxed uppercase tracking-wider font-semibold">
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
