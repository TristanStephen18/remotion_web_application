import type { ThemeColors } from "../contexts/ThemeContext";

/**
 * Themed Editor Styles - Reusable styles for all editor panels
 * 
 * Use this instead of modernEditorStyles for theme-aware styling
 * 
 * Usage:
 * ```tsx
 * import { useTheme } from "../../contexts/ThemeContext";
 * import { getThemedEditorStyles } from "../../styles/themedEditorStyles";
 * 
 * const { colors } = useTheme();
 * const styles = getThemedEditorStyles(colors);
 * ```
 */
export const getThemedEditorStyles = (colors: ThemeColors) => ({
  // Container
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    height: "100%",
    overflow: "auto" as const,
    backgroundColor: colors.bgSecondary,
  },

  // Sections
  section: {
    padding: "10px 12px",
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  sectionCompact: {
    padding: "8px 12px",
    borderBottom: `1px solid ${colors.borderLight}`,
  },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: "600" as const,
    color: colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    marginBottom: "8px",
  },
  sectionHeader: {
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: "8px",
    cursor: "pointer" as const,
    userSelect: "none" as const,
  },
  collapseIcon: {
    fontSize: "10px",
    color: colors.textMuted,
    transition: "transform 0.2s",
  },

  // Properties
  propertyRow: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: "6px",
  },
  propertyLabel: {
    fontSize: "10px",
    color: colors.textTertiary,
    fontWeight: "500" as const,
  },
  propertyValue: {
    fontSize: "12px",
    color: colors.textPrimary,
    fontWeight: "600" as const,
  },

  // Form Elements
  formGroupCompact: {
    marginBottom: "8px",
  },
  label: {
    display: "block" as const,
    fontSize: "10px",
    color: colors.textTertiary,
    marginBottom: "4px",
    fontWeight: "500" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  checkboxLabel: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    fontSize: "12px",
    color: colors.textPrimary,
    cursor: "pointer" as const,
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer" as const,
  },

  // Sliders
  sliderWrapper: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "10px",
  },
  slider: {
    flex: 1,
    height: "4px",
    borderRadius: "2px",
    cursor: "pointer" as const,
  },
  sliderValue: {
    minWidth: "40px",
    fontSize: "11px",
    color: colors.textSecondary,
    textAlign: "right" as const,
  },

  // Inputs
  input: {
    width: "100%",
    padding: "6px 8px",
    backgroundColor: colors.bgTertiary,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    color: colors.textPrimary,
    fontSize: "12px",
    height: "28px",
  },
  select: {
    width: "100%",
    padding: "6px 8px",
    backgroundColor: colors.bgTertiary,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    color: colors.textPrimary,
    fontSize: "12px",
    height: "28px",
    cursor: "pointer" as const,
  },

  // Buttons
  buttonPrimary: {
    width: "100%",
    padding: "10px",
    backgroundColor: colors.accent,
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    transition: "all 0.2s",
  },
  buttonSecondary: {
    width: "100%",
    padding: "10px",
    backgroundColor: colors.bgTertiary,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    color: colors.textPrimary,
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    transition: "all 0.2s",
  },
  iconButton: {
    width: "32px",
    height: "28px",
    padding: "0",
    backgroundColor: colors.bgSecondary,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    color: colors.textMuted,
    fontSize: "14px",
    cursor: "pointer" as const,
    transition: "all 0.2s",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  deleteButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#dc2626",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    transition: "all 0.2s",
  },

  // Cards
  card: {
    padding: "10px",
    backgroundColor: colors.bgTertiary,
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    cursor: "pointer" as const,
    transition: "all 0.2s",
    fontSize: "11px",
    fontWeight: "600" as const,
    color: colors.textPrimary,
    textAlign: "center" as const,
  },
  iconButtonActive: {
    backgroundColor: colors.bgActive,
    borderColor: colors.accent,
    color: colors.accent,
  },

  // Grids
  grid2: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  grid3: {
    display: "grid" as const,
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "6px",
  },
  grid4: {
    display: "grid" as const,
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "6px",
  },

  // Utility
  helpText: {
    fontSize: "11px",
    color: colors.textMuted,
    lineHeight: "1.4",
  },
});

export type ThemedEditorStyles = ReturnType<typeof getThemedEditorStyles>;