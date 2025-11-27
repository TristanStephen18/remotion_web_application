import React from "react";
import { templateCategories } from "../../../../data/DashboardCardsData";
import { TemplateCard } from "../TemplateCard";
import {
  FileText,
  Mail,
  Hexagon,
  FileImage,
  BookOpen,
  Video,
  PartyPopper,
  Smartphone,
  Facebook,
  CreditCard,
  LayoutGrid,
  BarChart3,
  LayoutDashboard,
  Mic,
} from "lucide-react";

interface TemplatesSectionProps {
  search: string;
  setSearch: (value: string) => void;
  tab: number;
  setTab: (tab: number) => void;
  onTry: (template: string, description: string) => void;
}

interface CategoryStyle {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

// Category icons and colors mapping - exact match to image
const categoryStyles: Record<string, CategoryStyle> = {
  All: {
    icon: <LayoutGrid size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#F3F4F6]",
    iconColor: "text-[#9CA3AF]",
  },
  Resume: {
    icon: <FileText size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FEF3E2]",
    iconColor: "text-[#F97316]",
  },
  Email: {
    icon: <Mail size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FEF9C3]",
    iconColor: "text-[#EAB308]",
  },
  Logo: {
    icon: <Hexagon size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FECDD3]",
    iconColor: "text-[#F87171]",
  },
  Flyer: {
    icon: <FileImage size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#D1FAE5]",
    iconColor: "text-[#34D399]",
  },
  Brochure: {
    icon: <BookOpen size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FEF3E2]",
    iconColor: "text-[#F97316]",
  },
  Video: {
    icon: <Video size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#E0E7FF]",
    iconColor: "text-[#818CF8]",
  },
  Invitation: {
    icon: <PartyPopper size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FCE7F3]",
    iconColor: "text-[#F472B6]",
  },
  "Mobile Video": {
    icon: <Smartphone size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#CFFAFE]",
    iconColor: "text-[#22D3EE]",
  },
  "Facebook Post": {
    icon: <Facebook size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#DBEAFE]",
    iconColor: "text-[#3B82F6]",
  },
  "Business Card": {
    icon: <CreditCard size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FECDD3]",
    iconColor: "text-[#F87171]",
  },
  Text: {
    icon: <FileText size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FEF3E2]",
    iconColor: "text-[#F97316]",
  },
  Analytics: {
    icon: <BarChart3 size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FEF9C3]",
    iconColor: "text-[#EAB308]",
  },
  Layout: {
    icon: <LayoutDashboard size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#FECDD3]",
    iconColor: "text-[#F87171]",
  },
  Voiceovers: {
    icon: <Mic size={22} strokeWidth={1.5} />,
    bgColor: "bg-[#CFFAFE]",
    iconColor: "text-[#22D3EE]",
  },
};

// Default style
const defaultStyle: CategoryStyle = {
  icon: <FileText size={22} strokeWidth={1.5} />,
  bgColor: "bg-[#F3F4F6]",
  iconColor: "text-[#9CA3AF]",
};

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  search,
  setSearch,
  tab,
  setTab,
  onTry,
}) => {
  const categories = ["All", ...Object.keys(templateCategories)];
  const allTemplates = Object.values(templateCategories).flat();

  const displayedTemplates =
    tab === 0
      ? allTemplates
      : templateCategories[categories[tab] as keyof typeof templateCategories];

  const filteredTemplates = displayedTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryStyle = (category: string): CategoryStyle => {
    return categoryStyles[category] || defaultStyle;
  };

  return (
    <section className="w-full">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Explore Templates
        </h1>

        <input
          type="text"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Cards - Matching the image exactly */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
        {categories.map((category, index) => {
          const isActive = tab === index;
          const style = getCategoryStyle(category);

          return (
            <button
              key={index}
              onClick={() => setTab(index)}
              className={`flex-shrink-0 relative w-28 h-16 rounded-2xl transition-all ${
                style.bgColor
              } ${isActive ? "scale-105" : "hover:brightness-95"}`}
            >
              {/* Icon - Top Right */}
              <div className={`absolute top-2 right-3 ${style.iconColor}`}>
                {style.icon}
              </div>

              {/* Category Name - Bottom Left */}
              <span className="absolute bottom-2 left-3 text-xs text-gray-500">
                {category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.name}
            label={template.url}
            name={template.name}
            description={template.description}
            onTry={onTry}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try a different search term
          </p>
        </div>
      )}
    </section>
  );
};