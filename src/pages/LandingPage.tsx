// import React, { useState, useRef, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './css/LandingPage.css';
// import '../assets/Logo.css';
// import { templateCategories } from '../data/DashboardCardsData';

// interface Avatar {
//   id: number;
//   icon: React.ReactNode;
//   gradient: string;
//   className: string;
//   hasVerified?: boolean;
//   badge?: string;
// }

// interface Feature {
//   icon: React.ReactNode;
//   iconBg: string;
//   title: string;
//   description: string;
// }

// interface Stat {
//   value: string;
//   label: string;
// }

// interface Template {
//   name: string;
//   description: string;
//   url: string;
// }


// const ViralMotionLanding: React.FC = () => {
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
//   const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
//   const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const toggleFaq = (index: number) => {
//     setOpenFaqIndex(openFaqIndex === index ? null : index);
//   };

//   // Sample video URLs for the preview carousel
//   const previewVideos = [
//     'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/QuoteSpotlight_jn0iya.mp4',
//     'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4',
//     'https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441913/CardFlip_no4k2t.mp4',
//     'https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4',
//   ];

//   // Handle video end - advance to next video
//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prev) => (prev + 1) % previewVideos.length);
//   };

//   // Play video when index changes
//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.load();
//       videoRef.current.play().catch(() => {
//         // Autoplay may be blocked, that's okay
//       });
//     }
//   }, [currentVideoIndex]);

//   const steps = [
//     {
//       number: '01',
//       title: 'Create Your Account',
//       description: 'Sign up for free in seconds. No credit card required to get started.',
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//           <circle cx="12" cy="7" r="4" />
//         </svg>
//       ),
//     },
//     {
//       number: '02',
//       title: 'Choose a Template',
//       description: 'Browse our library of 50+ professionally designed video templates for any content style.',
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <rect x="3" y="3" width="18" height="18" rx="2" />
//           <path d="M3 9h18" />
//           <path d="M9 21V9" />
//         </svg>
//       ),
//     },
//     {
//       number: '03',
//       title: 'Customize Your Content',
//       description: 'Add your text, images, and videos. Adjust colors, fonts, and animations to match your brand.',
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path d="M12 20h9" />
//           <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
//         </svg>
//       ),
//     },
//     {
//       number: '04',
//       title: 'Export & Share',
//       description: 'Render your video in high quality and share directly to TikTok, Instagram, or YouTube.',
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
//           <polyline points="16 6 12 2 8 6" />
//           <line x1="12" y1="2" x2="12" y2="15" />
//         </svg>
//       ),
//     },
//   ];

//   const abouts = [
//     {
//       title: 'No Design Skills Required',
//       description: 'Our templates are designed to be easy to use. Just add your content and you\'re ready to go.',
//     },
//     {
//       title: 'AI-Powered Tools',
//       description: 'Use AI to generate captions, voiceovers, and even suggest content ideas for your videos.',
//     },
//     {
//       title: 'Cloud-Based Editor',
//       description: 'Access your projects from anywhere. No software to install, everything works in your browser.',
//     },
//     {
//       title: 'Fast Rendering',
//       description: 'Export your videos quickly with our optimized cloud rendering infrastructure.',
//     },
//   ];

//   const faqs = [
//     {
//       question: 'Is ViralMotion free to use?',
//       answer: 'Yes! You can start creating videos for free. We offer a generous free tier with access to basic templates and features. Premium plans unlock additional templates, AI tools, and faster rendering.',
//     },
//     {
//       question: 'What video formats can I export?',
//       answer: 'ViralMotion exports videos in MP4 format, optimized for social media platforms. You can choose from various resolutions including 1080x1920 (9:16) for TikTok/Reels, 1080x1080 (1:1) for Instagram, and 1920x1080 (16:9) for YouTube.',
//     },
//     {
//       question: 'Can I use my own images and videos?',
//       answer: 'Absolutely! You can upload your own media files to use in your videos. We support most common image and video formats.',
//     },
//     {
//       question: 'Do I need any video editing experience?',
//       answer: 'Not at all! ViralMotion is designed for beginners and pros alike. Our templates are pre-built with professional animations - just add your content and export. No technical skills required.',
//     },
//     {
//       question: 'Can I cancel my subscription anytime?',
//       answer: 'Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period. No hidden fees or cancellation charges.',
//     },
//     {
//       question: 'Can I use the videos for commercial purposes?',
//       answer: 'Yes! All videos you create with ViralMotion are yours to use commercially. This includes using them for client work, marketing campaigns, and monetized social media accounts.',
//     },
//     {
//       question: 'Is there a limit on how many videos I can create?',
//       answer: 'Free users can create and export a limited number of videos per month. Premium plans offer unlimited video creation and exports, perfect for content creators and businesses with high-volume needs.',
//     },
//   ];

//   // Dropdown items
//   const featureItems = [
//     { name: 'Video Templates', path: '/templates' },
//     { name: 'AI Tools', path: '/ai-tools' },
//     { name: 'Video & Audio Downloader', path: '/downloader' },
//   ];

//   const templateItems = [
//     { name: 'Fake Text Conversation', path: '/templates/fake-text-conversation' },
//     { name: 'Relatable Quotes + Viral Sound', path: '/templates/relatable-quotes' },
//     { name: 'Reaction Video', path: '/templates/reaction-video' },
//     { name: 'Image / Video Collage Edit', path: '/templates/collage-edit' },
//     { name: 'Ken Burns Carousel', path: '/templates/ken-burns-carousel' },
//   ];

//   const getFilteredTemplates = (): Template[] => {
//     // Get 1 template from each category to show variety
//     return [
//       templateCategories.Text[0],
//       templateCategories.Analytics[0],
//       templateCategories.Layout[0],
//       templateCategories.Voiceovers[0],
//     ];
//   };
//    const avatars: Avatar[] = [
//     {
//       id: 1,
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//           <polygon points="5 3 19 12 5 21 5 3" />
//         </svg>
//       ),
//       gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
//       className: 'landing-avatar-1',
//       hasVerified: true,
//     },
//     {
//       id: 2,
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
//           <circle cx="12" cy="13" r="4" />
//         </svg>
//       ),
//       gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
//       className: 'landing-avatar-2',
//     },
//     {
//       id: 3,
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//         </svg>
//       ),
//       gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
//       className: 'landing-avatar-3',
//       badge: '🔥',
//     },
//     {
//       id: 4,
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//           <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//         </svg>
//       ),
//       gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
//       className: 'landing-avatar-4',
//     },
//     {
//       id: 5,
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
//           <circle cx="12" cy="12" r="10" />
//           <line x1="2" y1="12" x2="22" y2="12" />
//           <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
//         </svg>
//       ),
//       gradient: 'linear-gradient(135deg, #10b981, #34d399)',
//       className: 'landing-avatar-5',
//       badge: '✨',
//     },
//   ];

//   const stats: Stat[] = [
//     { value: '10K+', label: 'Active Users' },
//     { value: '50+', label: 'Templates' },
//     { value: '1M+', label: 'Videos Created' },
//   ];

//   const features: Feature[] = [
//     {
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <rect x="2" y="2" width="20" height="20" rx="2" />
//           <path d="M7 2v20" />
//           <path d="M17 2v20" />
//           <path d="M2 12h20" />
//           <path d="M2 7h5" />
//           <path d="M2 17h5" />
//           <path d="M17 7h5" />
//           <path d="M17 17h5" />
//         </svg>
//       ),
//       iconBg: 'landing-bg-cyan',
//       title: 'Video Templates',
//       description: 'Choose from 50+ professionally designed templates optimized for TikTok, Instagram Reels, and YouTube Shorts.',
//     },
//     {
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path d="M12 2a4 4 0 0 1 4 4v4a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
//           <path d="M16 10v1a4 4 0 0 1-8 0v-1" />
//           <circle cx="12" cy="12" r="10" />
//           <path d="M8 14s1.5 2 4 2 4-2 4-2" />
//           <line x1="9" y1="9" x2="9.01" y2="9" />
//           <line x1="15" y1="9" x2="15.01" y2="9" />
//         </svg>
//       ),
//       iconBg: 'landing-bg-purple',
//       title: 'AI Tools',
//       description: 'Powerful AI-powered tools for auto-captions, voiceovers, background removal, and smart video editing.',
//     },
//     {
//       icon: (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//           <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//           <polyline points="7 10 12 15 17 10" />
//           <line x1="12" y1="15" x2="12" y2="3" />
//         </svg>
//       ),
//       iconBg: 'landing-bg-pink',
//       title: 'Video & Audio Downloader',
//       description: 'Download videos and audio from popular platforms. Save content for offline use or repurpose for your projects.',
//     },
//   ];

  

//   return (
//     <div className="landing-viral-motion">
//       {/* Navigation */}
//       <nav className="landing-nav">
//         <div className="landing-nav-container">
//           <Link to="/" className="landing-logo">
//             <span className="logo__dot"></span>
//             <span className="logo__text">ViralMotion</span>
//           </Link>
//           <div className="landing-nav-links">
//             {/* Features Dropdown */}
//             <div
//               className="landing-nav-dropdown"
//               onMouseEnter={() => setFeaturesDropdownOpen(true)}
//               onMouseLeave={() => setFeaturesDropdownOpen(false)}
//             >
//               <button className="landing-nav-dropdown-trigger">
//                 Features
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M6 9l6 6 6-6" />
//                 </svg>
//               </button>
//               {featuresDropdownOpen && (
//                 <div className="landing-nav-dropdown-menu">
//                   {featureItems.map((item) => (
//                     <Link
//                       key={item.name}
//                       to={item.path}
//                       className="landing-nav-dropdown-item"
//                     >
//                       {item.name}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Templates Dropdown */}
//             <div
//               className="landing-nav-dropdown"
//               onMouseEnter={() => setTemplatesDropdownOpen(true)}
//               onMouseLeave={() => setTemplatesDropdownOpen(false)}
//             >
//               <button className="landing-nav-dropdown-trigger">
//                 Templates
//                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M6 9l6 6 6-6" />
//                 </svg>
//               </button>
//               {templatesDropdownOpen && (
//                 <div className="landing-nav-dropdown-menu">
//                   {templateItems.map((item) => (
//                     <Link
//                       key={item.name}
//                       to={item.path}
//                       className="landing-nav-dropdown-item"
//                     >
//                       {item.name}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <Link to="/pricing">Pricing</Link>
//           </div>
//           <Link to="/login" className="landing-btn-get-started">Login</Link>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="landing-hero">
//         <div className="landing-hero-container">
//           <div className="landing-hero-content">
//             <div className="landing-hero-badge">
//               <span>AI-Powered Video Creation</span>
//             </div>
//             <h1>
//               Create <span className="landing-text-gradient">Viral Videos </span>in Seconds
//             </h1>
//             <p>
//               Transform your ideas into stunning short-form videos with our AI-powered
//               templates. Perfect for TikTok, Instagram Reels, and YouTube Shorts.
//             </p>
//             <div className="landing-hero-buttons">
//               <a href="/get-started" className="landing-btn-primary">
//                 Start Creating Free
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <path d="M5 12h14M12 5l7 7-7 7" />
//                 </svg>
//               </a>
//             </div>
//             <div className="landing-hero-stats">
//               {stats.map((stat) => (
//                 <div key={stat.label} className="landing-stat">
//                   <span className="landing-stat-value">{stat.value}</span>
//                   <span className="landing-stat-label">{stat.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Video Container with Floating Avatars */}
//           <div className="landing-hero-visual">
//             <div className="landing-video-container">
//               {/* Floating Avatars */}
//               <div className="landing-avatars-wrapper">
//                 {avatars.map((avatar) => (
//                   <div
//                     key={avatar.id}
//                     className={`landing-avatar ${avatar.className}`}
//                     style={{ background: avatar.gradient }}
//                   >
//                     {avatar.icon}
//                     {avatar.hasVerified && (
//                       <div className="landing-verified-badge">
//                         <svg viewBox="0 0 24 24">
//                           <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
//                         </svg>
//                       </div>
//                     )}
//                     {avatar.badge && <div className="landing-avatar-badge">{avatar.badge}</div>}
//                   </div>
//                 ))}
//               </div>

//               {/* Sparkle decoration */}
//               <div className="landing-sparkle-icon">✦</div>

//               {/* Video Preview Card */}
//               <div className="landing-video-card">
//                 <div className="landing-video-preview">
//                   <video
//                     ref={videoRef}
//                     src={previewVideos[currentVideoIndex]}
//                     autoPlay
//                     muted
//                     playsInline
//                     onEnded={handleVideoEnd}
//                     className="landing-preview-video"
//                   />
//                 </div>
//                 <div className="landing-video-dots">
//                   {previewVideos.map((_, index) => (
//                     <span
//                       key={index}
//                       className={`landing-dot ${index === currentVideoIndex ? 'active' : ''}`}
//                       onClick={() => setCurrentVideoIndex(index)}
//                     ></span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="landing-features" id="features">
//         <div className="landing-features-container">
//           <div className="landing-features-badge">Features</div>
//           <h2>Everything You Need to Go Viral</h2>
//           <p className="landing-features-subtitle">Powerful tools designed for creators</p>

//           <div className="landing-features-grid">
//             {features.map((feature) => (
//               <div
//                 key={feature.title}
//                 className="landing-feature-card"
//               >
//                 <div className={`landing-feature-icon ${feature.iconBg}`}>
//                   {feature.icon}
//                 </div>
//                 <h3>{feature.title}</h3>
//                 <p>{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Templates Section */}
//       <section className="landing-templates" id="templates">
//         <div className="landing-templates-container">
//           <div className="landing-features-badge">Templates</div>
//           <h2>Ready-to-Use Video Templates</h2>
//           <p className="landing-features-subtitle">Choose from our collection of professionally designed templates</p>

//           {/* Templates Grid */}
//           <div className="landing-templates-grid">
//             {getFilteredTemplates().map((template) => (
//               <div key={template.name} className="landing-template-card">
//                 <div className="landing-template-preview">
//                   <img
//                     src={template.url}
//                     alt={template.name}
//                     loading="lazy"
//                   />
//                   <div className="landing-template-overlay">
//                     <a href="/login" className="landing-btn-try">Try Template</a>
//                   </div>
//                 </div>
//                 <div className="landing-template-info">
//                   <h3>{template.name}</h3>
//                   <p>{template.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Steps Section */}
//       <section className="landing-steps">
//         <div className="landing-steps-container">
//         <div className="landing-features-badge">Steps</div>
//           <h2>How It Works</h2>
//           <p className="landing-subtitle">Get from idea to viral video in 4 simple steps</p>

//           <div className="landing-steps-timeline">
//             {steps.map((step, index) => (
//               <div key={step.number} className="landing-step-item">
//                 <div className="landing-step-left">
//                   <div className="landing-step-number-circle">{step.number}</div>
//                   {index < steps.length - 1 && <div className="landing-step-line"></div>}
//                 </div>
//                 <div className="landing-step-content">
//                   <div className="landing-step-icon">{step.icon}</div>
//                   <div className="landing-step-text">
//                     <h3>{step.title}</h3>
//                     <p>{step.description}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="landing-abouts">
//         <div className="landing-abouts-container">
//         <div className="landing-features-badge">About</div>
//           <h2>Why Choose ViralMotion?</h2>
//           <p className="landing-subtitle">Everything you need to create content that stands out</p>

//           <div className="landing-abouts-grid">
//             {abouts.map((about) => (
//               <div key={about.title} className="landing-about-card">
//                 <h3>{about.title}</h3>
//                 <p>{about.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="landing-faq">
//         <div className="landing-faq-container">
//         <div className="landing-features-badge">FAQ</div>
//           <h2>Frequently Asked Questions</h2>
//           <p className="landing-subtitle">Got questions? We've got answers</p>

//           <div className="landing-faq-list">
//             {faqs.map((faq, index) => (
//               <div
//                 key={faq.question}
//                 className={`landing-faq-item ${openFaqIndex === index ? 'open' : ''}`}
//               >
//                 <button
//                   className="landing-faq-question"
//                   onClick={() => toggleFaq(index)}
//                 >
//                   <span>{faq.question}</span>
//                   <svg
//                     width="20"
//                     height="20"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     className="landing-faq-icon"
//                   >
//                     <path d="M6 9l6 6 6-6" />
//                   </svg>
//                 </button>
//                 <div className="landing-faq-answer">
//                   <p>{faq.answer}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="landing-cta">
//         <div className="landing-cta-container">
//           <div className="landing-cta-card">
//             <h2>
//               Ready to Create <span className="landing-text-gradient">Viral Content</span>?
//             </h2>
//             <p>
//               Join thousands of creators who are already using ViralMotion to grow their audience.
//             </p>
//             <div className="landing-cta-buttons">
//               <Link to="/signup" className="landing-btn-primary">Start Free Trial</Link>
//               <Link to="/pricing" className="landing-btn-outline">View Pricing</Link>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ViralMotionLanding;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentGifIndex, setCurrentGifIndex] = useState(0);

  // 🎯 REPLACE THESE WITH YOUR CLOUDINARY GIF URLS
  const showcaseGifs = [
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763462261/2ad1296b-c166-43a7-9eb1-502e09bcfba7_rcdrjg.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763458547/ba1676dd-5925-4702-bc2a-5168da46fae3_vpg5p3.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763455882/NeonFlickerTitle_un2ykp.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457721/fa06d6f0-6fcd-4158-b461-bcbbcdbe1bd2_pzbe8z.gif',
    'https://res.cloudinary.com/dcu9xuof0/image/upload/v1763458547/ba1676dd-5925-4702-bc2a-5168da46fae3_vpg5p3.gif',
  ];

  // Auto-rotate GIFs every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGifIndex((prev) => (prev + 1) % showcaseGifs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [showcaseGifs.length]);

  const nextGif = () => {
    setCurrentGifIndex((prev) => (prev + 1) % showcaseGifs.length);
  };

  const prevGif = () => {
    setCurrentGifIndex((prev) => (prev - 1 + showcaseGifs.length) % showcaseGifs.length);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={20} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                ViralMotion
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-violet-600 transition font-medium">Features</a>
              <a href="#templates" className="text-gray-600 hover:text-violet-600 transition font-medium">Templates</a>
              <a href="#pricing" className="text-gray-600 hover:text-violet-600 transition font-medium">Pricing</a>
              <button onClick={() => navigate('/login')} className="text-gray-600 hover:text-violet-600 transition font-medium">
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-violet-600 transition font-medium">Features</a>
            <a href="#templates" className="block text-gray-600 hover:text-violet-600 transition font-medium">Templates</a>
            <a href="#pricing" className="block text-gray-600 hover:text-violet-600 transition font-medium">Pricing</a>
            <button onClick={() => navigate('/login')} className="block w-full text-left text-gray-600 hover:text-violet-600 transition font-medium">
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="block w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg text-center"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="text-center md:text-left space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold border border-violet-200">
                🚀 AI-Powered Video Creation
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Create
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                {' '}Viral Videos{' '}
              </span>
              in Seconds
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Transform your ideas into stunning TikTok-style animations with AI-powered templates. No design skills required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => navigate('/signup')}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Creating Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
              <button className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-violet-300 hover:text-violet-600 transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                <div className="text-sm text-gray-600 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-gray-600 mt-1">Templates</div>
              </div>
              <div>
                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">1M+</div>
                <div className="text-sm text-gray-600 mt-1">Videos Created</div>
              </div>
            </div>
          </div>

          {/* Right Content - GIF Carousel */}
          <div className="relative">
            <div className="relative animate-float">
              {/* Main Preview Card with GIF Carousel */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/50">
                <div className="bg-black rounded-2xl h-96 relative overflow-hidden group">
                  {/* GIF Display */}
                  <img
                    key={currentGifIndex}
                    src={showcaseGifs[currentGifIndex]}
                    alt={`Template showcase ${currentGifIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Navigation Arrows */}
                    <button
                      onClick={prevGif}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      <ChevronLeft className="text-white" size={24} />
                    </button>
                    <button
                      onClick={nextGif}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                      <ChevronRight className="text-white" size={24} />
                    </button>

                    {/* Bottom Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-semibold">
                          Template Preview {currentGifIndex + 1}/{showcaseGifs.length}
                        </span>
                        <button 
                          onClick={() => navigate('/signup')}
                          className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/30 transition"
                        >
                          Use This
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {showcaseGifs.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentGifIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentGifIndex
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/75 w-2'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                <span className="text-3xl">✨</span>
              </div>
              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                <span className="text-3xl">🎬</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold border border-violet-200">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-4">Everything You Need to Go Viral</h2>
            <p className="text-xl text-gray-600">Powerful tools designed for creators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎨',
                gradient: 'from-blue-500 to-cyan-500',
                title: 'AI-Powered Templates',
                desc: 'Choose from 50+ professionally designed templates optimized for social media engagement.'
              },
              {
                icon: '⚡',
                gradient: 'from-green-500 to-emerald-500',
                title: 'Instant Rendering',
                desc: 'Generate high-quality videos in minutes with our powerful cloud rendering engine.'
              },
              {
                icon: '🎭',
                gradient: 'from-purple-500 to-pink-500',
                title: 'Custom Branding',
                desc: 'Upload your logos, use custom fonts, and maintain brand consistency across all videos.'
              },
              {
                icon: '📊',
                gradient: 'from-orange-500 to-red-500',
                title: 'Analytics Dashboard',
                desc: 'Track performance and optimize your content with detailed analytics and insights.'
              },
              {
                icon: '🔄',
                gradient: 'from-indigo-500 to-blue-500',
                title: 'Batch Processing',
                desc: 'Create multiple video variations at once with our intelligent batch rendering system.'
              },
              {
                icon: '📤',
                gradient: 'from-pink-500 to-rose-500',
                title: 'Easy Sharing',
                desc: 'Export directly to TikTok, Instagram, YouTube and more with optimized formats.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="group bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10"></div>
            
            <div className="relative z-10 text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Create
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {' '}Viral Content?
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of creators who are already using ViralMotion to grow their audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all"
                >
                  Start Free Trial
                </button>
                <button className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-violet-300 hover:text-violet-600 transition-all">
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              ViralMotion
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">© 2024 ViralMotion. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};


