import React, { useEffect } from 'react';

const TermsPage: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
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
            Terms & Conditions
          </h1>
          <p className="text-xs md:text-sm text-navy-muted font-bold tracking-wider mt-2">
            Effective Date: June 17, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-navy font-sans leading-relaxed text-sm md:text-base">
          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">1.</span> Platform Status
            </h2>
            <p className="font-medium text-navy-muted">
              Brickova (<a href="https://www.brickova.in" className="text-gold font-bold hover:underline">www.brickova.in</a>) is currently operating as a Minimum Viable Product (MVP) and demo platform. The website serves purely informational purposes to showcase our upcoming software capabilities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">2.</span> No Transactions or Accounts
            </h2>
            <p className="font-medium text-navy-muted">
              There are no user accounts, subscription portals, or payment gateways currently active on this website. Any requests for demos or information do not constitute a binding software service agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">3.</span> Content Ownership
            </h2>
            <p className="font-medium text-navy-muted">
              All content, branding, logos, text, and graphics on this website are the intellectual property of Brickova. Unauthorized use or reproduction is prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">4.</span> Limitation of Liability
            </h2>
            <p className="font-medium text-navy-muted">
              The information provided on this website is for general informational purposes only. Brickova shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of, or inability to use, this website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">5.</span> Updates to Terms
            </h2>
            <p className="font-medium text-navy-muted">
              We reserve the right to modify these Terms & Conditions at any time as our platform evolves.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight font-montserrat flex items-center gap-3">
              <span className="text-gold">6.</span> Contact Us
            </h2>
            <p className="font-medium text-navy-muted">
              If you have questions about these Terms & Conditions, please contact us at <a href="mailto:info@brickova.in" className="text-gold font-bold hover:underline">info@brickova.in</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default TermsPage;
