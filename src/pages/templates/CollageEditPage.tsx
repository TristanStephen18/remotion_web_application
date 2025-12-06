import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/TemplatePage.css';
import '../css/FeaturePage.css';
import '../../assets/Logo.css';
import PC from '../../assets/image/PC.jpeg';
import CreateImg from '../../assets/image/images/Create.png';
import BeatImg from '../../assets/image/images/Beat.png';

const CollageEditPage: React.FC = () => {
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
      title: 'Thirst-Trap Edits',
      description: 'Slow-motion effects, dreamy filters, and beat-synced transitions for aesthetic content.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
    },
    {
      title: 'Aesthetic Montages',
      description: 'Cinematic compilations with smooth transitions, color grading, and ambient vibes.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      ),
    },
    {
      title: 'Trend-Style Photo Grids',
      description: 'Multi-photo layouts that animate in sync with trending TikTok sounds.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      title: 'Quick-Cut Transitions',
      description: 'Fast-paced cuts synced to beats, perfect for hype videos and energy content.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      title: 'Vintage Film Filters',
      description: 'Retro VHS, film grain, and nostalgic color effects for that throwback aesthetic.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/>
          <line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="2" y1="7" x2="7" y2="7"/>
          <line x1="2" y1="17" x2="7" y2="17"/>
          <line x1="17" y1="17" x2="22" y2="17"/>
          <line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
      ),
    },
    {
      title: 'Glitch & Distortion',
      description: 'Modern glitch effects, RGB splits, and digital distortion for edgy content.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Upload Your Media',
      description: 'Import photos or video clips from your device or social media.',
    },
    {
      number: 2,
      title: 'Choose Edit Style',
      description: 'Select from thirst-trap, aesthetic, trend-style, or quick-cut templates.',
    },
    {
      number: 3,
      title: 'Add Music & Effects',
      description: 'Pick trending sounds and apply filters, transitions, and visual effects.',
    },
    {
      number: 4,
      title: 'Export & Share',
      description: 'Render your edit and share directly to TikTok, Reels, or YouTube.',
    },
  ];

  const benefits = [
    {
      src: CreateImg,
      title: 'Create in Minutes',
      description: 'What takes hours in traditional editors takes just minutes with our templates.',
    },
    {
      src: 'https://images.unsplash.com/photo-1614963326505-843868e1d83a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Professional Quality',
      description: 'Achieve studio-level edits without expensive software or editing skills.',
    },
    {
      src: BeatImg,
      title: 'Beat-Synced',
      description: 'Our AI automatically syncs transitions and effects to your chosen music.',
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
      <section className="template-hero">
        <div className="template-hero-container">
          <div className="template-hero-content">
            <h1>Image / Video Collage Edit Templates</h1>
            <p>
              Create stunning edits with thirst-trap effects, aesthetic montages, trend-style photo grids,
              quick-cut transitions, and beautiful filters. Perfect for Instagram and TikTok content.
            </p>
            <div className="template-hero-buttons">
              <Link to="/signup" className="template-btn-primary">
                Create Collage Edit
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="template-hero-visual">
            <div className="template-hero-image-stack">
              <div className="template-hero-image-main" style={{ position: 'relative' }}>
                <div className="template-collage-demo">
                  <div className="template-collage-grid">
                    <div className="template-collage-item">
                      <img src="https://images.unsplash.com/photo-1504150558240-0b4fd8946624?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Collage item 1" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5%' }} />
                    </div>
                    <div className="template-collage-item">
                      <img src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Collage item 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5%' }} />
                    </div>
                    <div className="template-collage-item">
                      <img src="https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Collage item 3" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5%' }} />
                    </div>
                    <div className="template-collage-item">
                      <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Collage item 4" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5%' }} />
                    </div>
                  </div>
                  <div className="typing-overlay">
                    <span className="typing-text">Travel Goal</span>
                  </div>
                </div>
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
                  .typing-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10;
                    padding: 20px 40px;
                    border-radius: 12px;
                    backdrop-filter: blur(4px);
                  }
                  .typing-text {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 30px;
                    font-weight: 600;
                    font-style: italic;
                    color: black;
                    overflow: hidden;
                    border-right: 2px solid white;
                    white-space: nowrap;
                    letter-spacing: 2px;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    animation: typing 2s steps(11) infinite, blink 0.7s step-end infinite;
                  }
                  @keyframes typing {
                    0%, 90%, 100% {
                      width: 0;
                    }
                    30%, 60% {
                      width: 11ch;
                    }
                  }
                  @keyframes blink {
                    0%, 100% {
                      border-color: white;
                    }
                    50% {
                      border-color: transparent;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Variations */}
      <section className="template-scenarios">
        <div className="template-section-container">
          <h2>Edit Styles</h2>
          <p className="template-section-subtitle">Choose your aesthetic:</p>
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
            <img src={PC} />
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
          <h2>Why Use Our Collage Templates</h2>
          <p className="feature-section-subtitle">Here's what makes our edits special:</p>
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
              Create Your Edit
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

export default CollageEditPage;
