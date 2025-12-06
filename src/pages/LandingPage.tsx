import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/LandingPage.css';
import '../assets/Logo.css';
import { templateCategories } from '../data/DashboardCardsData';

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
    { name: 'Video Templates', path: '/templates' },
    { name: 'AI Tools', path: '/ai-tools' },
    { name: 'Video & Audio Downloader', path: '/downloader' },
  ];

  const templateItems = [
    { name: 'Fake Text Conversation', path: '/templates/fake-text-conversation' },
    { name: 'Relatable Quotes + Viral Sound', path: '/templates/relatable-quotes' },
    { name: 'Reaction Video', path: '/templates/reaction-video' },
    { name: 'Image / Video Collage Edit', path: '/templates/collage-edit' },
    { name: 'Ken Burns Carousel', path: '/templates/ken-burns-carousel' },
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
      className: 'landing-avatar-1',
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
      className: 'landing-avatar-2',
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
      className: 'landing-avatar-3',
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
      className: 'landing-avatar-4',
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
      className: 'landing-avatar-5',
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
      iconBg: 'landing-bg-cyan',
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
      iconBg: 'landing-bg-purple',
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
      iconBg: 'landing-bg-pink',
      title: 'Video & Audio Downloader',
      description: 'Download videos and audio from popular platforms. Save content for offline use or repurpose for your projects.',
    },
  ];

  

  return (
    <div className="landing-viral-motion">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <Link to="/" className="landing-logo">
            <span className="logo__dot"></span>
            <span className="logo__text">ViralMotion</span>
          </Link>
          <div className="landing-nav-links">
            {/* Features Dropdown */}
            <div
              className="landing-nav-dropdown"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button className="landing-nav-dropdown-trigger">
                Features
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {featuresDropdownOpen && (
                <div className="landing-nav-dropdown-menu">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="landing-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div
              className="landing-nav-dropdown"
              onMouseEnter={() => setTemplatesDropdownOpen(true)}
              onMouseLeave={() => setTemplatesDropdownOpen(false)}
            >
              <button className="landing-nav-dropdown-trigger">
                Templates
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {templatesDropdownOpen && (
                <div className="landing-nav-dropdown-menu">
                  {templateItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="landing-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/pricing">Pricing</Link>
          </div>
          <Link to="/login" className="landing-btn-get-started">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-container">
          <div className="landing-hero-content">
            <div className="landing-hero-badge">
              <span>AI-Powered Video Creation</span>
            </div>
            <h1>
              Create <span className="landing-text-gradient">Viral Videos </span>in Seconds
            </h1>
            <p>
              Transform your ideas into stunning short-form videos with our AI-powered
              templates. Perfect for TikTok, Instagram Reels, and YouTube Shorts.
            </p>
            <div className="landing-hero-buttons">
              <a href="/get-started" className="landing-btn-primary">
                Start Creating Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="landing-hero-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="landing-stat">
                  <span className="landing-stat-value">{stat.value}</span>
                  <span className="landing-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video Container with Floating Avatars */}
          <div className="landing-hero-visual">
            <div className="landing-video-container">
              {/* Floating Avatars */}
              <div className="landing-avatars-wrapper">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`landing-avatar ${avatar.className}`}
                    style={{ background: avatar.gradient }}
                  >
                    {avatar.icon}
                    {avatar.hasVerified && (
                      <div className="landing-verified-badge">
                        <svg viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                      </div>
                    )}
                    {avatar.badge && <div className="landing-avatar-badge">{avatar.badge}</div>}
                  </div>
                ))}
              </div>

              {/* Sparkle decoration */}
              <div className="landing-sparkle-icon">✦</div>

              {/* Video Preview Card */}
              <div className="landing-video-card">
                <div className="landing-video-preview">
                  <video
                    ref={videoRef}
                    src={previewVideos[currentVideoIndex]}
                    autoPlay
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    className="landing-preview-video"
                  />
                </div>
                <div className="landing-video-dots">
                  {previewVideos.map((_, index) => (
                    <span
                      key={index}
                      className={`landing-dot ${index === currentVideoIndex ? 'active' : ''}`}
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
      <section className="landing-features" id="features">
        <div className="landing-features-container">
          <div className="landing-features-badge">Features</div>
          <h2>Everything You Need to Go Viral</h2>
          <p className="landing-features-subtitle">Powerful tools designed for creators</p>

          <div className="landing-features-grid">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="landing-feature-card"
              >
                <div className={`landing-feature-icon ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="landing-templates" id="templates">
        <div className="landing-templates-container">
          <div className="landing-features-badge">Templates</div>
          <h2>Ready-to-Use Video Templates</h2>
          <p className="landing-features-subtitle">Choose from our collection of professionally designed templates</p>

          {/* Templates Grid */}
          <div className="landing-templates-grid">
            {getFilteredTemplates().map((template) => (
              <div key={template.name} className="landing-template-card">
                <div className="landing-template-preview">
                  <img
                    src={template.url}
                    alt={template.name}
                    loading="lazy"
                  />
                  <div className="landing-template-overlay">
                    <a href="/login" className="landing-btn-try">Try Template</a>
                  </div>
                </div>
                <div className="landing-template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="landing-steps">
        <div className="landing-steps-container">
        <div className="landing-features-badge">Steps</div>
          <h2>How It Works</h2>
          <p className="landing-subtitle">Get from idea to viral video in 4 simple steps</p>

          <div className="landing-steps-timeline">
            {steps.map((step, index) => (
              <div key={step.number} className="landing-step-item">
                <div className="landing-step-left">
                  <div className="landing-step-number-circle">{step.number}</div>
                  {index < steps.length - 1 && <div className="landing-step-line"></div>}
                </div>
                <div className="landing-step-content">
                  <div className="landing-step-icon">{step.icon}</div>
                  <div className="landing-step-text">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="landing-abouts">
        <div className="landing-abouts-container">
        <div className="landing-features-badge">About</div>
          <h2>Why Choose ViralMotion?</h2>
          <p className="landing-subtitle">Everything you need to create content that stands out</p>

          <div className="landing-abouts-grid">
            {abouts.map((about) => (
              <div key={about.title} className="landing-about-card">
                <h3>{about.title}</h3>
                <p>{about.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-faq">
        <div className="landing-faq-container">
        <div className="landing-features-badge">FAQ</div>
          <h2>Frequently Asked Questions</h2>
          <p className="landing-subtitle">Got questions? We've got answers</p>

          <div className="landing-faq-list">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className={`landing-faq-item ${openFaqIndex === index ? 'open' : ''}`}
              >
                <button
                  className="landing-faq-question"
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
                    className="landing-faq-icon"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div className="landing-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-cta-container">
          <div className="landing-cta-card">
            <h2>
              Ready to Create <span className="landing-text-gradient">Viral Content</span>?
            </h2>
            <p>
              Join thousands of creators who are already using ViralMotion to grow their audience.
            </p>
            <div className="landing-cta-buttons">
              <Link to="/signup" className="landing-btn-primary">Start Free Trial</Link>
              <Link to="/pricing" className="landing-btn-outline">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViralMotionLanding;
