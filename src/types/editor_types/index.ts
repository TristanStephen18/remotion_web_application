// ============================================================================
// SHARED TYPES
// ============================================================================

export type SidebarTab = "text" | "media" | "audio" | "video" | "carousel" | "tools" | "layout" | "chat" | "watch" |  null;

export interface MediaGalleryTab {
  id: string;
  name: string;
  type: "audio" | "video" | "image";
  url: string;
  thumbnail?: string;
  duration?: string;
}