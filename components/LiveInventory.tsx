import React, { useState, useEffect } from 'react';
import { Builder, Venture, Tower, AppUser } from '../types';
import { subscribeToTowers } from '../services/inventoryService';
import BuilderList from './inventory/BuilderList';
import VentureList from './inventory/VentureList';
import TowerList from './inventory/TowerList';
import UnitInventory from './inventory/UnitInventory';
import { Layers } from 'lucide-react';

type InventoryStep = 'BUILDERS' | 'VENTURES' | 'TOWERS' | 'UNITS';

interface Props {
  currentUser?: AppUser | null;
}

const LiveInventory: React.FC<Props> = ({ currentUser }) => {
  const [step, setStep] = useState<InventoryStep>('BUILDERS');
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [towers, setTowers] = useState<Tower[]>([]);

  // Pre-load towers when a venture is selected so UnitInventory can use them for labels
  useEffect(() => {
    if (!selectedVenture) return;
    const unsub = subscribeToTowers(selectedVenture.id, setTowers);
    return unsub;
  }, [selectedVenture]);

  const handleSelectBuilder = (builder: Builder) => {
    setSelectedBuilder(builder);
    setStep('VENTURES');
  };

  const handleSelectVenture = (venture: Venture) => {
    setSelectedVenture(venture);
    setStep('TOWERS');
  };

  const handleSelectTower = (tower: Tower) => {
    setSelectedTower(tower);
    setStep('UNITS');
  };

  // Breadcrumb
  const crumbs = [
    { label: 'Builders', step: 'BUILDERS' as InventoryStep },
    ...(selectedBuilder ? [{ label: selectedBuilder.name, step: 'VENTURES' as InventoryStep }] : []),
    ...(selectedVenture ? [{ label: selectedVenture.name, step: 'TOWERS' as InventoryStep }] : []),
    ...(selectedTower ? [{ label: selectedTower.name, step: 'UNITS' as InventoryStep }] : []),
  ];

  const goToStep = (s: InventoryStep) => {
    if (s === 'BUILDERS') { setSelectedBuilder(null); setSelectedVenture(null); setSelectedTower(null); }
    if (s === 'VENTURES') { setSelectedVenture(null); setSelectedTower(null); }
    if (s === 'TOWERS') { setSelectedTower(null); }
    setStep(s);
  };

  return (
    <div className="min-h-screen bg-beige-50/30">
      {/* Page header */}
      <div className="bg-white border-b border-beige-200 px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-navy uppercase tracking-tight">Live Project Inventory</h1>
              <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">Real-time unit availability across all projects</p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 flex-wrap">
            {crumbs.map((crumb, i) => (
              <React.Fragment key={crumb.step}>
                {i > 0 && <span className="text-navy-muted text-[9px]">/</span>}
                <button
                  onClick={() => goToStep(crumb.step)}
                  className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${i === crumbs.length - 1 ? 'text-navy cursor-default' : 'text-navy-muted hover:text-gold'}`}
                  disabled={i === crumbs.length - 1}
                >
                  {crumb.label}
                </button>
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {step === 'BUILDERS' && (
          <BuilderList onSelectBuilder={handleSelectBuilder} />
        )}
        {step === 'VENTURES' && selectedBuilder && (
          <VentureList
            builder={selectedBuilder}
            onBack={() => goToStep('BUILDERS')}
            onSelectVenture={handleSelectVenture}
          />
        )}
        {step === 'TOWERS' && selectedVenture && selectedBuilder && (
          <TowerList
            venture={selectedVenture}
            onBack={() => goToStep('VENTURES')}
            onSelectTower={handleSelectTower}
          />
        )}
        {step === 'UNITS' && selectedVenture && (
          <UnitInventory
            venture={selectedVenture}
            tower={selectedTower}
            towers={towers}
            onBack={() => goToStep('TOWERS')}
            currentUser={currentUser}
          />
        )}
      </div>
    </div>
  );
};

export default LiveInventory;
