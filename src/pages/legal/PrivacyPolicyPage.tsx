import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/LegalPage.css';
import '../../assets/Logo.css';

const PrivacyPolicyPage: React.FC = () => {
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
          <h1>Privacy Policy</h1>
          <p className="legal-last-updated">Last updated: December 6, 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content">
        <div className="legal-content-container">
          <div className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to ViralMotion. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our
              website and use our services, and tell you about your privacy rights and how the law protects you.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
            <ul>
              <li><strong>Identity Data:</strong> First name, last name, username or similar identifier.</li>
              <li><strong>Contact Data:</strong> Email address and telephone numbers.</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
              <li><strong>Content Data:</strong> Videos, images, and other content you upload to our platform.</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process your transactions and subscriptions</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from being accidentally
              lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal
              data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Data Retention</h2>
            <p>
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected
              it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              When you delete your account, we will delete or anonymize your personal data within 30 days.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Your Legal Rights</h2>
            <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
            <ul>
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our service and hold certain
              information. Cookies are files with small amount of data which may include an anonymous unique identifier.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our service, provide the service on
              our behalf, perform service-related services, or assist us in analyzing how our service is used. These
              third parties have access to your personal data only to perform these tasks on our behalf and are
              obligated not to disclose or use it for any other purpose.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
              new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>By email: privacy@viralmotion.com</li>
              <li>By visiting our Help Center: <Link to="/help-center">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
