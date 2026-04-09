import React, { useEffect, useState } from 'react';
import { Builder, Venture, InventoryUnit } from '../../types';
import { subscribeToBuilders, subscribeToVentures, subscribeToUnits, getUnitCounts } from '../../services/inventoryService';
import { Building2, ChevronRight, Loader2 } from 'lucide-react';

interface Props {
  onSelectBuilder: (builder: Builder) => void;
}

const BuilderList: React.FC<Props> = ({ onSelectBuilder }) => {
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  // Per-builder aggregated counts fetched live
  const [counts, setCounts] = useState<Record<string, { ventures: number; total: number; available: number; sold: number }>>({});

  useEffect(() => {
    const unsub = subscribeToBuilders(data => {
      setBuilders(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // For each builder, subscribe to ventures + units to compute counts
  useEffect(() => {
    if (!builders.length) return;
    const unsubs: (() => void)[] = [];

    builders.forEach(builder => {
      const unsubV = subscribeToVentures(builder.id, ventures => {
        const ventureCount = ventures.length;
        // Aggregate units across all ventures of this builder
        let allUnits: InventoryUnit[] = [];
        let pending = ventures.length;

        if (pending === 0) {
          setCounts(prev => ({ ...prev, [builder.id]: { ventures: 0, total: 0, available: 0, sold: 0 } }));
          return;
        }

        ventures.forEach(v => {
          const unsubU = subscribeToUnits(v.id, units => {
            allUnits = [...allUnits.filter(u => u.ventureId !== v.id), ...units];
            const c = getUnitCounts(allUnits);
            setCounts(prev => ({ ...prev, [builder.id]: { ventures: ventureCount, total: c.total, available: c.available, sold: c.sold } }));
          });
          unsubs.push(unsubU);
        });
      });
      unsubs.push(unsubV);
    });

    return () => unsubs.forEach(u => u());
  }, [builders]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  if (!builders.length) return (
    <div className="text-center py-24 space-y-3">
      <Building2 className="w-12 h-12 text-navy/20 mx-auto" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">No builders listed yet</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {builders.map(builder => {
        const c = counts[builder.id] || { ventures: 0, total: 0, available: 0, sold: 0 };
        return (
          <div key={builder.id} className="bg-white border border-beige-200 rounded-2xl md:rounded-[2rem] shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy/5 border border-beige-200 flex items-center justify-center shrink-0 overflow-hidden">
                  {builder.logo
                    ? <img src={builder.logo} alt={builder.name} className="w-full h-full object-cover" />
                    : <Building2 className="w-6 h-6 text-navy/40" />
                  }
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm md:text-base font-black text-navy uppercase tracking-tight truncate">{builder.name}</h3>
                  {builder.description && <p className="text-[9px] text-navy-muted font-medium truncate mt-0.5">{builder.description}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Ventures', value: c.ventures },
                  { label: 'Total Units', value: c.total },
                  { label: 'Available', value: c.available },
                ].map(stat => (
                  <div key={stat.label} className="bg-beige-50 rounded-xl p-2.5 text-center border border-beige-100">
                    <p className="text-base md:text-lg font-black text-navy">{stat.value}</p>
                    <p className="text-[7px] font-bold uppercase tracking-widest text-navy-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest">
                <span className="text-red-500">{c.sold} Sold</span>
                <span className="text-green-600">{c.available} Available</span>
              </div>
            </div>

            <button
              onClick={() => onSelectBuilder(builder)}
              className="w-full py-3.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-navy/90 transition-colors"
            >
              View Ventures <ChevronRight className="w-3.5 h-3.5 text-gold" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BuilderList;
