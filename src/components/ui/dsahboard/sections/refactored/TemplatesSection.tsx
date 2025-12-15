import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { templateCategories } from '../../../../../data/DashboardCardsData';

interface Template {
  name: string;
  description: string;
  available: boolean;
  url: string;
}

// interface TemplateCategories {
//   [key: string]: Template[];
// }

const TemplateCard = ({ template, index }: { template: Template; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group w-full"
      style={{
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
        cursor: template.available ? 'pointer' : 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={template.available ? () => alert(`Opening ${template.name} template...`) : undefined}
    >
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
          template.available
            ? 'bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-600/10'
            : 'bg-gradient-to-br from-gray-400/10 via-gray-500/10 to-gray-600/10'
        }`}
        style={{
          backdropFilter: 'blur(10px)',
          border: template.available
            ? '1px solid rgba(147, 51, 234, 0.2)'
            : '1px solid rgba(156, 163, 175, 0.2)',
          transform: isHovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
          boxShadow: isHovered
            ? template.available
              ? '0 12px 30px rgba(147, 51, 234, 0.25)'
              : '0 12px 30px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: template.available
              ? 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))'
              : 'linear-gradient(45deg, rgba(156, 163, 175, 0.1), rgba(107, 114, 128, 0.1))',
            animation: isHovered ? 'shimmer 2s infinite' : 'none'
          }}
        />

        {/* GIF container */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-black/5">
          <img
            src={template.url}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{
              filter: template.available ? 'none' : 'grayscale(80%)'
            }}
          />
          
          {/* Overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5">
          <h3
            className={`text-base sm:text-lg font-bold mb-1 sm:mb-2 ${
              template.available ? 'text-purple-900' : 'text-gray-600'
            }`}
          >
            {template.name}
          </h3>
          <p
            className={`text-xs sm:text-sm ${
              template.available ? 'text-gray-700' : 'text-gray-500'
            }`}
          >
            {template.description}
          </p>
        </div>

        {/* Sparkle effect on hover */}
        {template.available && isHovered && (
          <>
            <div
              className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full"
              style={{
                animation: 'sparkle 1.5s ease-in-out infinite',
                animationDelay: '0s'
              }}
            />
            <div
              className="absolute top-8 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full"
              style={{
                animation: 'sparkle 1.5s ease-in-out infinite',
                animationDelay: '0.3s'
              }}
            />
            <div
              className="absolute bottom-12 left-8 w-1 h-1 bg-purple-300 rounded-full"
              style={{
                animation: 'sparkle 1.5s ease-in-out infinite',
                animationDelay: '0.6s'
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

interface TemplateWithCategory extends Template {
  category: string;
}

export const TemplateGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const availableTemplates: TemplateWithCategory[] = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const available: TemplateWithCategory[] = [];
    Object.entries(templateCategories).forEach(([category, templates]) => {
      (templates as Template[]).filter(t => t.available && (t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query))).forEach(template => {
        available.push({ ...template, category });
      });
    });
    return available.sort(() => Math.random() - 0.5);
  }, [searchQuery]);

  const comingSoonTemplates: TemplateWithCategory[] = useMemo(() => {
    const soon: TemplateWithCategory[] = [];
    Object.entries(templateCategories).forEach(([category, templates]) => {
      (templates as Template[]).filter(t => !t.available).forEach(template => {
        soon.push({ ...template, category });
      });
    });
    return soon.sort(() => Math.random() - 0.5);
  }, []);

  return (
    <div className="min-h-screen pt-0 p-1 sm:p-2 lg:p-4">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }

          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* Available Templates Section */}
      {availableTemplates.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12">
          {!isMobile ? (
            <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                Available Now
              </h2>
              <div
                className="relative rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05), rgba(59, 130, 246, 0.05))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(147, 51, 234, 0.2)',
                  width: '300px'
                }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-900">
                Available Now
              </h2>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {availableTemplates.map((template, index) => (
              <TemplateCard
                key={template.name}
                template={template}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      {comingSoonTemplates.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8 text-gray-700">
            Coming Soon
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {comingSoonTemplates.map((template, index) => (
              <TemplateCard
                key={template.name}
                template={template}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {availableTemplates.length === 0 && searchQuery && (
        <div className="text-center py-12 sm:py-20">
          <p className="text-gray-500 text-base sm:text-lg">No templates found matching your search.</p>
        </div>
      )}

      {/* Mobile Search FAB */}
      {isMobile && (
        <button
          className="fixed bottom-4 right-4 bg-purple-500 rounded-full p-4 shadow-lg z-40"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Mobile Search Modal */}
      {showSearch && isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search available templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 pl-4 pr-4 py-2 bg-gray-100 rounded-lg outline-none text-gray-800 placeholder-gray-400 text-base"
              autoFocus
            />
            <button
              className="ml-2 text-gray-500"
              onClick={() => setShowSearch(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// export default TemplateGallery;