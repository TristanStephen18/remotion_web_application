import { useEffect, useRef, useCallback } from "react";
import type { Layer } from "../../components/remotion_compositions/DynamicLayerComposition";

const STORAGE_PREFIX = "editor_state_";
const EXPIRATION_MS = 1 * 60 * 1000; 

interface PersistedState {
  layers: Layer[];
  savedAt: number;
}

function isExpired(savedAt: number): boolean {
  return Date.now() - savedAt > EXPIRATION_MS;
}

// =============================================================================
// CHECK IF COMING FROM WIZARD - Skip persistence in this case
// =============================================================================

function isFromWizard(): boolean {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('fromWizard') === 'true';
}

// =============================================================================
// GET PERSISTED LAYERS - Returns null if from wizard or expired
// =============================================================================

export function getPersistedLayersForTemplate(templateId: number): Layer[] | null {
  // NEVER return persisted layers when coming from wizard
  if (isFromWizard()) {
    console.log("🚫 Skipping persisted layers - coming from wizard");
    clearPersistedStateForTemplate(templateId);
    return null;
  }

  try {
    const key = `${STORAGE_PREFIX}template_${templateId}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed: PersistedState = JSON.parse(stored);
    if (!parsed.layers || parsed.layers.length === 0) return null;
    
    // Check if the saved state has expired
    if (isExpired(parsed.savedAt)) {
      console.log("⏰ Persisted state expired for template:", templateId);
      localStorage.removeItem(key);
      return null;
    }
    
    console.log("📂 Found persisted state for template:", templateId);
    return parsed.layers;
  } catch {
    return null;
  }
}

// =============================================================================
// CLEAR PERSISTED STATE - Clears single template
// =============================================================================

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
// CLEAR ALL RELATED KEYS - Aggressive clear for wizard flow
// =============================================================================

export function clearAllPersistedStateForTemplate(templateId: number): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.includes(`template_${templateId}`) ||
        key.includes(`template-${templateId}`) ||
        key.includes(`template${templateId}`) ||
        key.includes(`layers-${templateId}`) ||
        key.includes(`editor-layers-${templateId}`) ||
        key.includes(`editor_state_`) && key.includes(`${templateId}`)
      )) {
        keysToRemove.push(key);
      }
    }
    
    // Special handling for template 19 (Photo Collage)
    if (templateId === 19) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('photocollage') ||
          key.includes('Photo Collage') ||
          key.includes('collage')
        )) {
          if (!keysToRemove.includes(key)) {
            keysToRemove.push(key);
          }
        }
      }
    }
    
    keysToRemove.forEach(key => {
      console.log("🗑️ Removing:", key);
      localStorage.removeItem(key);
    });
    
    console.log(`🧹 Cleared ${keysToRemove.length} keys for template ${templateId}`);
  } catch (e) {
    console.warn("Failed to clear all:", e);
  }
}

// =============================================================================
// HOOK - Handles auto-saving only (skips when from wizard)
// =============================================================================

export function usePersistedEditorState(
  layers: Layer[],
  options: { templateId: number | null | undefined; projectId: string | null }
) {
  const { templateId, projectId } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  const fromWizard = useRef(isFromWizard());

  const storageKey = projectId
    ? `${STORAGE_PREFIX}project_${projectId}`
    : templateId
    ? `${STORAGE_PREFIX}template_${templateId}`
    : null;

  // Clear persisted state immediately if coming from wizard
  useEffect(() => {
    if (fromWizard.current && templateId) {
      console.log("🧹 Wizard flow detected - clearing persisted state for template:", templateId);
      clearAllPersistedStateForTemplate(templateId);
      
      // Remove fromWizard from URL after clearing
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('fromWizard');
      newUrl.searchParams.delete('t');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Reset the flag so future saves work normally
      fromWizard.current = false;
    }
  }, [templateId]);

  // Auto-save with 500ms debounce (skip initial save when from wizard)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Don't auto-save if we just came from wizard (first few seconds)
    if (fromWizard.current) {
      console.log("⏸️ Skipping auto-save - wizard flow");
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
      console.log("🗑️ Manually cleared:", storageKey);
    } catch (e) {
      console.warn("Failed to clear:", e);
    }
  }, [storageKey]);

  return { clearPersistedState };
}