import React, { useState } from 'react';
import { Loader2, Globe } from 'lucide-react';
import { loginWithGoogle } from '../services/authService';

interface GoogleLoginProps {
  onLoginSuccess: (user: any) => void;
}

const GoogleLogin: React.FC<GoogleLoginProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert(`Domain Unauthorized: Please add "${window.location.hostname}" to your Authorized Domains in the Firebase Console (Authentication > Settings > Authorized domains).`);
      } else if (error.code === 'auth/configuration-not-found') {
        alert("Configuration Not Found: Please ensure Google Sign-In is enabled in your Firebase Console (Authentication > Sign-in method).");
      } else {
        alert(`Login failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto relative z-10">
      <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] border border-beige-200/60 text-center relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-10px_rgba(184,146,106,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-navy via-navy to-gold"></div>
        
        <div className="w-20 h-20 bg-beige-50 text-gold rounded-full flex items-center justify-center text-3xl font-serif italic mb-10 shadow-sm mx-auto border border-beige-200 mt-4">
          B.
        </div>
        
        <h2 className="text-2xl font-bold text-navy tracking-tight mb-3">Welcome to Brickova</h2>
        <p className="text-navy-muted font-medium tracking-wide mb-12 text-sm opacity-80 px-2 leading-relaxed">
          Sign in to your professional profile to manage premium asset inventory.
        </p>
        
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full group relative flex items-center justify-center gap-4 bg-white text-navy px-6 py-4 rounded-xl transition-all border border-beige-200 shadow-sm hover:shadow-md hover:bg-beige-50 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-navy" />
              <span className="text-sm font-semibold tracking-wide">Validating...</span>
            </div>
          ) : (
            <>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-semibold tracking-wide">Continue with Google</span>
            </>
          )}
        </button>

        <div className="mt-14 pt-8 border-t border-beige-100 flex justify-center gap-8 items-center text-[10px] font-semibold tracking-widest text-navy-muted uppercase">
          <div className="flex items-center gap-2 group cursor-default">
            <svg className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-beige-200"></div>
          <div className="flex items-center gap-2 group cursor-default">
            <svg className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLogin;