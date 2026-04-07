import React from 'react';
import { Camera, Smartphone, Trash2, Ruler, FileCheck } from 'lucide-react';

interface BlueprintUploadProps {
  blueprintFile: File | null;
  floorPlanUrl: string;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
}

const BlueprintUpload: React.FC<BlueprintUploadProps> = ({ 
  blueprintFile, 
  floorPlanUrl, 
  onFileSelect, 
  onRemove 
}) => {
  return (
    <div className="p-8 md:p-10 bg-beige-50/50 border border-beige-200 rounded-[2rem] space-y-6">
      <div className="flex items-center justify-between border-b border-beige-200 pb-4">
        <div className="flex items-center gap-3">
          <FileCheck className="w-5 h-5 text-gold" />
          <h6 className="text-[11px] font-bold uppercase tracking-widest text-navy">Structural Blueprint</h6>
        </div>
        <span className="text-[8px] font-bold text-navy-muted uppercase tracking-widest">
          {blueprintFile || floorPlanUrl ? 'Plan Ready' : 'Plan Required'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-video bg-white border-2 border-dashed border-beige-300 rounded-2xl flex flex-col items-center justify-center overflow-hidden group">
          {blueprintFile || floorPlanUrl ? (
            <div className="w-full h-full relative group">
              <img 
                src={blueprintFile ? URL.createObjectURL(blueprintFile) : floorPlanUrl} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="Property Blueprint"
              />
              <div className="absolute inset-0 bg-navy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  type="button"
                  onClick={onRemove}
                  className="w-10 h-10 bg-alert text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 p-6">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-beige-200 flex items-center justify-center mx-auto text-navy-muted group-hover:text-gold transition-colors">
                <Ruler className="w-6 h-6" />
              </div>
              <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest max-w-[160px]">
                Upload Architect Blueprints for verification
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center gap-4">
          <label className="cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
            <div className="w-full py-4 px-6 bg-white border border-beige-200 rounded-xl flex items-center gap-4 hover:border-gold/40 hover:shadow-premium transition-all">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-navy uppercase tracking-widest">Capture Photo</p>
                <p className="text-[8px] font-bold text-navy-muted uppercase tracking-wider">Use device camera</p>
              </div>
            </div>
          </label>

          <label className="cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
            <div className="w-full py-4 px-6 bg-white border border-beige-200 rounded-xl flex items-center gap-4 hover:border-gold/40 hover:shadow-premium transition-all">
              <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center text-navy-muted">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-navy uppercase tracking-widest">Upload Gallery</p>
                <p className="text-[8px] font-bold text-navy-muted uppercase tracking-wider">Select from files</p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default BlueprintUpload;
