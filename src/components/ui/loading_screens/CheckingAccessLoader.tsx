export default function CheckingAccessLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Animated Background Blobs */}
      <div className="absolute w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl top-10 left-10 animate-float-1"></div>
      <div className="absolute w-[28rem] h-[28rem] bg-purple-300/35 rounded-full blur-3xl bottom-10 right-10 animate-float-2"></div>
      <div className="absolute w-64 h-64 bg-cyan-300/40 rounded-full blur-3xl top-1/2 right-1/4 animate-float-3"></div>
      <div className="absolute w-72 h-72 bg-blue-300/30 rounded-full blur-3xl bottom-1/4 left-1/3 animate-float-4"></div>

      {/* Sparkle Effects */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-sparkle"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-sparkle delay-700"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-sparkle delay-1400"></div>
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-sparkle delay-500"></div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-sparkle delay-1000"></div>
      <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-sparkle delay-300"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Main Spinner with Gradient Ring */}
        <div className="relative w-28 h-28 mb-8">
          {/* Outer static ring with subtle gradient */}
          <div className="absolute inset-0 border-[3px] border-indigo-200/60 rounded-full"></div>

          {/* Animated gradient ring */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 border-[3px] border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin-smooth"></div>
          </div>

          {/* Secondary counter-rotating ring */}
          <div className="absolute inset-2 rounded-full overflow-hidden">
            <div className="absolute inset-0 border-2 border-transparent border-b-cyan-400 border-l-blue-400 rounded-full animate-spin-reverse"></div>
          </div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-full animate-pulse-scale shadow-xl shadow-indigo-400/50"></div>
          </div>

          {/* Center icon - shield/lock for security */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-9 h-9 text-white animate-fade-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-indigo-400 animate-fade-pulse"></div>
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-purple-400 animate-fade-pulse delay-200"></div>
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cyan-400 animate-fade-pulse delay-400"></div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-blue-400 animate-fade-pulse delay-600"></div>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2 mb-6">
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-bounce-smooth"></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full animate-bounce-smooth delay-200"></div>
          <div className="w-2.5 h-2.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full animate-bounce-smooth delay-400"></div>
        </div>

        {/* Text */}
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-xl font-bold tracking-wide animate-fade-in">
          Checking access...
        </p>

        {/* Subtle progress indicator */}
        <div className="relative w-48 h-1 bg-indigo-100/50 rounded-full mt-6 overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 via-cyan-500 to-blue-500 rounded-full animate-progress-slide"></div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-30px, -30px) scale(1.1); opacity: 0.5; }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(25px, 30px) scale(1.15); opacity: 0.45; }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(-20px, -25px); opacity: 0.5; }
        }

        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(15px, -20px) scale(1.08); opacity: 0.4; }
        }

        @keyframes spin-smooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes bounce-smooth {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-12px); opacity: 0.7; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-float-1 { animation: float-1 15s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 17s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 13s ease-in-out infinite; }
        .animate-float-4 { animation: float-4 16s ease-in-out infinite; }
        .animate-spin-smooth { animation: spin-smooth 2.5s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
        .animate-pulse-scale { animation: pulse-scale 2s ease-in-out infinite; }
        .animate-bounce-smooth { animation: bounce-smooth 1.6s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-pulse { animation: fade-pulse 2.5s ease-in-out infinite; }
        .animate-progress-slide { animation: progress-slide 2s ease-in-out infinite; }

        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1400 { animation-delay: 1400ms; }
      `}</style>
    </div>
  );
}
