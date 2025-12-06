import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/PricingPage.css';
import '../assets/Logo.css';

const PricingPage: React.FC = () => {
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

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

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 9,
      annualPrice: 7,
      description: 'Perfect for trying out ViralMotion',
      workflows: 30,
      exportCredits: 20,
      voiceoverCredits: 15,
      aiImages: 50,
      features: [
        'Basic video templates',
        '720p export quality',
        'Watermark on videos',
        'Email support',
      ],
      cta: 'Choose Starter',
      highlighted: false,
    },
    {
      name: 'Creator',
      monthlyPrice: 19,
      annualPrice: 15,
      description: 'For content creators going viral',
      workflows: 100,
      exportCredits: 60,
      voiceoverCredits: 45,
      aiImages: 200,
      features: [
        'All video templates',
        '1080p HD export',
        'No watermark',
        'Priority support',
        'Batch rendering',
        'Custom branding',
      ],
      cta: 'Choose Creator',
      highlighted: true,
      badge: 'Most popular!',
    },
    {
      name: 'Pro',
      monthlyPrice: 39,
      annualPrice: 31,
      description: 'For professional video creators',
      workflows: 300,
      exportCredits: 180,
      voiceoverCredits: 150,
      aiImages: 1000,
      features: [
        'Everything in Creator',
        '4K export quality',
        'Advanced AI tools',
        '24/7 priority support',
        'Team collaboration',
        'API access',
      ],
      cta: 'Choose Pro',
      highlighted: false,
    },
  ];

  const templateFeatures = [
    { name: 'Fake Text Conversation', starter: false, creator: true, pro: true },
    { name: 'Relatable Quotes + Viral Sound', starter: false, creator: true, pro: true },
    { name: 'Reaction Video', starter: false, creator: true, pro: true },
    { name: 'Image / Video Collage Edit', starter: true, creator: true, pro: true },
    { name: 'Ken Burns Carousel', starter: true, creator: true, pro: true },
  ];

  const toolsFeatures = [
    { name: 'AI Voiceover Generator', starter: '15 minutes', creator: '45 minutes', pro: '150 minutes' },
    { name: 'AI Auto-Captions', starter: false, creator: true, pro: true },
    { name: 'Smart Video Editing', starter: false, creator: true, pro: true },
    { name: 'Video & Audio Downloader', starter: false, creator: true, pro: true },
    { name: 'Multi-platform Download (TikTok, YouTube, Instagram, Twitter)', starter: false, creator: true, pro: true },
    { name: 'Extract Audio from Video (MP3)', starter: false, creator: true, pro: true },
  ];

  return (
    <div className="pricing-page">
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
      <section className="pricing-hero">
        <div className="pricing-hero-container">
          <h1>Create viral videos at any scale</h1>
          <p>Choose the plan that fits your content goals. Start creating engaging videos today and scale as you grow.</p>

          <div className="pricing-toggle">
            <span className={!isAnnual ? 'active' : ''}>Monthly</span>
            <button
              className="pricing-toggle-switch"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual billing"
            >
              <span className={`pricing-toggle-slider ${isAnnual ? 'annual' : ''}`}></span>
            </button>
            <span className={isAnnual ? 'active' : ''}>Annual</span>
            <span className="pricing-save-badge">Save 20%</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section">
        <div className="pricing-cards-container">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
            >
              {plan.badge && <div className="pricing-badge">{plan.badge}</div>}

              <div className="pricing-card-header">
                <h3>{plan.name}</h3>
                <div className="pricing-card-price">
                  <span className="price-currency">$</span>
                  <span className="price-amount">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="price-period">/mo</span>
                </div>
                {isAnnual && (
                  <p className="pricing-card-billed">
                    Billed yearly at ${plan.annualPrice * 12}
                  </p>
                )}
                <p className="pricing-card-description">{plan.description}</p>
              </div>

              <div className="pricing-card-credits">
                <div className="pricing-credit-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{plan.workflows} workflow credits per month</span>
                </div>
                <div className="pricing-credit-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{plan.exportCredits} export credits</span>
                </div>
                <div className="pricing-credit-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{plan.voiceoverCredits} voiceover credits</span>
                </div>
                <div className="pricing-credit-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{plan.aiImages} AI images</span>
                </div>
              </div>

              <ul className="pricing-card-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`pricing-card-cta ${plan.highlighted ? 'primary' : 'secondary'}`}
              >
                {plan.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features Comparison */}
      <section className="pricing-comparison">
        <div className="pricing-comparison-container">
          <h2>Features</h2>

          <div className="pricing-table">
            <table>
              <thead>
                <tr>
                  <th className="feature-name-col">ViralMotion Templates</th>
                  <th>Starter</th>
                  <th className="highlighted-col">Creator</th>
                  <th>Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="section-header">
                  <td>Video Templates</td>
                  <td>30 credits</td>
                  <td className="highlighted-col">100 credits</td>
                  <td>300 credits</td>
                </tr>
                {templateFeatures.map((feature, idx) => (
                  <tr key={idx}>
                    <td className="feature-name">{feature.name}</td>
                    <td>
                      {feature.starter ? (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      )}
                    </td>
                    <td className="highlighted-col">
                      {feature.creator ? (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      )}
                    </td>
                    <td>
                      {feature.pro ? (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}

                <tr className="section-header">
                  <td>AI Tools</td>
                  <td>15 credits</td>
                  <td className="highlighted-col">45 credits</td>
                  <td>150 credits</td>
                </tr>
                {toolsFeatures.map((feature, idx) => (
                  <tr key={idx}>
                    <td className="feature-name">{feature.name}</td>
                    <td>
                      {typeof feature.starter === 'string' ? (
                        <span className="feature-value">{feature.starter}</span>
                      ) : feature.starter ? (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      )}
                    </td>
                    <td className="highlighted-col">
                      {typeof feature.creator === 'string' ? (
                        <span className="feature-value">{feature.creator}</span>
                      ) : feature.creator ? (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      )}
                    </td>
                    <td>
                      {typeof feature.pro === 'string' ? (
                        <span className="feature-value">{feature.pro}</span>
                      ) : feature.pro ? (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      ) : (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
