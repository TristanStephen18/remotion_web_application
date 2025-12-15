import React, { useState } from "react";
import { FiFilm, FiFolder } from "react-icons/fi";
// import { MyRendersSection } from "./MyRendersSection";
import { MyFilesSection } from "./MyFilesSection";
import { MyProjectsSection } from "./MyDesignSection";

type MainTab = "renders" | "files";

// interface RenderItem {
//   id: string;
//   type: "mp4" | "gif" | "webm";
//   outputUrl: string;
//   templateId?: number;
//   renderedAt?: string;
//   aspectRatio?: number;
//   [key: string]: any;
// }

interface SavedTemplatesSectionProps {
  uploads: any[];
  loadingUploads: boolean;
  selectedUploads: number[];
  setSelectedUploads: React.Dispatch<React.SetStateAction<number[]>>;
  handleDeleteUploads: () => Promise<void>;
  projects: any[];
  loadingProjects: boolean;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  selectedProjects: number[];
  toggleProjectSelection: (id: number) => void;
  clearSelection: () => void;
  onDeleteSelected: (ids: number[]) => Promise<void>;
   handleRenameProject: (id: number, newTitle: string) => Promise<void>;
  handleDeleteProject: (id: number) => Promise<void>
}

export const ProjectsSection: React.FC<SavedTemplatesSectionProps> = ({
  uploads = [],
  loadingUploads = false,
  selectedUploads = [],
  setSelectedUploads,
  handleDeleteUploads,
  projects,
  loadingProjects,
  hoveredId,
  setHoveredId,
  handleDeleteProject,
  handleRenameProject
}) => {
  const [activeTab, setActiveTab] = useState<MainTab>("renders");

  return (
    <div className="flex flex-col h-full text-gray-800 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Main Tabs (Fixed at bottom on mobile, top on larger screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-2 sm:static sm:flex-shrink-0 sm:border-b sm:border-t-0 sm:px-6 sm:pt-4">
        <div className="flex sm:gap-1">
          <button
            onClick={() => setActiveTab("renders")}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-b-xl sm:flex-initial sm:rounded-t-xl font-medium text-sm transition-all ${
              activeTab === "renders"
                ? "bg-white text-indigo-600 border-t-2 sm:border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FiFilm size={18} />
            My Projects
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-b-xl sm:flex-initial sm:rounded-t-xl font-medium text-sm transition-all ${
              activeTab === "files"
                ? "bg-white text-indigo-600 border-t-2 sm:border-b-2 border-indigo-600"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <FiFolder size={18} />
            My Assets
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-20 sm:pb-0">
        {activeTab === "renders" ? (
          <MyProjectsSection
            hoveredId={hoveredId}
            loadingProjects={loadingProjects}
            projects={projects}
            setHoveredId={setHoveredId}
            onDelete={handleDeleteProject}
            onRename={handleRenameProject}
          />
        ) : (
          <MyFilesSection
            uploads={uploads}
            loadingUploads={loadingUploads}
            selectedUploads={selectedUploads}
            setSelectedUploads={setSelectedUploads}
            handleDeleteUploads={handleDeleteUploads}
          />
        )}
      </div>
    </div>
  );
};
