import React from 'react';
import { Property, PropertyType, PropertyCategory } from '../types';
import { ShieldCheck, TrendingUp, Bookmark, Bed, Ruler, MapPin, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  isShortlisted?: boolean;
  onToggleShortlist: (id: string) => void;
  onSelect: (p: Property) => void;
  formatPrice: (price: number) => string;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800';

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isShortlisted, onToggleShortlist, onSelect, formatPrice }) => {
  const propertyImage = property?.images?.[0] || DEFAULT_IMAGE;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group bg-white rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden border border-beige-200/60 shadow-premium-soft hover:shadow-premium transition-all duration-500 ease-out flex flex-col w-full h-full min-h-[400px] sm:min-h-[440px] lg:min-h-[480px] relative cursor-pointer"
      onClick={() => onSelect(property)}
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden m-3 sm:m-4 rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem]">
        {propertyImage.includes('.mp4') || propertyImage.includes('.mov') || propertyImage.includes('.webm') || propertyImage.includes('/video/') ? (
          <video 
            src={propertyImage} 
            className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-1000 ease-in-out"
            muted 
            autoPlay 
            playsInline 
            loop
          />
        ) : (
          <img 
            src={propertyImage} 
            alt={property?.title || "Property"} 
            className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-1000 ease-in-out"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_IMAGE;
            }}
          />
        )}
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
           {property?.isVerified && (
             <div className="px-3.5 py-1.5 bg-white/70 backdrop-blur-xl text-navy border border-white/20 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full shadow-glass flex items-center gap-2 transition-all group-hover:bg-gold group-hover:text-white group-hover:border-gold">
                <ShieldCheck className="w-3.5 h-3.5" /> 
                <span className="mt-0.5">Verified</span>
             </div>
           )}
           <div className="px-3.5 py-1.5 bg-navy/80 backdrop-blur-xl text-white border border-white/10 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full shadow-glass">
              {property?.category === PropertyCategory.PLOT ? 'Commercial Land' : property?.type === PropertyType.RENT ? 'Premium Lease' : 'Capital Sale'}
           </div>
        </div>

        {/* View Count Badge */}
        <div className="absolute bottom-4 left-4 bg-navy/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-inner border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
           <Eye className="w-3.5 h-3.5 text-gold" /> 
           <span>{property?.stats?.views != null ? Number(property.stats.views).toLocaleString('en-IN') : '0'} Views</span>
        </div>

        {/* Bookmark Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist(property?.id || "");
          }}
          className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 z-10 shadow-glass border active:scale-95 ${isShortlisted ? 'bg-gold border-gold text-white' : 'bg-white/40 backdrop-blur-xl border-white/30 text-white hover:bg-white hover:text-navy'}`}
        >
          <Bookmark className={`w-4.5 h-4.5 ${isShortlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      </div>

      {/* Content Section */}
      <div className="px-5 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-8 pt-1 sm:pt-2 flex flex-col flex-1">
        <div className="space-y-4">
           <div className="space-y-1">
             <div className="flex items-center gap-2 mb-1">
               <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">
                 {property?.propertyType === 'Plot' ? 'Strategic Land' : 
                  property?.bhk && property?.propertyType ? `${property.bhk} BHK ${property.propertyType}` : 
                  property?.bhk ? `${property.bhk} BHK` : 
                  property?.propertyType || 'Premium Property'}
               </p>
               {property?.propertyCode && (
                 <span className="px-2 py-0.5 bg-navy/5 border border-navy/10 rounded-md text-[9px] font-black text-navy uppercase tracking-widest">
                   #{property.propertyCode}
                 </span>
               )}
             </div>
             <h3 className="text-xl md:text-2xl font-bold text-navy group-hover:text-navy-ultra transition-all line-clamp-1 leading-tight tracking-tight">
              {property?.title ?? "Untitled Property"}
             </h3>
           </div>
           
           <div className="flex items-center justify-between py-2 border-y border-beige-100/60">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-navy-muted uppercase tracking-widest opacity-50">Market Value</span>
                <span className="text-xl sm:text-2xl font-black text-navy tracking-tight">
                  {formatPrice(property?.price || 0)}
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center">
                  <Ruler className="w-4 h-4 text-gold mb-1" />
                  <span className="text-[10px] font-bold text-navy uppercase tracking-tighter">{property?.sqft ?? property?.plotArea ?? "-"} SF</span>
                </div>
                {property?.propertyType !== 'Plot' && (
                  <div className="flex flex-col items-center">
                    <Bed className="w-4 h-4 text-gold mb-1" />
                    <span className="text-[10px] font-bold text-navy uppercase tracking-tighter">{property?.bhk ?? "-"} RM</span>
                  </div>
                )}
              </div>
           </div>

           <p className="flex items-center gap-2 pt-1 text-[11px] font-bold text-navy-muted uppercase tracking-widest">
             <MapPin className="w-4 h-4 text-gold" />
             <span className="truncate">{property?.city || property?.location || property?.address?.city || "India"}</span>
           </p>
        </div>

        {/* Footer Action */}
        <div className="pt-4 mt-auto flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[9px] font-bold text-navy-muted uppercase tracking-[0.15em] opacity-40 mb-1">Investment Index</span>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-[11px] font-black text-navy uppercase tracking-widest">+12.4% ARR</span>
              </div>
           </div>
           <button className="h-11 sm:h-12 lg:h-14 px-5 sm:px-6 lg:px-8 bg-navy text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] rounded-full hover:bg-gold transition-all duration-500 shadow-navy hover:shadow-gold active:scale-95 flex items-center gap-2 sm:gap-3 group/btn">
             <span>View Details</span>
             <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
