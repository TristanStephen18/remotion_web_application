import React, { useState, useRef } from "react";
import { TemplatesSection } from "./TemplatesSection";
import { TemplatePreviewDialog } from "../TemplatePreviewDialog";
import { ShowcaseCarousel } from "../../ShowcaseCarousel";
import { ChooseTemplateModal } from "../../modals/ChooseTemplateModal";
import { FiPlus, FiLayers, FiGrid, FiZap, FiPlay, FiChevronRight } from "react-icons/fi";
import { templateCategories } from "../../../../data/DashboardCardsData";

// Shuffle function to randomize array order
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get all templates for Discover Viralmotions section
const allViralMotions = Object.values(templateCategories).flat();

// Create shuffled versions for each section (different random order)
const discoverViralMotions = shuffleArray(allViralMotions);
const trendingViralMotions = shuffleArray(allViralMotions);

// Video item interface for carousel
interface VideoItem {
  name: string;
  description: string;
  url: string;
}

// Reusable ViralMotion Card Component
interface ViralMotionCardProps {
  name: string;
  description: string;
  url: string;
  onClick: () => void;
}

const ViralMotionCard: React.FC<ViralMotionCardProps> = ({ name, url, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative min-w-[280px] sm:min-w-[300px] aspect-video rounded-xl overflow-hidden cursor-pointer group flex-shrink-0"
    >
      {/* Background Image (GIF) */}
      <img
        src={url}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      {/* Play Button - appears on hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
          <FiPlay className="text-white text-2xl ml-1" />
        </div>
      </div>
      {/* Title */}
      <div className="absolute bottom-3 left-3 right-3">
        <h4 className="text-white font-medium text-sm sm:text-base truncate">{name}</h4>
      </div>
    </div>
  );
};

// Reusable Video Carousel Component
interface VideoCarouselProps {
  title: string;
  items: VideoItem[];
  onItemClick: (name: string, description: string) => void;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ title, items, onItemClick }) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-1xl sm:text-2xl font-bold text-gray-900">
        {title}
      </h2>
      {/* Horizontal Scrolling Carousel */}
      <div className="relative flex items-center">
        {/* Scrollable Container */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide pr-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <ViralMotionCard
              key={item.name}
              name={item.name}
              description={item.description}
              url={item.url}
              onClick={() => onItemClick(item.name, item.description)}
            />
          ))}
        </div>
        {/* Navigation Arrow - Fixed on right */}
        <button
          onClick={handleScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200
            flex items-center justify-center transition-all duration-300
            hover:shadow-md hover:scale-105 z-10"
        >
          <FiChevronRight className="text-gray-600 text-xl" />
        </button>
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
  onNavigate?: (section: "templates" | "files") => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  projects = [],
  renders = [],
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

  const handleTemplatesClick = () => {
    if (onNavigate) {
      onNavigate("templates");
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
      <div className="relative z-10 w-full space-y-12">
        {/* === Hero Section === */}
        <div className="relative w-[calc(100%+1.5rem)] sm:w-full -mx-3 sm:mx-0 h-[220px] sm:h-[280px] flex flex-col items-center justify-center px-0 sm:px-4 overflow-hidden">
          {/* Stronger Glow Effects for Hero Emphasis */}
          <div
            className="absolute -top-16 sm:-top-20 -left-16 sm:-left-10 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full
              bg-cyan-300 opacity-40 sm:opacity-70 blur-[80px] sm:blur-[100px] pointer-events-none"
          />
          <div
            className="absolute -top-10 sm:-top-10 -right-10 sm:right-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full
              bg-fuchsia-300 opacity-40 sm:opacity-70 blur-[80px] sm:blur-[100px] pointer-events-none"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] rounded-full
              bg-violet-300 opacity-30 sm:opacity-50 blur-[100px] sm:blur-[120px] pointer-events-none"
          />

          {/* Hero Heading */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            What will you create today?
          </h1>

          {/* Main "New" Button */}
          <button
            onClick={() => setNewProjectOpen?.(true)}
            className="z-10 sm:z-auto mb-3 sm:mb-5 px-6 py-2.5 sm:px-10 sm:py-4 text-base sm:text-xl font-bold text-white
              bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-sky-500
              rounded-full shadow-[0_4px_20px_rgba(99,102,241,0.4)]
              hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]
              hover:scale-105 active:scale-[0.98]
              transition-all duration-300 flex items-center gap-2 sm:gap-3"
          >
            <FiPlus className="text-lg sm:text-2xl" />
            New
          </button>

          {/* Secondary Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
            {/* Your Designs Button */}
            <button
              onClick={handleYourDesignsClick}
              className="px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-semibold text-gray-700
                bg-white/70 backdrop-blur-xl border border-gray-200
                rounded-full hover:bg-white hover:border-gray-300
                hover:shadow-md
                transition-all duration-300 flex items-center gap-1 sm:gap-1.5"
            >
              <FiLayers className="text-xs sm:text-sm" />
              Your Designs
            </button>

            {/* Templates Button */}
            <button
              onClick={handleTemplatesClick}
              className="px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-semibold text-gray-700
                bg-white/70 backdrop-blur-xl border border-gray-200
                rounded-full hover:bg-white hover:border-gray-300
                hover:shadow-md
                transition-all duration-300 flex items-center gap-1 sm:gap-1.5"
            >
              <FiGrid className="text-xs sm:text-sm" />
              Templates
            </button>

            {/* AI ViralMotion Button */}
            <button
              className="px-2.5 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-semibold text-gray-700
                bg-white/70 backdrop-blur-xl border border-gray-200
                rounded-full hover:bg-white hover:border-gray-300
                hover:shadow-md
                transition-all duration-300 flex items-center gap-1 sm:gap-1.5"
            >
              <FiZap className="text-xs sm:text-sm" />
              AI ViralMotion
            </button>
          </div>
        </div>

        {/* === Existing Content Below Hero === */}
        <div className="px-2 sm:px-6 lg:px-4 space-y-5">
          {/* === Templates Section === */}
          <TemplatesSection onTry={handleOpenPreview} />
          <TemplatePreviewDialog
            open={!!selectedTemplate}
            onClose={handleClosePreview}
            selectedTemplate={selectedTemplate}
            selectedDescription={selectedDescription}
          />

          {/* === Discover Viralmotions Section === */}
          <VideoCarousel
            title="Discover Viralmotions"
            items={discoverViralMotions}
            onItemClick={handleOpenPreview}
          />

          {/* === Most Trending 2025 Section === */}
          <VideoCarousel
            title="Most Trending 2025"
            items={trendingViralMotions}
            onItemClick={handleOpenPreview}
          />

          {/* Recently Created Templates */}
          {projects.length > 0 && (
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
          )}

          {/* Recently Rendered Videos */}
          {renders.length > 0 && (
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
          )}
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