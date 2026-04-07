import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Signature, 
  MapPin, 
  Ruler, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Satellite, 
  Loader2, 
  Navigation, 
  FileText, 
  FileCheck, 
  FileLock, 
  Camera, 
  Trash2, 
  Plus,
  Check,
  Edit2,
  Settings,
  LayoutGrid,
  Smartphone,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import BlueprintUpload from './BlueprintUpload';

const PremiumDropdown = ({ label, value, options, onChange }: { label: string, value: string, options: { label: string, value: string }[], onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="label-premium flex items-center justify-between">
        {label}
        {isOpen && <span className="text-[7px] font-bold text-gold animate-pulse">SELECTING...</span>}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 px-5 rounded-xl border-2 transition-all flex items-center justify-between text-left group ${isOpen ? 'bg-white border-navy shadow-premium' : 'bg-white/40 backdrop-blur-sm border-beige-200 hover:border-gold/40'}`}
      >
        <span className={`text-[11px] font-bold uppercase tracking-widest ${!value ? 'text-navy-muted' : 'text-navy'}`}>
          {selectedOption?.label || label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold scale-110' : 'text-navy-muted'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[200] bg-white/95 backdrop-blur-xl border border-beige-200 rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-5 py-3.5 flex items-center justify-between group transition-all hover:bg-beige-50 ${value === opt.value ? 'bg-navy/5' : ''}`}
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${value === opt.value ? 'text-gold' : 'text-navy-muted group-hover:text-navy'}`}>
                {opt.label}
              </span>
              {value === opt.value && <Check className="w-3.5 h-3.5 text-gold shrink-0 scale-110" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
import { Property, PropertyCategory, PropertyType, MembershipTier, BHKType, PropertyAddress, PropertyTechnicalDetails, Agent } from '../types';
import { generatePropertyDescription } from '../services/geminiService';
import { INDIAN_CITIES } from '../constants';
import { createProperty, updateProperty } from '../services/propertyService';
import { geocodeAddress, reverseGeocode } from '../services/geocodingService';
import { auth } from '../firebase';

const compressImage = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas compression failed'));
        }, 'image/jpeg', 0.7);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const isVideo = file.type.startsWith('video/');
  let fileToUpload: Blob | File = file;
  
  if (!isVideo) {
    fileToUpload = await compressImage(file);
  }

  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('upload_preset', 'brickova_upload');
  
  const endpoint = isVideo 
    ? `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`
    : `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Cloudinary upload error details:', errorData);
    throw new Error(`Cloudinary ${isVideo ? 'video' : 'image'} upload failed: ${errorData.error?.message || response.statusText}`);
  }
  
  const data = await response.json();
  return data.secure_url;
};

interface PropertyFormProps {
  onSuccess: (p: Property) => void;
  onCancel: () => void;
  initialData?: Property | null;
  role?: 'OWNER' | 'AGENT';
  agentProfile?: Agent; // Passing profile to check limits
  existingPropertiesCount?: number; // Count to check against limits
}

type FormTab = 'BASIC' | 'LOCATION' | 'STRUCTURAL' | 'REVIEW';

const DRAFT_KEY = 'mhomes_property_form_draft_v2';

const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess, onCancel, initialData, role, agentProfile, existingPropertiesCount = 0 }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>('BASIC');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const [images, setImages] = useState<any[]>(initialData?.images || []);
  const [verificationDocUrl, setVerificationDocUrl] = useState<string>(initialData?.verificationDocUrl || '');
  const [occupancyCertUrl, setOccupancyCertUrl] = useState<string>(initialData?.occupancyCertUrl || '');
  const [ownershipProofUrl, setOwnershipProofUrl] = useState<string>(initialData?.ownershipProofUrl || '');
  const [registrationNumber, setRegistrationNumber] = useState<string>(initialData?.registrationNumber || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [occupancyCertFile, setOccupancyCertFile] = useState<File | null>(null);
  const [ownershipProofFile, setOwnershipProofFile] = useState<File | null>(null);
  const [blueprintFile, setBlueprintFile] = useState<File | null>(null);
  const [isUploadingBlueprint, setIsUploadingBlueprint] = useState(false);

  const FILE_SIZE_LIMIT_MB = 5;
  const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024;

  const handleDocFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrl: (url: string) => void,
    setFile: (file: File | null) => void,
    label: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > FILE_SIZE_LIMIT_BYTES) {
      alert(`${label} must be under ${FILE_SIZE_LIMIT_MB}MB. Selected file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`);
      e.target.value = '';
      return;
    }
    setFile(file);
    try {
      const uri = await fileToDataUri(file);
      setUrl(uri);
    } catch {
      alert(`Error reading ${label}.`);
    }
  };

  const [formData, setFormData] = useState({
    propertyType: initialData?.propertyType || 'Flat',
    propertyCode: initialData?.propertyCode || `${Math.floor(1000 + Math.random() * 9000)}`,
    title: initialData?.title || '',
    price: initialData?.price?.toString() || '',
    pricePerSqft: initialData?.pricePerSqft?.toString() || '',
    location: initialData?.location || INDIAN_CITIES?.[0] || 'Mumbai',
    category: initialData?.category || PropertyCategory.DEVELOPED,
    bhk: initialData?.bhk || BHKType.BHK3,
    type: initialData?.type || PropertyType.SALE,
    sqft: initialData?.sqft?.toString() || '',
    facing: initialData?.facing || 'East',
    isCorner: initialData?.isCorner || false,
    openSides: initialData?.openSides?.toString() || '1',
    boundaryWall: initialData?.boundaryWall || false,
    roadWidth: initialData?.roadWidth?.toString() || '30',
    amenities: initialData?.amenities?.join(', ') || '',
    description: initialData?.description || '',
    floorPlanUrl: initialData?.floorPlanUrl || '',
    googleMapUrl: initialData?.googleMapUrl || '',
    ownerName: initialData?.ownerName || agentProfile?.name || '',
    ownerPhone: initialData?.ownerPhone || agentProfile?.phone || '',
    // Plot specific
    plotArea: initialData?.plotArea?.toString() || '',
    plotType: initialData?.plotType || 'Residential',
    approvedLayout: initialData?.approvedLayout || false,
    // Flat/Apartment specific
    floorNo: initialData?.floorNo?.toString() || '',
    totalFloors: initialData?.totalFloors?.toString() || '',
    bathrooms: initialData?.bathrooms?.toString() || '',
    furnishing: initialData?.furnishing || 'Unfurnished',
    balcony: initialData?.balcony || false,
    parking: initialData?.parking || false,
    ageOfProperty: initialData?.ageOfProperty?.toString() || '',
    // Villa specific
    builtUpArea: initialData?.builtUpArea?.toString() || '',
    garden: initialData?.garden || false,
    latitude: initialData?.latitude || undefined as number | undefined,
    longitude: initialData?.longitude || undefined as number | undefined,
    locationSource: initialData?.locationSource || undefined as 'gps' | 'manual' | undefined,
    address: {
      addressLine: initialData?.address?.addressLine || '',
      city: initialData?.address?.city || '',
      area: initialData?.address?.area || '',
      state: initialData?.address?.state || '',
      zip: initialData?.address?.zip || '',
      country: initialData?.address?.country || 'India',
      floorNo: initialData?.address?.floorNo || '',
      roomNo: initialData?.address?.roomNo || ''
    },
    technicalDetails: {
      lotSize: initialData?.technicalDetails?.lotSize?.toString() || '',
      rooms: initialData?.technicalDetails?.rooms?.toString() || '',
      bathrooms: initialData?.technicalDetails?.bathrooms?.toString() || '',
      yearBuilt: initialData?.technicalDetails?.yearBuilt?.toString() || '',
      garages: initialData?.technicalDetails?.garages?.toString() || '',
      garageSize: initialData?.technicalDetails?.garageSize || '',
      availableFrom: initialData?.technicalDetails?.availableFrom || '',
      basement: initialData?.technicalDetails?.basement || '',
      externalConstruction: initialData?.technicalDetails?.externalConstruction || '',
      roofing: initialData?.technicalDetails?.roofing || ''
    }
  });

  const getListingLimit = (tier?: MembershipTier) => {
    switch(tier) {
      case MembershipTier.FREE: return 3;
      case MembershipTier.BASIC: return 15;
      case MembershipTier.PRO: return 50;
      case MembershipTier.AGENCY: return 9999;
      default: return 3;
    }
  };

  useEffect(() => {
    if (!initialData) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Draft error:", e);
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch (e) {
        console.warn("Draft persist failed", e);
      }
    }
  }, [formData, initialData]);

  const fileToDataUri = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files].slice(0, 10));
      const uris = await Promise.all(files.map(async file => {
        if (file.type.startsWith('video/')) {
          return URL.createObjectURL(file); // Safe memory object for videos
        }
        return await fileToDataUri(file);
      }));
      setImages(prev => [...prev, ...uris].slice(0, 10));
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleDocFileUpload(e, setVerificationDocUrl, setDocFile, 'Sale Deed / RERA PDF');
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
        
        // Reverse Geocode
        const addressDetails = await reverseGeocode(latitude, longitude);
        
        // Try to match with INDIAN_CITIES
        let matchedLocation = formData.location;
        if (addressDetails) {
          const possibleMatch = INDIAN_CITIES.find(city => 
            city.toLowerCase().includes(addressDetails.city.toLowerCase()) && 
            (addressDetails.area ? city.toLowerCase().includes(addressDetails.area.toLowerCase()) : true)
          );
          if (possibleMatch) {
            matchedLocation = possibleMatch;
          } else {
            // Try matching just city
            const cityOnlyMatch = INDIAN_CITIES.find(city => 
              city.toLowerCase().includes(addressDetails.city.toLowerCase())
            );
            if (cityOnlyMatch) matchedLocation = cityOnlyMatch;
          }
        }

        setFormData(prev => ({ 
          ...prev, 
          googleMapUrl: mapsLink,
          latitude,
          longitude,
          locationSource: 'gps',
          location: matchedLocation, // Update Primary City
          address: {
            ...prev.address,
            addressLine: addressDetails?.addressLine || prev.address.addressLine,
            city: addressDetails?.city || prev.address.city,
            area: addressDetails?.area || prev.address.area,
            state: addressDetails?.state || prev.address.state,
            zip: addressDetails?.zip || prev.address.zip,
            country: addressDetails?.country || prev.address.country,
          }
        }));
        setIsDetectingLocation(false);
        alert("Current location and address captured successfully");
      }, (error) => {
        setIsDetectingLocation(false);
        let errorMsg = "GPS Signal denied.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Please enable location access in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "The request to get user location timed out.";
        }
        alert(errorMsg);
      });
    } else {
      setIsDetectingLocation(false);
      alert("Browser doesn't support geolocation.");
    }
  };

  useEffect(() => {
    if (formData.category === PropertyCategory.PLOT && formData.sqft && formData.pricePerSqft) {
      const calculatedTotal = Number(formData.sqft) * Number(formData.pricePerSqft);
      if (!isNaN(calculatedTotal)) {
        setFormData(prev => ({ ...prev, price: calculatedTotal.toString() }));
      }
    }
  }, [formData.sqft, formData.pricePerSqft, formData.category]);

  const handleGeminiGen = async () => {
    if (!formData.title || !formData.location) {
      alert("Missing basic info.");
      return;
    }
    setLoading(true);
    const desc = await generatePropertyDescription({
      title: formData.title,
      location: formData.location,
      bhk: formData.category === PropertyCategory.PLOT ? 'Plot/Land' : formData.bhk.toString(),
      amenities: formData.amenities.split(',').map(s => s.trim())
    });
    setFormData({...formData, description: desc || ''});
    setLoading(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      address: { ...formData.address, [name]: value },
      locationSource: formData.locationSource === 'gps' ? 'manual' : formData.locationSource
    });
  };

  const handleTechChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, technicalDetails: { ...formData.technicalDetails, [name]: value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUserId = auth.currentUser?.uid || agentProfile?.id || initialData?.ownerId;
    if (!currentUserId) {
      alert("Please login to post a property");
      return;
    }

    // Enforcement Logic
    if (!initialData) {
      const limit = getListingLimit(agentProfile?.tier);
      if (existingPropertiesCount >= limit) {
        alert(`Inventory Limit Reached. Your current schema (${agentProfile?.tier || 'Individual'}) supports max ${limit} active listings. Upgrade via Partner Hub for higher volume.`);
        return;
      }
    }

    if (images.length === 0) { alert("At least one image is required."); return; }
    if (!verificationDocUrl) { alert("Sale Deed / RERA PDF is required."); return; }
    if (!registrationNumber.trim()) { alert("Registration number is required."); return; }
    if (!occupancyCertUrl) { alert("Occupancy Certificate is required."); return; }
    if (!ownershipProofUrl) { alert("Primary Proof of Ownership is required."); return; }

    try {
      setIsSubmitting(true);
      setLoading(true);
      console.log("Property submission started...");

      let finalImages = [...images];
      let finalDocUrl = verificationDocUrl;

      // Upload new files if any
      if (imageFiles.length > 0) {
        console.log(`Uploading ${imageFiles.length} media files to Cloudinary...`);
        const uploadedUrls = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)));
        // Filter out data URIs and replace with real URLs
        const existingUrls = images.filter(img => !img.startsWith('data:') && !img.startsWith('blob:'));
        finalImages = [...existingUrls, ...uploadedUrls];
      }

      if (docFile) {
        console.log("Uploading verification document to Cloudinary...");
        finalDocUrl = await uploadToCloudinary(docFile);
      }

      let finalOccupancyCertUrl = occupancyCertUrl;
      if (occupancyCertFile) {
        console.log("Uploading occupancy certificate to Cloudinary...");
        finalOccupancyCertUrl = await uploadToCloudinary(occupancyCertFile);
      }

      let finalOwnershipProofUrl = ownershipProofUrl;
      if (ownershipProofFile) {
        console.log("Uploading ownership proof to Cloudinary...");
        finalOwnershipProofUrl = await uploadToCloudinary(ownershipProofFile);
      }

      let finalBlueprintUrl = formData.floorPlanUrl;
      if (blueprintFile) {
        console.log("Uploading blueprint to Cloudinary...");
        finalBlueprintUrl = await uploadToCloudinary(blueprintFile);
      }

      let currentLat = formData.latitude;
      let currentLng = formData.longitude;
      let currentSource = formData.locationSource;
      let currentAddress = formData.address.addressLine;

      // If no GPS location, try geocoding the address
      if (currentSource !== 'gps') {
        const fullAddress = `${formData.address.addressLine}, ${formData.address.area}, ${formData.address.city}, ${formData.address.state}, ${formData.address.zip}, ${formData.address.country}`;
        console.log("Geocoding address:", fullAddress);
        const geoResult = await geocodeAddress(fullAddress);
        if (geoResult) {
          currentLat = geoResult.latitude;
          currentLng = geoResult.longitude;
          currentSource = 'manual';
          currentAddress = geoResult.formattedAddress;
          console.log("Geocoding success:", geoResult);
        } else {
          console.warn("Geocoding failed for address. Proceeding without coordinates.");
        }
      }

      const p: any = {
        propertyCode: formData.propertyCode,
        category: formData.category,
        propertyType: formData.propertyType,
        ownerId: currentUserId,
        agencyId: agentProfile?.agencyId || initialData?.agencyId,
        listedBy: initialData?.listedBy || role || 'OWNER',
        tier: agentProfile?.tier || initialData?.tier || MembershipTier.FREE,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        pricePerSqft: formData.propertyType === 'Plot' ? Number(formData.pricePerSqft) : undefined,
        location: formData.location,
        googleMapUrl: currentSource === 'gps' ? formData.googleMapUrl : (currentLat && currentLng ? `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}` : formData.googleMapUrl),
        address: { ...formData.address, addressLine: currentAddress || formData.address.addressLine },
        latitude: currentLat,
        longitude: currentLng,
        locationSource: currentSource,
        technicalDetails: {
          lotSize: formData.technicalDetails.lotSize ? Number(formData.technicalDetails.lotSize) : undefined,
          rooms: formData.technicalDetails.rooms ? Number(formData.technicalDetails.rooms) : undefined,
          bathrooms: formData.technicalDetails.bathrooms ? Number(formData.technicalDetails.bathrooms) : undefined,
          yearBuilt: formData.technicalDetails.yearBuilt ? Number(formData.technicalDetails.yearBuilt) : undefined,
          garages: formData.technicalDetails.garages ? Number(formData.technicalDetails.garages) : undefined,
          garageSize: formData.technicalDetails.garageSize,
          availableFrom: formData.technicalDetails.availableFrom,
          basement: formData.technicalDetails.basement,
          externalConstruction: formData.technicalDetails.externalConstruction,
          roofing: formData.technicalDetails.roofing
        },
        type: formData.type,
        bhk: formData.propertyType !== 'Plot' ? formData.bhk : undefined,
        facing: formData.facing as any,
        isCorner: formData.propertyType === 'Plot' ? formData.isCorner : undefined,
        openSides: formData.propertyType === 'Plot' ? Number(formData.openSides) : undefined,
        boundaryWall: formData.propertyType === 'Plot' ? formData.boundaryWall : undefined,
        roadWidth: formData.propertyType === 'Plot' ? Number(formData.roadWidth) : undefined,
        plotArea: formData.propertyType === 'Plot' || formData.propertyType === 'Villa' ? Number(formData.plotArea) : undefined,
        plotType: formData.propertyType === 'Plot' ? formData.plotType : undefined,
        approvedLayout: formData.propertyType === 'Plot' ? formData.approvedLayout : undefined,
        floorNo: (formData.propertyType === 'Flat' || formData.propertyType === 'Apartment') ? Number(formData.floorNo) : undefined,
        totalFloors: (formData.propertyType === 'Flat' || formData.propertyType === 'Apartment' || formData.propertyType === 'Villa') ? Number(formData.totalFloors) : undefined,
        bathrooms: formData.propertyType !== 'Plot' ? Number(formData.bathrooms) : undefined,
        furnishing: formData.propertyType !== 'Plot' ? formData.furnishing : undefined,
        balcony: (formData.propertyType === 'Flat' || formData.propertyType === 'Apartment') ? formData.balcony : undefined,
        parking: formData.propertyType !== 'Plot' ? formData.parking : undefined,
        ageOfProperty: (formData.propertyType === 'Flat' || formData.propertyType === 'Apartment') ? Number(formData.ageOfProperty) : undefined,
        builtUpArea: formData.propertyType === 'Villa' ? Number(formData.builtUpArea) : undefined,
        garden: formData.propertyType === 'Villa' ? formData.garden : undefined,
        images: finalImages,
        verificationDocUrl: finalDocUrl,
        registrationNumber: registrationNumber.trim(),
        occupancyCertUrl: finalOccupancyCertUrl,
        ownershipProofUrl: finalOwnershipProofUrl,
        floorPlanUrl: finalBlueprintUrl,
        energyRating: initialData?.energyRating || 'A',
        energyIndex: initialData?.energyIndex || 120,
        ownerName: formData.ownerName || initialData?.ownerName || agentProfile?.name || 'Strategic Partner',
        ownerEmail: initialData?.ownerEmail || agentProfile?.email || 'admin@global.mhomes',
        ownerPhone: formData.ownerPhone || initialData?.ownerPhone || agentProfile?.phone || '',
        amenities: formData.amenities.split(',').map(s => s.trim()),
        sqft: Number(formData.sqft),
        isVerified: (agentProfile?.tier !== MembershipTier.FREE) || initialData?.isVerified || false,
        blockchainHash: initialData?.blockchainHash || ('0x' + Math.random().toString(16).substr(2, 8)),
        neighborhoodScores: initialData?.neighborhoodScores || { schools: 4.5, safety: 4.2, connectivity: 4.8, lifestyle: 4.8 },
        features: initialData?.features || { smartHome: true, pool: false, gym: true, security247: true, centralAir: true, evCharging: true, equippedKitchen: true, mediaRoom: false },
        stats: initialData?.stats || { views: 0, leads: 0, interests: 0 },
        status: "active"
      };
      
      console.log("Saving property to Firestore...");

      if (initialData?.id) {
        await updateProperty(initialData.id, p);
        console.log("Property updated successfully:", initialData.id);
        setSubmissionStatus('success');
        setTimeout(() => onSuccess({ ...p, id: initialData.id }), 2000);
      } else {
        const id = await createProperty(p, currentUserId, agentProfile?.agencyId || initialData?.agencyId || null);
        console.log("Property created successfully with ID:", id);
        setSubmissionStatus('success');
        setTimeout(() => onSuccess({ ...p, id }), 2000);
      }

      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error("Property submission error:", error instanceof Error ? error.message : error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      setSubmissionStatus('error');
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const tabs: { id: FormTab; label: string; icon: React.ReactNode }[] = [
    { id: 'BASIC', label: 'Basics', icon: <Signature className="w-3 h-3 md:w-4 md:h-4" /> },
    { id: 'LOCATION', label: 'Address', icon: <MapPin className="w-3 h-3 md:w-4 md:h-4" /> },
    { id: 'STRUCTURAL', label: 'Configuration', icon: <Ruler className="w-3 h-3 md:w-4 md:h-4" /> },
    { id: 'REVIEW', label: 'Verification', icon: <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" /> }
  ];

  return (
    <div className="bg-white rounded-none md:rounded-[2rem] overflow-hidden shadow-premium w-full h-full md:h-auto md:max-h-[92vh] flex flex-col border-none md:border md:border-beige-200">
      <div className="bg-white p-6 md:p-8 text-navy border-b border-beige-200 shrink-0">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold text-navy uppercase tracking-tight">
            {initialData ? 'Update Property' : 'List New Property'}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-beige-50 flex items-center justify-center hover:bg-beige-100 transition-all text-navy-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 md:gap-2 bg-beige-50 p-1.5 rounded-xl border border-beige-200 shadow-inner overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => !isSubmitting && setActiveTab(tab.id)}
              disabled={isSubmitting}
              className={`flex-1 min-w-[70px] md:min-w-[100px] py-2.5 md:py-3 px-1 md:px-3 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 text-[9px] md:text-[11px] font-sans font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-white text-navy shadow-soft border border-beige-200' : 'text-navy-muted hover:bg-white/40'}`}
            >
              <div className={`transition-all ${activeTab === tab.id ? 'text-navy' : 'opacity-40'}`}>
                {tab.icon}
              </div>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-beige-50/30 custom-scrollbar no-scrollbar">
        {isSubmitting || submissionStatus === 'success' ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 animate-in zoom-in-95 duration-1000">
            <div className="relative">
               <div className={`w-16 h-16 md:w-20 md:h-20 border-4 rounded-full ${submissionStatus === 'success' ? 'border-green-500' : 'border-gold/10'}`}></div>
               {submissionStatus !== 'success' && <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-t-gold rounded-full absolute inset-0 animate-spin"></div>}
               <div className={`absolute inset-0 flex items-center justify-center ${submissionStatus === 'success' ? 'text-green-500' : 'text-gold'}`}>
                 {submissionStatus === 'success' ? <FileCheck className="w-6 h-6 md:w-8 md:h-8" /> : <Cpu className="w-6 h-6 md:w-8 md:h-8" />}
               </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-display font-bold text-navy uppercase tracking-tight">
                {submissionStatus === 'success' ? 'Property Listed Successfully' : 'Processing Data...'}
              </h3>
              <p className="subtitle-premium opacity-70">
                {submissionStatus === 'success' ? 'Redirecting to your dashboard...' : 'Listing your asset on the network.'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {submissionStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
                <X className="w-5 h-5" />
                {errorMessage}
              </div>
            )}
            {activeTab === 'BASIC' && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <PremiumDropdown 
                  label="Property Type"
                  value={formData.propertyType}
                  options={[
                    { label: 'Plot', value: 'Plot' },
                    { label: 'Flat', value: 'Flat' },
                    { label: 'Apartment', value: 'Apartment' },
                    { label: 'Villa', value: 'Villa' }
                  ]}
                  onChange={val => {
                    setFormData({
                      ...formData, 
                      propertyType: val as any,
                      category: val === 'Plot' ? PropertyCategory.PLOT : PropertyCategory.DEVELOPED
                    });
                  }}
                />

                  <div className="space-y-4 md:space-y-5">
                  <div className="space-y-1.5">
                    <label className="label-premium">Property / Project Title</label>
                    <input type="text" placeholder="e.g. Prestige Heights, Mantri Towers..." className="input-premium w-full" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <PremiumDropdown 
                      label="Transaction Type"
                      value={formData.type}
                      options={[
                        { label: 'Outright Sale', value: PropertyType.SALE },
                        { label: 'Rent / Lease', value: PropertyType.RENT }
                      ]}
                      onChange={val => setFormData({...formData, type: val as any})}
                    />
                    <PremiumDropdown 
                      label="Primary City"
                      value={formData.location}
                      options={INDIAN_CITIES.map(c => ({ label: c, value: c }))}
                      onChange={val => setFormData({...formData, location: val, locationSource: formData.locationSource === 'gps' ? 'manual' : formData.locationSource})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5">
                      <label className="label-premium">Owner / Agent Name</label>
                      <input type="text" placeholder="Full Name" className="input-premium w-full" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="label-premium">Contact Number</label>
                      <input type="tel" placeholder="Phone Number" className="input-premium w-full" value={formData.ownerPhone} onChange={e => setFormData({...formData, ownerPhone: e.target.value})} required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="label-premium">Total Price (₹)</label>
                    <input type="number" placeholder="Enter total value in INR (e.g., 4500000 - 45L)" className="input-premium w-full" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                      <h4 className="section-heading-premium border-none mb-0 pb-0">Detailed Description</h4>
                      <button type="button" onClick={handleGeminiGen} disabled={loading} className="text-[9px] md:text-[10px] font-sans font-semibold uppercase tracking-wider text-gold bg-gold/10 border border-gold/30 px-3 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg hover:bg-gold hover:text-white transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50">
                        <Sparkles className={`w-3 h-3 md:w-4 md:h-4 ${loading ? 'animate-pulse' : ''}`} /> AI Auto-Fill
                      </button>
                   </div>
                   <textarea placeholder="Highlight key features, connectivity, and locality advantages..." className="input-premium w-full h-24 md:h-32 resize-none leading-relaxed font-sans font-normal" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <button type="button" onClick={() => setActiveTab('LOCATION')} className="btn-premium w-full py-4 md:py-5 bg-navy text-white tracking-wider flex items-center justify-center gap-3">Address & Mapping <ChevronRight className="w-5 h-5 text-gold" /></button>
              </div>
            )}

            {activeTab === 'LOCATION' && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                
                {/* Entry Method Selector */}
                <div className="flex p-1 bg-beige-50 rounded-xl border border-beige-200">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, locationSource: 'gps' }));
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.locationSource === 'gps' || !formData.locationSource ? 'bg-white text-navy shadow-soft border border-beige-200' : 'text-navy-muted hover:text-navy'}`}
                  >
                    <Navigation className="w-3.5 h-3.5" /> GPS Scan
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, locationSource: 'manual' }));
                    }}
                    className={`flex-1 py-3 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.locationSource === 'manual' ? 'bg-white text-navy shadow-soft border border-beige-200' : 'text-navy-muted hover:text-navy'}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Manual Entry
                  </button>
                </div>

                {(formData.locationSource === 'gps' || !formData.locationSource) && (
                  <div className="relative p-6 md:p-10 bg-white rounded-xl md:rounded-[2rem] border border-beige-200 shadow-sm overflow-hidden group animate-in zoom-in-95 duration-500">
                    <div className="relative z-10 flex flex-col items-center text-center space-y-4 md:space-y-6">
                      <div className="relative">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${isDetectingLocation ? 'border-navy animate-pulse' : formData.locationSource === 'gps' && formData.latitude ? 'border-green-500 bg-green-50' : 'border-beige-200 bg-beige-50/50 group-hover:border-navy/30'}`}>
                           {isDetectingLocation ? (
                             <Satellite className="w-6 h-6 md:w-8 md:h-8 text-navy animate-bounce" />
                           ) : formData.locationSource === 'gps' && formData.latitude ? (
                             <Navigation className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                           ) : (
                             <MapPin className="w-6 h-6 md:w-8 md:h-8 text-navy-muted group-hover:text-navy transition-colors" />
                           )}
                        </div>
                      </div>

                      <div className="space-y-1">
                         <h4 className="text-sm md:text-base font-display font-bold text-navy uppercase tracking-tight">
                           {formData.locationSource === 'gps' && formData.latitude ? 'Location Captured' : 'Get Current Position'}
                         </h4>
                         <p className="text-[9px] md:text-[10px] font-sans font-medium text-navy-muted/70 uppercase tracking-widest max-w-xs mx-auto">
                           Your address details will be automatically filled after scanning.
                         </p>
                      </div>

                      <button 
                        type="button" 
                        onClick={handleDetectLocation}
                        disabled={isDetectingLocation}
                        className={`btn-premium px-8 py-3.5 tracking-wider flex items-center gap-2.5 transition-all duration-300 shadow-sm ${formData.locationSource === 'gps' && formData.latitude ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-navy text-white hover:bg-navy/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50'}`}
                      >
                        {isDetectingLocation ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>FETCHING...</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4" />
                            <span>{formData.locationSource === 'gps' && formData.latitude ? 'RE-SCAN POSITION' : 'START GPS SCAN'}</span>
                          </>
                        )}
                        {isDetectingLocation ? <RefreshCw className="w-4 h-4 animate-spin text-gold" /> : <Navigation className="w-4 h-4 text-gold" />}
                        {isDetectingLocation ? 'Synchronizing Sensors...' : 'Initialize GPS Scan'}
                      </button>
                    </div>
                  </div>
                )}

                <div className={`space-y-8 md:space-y-10 ${formData.locationSource === 'gps' && !formData.googleMapUrl ? 'opacity-30 pointer-events-none' : ''} transition-opacity duration-500`}>
                  <div className="flex items-center gap-4 border-b border-beige-100 pb-5">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <h5 className="text-lg font-bold uppercase tracking-tight text-navy">Address Specifications</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="label-premium">Street / Suite / Plot No.</label>
                        <input name="addressLine" type="text" placeholder="Building name, street, etc." className="input-premium w-full" value={formData.address.addressLine} onChange={handleAddressChange} required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="label-premium">Area / Locality</label>
                          <input name="area" type="text" placeholder="Indiranagar" className="input-premium w-full" value={formData.address.area} onChange={handleAddressChange} required />
                        </div>
                        <div className="space-y-2">
                          <label className="label-premium">City / District</label>
                          <input name="city" type="text" placeholder="Bangalore" className="input-premium w-full" value={formData.address.city} onChange={handleAddressChange} required />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="label-premium">Pin Code / Zip</label>
                            <input name="zip" type="text" placeholder="560038" className="input-premium w-full" value={formData.address.zip} onChange={handleAddressChange} required />
                          </div>
                          <div className="space-y-2">
                            <label className="label-premium">State / Province</label>
                            <input name="state" type="text" placeholder="Karnataka" className="input-premium w-full" value={formData.address.state} onChange={handleAddressChange} required />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="label-premium">Google Maps Intelligence</label>
                          <div className="relative">
                            <input name="googleMapUrl" type="text" placeholder="Paste Map Link or use GPS Scan" className="input-premium w-full !pl-10" value={formData.googleMapUrl} onChange={(e) => setFormData(p => ({ ...p, googleMapUrl: e.target.value }))} />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" />
                          </div>
                          <p className="text-[7px] font-bold text-navy-muted uppercase tracking-[0.2em] mt-2">Verified map link increases trust by 40%</p>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'STRUCTURAL' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-5 duration-700">
                <div className="p-8 md:p-12 bg-white border border-beige-200 rounded-[2.5rem] shadow-soft space-y-10">
                  <div className="flex items-center gap-4 border-b border-beige-100 pb-5">
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h5 className="text-lg font-bold uppercase tracking-tight text-navy">Engineering & Configuration</h5>
                  </div>
                      {formData.propertyType === 'Plot' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                         <div className="space-y-1.5">
                            <label className="label-premium">Plot Area (SQFT)</label>
                            <input type="number" className="input-premium w-full" value={formData.plotArea} onChange={e => setFormData({...formData, plotArea: e.target.value, sqft: e.target.value})} required />
                         </div>
                         <PremiumDropdown 
                            label="Plot Facing"
                            value={formData.facing}
                            options={[
                              { label: 'East', value: 'East' },
                              { label: 'West', value: 'West' },
                              { label: 'North', value: 'North' },
                              { label: 'South', value: 'South' }
                            ]}
                            onChange={val => setFormData({...formData, facing: val as any})}
                         />
                         <div className="space-y-1.5">
                            <label className="label-premium">Road Width (FT)</label>
                            <input type="number" className="input-premium w-full" value={formData.roadWidth} onChange={e => setFormData({...formData, roadWidth: e.target.value})} />
                         </div>
                         <PremiumDropdown 
                            label="Plot Type"
                            value={formData.plotType}
                            options={[
                              { label: 'Residential', value: 'Residential' },
                              { label: 'Commercial', value: 'Commercial' }
                            ]}
                            onChange={val => setFormData({...formData, plotType: val as any})}
                         />
                         <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-gold focus:ring-gold" checked={formData.isCorner} onChange={e => setFormData({...formData, isCorner: e.target.checked})} />
                            <label className="label-premium !mb-0 !ml-0">Corner Plot</label>
                         </div>
                         <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-gold focus:ring-gold" checked={formData.approvedLayout} onChange={e => setFormData({...formData, approvedLayout: e.target.checked})} />
                            <label className="label-premium !mb-0 !ml-0">Approved Layout</label>
                         </div>
                      </div>
                    ) : (formData.propertyType === 'Flat' || formData.propertyType === 'Apartment') ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                         <PremiumDropdown 
                            label="BHK Type"
                            value={formData.bhk as string}
                            options={Object.values(BHKType).map(t => ({ label: t, value: t }))}
                            onChange={val => setFormData({...formData, bhk: val as any})}
                         />
                         <div className="space-y-1.5">
                            <label className="label-premium">Floor Number</label>
                            <input type="number" className="input-premium w-full" value={formData.floorNo} onChange={e => setFormData({...formData, floorNo: e.target.value})} />
                         </div>
                         <div className="space-y-1.5">
                            <label className="label-premium">Total Floors</label>
                            <input type="number" className="input-premium w-full" value={formData.totalFloors} onChange={e => setFormData({...formData, totalFloors: e.target.value})} />
                         </div>
                         <div className="space-y-1.5">
                            <label className="label-premium">Bathrooms</label>
                            <input type="number" className="input-premium w-full" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
                         </div>
                         <PremiumDropdown 
                            label="Furnishing"
                            value={formData.furnishing}
                            options={[
                              { label: 'Unfurnished', value: 'Unfurnished' },
                              { label: 'Semi-Furnished', value: 'Semi-Furnished' },
                              { label: 'Fully-Furnished', value: 'Fully-Furnished' }
                            ]}
                            onChange={val => setFormData({...formData, furnishing: val as any})}
                         />
                         <div className="space-y-1.5">
                            <label className="label-premium">Age of Property (Yrs)</label>
                            <input type="number" className="input-premium w-full" value={formData.ageOfProperty} onChange={e => setFormData({...formData, ageOfProperty: e.target.value})} />
                          </div>
                          <PremiumDropdown 
                             label="Property Facing"
                             value={formData.facing}
                             options={[
                               { label: 'East', value: 'East' },
                               { label: 'West', value: 'West' },
                               { label: 'North', value: 'North' },
                               { label: 'South', value: 'South' }
                             ]}
                             onChange={val => setFormData({...formData, facing: val as any})}
                          />
                         <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-gold focus:ring-gold" checked={formData.balcony} onChange={e => setFormData({...formData, balcony: e.target.checked})} />
                            <label className="label-premium !mb-0 !ml-0">Balcony</label>
                         </div>
                         <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-gold focus:ring-gold" checked={formData.parking} onChange={e => setFormData({...formData, parking: e.target.checked})} />
                            <label className="label-premium !mb-0 !ml-0">Parking</label>
                         </div>
                         <div className="space-y-1.5">
                            <label className="label-premium">Carpet Area (SQFT)</label>
                            <input type="number" className="input-premium w-full" value={formData.sqft} onChange={e => setFormData({...formData, sqft: e.target.value})} required />
                         </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                         <PremiumDropdown 
                            label="BHK Type"
                            value={formData.bhk as string}
                            options={Object.values(BHKType).map(t => ({ label: t, value: t }))}
                            onChange={val => setFormData({...formData, bhk: val as any})}
                         />
                         <div className="space-y-1.5">
                            <label className="label-premium">Built-up Area (SQFT)</label>
                            <input type="number" className="input-premium w-full" value={formData.builtUpArea} onChange={e => setFormData({...formData, builtUpArea: e.target.value, sqft: e.target.value})} required />
                         </div>
                         <div className="space-y-1.5">
                            <label className="label-premium">Plot Area (SQFT)</label>
                            <input type="number" className="input-premium w-full" value={formData.plotArea} onChange={e => setFormData({...formData, plotArea: e.target.value})} />
                         </div>
                         <div className="space-y-1.5">
                            <label className="label-premium">Total Floors</label>
                            <input type="number" className="input-premium w-full" value={formData.totalFloors} onChange={e => setFormData({...formData, totalFloors: e.target.value})} />
                         </div>
                         <PremiumDropdown 
                            label="Furnishing"
                            value={formData.furnishing}
                            options={[
                              { label: 'Unfurnished', value: 'Unfurnished' },
                              { label: 'Semi-Furnished', value: 'Semi-Furnished' },
                              { label: 'Fully-Furnished', value: 'Fully-Furnished' }
                            ]}
                            onChange={val => setFormData({...formData, furnishing: val as any})}
                         />
                         <PremiumDropdown 
                             label="Property Facing"
                             value={formData.facing}
                             options={[
                               { label: 'East', value: 'East' },
                               { label: 'West', value: 'West' },
                               { label: 'North', value: 'North' },
                               { label: 'South', value: 'South' }
                             ]}
                             onChange={val => setFormData({...formData, facing: val as any})}
                          />
                         <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-gold focus:ring-gold" checked={formData.parking} onChange={e => setFormData({...formData, parking: e.target.checked})} />
                            <label className="label-premium !mb-0 !ml-0">Parking</label>
                         </div>
                         <div className="flex items-center gap-2 pt-6">
                            <input type="checkbox" className="w-4 h-4 rounded border-beige-300 text-gold focus:ring-gold" checked={formData.garden} onChange={e => setFormData({...formData, garden: e.target.checked})} />
                            <label className="label-premium !mb-0 !ml-0">Garden / Lawn</label>
                         </div>
                      </div>
                    )}
                 </div>

                  <BlueprintUpload 
                    blueprintFile={blueprintFile} 
                    floorPlanUrl={formData.floorPlanUrl} 
                    onFileSelect={(file) => setBlueprintFile(file)} 
                    onRemove={() => { setBlueprintFile(null); setFormData(f => ({ ...f, floorPlanUrl: '' })); }} 
                  />

                 <div className="flex gap-3 md:gap-4 pt-4">
                   <button type="button" onClick={() => setActiveTab('LOCATION')} className="btn-premium flex-1 py-4 md:py-5 border border-beige-200 text-navy-muted tracking-widest bg-white">Back</button>
                   <button type="button" onClick={() => setActiveTab('REVIEW')} className="btn-premium flex-[2] py-4 md:py-5 bg-navy text-white tracking-widest flex items-center justify-center gap-2 md:gap-3">Verification Docs <ChevronRight className="w-5 h-5 text-gold" /></button>
                </div>
              </div>
            )}

            {activeTab === 'REVIEW' && (
              <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">

                {/* Registration Number */}
                <div className="p-5 md:p-6 bg-white border border-beige-200 rounded-xl md:rounded-[2rem] shadow-soft space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 md:gap-3 border-b border-beige-100 pb-2 md:pb-3">
                    <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                    <h5 className="text-[11px] md:text-[13px] font-bold text-navy uppercase tracking-wider">Registration Number <span className="text-red-500">*</span></h5>
                  </div>
                  <div className="space-y-1.5">
                    <label className="label-premium">Property / RERA Registration Number</label>
                    <input
                      type="text"
                      placeholder="e.g. MH/12345/2024"
                      className="input-premium w-full"
                      value={registrationNumber}
                      onChange={e => setRegistrationNumber(e.target.value)}
                      required
                    />
                    <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-navy-muted mt-1">Enter the official registration or RERA number for this property</p>
                  </div>
                </div>

                {/* Document Uploads — 3 columns on md+, stacked on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

                  {/* Sale Deed / RERA PDF */}
                  <div className="p-4 md:p-5 bg-white border border-beige-200 rounded-xl md:rounded-2xl shadow-soft space-y-3">
                    <div className="flex items-center gap-2 border-b border-beige-100 pb-2">
                      <FileText className="w-4 h-4 text-gold shrink-0" />
                      <h5 className="text-[10px] md:text-[11px] font-bold text-navy uppercase tracking-wider leading-tight">Sale Deed / RERA PDF <span className="text-red-500">*</span></h5>
                    </div>
                    <div className="relative group">
                      <input type="file" accept="application/pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={handleDocUpload} />
                      <div className={`w-full border-2 border-dashed rounded-xl px-3 py-5 md:py-7 text-center transition-all duration-300 ${verificationDocUrl ? 'border-green-400 bg-green-50' : 'border-beige-300 bg-beige-50 hover:border-gold/50'}`}>
                        {verificationDocUrl
                          ? <FileCheck className="w-7 h-7 md:w-9 md:h-9 text-green-500 mx-auto mb-2" />
                          : <FileLock className="w-7 h-7 md:w-9 md:h-9 text-navy-muted mx-auto mb-2" />
                        }
                        <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-navy">
                          {verificationDocUrl ? 'Document Attached' : 'Upload PDF'}
                        </p>
                        <p className="text-[7px] text-navy-muted mt-1 uppercase tracking-wider">Max 5MB</p>
                      </div>
                    </div>
                    {verificationDocUrl && (
                      <button type="button" onClick={() => { setVerificationDocUrl(''); setDocFile(null); }} className="text-[8px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>

                  {/* Occupancy Certificate */}
                  <div className="p-4 md:p-5 bg-white border border-beige-200 rounded-xl md:rounded-2xl shadow-soft space-y-3">
                    <div className="flex items-center gap-2 border-b border-beige-100 pb-2">
                      <FileText className="w-4 h-4 text-gold shrink-0" />
                      <h5 className="text-[10px] md:text-[11px] font-bold text-navy uppercase tracking-wider leading-tight">Occupancy Certificate <span className="text-red-500">*</span></h5>
                    </div>
                    <div className="relative group">
                      <input type="file" accept="application/pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={e => handleDocFileUpload(e, setOccupancyCertUrl, setOccupancyCertFile, 'Occupancy Certificate')} />
                      <div className={`w-full border-2 border-dashed rounded-xl px-3 py-5 md:py-7 text-center transition-all duration-300 ${occupancyCertUrl ? 'border-green-400 bg-green-50' : 'border-beige-300 bg-beige-50 hover:border-gold/50'}`}>
                        {occupancyCertUrl
                          ? <FileCheck className="w-7 h-7 md:w-9 md:h-9 text-green-500 mx-auto mb-2" />
                          : <FileLock className="w-7 h-7 md:w-9 md:h-9 text-navy-muted mx-auto mb-2" />
                        }
                        <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-navy">
                          {occupancyCertUrl ? 'Document Attached' : 'Upload PDF / Image'}
                        </p>
                        <p className="text-[7px] text-navy-muted mt-1 uppercase tracking-wider">Max 5MB</p>
                      </div>
                    </div>
                    {occupancyCertUrl && (
                      <button type="button" onClick={() => { setOccupancyCertUrl(''); setOccupancyCertFile(null); }} className="text-[8px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>

                  {/* Primary Proof of Ownership */}
                  <div className="p-4 md:p-5 bg-white border border-beige-200 rounded-xl md:rounded-2xl shadow-soft space-y-3">
                    <div className="flex items-center gap-2 border-b border-beige-100 pb-2">
                      <FileText className="w-4 h-4 text-gold shrink-0" />
                      <h5 className="text-[10px] md:text-[11px] font-bold text-navy uppercase tracking-wider leading-tight">Proof of Ownership <span className="text-red-500">*</span></h5>
                    </div>
                    <div className="relative group">
                      <input type="file" accept="application/pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" onChange={e => handleDocFileUpload(e, setOwnershipProofUrl, setOwnershipProofFile, 'Proof of Ownership')} />
                      <div className={`w-full border-2 border-dashed rounded-xl px-3 py-5 md:py-7 text-center transition-all duration-300 ${ownershipProofUrl ? 'border-green-400 bg-green-50' : 'border-beige-300 bg-beige-50 hover:border-gold/50'}`}>
                        {ownershipProofUrl
                          ? <FileCheck className="w-7 h-7 md:w-9 md:h-9 text-green-500 mx-auto mb-2" />
                          : <FileLock className="w-7 h-7 md:w-9 md:h-9 text-navy-muted mx-auto mb-2" />
                        }
                        <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-navy">
                          {ownershipProofUrl ? 'Document Attached' : 'Upload PDF / Image'}
                        </p>
                        <p className="text-[7px] text-navy-muted mt-1 uppercase tracking-wider">Max 5MB</p>
                      </div>
                    </div>
                    {ownershipProofUrl && (
                      <button type="button" onClick={() => { setOwnershipProofUrl(''); setOwnershipProofFile(null); }} className="text-[8px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-1 mx-auto">
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Property Media */}
                <div className="p-5 md:p-6 bg-white border border-beige-200 rounded-xl md:rounded-[2rem] shadow-soft space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2 md:gap-3 border-b border-beige-100 pb-2 md:pb-3">
                    <Camera className="w-5 h-5 md:w-6 md:h-6 text-gold" />
                    <h5 className="text-[11px] md:text-[13px] font-bold text-navy uppercase tracking-wider">Property Media</h5>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="label-premium ml-2 block">Upload Gallery (Photos & Videos) ({images.length}/10)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 md:gap-2 mb-2">
                      {images.map((img, i) => {
                        const isVideo = img.startsWith('data:video') || img.startsWith('blob:') || img.includes('.mp4') || img.includes('.mov') || img.includes('.webm') || img.includes('/video/');
                        return (
                          <div key={i} className="aspect-square rounded-md md:rounded-lg border border-beige-200 overflow-hidden relative group bg-black">
                            {isVideo ? (
                              <video src={img} className="w-full h-full object-cover" muted autoPlay playsInline loop></video>
                            ) : (
                              <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />
                            )}
                            <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        );
                      })}
                      {images.length < 10 && (
                        <div className="aspect-square rounded-md md:rounded-lg border-2 border-dashed border-beige-300 bg-beige-50 flex items-center justify-center text-navy-muted relative cursor-pointer hover:border-gold">
                          <input type="file" multiple accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-navy p-6 md:p-10 rounded-xl md:rounded-[2rem] shadow-premium text-center space-y-3 md:space-y-4 relative overflow-hidden group">
                   <p className="label-premium !text-white/50 !mb-0 relative z-10">Property System ID:</p>
                   <div className="inline-block px-4 py-2 md:px-8 md:py-3 bg-white/5 border border-gold/30 rounded-lg md:rounded-xl relative z-10">
                      <span className="text-base md:text-xl font-[900] text-gold tracking-tighter uppercase font-serif italic">MH-{formData.propertyCode}-VERIFIED</span>
                   </div>
                </div>

                <button type="submit" className="btn-premium w-full bg-navy text-white py-4 md:py-6 text-[12px] md:text-[14px] tracking-wider">Post Property Listing</button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default PropertyForm;
