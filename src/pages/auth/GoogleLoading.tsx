import { useEffect } from "react";
import toast from "react-hot-toast";
import { loginWithGoogle } from "../../utils/LoginUsingGoogle";

const GoogleLoading = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    if (!email) {
      toast.error("No email found from Google login");
      window.location.assign("/");
      return;
    }else{
        loginWithGoogle(email);
    }

    console.log("Google email:", email);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] overflow-hidden px-6 text-center">
      
      {/* Floating particles */}
      <div className="absolute w-[180px] h-[180px] bg-purple-500/30 rounded-full blur-3xl top-16 left-12 animate-float-slow"></div>
      <div className="absolute w-[260px] h-[260px] bg-blue-500/20 rounded-full blur-3xl bottom-16 right-12 animate-float-slower"></div>

      {/* Logo */}
      <div className="animate-fade-in-up mb-10">
        <div className="logo flex items-center gap-3">
          <span className="logo__dot block w-4 h-4 rounded-full bg-purple-500 animate-pulse-dot"></span>
          <span className="logo__text text-3xl font-semibold text-white tracking-wide">
            ViralMotion
          </span>
        </div>
      </div>

      {/* Loader */}
      <div className="relative w-16 h-16 mb-4 animate-fade-in-up delay-150">
        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-fast"></div>
        <div className="absolute inset-1 border-4 border-purple-300 border-t-transparent rounded-full animate-spin-slow"></div>
      </div>

      {/* Text */}
      <p className="text-gray-300 font-medium text-lg animate-fade-in-up delay-300">
        Setting up your account...
      </p>

      <p className="text-gray-500 text-sm mt-2 animate-fade-in-up delay-500">
        Hang tight, we're completing your login ✨
      </p>

      {/* Animations */}
      <style>{`
        @keyframes spin-fast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }

        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        .animate-spin-fast { animation: spin-fast 1s linear infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 10s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }

        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
};

export default GoogleLoading;
