
import React, { useState } from 'react';
import { X, Camera, ShieldCheck, User, Mail, CheckCheck, Save } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
}

interface UserSettingsProps {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
  onCancel: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-navy p-10 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <h2 className="text-4xl font-bold tracking-tighter">Profile Settings</h2>
          <p className="text-gold/60 font-medium">Keep your details updated for better connections</p>
          
          <button 
            onClick={onCancel}
            className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 bg-navy text-gold rounded-[2.5rem] flex items-center justify-center text-5xl font-bold shadow-2xl mb-6 relative group overflow-hidden border-2 border-gold/20">
                {formData.name.charAt(0)}
                <div className="absolute inset-0 bg-gold/0 group-hover:bg-navy/80 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Camera className="w-8 h-8 text-gold" />
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest text-center">Identity Snapshot</p>
              
              <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 w-full">
                <h4 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Account Status</h4>
                <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                  Verified User
                </div>
                <div className="mt-4 text-[10px] font-medium text-slate-400 leading-relaxed">
                  Your identity is protected. Contact details are only shared securely with verified participants.
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-8 w-full">
              <div className="space-y-6">
                <div>
                  <label className="label-premium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
                    <input 
                      type="text" 
                      required 
                      className="input-premium w-full pl-14 pr-6 py-5"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-premium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
                    <input 
                      type="email" 
                      required 
                      className="input-premium w-full pl-14 pr-6 py-5"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-10 border-t border-slate-100">
                <button 
                  type="submit" 
                  className={`flex-1 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-navy text-gold hover:bg-navy-light'}`}
                >
                  {isSaved ? (
                    <>
                      <CheckCheck className="w-5 h-5" />
                      Updated Successfully
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save My Changes
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={onCancel}
                  className="px-10 py-5 border-2 border-slate-100 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
