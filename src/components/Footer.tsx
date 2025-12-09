import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden font-[Inter,-apple-system,BlinkMacSystemFont,sans-serif]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(102,126,234,0.9)] to-[rgba(118,75,162,0.9)] pointer-events-none"></div>

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto pt-16 pb-8 px-8 max-[480px]:pt-12 max-[480px]:pb-6 max-[480px]:px-6">
        {/* Columns Grid */}
        <div className="grid grid-cols-[repeat(4,1fr)_1.5fr] gap-8 mb-12 max-[1024px]:grid-cols-3 max-[1024px]:gap-y-8 max-[1024px]:gap-x-6 max-[768px]:grid-cols-2 max-[480px]:grid-cols-1 max-[480px]:gap-8 max-[480px]:text-center">
          {/* Features Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 max-[480px]:mb-4">Features</h4>
            <ul className="list-none p-0 m-0">
              {/* <li className="mb-3">
                <Link to="/templates" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Video Templates</Link>
              </li>
              <li className="mb-3">
                <Link to="/ai-tools" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">AI Tools</Link>
              </li>
              <li className="mb-3">
                <Link to="/downloader" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Video & Audio Downloader</Link>
              </li> */}
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Video Templates</Link>
              </li>
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">AI Tools</Link>
              </li>
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Video & Audio Downloader</Link>
              </li>
            </ul>
          </div>

          {/* Templates Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 max-[480px]:mb-4">Templates</h4>
            <ul className="list-none p-0 m-0">
              {/* <li className="mb-3">
                <Link to="/templates/fake-text-conversation" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Fake Text Conversation</Link>
              </li>
              <li className="mb-3">
                <Link to="/templates/relatable-quotes" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Relatable Quotes + Viral Sound</Link>
              </li>
              <li className="mb-3">
                <Link to="/templates/reaction-video" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Reaction Video</Link>
              </li>
              <li className="mb-3">
                <Link to="/templates/collage-edit" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Image / Video Collage Edit</Link>
              </li>
              <li className="mb-3">
                <Link to="/templates/ken-burns-carousel" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Ken Burns Carousel</Link>
              </li> */}
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Fake Text Conversation</Link>
              </li>
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Relatable Quotes + Viral Sound</Link>
              </li>
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Reaction Video</Link>
              </li>
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Image / Video Collage Edit</Link>
              </li>
              <li className="mb-3">
                <Link to="/login" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Ken Burns Carousel</Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 max-[480px]:mb-4">Resources</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-3">
                <Link to="/pricing" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Pricing</Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-5 max-[480px]:mb-4">Legal</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-3">
                <Link to="/privacy-policy" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Privacy Policy</Link>
              </li>
              <li className="mb-3">
                <Link to="/terms-of-service" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Terms of Service</Link>
              </li>
              <li className="mb-3">
                <Link to="/refund-policy" className="text-white/80 no-underline text-sm transition-colors duration-200 hover:text-white">Refund Policy</Link>
              </li>
            </ul>
          </div>

          {/* Brand Column */}
          <div className="flex flex-col items-end gap-5 max-[1024px]:col-span-full max-[1024px]:flex-row max-[1024px]:justify-between max-[1024px]:items-center max-[1024px]:pt-6 max-[1024px]:border-t max-[1024px]:border-[#f3f4f6] max-[1024px]:mt-4 max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-center">
            <div className="text-right max-[1024px]:text-left max-[768px]:text-center">
              <Link to="/" className="flex items-center gap-2 no-underline font-bold text-xl text-white justify-end mb-2 max-[1024px]:justify-start max-[768px]:justify-center">
                <span className="logo__dot"></span>
                <span className="logo__text">ViralMotion</span>
              </Link>
              <p className="text-white/80 text-[0.8rem] m-0">AI-Powered Video Editor for Everyone</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex justify-between items-center pt-8 border-t border-white/20 max-[768px]:flex-col max-[768px]:gap-4 max-[768px]:text-center">
          <p className="text-white/70 text-[0.8rem] m-0">© 2025 ViralMotion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
