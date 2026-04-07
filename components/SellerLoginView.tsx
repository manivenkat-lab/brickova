
import React from 'react';
import { Handshake, Fingerprint } from 'lucide-react';
import GoogleLogin from './GoogleLogin';

const BuildingSkyline = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] overflow-hidden select-none">
    <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 450" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#0f172a" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
        {Array.from({ length: 55 }).map((_, i) => {
          const x = (i * 26) % 1200;
          const h = 50 + Math.random() * 380;
          const w = 22 + Math.random() * 45;
          const depth = 12 + Math.random() * 20;
          
          return (
            <g key={i} transform={`translate(${x}, ${450 - h})`}>
              <path d={`M0,0 L${depth},-${depth/2} L${w + depth},-${depth/2} L${w},0 Z`} strokeWidth="0.5" />
              <path d={`M${w},0 L${w + depth},-${depth/2} L${w + depth},${h - depth/2} L${w},${h} Z`} strokeWidth="0.6" fill="#0f172a" opacity="0.08" />
              <rect x="0" y="0" width={w} height={h} strokeWidth="0.8" />
            </g>
          );
        })}
      </g>
    </svg>
  </div>
);

const SellerLoginView: React.FC<SellerLoginViewProps> = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-beige-50 relative overflow-hidden flex items-center justify-center py-10 md:py-16 px-6">
      <BuildingSkyline />
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#0f172a_3px,transparent_3px)] [background-size:80px_80px]"></div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center relative z-10">
        <div className="space-y-10 md:space-y-14 duration-1000 pr-0 lg:pr-10">
          <div className="space-y-6">
            <h4 className="text-gold font-semibold tracking-[0.25em] text-[10px] md:text-[12px] uppercase flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gold"></span>
              Direct Seller Access
            </h4>
            <h1 className="text-4xl sm:text-5xl md:text-[5rem] font-sans font-bold text-navy tracking-tight leading-[1.1]">
              Monetize <br className="hidden sm:block" />
              <span className="text-gold font-serif italic font-light tracking-normal">your properties.</span>
            </h1>
            <p className="text-navy-muted/80 text-base md:text-lg font-medium max-w-lg leading-relaxed pt-2">
              Connect directly with verified institutional buyers in a secure, exclusive real estate marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-soft border border-beige-200/50 hover:shadow-premium hover:-translate-y-1 group transition-all duration-500">
              <div className="w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-500">
                <Handshake className="w-6 h-6 text-gold" />
              </div>
              <h5 className="font-bold text-navy mb-3 text-sm md:text-base tracking-wide">Direct Sales</h5>
              <p className="text-navy-muted text-xs md:text-sm font-medium leading-relaxed opacity-80">Execute high-value transactions directly with buyers, eliminating unnecessary delays.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-soft border border-beige-200/50 hover:shadow-premium hover:-translate-y-1 group transition-all duration-500">
              <div className="w-12 h-12 bg-beige-50 border border-beige-200 text-navy rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Fingerprint className="w-6 h-6 text-gold" />
              </div>
              <h5 className="font-bold text-navy mb-3 text-sm md:text-base tracking-wide">Verified Network</h5>
              <p className="text-navy-muted text-xs md:text-sm font-medium leading-relaxed opacity-80">Every counterparty is strictly verified for secure and transparent dealing.</p>
            </div>
          </div>
        </div>

        <div className="duration-1000 delay-300 w-full max-w-md mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-gold/10 to-navy/5 rounded-[3rem] blur-2xl opacity-50"></div>
          <GoogleLogin onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

interface SellerLoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export default SellerLoginView;
