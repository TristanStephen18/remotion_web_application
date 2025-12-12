import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { templateCategories } from '../data/DashboardCardsData';
import Footer from '../components/Footer';

interface Avatar {
  id: number;
  icon: React.ReactNode;
  gradient: string;
  className: string;
  hasVerified?: boolean;
  badge?: string;
}

interface Feature {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Template {
  name: string;
  description: string;
  url: string;
}


const ViralMotionLanding: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Sample video URLs for the preview carousel
  const previewVideos = [
    'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/QuoteSpotlight_jn0iya.mp4',
    'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4',
    'https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441913/CardFlip_no4k2t.mp4',
    'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4',
  ];

  // Handle video end - advance to next video
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % previewVideos.length);
  };

  // Play video when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    }
  }, [currentVideoIndex]);

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up for free in seconds. No credit card required to get started.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Choose a Template',
      description: 'Browse our library of 50+ professionally designed video templates for any content style.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Customize Your Content',
      description: 'Add your text, images, and videos. Adjust colors, fonts, and animations to match your brand.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Export & Share',
      description: 'Render your video in high quality and share directly to TikTok, Instagram, or YouTube.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
      ),
    },
  ];

  const abouts = [
    {
      title: 'No Design Skills Required',
      description: 'Our templates are designed to be easy to use. Just add your content and you\'re ready to go.',
    },
    {
      title: 'AI-Powered Tools',
      description: 'Use AI to generate captions, voiceovers, and even suggest content ideas for your videos.',
    },
    {
      title: 'Cloud-Based Editor',
      description: 'Access your projects from anywhere. No software to install, everything works in your browser.',
    },
    {
      title: 'Fast Rendering',
      description: 'Export your videos quickly with our optimized cloud rendering infrastructure.',
    },
  ];

  const faqs = [
    {
      question: 'Is ViralMotion free to use?',
      answer: 'Yes! You can start creating videos for free. We offer a generous free tier with access to basic templates and features. Premium plans unlock additional templates, AI tools, and faster rendering.',
    },
    {
      question: 'What video formats can I export?',
      answer: 'ViralMotion exports videos in MP4 format, optimized for social media platforms. You can choose from various resolutions including 1080x1920 (9:16) for TikTok/Reels, 1080x1080 (1:1) for Instagram, and 1920x1080 (16:9) for YouTube.',
    },
    {
      question: 'Can I use my own images and videos?',
      answer: 'Absolutely! You can upload your own media files to use in your videos. We support most common image and video formats.',
    },
    {
      question: 'Do I need any video editing experience?',
      answer: 'Not at all! ViralMotion is designed for beginners and pros alike. Our templates are pre-built with professional animations - just add your content and export. No technical skills required.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period. No hidden fees or cancellation charges.',
    },
    {
      question: 'Can I use the videos for commercial purposes?',
      answer: 'Yes! All videos you create with ViralMotion are yours to use commercially. This includes using them for client work, marketing campaigns, and monetized social media accounts.',
    },
    {
      question: 'Is there a limit on how many videos I can create?',
      answer: 'Free users can create and export a limited number of videos per month. Premium plans offer unlimited video creation and exports, perfect for content creators and businesses with high-volume needs.',
    },
  ];

  // Dropdown items
  const featureItems = [
    // { name: 'Video Templates', path: '/templates' },
    // { name: 'AI Tools', path: '/ai-tools' },
    // { name: 'Video & Audio Downloader', path: '/downloader' },
    { name: 'Video Templates', path: '/login' },
    { name: 'AI Tools', path: '/login' },
    { name: 'Video & Audio Downloader', path: '/login' },
  ];

  const templateItems = [
    // { name: 'Fake Text Conversation', path: '/templates/fake-text-conversation' },
    // { name: 'Relatable Quotes + Viral Sound', path: '/templates/relatable-quotes' },
    // { name: 'Reaction Video', path: '/templates/reaction-video' },
    // { name: 'Image / Video Collage Edit', path: '/templates/collage-edit' },
    // { name: 'Ken Burns Carousel', path: '/templates/ken-burns-carousel' },
    { name: 'Fake Text Conversation', path: '/login' },
    { name: 'Relatable Quotes + Viral Sound', path: '/login' },
    { name: 'Reaction Video', path: '/login' },
    { name: 'Image / Video Collage Edit', path: '/login' },
    { name: 'Ken Burns Carousel', path: '/login' },
  ];

  const getFilteredTemplates = (): Template[] => {
    // Get 1 template from each category to show variety
    return [
      templateCategories.Text[0],
      templateCategories.Analytics[0],
      templateCategories.Layout[0],
      templateCategories.Voiceovers[0],
    ];
  };
   const avatars: Avatar[] = [
    {
      id: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
      className: 'top-[5%] right-[2%] w-16 h-16 animate-[float1_6s_ease-in-out_infinite,pulse_3s_ease-in-out_infinite]',
      hasVerified: true,
    },
    {
      id: 2,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      className: 'top-[-10%] right-[25%] w-[52px] h-[52px] animate-[float2_5s_ease-in-out_infinite_0.5s,pulse_3.5s_ease-in-out_infinite_0.5s]',
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
      className: 'bottom-[15%] right-[-8%] w-12 h-12 animate-[float3_7s_ease-in-out_infinite_1s,pulse_4s_ease-in-out_infinite_1s]',
      badge: '🔥',
    },
    {
      id: 4,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
      className: 'top-0 left-[-8%] w-[58px] h-[58px] animate-[float4_5.5s_ease-in-out_infinite_0.3s,pulse_3.2s_ease-in-out_infinite_0.3s]',
    },
    {
      id: 5,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      className: 'bottom-[20%] left-[-5%] w-[50px] h-[50px] animate-[float5_6.5s_ease-in-out_infinite_0.8s,pulse_3.8s_ease-in-out_infinite_0.8s]',
      badge: '✨',
    },
  ];

  const stats: Stat[] = [
    { value: '10K+', label: 'Active Users' },
    { value: '50+', label: 'Templates' },
    { value: '1M+', label: 'Videos Created' },
  ];

  const features: Feature[] = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <path d="M7 2v20" />
          <path d="M17 2v20" />
          <path d="M2 12h20" />
          <path d="M2 7h5" />
          <path d="M2 17h5" />
          <path d="M17 7h5" />
          <path d="M17 17h5" />
        </svg>
      ),
      iconBg: 'bg-gradient-to-br from-[#06b6d4] to-[#22d3ee]',
      title: 'Video Templates',
      description: 'Choose from 50+ professionally designed templates optimized for TikTok, Instagram Reels, and YouTube Shorts.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
          <path d="M16 10v1a4 4 0 0 1-8 0v-1" />
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      iconBg: 'bg-gradient-to-br from-[#a855f7] to-[#c084fc]',
      title: 'AI Tools',
      description: 'Powerful AI-powered tools for auto-captions, voiceovers, background removal, and smart video editing.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
      iconBg: 'bg-gradient-to-br from-[#ec4899] to-[#f472b6]',
      title: 'Video & Audio Downloader',
      description: 'Download videos and audio from popular platforms. Save content for offline use or repurpose for your projects.',
    },
  ];



  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Navigation */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-[20px] border-b border-[#f3f4f6]">
        <div className="max-w-[1200px] mx-auto py-3.5 px-4 md:px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline font-bold text-xl text-violet-500">
            <span className="logo__dot"></span>
            <span className="logo__text">ViralMotion</span>
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
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
            <button className="flex items-center gap-1.5 text-gray-700 text-sm font-medium bg-transparent border-none cursor-pointer py-2 transition-colors hover:text-violet-500 group">
                Features
                  <svg className="transition-transform group-hover:rotate-180" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                  </svg>
                  </button>
                    {featuresDropdownOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 min-w-[200px] z-[1000] animate-[dropdownFadeIn_0.2s_ease-out]">
                        {featureItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block w-full py-2 px-3 text-gray-500 no-underline text-xs font-medium rounded-lg transition-all hover:bg-gray-100 hover:text-gray-900"
                            >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                        )}
                      </div>

                      {/* Templates Dropdown */}
                      <div
                        className="relative"
                        onMouseEnter={() => setTemplatesDropdownOpen(true)}
                        onMouseLeave={() => setTemplatesDropdownOpen(false)}
                      >
                        <button className="flex items-center gap-1.5 text-gray-700 text-sm font-medium bg-transparent border-none cursor-pointer py-2 transition-colors hover:text-violet-500 group">
                          Templates
                          <svg className="transition-transform group-hover:rotate-180" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        {templatesDropdownOpen && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] p-2 min-w-[200px] z-[1000] animate-[dropdownFadeIn_0.2s_ease-out]">
                            {templateItems.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="block w-full py-2 px-3 text-gray-500 no-underline text-xs font-medium rounded-lg transition-all hover:bg-gray-100 hover:text-gray-900"
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link to="/pricing" className="text-gray-700 no-underline text-sm font-medium transition-colors hover:text-violet-500">Pricing</Link>
                    </div>
          <Link to="/login" className="hidden md:inline-block bg-[#111827] text-white py-2.5 px-5 rounded-lg font-medium text-sm no-underline transition-all duration-200 hover:bg-[#8b5cf6] hover:-translate-y-px">Login</Link>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
          <div className="px-4 py-4 bg-white border-t border-[#f3f4f6] flex flex-col gap-2">
            <div className="py-2">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Features</p>
              {featureItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="py-2 border-t border-[#f3f4f6]">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-2">Templates</p>
              {templateItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-[#f3f4f6]">
              <Link to="/pricing" className="block py-2 px-3 text-gray-600 no-underline text-sm font-medium rounded-lg transition-all hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/login" className="block mt-2 bg-[#111827] text-white py-3 px-4 rounded-lg font-medium text-sm no-underline text-center transition-all duration-200 hover:bg-[#8b5cf6]" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4 md:px-8 pb-16 md:pb-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="max-w-[520px] mx-auto lg:mx-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(236,72,153,0.1)] py-2 px-4 rounded-[100px] text-[0.75rem] md:text-[0.8rem] text-[#8b5cf6] font-semibold mb-6 border border-[rgba(139,92,246,0.15)] animate-[fadeInDown_0.6s_ease-out] tracking-wide">
              <span>AI-Powered Video Creation</span>
            </div>
            <h1 className="text-[2rem] md:text-[2.8rem] lg:text-[3.4rem] font-bold leading-[1.15] mb-5 text-[#111827] animate-[fadeInUp_0.8s_ease-out_0.2s_both] tracking-tight">
              Create <span className="bg-gradient-to-r from-[#8b5cf6] via-[#ec4899] to-[#f97316] bg-clip-text text-transparent">Viral Videos </span>in Seconds
            </h1>
            <p className="text-[#6b7280] text-base md:text-[1.08rem] leading-[1.7] mb-8 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
              Transform your ideas into stunning short-form videos with our AI-powered
              templates. Perfect for TikTok, Instagram Reels, and YouTube Shorts.
            </p>
            <div className="flex gap-3 mb-10 animate-[fadeInUp_0.8s_ease-out_0.6s_both] justify-center lg:justify-start">
              <a href="/signup" className="bg-[#111827] text-white py-3 md:py-3.5 px-5 md:px-6 rounded-[10px] font-medium text-[0.85rem] md:text-[0.9rem] no-underline inline-flex items-center gap-2 transition-all duration-200 border-none cursor-pointer hover:bg-[#8b5cf6] hover:-translate-y-px">
                Start Creating Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="flex gap-6 md:gap-10 animate-[fadeInUp_0.8s_ease-out_0.8s_both] justify-center lg:justify-start">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="text-xl md:text-2xl font-bold text-[#111827]">{stat.value}</span>
                  <span className="text-[0.75rem] md:text-[0.8rem] text-[#9ca3af] font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Container with Floating Avatars */}
          <div className="relative animate-[fadeInUp_0.8s_ease-out_0.4s_both] p-1 hidden lg:block">
            <div className="relative p-10 overflow-visible min-w-[550px]">
              {/* Floating Avatars */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`absolute rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.15)] border-[3px] border-white overflow-visible ${avatar.className}`}
                    style={{ background: avatar.gradient }}
                  >
                    {avatar.icon}
                    {avatar.hasVerified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#1d9bf0] rounded-full flex items-center justify-center border-2 border-white z-10 animate-[scaleIn_0.3s_ease-out_1s_both]">
                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-white">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                    )}
                    {avatar.badge && <div className="absolute -bottom-1 -right-1 text-base z-10 animate-[bounce_2s_ease-in-out_infinite]">{avatar.badge}</div>}
                  </div>
                ))}
              </div>

              {/* Sparkle decoration */}
              <div className="absolute top-0 right-[10%] text-2xl text-[#f59e0b] animate-[sparkle_2s_ease-in-out_infinite] z-20">✦</div>

              {/* Video Preview Card */}
              <div className="bg-white rounded-2xl p-2 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_20px_50px_-12px_rgba(0,0,0,0.12)] relative z-[5] border border-[#f3f4f6]">
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] min-h-[280px]">
                  <video
                    ref={videoRef}
                    src={previewVideos[currentVideoIndex]}
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    className="block rounded-xl w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-center gap-2 pt-4 pb-2">
                  {previewVideos.map((_, index) => (
                    <span
                      key={index}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentVideoIndex ? 'w-6 bg-[#111827]' : 'w-2 bg-[#d1d5db] hover:bg-[#9ca3af]'}`}
                      onClick={() => setCurrentVideoIndex(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-[1200px] mx-auto" id="features">
        <div className="text-center">
          <div className="inline-block text-[#8b5cf6] text-[0.75rem] md:text-[0.8rem] font-semibold mb-3 uppercase tracking-widest">Features</div>
          <h2 className="text-[1.5rem] md:text-[2rem] font-bold mb-2 text-[#111827] tracking-tight">Everything You Need to Go Viral</h2>
          <p className="text-[#6b7280] text-sm md:text-base mb-8 md:mb-12">Powerful tools designed for creators</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1000px] mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-5 md:p-7 text-left border border-[#f3f4f6] transition-all duration-200 hover:border-[#e5e7eb] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
              >
                <div className={`w-10 md:w-11 h-10 md:h-11 rounded-[10px] flex items-center justify-center mb-4 text-white ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-sm md:text-base font-semibold mb-2 text-[#111827]">{feature.title}</h3>
                <p className="text-xs md:text-sm text-[#6b7280] leading-[1.6]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 max-w-[1200px] mx-auto" id="templates">
        <div className="text-center">
          <div className="inline-block text-[#8b5cf6] text-[0.75rem] md:text-[0.8rem] font-semibold mb-3 uppercase tracking-widest">Templates</div>
          <h2 className="text-[1.5rem] md:text-[2rem] font-bold mb-2 text-[#111827] tracking-tight">Ready-to-Use Video Templates</h2>
          <p className="text-[#6b7280] text-sm md:text-base mb-8 md:mb-12">Choose from our collection of professionally designed templates</p>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {getFilteredTemplates().map((template) => (
              <div key={template.name} className="bg-white rounded-xl overflow-hidden border border-[#f3f4f6] transition-all duration-200 text-left hover:border-[#e5e7eb] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] group">
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#581c87]">
                  <img
                    src={template.url}
                    alt={template.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <a href="/login" className="bg-white text-[#111827] py-2 md:py-2.5 px-4 md:px-5 rounded-lg font-medium text-[0.75rem] md:text-[0.8rem] no-underline transition-all duration-200 hover:bg-[#111827] hover:text-white">Try Template</a>
                  </div>
                </div>
                <div className="p-3 md:p-3.5 px-3 md:px-4">
                  <h3 className="text-xs md:text-sm font-semibold text-[#111827] mb-1">{template.name}</h3>
                  <p className="text-[0.65rem] md:text-xs text-[#9ca3af] leading-[1.5] line-clamp-2">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-block text-[#8b5cf6] text-[0.75rem] md:text-[0.8rem] font-semibold mb-3 uppercase tracking-widest">Steps</div>
          <h2 className="text-[1.5rem] md:text-[2rem] font-bold mb-2 text-[#111827] tracking-tight">How It Works</h2>
          <p className="text-[#6b7280] text-sm md:text-base mb-8 md:mb-12">Get from idea to viral video in 4 simple steps</p>

          <div className="max-w-[700px] mx-auto text-left">
            {steps.map((step, index) => (
              <div key={step.number} className="flex gap-3 md:gap-6 relative group">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center text-white font-bold text-xs md:text-sm shrink-0 shadow-[0_4px_15px_rgba(139,92,246,0.3)]">{step.number}</div>
                  {index < steps.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-[#8b5cf6] to-[rgba(139,92,246,0.2)] my-2 min-h-[30px] md:min-h-[40px]"></div>}
                </div>
                <div className={`flex gap-3 md:gap-4 ${index < steps.length - 1 ? 'pb-6 md:pb-10' : 'pb-0'} flex-1`}>
                  <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-[#fafbfc] border border-[#f3f4f6] flex items-center justify-center text-[#8b5cf6] shrink-0 transition-all duration-200 hover:bg-gradient-to-br hover:from-[rgba(139,92,246,0.15)] hover:to-[rgba(236,72,153,0.15)] hover:border-[rgba(139,92,246,0.4)] cursor-pointer">{step.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-base md:text-[1.1rem] font-semibold mb-1 md:mb-1.5 text-[#111827]">{step.title}</h3>
                    <p className="text-xs md:text-[0.9rem] text-[#6b7280] leading-[1.6]">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-[#fafbfc]">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="inline-block text-[#8b5cf6] text-[0.75rem] md:text-[0.8rem] font-semibold mb-3 uppercase tracking-widest">About</div>
          <h2 className="text-[1.5rem] md:text-[2rem] font-bold mb-2 text-[#111827] tracking-tight">Why Choose ViralMotion?</h2>
          <p className="text-[#6b7280] text-sm md:text-base mb-8 md:mb-12">Everything you need to create content that stands out</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {abouts.map((about) => (
              <div key={about.title} className="bg-white rounded-xl p-5 md:p-7 text-left border border-[#f3f4f6] transition-all duration-200 hover:border-[#e5e7eb] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
                <h3 className="text-sm md:text-base font-semibold mb-2 text-[#111827]">{about.title}</h3>
                <p className="text-xs md:text-sm text-[#6b7280] leading-[1.6]">{about.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-white">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="inline-block text-[#8b5cf6] text-[0.75rem] md:text-[0.8rem] font-semibold mb-3 uppercase tracking-widest">FAQ</div>
          <h2 className="text-[1.5rem] md:text-[2rem] font-bold mb-2 text-[#111827] tracking-tight">Frequently Asked Questions</h2>
          <p className="text-[#6b7280] text-sm md:text-base mb-8 md:mb-12">Got questions? We've got answers</p>

          <div className="text-left">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`border border-[#f3f4f6] rounded-xl mb-3 overflow-hidden transition-all duration-200 hover:border-[#e5e7eb] ${openFaqIndex === index ? 'border-[rgba(139,92,246,0.3)] shadow-[0_4px_15px_rgba(139,92,246,0.08)]' : ''}`}
              >
                <button
                  className="w-full flex items-center justify-between gap-3 md:gap-4 py-4 md:py-5 px-4 md:px-6 bg-transparent border-none cursor-pointer text-left text-sm md:text-base font-semibold text-[#111827] transition-all duration-200 hover:text-[#8b5cf6]"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 text-[#6b7280] transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180 text-[#8b5cf6]' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-[300px]' : 'max-h-0'}`}>
                  <p className="px-4 md:px-6 pb-4 md:pb-5 text-xs md:text-[0.9rem] text-[#6b7280] leading-[1.7]">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-16 px-4 md:px-8 pb-16 md:pb-20 max-w-[1200px] mx-auto">
        <div className="bg-[#111827] rounded-2xl py-10 md:py-14 px-4 md:px-8 text-center">
          <h2 className="text-[1.25rem] md:text-[1.75rem] font-bold mb-3 text-white tracking-tight">
            Ready to Create <span className="bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#fb923c] bg-clip-text text-transparent">Viral Content</span>?
          </h2>
          <p className="text-white/70 text-sm md:text-base mb-6 md:mb-7 max-w-[450px] mx-auto px-2">
            Join thousands of creators who are already using ViralMotion to grow their audience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup" className="bg-white text-[#111827] py-3 md:py-3.5 px-5 md:px-6 rounded-[10px] font-medium text-[0.85rem] md:text-[0.9rem] no-underline inline-flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#8b5cf6] hover:text-white">Start Free Trial</Link>
            <Link to="/pricing" className="bg-transparent text-white py-3 md:py-3.5 px-5 md:px-6 rounded-[10px] font-medium text-[0.85rem] md:text-[0.9rem] no-underline inline-flex items-center justify-center gap-2 transition-all duration-200 border border-white/20 hover:bg-white/10 hover:border-white/30">View Pricing</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ViralMotionLanding;
