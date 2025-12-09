import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const PricingPage: React.FC = () => {
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const featureItems = [
    { name: 'Video Templates', path: '/login' },
    { name: 'AI Tools', path: '/login' },
    { name: 'Video & Audio Downloader', path: '/login' },
  ];

  const templateItems = [
    { name: 'Fake Text Conversation', path: '/login' },
    { name: 'Relatable Quotes + Viral Sound', path: '/login' },
    { name: 'Reaction Video', path: '/login' },
    { name: 'Image / Video Collage Edit', path: '/login' },
    { name: 'Ken Burns Carousel', path: '/login' },
  ];

  const plan = {
    name: 'Pro',
    price: 19.99,
    description: 'Everything you need to create viral videos',
    workflows: "Unlimited",
    exportCredits: "Unlimited",
    voiceoverCredits: "Unlimited",
    aiImages: "Unlimited",
    features: [
      'All video templates',
      '1080p HD export',
      'No watermark',
      'Priority support',
      'Batch rendering',
      'Custom branding',
      'AI Auto-Captions',
      'Video & Audio Downloader',
    ],
    cta: 'Get Started',
  };

  const stats = [
    { value: '10K+', label: 'Videos Created' },
    { value: '5K+', label: 'Happy Creators' },
    { value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen bg-white font-[Inter,-apple-system,BlinkMacSystemFont,sans-serif] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-[20px] border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-[1200px] mx-auto py-4 px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline font-bold text-xl text-violet-500">
            <span className="w-[28px] h-[28px] rounded-full bg-[conic-gradient(from_120deg,#8b5cf6,#ec4899,#06b6d4)] shadow-[0_4px_20px_rgba(139,92,246,0.5)]"></span>
            <span className="font-bold tracking-[0.2px]">ViralMotion</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-gray-600 text-sm font-medium bg-transparent border-none cursor-pointer py-2 transition-colors hover:text-gray-900 group">
                Features
                <svg className="transition-transform group-hover:rotate-180" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {featuresDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-2 min-w-[200px] z-[1000] border border-gray-100">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block w-full py-2.5 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setTemplatesDropdownOpen(true)}
              onMouseLeave={() => setTemplatesDropdownOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-gray-600 text-sm font-medium bg-transparent border-none cursor-pointer py-2 transition-colors hover:text-gray-900 group">
                Templates
                <svg className="transition-transform group-hover:rotate-180" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {templatesDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-2 min-w-[220px] z-[1000] border border-gray-100">
                  {templateItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block w-full py-2.5 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-50 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/pricing" className="text-gray-900 no-underline text-sm font-medium">Pricing</Link>
          </div>
          <Link to="/login" className="hidden md:inline-block bg-gray-900 text-white py-2.5 px-6 rounded-full font-semibold text-sm no-underline transition-all hover:bg-purple-600 hover:scale-105">Login</Link>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="px-4 py-4 bg-white border-t border-gray-100 flex flex-col gap-2">
            <div className="py-2">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Features</p>
              {featureItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Templates</p>
              {templateItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-100">
              <Link to="/pricing" className="block py-2 px-3 text-gray-900 no-underline text-sm font-medium rounded-lg" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/login" className="block mt-2 bg-gray-900 text-white py-3 px-4 rounded-full font-semibold text-sm no-underline text-center" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 px-4 md:px-8 pb-12 md:pb-20 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-purple-700 font-medium">Simple, transparent pricing</span>
          </div>
          <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
            One plan.<br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">Unlimited potential.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8 leading-relaxed max-w-[600px] mx-auto">
            Everything you need to create viral videos. No hidden fees, no complicated tiers.
          </p>
        </div>
      </section>

      {/* Pricing Card Section */}
      <section className="relative px-4 md:px-8 pb-20 md:pb-32">
        <div className="max-w-[480px] mx-auto relative z-10">
          {/* Main Card */}
          <div className="relative bg-white rounded-3xl p-1 shadow-[0_0_60px_rgba(139,92,246,0.12)] border border-purple-100">
            <div className="bg-white rounded-[22px] p-8 md:p-10">
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Pro
                </span>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1 mb-3">
                  <span className="text-2xl font-bold text-gray-400">$</span>
                  <span className="text-7xl md:text-8xl font-extrabold text-gray-900 tracking-tight">{plan.price}</span>
                  <span className="text-xl font-medium text-gray-400">/mo</span>
                </div>
                <p className="text-gray-500 text-base">{plan.description}</p>
              </div>

              {/* CTA Button */}
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl font-bold text-base no-underline transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] text-white shadow-[0_4px_20px_rgba(168,85,247,0.35)] hover:bg-[position:100%_0] hover:shadow-[0_6px_30px_rgba(168,85,247,0.45)] hover:scale-[1.02]"
              >
                {plan.cta}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">What's included</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              </div>

              {/* Credits Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <div className="flex justify-center mb-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Workflows/mo</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <div className="flex justify-center mb-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Exports</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <div className="flex justify-center mb-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Voiceovers</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                  <div className="flex justify-center mb-1">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <defs>
                        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">AI Images</div>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 md:px-8 pb-20 md:pb-32">
        <div className="max-w-[800px] mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 md:px-8 pb-20 md:pb-32 bg-gray-50">
        <div className="max-w-[600px] mx-auto pt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Yes, you can cancel your subscription at any time. No questions asked, no hidden fees.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-2">What payment methods do you accept?</h3>
              {/* <p className="text-gray-500 text-sm leading-relaxed">We accept all major credit cards, PayPal, and other popular payment methods.</p> */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-slate-500">We accept:</span>
                <div className="flex gap-2">
                  <div className="w-12 h-8 rounded bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center shadow-sm">
                    <div className="flex items-center -space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-600 opacity-80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                    </div>
                  </div>
                  <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-[8px] font-bold italic shadow-sm">
                    VISA
                  </div>
                  <div className="w-12 h-8 rounded bg-blue-500 flex items-center justify-center text-white text-[7px] font-bold shadow-sm">
                    AMEX
                  </div>
                  <div className="w-12 h-8 rounded bg-orange-500 flex items-center justify-center text-white text-[7px] font-bold shadow-sm">
                    DISCOVER
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-semibold mb-2">Do unused credits roll over?</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Credits reset each month, so make sure to use them before your billing cycle ends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-8 py-20 md:py-32">
        <div className="max-w-[700px] mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-10 md:p-14">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Ready to go viral?</h2>
            <p className="text-white/80 mb-8 max-w-[400px] mx-auto">Join thousands of creators making engaging content with ViralMotion.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-gray-900 py-4 px-8 rounded-full font-bold text-base no-underline transition-all hover:bg-gray-100 hover:scale-105 shadow-lg"
            >
              Start Creating Now
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
