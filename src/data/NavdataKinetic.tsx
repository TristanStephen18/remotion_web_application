import React from "react";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaletteIcon from "@mui/icons-material/Palette";
import TimerIcon from "@mui/icons-material/Timer";
import FlareIcon from "@mui/icons-material/Flare";
// Removed SettingsIcon and SaveAltIcon

export const kinetictemplatenavs = [
  { key: "text", label: "Text", icon: <TextFieldsIcon /> },
  { key: "colors", label: "Colors", icon: <PaletteIcon /> },
  { key: "timing", label: "Timing", icon: <TimerIcon /> },
  { key: "effects", label: "Effects", icon: <FlareIcon /> },
  // Removed "options" and "export" objects
];