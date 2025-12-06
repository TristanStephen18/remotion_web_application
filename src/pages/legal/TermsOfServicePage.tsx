import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/LegalPage.css';
import '../../assets/Logo.css';

const TermsOfServicePage: React.FC = () => {
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
          <h1>Terms of Service</h1>
          <p className="legal-last-updated">Last updated: December 6, 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="legal-content">
        <div className="legal-content-container">
          <div className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using ViralMotion's services, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from
              using or accessing our services.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Use License</h2>
            <p>
              Permission is granted to temporarily use ViralMotion's services for personal, non-commercial transitory
              viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials except for your own video projects</li>
              <li>Use the materials for any commercial purpose without a valid subscription</li>
              <li>Attempt to decompile or reverse engineer any software contained on ViralMotion</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Account Terms</h2>
            <p>To use certain features of the service, you must register for an account. When you register:</p>
            <ul>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the security of your account and password</li>
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately upon becoming aware of any breach of security</li>
              <li>You must be at least 13 years old to use this service</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>4. Subscription and Payments</h2>
            <p>
              Some aspects of the service are provided on a subscription basis. You will be billed in advance on a
              recurring and periodic basis, either monthly or annually, depending on the subscription plan you select.
            </p>
            <ul>
              <li>Your subscription will automatically renew unless you cancel it</li>
              <li>You can cancel your subscription at any time through your account settings</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>All fees are exclusive of applicable taxes unless stated otherwise</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>5. Content Ownership</h2>
            <p>
              You retain ownership of any content you create using our service. However, by uploading content to
              ViralMotion, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and
              display your content solely for the purpose of providing the service to you.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Acceptable Use</h2>
            <p>You agree not to use the service to:</p>
            <ul>
              <li>Upload content that is illegal, harmful, threatening, abusive, or otherwise objectionable</li>
              <li>Infringe on any third party's intellectual property rights</li>
              <li>Transmit any viruses, worms, or malicious code</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Collect or store personal data about other users without their consent</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>7. Intellectual Property</h2>
            <p>
              The service and its original content (excluding content provided by users), features, and functionality
              are and will remain the exclusive property of ViralMotion and its licensors. The service is protected
              by copyright, trademark, and other laws.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice
              or liability, under our sole discretion, for any reason whatsoever, including without limitation if you
              breach the Terms. Upon termination, your right to use the service will cease immediately.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              In no event shall ViralMotion, nor its directors, employees, partners, agents, suppliers, or affiliates,
              be liable for any indirect, incidental, special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
              to or use of or inability to access or use the service.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Disclaimer</h2>
            <p>
              Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE"
              basis. The service is provided without warranties of any kind, whether express or implied, including, but
              not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement
              or course of performance.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
              provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change
              will be determined at our sole discretion.
            </p>
          </div>

          <div className="legal-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li>By email: legal@viralmotion.com</li>
              <li>By visiting our Help Center: <Link to="/help-center">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
