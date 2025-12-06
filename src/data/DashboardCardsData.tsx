export const templates = [
  "Quote Spotlight",
  "Typing Animation",
  "Fact Cards",
  "Bar Graph Analytics",
  "Split Screen",
];

export const templateCategories = {
  Text: [
    {
      name: "Quote Spotlight",
      description: "Highlight quotes with beautiful transitions.",
      available: true,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457718/QuoteSpotlight_jn0iya_igzysu.gif",
    },
    {
      name: "Typing Animation",
      description: "Simulates live typing animations for text intros.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457709/TypingAnimation_jlvcyk_gvlcgl.gif"
    },

    {
      name: "Kinetic Typography",
      description: "Create a dynamic, high-energy text explosion intro.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457722/KineticTypography_-_1_vudumo.gif",
    },
    {
      name: "Logo Animation",
      description: "Reveal your brand with a dynamic logo animation featuring a self-drawing outline and a glowing, liquid-fill effect.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763455885/LogoAnimation_forx64.gif",
    },
  ],
  Analytics: [
    {
      name: "Bar Graph Analytics",
      description: "Visualize data with animated bar graphs.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457711/BarGraphAnalytics_ubzzcp_le3cfy.gif",
    },
    {
      name: "Kpi Flip Cards",
      description: "Show KPIs with flipping card animations.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457710/KpiFlipCards_yla74f_nnwtgl.gif",
    },
    {
      name: "Curve Line Trend",
      description: "Visualize time series data using animated trend line graphs.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457710/CurveLineTrend_ymo1il_obwrkq.gif",
    },
    {
      name: "Flip Cards",
      description: "Flipping card animations.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763455883/CardFlip_erfrny.gif",
    },
  ],
  Layout: [
    {
      name: "Split Screen",
      description: "Compare visuals side by side with smooth transitions.",
      available: true,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763458446/649f6ac4-b53a-49dd-acd8-3782474b612e_xcwgns.gif"
    },
    {
      name: "Fact Cards",
      description: "Show multiple facts in card-style animations.",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457721/fa06d6f0-6fcd-4158-b461-bcbbcdbe1bd2_pzbe8z.gif",
    },
    {
      name: "Ken Burns Carousel",
      description: "Display images in a ken burns carousel type animation",
      available: true,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763458547/ba1676dd-5925-4702-bc2a-5168da46fae3_vpg5p3.gif"
    },

    {
      name: "Photo Collage",
      description: "Display images in a Collage type animation",
      available: true,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1764649824/f4d25dad-1aef-4e7b-a678-0cec8cc7aedf_ecqtud.gif"
    },

  {
      name: "Dancing People",
      description: "Display images in a Collage type animation",
      available: true,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1764650081/edc0d1e2-c250-49b1-a280-d206faeae4d9_bstbyg.gif"
    },

  ],
  Voiceovers: [
    {
      name: "Fake Text Conversation",
      description: "Create fake text conversation using ai voice overs",
      available: true,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457720/7c8473e9-7967-4b97-9bd5-056b7745a4d4_lfwuqf.gif"
    },
    {
      name: "Reddit Post Narration",
      description: "Convert reddit posts into entertaining ai voice over narration using only posts links",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763457722/de7c1c4a-1bc8-4131-8a8a-d6452c913706_foiabz.gif",
    },
    {
      name: "Ai Story Narration",
      description: "Make your story into an ai narration video or have the ai create a story to narrate for you",
      available: false,
      url: "https://res.cloudinary.com/dcu9xuof0/image/upload/v1763459551/9a83d90a-0585-44af-83c8-eb4704267552_bcgckr.gif"
    },
  ]
};


export function templateUrlFinder (template: string){
  switch(template){
    case "Ai Story Narration":
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/AiStoryNarration_h7bq5x.mp4";
    case "Reddit Post Narration":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794245/RedditPostNarration_x9rs2u.mp4";
    case "Fake Text Conversation":
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/FakeTextConversation_og7tke.mp4";
    case "Ken Burns Carousel":
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/KenBurnsCarousel_jpnilj.mp4";
      case "Fact Cards":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794239/FactCards_rgtdfm.mp4";
      case "Split Screen":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760964357/splitscreenVideo-1760963733064_dkczll.mp4";
      case "Curve Line Trend":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794251/CurveLineTrend_ymo1il.mp4";
      case "Kpi Flip Cards":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794240/KpiFlipCards_yla74f.mp4";
      case "Bar Graph Analytics":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794238/BarGraphAnalytics_ubzzcp.mp4";
      case "Typing Animation":
        return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/TypingAnimation_jlvcyk.mp4";
      case "Kinetic Typography":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441944/KineticTypography_-_1_bxwbbr.mp4";
      case "Neon Flicker":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441835/NeonFlickerTitle_hybeaz.mp4";
      case "Heat Map":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441890/HeatMap_cbriqm.mp4";
      case "Flip Cards":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441913/CardFlip_no4k2t.mp4";
      case "Logo Animation":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763441876/LogoAnimation_qyspkm.mp4";
      case "Neon Lights Text":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763462298/NeonTubeFlicker_jqasxn.mp4";
      case "Retro Neon Text":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1763465127/RetroNeonText_MatrixRain_ugi1zb.mp4";
      case "Photo Collage":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1764649309/Screen_Recording_2025-12-02_062120_r0gyir.mp4";
     
      case "Dancing People":
        return "https://res.cloudinary.com/dcu9xuof0/video/upload/v1764649528/Screen_Recording_2025-12-02_062442_mvzhxg.mp4";
    default:
      return "https://res.cloudinary.com/dnxc1lw18/video/upload/v1760794242/QuoteSpotlight_jn0iya.mp4";
  }
}