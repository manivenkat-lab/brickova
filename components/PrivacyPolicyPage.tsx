import React, { useEffect } from 'react';

const PrivacyPolicyPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-12 border-b border-beige-200 pb-8">
          <button 
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold hover:text-navy transition-colors mb-6 group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Back to Home
          </button>
          
          <h1 className="text-3xl md:text-5xl font-[900] text-navy tracking-tighter leading-tight font-montserrat uppercase">
            Privacy Policy
          </h1>
          <p className="text-xs md:text-sm text-navy-muted font-bold tracking-wider mt-2">
            Effective Date: June 17, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-navy font-sans leading-relaxed text-sm md:text-base">
          <p className="font-medium text-navy/80">
            Welcome to Brickova. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect and use your information when you visit <a href="https://www.brickova.in" className="text-gold font-bold hover:underline">www.brickova.in</a>.
          </p>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">1.</span> Data Collection
            </h2>
            <div className="space-y-3 font-medium text-navy-muted">
              <p>
                As Brickova is currently in its MVP stage operating as a demo platform, we do not require user account creation, logins, or payment information. We only collect information you voluntarily provide via our contact or demo request forms. This includes:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Phone Number</li>
                <li>Company Name and Inquiry Details</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">2.</span> Data Usage
            </h2>
            <div className="space-y-3 font-medium text-navy-muted">
              <p>We use the collected information strictly to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Respond to your inquiries.</li>
                <li>Schedule and conduct product demos.</li>
                <li>Provide updates regarding Brickova's launch and features.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">3.</span> Data Security
            </h2>
            <p className="font-medium text-navy-muted">
              We implement standard security measures to protect your inquiry data against unauthorized access.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">4.</span> Cookies
            </h2>
            <p className="font-medium text-navy-muted">
              Our website may use basic cookies to enhance user experience and analyze website traffic. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">5.</span> Third-Party Sharing
            </h2>
            <p className="font-medium text-navy-muted">
              We do not sell, trade, or rent your personal identification information to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">6.</span> Contact Us
            </h2>
            <p className="font-medium text-navy-muted">
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:info@brickova.in" className="text-gold font-bold hover:underline">info@brickova.in</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
