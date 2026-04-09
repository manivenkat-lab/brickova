import React, { useEffect, useState } from 'react';
import { Venture, Tower, InventoryUnit } from '../../types';
import { subscribeToTowers, subscribeToUnits, getUnitCounts } from '../../services/inventoryService';
import { ArrowLeft, Building, ChevronRight, Loader2 } from 'lucide-react';

interface Props {
  venture: Venture;
  onBack: () => void;
  onSelectTower: (tower: Tower) => void;
}

const TowerList: React.FC<Props> = ({ venture, onBack, onSelectTower }) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [allUnits, setAllUnits] = useState<InventoryUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [towerCounts, setTowerCounts] = useState<Record<string, ReturnType<typeof getUnitCounts>>>({});

  useEffect(() => {
    const unsub = subscribeToTowers(venture.id, data => {
      setTowers(data);
      setLoading(false);
    });
    return unsub;
  }, [venture.id]);

  useEffect(() => {
    const unsub = subscribeToUnits(venture.id, units => {
      setAllUnits(units);
      // Group by tower
      const grouped: Record<string, InventoryUnit[]> = {};
      units.forEach(u => {
        if (!grouped[u.towerId]) grouped[u.towerId] = [];
        grouped[u.towerId].push(u);
      });
      const newCounts: Record<string, ReturnType<typeof getUnitCounts>> = {};
      Object.entries(grouped).forEach(([tid, tunits]) => {
        newCounts[tid] = getUnitCounts(tunits);
      });
      setTowerCounts(newCounts);
    });
    return unsub;
  }, [venture.id]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-gold" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <button onClick={onBack} className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-navy-muted hover:text-navy transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Ventures
      </button>

      <div>
        <h2 className="text-lg md:text-2xl font-black text-navy uppercase tracking-tight">{venture.name}</h2>
        <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted mt-1">{towers.length} Tower{towers.length !== 1 ? 's' : ''}</p>
      </div>

      {!towers.length ? (
        <div className="text-center py-16 space-y-3">
          <Building className="w-10 h-10 text-navy/20 mx-auto" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">No towers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {towers.map(tower => {
            const c = towerCounts[tower.id] || { total: 0, available: 0, sold: 0, reserved: 0, blocked: 0, comingSoon: 0 };
            const availPct = c.total > 0 ? Math.round((c.available / c.total) * 100) : 0;
            return (
              <div key={tower.id} className="bg-white border border-beige-200 rounded-2xl md:rounded-[2rem] shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                <div className="p-5 md:p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-navy uppercase tracking-tight">{tower.name}</h3>
                      {tower.totalFloors && <p className="text-[8px] font-bold text-navy-muted uppercase tracking-wider">{tower.totalFloors} Floors</p>}
                    </div>
                  </div>

                  {/* Availability bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest">
                      <span className="text-green-600">{availPct}% Available</span>
                      <span className="text-navy-muted">{c.total} Units</span>
                    </div>
                    <div className="h-1.5 bg-beige-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${availPct}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Avail', value: c.available, color: 'text-green-600' },
                      { label: 'Sold', value: c.sold, color: 'text-red-500' },
                      { label: 'Resv', value: c.reserved, color: 'text-amber-600' },
                      { label: 'Blkd', value: c.blocked, color: 'text-gray-500' },
                    ].map(s => (
                      <div key={s.label} className="bg-beige-50 rounded-lg p-2 text-center border border-beige-100">
                        <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
                        <p className="text-[6px] font-bold uppercase tracking-widest text-navy-muted">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onSelectTower(tower)}
                  className="w-full py-3.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-navy/90 transition-colors"
                >
                  Open Tower <ChevronRight className="w-3.5 h-3.5 text-gold" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TowerList;
