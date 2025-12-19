import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// Custom hook for scroll-triggered animations
const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const PricingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll animation refs
  const heroAnim = useScrollAnimation(0.2);
  const unlimitedAnim = useScrollAnimation(0.2);
  const featuresAnim = useScrollAnimation(0.2);
  const statsAnim = useScrollAnimation(0.3);
  const faqAnim = useScrollAnimation(0.2);

  const features = [
    "All video templates",
    "1080p HD export",
    "No watermark",
    "Priority support",
    "Batch rendering",
    "Custom branding",
    "AI Auto-Captions",
    "Video & Audio Downloader",
  ];

  const unlimitedItems = [
    { name: "Projects", icon: "folder" },
    { name: "Exports", icon: "download" },
    { name: "Voiceovers", icon: "mic" },
    { name: "AI Images", icon: "image" },
  ];

  const stats = [
    { value: "10K+", label: "Videos Created" },
    { value: "5K+", label: "Happy Creators" },
    { value: "99.9%", label: "Uptime" },
  ];

  const faqs = [
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. No questions asked, no hidden fees.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "payment_methods",
    },
    {
      question: "Do unused credits roll over?",
      answer:
        "Credits reset each month, so make sure to use them before your billing cycle ends.",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out forwards;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
        .stagger-6 { animation-delay: 0.6s; }
        .stagger-7 { animation-delay: 0.7s; }
        .stagger-8 { animation-delay: 0.8s; }
        
        .opacity-0-initial {
          opacity: 0;
        }
      `}</style>

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-[20px] border-b border-[#f3f4f6]">
        <div className="max-w-[1200px] mx-auto py-3.5 px-4 md:px-8 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 no-underline font-bold text-xl text-violet-500"
          >
            <span className="logo__dot"></span>
            <span className="logo__text">ViralMotion</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 no-underline text-sm font-medium transition-colors hover:text-violet-500"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-700 no-underline text-sm font-medium transition-colors hover:text-violet-500"
            >
              Pricing
            </Link>
            <Link
              to="/"
              className="text-gray-700 no-underline text-sm font-medium transition-colors hover:text-violet-500"
            >
              About Us
            </Link>
            <Link
              to="/"
              className="text-gray-700 no-underline text-sm font-medium transition-colors hover:text-violet-500"
            >
              Help
            </Link>
            <Link
              to="/"
              className="text-gray-700 no-underline text-sm font-medium transition-colors hover:text-violet-500"
            >
              Blog
            </Link>
          </div>
          <Link
            to="/login"
            className="hidden md:inline-block bg-[#111827] text-white py-2.5 px-5 rounded-lg font-medium text-sm no-underline transition-all duration-200 hover:bg-[#8b5cf6] hover:-translate-y-px"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 bg-white border-t border-[#f3f4f6] flex flex-col gap-2">
            <Link
              to="/login"
              className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/login"
              className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Help
            </Link>
            <Link
              to="/login"
              className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <div className="pt-2 border-t border-[#f3f4f6]">
              <Link
                to="/login"
                className="block mt-2 bg-[#111827] text-white py-3 px-4 rounded-lg font-medium text-sm no-underline text-center transition-all duration-200 hover:bg-[#8b5cf6]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Pricing Section */}
      <section className="pt-20 md:pt-24 px-4 md:px-8 pb-6">
        <div
          ref={heroAnim.ref}
          className={`max-w-[1150px] mx-auto transition-all duration-700 ${
            heroAnim.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Main Pricing Card */}
          <div className="bg-purple-200 rounded-[32px] p-6 md:p-8 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300/50 via-transparent to-pink-200/40 pointer-events-none"></div>

            <div className="relative z-10 text-center">
              {/* Title */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-1 leading-tight transition-all duration-500 ${
                  heroAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "0.1s" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  One Plan
                </span>
              </h1>
              <h2
                className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 leading-tight transition-all duration-500 ${
                  heroAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "0.2s" }}
              >
                Unlimited potential
              </h2>

              {/* Subtitle */}
              <p
                className={`text-gray-700 font-medium text-sm md:text-base mb-4 transition-all duration-500 ${
                  heroAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "0.3s" }}
              >
                No hidden fees, no complicated tires
              </p>

              {/* Price */}
              <div
                className={`mb-4 transition-all duration-500 ${
                  heroAnim.isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                }`}
                style={{ transitionDelay: "0.4s" }}
              >
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xl font-bold text-gray-400">$</span>
                  <span className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
                    19.99
                  </span>
                  <span className="text-lg font-medium text-gray-400">/mo</span>
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-gray-500 text-sm mb-6 transition-all duration-500 ${
                  heroAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "0.5s" }}
              >
                Everything you need to create viral videos
              </p>

              {/* CTA Button */}
              <Link
                to="/signup"
                className={`inline-flex items-center justify-center gap-2 py-3 px-8 rounded-full font-bold text-base no-underline transition-all duration-500 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] text-white shadow-[0_4px_25px_rgba(168,85,247,0.4)] hover:bg-[position:100%_0] hover:shadow-[0_8px_35px_rgba(168,85,247,0.5)] hover:scale-105 ${
                  heroAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: "0.6s" }}
                onClick={() => window.scrollTo(0, 0)}
              >
                Get Started
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Indicator */}
      <section className="px-4 md:px-8 pb-40">
        <div
          className={`flex flex-col items-center gap-2 transition-all duration-500 ${
            heroAnim.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "0.8s" }}
        >
          <svg
            className="animate-bounce text-gray-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <span className="text-gray-600 font-medium">What's Included?</span>
        </div>
      </section>

      {/* Unlimited Access Section */}
      <section className="px-4 md:px-8 pb-20">
        <div
          ref={unlimitedAnim.ref}
          className={`max-w-[700px] mx-auto text-center transition-all duration-700 ${
            unlimitedAnim.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Title with infinity icon */}
          <div
            className={`flex items-center justify-center gap-3 mb-10 transition-all duration-500 ${
              unlimitedAnim.isVisible
                ? "opacity-100 scale-100"
                : "opacity-0 scale-90"
            }`}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient
                  id="infinityGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#9333ea" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path
                stroke="url(#infinityGradient)"
                d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"
              />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Unlimited Access
            </h2>
          </div>

          {/* Circular badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {unlimitedItems.map((item, idx) => (
              <div
                key={item.name}
                className={`transition-all duration-500 ${
                  unlimitedAnim.isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                style={{ transitionDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300 cursor-default">
                  <span className="text-white font-bold text-sm md:text-base text-center px-2">
                    {item.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Included Features Section */}
      <section className="px-4 md:px-8 pb-35">
        <div
          ref={featuresAnim.ref}
          className={`max-w-[1150px] mx-auto transition-all duration-700 ${
            featuresAnim.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-purple-200 rounded-[32px] p-8 md:p-10 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300/50 via-transparent to-pink-200/40 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <h3
                className={`text-xl md:text-2xl font-bold text-gray-900 text-center mb-8 transition-all duration-500 ${
                  featuresAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
              >
                All Included Features
              </h3>

              <ul className="space-y-4 inline-block">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      featuresAnim.isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-5"
                    }`}
                    style={{ transitionDelay: `${0.1 + idx * 0.08}s` }}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm md:text-base">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 pb-42">
        <div ref={statsAnim.ref} className="max-w-[800px] mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`text-center transition-all duration-700 ${
                  statsAnim.isVisible
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-75"
                }`}
                style={{ transitionDelay: `${idx * 0.15}s` }}
              >
                <div className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 md:px-8 pb-40">
        <div ref={faqAnim.ref} className="max-w-[600px] mx-auto">
          <h2
            className={`text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12 transition-all duration-500 ${
              faqAnim.isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-5"
            }`}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-22">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`transition-all duration-500 ${
                  faqAnim.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: `${0.1 + idx * 0.1}s` }}
              >
                <h3 className="text-gray-900 font-semibold mb-2">
                  {faq.question}
                </h3>
                {faq.answer === "payment_methods" ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">We accept:</span>
                    <div className="flex gap-2">
                      <div className="w-11 h-7 rounded bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center shadow-sm">
                        <div className="flex items-center -space-x-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-600 opacity-80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80"></div>
                        </div>
                      </div>
                      <div className="w-11 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-[7px] font-bold italic shadow-sm">
                        VISA
                      </div>
                      <div className="w-11 h-7 rounded bg-blue-500 flex items-center justify-center text-white text-[6px] font-bold shadow-sm">
                        AMEX
                      </div>
                      <div className="w-11 h-7 rounded bg-orange-500 flex items-center justify-center text-white text-[5px] font-bold shadow-sm">
                        DISCOVER
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 pb-4">
        <div className="max-w-[700px] mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-[32px] p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Ready to go viral?
            </h2>
            <p className="text-white/80 mb-8 max-w-[400px] mx-auto">
              Join thousands of creators making engaging content with
              ViralMotion.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 py-4 px-8 rounded-full font-bold text-base no-underline transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-lg"
              onClick={() => window.scrollTo(0, 0)}
            >
              Start Creating Now
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
