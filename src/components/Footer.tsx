import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import '../assets/Logo.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-gradient"></div>
      <div className="app-footer-content">
        <div className="app-footer-columns">
          {/* Features Column */}
          <div className="app-footer-column">
            <h4>Features</h4>
            <ul>
              <li><Link to="/templates">Video Templates</Link></li>
              <li><Link to="/ai-tools">AI Tools</Link></li>
              <li><Link to="/downloader">Video & Audio Downloader</Link></li>
            </ul>
          </div>

          {/* Templates Column */}
          <div className="app-footer-column">
            <h4>Templates</h4>
            <ul>
              <li><Link to="/templates/fake-text-conversation">Fake Text Conversation</Link></li>
              <li><Link to="/templates/relatable-quotes">Relatable Quotes + Viral Sound</Link></li>
              <li><Link to="/templates/reaction-video">Reaction Video</Link></li>
              <li><Link to="/templates/collage-edit">Image / Video Collage Edit</Link></li>
              <li><Link to="/templates/ken-burns-carousel">Ken Burns Carousel</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="app-footer-column">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/pricing">Pricing</Link></li>
            </ul>
          </div>

          <div className="app-footer-column">
          <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Brand Column */}
          <div className="app-footer-column app-footer-brand">
            <div className="app-footer-logo-section">
              <Link to="/" className="app-footer-logo">
                <span className="logo__dot"></span>
                <span className="logo__text">ViralMotion</span>
              </Link>
              <p className="app-footer-tagline">AI-Powered Video Editor for Everyone</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="app-footer-bottom">
          <p className="app-footer-copyright">© 2024 ViralMotion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
