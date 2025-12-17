import { useEffect, useRef, useCallback } from "react";
import type { Layer } from "../../components/remotion_compositions/DynamicLayerComposition";

const STORAGE_PREFIX = "editor_state_";

interface PersistedState {
  layers: Layer[];
  savedAt: number;
}

export function getPersistedLayersForTemplate(templateId: number): Layer[] | null {
  try {
    const key = `${STORAGE_PREFIX}template_${templateId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed: PersistedState = JSON.parse(stored);
    if (!parsed.layers || parsed.layers.length === 0) return null;
    console.log("📂 Found persisted state for template:", templateId);
    return parsed.layers;
  } catch {
    return null;
  }
}

export function clearPersistedStateForTemplate(templateId: number): void {
  try {
    const key = `${STORAGE_PREFIX}template_${templateId}`;
    localStorage.removeItem(key);
    console.log("🗑️ Cleared persisted state for template:", templateId);
  } catch (e) {
    console.warn("Failed to clear:", e);
  }
}

// =============================================================================
// HOOK - Handles auto-saving only
// =============================================================================

export function usePersistedEditorState(
  layers: Layer[],
  options: { templateId: number | null | undefined; projectId: string | null }
) {
  const { templateId, projectId } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const storageKey = projectId
    ? `${STORAGE_PREFIX}project_${projectId}`
    : templateId
    ? `${STORAGE_PREFIX}template_${templateId}`
    : null;

  // Auto-save with 500ms debounce
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!storageKey) return;
    if (!layers || layers.length === 0) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ layers, savedAt: Date.now() }));
        console.log("📦 Auto-saved to:", storageKey);
      } catch (e) {
        console.warn("Failed to save:", e);
      }
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [layers, storageKey]);

  const clearPersistedState = useCallback(() => {
    if (!storageKey) return;
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Failed to clear:", e);
    }
  }, [storageKey]);

  return { clearPersistedState };
}