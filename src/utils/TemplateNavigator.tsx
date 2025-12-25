export const TemplateNavigator = (template: string) => {
    const leading = "/template";
    switch (template) {
      case "Typing Animation":
        return leading + "/newtexttyping";
      case "Quote Spotlight":
        return "/quote-wizard";
      case "Fact Cards":
        return leading + "/factcards";
      case "Bar Graph Analytics":
        return leading + "/bargraph";
      case "Split Screen":
        return "/splitscreen-wizard";
      case "Kpi Flip Cards":
        return leading + "/kpiflipcards";
      case "Ken Burns Carousel":
        return "/kenburns-wizard";
      case "Fake Text Conversation":
        return "/fakechat-wizard";
      case "Reddit Post Narration":
        return "/reddit-wizard"; 
      case "Ai Story Narration":
        return leading + "/storytelling";
      case "Curve Line Trend":
        return leading + "/curvelinetrend";
      case "Kinetic Typography":
        return leading + "/kinetictext";
      case "Neon Flicker":
        return leading + "/neonflicker";
      case "Heat Map":
        return leading + "/heatmap";
      case "Flip Cards":
        return leading + "/flipcards";
      case "Logo Animation":
        return leading + "/logoanimation";
      case "Neon Lights Text":
        return leading + "/neontube";
      case "Retro Neon Text":
        return leading + "/retroneon";
      case "Photo Collage":
        return "/collage-wizard";
      default:
        return "/";
    }
  };