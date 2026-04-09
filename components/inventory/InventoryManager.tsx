import React, { useState, useEffect } from 'react';
import { Builder, Venture, Tower, InventoryUnit, UnitStatus, Agent, Agency } from '../../types';
import {
  subscribeToMyBuilders, createBuilder, updateBuilder, deleteBuilder,
  subscribeToVentures, createVenture, updateVenture, deleteVenture,
  subscribeToTowers, createTower, updateTower, deleteTower,
  subscribeToUnits, createUnit, updateUnit, deleteUnit, getUnitCounts
} from '../../services/inventoryService';
import StatusBadge from './StatusBadge';
import InventorySummary from './InventorySummary';
import { Plus, Trash2, Edit2, ChevronRight, Building2, FolderOpen, Building, Home, X } from 'lucide-react';

type Step = 'BUILDERS' | 'VENTURES' | 'TOWERS' | 'UNITS';
const UNIT_STATUSES: UnitStatus[] = ['Available', 'Sold', 'Reserved', 'Blocked', 'Coming Soon'];
const FACING_OPTIONS = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio', 'Penthouse'];
const inputCls = "w-full px-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-[11px] font-bold text-navy outline-none focus:border-gold/50 transition-colors";
const selectCls = "w-full px-4 py-3 bg-beige-50 border border-beige-200 rounded-xl text-[11px] font-bold text-navy outline-none focus:border-gold/50 transition-colors";

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-premium w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
      <div className="flex items-center justify-between p-5 border-b border-beige-100">
        <h3 className="text-sm font-black text-navy uppercase tracking-tight">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-beige-50 flex items-center justify-center hover:bg-beige-100 transition-colors"><X className="w-4 h-4 text-navy-muted" /></button>
      </div>
      <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">{children}</div>
    </div>
  </div>
);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-[8px] font-bold uppercase tracking-widest text-navy-muted">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
    {children}
  </div>
);

const SaveBtn: React.FC<{ saving: boolean; onClick: () => void }> = ({ saving, onClick }) => (
  <button onClick={onClick} disabled={saving}
    className="w-full py-3.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-navy/90 transition-colors disabled:opacity-50">
    {saving ? 'Saving...' : 'Save'}
  </button>
);

interface Props { agentProfile: Agent; agency?: Agency; }

const InventoryManager: React.FC<Props> = ({ agentProfile, agency }) => {
  const ownerId = agency?.id || agentProfile.id;
  const [step, setStep] = useState<Step>('BUILDERS');
  const [selectedBuilder, setSelectedBuilder] = useState<Builder | null>(null);
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [units, setUnits] = useState<InventoryUnit[]>([]);
  const [saving, setSaving] = useState(false);
  const [builderModal, setBuilderModal] = useState<Partial<Builder & { ownerId: string }> | null>(null);
  const [ventureModal, setVentureModal] = useState<Partial<Venture> | null>(null);
  const [towerModal, setTowerModal] = useState<Partial<Tower> | null>(null);
  const [unitModal, setUnitModal] = useState<Partial<InventoryUnit> | null>(null);

  useEffect(() => { const u = subscribeToMyBuilders(ownerId, setBuilders); return u; }, [ownerId]);
  useEffect(() => { if (!selectedBuilder) return; const u = subscribeToVentures(selectedBuilder.id, setVentures); return u; }, [selectedBuilder]);
  useEffect(() => { if (!selectedVenture) return; const u = subscribeToTowers(selectedVenture.id, setTowers); return u; }, [selectedVenture]);
  useEffect(() => { if (!selectedVenture) return; const u = subscribeToUnits(selectedVenture.id, setUnits); return u; }, [selectedVenture]);

  const goTo = (s: Step) => {
    if (s === 'BUILDERS') { setSelectedBuilder(null); setSelectedVenture(null); setSelectedTower(null); }
    if (s === 'VENTURES') { setSelectedVenture(null); setSelectedTower(null); }
    if (s === 'TOWERS') setSelectedTower(null);
    setStep(s);
  };

  const saveBuilder = async () => {
    if (!builderModal?.name?.trim()) return alert('Builder name is required');
    setSaving(true);
    try {
      if ((builderModal as Builder).id) await updateBuilder((builderModal as Builder).id, { name: builderModal.name, description: builderModal.description, logo: builderModal.logo });
      else await createBuilder({ name: builderModal.name!, description: builderModal.description || '', logo: builderModal.logo || '', ownerId });
      setBuilderModal(null);
    } catch { alert('Failed to save'); }
    setSaving(false);
  };

  const saveVenture = async () => {
    if (!ventureModal?.name?.trim() || !ventureModal?.location?.trim()) return alert('Name and location required');
    setSaving(true);
    try {
      if ((ventureModal as Venture).id) await updateVenture((ventureModal as Venture).id, { name: ventureModal.name, location: ventureModal.location, description: ventureModal.description, image: ventureModal.image });
      else await createVenture({ name: ventureModal.name!, location: ventureModal.location!, description: ventureModal.description || '', image: ventureModal.image || '', builderId: selectedBuilder!.id });
      setVentureModal(null);
    } catch { alert('Failed to save'); }
    setSaving(false);
  };

  const saveTower = async () => {
    if (!towerModal?.name?.trim()) return alert('Tower name required');
    setSaving(true);
    try {
      if ((towerModal as Tower).id) await updateTower((towerModal as Tower).id, { name: towerModal.name, totalFloors: towerModal.totalFloors });
      else await createTower({ name: towerModal.name!, totalFloors: towerModal.totalFloors || 0, ventureId: selectedVenture!.id, builderId: selectedBuilder!.id });
      setTowerModal(null);
    } catch { alert('Failed to save'); }
    setSaving(false);
  };

  const saveUnit = async () => {
    if (!unitModal?.flatNumber?.trim() || !unitModal?.bhk || !unitModal?.sqft || !unitModal?.price) return alert('Flat number, BHK, area and price required');
    setSaving(true);
    try {
      const towerId = unitModal.towerId || selectedTower?.id || towers[0]?.id || '';
      if ((unitModal as InventoryUnit).id) await updateUnit((unitModal as InventoryUnit).id, { ...unitModal });
      else await createUnit({ flatNumber: unitModal.flatNumber!, floorNumber: unitModal.floorNumber || 1, bhk: unitModal.bhk!, sqft: Number(unitModal.sqft), facing: unitModal.facing || 'East', price: Number(unitModal.price), status: unitModal.status || 'Available', towerId, ventureId: selectedVenture!.id, builderId: selectedBuilder!.id });
      setUnitModal(null);
    } catch { alert('Failed to save'); }
    setSaving(false);
  };

  const counts = getUnitCounts(units);
  const crumbs = [
    { label: 'Builders', step: 'BUILDERS' as Step },
    ...(selectedBuilder ? [{ label: selectedBuilder.name, step: 'VENTURES' as Step }] : []),
    ...(selectedVenture ? [{ label: selectedVenture.name, step: 'TOWERS' as Step }] : []),
    ...(selectedTower ? [{ label: selectedTower.name, step: 'UNITS' as Step }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 flex-wrap">
        {crumbs.map((c, i) => (
          <React.Fragment key={c.step}>
            {i > 0 && <span className="text-navy-muted text-[9px]">/</span>}
            <button onClick={() => goTo(c.step)} disabled={i === crumbs.length - 1}
              className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${i === crumbs.length - 1 ? 'text-navy cursor-default' : 'text-navy-muted hover:text-gold'}`}>
              {c.label}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* BUILDERS */}
      {step === 'BUILDERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight">My Builders</h3>
            <button onClick={() => setBuilderModal({ name: '', description: '', logo: '' })} className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-navy/90 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Builder</button>
          </div>
          {!builders.length ? (
            <div className="text-center py-16 border-2 border-dashed border-beige-200 rounded-2xl space-y-3">
              <Building2 className="w-10 h-10 text-navy/20 mx-auto" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">No builders yet. Add your first one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {builders.map(b => (
                <div key={b.id} className="bg-white border border-beige-200 rounded-2xl p-5 shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-navy/5 border border-beige-200 flex items-center justify-center shrink-0"><Building2 className="w-5 h-5 text-navy/40" /></div>
                      <div className="min-w-0"><p className="text-sm font-black text-navy truncate">{b.name}</p>{b.description && <p className="text-[8px] text-navy-muted truncate">{b.description}</p>}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setBuilderModal({ ...b })} className="w-7 h-7 rounded-lg bg-beige-50 flex items-center justify-center hover:bg-beige-100 transition-colors"><Edit2 className="w-3 h-3 text-navy-muted" /></button>
                      <button onClick={() => { if (confirm('Delete this builder?')) deleteBuilder(b.id); }} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedBuilder(b); setStep('VENTURES'); }} className="w-full py-2.5 bg-navy text-white text-[8px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors">View Ventures <ChevronRight className="w-3 h-3 text-gold" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VENTURES */}
      {step === 'VENTURES' && selectedBuilder && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight">{selectedBuilder.name} — Ventures</h3>
            <button onClick={() => setVentureModal({ name: '', location: '', description: '' })} className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-navy/90 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Venture</button>
          </div>
          {!ventures.length ? (
            <div className="text-center py-16 border-2 border-dashed border-beige-200 rounded-2xl space-y-3"><FolderOpen className="w-10 h-10 text-navy/20 mx-auto" /><p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">No ventures yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ventures.map(v => (
                <div key={v.id} className="bg-white border border-beige-200 rounded-2xl p-5 shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><p className="text-sm font-black text-navy truncate">{v.name}</p><p className="text-[8px] text-navy-muted truncate">{v.location}</p></div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setVentureModal({ ...v })} className="w-7 h-7 rounded-lg bg-beige-50 flex items-center justify-center hover:bg-beige-100 transition-colors"><Edit2 className="w-3 h-3 text-navy-muted" /></button>
                      <button onClick={() => { if (confirm('Delete this venture?')) deleteVenture(v.id); }} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedVenture(v); setStep('TOWERS'); }} className="w-full py-2.5 bg-navy text-white text-[8px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors">View Towers <ChevronRight className="w-3 h-3 text-gold" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOWERS */}
      {step === 'TOWERS' && selectedVenture && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight">{selectedVenture.name} — Towers</h3>
            <button onClick={() => setTowerModal({ name: '', totalFloors: 10 })} className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-navy/90 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Tower</button>
          </div>
          {!towers.length ? (
            <div className="text-center py-16 border-2 border-dashed border-beige-200 rounded-2xl space-y-3"><Building className="w-10 h-10 text-navy/20 mx-auto" /><p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">No towers yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {towers.map(t => (
                <div key={t.id} className="bg-white border border-beige-200 rounded-2xl p-5 shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center shrink-0"><Building className="w-4 h-4 text-gold" /></div>
                      <div className="min-w-0"><p className="text-sm font-black text-navy truncate">{t.name}</p>{t.totalFloors ? <p className="text-[8px] text-navy-muted">{t.totalFloors} Floors</p> : null}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setTowerModal({ ...t })} className="w-7 h-7 rounded-lg bg-beige-50 flex items-center justify-center hover:bg-beige-100 transition-colors"><Edit2 className="w-3 h-3 text-navy-muted" /></button>
                      <button onClick={() => { if (confirm('Delete this tower?')) deleteTower(t.id); }} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedTower(t); setStep('UNITS'); }} className="w-full py-2.5 bg-navy text-white text-[8px] font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 hover:bg-navy/90 transition-colors">Manage Units <ChevronRight className="w-3 h-3 text-gold" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* UNITS */}
      {step === 'UNITS' && selectedVenture && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-sm font-black text-navy uppercase tracking-tight">{selectedTower ? selectedTower.name : selectedVenture.name} — Units</h3>
            <button onClick={() => setUnitModal({ flatNumber: '', floorNumber: 1, bhk: '2 BHK', sqft: 0, facing: 'East', price: 0, status: 'Available', towerId: selectedTower?.id || towers[0]?.id || '' })} className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-navy/90 transition-colors"><Plus className="w-3.5 h-3.5" /> Add Unit</button>
          </div>
          <InventorySummary {...counts} />
          {!units.length ? (
            <div className="text-center py-16 border-2 border-dashed border-beige-200 rounded-2xl space-y-3"><Home className="w-10 h-10 text-navy/20 mx-auto" /><p className="text-[9px] font-bold uppercase tracking-widest text-navy-muted">No units yet.</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {units.filter(u => !selectedTower || u.towerId === selectedTower.id).map(u => (
                <div key={u.id} className="bg-white border border-beige-200 rounded-xl p-4 shadow-soft space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-sm font-black text-navy">{u.flatNumber}</p><p className="text-[8px] text-navy-muted">Floor {u.floorNumber} · {u.bhk}</p></div>
                    <StatusBadge status={u.status} size="sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[8px]">
                    <div className="bg-beige-50 rounded-lg p-2 border border-beige-100 text-center"><p className="font-black text-navy">{u.sqft} sqft</p></div>
                    <div className="bg-beige-50 rounded-lg p-2 border border-beige-100 text-center"><p className="font-black text-gold">₹{(u.price / 100000).toFixed(1)}L</p></div>
                  </div>
                  <select value={u.status} onChange={e => updateUnit(u.id, { status: e.target.value as UnitStatus })} className="w-full text-[9px] font-bold text-navy bg-beige-50 border border-beige-200 rounded-lg px-2 py-1.5 outline-none">
                    {UNIT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="flex gap-1.5">
                    <button onClick={() => setUnitModal({ ...u })} className="flex-1 py-2 bg-beige-50 border border-beige-200 text-[8px] font-bold uppercase tracking-widest text-navy rounded-lg flex items-center justify-center gap-1 hover:bg-beige-100 transition-colors"><Edit2 className="w-3 h-3" /> Edit</button>
                    <button onClick={() => { if (confirm('Delete unit?')) deleteUnit(u.id); }} className="w-8 py-2 bg-red-50 border border-red-100 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ── */}
      {builderModal && (
        <Modal title={`${(builderModal as Builder).id ? 'Edit' : 'Add'} Builder`} onClose={() => setBuilderModal(null)}>
          <Field label="Builder / Group Name" required><input className={inputCls} value={builderModal.name || ''} onChange={e => setBuilderModal(p => ({ ...p!, name: e.target.value }))} placeholder="e.g. Prestige Group" /></Field>
          <Field label="Description"><input className={inputCls} value={builderModal.description || ''} onChange={e => setBuilderModal(p => ({ ...p!, description: e.target.value }))} placeholder="Short description" /></Field>
          <Field label="Logo URL"><input className={inputCls} value={builderModal.logo || ''} onChange={e => setBuilderModal(p => ({ ...p!, logo: e.target.value }))} placeholder="https://..." /></Field>
          <SaveBtn saving={saving} onClick={saveBuilder} />
        </Modal>
      )}

      {ventureModal && (
        <Modal title={`${(ventureModal as Venture).id ? 'Edit' : 'Add'} Venture`} onClose={() => setVentureModal(null)}>
          <Field label="Project / Venture Name" required><input className={inputCls} value={ventureModal.name || ''} onChange={e => setVentureModal(p => ({ ...p!, name: e.target.value }))} placeholder="e.g. Prestige Heights" /></Field>
          <Field label="Location" required><input className={inputCls} value={ventureModal.location || ''} onChange={e => setVentureModal(p => ({ ...p!, location: e.target.value }))} placeholder="e.g. Indiranagar, Bangalore" /></Field>
          <Field label="Description"><input className={inputCls} value={ventureModal.description || ''} onChange={e => setVentureModal(p => ({ ...p!, description: e.target.value }))} placeholder="Short description" /></Field>
          <Field label="Cover Image URL"><input className={inputCls} value={ventureModal.image || ''} onChange={e => setVentureModal(p => ({ ...p!, image: e.target.value }))} placeholder="https://..." /></Field>
          <SaveBtn saving={saving} onClick={saveVenture} />
        </Modal>
      )}

      {towerModal && (
        <Modal title={`${(towerModal as Tower).id ? 'Edit' : 'Add'} Tower`} onClose={() => setTowerModal(null)}>
          <Field label="Tower / Block Name" required><input className={inputCls} value={towerModal.name || ''} onChange={e => setTowerModal(p => ({ ...p!, name: e.target.value }))} placeholder="e.g. Tower A" /></Field>
          <Field label="Total Floors"><input type="number" className={inputCls} value={towerModal.totalFloors || ''} onChange={e => setTowerModal(p => ({ ...p!, totalFloors: Number(e.target.value) }))} placeholder="e.g. 20" /></Field>
          <SaveBtn saving={saving} onClick={saveTower} />
        </Modal>
      )}

      {unitModal && (
        <Modal title={`${(unitModal as InventoryUnit).id ? 'Edit' : 'Add'} Unit`} onClose={() => setUnitModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Flat Number" required><input className={inputCls} value={unitModal.flatNumber || ''} onChange={e => setUnitModal(p => ({ ...p!, flatNumber: e.target.value }))} placeholder="e.g. A-101" /></Field>
            <Field label="Floor Number" required><input type="number" className={inputCls} value={unitModal.floorNumber || ''} onChange={e => setUnitModal(p => ({ ...p!, floorNumber: Number(e.target.value) }))} placeholder="1" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="BHK Type" required>
              <select className={selectCls} value={unitModal.bhk || ''} onChange={e => setUnitModal(p => ({ ...p!, bhk: e.target.value }))}>
                <option value="">Select</option>
                {BHK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Area (sqft)" required><input type="number" className={inputCls} value={unitModal.sqft || ''} onChange={e => setUnitModal(p => ({ ...p!, sqft: Number(e.target.value) }))} placeholder="1200" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Facing">
              <select className={selectCls} value={unitModal.facing || 'East'} onChange={e => setUnitModal(p => ({ ...p!, facing: e.target.value }))}>
                {FACING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)" required><input type="number" className={inputCls} value={unitModal.price || ''} onChange={e => setUnitModal(p => ({ ...p!, price: Number(e.target.value) }))} placeholder="8500000" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tower">
              <select className={selectCls} value={unitModal.towerId || ''} onChange={e => setUnitModal(p => ({ ...p!, towerId: e.target.value }))}>
                <option value="">Select Tower</option>
                {towers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={selectCls} value={unitModal.status || 'Available'} onChange={e => setUnitModal(p => ({ ...p!, status: e.target.value as UnitStatus }))}>
                {UNIT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <SaveBtn saving={saving} onClick={saveUnit} />
        </Modal>
      )}
    </div>
  );
};

export default InventoryManager;
