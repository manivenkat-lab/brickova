import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6 mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-navy/5 border border-navy/10 text-navy font-black uppercase tracking-widest text-[8px] md:text-[10px] mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            About Brickova
          </div>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-[900] text-navy tracking-tighter leading-tight font-montserrat">
              REDEFINING <span className="text-gold">REAL ESTATE</span>
           </h1>
           <p className="text-sm md:text-base text-navy-muted font-medium max-w-2xl mx-auto leading-relaxed">
             We built Brickova with a singular mission: to eliminate the middleman and bring institutional-grade real estate directly to owners and buyers. Total transparency. Zero hidden fees.
           </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-24">
           {/* Card 1 */}
           <div className="bg-beige-50/50 rounded-3xl p-8 md:p-10 border border-beige-200 hover:shadow-premium hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-8 border border-beige-100">
                 <i className="fa-solid fa-handshake-angle text-2xl text-gold"></i>
              </div>
              <h3 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight mb-4 font-montserrat">No Brokers. Just Owners.</h3>
              <p className="text-xs md:text-sm text-navy-muted leading-relaxed">
                Connect directly with property owners and verified buyers. We have completely removed traditional brokerage from the equation, saving you millions in commissions.
              </p>
           </div>

           {/* Card 2 */}
           <div className="bg-navy rounded-3xl p-8 md:p-10 border border-navy hover:shadow-navy hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/5 backdrop-blur-md">
                 <i className="fa-solid fa-microchip text-2xl text-white group-hover:text-gold transition-colors"></i>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-4 font-montserrat">AI-Driven Insights</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Leverage our proprietary AI Strategic Advisor to analyze market trends, predict valuations, and make data-driven institutional-level investments.
              </p>
           </div>

           {/* Card 3 */}
           <div className="bg-beige-50/50 rounded-3xl p-8 md:p-10 border border-beige-200 hover:shadow-premium hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-8 border border-beige-100">
                 <i className="fa-solid fa-gem text-2xl text-gold"></i>
              </div>
              <h3 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight mb-4 font-montserrat">Premium Assets</h3>
              <p className="text-xs md:text-sm text-navy-muted leading-relaxed">
                Every listing is rigorously verified. We curate only the highest quality assets, ensuring our platform maintains the standard of excellence discerning investors expect.
              </p>
           </div>
        </div>

        {/* Closing Callout */}
        <div className="bg-gradient-to-br from-beige-100/50 to-white rounded-[2rem] p-8 md:p-16 border border-beige-200 text-center relative overflow-hidden">
           <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-3xl font-black text-navy uppercase tracking-tighter font-montserrat">
                Join the Network
              </h2>
              <p className="text-sm text-navy-muted leading-relaxed">
                Brickova is currently in a high-demand waitlist phase. Register your interest to secure early access to the future of asset exchange.
              </p>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
