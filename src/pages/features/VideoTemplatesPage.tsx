import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/FeaturePage.css';
import '../../assets/Logo.css';
import TemplateImg from '../../assets/image/Template.png';

const VideoTemplatesPage: React.FC = () => {
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);

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

  const steps = [
    {
      number: 1,
      title: 'Browse Templates',
      description: 'Explore our library and find a template that matches your content style. Filter by category, style, or trending templates.',
    },
    {
      number: 2,
      title: 'Add Your Content',
      description: 'Replace placeholder text and images with your own content. Upload your media or use our stock library.',
    },
    {
      number: 3,
      title: 'Customize the Design',
      description: 'Adjust colors, fonts, and animations. Preview your changes in real-time before exporting.',
    },
    {
      number: 4,
      title: 'Export & Share',
      description: 'Render your video in high quality and download it. Share directly to your favorite social platforms.',
    },
  ];

  const benefits = [
    {
      src: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Save Hours of Work',
      description: 'Skip the learning curve. Our templates let you create professional videos in minutes, not hours.',
    },
    {
      src: 'https://images.unsplash.com/photo-1622151834677-70f982c9adef?q=80&w=1086&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Professional Quality',
      description: 'Every template is designed by professionals to ensure your content looks polished and engaging.',
    },
    {
      src: 'https://images.unsplash.com/photo-1653043586925-cfb4676c69a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Stand Out from Creators',
      description: 'Use unique animations and effects that help your content stand out in crowded social feeds.',
    },
  ];

  const scenarios = [
    {
      src: 'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4',
      type: 'video',
      title: 'Text Conversations',
      description: 'Create viral fake text message videos that hook viewers with storytelling.',
    },
    {
      src: 'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4',
      type: 'video',
      title: 'Analytics & Stats',
      description: 'Showcase data and statistics with animated charts and graphs that capture attention.',
    },
    {
      src: 'https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441913/CardFlip_no4k2t.mp4',
      type: 'video',
      title: 'Photo Carousels',
      description: 'Turn image collections into engaging Ken Burns style carousel videos.',
    },
  ];

  return (
    <div className="feature-page">
      {/* Navigation */}
      <nav className="feature-nav">
        <div className="feature-nav-container">
          <Link to="/" className="landing-logo">
            <span className="logo__dot"></span>
            <span className="logo__text">ViralMotion</span>
          </Link>
          <div className="feature-nav-links">
            {/* Features Dropdown */}
            <div
              className="feature-nav-dropdown"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button className="feature-nav-dropdown-trigger">
                Features
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {featuresDropdownOpen && (
                <div className="feature-nav-dropdown-menu">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="feature-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div
              className="feature-nav-dropdown"
              onMouseEnter={() => setTemplatesDropdownOpen(true)}
              onMouseLeave={() => setTemplatesDropdownOpen(false)}
            >
              <button className="feature-nav-dropdown-trigger">
                Templates
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {templatesDropdownOpen && (
                <div className="feature-nav-dropdown-menu">
                  {templateItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="feature-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/pricing">Pricing</Link>
          </div>
          <Link to="/login" className="feature-nav-cta">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="feature-hero">
        <div className="feature-hero-container">
          <div className="feature-hero-content">
            <h1>Video Templates</h1>
            <p>
              Create stunning viral videos with our professionally designed templates.
              Choose from 50+ templates optimized for TikTok, Instagram Reels, and YouTube Shorts.
            </p>
            <div className="feature-hero-buttons">
              <Link to="/signup" className="feature-btn-primary">
                Browse Templates
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="feature-hero-visual">
            <div className="feature-hero-image-stack">
            <div className="feature-hero-side-videos">
                <div className="feature-hero-image-floating feature-hero-image-floating-1">
                  <video
                    src="https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
              <div className="feature-hero-image-main">
                <video
                  src="https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/QuoteSpotlight_jn0iya.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
              <div className="feature-hero-side-videos">
                <div className="feature-hero-image-floating feature-hero-image-floating-2">
                  <video
                    src="https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="template-how-it-works">
        <div className="template-section-container">
          <h2>How to Use AI Tools</h2>
          <div className="template-steps-row">
            {steps.map((step) => (
              <div key={step.number} className="template-step-card">
                <div className="template-step-number">{step.number}</div>
                <div className="template-step-card-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="template-steps-main-image">
            <img src={TemplateImg} alt="ViralMotion Template" />
          </div>
          <div className="template-steps-cta">
            <Link to="/signup" className="template-btn-primary">
              Start Using AI Tools
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="feature-benefits">
        <div className="feature-section-container">
          <h2>Benefits of Using Video Templates</h2>
          <p className="feature-section-subtitle">Here are the key benefits of using ViralMotion templates:</p>
          <div className="feature-benefits-grid">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="feature-benefit-card">
                <div className="feature-benefit-image">
                  <img src={benefit.src} alt={benefit.title} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
          <div className="feature-benefits-cta">
            <Link to="/signup" className="feature-btn-primary">
              Try Templates
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section className="feature-scenarios">
        <div className="feature-section-container">
          <h2>Template Categories</h2>
          <p className="feature-section-subtitle">Explore our template categories for different content types:</p>
          <div className="feature-scenarios-grid">
            {scenarios.map((scenario) => (
              <div key={scenario.title} className="feature-scenario-card">
                <div className="feature-scenario-image">
                  {scenario.type === 'video' ? (
                    <video
                      src={scenario.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img src={scenario.src} alt={scenario.title} />
                  )}
                </div>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </div>
            ))}
          </div>
          <div className="feature-scenarios-cta">
            <Link to="/signup" className="feature-btn-primary">
              Explore All Templates
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoTemplatesPage;
