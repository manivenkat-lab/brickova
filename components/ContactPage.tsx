import React, { useState } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("https://formsubmit.co/ajax/info@brickova.in", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: "New Contact Inquiry from " + formData.name,
          _template: "box",
          _replyto: formData.email,
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone || "Not provided",
          Message: formData.message
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="bg-beige-50 min-h-screen pt-16 md:pt-24 pb-16 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold font-black uppercase tracking-widest text-[10px] mb-6">
            <i className="fa-regular fa-envelope"></i> Contact Us
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-[900] text-navy tracking-tighter leading-tight font-montserrat mb-4">
            GET IN <span className="text-slate-500">TOUCH</span>
          </h1>
          <p className="text-xs md:text-sm text-navy-muted font-medium leading-relaxed">
            Whether you're an institutional investor looking to skip the waitlist, or a property owner ready to list directly, our team is standing by.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card 1: Email */}
            <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-soft flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-navy/5 flex flex-shrink-0 items-center justify-center">
                  <i className="fa-solid fa-at text-navy"></i>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-navy-muted uppercase tracking-widest mb-1">Direct Email</h4>
                  <p className="text-sm font-bold text-navy">info@brickova.in</p>
               </div>
            </div>

            {/* Card 2: HQ */}
            <div className="bg-white p-6 rounded-2xl border border-beige-200 shadow-soft flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-gold/10 flex flex-shrink-0 items-center justify-center">
                  <i className="fa-solid fa-location-dot text-gold"></i>
               </div>
               <div>
                  <h4 className="text-[10px] font-black text-gold uppercase tracking-widest mb-1">Headquarters (India)</h4>
                  <p className="text-sm font-bold text-navy leading-relaxed">
                    Financial District<br/>
                    Hyderabad, Telangana 500032
                  </p>
               </div>
            </div>

            {/* Card 3: Priority Support */}
            <div className="bg-navy p-6 rounded-2xl border border-navy-light shadow-navy text-white">
               <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <i className="fa-solid fa-headset text-white"></i>
               </div>
               <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Priority Support</h4>
               <p className="text-xs text-slate-300 leading-relaxed">
                 Brickova members enrolled in the <span className="text-gold font-bold">Pro Seller</span> tier receive immediate telephony assistance.
               </p>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-beige-200 shadow-premium">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-2">
                    <i className="fa-solid fa-check text-2xl text-success"></i>
                  </div>
                  <h3 className="text-2xl font-black text-navy font-montserrat">Message Received</h3>
                  <p className="text-sm text-navy-muted max-w-sm">
                    Thank you for reaching out. A member of the Brickova management team will contact you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-[10px] uppercase font-black tracking-widest text-gold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-navy uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-navy uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        required
                        className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy uppercase tracking-widest">How can we help?</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full bg-beige-50 border border-beige-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-gold transition-colors resize-none"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full btn-glass text-white py-4 font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:shadow-elevated active:scale-[0.98] transition-all"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
