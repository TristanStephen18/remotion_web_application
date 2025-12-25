import React, { useState } from "react";
import { TemplatePreviewDialog } from "../TemplatePreviewDialog";
import { ChooseTemplateModal } from "../../modals/ChooseTemplateModal";
import { FiPlus, FiLayers, FiZap } from "react-icons/fi";
import { templateCategories } from "../../../../data/DashboardCardsData";
import { TEMPLATES, TEMPLATE_NAME_TO_ID } from '../../../../utils/simpleTemplateRegistry';

// Get all templates for Discover Viralmotions section
const allViralMotions = Object.values(templateCategories).flat();

// Specific templates to show in Explore Templates section (in order)
const selectedTemplateNames = [
  "Split Screen",
  "Dancing People",
  "Quote Spotlight",
  "Fake Text Conversation",
  "Photo Collage",
  "Ken Burns Carousel",
  "Reddit Post Narration"
];

// Filter and order templates based on selectedTemplateNames
const discoverViralMotions = selectedTemplateNames
  .map((name) => allViralMotions.find((t) => t.name === name))
  .filter((t): t is (typeof allViralMotions)[number] => t !== undefined);

// Video item interface for carousel
interface VideoItem {
  name: string;
  description: string;
  url: string;
}

// Mock view counts for social proof
const templateViews: Record<string, string> = {
  "Split Screen": "12.5k",
  "Dancing People": "8.2k",
  "Quote Spotlight": "15.3k",
  "Fake Text Conversation": "6.1k",
  "Photo Collage": "9.7k",
  "Reddit Post Narration": "13.7k"
};

// Template durations
const getTemplateDuration = (templateName: string): string => {
  const templateId = TEMPLATE_NAME_TO_ID[templateName];
  if (!templateId) return "15s";
  
  const template = TEMPLATES[templateId];
  if (!template) return "15s";
  
  // Get default layers and calculate duration
  const layers = template.createDefaultLayers();
  const durationFrames = template.calculateDuration?.(layers) || 300;
  const durationSeconds = Math.round(durationFrames / 30); // 30fps
  
  return `${durationSeconds}s`;
};

// Pro Template Card for Explore Templates Grid
interface ProTemplateCardProps {
  name: string;
  description: string;
  url: string;
  onClick: () => void;
  className?: string;
}

const ProTemplateCard: React.FC<ProTemplateCardProps> = ({
  name,
  url,
  onClick,
  className = "",
}) => {
  const views = templateViews[name] || "1k";
  const duration = getTemplateDuration(name);

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-lg cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Background Image with Zoom Effect */}
      <img
        src={url}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient Overlay - Always visible for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />

      {/* Play Button - Appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <svg
            className="w-8 h-8 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Content at Bottom */}
      <div className="absolute bottom-0 left-0 p-2 sm:p-3 w-full">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-bold text-white mb-0.5 group-hover:text-purple-300 transition-colors duration-300">
          {name}
        </h3>

        {/* Social Proof Stats */}
        <div className="flex items-center text-slate-300 text-xs gap-2">
          {/* Views */}
          <span className="flex items-center gap-0.5">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {views}
          </span>
          {/* Duration */}
          <span className="flex items-center gap-0.5">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
};

// Explore Templates Grid Component - Bento Layout
interface ExploreTemplatesGridProps {
  items: VideoItem[];
  onItemClick: (name: string, description: string) => void;
  onViewAll?: () => void;
}

const ExploreTemplatesGrid: React.FC<ExploreTemplatesGridProps> = ({
  items,
  onItemClick,
}) => {
  const gridItems = items.slice(0, 7);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Explore Templates
        </h2>
      </div>

      {/* Horizontal Row with Alternating Vertical Offset Layout - All Cards Visible */}
      <div className="flex flex-wrap lg:flex-nowrap gap-2 md:gap-3 lg:gap-3 justify-center items-start">
        {gridItems.map((item, index) => (
          <div
            key={index}
            className={`
              w-[calc(50%-0.25rem)] sm:w-[calc(33.333%-0.4rem)] lg:flex-1 lg:max-w-[320px] xl:max-w-[360px]
              ${index % 2 === 0 ? "" : "mt-6 md:mt-8 lg:mt-12"}
              transition-all duration-300
            `}
            style={{ aspectRatio: "9/16" }}
          >
            <ProTemplateCard
              name={item.name}
              description={item.description}
              url={item.url}
              onClick={() => onItemClick(item.name, item.description)}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface Project {
  id: string;
  title: string;
  projectVidUrl: string;
}

interface Render {
  id: string;
  type: string;
  outputUrl: string;
  renderedAt?: string;
}

interface HomeSectionProps {
  projects?: Project[];
  renders?: Render[];
  search?: string;
  setSearch?: (value: string) => void;
  datasets?: any[];
  uploads?: any[];
  newProjectOpen?: boolean;
  setNewProjectOpen?: (value: boolean) => void;
  newProjectTab?: number;
  setNewProjectTab?: (value: number) => void;
  newProjectSearch?: string;
  setNewProjectSearch?: (value: string) => void;
  onNavigate?: (section: "templates" | "files" | "tools") => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  newProjectOpen = false,
  setNewProjectOpen,
  newProjectTab = 0,
  setNewProjectTab,
  newProjectSearch = "",
  setNewProjectSearch,
  onNavigate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  const handleOpenPreview = (template: string, description: string) => {
    setSelectedTemplate(template);
    setSelectedDescription(description);
  };

  const handleClosePreview = () => {
    setSelectedTemplate(null);
    setSelectedDescription("");
  };

  const handleYourDesignsClick = () => {
    if (onNavigate) {
      onNavigate("files");
    }
  };

  const handleToolsClick = () => {
    if (onNavigate) {
      onNavigate("tools");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* === Canva Glow Background - Applied to Entire Homepage === */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Aurora Glow Effect - Cyan/Teal Orb (Top Left) */}
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full
            bg-cyan-200 opacity-50 blur-[150px]"
        />
        {/* Aurora Glow Effect - Purple/Fuchsia Orb (Top Right) */}
        <div
          className="absolute -top-20 right-0 w-[450px] h-[450px] rounded-full
            bg-fuchsia-200 opacity-50 blur-[150px]"
        />
        {/* Aurora Glow Effect - Violet Orb (Center) */}
        <div
          className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full
            bg-violet-200 opacity-40 blur-[130px]"
        />
        {/* Aurora Glow Effect - Teal Orb (Bottom Left) */}
        <div
          className="absolute bottom-1/4 -left-20 w-[350px] h-[350px] rounded-full
            bg-teal-200 opacity-40 blur-[120px]"
        />
        {/* Aurora Glow Effect - Pink Orb (Bottom Right) */}
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full
            bg-pink-200 opacity-40 blur-[140px]"
        />
        {/* White base layer */}
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* === Main Content === */}
      <div className="relative z-10 w-full space-y-4 pb-0">
        {/* === Hero Section - Dynamic & Motion-Inspired === */}
        <div className="relative mx-1 sm:mx-2 lg:mx-3 min-h-[240px] sm:min-h-[280px] rounded-3xl overflow-hidden">
          {/* Layered Background with Depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950" />

          {/* Animated Gradient Orbs - Pulsing and Moving */}
          <div
            className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 blur-[80px]"
            style={{
              animation:
                "floatOrb1 15s ease-in-out infinite, pulseOrb 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 blur-[70px]"
            style={{
              animation:
                "floatOrb2 18s ease-in-out infinite, pulseOrb 3s ease-in-out infinite 1s",
            }}
          />
          <div
            className="absolute w-[200px] h-[200px] rounded-full bg-gradient-to-br from-violet-500 to-purple-600 blur-[60px]"
            style={{
              animation:
                "floatOrb3 20s ease-in-out infinite, pulseOrb 3s ease-in-out infinite 2s",
            }}
          />

          {/* Subtle Grid Pattern for Texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Motion Lines - Animated diagonal streaks */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div
              className="absolute top-[20%] w-[80%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rotate-[-15deg]"
              style={{
                animation: "motionLine1 4s ease-in-out infinite",
              }}
            />
            <div
              className="absolute top-[40%] w-[70%] h-[1.5px] bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent rotate-[-15deg]"
              style={{
                animation: "motionLine2 5s ease-in-out infinite",
                animationDelay: "1s",
              }}
            />
            <div
              className="absolute top-[60%] w-[90%] h-[1px] bg-gradient-to-r from-transparent via-violet-400/35 to-transparent rotate-[-15deg]"
              style={{
                animation: "motionLine3 6s ease-in-out infinite",
                animationDelay: "2s",
              }}
            />
          </div>

          {/* Keyframes for motion lines and gradient wave */}
          <style>{`
            @keyframes motionLine1 {
              0%, 100% {
                transform: translateX(100%) rotate(-15deg);
                opacity: 0;
              }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% {
                transform: translateX(-150%) rotate(-15deg);
                opacity: 0;
              }
            }
            @keyframes motionLine2 {
              0%, 100% {
                transform: translateX(120%) rotate(-15deg);
                opacity: 0;
              }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% {
                transform: translateX(-130%) rotate(-15deg);
                opacity: 0;
              }
            }
            @keyframes motionLine3 {
              0%, 100% {
                transform: translateX(80%) rotate(-15deg);
                opacity: 0;
              }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% {
                transform: translateX(-170%) rotate(-15deg);
                opacity: 0;
              }
            }
            @keyframes gradientWave {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes floatOrb1 {
              0% { top: -80px; left: -80px; }
              25% { top: 20px; left: 30%; }
              50% { top: -40px; left: 50%; }
              75% { top: 40px; left: 20%; }
              100% { top: -80px; left: -80px; }
            }
            @keyframes floatOrb2 {
              0% { top: 30%; right: -40px; }
              25% { top: 10%; right: 10%; }
              50% { top: 50%; right: 5%; }
              75% { top: 20%; right: 15%; }
              100% { top: 30%; right: -40px; }
            }
            @keyframes floatOrb3 {
              0% { bottom: -40px; left: 30%; }
              25% { bottom: 0px; left: 50%; }
              50% { bottom: -60px; left: 60%; }
              75% { bottom: 20px; left: 40%; }
              100% { bottom: -40px; left: 30%; }
            }
            @keyframes pulseOrb {
              0%, 100% { opacity: 0.25; scale: 1; }
              50% { opacity: 0.45; scale: 1.08; }
            }

            /* 3D Carousel CSS */
            .perspective-container {
              perspective: 800px;
            }
            .carousel-spinner {
              position: relative;
              width: 100%;
              height: 100%;
              transform-style: preserve-3d;
              animation: spinCarousel 20s infinite linear;
            }
            @keyframes spinCarousel {
              from { transform: rotateY(0deg); }
              to { transform: rotateY(-360deg); }
            }
            .carousel-item {
              position: absolute;
              top: 50%;
              left: 50%;
              margin-top: -4.5rem;
              margin-left: -2.5rem;
              backface-visibility: hidden;
            }
            .c-item-1 { transform: rotateY(0deg) translateZ(160px); }
            .c-item-2 { transform: rotateY(60deg) translateZ(160px); }
            .c-item-3 { transform: rotateY(120deg) translateZ(160px); }
            .c-item-4 { transform: rotateY(180deg) translateZ(160px); }
            .c-item-5 { transform: rotateY(240deg) translateZ(160px); }
            .c-item-6 { transform: rotateY(300deg) translateZ(160px); }
          `}</style>

          {/* Content Container - Two Column Layout */}
          <div className="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-16 py-8 sm:py-10">
            {/* Left Side - Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Eyebrow Text */}
              <p className="text-cyan-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
                Create. Animate. Inspire.
              </p>

              {/* Main Headline - Bold, Action-Oriented */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-3">
                Bring Your Ideas
                <br />
                <span
                  className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% 100%",
                    animation: "gradientWave 3s ease-in-out infinite",
                  }}
                >
                  Into Motion
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-6">
                Create stunning viral videos in minutes with AI-powered
                templates and one-click animations.
              </p>

              {/* CTA Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Primary CTA */}
                <button
                  onClick={() => setNewProjectOpen?.(true)}
                  className="group relative px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white
                    bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500
                    rounded-xl overflow-hidden
                    shadow-[0_0_30px_rgba(99,102,241,0.4)]
                    hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]
                    hover:scale-[1.02] active:scale-[0.98]
                    transition-all duration-300"
                >
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    <FiPlus className="text-base" />
                    Start Creating
                  </span>
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={handleYourDesignsClick}
                  className="px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white
                    bg-white/10 backdrop-blur-sm border border-white/20
                    rounded-xl hover:bg-white/20 hover:border-white/30
                    transition-all duration-300 flex items-center gap-2"
                >
                  <FiLayers className="text-sm" />
                  Your Projects
                </button>

                {/* AI Tools Button */}
                <button
                  onClick={handleToolsClick}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20
                    border border-violet-400/30 rounded-full hover:from-violet-500/30 hover:to-fuchsia-500/30
                    hover:border-violet-400/50 transition-all duration-300 cursor-pointer"
                >
                  <FiZap className="text-violet-400 text-sm" />
                  <span className="text-violet-300 text-xs font-medium">
                    AI Tools
                  </span>
                </button>
              </div>
            </div>

            {/* Right Side - 3D Floating Carousel */}
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center perspective-container overflow-visible">
              {/* Spinning Carousel */}
              <div className="carousel-spinner z-10 w-full h-full">
                {/* Card 1 */}
                <div className="carousel-item c-item-1 w-20 h-36 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/80 via-transparent to-blue-900/80 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="carousel-item c-item-2 w-20 h-36 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/80 via-transparent to-cyan-900/80 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="carousel-item c-item-3 w-20 h-36 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-transparent to-purple-900/80 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="carousel-item c-item-4 w-20 h-36 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/80 via-transparent to-blue-900/80 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card 5 */}
                <div className="carousel-item c-item-5 w-20 h-36 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/80 via-transparent to-cyan-900/80 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card 6 */}
                <div className="carousel-item c-item-6 w-20 h-36 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.3)] group">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-transparent to-purple-900/80 opacity-60"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white/70"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote - Below Carousel */}
            <p className="hidden lg:block absolute bottom-6 right-12 text-white/70 text-sm italic">
              "Creativity is intelligence having fun."
            </p>
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-2xl" />
          <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-white/10 rounded-bl-2xl" />
        </div>

        {/* === Existing Content Below Hero === */}
        <div className="px-8 sm:px-12 lg:px-16 space-y-5">
          <TemplatePreviewDialog
            open={!!selectedTemplate}
            onClose={handleClosePreview}
            selectedTemplate={selectedTemplate}
            selectedDescription={selectedDescription}
          />

          {/* === AI Tools Section === */}
          <div className="mb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-slate-800">Our Tools</h3>
            </div>

            {/* AI Tools Horizontal Carousel */}
            <div className="relative group/carousel">
              {/* Previous Arrow Button (LEFT) */}
              <button
                onClick={(e) => {
                  const scrollContainer = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  scrollContainer?.scrollBy({ left: -300, behavior: "smooth" });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-slate-50 z-10"
              >
                <svg
                  className="w-6 h-6 text-slate-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Scrollable Container */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                {/* AI Background Remover - Transparency Grid Design */}
                <div
                  onClick={handleToolsClick}
                  className="relative h-32 w-56 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Checkerboard Pattern Background */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
              linear-gradient(45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(-45deg, #1a1a2e 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #1a1a2e 75%),
              linear-gradient(-45deg, transparent 75%, #1a1a2e 75%)
            `,
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                      backgroundColor: "#0f0f1a",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-pink-900/40" />
                  {/* Glowing Shape */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-60 blur-2xl group-hover:opacity-80 transition-opacity duration-500" />
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {/* Popular Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="px-2 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg">
                      Popular
                    </span>
                  </div>
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-lg mb-1.5 shadow-2xl group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-0.5">
                      Image Generator (AI)
                    </h3>
                    <p className="text-white/60 text-[10px]">
                      Create Al images and remove backgrounds automatically
                    </p>
                  </div>
                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border border-purple-500/30 group-hover:border-purple-400/50 transition-colors duration-300" />
                </div>

                {/* VEO3 Video Generator - Neon Waveform Design */}
                <div
                  onClick={handleToolsClick}
                  className="relative h-32 w-56 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 bg-slate-900"
                >
                  {/* Dark Gradient Base */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                  {/* Animated Blobs */}
                  <div className="absolute top-0 -left-4 w-48 h-48 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
                  <div
                    className="absolute top-0 -right-4 w-48 h-48 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  />
                  <div
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDelay: "2s" }}
                  />
                  {/* New Badge */}
                  <div className="absolute top-2 left-2 z-10 flex gap-2">
                    <span className="px-2 py-1 text-[10px] font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-full shadow-lg">
                      New
                    </span>
                  </div>
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center z-10">
                    {/* Play Button */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2 rounded-full mb-1.5 shadow-2xl group-hover:scale-110 group-hover:bg-white/15 transition-all duration-300">
                      <svg
                        className="w-5 h-5 text-white ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-0.5">
                      Video Generator (AI)
                    </h3>
                    <p className="text-white/60 text-[10px]">
                      Generate videos automatically from text or prompts.
                    </p>
                  </div>
                  {/* Waveform Bars */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-0.5 z-10">
                    <div className="w-1 h-2.5 bg-gradient-to-t from-pink-500 to-pink-400 rounded-full animate-pulse" />
                    <div
                      className="w-1 h-5 bg-gradient-to-t from-purple-500 to-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-1 h-3 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-1 h-6 bg-gradient-to-t from-pink-500 to-pink-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    />
                    <div
                      className="w-1 h-4 bg-gradient-to-t from-purple-500 to-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div
                      className="w-1 h-2 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                    <div
                      className="w-1 h-4.5 bg-gradient-to-t from-pink-500 to-pink-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    />
                    <div
                      className="w-1 h-2.5 bg-gradient-to-t from-purple-500 to-purple-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.7s" }}
                    />
                    <div
                      className="w-1 h-5.5 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.8s" }}
                    />
                    <div
                      className="w-1 h-3 bg-gradient-to-t from-pink-500 to-pink-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.9s" }}
                    />
                  </div>
                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border border-pink-500/30 group-hover:border-pink-400/50 transition-colors duration-300" />
                </div>

                {/* Coming Soon Tool 1: YouTube Video Downloader */}
                <div className="relative h-32 w-56 flex-shrink-0 rounded-xl overflow-hidden group bg-slate-900/80 backdrop-blur-sm">
                  {/* Subtle Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20" />
                  {/* Lock Icon and Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-lg mb-1.5">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-300 mb-0.5">
                      Video Downloader
                    </h3>
                    <p className="text-slate-500 text-[10px] mb-1.5">
                      Download videos from Youtube
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full uppercase tracking-wider shadow-lg">
                      Coming Soon
                    </span>
                  </div>
                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-slate-700/50" />
                </div>

                {/* Coming Soon Tool 2: Smart Captions */}
                <div className="relative h-32 w-56 flex-shrink-0 rounded-xl overflow-hidden group bg-slate-900/80 backdrop-blur-sm">
                  {/* Subtle Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20" />
                  {/* Lock Icon and Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-lg mb-1.5">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-300 mb-0.5">
                      Smart Captions
                    </h3>
                    <p className="text-slate-500 text-[10px] mb-1.5">
                      Auto-generate editable subtitles
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full uppercase tracking-wider shadow-lg">
                      Coming Soon
                    </span>
                  </div>
                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-slate-700/50" />
                </div>

                {/* Coming Soon Tool 3: AI Story Narrator */}
                <div className="relative h-32 w-56 flex-shrink-0 rounded-xl overflow-hidden group bg-slate-900/80 backdrop-blur-sm">
                  {/* Subtle Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-violet-900/20" />
                  {/* Lock Icon and Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-lg mb-1.5">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-300 mb-0.5">
                      AI Story Narrator
                    </h3>
                    <p className="text-slate-500 text-[10px] mb-1.5">
                      Convert text to speech or modify voices
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full uppercase tracking-wider shadow-lg">
                      Coming Soon
                    </span>
                  </div>
                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-slate-700/50" />
                </div>

                {/* Coming Soon Tool 4: Voice Studio */}
                <div className="relative h-32 w-56 flex-shrink-0 rounded-xl overflow-hidden group bg-slate-900/80 backdrop-blur-sm">
                  {/* Subtle Grid Pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/20" />
                  {/* Lock Icon and Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                    <div className="bg-white/5 border border-white/10 p-2 rounded-lg mb-1.5">
                      <svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-300 mb-0.5">
                      Voice Studio
                    </h3>
                    <p className="text-slate-500 text-[10px] mb-1.5">
                      Transform recordings into different voice styles
                    </p>
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full uppercase tracking-wider shadow-lg">
                      Coming Soon
                    </span>
                  </div>

                  
                  
                  {/* Border */}
                  <div className="absolute inset-0 rounded-2xl border border-slate-700/50" />
                </div>

                
              </div>

              

              {/* Next Arrow Button (RIGHT) */}
              <button
                onClick={(e) => {
                  const scrollContainer = e.currentTarget
                    .previousElementSibling as HTMLElement;
                  scrollContainer?.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-slate-50 z-10"
              >
                <svg
                  className="w-6 h-6 text-slate-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* === Explore Templates Section === */}
          <ExploreTemplatesGrid
            items={discoverViralMotions}
            onItemClick={handleOpenPreview}
            onViewAll={() => setNewProjectOpen?.(true)}
          />

          {/* Recently Created Templates */}
          {/* {projects.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Recently Created Templates
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Your most recent template projects, ready to edit or share.
              </p>
              <ShowcaseCarousel items={projects.slice(0, 5)} type="project" />
            </div>
          )} */}

          {/* Recently Rendered Videos */}
          {/* {renders.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Recently Rendered Videos
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Your latest video renders, ready to watch or download.
              </p>
              <ShowcaseCarousel items={renders.slice(0, 5)} type="render" />
            </div>
          )} */}
        </div>
      </div>

      {/* Choose Template Modal */}
      <ChooseTemplateModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen?.(false)}
        newProjectTab={newProjectTab}
        setNewProjectTab={setNewProjectTab || (() => {})}
        newProjectSearch={newProjectSearch}
        setNewProjectSearch={setNewProjectSearch || (() => {})}
      />
    </div>
  );
};
