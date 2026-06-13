import React, { useState, useEffect, useMemo } from 'react';
import { Property, PropertyCategory } from '../types';
import PropertyForm from './PropertyForm';
import { getProperties } from '../services/propertyService';
import { auth } from '../firebase';
import PropertyCard from './PropertyCard';

interface CustomerDashboardProps {
  properties: Property[];
  shortlistedIds: string[];
  onToggleShortlist: (id: string) => void;
  onAddProperty: (p: Property) => void;
  onUpdateProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  onViewProperty: (p: Property) => void;
  onLogout: () => void;
  initialView?: 'VAULT' | 'LISTINGS';
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  properties, 
  shortlistedIds,
  onToggleShortlist,
  onAddProperty, 
  onUpdateProperty,
  onDeleteProperty,
  onViewProperty,
  onLogout,
  initialView = 'VAULT'
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [activeView, setActiveView] = useState<'VAULT' | 'LISTINGS'>(initialView);

  const myProperties = useMemo(() => {
    if (!auth.currentUser) return [];
    return properties.filter(p => p.ownerId === auth.currentUser?.uid);
  }, [properties]);

  const vaultedProperties = useMemo(() => {
    return properties.filter(p => shortlistedIds.includes(p.id!));
  }, [properties, shortlistedIds]);

  if (isAdding || editingProperty) return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8">
       <div className="absolute inset-0 bg-navy/60 backdrop-blur-xl" onClick={() => { setIsAdding(false); setEditingProperty(null); }}></div>
       <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-500">
          <PropertyForm 
            role="OWNER" 
            initialData={editingProperty}
            onSuccess={(p) => { 
              if (editingProperty) {
                onUpdateProperty(p);
              } else {
                onAddProperty(p);
              }
              setIsAdding(false); 
              setEditingProperty(null);
            }} 
            onCancel={() => { setIsAdding(false); setEditingProperty(null); }} 
          />
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-24 animate-in fade-in duration-700 text-navy min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-10 mb-12 md:mb-20">
        <div className="space-y-2 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase">
            Customer Portal
          </h2>
          <p className="text-navy-muted font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px]">
            Manage your assets and curated investments.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onLogout}
            className="px-8 py-5 rounded-[2rem] border-2 border-beige-200 text-navy-muted font-black uppercase tracking-widest text-[10px] hover:bg-beige-50 transition-all flex items-center justify-center gap-3"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </button>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-navy text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.25em] text-[10px] hover:bg-navy-ultra transition-all shadow-navy flex items-center justify-center gap-4 active:scale-[0.98]"
          >
            <i className="fa-solid fa-plus text-gold"></i> List Property
          </button>
        </div>
      </div>

      <div className="flex gap-10 mb-10 border-b border-beige-200">
         {(['VAULT', 'LISTINGS'] as const).map(v => (
           <button 
             key={v}
             onClick={() => setActiveView(v)}
             className={`pb-6 font-black text-xs md:text-sm uppercase tracking-[0.4em] transition-all border-b-4 flex items-center gap-3 ${activeView === v ? 'text-navy border-gold' : 'text-navy-muted border-transparent hover:text-navy hover:border-beige-200'}`}
           >
             {v === 'VAULT' && <i className={`fa-solid fa-shield-halved ${activeView === v ? 'text-gold' : ''}`}></i>}
             {v === 'LISTINGS' && <i className={`fa-solid fa-building ${activeView === v ? 'text-gold' : ''}`}></i>}
             {v === 'VAULT' ? 'Private Vault' : 'Listed Assets'}
           </button>
         ))}
      </div>

      {activeView === 'VAULT' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {vaultedProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vaultedProperties.map(p => (
                  <PropertyCard 
                    key={p.id}
                    property={p} 
                    isShortlisted={true}
                    onToggleShortlist={() => onToggleShortlist(p.id!)}
                    onSelect={() => onViewProperty(p)}
                    formatPrice={(pr) => `₹${Number(pr).toLocaleString('en-IN')}`} 
                  />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 md:py-40 bg-white rounded-[3rem] border border-dashed border-beige-300 p-6">
               <i className="fa-solid fa-shield-halved text-5xl md:text-7xl text-beige-200 mb-6"></i>
               <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-2">Your Vault is Empty</h3>
               <p className="font-semibold text-xs tracking-widest text-navy-muted max-w-sm mx-auto">
                 Bookmark properties while exploring the market to save them here for secure review.
               </p>
            </div>
          )}
        </div>
      )}

      {activeView === 'LISTINGS' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {myProperties.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {myProperties.map(p => (
                <div key={p.id} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-beige-200 flex flex-col md:flex-row gap-6 md:gap-8 items-center group hover:border-navy/20 transition-all shadow-soft overflow-hidden">
                  <div className="w-full md:w-48 h-48 md:h-36 overflow-hidden rounded-2xl flex-shrink-0 relative border-2 border-beige-50">
                    <img 
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'; }}
                    />
                  </div>
                  
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg md:text-xl font-[900] text-navy uppercase tracking-tight line-clamp-1 pr-4">{p.title}</h3>
                        <div className={`px-2 md:px-3 py-1 rounded-md md:rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest border shrink-0 ${p.isVerified ? 'bg-success/5 text-success border-success/20' : 'bg-alert/5 text-alert border-alert/20'}`}>
                          {p.isVerified ? 'Verified' : 'Pending'}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-lg font-black text-navy line-clamp-1">₹{p.price != null ? Number(p.price).toLocaleString('en-IN') : "Price on request"}</p>
                        {p.category === PropertyCategory.PLOT && (
                           <span className="text-[10px] text-navy-muted font-bold opacity-60">@ ₹{p.pricePerSqft != null ? Number(p.pricePerSqft).toLocaleString('en-IN') : "0"}/sqft</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button onClick={() => setEditingProperty(p)} className="flex-1 py-3 bg-beige-50 text-navy rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-navy hover:text-white border border-beige-200 transition-all active:scale-[0.98]">Edit</button>
                      <button onClick={() => onDeleteProperty(p.id!)} className="px-5 py-3 border border-alert/20 text-alert rounded-xl hover:bg-alert hover:text-white transition-all active:scale-[0.95]"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-beige-200 p-6">
               <i className="fa-solid fa-building-circle-arrow-right text-5xl text-beige-200 mb-6 group-hover:text-gold transition-colors"></i>
               <h3 className="text-[14px] font-black uppercase tracking-widest text-navy mb-2">No Active Listings</h3>
               <p className="text-[10px] font-black tracking-widest text-navy-muted">Click 'List Property' to add assets to your portfolio.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
