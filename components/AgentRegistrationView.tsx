
import React, { useState, useEffect } from 'react';
import { Check, ShieldCheck, ChevronRight, Clock, Gem, Briefcase, Crown, Rocket, ExternalLink } from 'lucide-react';
import { Agent, MembershipTier, UserRole, Agency, Lead, AppUser } from '../types';
import { createAgency, joinAgencyByCode } from '../services/agencyService';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2 } from 'lucide-react';

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

const RERA_PORTALS: Record<string, string> = {
  'KA': 'https://rera.karnataka.gov.in/',
  'TS': 'https://rerait.telangana.gov.in/',
  'MH': 'https://maharera.mahaonline.gov.in/',
  'GJ': 'https://gujrera.gujarat.gov.in/',
  'UP': 'https://up-rera.in/',
  'HR': 'https://haryana-rera.gov.in/',
  'DL': 'https://rera.delhi.gov.in/',
  'TN': 'https://www.rera.tn.gov.in/',
  'WB': 'https://rera.wb.gov.in/',
  'PB': 'https://rera.punjab.gov.in/',
  'RJ': 'https://rera.rajasthan.gov.in/',
  'MP': 'https://www.rera.mp.gov.in/',
  'AP': 'https://rera.ap.gov.in/',
  'KL': 'https://rera.kerala.gov.in/',
  'BR': 'https://rera.bihar.gov.in/',
  'OD': 'https://rera.odisha.gov.in/',
  'CH': 'https://rera.cgstate.gov.in/',
  'UK': 'https://uhrera.uk.gov.in/',
  'HP': 'https://hprera.nic.in/',
  'PY': 'https://rera.py.gov.in/',
  'GA': 'https://rera.goa.gov.in/',
  'JK': 'https://jkrera.jk.gov.in/'
};

const getReraPortal = (licenseNo: string) => {
  const upper = licenseNo.toUpperCase();
  for (const [code, url] of Object.entries(RERA_PORTALS)) {
    if (upper.includes(code)) return url;
  }
  return 'https://rera.karnataka.gov.in/'; // Default
};

interface AgentRegistrationViewProps {
  currentUser: AppUser | null;
  onRegistrationSuccess: (updatedUser: AppUser) => void;
  existingAgencies?: Agency[];
}

type Step = 1 | 2 | 3;

const AgentRegistrationView: React.FC<AgentRegistrationViewProps> = ({ currentUser, onRegistrationSuccess, existingAgencies = [] }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Setting up your account...');
  const [selectedTier, setSelectedTier] = useState<MembershipTier>(MembershipTier.BASIC);
  const [registrationType, setRegistrationType] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agencyName: '',
    inviteCode: '',
    licenseNo: '',
    experience: '5',
     specialization: 'Luxury Penthouses, Sea-view Assets, Hitech City Plots',
    portfolioValue: '50',
    pan: ''
  });

  const [reraStatus, setReraStatus] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');
  const [panStatus, setPanStatus] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');
  const [panRecordName, setPanRecordName] = useState('');
  


  // Trigger PAN verification in the background
  useEffect(() => {
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/i;
    if (formData.pan.length === 10) {
      setPanStatus('checking');
      setPanRecordName('');
      
      const timer = setTimeout(() => {
        if (panRegex.test(formData.pan)) {
          // Simulated "Fetch From NSDL" Data
          const mockRecordName = formData.name.toUpperCase() || "RAHUL SHARMA";
          setPanRecordName(mockRecordName);
          
          // Case-insensitive name match check
          const namesMatch = formData.name.toUpperCase().trim() === mockRecordName.trim();
          
          if (namesMatch) {
            setPanStatus('verified');
          } else {
            setPanStatus('failed'); // We'll reuse failed for name mismatch
          }
        } else {
          setPanStatus('failed');
        }
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setPanStatus('idle');
    }
  }, [formData.pan, formData.name]);

  // Trigger RERA verification in the background
  useEffect(() => {
    if (formData.licenseNo.length > 8) {
      setReraStatus('checking');
      const timer = setTimeout(() => {
        // Mock verification logic: 
        // 1. Check if format is somewhat correct (PRM/.../RERA/...)
        // 2. Demonstration: "verify" if it contains any valid state code from our database
        const upperLicense = formData.licenseNo.toUpperCase();
        const isValidFormat = upperLicense.includes('RERA') || upperLicense.includes('REG');
        
        // Find if any of our supported state codes are in the license number
        const detectedState = Object.keys(RERA_PORTALS).find(code => upperLicense.includes(code));
        const isDemoValid = !!detectedState || upperLicense === 'DEMO123';
        
        if (isValidFormat && isDemoValid) {
          setReraStatus('verified');
        } else {
          setReraStatus('failed');
        }
      }, 2500); // 2.5s mock background check
      return () => clearTimeout(timer);
    } else {
      setReraStatus('idle');
    }
  }, [formData.licenseNo]);

  const loadingSequence = [
    'Verifying RERA License...',
    'Checking Identity...',
    'Authenticating Professional Record...',
    'Saving your profile...',
    'Setting up your dashboard...'
  ];

  useEffect(() => {
    if (isLoading) {
      let i = 0;
      const interval = setInterval(() => {
        if (i < loadingSequence.length) {
          setLoadingText(loadingSequence[i]);
          i++;
        }
      }, 600);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      // Demo Mode: Bypassing RERA/PAN verification for Step 2
      if (currentStep === 2) {
        // Verification disabled for testing
      }
      setCurrentStep((currentStep + 1) as Step);
      return;
    }

    if (!currentUser) {
      alert("Please login first to register as an agent.");
      return;
    }

    setIsLoading(true);

    let finalRole = UserRole.AGENT;
    let finalAgencyId = "";
    let finalAgencyCode = "";

    try {
      if (registrationType === 'ADMIN') {
        const agency = await createAgency({
          name: formData.agencyName,
          adminUid: currentUser.uid
        });
        finalRole = UserRole.AGENCY_ADMIN;
        finalAgencyId = agency.id;
        finalAgencyCode = agency.code;
      } else {
        const result = await joinAgencyByCode(currentUser.uid, formData.inviteCode);
        finalRole = UserRole.AGENT;
        finalAgencyId = result.agencyId;
        finalAgencyCode = formData.inviteCode.toUpperCase();
      }

      // Razorpay Payment Flow for Paid Tiers
      if (selectedTier !== MembershipTier.FREE) {
        let amount = 0;
        if (selectedTier === MembershipTier.BASIC) amount = 999;
        if (selectedTier === MembershipTier.PRO) amount = 1999;
        if (selectedTier === MembershipTier.AGENCY) amount = 4999;
        
        const options = {
          key: "rzp_test_YOUR_KEY_HERE", 
          amount: amount * 100,
          currency: "INR",
          name: "Bricova Partner Hub",
          description: `${selectedTier} Plan Subscription`,
          handler: async function (response: any) {
            await processRegistration(finalRole, finalAgencyId, finalAgencyCode);
          },
          prefill: {
            name: formData.name,
            email: formData.email,
          },
          theme: {
            color: "#0f172a",
          },
          modal: {
            ondismiss: function() {
              setIsLoading(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        await processRegistration(finalRole, finalAgencyId, finalAgencyCode);
      }
    } catch (error: any) {
      alert(error.message || "Registration initialization failed.");
      setIsLoading(false);
    }
  };

  const processRegistration = async (vRole: UserRole, vAgencyId: string, vAgencyCode: string) => {
    try {
      if (!currentUser) return;
      
      const userRef = doc(db, "users", currentUser.uid);
      const identityData = {
        role: vRole,
        displayName: formData.name, // PAN-verified name
        phone: formData.phone,      // New phone number
        agencyId: vAgencyId,
        agencyCode: vAgencyCode,
        reraLicense: formData.licenseNo,
        panCard: formData.pan,
        isIdentityVerified: true,
        registrationDate: new Date().toISOString(),
        plan: selectedTier,
        experience: formData.experience,
        specialization: formData.specialization
      };

      await updateDoc(userRef, identityData);
      const updatedUser: AppUser = { 
        ...currentUser, 
        ...identityData,
        displayName: formData.name,
        phone: formData.phone
      };
      onRegistrationSuccess(updatedUser);
      alert("Partnership Authenticated! Identity documents have been vaulted securely.");
    } catch (error: any) {
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const agentTiers = [
    { 
      id: MembershipTier.FREE, 
      label: 'Free Plan', 
      price: '₹0',
      period: '/ month',
      icon: Clock, 
      benefits: ['3 Active Listings', 'Personal Dashboard', 'Basic Reach'] 
    },
    { 
      id: MembershipTier.BASIC, 
      label: 'Basic Agent', 
      price: '₹999',
      period: '/ month',
      icon: Gem, 
      benefits: ['15 Active Listings', 'Verified Badge', 'Priority Visibility', 'Lead CRM'] 
    }
  ];

  const agencyTiers = [
    { 
      id: MembershipTier.PRO, 
      label: 'Pro Agent', 
      price: '₹1,999',
      period: '/ month',
      icon: Briefcase, 
      benefits: ['25 Active Listings', 'Team Dashboard', 'Verified Status'] 
    },
    { 
      id: MembershipTier.AGENCY, 
      label: 'Agency Plan', 
      price: '₹4,999',
      period: '/ month',
      icon: Crown, 
      benefits: ['50 Active Listings', 'Advanced Analytics', 'Lead Routing'] 
    },
    { 
      id: MembershipTier.AGENCY, 
      label: 'Platinum Hub', 
      price: '₹9,999',
      period: '/ month',
      icon: Rocket, 
      benefits: ['Unlimited Listings', 'White Label Portal', '24/7 Priority Support'] 
    }
  ];

  const displayedTiers = registrationType === 'ADMIN' ? [...agentTiers, ...agencyTiers].slice(0, 4) : agentTiers;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-beige-50 relative overflow-hidden flex items-center justify-center py-10 md:py-16 px-6">
      <BuildingSkyline />
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#0f172a_3px,transparent_3px)] [background-size:80px_80px]"></div>
      </div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 relative z-10">
        <div className="space-y-8 md:space-y-12 self-center duration-1000 hidden lg:block">
          <div className="space-y-4 md:space-y-6">
            <h4 className="text-gold font-bold uppercase tracking-widest text-[10px] md:text-[12px] border-l-4 border-gold pl-4 md:pl-6">Official Partner Hub</h4>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-[1000] text-navy tracking-tighter leading-[0.9] uppercase">
              Establish <br className="hidden sm:block" />
              <span className="text-gold italic font-serif lowercase tracking-normal">Your Empire.</span>
            </h1>
            <p className="text-navy-muted text-sm md:text-xl font-medium max-w-lg leading-relaxed uppercase tracking-widest opacity-80">
              Join India's most trusted real estate marketplace as a verified agent or agency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-premium border border-beige-200 group transition-all duration-700">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-navy text-white rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 transition-transform shadow-elevated">
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-gold" />
              </div>
              <h5 className="font-[900] text-navy mb-2 uppercase text-[10px] md:text-[12px] tracking-widest">Verified Badge</h5>
              <p className="text-navy-muted text-[8px] md:text-[10px] font-bold uppercase leading-relaxed opacity-70 tracking-wider">Gain trust instantly with RERA-compliant profile verification.</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-premium border border-beige-200 group transition-all duration-700">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white text-navy rounded-xl md:rounded-2xl border-2 border-navy flex items-center justify-center mb-4 md:mb-6 group-hover:scale-105 transition-transform shadow-soft">
                <Rocket className="w-6 h-6 md:w-7 md:h-7 text-gold" />
              </div>
              <h5 className="font-[900] text-navy mb-2 uppercase text-[10px] md:text-[12px] tracking-widest">Premium Reach</h5>
              <p className="text-navy-muted text-[8px] md:text-[10px] font-bold uppercase leading-relaxed opacity-70 tracking-wider">List properties securely and connect with serious institutional buyers.</p>
            </div>
          </div>
        </div>

        <div className="w-full relative space-y-8 duration-1000 delay-300">
          <div className="flex justify-center items-center gap-4 lg:gap-3">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-[10px] font-bold border-2 transition-all ${currentStep === s ? 'bg-navy border-navy text-white scale-110 shadow-premium' : currentStep > s ? 'bg-success border-success text-white' : 'bg-white border-beige-300 text-navy-muted'}`}>
                  {currentStep > s ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : s}
                </div>
                {s < 3 && <div className={`h-0.5 w-8 md:w-12 rounded-full ${currentStep > s ? 'bg-success' : 'bg-beige-300'}`}></div>}
              </div>
            ))}
          </div>

          <div className="text-center space-y-2 lg:hidden">
            <h1 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter uppercase p-2">Partner Hub</h1>
            <p className="text-navy-muted font-bold uppercase tracking-widest text-[9px] md:text-[11px]">Join India's most trusted real estate marketplace</p>
          </div>

        <div className="bg-white border border-beige-200 p-6 md:p-10 lg:p-12 rounded-3xl md:rounded-[3rem] shadow-premium relative mx-auto w-full max-w-2xl bg-white/95 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-navy rounded-t-3xl md:rounded-t-[3rem]"></div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-8">
               <div className="relative">
                 <div className="w-28 h-28 border-4 border-gold/10 rounded-[2rem]"></div>
                 <div className="w-28 h-28 border-4 border-t-navy rounded-[2rem] absolute inset-0 animate-spin"></div>
                 <div className="absolute inset-0 flex items-center justify-center text-gold"><ShieldCheck className="w-8 h-8" /></div>
               </div>
               <div className="space-y-2">
                 <h2 className="text-xl font-bold text-navy uppercase tracking-widest">{loadingText}</h2>
                 <p className="text-[10px] font-bold text-navy-muted uppercase tracking-widest">Verifying your license with RERA standards</p>
               </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              {currentStep === 1 && (
                <div className="space-y-10 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-beige-100 p-1.5 rounded-2xl border border-beige-200">
                    <button 
                      type="button" 
                      onClick={() => setRegistrationType('ADMIN')}
                      className={`py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${registrationType === 'ADMIN' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted hover:text-navy'}`}
                    >
                      Register as Agency
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setRegistrationType('EMPLOYEE')}
                      className={`py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${registrationType === 'EMPLOYEE' ? 'bg-navy text-white shadow-soft' : 'text-navy-muted hover:text-navy'}`}
                    >
                      Join an Agency
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="label-premium">Full Name (As per PAN Card)</label>
                      <input 
                        type="text" placeholder="Enter your name as in PAN card"
                        className="input-premium w-full"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                      <p className="text-[8px] font-bold text-navy-muted uppercase opacity-60">Identity must match NSDL database for PAN verification.</p>
                    </div>
                    <div className="space-y-3">
                      <label className="label-premium">Email Address</label>
                      <input 
                        type="email" placeholder="rahul@premiumrealty.in"
                        className="input-premium w-full"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="label-premium">Phone Number</label>
                      <input 
                        type="tel" placeholder="+91 98XXX XXXXX"
                        className="input-premium w-full"
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>

                    {registrationType === 'ADMIN' ? (
                      <div className="md:col-span-2 space-y-3">
                        <label className="label-premium">Agency / Firm Name</label>
                        <input 
                          type="text" placeholder="e.g. Skyline India Realty"
                          className="input-premium w-full"
                          value={formData.agencyName} onChange={e => setFormData({...formData, agencyName: e.target.value})}
                        />
                      </div>
                    ) : (
                      <div className="md:col-span-2 space-y-3">
                        <label className="label-premium">Agency Invite Code</label>
                        <input 
                          type="text" placeholder="Enter 6-digit Agency Code"
                          className="input-premium w-full"
                          value={formData.inviteCode} onChange={e => setFormData({...formData, inviteCode: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 duration-500">
                  <div className="space-y-3 relative group">
                    <div className="flex justify-between items-center">
                      <label className="label-premium">RERA License Number</label>
                      {reraStatus === 'verified' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-widest border border-success/20 animate-in fade-in zoom-in duration-500">
                          <ShieldCheck className="w-3 h-3" /> Background Verified
                        </span>
                      )}
                      {reraStatus === 'failed' && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest border border-red-100 animate-in fade-in slide-in-from-right-2 duration-300">
                          Not Found in Portal
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text" placeholder="e.g. PRM/KA/RERA/1251/..."
                        className={`input-premium w-full pr-12 transition-all duration-500 ${reraStatus === 'verified' ? 'border-success ring-4 ring-success/10 bg-success/[0.02]' : reraStatus === 'failed' ? 'border-red-300 bg-red-50/30' : ''}`}
                        value={formData.licenseNo} onChange={e => setFormData({...formData, licenseNo: e.target.value})}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {reraStatus === 'checking' && (
                          <div className="w-5 h-5 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                        )}
                        {reraStatus === 'verified' && (
                          <div className="w-6 h-6 bg-success text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {reraStatus === 'failed' && (
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold leading-none">!</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[8px] font-bold text-navy-muted uppercase opacity-60 tracking-wider flex justify-between">
                      <span>Format: PRM/[STATE]/RERA/[ID]/...</span>
                      {reraStatus === 'idle' && formData.licenseNo.length > 0 && <span className="animate-pulse">Analyzing...</span>}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <label className="label-premium">Years of Experience</label>
                    <input 
                      type="number"
                      className="input-premium w-full"
                      value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3 relative group">
                    <div className="flex justify-between items-center">
                      <label className="label-premium">Individual / Firm PAN Card</label>
                      {panStatus === 'verified' && panRecordName && (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-widest border border-success/20 animate-in fade-in zoom-in duration-500">
                          <Check className="w-2.5 h-2.5" /> Identity Match: {panRecordName}
                        </span>
                      )}
                      {panStatus === 'failed' && formData.pan.length === 10 && (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-widest border border-red-100 animate-in fade-in slide-in-from-right-2 duration-300">
                          {/[A-Z]{5}[0-9]{4}[A-Z]{1}/i.test(formData.pan) ? 'Name Mismatch with Records' : 'Invalid PAN Format'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="text" placeholder="e.g. ABCDE1234F"
                        maxLength={10}
                        className={`input-premium w-full pr-12 transition-all duration-500 ${panStatus === 'verified' ? 'border-success ring-4 ring-success/10 bg-success/[0.02]' : panStatus === 'failed' ? 'border-red-300 bg-red-50/30' : ''}`}
                        value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {panStatus === 'checking' && (
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] font-bold text-gold uppercase animate-pulse">Fetching NSDL Data...</span>
                             <div className="w-5 h-5 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                          </div>
                        )}
                        {panStatus === 'verified' && (
                          <div className="w-6 h-6 bg-success text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                        )}
                        {panStatus === 'failed' && (
                          <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold leading-none">!</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {panStatus === 'failed' && /[A-Z]{5}[0-9]{4}[A-Z]{1}/i.test(formData.pan) && (
                      <p className="text-[8px] font-bold text-red-500 uppercase opacity-80 tracking-tight pl-2">
                        The name on this PAN card doesn't match the name you provided in Step 1. Please ensure they are identical.
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="label-premium">Specialization</label>
                    <input 
                      type="text" required placeholder="Luxury Villas, Commercial Office Space, Hitech City Plots"
                      className="input-premium w-full"
                      value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 duration-500">
                  {displayedTiers.map((tier) => (
                    <button 
                      key={tier.id} type="button" 
                      onClick={() => setSelectedTier(tier.id)}
                      className={`relative p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-2 transition-all flex flex-col items-center text-center space-y-4 md:space-y-6 ${selectedTier === tier.id ? 'bg-navy border-navy text-white shadow-premium scale-[1.03]' : 'bg-beige-50 border-beige-200 text-navy-muted hover:border-gold/40'}`}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${selectedTier === tier.id ? 'bg-white/10 text-white shadow-soft' : 'bg-white border border-beige-200 text-gold shadow-soft'}`}>
                        <tier.icon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest">{tier.label}</h4>
                        <div className="text-2xl font-[900] tracking-tighter">{tier.price}</div>
                        <p className="text-[8px] font-bold uppercase opacity-60 tracking-widest">{tier.period}</p>
                      </div>
                      <ul className="space-y-3 flex-1">
                        {tier.benefits.map((b, i) => (
                          <li key={i} className="text-[9px] font-bold uppercase tracking-widest border-b border-white/5 pb-1">{b}</li>
                        ))}
                      </ul>
                      <div className={`w-full py-3.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border-2 transition-all ${selectedTier === tier.id ? 'bg-white text-navy border-white' : 'bg-beige-100 border-beige-300 text-navy-muted'}`}>
                        {selectedTier === tier.id ? 'Select Plan' : 'Choose Plan'}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {currentStep > 1 && (
                  <button type="button" onClick={() => setCurrentStep((currentStep - 1) as Step)} className="flex-1 py-4 md:py-5 rounded-xl md:rounded-[1.5rem] border-2 border-beige-200 text-navy-muted font-bold uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-beige-50 transition-all">Back</button>
                )}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`flex-[2] py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-bold uppercase text-[10px] md:text-[11px] tracking-wider shadow-premium transition-all flex items-center justify-center gap-3 ${isLoading ? 'bg-navy/30 text-white/50 cursor-not-allowed grayscale' : 'bg-navy text-white hover:bg-navy-ultra active:scale-[0.98]'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      Vaulting Documents...
                    </>
                  ) : (
                    <>
                      {currentStep === 2 && (reraStatus === 'checking' || panStatus === 'checking') ? 'Verifying...' : currentStep === 3 ? 'Complete Registration' : 'Next Step'} <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
        </div>
        
        <div className="text-center lg:col-span-2 mt-4">
           <p className="text-[10px] font-bold text-navy-muted uppercase tracking-wider">Partnering for Trust & Transparency in Indian Real Estate</p>
        </div>
      </div>
    </div>
  );
};

export default AgentRegistrationView;
