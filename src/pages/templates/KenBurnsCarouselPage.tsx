import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/TemplatePage.css';
import '../css/FeaturePage.css';
import '../../assets/Logo.css';
import KBC from '../../assets/image/KBC.jpeg';
import AnimationImg from '../../assets/image/images/Animation.png';
import PerfectImg from '../../assets/image/images/Perfect.png';
import TransformImg from '../../assets/image/images/Transform.png';

const KenBurnsCarouselPage: React.FC = () => {
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
      title: 'Blurred Background',
      description: 'A blurred video in the background with a clear vertical video centered in the foreground.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <rect x="6" y="4" width="12" height="16" rx="1"/>
        </svg>
      ),
    },
    {
      title: 'Slow Pan & Zoom',
      description: 'Classic Ken Burns effect with gentle panning and zooming across your images.',
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
      title: 'Stack Carousel',
      description: 'Images stacked like cards that swipe away to reveal the next photo.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="16" height="16" rx="2"/>
          <rect x="6" y="2" width="16" height="16" rx="2"/>
        </svg>
      ),
    },
    {
      title: 'Parallax Depth',
      description: 'Multi-layer parallax effect that adds cinematic depth to your photos.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      ),
    },
    {
      title: '3D Flip Gallery',
      description: 'Photos flip and rotate in 3D space for a dynamic presentation.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
    },
    {
      title: 'Cinematic Widescreen',
      description: 'Letterbox format with smooth camera movements for a movie-like feel.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="6" width="20" height="12" rx="2"/>
          <line x1="2" y1="4" x2="22" y2="4"/>
          <line x1="2" y1="20" x2="22" y2="20"/>
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Upload Your Photos',
      description: 'Import multiple images to create your carousel slideshow.',
    },
    {
      number: 2,
      title: 'Choose Carousel Style',
      description: 'Select from blurred background, stack carousel, parallax, or other effects.',
    },
    {
      number: 3,
      title: 'Set Timing & Music',
      description: 'Adjust how long each image displays and add background music.',
    },
    {
      number: 4,
      title: 'Export & Share',
      description: 'Render your carousel video in vertical format for social media.',
    },
  ];

  const benefits = [
    {
      src: TransformImg,
      title: 'Turn Photos into Videos',
      description: 'Transform static images into engaging video content without filming.',
    },
    {
      src: PerfectImg,
      title: 'Perfect for Vertical',
      description: 'Optimized for TikTok and Reels with blurred background fill.',
    },
    {
      src: AnimationImg,
      title: 'Automatic Animation',
      description: 'AI automatically applies smooth Ken Burns movements to your photos.',
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
      <section className="template-hero template-hero-kenburns">
        <div className="template-hero-container">
          <div className="template-hero-content">
            <h1>Ken Burns Carousel Templates</h1>
            <p>
              Transform your photos into cinematic video slideshows. Create stunning carousels with
              blurred backgrounds, smooth pan and zoom effects, and professional transitions - perfect
              for vertical social media content.
            </p>
            <div className="template-hero-buttons">
              <Link to="/signup" className="template-btn-primary">
                Create Carousel Video
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="template-hero-visual">
            <div className="template-hero-image-stack">
              <div className="template-hero-image-main">
                <div className="template-kenburns-demo">
                  <div className="template-kenburns-bg"></div>
                  <div className="template-kenburns-video">
                    <img src="https://plus.unsplash.com/premium_photo-1666700698946-fbf7baa0134a?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Collage item 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5%' }} />
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
          <h2>Carousel Styles</h2>
          <p className="template-section-subtitle">Choose your animation effect:</p>
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
            <img src={KBC} />
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
          <h2>Why Ken Burns Carousels Work</h2>
          <p className="feature-section-subtitle">Here's what makes this format special:</p>
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
              Create Your Carousel
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

export default KenBurnsCarouselPage;
