import React, { useEffect, useState, useMemo } from 'react';
import { Venture, Tower, InventoryUnit, UnitStatus, AppUser } from '../../types';
import { subscribeToUnits, getUnitCounts } from '../../services/inventoryService';
import { createLead } from '../../services/leadService';
import StatusBadge from './StatusBadge';
import InventorySummary from './InventorySummary';
import { ArrowLeft, SlidersHorizontal, X, Loader2, Home, Phone, User, CheckCircle2 } from 'lucide-react';

interface Filters {
  tower: string;
  floor: string;
  bhk: string;
  minPrice: string;
  maxPrice: string;
  facing: string;
  status: string;
  onlyAvailable: boolean;
}

interface EnquireState {
  unit: InventoryUnit;
  name: string;
  phone: string;
  loading: boolean;
  done: boolean;
}

interface Props {
  venture: Venture;
  tower: Tower | null; // null = all towers
  towers: Tower[];
  onBack: () => void;
  currentUser?: AppUser | null;
}

const UnitInventory: React.FC<Props> = ({ venture, tower, towers, onBack, currentUser }) => {
  const [units, setUnits] = useState<InventoryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [enquire, setEnquire] = useState<EnquireState | null>(null);
  const [filters, setFilters] = useState<Filters>({
    tower: tower?.id || '',
    floor: '',
    bhk: '',
    minPrice: '',
    maxPrice: '',
    facing: '',
    status: '',
    onlyAvailable: false,
  });

  useEffect(() => {
    const unsub = subscribeToUnits(venture.id, data => {
      setUnits(data);
      setLoading(false);
    });
    return unsub;
  }, [venture.id]);

  const filtered = useMemo(() => {
    return units.filter(u => {
      if (filters.tower && u.towerId !== filters.tower) return false;
      if (filters.floor && u.floorNumber !== Number(filters.floor)) return false;
      if (filters.bhk && u.bhk !== filters.bhk) return false;
      if (filters.facing && u.facing !== filters.facing) return false;
      if (filters.status && u.status !== filters.status) return false;
      if (filters.minPrice && u.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && u.price > Number(filters.maxPrice)) return false;
      if (filters.onlyAvailable && u.status !== 'Available') return false;
      return true;
    });
  }, [units, filters]);

  const counts = getUnitCounts(units);

  // Unique filter options
  const bhkOptions = [...new Set(units.map(u => u.bhk))].sort();
  const facingOptions = [...new Set(units.map(u => u.facing))].filter(Boolean).sort();
  const floorOptions = [...new Set(units.map(u => u.floorNumber))].sort((a, b) => a - b);
  const statusOptions: UnitStatus[] = ['Available', 'Sold', 'Reserved', 'Blocked', 'Coming Soon'];

  const formatPrice = (p: number) => {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(1)} L`;
    return `₹${p.toLocaleString('en-IN')}`;
  };

  const handleEnquireSubmit = async () => {
    if (!enquire || !enquire.name.trim() || !enquire.phone.trim()) return;
    setEnquire(prev => prev ? { ...prev, loading: true } : null);
    try {
      await createLead({
        name: enquire.name.trim(),
        phone: enquire.phone.trim(),
        email: '',
        propertyId: enquire.unit.id,
        propertyTitle: `${venture.name} - ${enquire.unit.flatNumber} (${enquire.unit.bhk})`,
        source: 'Website',
        status: 'New',
        priority: 'Warm',
        assignedTo: '',
        agencyId: '',
        createdBy: currentUser?.uid || '',
        followUpDate: null,
        notes: [],
      } as any);
      setEnquire(prev => prev ? { ...prev, loading: false, done: true } : null);
    } catch {
      setEnquire(prev => prev ? { ...prev, loading: false } : null);
      alert('Failed to submit enquiry. Please try again.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  return (
    <div className="space-y-5 md:space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-navy-muted hover:text-navy transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Towers
          </button>
          <h2 className="text-lg md:text-2xl font-black text-navy uppercase tracking-tight">
            {tower ? tower.name : venture.name} — Inventory
          </h2>
          <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted mt-0.5">{filtered.length} units shown</p>
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[9px] font-bold uppercase tracking-widest transition-all ${showFilters ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-beige-200 hover:border-gold/40'}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      {/* Summary */}
      <InventorySummary {...counts} />

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-beige-200 rounded-2xl p-4 md:p-5 shadow-soft animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Tower</label>
              <select className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.tower} onChange={e => setFilters(f => ({ ...f, tower: e.target.value }))}>
                <option value="">All Towers</option>
                {towers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Floor</label>
              <select className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.floor} onChange={e => setFilters(f => ({ ...f, floor: e.target.value }))}>
                <option value="">All Floors</option>
                {floorOptions.map(fl => <option key={fl} value={fl}>Floor {fl}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">BHK</label>
              <select className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.bhk} onChange={e => setFilters(f => ({ ...f, bhk: e.target.value }))}>
                <option value="">All BHK</option>
                {bhkOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Facing</label>
              <select className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.facing} onChange={e => setFilters(f => ({ ...f, facing: e.target.value }))}>
                <option value="">All Facing</option>
                {facingOptions.map(fc => <option key={fc} value={fc}>{fc}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Status</label>
              <select className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                <option value="">All Status</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Min Price (₹)</label>
              <input type="number" placeholder="e.g. 5000000" className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Max Price (₹)</label>
              <input type="number" placeholder="e.g. 20000000" className="w-full text-[10px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-3 py-2 outline-none" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-green-500 focus:ring-green-400" checked={filters.onlyAvailable} onChange={e => setFilters(f => ({ ...f, onlyAvailable: e.target.checked }))} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-navy">Only Available</span>
              </label>
            </div>
          </div>
          <button onClick={() => setFilters({ tower: tower?.id || '', floor: '', bhk: '', minPrice: '', maxPrice: '', facing: '', status: '', onlyAvailable: false })} className="mt-3 text-[8px] font-bold uppercase tracking-widest text-navy-muted hover:text-red-500 transition-colors">
            Clear Filters
          </button>
        </div>
      )}

      {/* Unit grid */}
      {!filtered.length ? (
        <div className="text-center py-16 space-y-3">
          <Home className="w-10 h-10 text-navy/20 mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">No units match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {filtered.map(unit => {
            const towerName = towers.find(t => t.id === unit.towerId)?.name || '';
            return (
              <div key={unit.id} className="bg-white border border-beige-200 rounded-xl md:rounded-2xl shadow-soft hover:shadow-premium transition-all duration-300 overflow-hidden flex flex-col">
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-black text-navy">{unit.flatNumber}</p>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">Floor {unit.floorNumber} {towerName && `· ${towerName}`}</p>
                    </div>
                    <StatusBadge status={unit.status} size="sm" />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[8px]">
                    <div className="bg-beige-50 rounded-lg p-2 border border-beige-100">
                      <p className="font-black text-navy text-[10px]">{unit.bhk}</p>
                      <p className="font-bold uppercase tracking-widest text-navy-muted">BHK</p>
                    </div>
                    <div className="bg-beige-50 rounded-lg p-2 border border-beige-100">
                      <p className="font-black text-navy text-[10px]">{unit.sqft}</p>
                      <p className="font-bold uppercase tracking-widest text-navy-muted">Sq.Ft</p>
                    </div>
                    <div className="bg-beige-50 rounded-lg p-2 border border-beige-100">
                      <p className="font-black text-navy text-[10px] truncate">{unit.facing || '—'}</p>
                      <p className="font-bold uppercase tracking-widest text-navy-muted">Facing</p>
                    </div>
                    <div className="bg-beige-50 rounded-lg p-2 border border-beige-100">
                      <p className="font-black text-gold text-[10px]">{formatPrice(unit.price)}</p>
                      <p className="font-bold uppercase tracking-widest text-navy-muted">Price</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-beige-100">
                  <button
                    disabled={unit.status !== 'Available'}
                    onClick={() => unit.status === 'Available' && setEnquire({ unit, name: currentUser?.displayName || '', phone: currentUser?.phone || '', loading: false, done: false })}
                    className="py-3 text-[8px] font-bold uppercase tracking-widest text-white bg-navy hover:bg-navy/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Enquire Now
                  </button>
                  <button
                    onClick={() => setEnquire({ unit, name: currentUser?.displayName || '', phone: currentUser?.phone || '', loading: false, done: false })}
                    className="py-3 text-[8px] font-bold uppercase tracking-widest text-navy hover:text-gold border-l border-beige-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enquire Modal */}
      {enquire && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-premium w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-beige-100">
              <div>
                <h3 className="text-sm font-black text-navy uppercase tracking-tight">
                  {enquire.done ? 'Enquiry Submitted' : 'Unit Details'}
                </h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted mt-0.5">{enquire.unit.flatNumber} · Floor {enquire.unit.floorNumber}</p>
              </div>
              <button onClick={() => setEnquire(null)} className="w-8 h-8 rounded-full bg-beige-50 flex items-center justify-center hover:bg-beige-100 transition-colors">
                <X className="w-4 h-4 text-navy-muted" />
              </button>
            </div>

            {enquire.done ? (
              <div className="p-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-sm font-bold text-navy uppercase tracking-tight">We'll be in touch soon!</p>
                <p className="text-[9px] font-medium text-navy-muted">Your enquiry for {enquire.unit.flatNumber} has been received.</p>
                <button onClick={() => setEnquire(null)} className="w-full py-3 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl">Close</button>
              </div>
            ) : (
              <div className="p-5 md:p-6 space-y-4">
                {/* Unit info */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'BHK', value: enquire.unit.bhk },
                    { label: 'Area', value: `${enquire.unit.sqft} sqft` },
                    { label: 'Price', value: formatPrice(enquire.unit.price) },
                    { label: 'Floor', value: `Floor ${enquire.unit.floorNumber}` },
                    { label: 'Facing', value: enquire.unit.facing || '—' },
                    { label: 'Status', value: enquire.unit.status },
                  ].map(item => (
                    <div key={item.label} className="bg-beige-50 rounded-xl p-2.5 border border-beige-100 text-center">
                      <p className="text-[10px] font-black text-navy truncate">{item.value}</p>
                      <p className="text-[7px] font-bold uppercase tracking-widest text-navy-muted">{item.label}</p>
                    </div>
                  ))}
                </div>

                {enquire.unit.status === 'Available' && (
                  <div className="space-y-3 pt-2 border-t border-beige-100">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">Send Enquiry</p>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full pl-9 pr-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-[11px] font-bold text-navy outline-none focus:border-gold/50 transition-colors"
                        value={enquire.name}
                        onChange={e => setEnquire(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full pl-9 pr-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-[11px] font-bold text-navy outline-none focus:border-gold/50 transition-colors"
                        value={enquire.phone}
                        onChange={e => setEnquire(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      />
                    </div>
                    <button
                      onClick={handleEnquireSubmit}
                      disabled={enquire.loading || !enquire.name.trim() || !enquire.phone.trim()}
                      className="w-full py-3.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors disabled:opacity-50"
                    >
                      {enquire.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Enquiry'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitInventory;
