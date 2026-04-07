
import React, { useState, useMemo, useEffect } from 'react';
import { X, LogOut, PieChart, Users, Layers, Briefcase, LineChart, Globe, Menu, ShieldCheck, UserPlus, Plus, QrCode, Eye, Trash2, PackageOpen, Loader2, Crown } from 'lucide-react';
import { Property, Agent, Agency, Lead, UserRole, LeadStatus, PropertyType, PropertyCategory, MembershipTier, Activity, AppUser } from '../types';
import PropertyForm from './PropertyForm';
import { getAgencyMembers } from '../services/agencyService';
import LeadDashboard from './crm/LeadDashboard';
import LeadPipeline from './crm/LeadPipeline';
import LeadForm from './crm/LeadForm';
import LeadDetails from './crm/LeadDetails';
import { getLeads, createLead, updateLead, deleteLead, addLeadNote, updateLeadStatus, checkDuplicatePhone, subscribeToLeads } from '../services/leadService';
import { getRecentActivities, logActivity, subscribeToActivities } from '../services/activityService';

interface CommandCenterProps {
  properties: Property[];
  onEdit: (p: Property) => void;
  onDelete: (id: string) => void;
  onAddProperty: (p: Property) => void;
  onBackToMarket: () => void;
  agentProfile: Agent;
  agency?: Agency;
  allAgents: Agent[];
  allLeads: Lead[]; // Kept for compatibility but we'll use local state for CRM
  onUpdateLead: (l: Lead) => void;
  onVerifyProperty?: (id: string) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: 'dashboard' | 'listings' | 'leads' | 'team' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'listings' | 'leads' | 'team' | 'analytics') => void;
  user?: AppUser;
  onUpgrade?: () => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ 
  properties, 
  onEdit, 
  onDelete, 
  onAddProperty, 
  onBackToMarket, 
  agentProfile,
  agency,
  allAgents,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  user,
  onUpgrade
}) => {
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  // const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'leads' | 'team'>('dashboard'); // Removed local state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState<Partial<Lead> | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [dbMembers, setDbMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const isAdmin = agentProfile.role === UserRole.AGENCY_ADMIN;
  
  const isLimitReached = useMemo(() => {
    if (!user) return false;
    if (user.plan === MembershipTier.FREE && (user.listingsUsed || 0) >= 3) return true;
    return false;
  }, [user]);

  const handleAddClick = () => {
    if (isLimitReached) {
      setShowUpgradePopup(true);
    } else {
      setIsAddingProperty(true);
    }
  };

  useEffect(() => {
    const filters = isAdmin && agency 
      ? { agencyId: agency.id } 
      : { agentId: agentProfile.id };
    
    const unsubscribeLeads = subscribeToLeads(filters, (data) => {
      setLeads(data);
      setLoadingLeads(false);
    });

    const unsubscribeActivities = subscribeToActivities(filters, (data) => {
      setActivities(data);
    });

    return () => {
      unsubscribeLeads();
      unsubscribeActivities();
    };
  }, [agentProfile.id, agency?.id, isAdmin]);

  useEffect(() => {
    if (agency?.id) {
      const fetchMembers = async () => {
        setLoadingMembers(true);
        const members = await getAgencyMembers(agency.id);
        setDbMembers(members);
        setLoadingMembers(false);
      };
      fetchMembers();
    }
  }, [agency?.id]);

  const filteredProperties = useMemo(() => {
    if (isAdmin && agency) {
      return properties.filter(p => p.agencyId === agency.id || p.ownerId === agentProfile.id);
    }
    return properties.filter(p => p.ownerId === agentProfile.id);
  }, [properties, agentProfile.id, agency, isAdmin]);

  const handleSaveLead = async (data: any) => {
    if (!data.name || !data.phone) {
      alert("Name and Phone are required.");
      return;
    }

    setIsSubmittingLead(true);
    try {
      if (isAddingLead && typeof isAddingLead === 'object' && 'id' in isAddingLead) {
        // Update
        await updateLead((isAddingLead as Lead).id, data);
        setLeads(prev => prev.map(l => l.id === (isAddingLead as Lead).id ? { ...l, ...data } : l));
        await logActivity({
          userId: agentProfile.id,
          userName: agentProfile.name,
          action: 'Updated Lead',
          leadId: (isAddingLead as Lead).id,
          leadName: data.name
        });
        alert("Lead updated successfully!");
      } else {
        // Create
        if (!data.name || !data.phone) {
          alert("Name and Phone are required.");
          setIsSubmittingLead(false);
          return;
        }
        const isDuplicate = await checkDuplicatePhone(data.phone);
        if (isDuplicate) {
          alert("A lead with this phone number already exists.");
          setIsSubmittingLead(false);
          return;
        }

        const leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          propertyId: data.propertyId || '',
          propertyTitle: data.propertyTitle || '',
          source: data.source || 'Website',
          status: data.status || 'New',
          priority: data.priority || 'Warm',
          assignedTo: data.assignedTo || agentProfile.id,
          agencyId: agency?.id || 'independent',
          createdBy: agentProfile.id,
          followUpDate: data.followUpDate ? new Date(data.followUpDate) : new Date(),
          notes: data.notes ? [{ text: data.notes, createdAt: new Date().toISOString() }] : []
        };
        const id = await createLead(leadData, agentProfile.id, agency?.id || null);
        await logActivity({
          userId: agentProfile.id,
          userName: agentProfile.name,
          action: 'Created Lead',
          leadId: id,
          leadName: data.name
        });
        const newLead = { ...leadData, id, createdAt: new Date(), updatedAt: new Date() };
        setLeads(prev => [...prev, newLead as Lead]);
        alert("Lead created successfully!");
      }
      setIsAddingLead(null);
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Error saving lead. Check console.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, status: LeadStatus) => {
    try {
      await updateLeadStatus(leadId, status);
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        await logActivity({
          userId: agentProfile.id,
          userName: agentProfile.name,
          action: `Marked as ${status}`,
          leadId: leadId,
          leadName: lead.name
        });
      }
      
      // Update local state for immediate feedback
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateLeadDetails = async (data: Partial<Lead>) => {
    if (!selectedLead) return;
    try {
      await updateLead(selectedLead.id, data);
      
      // Update local state
      setSelectedLead(prev => prev ? { ...prev, ...data } : null);
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, ...data } : l));
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const lead = leads.find(l => l.id === id);
      
      // Optimistic update
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLead(null);

      await deleteLead(id);
      
      if (lead) {
        await logActivity({
          userId: agentProfile.id,
          userName: agentProfile.name,
          action: 'Deleted Lead',
          leadId: id,
          leadName: lead.name
        });
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      // Revert on error
      const filters = isAdmin && agency 
        ? { agencyId: agency.id } 
        : { agentId: agentProfile.id };
      const leadsData = await getLeads(filters);
      setLeads(leadsData);
    }
  };

  const handleAddNote = async (text: string) => {
    if (!selectedLead) return;
    try {
      await addLeadNote(selectedLead.id, text);
      await logActivity({
        userId: agentProfile.id,
        userName: agentProfile.name,
        action: 'Added Note',
        leadId: selectedLead.id,
        leadName: selectedLead.name
      });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-beige-50 relative">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-navy/60 backdrop-blur-sm z-[110]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-[120] w-[260px] bg-navy flex flex-col p-4 md:p-10 lg:space-y-10 shrink-0 shadow-premium border-r border-white/5 
        sidebar-transition
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8 md:hidden">
          <span className="text-white font-bold uppercase tracking-widest text-xs">Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="text-white/40 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex md:flex-col items-center justify-between gap-3 md:gap-6">
          <div className="flex md:flex-col items-center gap-3 md:gap-6 text-center">
             <div className="w-10 h-10 md:w-24 md:h-24 rounded-xl p-0.5 md:p-1 border-2 border-gold/40 shadow-soft overflow-hidden bg-white/5 group">
                <img src={agentProfile.photo} alt={agentProfile.name} className="w-full h-full object-cover rounded-lg md:rounded-xl group-hover:scale-105 transition-transform duration-500" />
             </div>
             <div className="text-left md:text-center">
                <h3 className="text-[11px] md:text-lg font-bold text-white leading-tight uppercase tracking-tight">{agentProfile.name}</h3>
                <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-widest mt-1 text-gold px-2.5 py-1 bg-white/5 rounded-full inline-block border border-gold/20">
                   {agentProfile.tier}
                </span>
             </div>
          </div>
          <button onClick={onLogout} className="text-white/40 hover:text-white text-xl p-2 active:scale-90 transition-all" title="Logout Protocol">
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 mt-5 md:mt-0">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            className={`whitespace-nowrap flex items-center gap-3 px-5 py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-white text-navy shadow-premium' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          >
            <PieChart className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-gold' : ''}`} /> CRM Dashboard
          </button>
          <button 
            onClick={() => { setActiveTab('leads'); setIsSidebarOpen(false); }} 
            className={`whitespace-nowrap flex items-center gap-3 px-5 py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-navy shadow-premium' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          >
            <Users className={`w-4 h-4 ${activeTab === 'leads' ? 'text-gold' : ''}`} /> Lead Pipeline
          </button>
          <button 
            onClick={() => { setActiveTab('listings'); setIsSidebarOpen(false); }} 
            className={`whitespace-nowrap flex items-center gap-3 px-5 py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'listings' ? 'bg-white text-navy shadow-premium' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'listings' ? 'text-gold' : ''}`} /> {isAdmin ? 'Property Listings' : 'My Listings'}
          </button>
          {isAdmin && (
            <>
              <button 
                onClick={() => { setActiveTab('team'); setIsSidebarOpen(false); }} 
                className={`whitespace-nowrap flex items-center gap-3 px-5 py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-white text-navy shadow-premium' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                <Briefcase className={`w-4 h-4 ${activeTab === 'team' ? 'text-gold' : ''}`} /> Agency Team
              </button>
              <button 
                onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} 
                className={`whitespace-nowrap flex items-center gap-3 px-5 py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-white text-navy shadow-premium' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
              >
                <LineChart className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-gold' : ''}`} /> Analytics
              </button>
            </>
          )}
        </nav>

        <div className="hidden md:flex flex-col gap-2 mt-auto">
          <button onClick={onBackToMarket} className="w-full py-4 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all flex items-center gap-4 group">
            <Globe className="w-4 h-4 group-hover:scale-110 transition-transform text-gold/60" /> Return to Portal
          </button>
          <button onClick={onLogout} className="w-full py-6 text-[10px] font-bold uppercase tracking-wider text-gold/60 hover:text-gold transition-all flex items-center gap-4 group border-t border-white/5">
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-12 space-y-6 md:space-y-10 overflow-y-auto custom-scrollbar">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 md:gap-6 border-b border-beige-200 pb-5 md:pb-8">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-navy hover:text-gold transition-colors">
               <Menu className="w-6 h-6" />
             </button>
             <div className="space-y-1.5 md:space-y-2">
               <h2 className="text-2xl md:text-5xl font-display font-bold text-navy uppercase tracking-tight">
                 {activeTab === 'dashboard' ? 'Brickova Dashboard' : activeTab === 'leads' ? 'Lead Pipeline' : activeTab === 'listings' ? 'Listings' : activeTab === 'analytics' ? 'Analytics' : 'Agency Team'}
               </h2>
               <p className="text-[8px] md:text-[10px] font-bold text-navy-muted uppercase tracking-wider flex items-center gap-2">
                 <ShieldCheck className="w-3.5 h-3.5 text-gold" /> {agency?.name || 'Independent Partner'}
                 {agency?.code && (
                   <>
                     <span className="mx-2 opacity-20">|</span>
                     <span className="text-gold">Join Code: <span className="bg-navy text-white px-2 py-0.5 rounded ml-1 select-all">{agency.code}</span></span>
                   </>
                 )}
                 <span className="mx-2 opacity-20">|</span>
                 <span className="text-gold">Slot Use: {agency?.slotUsed || 0}/{agency?.slotLimit || 15}</span>
               </p>
             </div>
           </div>
            <div className="flex gap-2 md:gap-4">
              {(activeTab === 'leads' || activeTab === 'dashboard') && (
                <button onClick={() => setIsAddingLead({})} className="flex-1 md:w-auto bg-white border border-navy text-navy px-4 md:px-8 py-3.5 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-bold uppercase tracking-widest shadow-soft flex items-center justify-center gap-2.5 md:gap-3 active:scale-95 hover:shadow-premium transition-all">
                  <UserPlus className="w-4 h-4 text-gold" /> New Lead
                </button>
              )}
              <button onClick={handleAddClick} className="flex-[1.5] md:w-auto bg-navy text-white px-5 md:px-10 py-3.5 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-bold uppercase tracking-widest shadow-navy flex items-center justify-center gap-2.5 md:gap-3 active:scale-95 hover:bg-navy-ultra hover:shadow-elevated transition-all">
                <Plus className="w-4 h-4 text-gold" /> List Property
              </button>
            </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <LeadDashboard leads={leads} activities={activities} isAdmin={isAdmin} />
          </div>
        )}

        {activeTab === 'listings' && (
           <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-8">
                {filteredProperties.length > 0 ? filteredProperties.map(p => (
                  <div key={p.id} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-beige-200 flex flex-col sm:flex-row gap-5 md:gap-8 items-center shadow-soft group hover:border-gold/30 hover:shadow-premium transition-all">
                    <div className="w-full sm:w-32 md:w-48 h-36 sm:h-32 md:h-32 rounded-xl overflow-hidden shrink-0 border-2 border-beige-50">
                      <img 
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'; }}
                      />
                    </div>
                    <div className="flex-1 w-full space-y-3 md:space-y-4">
                      <div className="flex justify-between items-start gap-4">
                         <h4 className="text-sm md:text-xl font-display font-semibold text-navy uppercase tracking-tight truncate flex-1 leading-tight group-hover:text-gold transition-colors">{p.title}</h4>
                         <span className={`px-2 py-1 rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-widest shrink-0 border ${p.isVerified ? 'bg-white/95 text-navy border-gold/30 shadow-sm' : 'bg-beige-50 text-navy-muted border-beige-200'}`}>
                           {p.isVerified ? 'Verified' : 'Review'}
                         </span>
                      </div>
                      <div className="flex items-center gap-4 text-[8px] md:text-[9px] font-sans font-semibold uppercase tracking-wider text-navy-muted opacity-60">
                         <span><QrCode className="w-3.5 h-3.5 inline mr-2 text-gold/60" />{p.propertyCode}</span>
                         <span><Eye className="w-3.5 h-3.5 inline mr-2 text-gold/60" />{p.stats?.views?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex gap-4 pt-3 md:pt-4 border-t border-beige-50">
                         <button onClick={() => onEdit(p)} className="flex-1 py-3 bg-beige-50 text-navy rounded-xl text-[9px] font-sans font-semibold uppercase tracking-wider border border-beige-200 hover:bg-navy hover:text-white hover:border-navy transition-all active:scale-95">Edit</button>
                         <button onClick={() => onDelete(p.id)} className="px-4 py-3 border border-alert/20 text-alert rounded-xl hover:bg-alert hover:text-white transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-beige-300 shadow-inner group">
                     <PackageOpen className="w-12 h-12 text-beige-200 mx-auto mb-6 group-hover:text-gold transition-colors duration-500" />
                     <p className="text-[10px] font-bold uppercase tracking-wider text-navy-muted">Strategic Asset Inventory Empty</p>
                  </div>
                )}
              </div>
           </div>
        )}

        {activeTab === 'leads' && (
           <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {loadingLeads ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">Loading Pipeline...</p>
                </div>
              ) : (
                <LeadPipeline 
                  leads={leads} 
                  onLeadClick={setSelectedLead} 
                  onStatusChange={handleUpdateLeadStatus} 
                  onAddLead={(status) => setIsAddingLead({ status })}
                />
              )}
           </div>
        )}

        {activeTab === 'team' && isAdmin && (
           <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {loadingMembers ? (
                   <div className="col-span-full py-20 flex flex-col items-center gap-4">
                     <Loader2 className="w-8 h-8 animate-spin text-gold" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">Fetching Team Roster...</p>
                   </div>
                 ) : dbMembers.length > 0 ? dbMembers.map(member => (
                   <div key={member.uid} className="bg-white p-8 rounded-[2.5rem] border border-beige-200 text-center space-y-4 hover:shadow-premium hover:border-gold/20 transition-all group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto border-2 border-gold/20 p-1 shadow-soft group-hover:scale-105 transition-transform duration-500">
                         <img src={member.userDetails?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.userDetails?.displayName || "Agent")}&background=0f172a&color=fcfaf7&bold=true`} className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                         <h4 className="text-sm font-bold text-navy uppercase tracking-tight group-hover:text-gold transition-colors">{member.userDetails?.displayName || 'Elite Associate'}</h4>
                         <p className="text-[8px] font-bold text-gold uppercase tracking-wider mt-1">{member.role === 'admin' ? 'Agency Principal' : 'Strategic Associate'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-beige-50">
                         <div>
                            <p className="text-[8px] font-bold text-navy-muted uppercase opacity-40">Portfolio</p>
                            <p className="text-sm font-bold text-navy">{properties.filter(p => p.ownerId === member.uid).length} Assets</p>
                         </div>
                         <div>
                            <p className="text-[8px] font-bold text-navy-muted uppercase opacity-40">Joined</p>
                            <p className="text-[10px] font-bold text-navy">{member.joinedAt?.toDate ? new Date(member.joinedAt.toDate()).toLocaleDateString() : 'Recent'}</p>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="col-span-full py-20 text-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted">No team members found.</p>
                   </div>
                 )}
                 <div className="bg-beige-50 border-2 border-dashed border-beige-300 rounded-[2.5rem] flex flex-col items-center justify-center py-10 gap-4 group hover:border-gold/40 hover:bg-white transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-beige-200 flex items-center justify-center text-navy-muted group-hover:text-gold group-hover:border-gold/30 transition-all shadow-sm">
                       <QrCode className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-navy">Share Join Code</p>
                       <p className="text-[12px] font-bold text-gold mt-1 select-all">{agency?.code}</p>
                    </div>
                 </div>
              </div>
           </div>
        )}
        {activeTab === 'analytics' && isAdmin && (
           <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white p-8 rounded-[2.5rem] border border-beige-200 text-center space-y-4 shadow-soft">
                 <PieChart className="w-12 h-12 text-gold mx-auto mb-4" />
                 <h3 className="text-2xl font-bold text-navy uppercase tracking-tight">Performance Analytics</h3>
                 <p className="text-sm text-navy-muted">Detailed analytics and commission tracking will be available here.</p>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="p-6 bg-beige-50 rounded-2xl border border-beige-200">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted mb-2">Total Revenue</p>
                       <p className="text-3xl font-bold text-success">${(leads.filter(l => l.status === 'Closed').length * 15000).toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-beige-50 rounded-2xl border border-beige-200">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted mb-2">Est. Commission</p>
                       <p className="text-3xl font-bold text-gold">${(leads.filter(l => l.status === 'Closed').length * 1500).toLocaleString()}</p>
                    </div>
                    <div className="p-6 bg-beige-50 rounded-2xl border border-beige-200">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-navy-muted mb-2">Active Agents</p>
                       <p className="text-3xl font-bold text-navy">{dbMembers.length}</p>
                    </div>
                 </div>
              </div>
           </div>
        )}
      </main>

      {/* Upgrade Popup */}
      {showUpgradePopup && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-navy/80 backdrop-blur-md" onClick={() => setShowUpgradePopup(false)}></div>
          <div className="relative bg-white p-8 md:p-12 rounded-[2.5rem] shadow-elevated max-w-lg w-full text-center space-y-8 animate-in zoom-in-95 duration-500 border border-gold/20">
            <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
              <Crown className="w-10 h-10 text-gold" />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-navy uppercase tracking-tight">Listing Limit Reached</h3>
              <p className="text-navy-muted font-medium leading-relaxed">
                You've reached the maximum of 3 properties on the <span className="text-gold font-bold">FREE PLAN</span>. 
                Upgrade to a premium tier to unlock unlimited strategic asset listings.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setShowUpgradePopup(false);
                  onUpgrade?.();
                }}
                className="w-full py-5 bg-navy text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-navy hover:bg-navy-ultra transition-all active:scale-95"
              >
                View Premium Plans
              </button>
              <button 
                onClick={() => setShowUpgradePopup(false)}
                className="w-full py-5 bg-beige-50 text-navy-muted rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-beige-100 transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddingProperty && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-navy/60 backdrop-blur-xl" onClick={() => setIsAddingProperty(false)}></div>
           <div className="relative w-full max-w-5xl h-full md:h-auto animate-in zoom-in-95 duration-500">
              <PropertyForm 
                role="AGENT" 
                agentProfile={agentProfile}
                existingPropertiesCount={filteredProperties.length}
                onSuccess={(p) => { onAddProperty(p); setIsAddingProperty(false); }} 
                onCancel={() => setIsAddingProperty(false)} 
              />
           </div>
        </div>
      )}

      {isAddingLead && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-navy/60 backdrop-blur-xl" onClick={() => setIsAddingLead(null)}></div>
           <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-500">
              <LeadForm 
                lead={isAddingLead as any}
                properties={properties}
                agents={isAdmin ? dbMembers.map(m => ({ id: m.uid, name: m.userDetails?.displayName || m.name || 'Unknown Agent' })) : [agentProfile]}
                onSubmit={handleSaveLead}
                onCancel={() => setIsAddingLead(null)}
                isSubmitting={isSubmittingLead}
              />
           </div>
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-navy/60 backdrop-blur-xl" onClick={() => setSelectedLead(null)}></div>
           <div className="relative w-full max-w-4xl animate-in zoom-in-95 duration-500">
              <LeadDetails 
                lead={selectedLead}
                onUpdate={handleUpdateLeadDetails}
                onDelete={handleDeleteLead}
                onAddNote={handleAddNote}
                onEdit={() => {
                  setIsAddingLead(selectedLead);
                  setSelectedLead(null);
                }}
                onClose={() => setSelectedLead(null)}
                isAdmin={isAdmin}
                agents={dbMembers}
              />
           </div>
        </div>
      )}
    </div>
  );
};

export default CommandCenter;
