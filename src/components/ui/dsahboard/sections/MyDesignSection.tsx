import React, { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { ChooseTemplateModal } from "../../modals/ChooseTemplateModal";
import { useProjectHooks } from "../../../../hooks/dashboardhooks/ProjectHooks";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface MyDesignProps {
  projects: any[];
  loadingProjects: boolean;
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  onDelete: (id: number) => Promise<void>;
  onRename: (id: number, newTitle: string) => Promise<void>;
}

export const MyProjectsSection: React.FC<MyDesignProps> = ({
  projects,
  loadingProjects,
  setHoveredId,
  onDelete,
  onRename,
}) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingProject, setRenamingProject] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");

  const {
    newProjectOpen,
    setNewProjectOpen,
    newProjectTab,
    newProjectSearch,
    setNewProjectSearch,
    setNewProjectTab,
  } = useProjectHooks();

  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      ),
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      sortedProjects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [sortedProjects, search]
  );

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    projectId: number
  ) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  const handleMenuClose = () => {
    setOpenMenuId(null);
  };

  const handleRename = (project: any) => {
    setRenamingProject(project);
    setNewTitle(project.title);
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameConfirm = async () => {
    if (renamingProject && newTitle.trim()) {
      try {
        await onRename(renamingProject.id, newTitle.trim());
        setRenameDialogOpen(false);
        setRenamingProject(null);
        setNewTitle("");
      } catch (error) {
        // Handle error if needed
      }
    }
  };

  const handleDelete = async (projectId: number) => {
    try {
      setDeletingId(projectId);
      await onDelete(projectId);
    } finally {
      setDeletingId(null);
    }
    handleMenuClose();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            {/* <h2 className="text-2xl font-bold text-gray-900">My Templates</h2> */}
            <p className="text-lg text-gray-800 mt-2">
              You have {filteredProjects.length}{" "}
              {filteredProjects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your projects..."
              className="w-full bg-gray-50 rounded-lg pl-10 pr-4 py-2.5 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 bg-gray-50">
        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-gray-600 font-medium">
              Loading your templates...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? "No templates found" : "No templates yet"}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm">
              {search
                ? "Try adjusting your search terms"
                : "Start creating your first template to see it here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {/* Create New Project Card */}
            <button
              onClick={() => setNewProjectOpen(true)}
              className="relative aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group cursor-pointer hidden sm:block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
              </div>

              <div className="relative h-full flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <p className="text-white font-bold text-xs text-center drop-shadow-lg">
                  Create New
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Project Cards */}
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => {
                  if (openMenuId === project.id) {
                    handleMenuClose();
                  } else {
                    const location = `/editor?project=${project.id}`;
                    window.location.assign(location);
                  }
                }}
              >
                {/* Card with Image Background */}
                <div className="relative aspect-square rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  {/* Background Image/Video */}
                  {project.projectVidUrl ? (
                    <video
                      src={project.projectVidUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="max-w-full max-h-full object-contain drop-shadow-lg"
                      onMouseOver={(e) => {
                        e.currentTarget.play();
                        e.currentTarget.playbackRate = 2.5;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img
                      src={project.screenshot}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Glossy Overlay - Always visible with glassmorphism */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20">
                    {/* Glassmorphism effect */}
                    <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                  </div>

                  {/* 3-Dots Menu - Top Right */}
                  <div className="absolute top-2 right-2 z-20">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, project.id)}
                      sx={{
                        bgcolor: "white/20",
                        backdropFilter: "blur(4px)",
                        border: "1px solid white/30",
                        "&:hover": { bgcolor: "white/30" },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 16, color: "white" }} />
                    </IconButton>
                  </div>

                  {/* Inline Menu - Appears inside card */}
                  {openMenuId === project.id && (
                    <div className="absolute top-10 right-2 z-30 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-white/20 overflow-hidden">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(project);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        disabled={deletingId === project.id}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === project.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}

                  {/* Content Overlay - Bottom with Glassmorphism */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    {/* Glassmorphism Card */}
                    <div className="bg-gray-50/95 backdrop-blur-md rounded-lg p-2 border border-white/30 shadow-2xl">
                      <h3 className="font-bold text-gray-900 text-xs mb-0.5 truncate drop-shadow-sm">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-[10px] mb-2 drop-shadow-sm">
                        Last edited: {new Date(project.lastUpdated).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="block sm:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setNewProjectOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rename Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Title"
            fullWidth
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRenameConfirm();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm} variant="contained">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Choose Template Modal */}
      {newProjectOpen && (
        <ChooseTemplateModal
          open={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
          newProjectTab={newProjectTab}
          setNewProjectTab={setNewProjectTab}
          newProjectSearch={newProjectSearch}
          setNewProjectSearch={setNewProjectSearch}
        />
      )}
    </div>
  );
};
