// ============================================================================
// TEXT AUTO-RESIZE UTILITY
// ============================================================================
// This utility calculates the actual dimensions of text content and
// auto-resizes text layers to fit their content perfectly.

import type { TextLayer } from "../components/remotion_compositions//DynamicLayerComposition";

/**
 * Measures the actual dimensions of text content
 * Returns width and height as percentages of the composition
 */
export function measureTextDimensions(
  layer: TextLayer,
  compositionWidth: number = 1080,
  compositionHeight: number = 1920
): { width: number; height: number } {
  // Create a temporary div to measure text
  const measureDiv = document.createElement("div");
  measureDiv.style.position = "absolute";
  measureDiv.style.visibility = "hidden";
  measureDiv.style.whiteSpace = "pre-wrap";
  measureDiv.style.wordWrap = "break-word";
  measureDiv.style.overflowWrap = "break-word";
  measureDiv.style.display = "block"; // Use block instead of flex
  measureDiv.style.fontFamily = layer.fontFamily || "Inter";

  const scaledFontSize = (layer.fontSize / 100) * compositionHeight;
measureDiv.style.fontSize = `${scaledFontSize}px`;

  measureDiv.style.fontWeight = layer.fontWeight || "400";
  measureDiv.style.fontStyle = layer.fontStyle || "normal";
  measureDiv.style.lineHeight = `${layer.lineHeight || 1.2}`;
  measureDiv.style.textAlign = layer.textAlign || "left";
  measureDiv.style.letterSpacing = `${layer.letterSpacing || 0}px`;
  measureDiv.style.textTransform = layer.textTransform || "none";
  
  // Set max width to prevent infinite width (use 90% of composition width as max)
  measureDiv.style.maxWidth = `${compositionWidth * 0.9}px`;
  
  // Apply text content
  measureDiv.textContent = layer.content || "Text";
  
  // Append to body to measure
  document.body.appendChild(measureDiv);
  
  // Get dimensions
  const rect = measureDiv.getBoundingClientRect();
  const pixelWidth = rect.width;
  const pixelHeight = rect.height;
  
  // Remove the temporary element
  document.body.removeChild(measureDiv);
  
  // Add padding (5% on sides = 10% total width, 15% on top/bottom = 30% total height)
  const paddedWidth = pixelWidth * 1.1;
  const paddedHeight = pixelHeight * 1.15;
  
  // Convert to percentage of composition
  const widthPercent = (paddedWidth / compositionWidth) * 100;
  const heightPercent = (paddedHeight / compositionHeight) * 100;
  
  // Ensure minimum size
  const minWidth = 15; // 15% minimum
  const minHeight = 8; // 8% minimum
  
  return {
    width: Math.max(minWidth, Math.min(90, widthPercent)), // Cap at 90%
    height: Math.max(minHeight, Math.min(80, heightPercent)), // Cap at 80%
  };
}

/**
 * Auto-resize a text layer to fit its content
 * Returns updated layer with new size
 */
export function autoResizeTextLayer(
  layer: TextLayer,
  compositionWidth?: number,
  compositionHeight?: number
): Partial<TextLayer> {
  const newSize = measureTextDimensions(layer, compositionWidth, compositionHeight);
  
  return {
    size: {
      width: newSize.width,
      height: newSize.height,
    },
  };
}

/**
 * Check if a layer needs resizing (content has changed significantly)
 */
export function shouldAutoResize(
  layer: TextLayer,
  compositionWidth?: number,
  compositionHeight?: number
): boolean {
  const currentSize = layer.size;
  const optimalSize = measureTextDimensions(layer, compositionWidth, compositionHeight);
  
  // Check if difference is significant (more than 10%)
  const widthDiff = Math.abs(currentSize.width - optimalSize.width);
  const heightDiff = Math.abs(currentSize.height - optimalSize.height);
  
  return widthDiff > 5 || heightDiff > 5;
}