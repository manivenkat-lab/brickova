import React, { useEffect, useState } from 'react';
import { Builder, Venture, InventoryUnit } from '../../types';
import { subscribeToVentures, subscribeToUnits, subscribeToTowers, getUnitCounts } from '../../services/inventoryService';
import { ArrowLeft, MapPin, ChevronRight, Loader2, FolderOpen } from 'lucide-react';

interface Props {
  builder: Builder;
  onBack: () => void;
  onSelectVenture: (venture: Venture) => void;
}

const VentureList: React.FC<Props> = ({ builder, onBack, onSelectVenture }) => {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<string, { towers: number; total: number; available: number; sold: number; reserved: number }>>({});

  useEffect(() => {
    const unsub = subscribeToVentures(builder.id, data => {
      setVentures(data);
      setLoading(false);
    });
    return unsub;
  }, [builder.id]);

  useEffect(() => {
    if (!ventures.length) return;
    const unsubs: (() => void)[] = [];

    ventures.forEach(v => {
      const unsubT = subscribeToTowers(v.id, towers => {
        const unsubU = subscribeToUnits(v.id, units => {
          const c = getUnitCounts(units);
          setCounts(prev => ({ ...prev, [v.id]: { towers: towers.length, total: c.total, available: c.available, sold: c.sold, reserved: c.reserved } }));
        });
        unsubs.push(unsubU);
      });
      unsubs.push(unsubT);
    });

    return () => unsubs.forEach(u => u());
  }, [ventures]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-navy-muted hover:text-navy transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Builders
      </button>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-navy/5 border border-beige-200 flex items-center justify-center">
          <FolderOpen className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="text-lg md:text-2xl font-black text-navy uppercase tracking-tight">{builder.name}</h2>
          <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">{ventures.length} Venture{ventures.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {!ventures.length ? (
        <div className="text-center py-16 space-y-3">
          <FolderOpen className="w-10 h-10 text-navy/20 mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">No ventures found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {ventures.map(venture => {
            const c = counts[venture.id] || { towers: 0, total: 0, available: 0, sold: 0, reserved: 0 };
            return (
              <div key={venture.id} className="bg-white border border-beige-200 rounded-2xl md:rounded-[2rem] shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                {venture.image && (
                  <div className="h-36 overflow-hidden">
                    <img src={venture.image} alt={venture.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                )}
                <div className="p-5 md:p-6 space-y-4">
                  <div>
                    <h3 className="text-sm md:text-base font-black text-navy uppercase tracking-tight">{venture.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-gold shrink-0" />
                      <span className="text-[9px] font-bold text-navy-muted uppercase tracking-wider truncate">{venture.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Towers', value: c.towers },
                      { label: 'Total', value: c.total },
                      { label: 'Available', value: c.available, color: 'text-green-600' },
                      { label: 'Sold', value: c.sold, color: 'text-red-500' },
                    ].map(stat => (
                      <div key={stat.label} className="bg-beige-50 rounded-xl p-2.5 text-center border border-beige-100">
                        <p className={`text-base font-black ${stat.color || 'text-navy'}`}>{stat.value}</p>
                        <p className="text-[7px] font-bold uppercase tracking-widest text-navy-muted">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {c.reserved > 0 && (
                    <p className="text-[8px] font-bold uppercase tracking-widest text-amber-600">{c.reserved} Reserved</p>
                  )}
                </div>

                <button
                  onClick={() => onSelectVenture(venture)}
                  className="w-full py-3.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-navy/90 transition-colors"
                >
                  View Inventory <ChevronRight className="w-3.5 h-3.5 text-gold" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VentureList;
