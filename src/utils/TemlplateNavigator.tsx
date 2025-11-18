// utils/templateUtils.ts
// import { templatedata } from "../data/templatedata";

export const getTemplateRoute = (templateId: number, projectId: number) => {
  switch (templateId) {
    case 1: // Quote Spotlight
      return `/project/${projectId}/quotetemplate`;
    case 2: // Typing Animation
      return `/project/${projectId}/texttypingtemplate`;
    case 3: // Bar Graph
      return `/project/${projectId}/bargraph`;
    case 4: // KPI Flip Cards
      return `/project/${projectId}/kpiflipcards`;
    case 5: // Curve Line Trend
      return `/project/${projectId}/curvelinetrend`;
    case 6: // Split Screen
      return `/project/${projectId}/splitscreen`;
    case 7: // Fact Cards
      return `/project/${projectId}/factcards`;
    case 8: // Ken Burns Carousel
      return `/project/${projectId}/kenburnscarousel`;
    case 9: // Fake Text Conversation
      return `/project/${projectId}/faketextconversation`;
    case 10: // Reddit Narration
      return `/project/${projectId}/redditvideo`;
    case 11: // Story Narration
      return `/project/${projectId}/storytelling`;
    case 12: // Kinetic Text
      return `/project/${projectId}/kinetictext`;
    case 13: // Neon Flicker
      return `/project/${projectId}/neonflicker`;
    case 14: // Heatmap
      return `/project/${projectId}/heatmap`;
    case 15: // Flip Cards
      return `/project/${projectId}/flipcards`;
    case 16: // Logo Animation
      return `/project/${projectId}/logoanimation`;
    default:
      return `/project/${projectId}/unknown`;
  }
};
