import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/TemplatePage.css';
import '../css/FeaturePage.css';
import '../../assets/Logo.css';
import QS from '../../assets/image/QS.jpeg'
import ShareableImg from '../../assets/image/images/Shareable.png';

const RelatableQuotesPage: React.FC = () => {
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

  const templateVariations = [
    {
      title: 'Typography Pop',
      description: 'Words that pop onto screen with satisfying animations and impact sounds.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 7 4 4 20 4 20 7"/>
          <line x1="9" y1="20" x2="15" y2="20"/>
          <line x1="12" y1="4" x2="12" y2="20"/>
        </svg>
      ),
    },
    {
      title: 'Bounce Text',
      description: 'Playful bouncing animations that add energy and personality to your quotes.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
          <line x1="9" y1="9" x2="9.01" y2="9"/>
          <line x1="15" y1="9" x2="15.01" y2="9"/>
        </svg>
      ),
    },
    {
      title: 'Highlight Words',
      description: 'Key words highlighted with color, glow, or underline effects for emphasis.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
    },
    {
      title: 'Zoom Punch',
      description: 'Dramatic zoom effects that punch in on important words for maximum impact.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      ),
    },
    {
      title: 'Aesthetic Quote Layout',
      description: 'Beautiful, Instagram-worthy layouts with elegant typography and backgrounds.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      ),
    },
    {
      title: 'Viral Sound Sync',
      description: 'Auto-sync text animations to trending sounds and beats for TikTok virality.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13"/>
          <circle cx="6" cy="18" r="3"/>
          <circle cx="18" cy="16" r="3"/>
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Enter Your Quote',
      description: 'Type or paste your relatable quote, motivation, or viral text content.',
    },
    {
      number: 2,
      title: 'Choose Animation Style',
      description: 'Select from typography pop, bounce, highlight, zoom punch, or aesthetic layouts.',
    },
    {
      number: 3,
      title: 'Add Viral Sound',
      description: 'Pick from trending sounds or upload your own audio to sync with the animations.',
    },
    {
      number: 4,
      title: 'Export & Go Viral',
      description: 'Render in HD and share directly to TikTok, Reels, or YouTube Shorts.',
    },
  ];

  const benefits = [
    {
      src: 'https://plus.unsplash.com/premium_photo-1683977922495-3ab3ce7ba4e6?q=80&w=1100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Trending Format',
      description: 'Quote videos consistently perform well on TikTok and Instagram Reels.',
    },
    {
      src: 'https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Easy to Create',
      description: 'No video editing skills needed. Just type your text and let our AI do the rest.',
    },
    {
      src: ShareableImg,
      title: 'Highly Shareable',
      description: 'Relatable content gets saved, shared, and commented on more than any other format.',
    },
  ];

  return (
    <div className="template-page">
      {/* Navigation */}
      <nav className="template-nav">
        <div className="template-nav-container">
          <Link to="/" className="landing-logo">
            <span className="logo__dot"></span>
            <span className="logo__text">ViralMotion</span>
          </Link>
          <div className="template-nav-links">
            {/* Features Dropdown */}
            <div
              className="template-nav-dropdown"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button className="template-nav-dropdown-trigger">
                Features
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {featuresDropdownOpen && (
                <div className="template-nav-dropdown-menu">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="template-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div
              className="template-nav-dropdown"
              onMouseEnter={() => setTemplatesDropdownOpen(true)}
              onMouseLeave={() => setTemplatesDropdownOpen(false)}
            >
              <button className="template-nav-dropdown-trigger">
                Templates
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {templatesDropdownOpen && (
                <div className="template-nav-dropdown-menu">
                  {templateItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="template-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/pricing">Pricing</Link>
          </div>
          <Link to="/login" className="template-nav-cta">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="template-hero template-hero-quotes">
        <div className="template-hero-container">
          <div className="template-hero-content">
            <h1>Relatable Quotes + Viral Sound Effects</h1>
            <p>
              Create quote videos that resonate with your audience. Choose from typography pop styles,
              bounce text, highlight words, zoom punch effects, and aesthetic quote layouts - all synced
              to viral sounds.
            </p>
            <div className="template-hero-buttons">
              <Link to="/signup" className="template-btn-primary">
                Create Quote Video
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="template-hero-visual">
            <div className="template-hero-image-stack">
              <div className="template-hero-image-main">
                <div className="template-quote-demo">
                  <div className="template-quote-text">
                    <span className="template-quote-word">Sometimes</span>
                    <span className="template-quote-word template-quote-highlight">the smallest</span>
                    <span className="template-quote-word">step in the</span>
                    <span className="template-quote-word template-quote-highlight">right direction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Variations */}
      <section className="template-scenarios">
        <div className="template-section-container">
          <h2>Animation Styles</h2>
          <p className="template-section-subtitle">Choose the perfect style for your quote:</p>
          <div className="template-scenarios-grid">
            {templateVariations.map((variation) => (
              <div key={variation.title} className="template-scenario-card">
                <div className="template-scenario-icon">{variation.icon}</div>
                <h3>{variation.title}</h3>
                <p>{variation.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="template-how-it-works">
        <div className="template-section-container">
          <h2>How to Create Text Conversation Videos</h2>
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
            <img src={QS} />
          </div>
          <div className="template-steps-cta">
            <Link to="/signup" className="template-btn-primary">
              Start Creating Now
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
          <h2>Why Quote Videos Work</h2>
          <p className="feature-section-subtitle">Here's why this format dominates social media:</p>
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
              Create Your Quote Video
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

export default RelatableQuotesPage;
