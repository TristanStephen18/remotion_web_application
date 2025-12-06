import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/FeaturePage.css';
import '../../assets/Logo.css';
import ViralMotionImg from '../../assets/image/ViralMotion.png';

const AIToolsPage: React.FC = () => {
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
      title: 'Upload Your Video',
      description: 'Upload your video or start with a template. Our AI analyzes your content automatically.',
    },
    {
      number: 2,
      title: 'Choose AI Tools',
      description: 'Select the AI features you want: auto-captions, voiceover, background removal, or smart editing.',
    },
    {
      number: 3,
      title: 'Customize Results',
      description: 'Review and fine-tune the AI-generated content. Adjust timing, styles, and preferences.',
    },
    {
      number: 4,
      title: 'Export Your Video',
      description: 'Export your enhanced video with all AI improvements applied. Ready to share!',
    },
  ];

  const benefits = [
    {
      src: 'https://plus.unsplash.com/premium_photo-1676637656166-cb7b3a43b81a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Lightning Fast',
      description: 'AI processes your content in seconds. What used to take hours now takes minutes.',
    },
    {
      src: 'https://images.unsplash.com/photo-1587355760421-b9de3226a046?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'No Experience Needed',
      description: 'Our AI handles the technical work. You focus on creating great content.',
    },
    {
      src: 'https://plus.unsplash.com/premium_photo-1682309834966-485aedc99be5?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Consistent Quality',
      description: 'AI ensures every video maintains professional quality standards automatically.',
    },
  ];

  const scenarios = [
    {
      src: 'https://images.unsplash.com/photo-1636971828014-0f3493cba88a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Content Creators',
      description: 'Add captions and voiceovers to reach wider audiences and boost engagement.',
    },
    {
      src: 'https://images.unsplash.com/photo-1696041760912-a06e1f747850?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Marketers',
      description: 'Create professional video ads quickly with AI-powered editing and effects.',
    },
    {
      src: 'https://plus.unsplash.com/premium_photo-1666299772370-b9516c701b8e?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Educators',
      description: 'Make educational content more accessible with auto-generated captions and voiceovers.',
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
      <section className="feature-hero feature-hero-ai">
        <div className="feature-hero-container">
          <div className="feature-hero-content">
            <h1>AI Tools</h1>
            <p>
              Supercharge your video creation with AI-powered tools. Auto-captions, voiceovers,
              smart editing, and more - let AI handle the heavy lifting while you focus on creativity.
            </p>
            <div className="feature-hero-buttons">
              <Link to="/signup" className="feature-btn-primary">
                Try AI Tools
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="feature-hero-visual">
            <div className="feature-hero-image-stack">
              <div className="feature-hero-image-main">
                <div className="feature-ai-visual">
                  <div className="feature-ai-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                      <path d="M16 10v1a4 4 0 0 1-8 0v-1" />
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    </svg>
                  </div>
                  <div className="feature-ai-particles"></div>
                </div>
              </div>
              <div className="feature-hero-card feature-hero-card-1">
                <span className="feature-card-label">Auto Captions</span>
                <div className="feature-card-wave"></div>
              </div>
              <div className="feature-hero-card feature-hero-card-2">
                <span className="feature-card-label">AI Voiceover</span>
                <div className="feature-card-progress"></div>
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
            <img src={ViralMotionImg} alt="ViralMotion AI Tools" />
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
          <h2>Benefits of AI-Powered Editing</h2>
          <p className="feature-section-subtitle">Here's why creators love our AI tools:</p>
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
              Try AI Tools
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
          <h2>Who Uses AI Tools?</h2>
          <p className="feature-section-subtitle">AI tools are perfect for:</p>
          <div className="feature-benefits-grid">
            {scenarios.map((scenario) => (
              <div key={scenario.title} className="feature-benefit-card">
                <div className="feature-benefit-image">
                  <img src={scenario.src} alt={scenario.title} />
                </div>
                <h3>{scenario.title}</h3>
                <p>{scenario.description}</p>
              </div>
            ))}
          </div>
          <div className="feature-scenarios-cta">
            <Link to="/signup" className="feature-btn-primary">
              Get Started Now
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

export default AIToolsPage;
