import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/TemplatePage.css';
import '../css/FeaturePage.css';
import '../../assets/Logo.css';
import RV from '../../assets/image/RV.jpeg'
import ProvenImg from '../../assets/image/images/Proven.png';
import BuildImg from '../../assets/image/images/Build.png';
import EasyImg from '../../assets/image/images/Easy.png';
import ReactionImg from '../../assets/image/images/Reaction.png'

const ReactionVideoPage: React.FC = () => {
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
      title: 'Split-Screen Format',
      description: 'Classic side-by-side or top-bottom layout with original video and your reaction.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="12" y1="3" x2="12" y2="21"/>
        </svg>
      ),
    },
    {
      title: 'Picture-in-Picture',
      description: 'Your reaction in a small bubble overlaying the main video content.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <rect x="12" y="12" width="8" height="6" rx="1"/>
        </svg>
      ),
    },
    {
      title: 'Adjustable Placement',
      description: 'Move and resize your reaction video anywhere on the screen.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="5 9 2 12 5 15"/>
          <polyline points="9 5 12 2 15 5"/>
          <polyline points="15 19 12 22 9 19"/>
          <polyline points="19 9 22 12 19 15"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      ),
    },
    {
      title: 'Video Import & Trim',
      description: 'Import any video to react to and trim specific moments with precision.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3"/>
          <circle cx="6" cy="18" r="3"/>
          <line x1="20" y1="4" x2="8.12" y2="15.88"/>
          <line x1="14.47" y1="14.48" x2="20" y2="20"/>
          <line x1="8.12" y1="8.12" x2="12" y2="12"/>
        </svg>
      ),
    },
    {
      title: 'Meme Overlays',
      description: 'Add popular meme templates, stickers, and text overlays to enhance reactions.',
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
      title: 'Green Screen Mode',
      description: 'Remove your background for a cleaner, more professional look.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/>
        </svg>
      ),
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Import Video to React To',
      description: 'Upload or paste the URL of the video you want to react to.',
    },
    {
      number: 2,
      title: 'Record or Upload Reaction',
      description: 'Record your reaction directly or upload a pre-recorded video.',
    },
    {
      number: 3,
      title: 'Choose Layout & Position',
      description: 'Select split-screen, PIP, or custom placement for your reaction.',
    },
    {
      number: 4,
      title: 'Add Effects & Export',
      description: 'Add meme overlays, trim moments, and export your reaction video.',
    },
  ];

  const benefits = [
    {
      src: ProvenImg,
      title: 'Proven Viral Format',
      description: 'Reaction videos are one of the most engaging content types on every platform.',
    },
    {
      src: BuildImg,
      title: 'Build Connection',
      description: 'Show your personality and connect with your audience through genuine reactions.',
    },
    {
      src: EasyImg,
      title: 'Easy Content Creation',
      description: 'React to trending content for endless video ideas without starting from scratch.',
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
      <section className="template-hero template-hero-reaction">
        <div className="template-hero-container">
          <div className="template-hero-content">
            <h1>Reaction Video Templates</h1>
            <p>
              Create professional reaction videos with ease. Choose from split-screen formats,
              picture-in-picture pop-ups, adjustable video placement, and add meme overlays.
              Import any video and trim the best moments.
            </p>
            <div className="template-hero-buttons">
              <Link to="/signup" className="template-btn-primary">
                Create Reaction Video
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="template-hero-visual">
            <div className="template-hero-image-stack">
              <div className="template-hero-image-main" style={{ position: 'relative' }}>
                <img src='https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="Reaction Video" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    className="play-button-animated"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '20%',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'pulse 2s ease-in-out infinite',
                      cursor: 'pointer'
                    }}
                  >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                </div>
                <div
                  className="pip-animated"
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    borderRadius: '8px',
                    padding: '10px',
                    animation: 'bounce 2s ease-in-out infinite'
                  }}
                >
                <img src={ReactionImg} alt="Reaction" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
                <style>{`
                  @keyframes pulse {
                    0%, 100% {
                      transform: scale(1);
                      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
                    }
                    50% {
                      transform: scale(1.05);
                      box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.2);
                    }
                  }
                  @keyframes bounce {
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-5px);
                    }
                  }
                  .play-button-animated:hover {
                    transform: scale(1.1) !important;
                    transition: transform 0.3s ease;
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
          <h2>Layout Options</h2>
          <p className="template-section-subtitle">Choose the perfect format for your reaction:</p>
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
            <img src={RV} />
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

export default ReactionVideoPage;
