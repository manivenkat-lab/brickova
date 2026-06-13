import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createDemoRequest } from '../services/leadService';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' }, { code: '+7', country: 'RU/KZ' }, { code: '+20', country: 'EG' },
  { code: '+27', country: 'ZA' }, { code: '+30', country: 'GR' }, { code: '+31', country: 'NL' },
  { code: '+32', country: 'BE' }, { code: '+33', country: 'FR' }, { code: '+34', country: 'ES' },
  { code: '+36', country: 'HU' }, { code: '+39', country: 'IT' }, { code: '+40', country: 'RO' },
  { code: '+41', country: 'CH' }, { code: '+43', country: 'AT' }, { code: '+44', country: 'UK' },
  { code: '+45', country: 'DK' }, { code: '+46', country: 'SE' }, { code: '+47', country: 'NO' },
  { code: '+48', country: 'PL' }, { code: '+49', country: 'DE' }, { code: '+51', country: 'PE' },
  { code: '+52', country: 'MX' }, { code: '+53', country: 'CU' }, { code: '+54', country: 'AR' },
  { code: '+55', country: 'BR' }, { code: '+56', country: 'CL' }, { code: '+57', country: 'CO' },
  { code: '+58', country: 'VE' }, { code: '+60', country: 'MY' }, { code: '+61', country: 'AU' },
  { code: '+62', country: 'ID' }, { code: '+63', country: 'PH' }, { code: '+64', country: 'NZ' },
  { code: '+65', country: 'SG' }, { code: '+66', country: 'TH' }, { code: '+81', country: 'JP' },
  { code: '+82', country: 'KR' }, { code: '+84', country: 'VN' }, { code: '+86', country: 'CN' },
  { code: '+90', country: 'TR' }, { code: '+91', country: 'IN' }, { code: '+92', country: 'PK' },
  { code: '+93', country: 'AF' }, { code: '+94', country: 'LK' }, { code: '+95', country: 'MM' },
  { code: '+98', country: 'IR' }, { code: '+211', country: 'SS' }, { code: '+212', country: 'MA' },
  { code: '+213', country: 'DZ' }, { code: '+216', country: 'TN' }, { code: '+218', country: 'LY' },
  { code: '+220', country: 'GM' }, { code: '+221', country: 'SN' }, { code: '+222', country: 'MR' },
  { code: '+223', country: 'ML' }, { code: '+224', country: 'GN' }, { code: '+225', country: 'CI' },
  { code: '+226', country: 'BF' }, { code: '+227', country: 'NE' }, { code: '+228', country: 'TG' },
  { code: '+229', country: 'BJ' }, { code: '+230', country: 'MU' }, { code: '+231', country: 'LR' },
  { code: '+232', country: 'SL' }, { code: '+233', country: 'GH' }, { code: '+234', country: 'NG' },
  { code: '+235', country: 'TD' }, { code: '+236', country: 'CF' }, { code: '+237', country: 'CM' },
  { code: '+238', country: 'CV' }, { code: '+239', country: 'ST' }, { code: '+240', country: 'GQ' },
  { code: '+241', country: 'GA' }, { code: '+242', country: 'CG' }, { code: '+243', country: 'CD' },
  { code: '+244', country: 'AO' }, { code: '+245', country: 'GW' }, { code: '+246', country: 'IO' },
  { code: '+248', country: 'SC' }, { code: '+249', country: 'SD' }, { code: '+250', country: 'RW' },
  { code: '+251', country: 'ET' }, { code: '+252', country: 'SO' }, { code: '+253', country: 'DJ' },
  { code: '+254', country: 'KE' }, { code: '+255', country: 'TZ' }, { code: '+256', country: 'UG' },
  { code: '+257', country: 'BI' }, { code: '+258', country: 'MZ' }, { code: '+260', country: 'ZM' },
  { code: '+261', country: 'MG' }, { code: '+262', country: 'RE' }, { code: '+263', country: 'ZW' },
  { code: '+264', country: 'NA' }, { code: '+265', country: 'MW' }, { code: '+266', country: 'LS' },
  { code: '+267', country: 'BW' }, { code: '+268', country: 'SZ' }, { code: '+269', country: 'KM' },
  { code: '+290', country: 'SH' }, { code: '+291', country: 'ER' }, { code: '+297', country: 'AW' },
  { code: '+298', country: 'FO' }, { code: '+299', country: 'GL' }, { code: '+350', country: 'GI' },
  { code: '+351', country: 'PT' }, { code: '+352', country: 'LU' }, { code: '+353', country: 'IE' },
  { code: '+354', country: 'IS' }, { code: '+355', country: 'AL' }, { code: '+356', country: 'MT' },
  { code: '+357', country: 'CY' }, { code: '+358', country: 'FI' }, { code: '+359', country: 'BG' },
  { code: '+370', country: 'LT' }, { code: '+371', country: 'LV' }, { code: '+372', country: 'EE' },
  { code: '+373', country: 'MD' }, { code: '+374', country: 'AM' }, { code: '+375', country: 'BY' },
  { code: '+376', country: 'AD' }, { code: '+377', country: 'MC' }, { code: '+378', country: 'SM' },
  { code: '+380', country: 'UA' }, { code: '+381', country: 'RS' }, { code: '+382', country: 'ME' },
  { code: '+385', country: 'HR' }, { code: '+386', country: 'SI' }, { code: '+387', country: 'BA' },
  { code: '+389', country: 'MK' }, { code: '+420', country: 'CZ' }, { code: '+421', country: 'SK' },
  { code: '+423', country: 'LI' }, { code: '+500', country: 'FK' }, { code: '+501', country: 'BZ' },
  { code: '+502', country: 'GT' }, { code: '+503', country: 'SV' }, { code: '+504', country: 'HN' },
  { code: '+505', country: 'NI' }, { code: '+506', country: 'CR' }, { code: '+507', country: 'PA' },
  { code: '+508', country: 'PM' }, { code: '+509', country: 'HT' }, { code: '+590', country: 'BL' },
  { code: '+591', country: 'BO' }, { code: '+592', country: 'GY' }, { code: '+593', country: 'EC' },
  { code: '+594', country: 'GF' }, { code: '+595', country: 'PY' }, { code: '+596', country: 'MQ' },
  { code: '+597', country: 'SR' }, { code: '+598', country: 'UY' }, { code: '+599', country: 'CW' },
  { code: '+670', country: 'TL' }, { code: '+672', country: 'NF' }, { code: '+673', country: 'BN' },
  { code: '+674', country: 'NR' }, { code: '+675', country: 'PG' }, { code: '+676', country: 'TO' },
  { code: '+677', country: 'SB' }, { code: '+678', country: 'VU' }, { code: '+679', country: 'FJ' },
  { code: '+680', country: 'PW' }, { code: '+681', country: 'WF' }, { code: '+682', country: 'CK' },
  { code: '+683', country: 'NU' }, { code: '+685', country: 'WS' }, { code: '+686', country: 'KI' },
  { code: '+687', country: 'NC' }, { code: '+688', country: 'TV' }, { code: '+689', country: 'PF' },
  { code: '+690', country: 'TK' }, { code: '+691', country: 'FM' }, { code: '+692', country: 'MH' },
  { code: '+850', country: 'KP' }, { code: '+852', country: 'HK' }, { code: '+853', country: 'MO' },
  { code: '+855', country: 'KH' }, { code: '+856', country: 'LA' }, { code: '+880', country: 'BD' },
  { code: '+886', country: 'TW' }, { code: '+960', country: 'MV' }, { code: '+961', country: 'LB' },
  { code: '+962', country: 'JO' }, { code: '+963', country: 'SY' }, { code: '+964', country: 'IQ' },
  { code: '+965', country: 'KW' }, { code: '+966', country: 'SA' }, { code: '+967', country: 'YE' },
  { code: '+968', country: 'OM' }, { code: '+970', country: 'PS' }, { code: '+971', country: 'AE' },
  { code: '+972', country: 'IL' }, { code: '+973', country: 'BH' }, { code: '+974', country: 'QA' },
  { code: '+975', country: 'BT' }, { code: '+976', country: 'MN' }, { code: '+977', country: 'NP' },
  { code: '+992', country: 'TJ' }, { code: '+993', country: 'TM' }, { code: '+994', country: 'AZ' },
  { code: '+995', country: 'GE' }, { code: '+996', country: 'KG' }, { code: '+998', country: 'UZ' }
];

const DemoPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    region: '',
    company: '',
    role: '',
    companySize: '1-10',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDemoRequest(formData);
      
      // Send real-time email notification via FormSubmit
      await fetch("https://formsubmit.co/ajax/info@brickova.in", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: "New Demo Request from " + formData.name,
          _template: "box",
          _replyto: formData.email,
          Name: formData.name,
          Email: formData.email,
          Company: formData.company,
          Region: formData.region,
          Role: formData.role || "Not specified",
          "Company Size": formData.companySize,
          Phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : "Not provided",
          Message: formData.message || "No additional message"
        })
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to submit demo request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[2rem] shadow-premium border border-beige-200 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-navy/5 pointer-events-none"></div>
          <div className="w-20 h-20 bg-navy text-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
            <i className="fa-solid fa-check text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-navy uppercase tracking-tighter mb-4">Request Received</h2>
          <p className="text-xs font-bold text-navy-muted uppercase tracking-widest leading-relaxed mb-8">
            Thank you for your interest. Our enterprise team will contact you shortly to schedule your personalized platform walkthrough.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-beige-50 text-navy hover:bg-navy hover:text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl transition-all duration-300"
          >
            Return to Platform
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-beige-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-navy/5 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-beige-200 shadow-soft">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-navy">Enterprise Demo</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-navy uppercase tracking-tighter leading-[0.9] pb-2">
                See Brickova AI <span className="text-gold drop-shadow-sm">In Action</span>
              </h1>
              <p className="text-xs md:text-sm font-bold text-navy-muted uppercase tracking-widest leading-relaxed max-w-xl">
                Experience the future of real estate operations. Schedule a personalized walkthrough of our AI-powered property management and sales ecosystem.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: 'fa-robot', title: 'AI Assistant', desc: 'Automated buyer matching' },
                  { icon: 'fa-chart-line', title: 'Smart CRM', desc: 'Predictive lead scoring' },
                  { icon: 'fa-building-shield', title: 'Asset Mgmt', desc: 'Institutional grade tracking' },
                  { icon: 'fa-bolt', title: 'Fast Execution', desc: 'Zero latency transactions' },
                ].map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-beige-200 flex items-center justify-center shrink-0 shadow-soft">
                      <i className={`fa-solid ${feature.icon} text-gold`}></i>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-navy uppercase tracking-widest mb-1">{feature.title}</h4>
                      <p className="text-[9px] font-bold text-navy-muted uppercase tracking-widest opacity-70">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] border border-white shadow-premium transform rotate-1 scale-[1.02]"></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-white/50 shadow-soft">
                <h3 className="text-lg font-black text-navy uppercase tracking-widest mb-8">Schedule Your Demo</h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Full Name *</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-navy/20" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Work Email *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-navy/20" placeholder="john@company.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Company Name *</label>
                      <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-navy/20" placeholder="Acme Real Estate" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Region / Country *</label>
                      <select required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all appearance-none cursor-pointer">
                        <option value="">Select Country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Phone Number</label>
                      <div className="flex gap-2">
                        <select value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value})} className="w-1/3 bg-white/50 border border-beige-200 rounded-xl px-2 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all appearance-none text-center cursor-pointer">
                          {COUNTRY_CODES.map(c => (
                            <option key={c.country} value={c.code}>{c.code} ({c.country})</option>
                          ))}
                        </select>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-2/3 bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-navy/20" placeholder="234 567 8900" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Your Role</label>
                      <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all appearance-none">
                        <option value="">Select Role</option>
                        <option value="Executive">C-Level / Executive</option>
                        <option value="Broker">Broker / Agent</option>
                        <option value="Developer">Property Developer</option>
                        <option value="Investor">Investor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">Company Size</label>
                      <select value={formData.companySize} onChange={e => setFormData({...formData, companySize: e.target.value})} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all appearance-none">
                        <option value="1-10">1-10 Employees</option>
                        <option value="11-50">11-50 Employees</option>
                        <option value="51-200">51-200 Employees</option>
                        <option value="201+">201+ Employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-navy-muted uppercase tracking-widest">How can we help? (Optional)</label>
                    <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} className="w-full bg-white/50 border border-beige-200 rounded-xl px-4 py-3 text-xs font-bold text-navy focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-navy/20 resize-none" placeholder="Tell us about your specific requirements..."></textarea>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      required 
                      id="terms" 
                      className="mt-0.5 w-3.5 h-3.5 rounded border-beige-200 text-gold focus:ring-gold bg-white/50 cursor-pointer accent-gold"
                    />
                    <label htmlFor="terms" className="text-[8px] sm:text-[9px] font-bold text-navy-muted uppercase tracking-widest opacity-80 cursor-pointer leading-relaxed">
                      I agree to the <span className="text-navy hover:text-gold transition-colors">Terms of Service</span> and <span className="text-navy hover:text-gold transition-colors">Privacy Policy</span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-navy text-white hover:bg-gold font-black text-[10px] uppercase tracking-widest py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-6 shadow-soft disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
                    ) : (
                      <>
                        Request Demo <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Interactive Mockup Section */}
      <section className="py-24 bg-white border-t border-beige-200 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-16 relative z-10">
          <h2 className="text-2xl md:text-4xl font-black text-navy uppercase tracking-tighter mb-4">Command Center OS</h2>
          <p className="text-[10px] md:text-xs font-bold text-navy-muted uppercase tracking-[0.3em] max-w-2xl mx-auto">
            A unified interface for managing your entire real estate portfolio, powered by deep learning and predictive analytics.
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 md:px-8">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative bg-navy rounded-[1rem] p-2 md:p-4 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.5)] border border-navy-muted/20"
          >
            {/* Window Controls */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            
            {/* Dashboard Mockup Content */}
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-6">
                <div className="h-32 rounded-xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/20 p-4 flex flex-col justify-between">
                  <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">Total Portfolio Value</div>
                  <div className="text-3xl font-black text-white">$142.5M</div>
                  <div className="text-[9px] text-green-400 font-bold tracking-wider">+12.4% vs last quarter</div>
                </div>
                <div className="h-48 rounded-xl bg-white/5 border border-white/5 p-4 space-y-4">
                  <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">Active Leads</div>
                  {[75, 45, 90].map((w, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[8px] text-white/40">
                        <span>Project {['Alpha', 'Beta', 'Gamma'][i]}</span>
                        <span>{w}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${w}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gold rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div className="text-[9px] text-white/50 uppercase tracking-widest font-bold">AI Market Predictions</div>
                   <div className="px-3 py-1 bg-gold/20 text-gold text-[8px] uppercase tracking-widest rounded-full font-bold">Live Data</div>
                </div>
                <div className="flex-1 relative border-l border-b border-white/10">
                   {/* Mock Chart line */}
                   <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M0,80 Q20,70 40,90 T70,40 T100,20" 
                        fill="none" 
                        stroke="#cfa15f" 
                        strokeWidth="2" 
                      />
                      <path d="M0,80 Q20,70 40,90 T70,40 T100,20 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.2"/>
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#cfa15f" stopOpacity="1" />
                          <stop offset="100%" stopColor="#cfa15f" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                   </svg>
                   
                   {/* Floating nodes */}
                   {[
                     { x: '40%', y: '85%' },
                     { x: '70%', y: '45%' },
                     { x: '95%', y: '25%' }
                   ].map((pos, i) => (
                     <motion.div 
                       key={i}
                       initial={{ scale: 0, opacity: 0 }}
                       whileInView={{ scale: 1, opacity: 1 }}
                       transition={{ delay: 1.5 + i * 0.2 }}
                       className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                       style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
                     />
                   ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DemoPage;
