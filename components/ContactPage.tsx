import React, { useState, useEffect } from 'react';
import { apiService, FAQItem, AppointmentSlot } from '../services/apiService';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '', selectedSlot: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // API state
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Call separate Contact Page API
    apiService.fetchContactData().then(data => {
      setFaqs(data.faqs);
      setSlots(data.availableSlots);
      setPageLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.submitContactForm({
        _subject: "New Demo/Inquiry Request from " + formData.name,
        _template: "box",
        _replyto: formData.email,
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone || "Not provided",
        Company: formData.company || "Not provided",
        AppointmentSlot: formData.selectedSlot || "None selected",
        Message: formData.message
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', message: '', selectedSlot: '' });
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to submit request. Please try again or contact us directly at info@brickova.in.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (idx: number) => {
    setActiveFaqIndex(prev => prev === idx ? null : idx);
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-beige-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-circle-notch animate-spin text-4xl text-gold"></i>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy-muted">Initializing CRM Link...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-beige-50 min-h-screen pt-16 md:pt-24 pb-16 relative overflow-hidden">
      {/* Decorative Blueprint Lines */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold font-black uppercase tracking-widest text-[10px] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span>
            Demo Booking Console
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-[900] text-navy tracking-tighter leading-tight font-montserrat mb-4">
            Let’s Build the Future Together.
          </h1>
          <p className="text-xs md:text-sm text-navy-muted font-bold leading-relaxed uppercase tracking-wide">
            Schedule a direct walkthrough of Brickova Enterprise OS or connect with our implementation team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left: Contact Info & Interactive FAQs (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="mailto:info@brickova.in" className="bg-white p-6 rounded-2xl border border-beige-200 shadow-soft hover:border-gold/30 hover:shadow-premium transition-all text-left block group">
                 <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-4 group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-envelope text-gold"></i>
                 </div>
                 <h4 className="text-[9px] font-black text-navy-muted uppercase tracking-widest mb-1">Email Inquiry</h4>
                 <span className="text-xs font-black text-navy truncate block">info@brickova.in</span>
              </a>

              <a href="tel:+918008819830" className="bg-white p-6 rounded-2xl border border-beige-200 shadow-soft hover:border-gold/30 hover:shadow-premium transition-all text-left block group">
                 <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-4 group-hover:scale-105 transition-transform">
                    <i className="fa-solid fa-phone text-gold"></i>
                 </div>
                 <h4 className="text-[9px] font-black text-navy-muted uppercase tracking-widest mb-1">Call Telephony</h4>
                 <span className="text-xs font-black text-navy truncate block">+91 8008819830</span>
              </a>
            </div>

            {/* HQ location */}
            <div className="bg-white p-6 rounded-3xl border border-beige-200 shadow-soft text-left flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold shrink-0">
                 <i className="fa-solid fa-location-dot text-lg"></i>
              </div>
              <div>
                 <h4 className="text-[9px] font-black text-gold uppercase tracking-widest mb-1">Brickova HQ Location</h4>
                 <p className="text-xs font-black text-navy leading-relaxed uppercase tracking-wider">
                   Financial District, Nanakramguda<br/>
                   Hyderabad, Telangana, India
                 </p>
              </div>
            </div>

            {/* Dynamic FAQ Accordions */}
            <div className="bg-white p-6 rounded-3xl border border-beige-200 shadow-soft text-left space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-navy border-b border-beige-100 pb-3 font-montserrat">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx;
                  return (
                    <div key={idx} className="border-b border-beige-100 pb-2 last:border-b-0">
                      <button 
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex justify-between items-center text-left text-xs font-black uppercase tracking-wide text-navy hover:text-gold py-1"
                      >
                        {faq.question}
                        <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${isOpen ? 'rotate-180 text-gold' : ''}`}></i>
                      </button>
                      {isOpen && (
                        <p className="text-[10px] text-navy-muted font-medium normal-case leading-relaxed mt-2 animate-fade-in pl-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Appointment Scheduler & Submission Form (Col 7) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-beige-200 shadow-premium">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                    <i className="fa-solid fa-check text-2xl text-green-700"></i>
                  </div>
                  <h3 className="text-2xl font-black text-navy font-montserrat uppercase tracking-tight">Request Logged</h3>
                  <p className="text-xs text-navy-muted max-w-sm uppercase font-semibold tracking-wider leading-relaxed">
                    Thank you. Your demo request has been pushed to our CRM channel. A scheduler calendar link will hit your inbox shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-[10px] uppercase font-black tracking-widest text-gold hover:underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                  <div className="border-b border-beige-200 pb-4 mb-4">
                    <h3 className="text-base font-black text-navy uppercase tracking-tight">Inquiry & Telemetry Request</h3>
                    <p className="text-[10px] font-bold text-navy-muted uppercase tracking-widest mt-1">Select an appointment time slot and fill out your credentials</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Interactive Appointment Scheduler slots */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-navy uppercase tracking-widest block">Available Appointment Slots</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {slots.map(slot => (
                          <button
                            type="button"
                            key={slot.id}
                            disabled={!slot.available}
                            onClick={() => setFormData(prev => ({ ...prev, selectedSlot: slot.time }))}
                            className={`p-3 border text-left rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-between ${!slot.available ? 'bg-beige-100/50 border-beige-200 text-beige-300 cursor-not-allowed opacity-50' : formData.selectedSlot === slot.time ? 'bg-navy text-gold border-navy shadow-soft scale-[1.02]' : 'bg-beige-50 border-beige-200 text-navy hover:border-gold/30'}`}
                          >
                            <span>{slot.time}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded ${!slot.available ? 'bg-beige-200 text-beige-400' : formData.selectedSlot === slot.time ? 'bg-gold/20 text-gold' : 'bg-green-100 text-green-700'}`}>
                              {!slot.available ? 'Booked' : formData.selectedSlot === slot.time ? 'Selected' : 'Available'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-navy uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. John Doe"
                          className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors font-medium text-navy placeholder:text-navy/30"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-navy uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. john@company.com"
                          className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors font-medium text-navy placeholder:text-navy/30"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-navy uppercase tracking-widest">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="e.g. +91 9999999999"
                          className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors font-medium text-navy placeholder:text-navy/30"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-navy uppercase tracking-widest">Company Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Skyline Builders"
                          className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors font-medium text-navy placeholder:text-navy/30"
                          value={formData.company}
                          onChange={e => setFormData({...formData, company: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-navy uppercase tracking-widest">How can we help / Inquiry Details</label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Write details of your inquiry or specific features you'd like to see..."
                        className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors resize-none font-medium text-navy placeholder:text-navy/30"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-navy hover:bg-gold text-white disabled:bg-navy/50 py-4 font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:shadow-elevated active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-circle-notch animate-spin"></i> Registering...
                        </>
                      ) : (
                        "Request Demo & Schedule Slot"
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
