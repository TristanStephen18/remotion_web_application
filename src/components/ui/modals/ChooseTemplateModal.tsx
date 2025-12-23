import React from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  Tabs,
  Tab,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Fab,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { templateCategories } from "../../../data/DashboardCardsData";
import { TemplateNavigator } from "../../../utils/TemplateNavigator";
import { TEMPLATE_NAME_TO_ID } from "../../../utils/simpleTemplateRegistry";
import { MinimalTemplateCard } from "../cards/MinimalTemplateCard";

interface ChooseTemplateModalProps {
  open: boolean;
  onClose: () => void;
  newProjectTab: number;
  setNewProjectTab: (tab: number) => void;
  newProjectSearch: string;
  setNewProjectSearch: (search: string) => void;
}

export const ChooseTemplateModal: React.FC<ChooseTemplateModalProps> = ({
  open,
  onClose,
  newProjectTab,
  setNewProjectTab,
  newProjectSearch,
  setNewProjectSearch,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchOpen, setSearchOpen] = React.useState(false);

  const allTemplates = Object.values(templateCategories).flat();
  const availableTemplates = allTemplates.filter((t) => t.available);
  const comingSoonTemplates = allTemplates.filter((t) => !t.available);

  // Tab 0: Available, Tab 1: Coming Soon
  const displayedTemplates =
    newProjectTab === 0 ? availableTemplates : comingSoonTemplates;

  const filteredTemplates = displayedTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(newProjectSearch.toLowerCase()) ||
      t.description.toLowerCase().includes(newProjectSearch.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          overflow: "hidden",
          m: isMobile ? 0 : 2,
          maxHeight: isMobile ? "100%" : "92vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: isMobile ? 2 : 3,
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        <Box>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
            Choose Template
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} available
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          edge="end"
          sx={{
            bgcolor: "grey.100",
            "&:hover": { bgcolor: "grey.200" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: isMobile ? 2 : 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: isMobile ? "calc(100vh - 80px)" : "auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Desktop Search Bar */}
        {!isMobile && (
          <TextField
            variant="outlined"
            placeholder="Search templates..."
            fullWidth
            size="small"
            value={newProjectSearch}
            onChange={(e) => setNewProjectSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flexShrink: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "grey.50",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "divider",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                  borderWidth: 1,
                },
              },
            }}
          />
        )}

        {/* Mobile Search Collapse */}
        {isMobile && (
          <Collapse in={searchOpen}>
            <TextField
              variant="outlined"
              placeholder="Search templates..."
              fullWidth
              size="small"
              autoFocus
              value={newProjectSearch}
              onChange={(e) => setNewProjectSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchOpen(false);
                        setNewProjectSearch("");
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            />
          </Collapse>
        )}

        {/* Minimal Tabs */}
        <Box sx={{ flexShrink: 0 }}>
          <Tabs
            value={newProjectTab}
            onChange={(_, newValue) => setNewProjectTab(newValue)}
            sx={{
              minHeight: 44,
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                minHeight: 44,
                px: 3,
                borderRadius: 2,
                color: "text.secondary",
                fontSize: isMobile ? "0.875rem" : "0.9375rem",
                transition: "all 0.2s",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "grey.50",
                },
              },
              "& .Mui-selected": {
                color: "primary.main !important",
                bgcolor: "primary.50",
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Available</span>
                  <Chip
                    label={availableTemplates.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      bgcolor:
                        newProjectTab === 0
                          ? "primary.main"
                          : "rgba(0,0,0,0.08)",
                      color: newProjectTab === 0 ? "white" : "text.secondary",
                    }}
                  />
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Coming Soon</span>
                  <Chip
                    label={comingSoonTemplates.length}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      bgcolor:
                        newProjectTab === 1
                          ? "primary.main"
                          : "rgba(0,0,0,0.08)",
                      color: newProjectTab === 1 ? "white" : "text.secondary",
                    }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Box>

        {/* Template Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : "repeat(auto-fill, minmax(240px, 1fr))",
            gap: isMobile ? 2 : 2.5,
            overflowY: "auto",
            overflowX: "hidden",
            flex: 1,
            pr: 0.5,
            pb: isMobile ? 10 : 2,
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0,0,0,0.15)",
              borderRadius: "3px",
            },
          }}
        >
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <MinimalTemplateCard
                available={template.available}
                key={template.name}
                label={template.name}
                description={template.description}
                url={template.url}
                onSelect={(label) => {
  // Check TemplateNavigator first for wizard routes
  const route = TemplateNavigator(label || "");
  
  // If TemplateNavigator returns a wizard route (not /template/...), use it
  if (route && !route.startsWith("/template") && route !== "/") {
    window.location.assign(route);
    onClose();
    return;
  }
  
  // Otherwise use templateId for editor
  const templateId = TEMPLATE_NAME_TO_ID[label || ""];
  if (templateId) {
    const location = `/editor?template=${templateId}`;
    window.location.assign(location);
  } else {
    window.location.assign(route);
  }
  onClose();
}}
              />
            ))
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 8,
              }}
            >
              <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No templates found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term
              </Typography>
            </Box>
          )}
        </Box>

        {/* Mobile Floating Action Button for Search */}
        {isMobile && !searchOpen && (
          <Fab
            color="primary"
            aria-label="search"
            onClick={() => setSearchOpen(true)}
            sx={{
              position: "fixed",
              top: 80,
              right: 24,
              zIndex: 1000,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <SearchIcon />
          </Fab>
        )}
      </DialogContent>
    </Dialog>
  );
};