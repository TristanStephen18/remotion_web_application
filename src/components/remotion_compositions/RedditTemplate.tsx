import {
  AbsoluteFill,
  Audio,
  Video,
  useVideoConfig,
  useCurrentFrame,
  Sequence,
} from "remotion";

// ------------------ Types ------------------
type Word = { word: string; start: number; end: number };

type ScriptStructure = {
  story: string;
  duration: number;
  words: Word[];
  title: string;
  text: string;
};

type RedditCardConfig = {
  subredditName: string;
  posterUsername: string;
  timePosted: string;
  upvotes: string;
  commentCount: string;
  awardsCount: string;
  avatarUrl: string;
   titleFontSize?: number;
  textFontSize?: number;
  displayDuration?: number;
  headerFontSize?: number;
  metricsFontSize?: number;
  textMaxLength?: number;
};

type MyRedditVideoProps = {
  script: ScriptStructure;
  redditCard?: RedditCardConfig;
  voiceoverPath?: string;
  voiceoverStartFrame?: number;
  duration: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  sentenceBgColor: string;
  backgroundOverlayColor: string;
  backgroundMusicPath?: string;
  backgroundVideo: string;
  musicVolume?: number;
  cardPosition?: { x: number; y: number };
  cardSize?: { width: number; height: number };
  storyPosition?: { x: number; y: number };
  storySize?: { width: number; height: number };
};

// ------------------ Main Video ------------------
export const MyRedditVideo: React.FC<MyRedditVideoProps> = ({
  script,
  redditCard,
  voiceoverPath,
  voiceoverStartFrame,
  fontSize,
  fontFamily,
  fontColor,
  sentenceBgColor,
  backgroundOverlayColor,
  backgroundMusicPath,
  musicVolume = 0.15,
  backgroundVideo,
   cardPosition = { x: 50, y: 50 },
  cardSize = { width: 90, height: 45 },
  storyPosition = { x: 50, y: 50 },
  storySize = { width: 90, height: 60 },
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  
  // Safely extract script properties with defaults
  const title = script?.title || "Reddit Post Title";
  const text = script?.text || "Post preview text...";
  const story = script?.story || text;
  const words = script?.words || [];
  
  const bg = backgroundVideo || "https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4";

  const introDuration = (redditCard?.displayDuration || 3) * fps;
  const hasWords = words && words.length > 0;
  
  // Check if voiceover is valid (not empty, not undefined)
  const hasVoiceover = voiceoverPath && voiceoverPath.trim() !== '' && voiceoverPath !== 'undefined';

  // Debug logging
 console.log("🎬 MyRedditVideo Props Received:", {
  hasVoiceover,
  voiceoverPath: voiceoverPath ? voiceoverPath.substring(0, 100) + "..." : "NONE",
  voiceoverType: voiceoverPath?.startsWith('data:') ? 'base64' : voiceoverPath?.startsWith('http') ? 'url' : 'unknown',
  hasWords,
  wordsCount: words.length,
  introDuration,
  totalFrames: durationInFrames,
});

  return (
    <AbsoluteFill>
      {/* Background Video */}
      <Video
        src={bg}
        muted
        loop
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      
      {/* Dark Overlay */}
      <AbsoluteFill style={{ backgroundColor: backgroundOverlayColor || "rgba(0,0,0,0.5)" }} />

      {/* Intro: Reddit Post Card */}
      <Sequence from={0} durationInFrames={introDuration}>
        <RedditPost 
          title={title} 
          text={text} 
          redditCard={redditCard} 
          position={cardPosition}
          size={cardSize}
        />
      </Sequence>

      {/* Story Section - after intro */}
      <Sequence from={voiceoverStartFrame ?? introDuration} durationInFrames={durationInFrames - (voiceoverStartFrame ?? introDuration)}>
        {hasWords ? (
          <SentenceBuilder
            words={words}
            fps={fps}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontColor={fontColor}
            sentenceBgColor={sentenceBgColor}
            position={storyPosition}
            size={storySize}
          />
        ) : (
          <StaticStoryText
            story={story}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontColor={fontColor}
            position={storyPosition}
            size={storySize}
          />
        )}
      </Sequence>

      {/* VOICEOVER AUDIO - Plays after intro */}
      {hasVoiceover && (
  <Sequence from={voiceoverStartFrame ?? introDuration}>
    <Audio 
      src={voiceoverPath} 
      volume={1}
    />
  </Sequence>
)}

      {/* Background Music - Plays throughout */}
      {backgroundMusicPath && backgroundMusicPath.trim() !== '' && (
        <Audio 
          src={backgroundMusicPath} 
          volume={musicVolume} 
          loop 
        />
      )}
    </AbsoluteFill>
  );
};

// ------------------ Reddit Post Card ------------------
const RedditPost: React.FC<{ 
  title: string; 
  text: string; 
  redditCard?: RedditCardConfig;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}> = ({
  title,
  text,
  redditCard,
  position = { x: 50, y: 50 },
  size = { width: 90, height: 45 },
}) => {
  // Extract values with defaults
  const subredditName = redditCard?.subredditName || 'Advice';
  const posterUsername = redditCard?.posterUsername || 'Superb_Community_339';
  const timePosted = redditCard?.timePosted || '1d ago';
  const upvotes = redditCard?.upvotes || '2.9K';
  const commentCount = redditCard?.commentCount || '1.8K';
  const awardsCount = redditCard?.awardsCount || '1';
  const avatarUrl = redditCard?.avatarUrl;
  const titleFontSize = redditCard?.titleFontSize || 38;
  const textFontSize = redditCard?.textFontSize || 24;
  const headerFontSize = redditCard?.headerFontSize || 20;
  const metricsFontSize = redditCard?.metricsFontSize || 18;
  const iconSize = metricsFontSize + 2;
  const avatarSize = headerFontSize * 2;
  const textMaxLength = redditCard?.textMaxLength || 280;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: 40,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${position.x - size.width / 2}%`,
          top: `${position.y - size.height / 2}%`,
          width: `${size.width}%`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      <div
        style={{
          backgroundColor: "white",
          color: "#1a1a1b",
          borderRadius: 16,
          padding: "40px 48px",
          maxWidth: "95%",
          width: "100%",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header Row - Avatar + Subreddit/User + Menu */}
        <div
          style={{ 
            display: "flex", 
            alignItems: "flex-start", 
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Avatar */}
            {avatarUrl ? (
             <img 
                src={avatarUrl} 
                alt="avatar"
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
             <div
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00D8D6 0%, #0079D3 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="5" fill="white"/>
                  <path d="M4 20c0-4 4-7 8-7s8 3 8 7" fill="white"/>
                </svg>
              </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Subreddit + Time */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: headerFontSize + 2, fontWeight: 700, color: "#1a1a1b" }}>
                  r/{subredditName}
                </span>
                <span style={{ fontSize: headerFontSize, color: "#576f76" }}>•</span>
                <span style={{ fontSize: headerFontSize, color: "#576f76" }}>{timePosted}</span>
              </div>
              {/* Username */}
              <span style={{ fontSize: headerFontSize - 2, color: "#576f76", marginTop: 2 }}>
                {posterUsername}
              </span>
            </div>
          </div>

          {/* Three Dots Menu */}
          <div style={{ 
            padding: 8, 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#576f76">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: titleFontSize,
            fontWeight: 700,
            margin: "0 0 20px 0",
            lineHeight: 1.3,
            color: "#1a1a1b",
          }}
        >
          {title?.trim() || "Post Title"}
        </h1>

        {/* Body Text */}
        <p
          style={{
            fontSize: textFontSize,
            lineHeight: 1.65,
            color: "#1a1a1b",
            margin: 0,
          }}
        >
          {(text || "").slice(0, textMaxLength)}
          {(text || "").length > textMaxLength && "..."}
        </p>

        {/* Engagement Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 28,
            paddingTop: 20,
          }}
        >
          {/* Upvote/Downvote Pill */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8,
            backgroundColor: "#f6f7f8",
            borderRadius: 24,
            padding: "10px 16px",
          }}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#576f76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
            <span style={{ fontSize: metricsFontSize, fontWeight: 600, color: "#1a1a1b" }}>{upvotes}</span>
           <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#576f76" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>

          {/* Comments Pill */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8,
            backgroundColor: "#f6f7f8",
            borderRadius: 24,
            padding: "10px 16px",
          }}>
           <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#576f76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ fontSize: metricsFontSize, fontWeight: 500, color: "#576f76" }}>{commentCount}</span>
          </div>

          {/* Awards Pill */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 6,
            backgroundColor: "#f6f7f8",
            borderRadius: 24,
            padding: "10px 16px",
          }}>
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="#FFD700">
              <circle cx="12" cy="9" r="6" fill="#FFD700"/>
              <path d="M8 15l-2 6 6-3 6 3-2-6" fill="#FFD700"/>
            </svg>
            <span style={{ fontSize: metricsFontSize, fontWeight: 500, color: "#576f76" }}>{awardsCount}</span>
          </div>

          {/* Share Pill */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 8,
            backgroundColor: "#f6f7f8",
            borderRadius: 24,
            padding: "10px 16px",
          }}>
           <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#576f76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            <span style={{ fontSize: metricsFontSize, fontWeight: 500, color: "#576f76" }}>Share</span>
          </div>
        </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------ Static Story Text (No Word Timing) ------------------
const StaticStoryText: React.FC<{
  story: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}> = ({ 
  story, 
  fontSize, 
  fontFamily, 
  fontColor,
  position = { x: 50, y: 50 },
  size = { width: 90, height: 60 },
}) => {
  const maxChars = 400;
  const displayText = story.slice(0, maxChars);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${position.x - size.width / 2}%`,
          top: `${position.y - size.height / 2}%`,
          width: `${size.width}%`,
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: 20,
          padding: "40px 50px",
        }}
      >
        <p
          style={{
            fontSize: fontSize || 48,
            fontFamily: fontFamily || "Inter, sans-serif",
            fontWeight: 700,
            color: fontColor || "#ffffff",
            textAlign: "center",
            lineHeight: 1.5,
            margin: 0,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {displayText}
          {story.length > maxChars && "..."}
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ------------------ Sentence Builder (Karaoke Style) ------------------
type SentenceBuilderProps = {
  words: Word[];
  fps: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  sentenceBgColor: string;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
};

const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
  words,
  fps,
  fontSize,
  fontFamily,
  fontColor,
  sentenceBgColor,
  position = { x: 50, y: 50 },
  size = { width: 90, height: 60 },
}) => {
  const frame = useCurrentFrame();

  // Safety check
  if (!words || words.length === 0) return null;

  // Break into lines (8 words per line)
  const wordsPerLine = 8;
  const lines: Word[][] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine));
  }

  // Group lines into blocks of 2
  const lineBlocks: Word[][][] = [];
  for (let i = 0; i < lines.length; i += 2) {
    lineBlocks.push(lines.slice(i, i + 2));
  }

  // Determine active block by frame
  const activeBlockIndex = lineBlocks.findIndex((block) => {
    if (!block[0] || !block[0][0]) return false;
    const startFrame = Math.floor(block[0][0].start * fps);
    const lastLine = block[block.length - 1];
    if (!lastLine || !lastLine[lastLine.length - 1]) return false;
    const endFrame = Math.floor(lastLine[lastLine.length - 1].end * fps);
    return frame >= startFrame && frame <= endFrame;
  });

  if (activeBlockIndex === -1) return null;
  const activeBlock = lineBlocks[activeBlockIndex];

 return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${position.x - size.width / 2}%`,
          top: `${position.y - size.height / 2}%`,
          width: `${size.width}%`,
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: 20,
          padding: "40px 50px",
          textAlign: "center",
          color: fontColor,
          fontSize: fontSize,
          fontFamily: fontFamily,
          fontWeight: 700,
          lineHeight: 1.6,
          textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
        }}
      >
        {activeBlock.map((line, li) => (
          <p
            key={li}
            style={{
              margin: "8px 0",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {line.map((w, i) => {
              const wordStartFrame = Math.floor(w.start * fps);
              if (frame < wordStartFrame) return null;

              const wordEndFrame = Math.floor(w.end * fps);
              const isCurrentWord = frame >= wordStartFrame && frame < wordEndFrame;

              return (
                <span
                  key={i}
                  style={{
                    backgroundColor: isCurrentWord ? sentenceBgColor : "transparent",
                    padding: isCurrentWord ? "4px 10px" : "4px 0",
                    borderRadius: isCurrentWord ? "6px" : undefined,
                    display: "inline-block",
                    transition: "all 0.1s ease",
                  }}
                >
                  {w.word}
                </span>
              );
            })}
          </p>
        ))}
      </div>
    </AbsoluteFill>
  );
};