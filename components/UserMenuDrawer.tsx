import React from 'react';
import { ShieldCheck, X, Globe, Bookmark, Home, UserRound, Tags, PieChart, Users, Layers, Briefcase, LogOut, Check } from 'lucide-react';
import { AppUser } from '../types';

interface UserMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, filters?: any) => void;
  user: AppUser | null;
}

const UserMenuDrawer: React.FC<UserMenuDrawerProps> = ({ isOpen, onClose, onNavigate, user }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-navy/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-premium z-[201] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-beige-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-gold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-navy">Brickova Portal</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-navy-muted hover:text-navy bg-beige-50 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Header */}
        {user && (
          <div className="p-6 bg-beige-50/50 border-b border-beige-100 flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-soft shrink-0 overflow-hidden">
                 <img src={user.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'} alt={user.displayName} className="w-full h-full object-cover" />
              </div>
              {user.isIdentityVerified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-500">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-[900] text-navy uppercase tracking-widest flex items-center justify-center gap-2">
                {user.displayName}
              </h2>
              <p className="text-[9px] font-bold text-navy-muted uppercase tracking-wider opacity-60">{user.email}</p>
            </div>
            {user.isIdentityVerified && (
              <span className="inline-flex items-center gap-1.5 text-[8px] font-bold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-widest border border-success/20">
                Verified Professional
              </span>
            )}
          </div>
        ) || (
           <div className="p-8 text-center bg-beige-50/30 border-b border-beige-100 italic text-[10px] uppercase font-bold text-navy-muted tracking-widest">
             Guest Session
           </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Main Navigation - Visible on Mobile */}
          <div className="md:hidden space-y-6">
            <div className="space-y-3">
              <h3 className="subtitle-premium opacity-60">Marketplace</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => onNavigate('MARKET')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                  <Globe className="w-4 h-4" /> Explore All
                </button>
                <button onClick={() => onNavigate('SHORTLIST')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                  <Bookmark className="w-4 h-4" /> My Vault
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="subtitle-premium opacity-60">Buy & Rent</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => onNavigate('MARKET', { propertyType: 'Apartment' })} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Apartments</button>
                <button onClick={() => onNavigate('MARKET', { propertyType: 'Villa' })} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Villas</button>
                <button onClick={() => onNavigate('MARKET', { propertyType: 'Plot' })} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Plots</button>
                <button onClick={() => onNavigate('MARKET', { propertyType: 'Commercial' })} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors">Commercial</button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="subtitle-premium opacity-60">Partner Hub</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => onNavigate('SELLERS')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                  <Home className="w-4 h-4" /> List Property
                </button>
                <button onClick={() => onNavigate('AGENTS')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                  <UserRound className="w-4 h-4" /> Agent Portal
                </button>
                <button onClick={() => onNavigate('PRICING')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                  <Tags className="w-4 h-4" /> Pricing Plans
                </button>
              </div>
            </div>
          </div>

          {/* CRM / User Section */}
          <div className="space-y-6 pt-6 md:pt-0 border-t md:border-t-0 border-beige-100">
            <h3 className="subtitle-premium opacity-60">Command Center</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => onNavigate('DASHBOARD')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                <PieChart className="w-4 h-4" /> CRM Dashboard
              </button>
              <button onClick={() => onNavigate('LEADS')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                <Users className="w-4 h-4" /> Lead Pipeline
              </button>
              <button onClick={() => onNavigate('LISTINGS')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                <Layers className="w-4 h-4" /> Property Listings
              </button>
              <button onClick={() => onNavigate('TEAM')} className="text-left text-xs font-bold text-navy hover:text-gold transition-colors flex items-center gap-3">
                <Briefcase className="w-4 h-4" /> Agency Team
              </button>
            </div>
          </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => onNavigate('LOGOUT')} className="text-left text-xs font-bold text-alert hover:text-red-600 transition-colors flex items-center gap-3">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>

          {user && user.plan === 'free' && (
            <div className="mt-8 p-6 bg-navy rounded-[2rem] space-y-4 animate-in slide-in-from-bottom-5 duration-700">
               <div className="flex items-center gap-2 text-gold">
                  <Tags className="w-4 h-4" />
                  <span className="text-[10px] font-[900] uppercase tracking-widest">Upgrade Protocol</span>
               </div>
               <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                 Unlock institutional grade analytics and unlimited listings.
               </p>
               <button 
                onClick={() => onNavigate('PRICING')}
                className="w-full py-3.5 bg-gold text-navy rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-soft"
               >
                 View Professional Tiers
               </button>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-beige-50 border-t border-beige-200">
          <p className="subtitle-premium text-center opacity-50">
            © 2026 Brickova Institutional Grade
          </p>
        </div>
      </div>
    </>
  );
};

export default UserMenuDrawer;
