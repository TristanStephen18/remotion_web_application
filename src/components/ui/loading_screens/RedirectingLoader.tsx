export default function RedirectingLoader() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Blobs */}
      <div className="absolute w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl top-20 left-20 animate-float-1"></div>
      <div className="absolute w-80 h-80 bg-purple-200/25 rounded-full blur-3xl bottom-20 right-20 animate-float-2"></div>
      <div className="absolute w-48 h-48 bg-blue-200/30 rounded-full blur-3xl top-1/2 right-1/4 animate-float-3"></div>

      {/* Sparkle Effects */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-sparkle"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-sparkle delay-700"></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-sparkle delay-1400"></div>
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-sparkle delay-500"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Main Spinner with Gradient Ring */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer static ring */}
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>

          {/* Animated gradient ring */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-spin-smooth"></div>
          </div>

          {/* Inner pulsing circle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full animate-pulse-scale shadow-lg shadow-indigo-300/50"></div>
          </div>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white animate-fade-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2 mb-6">
          <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce-smooth"></div>
          <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce-smooth delay-200"></div>
          <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce-smooth delay-400"></div>
        </div>

        {/* Text */}
        <p className="text-gray-700 text-lg font-semibold tracking-wide animate-fade-in">
          Redirecting...
        </p>

        {/* Subtle progress indicator */}
        <div className="relative w-40 h-1 bg-gray-100 rounded-full mt-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full animate-progress-slide"></div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(-20px, -25px) scale(1.1); opacity: 0.4; }
        }

        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate(20px, 25px) scale(1.15); opacity: 0.35; }
        }

        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.3; }
          50% { transform: translate(-15px, -20px); opacity: 0.4; }
        }

        @keyframes spin-smooth {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes bounce-smooth {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-10px); opacity: 0.7; }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-float-1 { animation: float-1 14s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 16s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
        .animate-spin-smooth { animation: spin-smooth 2s linear infinite; }
        .animate-pulse-scale { animation: pulse-scale 2s ease-in-out infinite; }
        .animate-bounce-smooth { animation: bounce-smooth 1.6s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-fade-pulse { animation: fade-pulse 2s ease-in-out infinite; }
        .animate-progress-slide { animation: progress-slide 2s ease-in-out infinite; }

        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1400 { animation-delay: 1400ms; }
      `}</style>
    </div>
  );
}
