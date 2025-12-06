import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/LegalPage.css';
import '../../assets/Logo.css';

const RefundPolicyPage: React.FC = () => {
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

  return (
    <div className="legal-page">
      {/* Navigation */}
      <nav className="legal-nav">
        <div className="legal-nav-container">
          <Link to="/" className="landing-logo">
            <span className="logo__dot"></span>
            <span className="logo__text">ViralMotion</span>
          </Link>
          <div className="legal-nav-links">
            {/* Features Dropdown */}
            <div
              className="legal-nav-dropdown"
              onMouseEnter={() => setFeaturesDropdownOpen(true)}
              onMouseLeave={() => setFeaturesDropdownOpen(false)}
            >
              <button className="legal-nav-dropdown-trigger">
                Features
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {featuresDropdownOpen && (
                <div className="legal-nav-dropdown-menu">
                  {featureItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="legal-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Templates Dropdown */}
            <div
              className="legal-nav-dropdown"
              onMouseEnter={() => setTemplatesDropdownOpen(true)}
              onMouseLeave={() => setTemplatesDropdownOpen(false)}
            >
              <button className="legal-nav-dropdown-trigger">
                Templates
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {templatesDropdownOpen && (
                <div className="legal-nav-dropdown-menu">
                  {templateItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="legal-nav-dropdown-item"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/pricing">Pricing</Link>
          </div>
          <Link to="/login" className="legal-nav-cta">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="legal-hero">
        <div className="legal-hero-container">
          <h1>Refund Policy</h1>
          <p className="legal-last-updated">Last updated: December 6, 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content">
        <div className="legal-content-container">
          <div className="legal-section">
            <h2>1. No Refund Policy</h2>
            <div className="legal-highlight">
              <strong>All sales are final. We do not offer refunds for any purchases made on ViralMotion.</strong>
            </div>
            <p>
              By purchasing a subscription or any service from ViralMotion, you acknowledge and agree that all
              payments are non-refundable. This policy applies to all subscription plans, one-time purchases,
              credit packages, and any other paid services offered on our platform.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Why We Have a No Refund Policy</h2>
            <p>
              Due to the nature of our digital services and the immediate access provided upon purchase,
              we are unable to offer refunds. When you subscribe to ViralMotion:
            </p>
            <ul>
              <li>You receive immediate access to all features included in your plan</li>
              <li>Digital services and credits are consumed upon use and cannot be returned</li>
              <li>Our AI-powered tools and rendering services incur costs immediately upon use</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Subscription Cancellation</h2>
            <p>
              While we do not offer refunds, you may cancel your subscription at any time:
            </p>
            <ul>
              <li>You will continue to have access to premium features until the end of your current billing period</li>
              <li>Your account will automatically downgrade to the free tier after the billing period ends</li>
              <li>No refunds or credits will be provided for the remaining unused time</li>
              <li>Any unused credits will expire at the end of the billing period</li>
            </ul>
            <p>
              To cancel your subscription, go to Account Settings &gt; Billing &gt; Cancel Subscription.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Billing Errors</h2>
            <p>
              In the rare event of a billing error (such as being charged twice for the same subscription),
              please contact our support team immediately. We will investigate and correct any verified
              billing errors.
            </p>
            <p>
              To report a billing error, email us at <strong>billing@viralmotion.com</strong> with:
            </p>
            <ul>
              <li>Your account email address</li>
              <li>Transaction details and date</li>
              <li>Description of the billing error</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Try Before You Buy</h2>
            <p>
              We encourage all users to explore our free tier before making a purchase. The free tier allows
              you to test our platform and features to ensure ViralMotion meets your needs before committing
              to a paid subscription.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Third-Party Purchases</h2>
            <p>
              If you purchased your subscription through a third-party platform (such as the App Store or
              Google Play), their refund policies apply. Please contact the respective platform directly
              for any refund inquiries.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this refund policy at any time. Changes will be effective
              immediately upon posting to our website. Your continued use of the service after any changes
              indicates your acceptance of the updated policy.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about our Refund Policy, please contact us:
            </p>
            <ul>
              <li>By email: billing@viralmotion.com</li>
              <li>By visiting our Help Center: <Link to="/help-center">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicyPage;
