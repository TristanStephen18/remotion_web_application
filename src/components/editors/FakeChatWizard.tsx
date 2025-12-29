import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

interface ChatMessage {
  id: string;
  message: string;
  isSender: boolean;
  isTyping?: boolean;
  startFrame: number;
  endFrame: number;
  position: { x: number; y: number };
}

// const uid = () => Math.random().toString(36).slice(2, 9);

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
];

const BG_VIDEO = "https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4";

const FPS = 30;

// ============================================================================
// CHAT BUBBLE - EXACTLY MATCHES DynamicLayerComposition fakechatconversation
// ============================================================================
const ChatBubble: React.FC<{ 
  msg: ChatMessage; 
  senderAvatar: string;
  receiverAvatar: string;
  frame: number; 
  scale: number;
}> = ({ msg, senderAvatar, receiverAvatar, frame, scale }) => {
  // Visibility is now handled by parent filter

  const relativeFrame = frame - msg.startFrame;
  const { isSender, message } = msg;
  
  // Use correct avatar based on sender/receiver
  const avatar = isSender ? senderAvatar : receiverAvatar;

  // Entrance animation (matches DynamicLayerComposition)
  const entranceDuration = 18; // frames
  const entranceProgress = Math.min(relativeFrame / entranceDuration, 1);
  const ease = 1 - Math.pow(1 - entranceProgress, 3); // easeOutCubic
  const entranceOpacity = ease;
  const entranceTranslateY = (1 - ease) * 20;

  // Typing animation for text (matches DynamicLayerComposition)
  const text = message || "";
  const baseDuration = text.length * 0.08;
  const typeDur = Math.max(1.5, Math.min(baseDuration, 5));
  const rawProgress = relativeFrame / (typeDur * FPS);
  const typingProgress = Math.min(
    rawProgress * (1 + Math.sin(rawProgress * Math.PI) * 0.1),
    1
  );
  const charsToShow = Math.floor(text.length * typingProgress);
  const visibleText = text.slice(0, charsToShow);

  // Colors (exactly from DynamicLayerComposition)
  const bubbleColor = isSender ? "#0EA5E9" : "#E5E5EA";
  const textColor = isSender ? "#fff" : "#000";
  const avatarColor = isSender ? "#7C3AED" : "#0EA5E9";

  // Sizes (exactly from DynamicLayerComposition, then scaled)
  const AVATAR_SIZE = 80 * scale;
  const fontSize = 30 * scale;
  const gap = 18 * scale;
  const avatarBorder = 4 * scale;
  const bubbleBorderRadius = 28 * scale;
  const bubblePaddingV = 20 * scale;
  const bubblePaddingH = 28 * scale;
  const minWidth = 200 * scale;
  const maxWidth = 450 * scale;
  const tailSize = 20 * scale;
  const tailOffset = 12 * scale;
  const tailBottom = 16 * scale;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isSender ? "row-reverse" : "row",
        alignItems: "flex-end",
        alignSelf: isSender ? "flex-end" : "flex-start",
        gap: gap,
        opacity: entranceOpacity,
        transform: `translateY(${entranceTranslateY}px)`,
        padding: `0 ${20 * scale}px`,
        width: "max-content",
        maxWidth: "90%",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          minWidth: AVATAR_SIZE,
          minHeight: AVATAR_SIZE,
          flexShrink: 0,
          borderRadius: "50%",
          overflow: "hidden",
          border: `${avatarBorder}px solid ${avatarColor}`,
          backgroundColor: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: avatarColor,
              borderRadius: "50%",
            }}
          />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          minWidth: minWidth,
          maxWidth: maxWidth,
          backgroundColor: bubbleColor,
          color: textColor,
          borderRadius: bubbleBorderRadius,
          padding: `${bubblePaddingV}px ${bubblePaddingH}px`,
          fontSize: fontSize,
          lineHeight: 1.6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 600,
          boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
          position: "relative",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <span>{visibleText}</span>
        
        {/* Tail */}
        <div
          style={{
            position: "absolute",
            bottom: tailBottom,
            width: 0,
            height: 0,
            borderTop: `${tailSize}px solid ${bubbleColor}`,
            ...(isSender
              ? {
                  right: -tailOffset,
                  borderLeft: `${tailSize}px solid transparent`,
                }
              : {
                  left: -tailOffset,
                  borderRight: `${tailSize}px solid transparent`,
                }),
          }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const FakeChatWizard: React.FC = () => {
  const nav = useNavigate();
  const { colors } = useTheme();
  const dk = colors.bgPrimary !== "#ffffff";

  const createMsg = (sender: boolean, text: string, start: number, y: number, typing = false): ChatMessage => ({
    id: `msg-${Date.now()}-${Math.random()}`,
    isSender: sender,
    message: text,
    startFrame: start,
    endFrame: typing ? start + 35 : 300,
    isTyping: typing,
    position: { x: sender ? 65 : 35, y },
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    createMsg(false, "Hey! Check this out 👀", 10, 28),
    createMsg(true, "Omg that's amazing! 🔥", 45, 36),
  ]);
  const [senderAvatar, setSenderAvatar] = useState(PRESET_AVATARS[0]);
  const [receiverAvatar, setReceiverAvatar] = useState(PRESET_AVATARS[1]);
  const [bgOpacity, setBgOpacity] = useState(0.45);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
const [dragOverId, setDragOverId] = useState<string | null>(null);
  const senderFileInputRef = useRef<HTMLInputElement>(null);
  const receiverFileInputRef = useRef<HTMLInputElement>(null);

  const rafRef = useRef<number | null>(null);
  const totalFrames = Math.max(...messages.map(m => m.startFrame + 100), 300);
  const accent = "#0EA5E9";

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last = 0;
    const animate = (t: number) => {
      if (t - last > 33.33) {
        setFrame(f => (f + 1) % totalFrames);
        last = t;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, totalFrames]);

  const handleSenderAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSenderAvatar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiverAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setReceiverAvatar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addMessage = (sender: boolean, typing = false) => {
    const last = messages[messages.length - 1];
    const newY = last ? Math.min(last.position.y + 8, 75) : 28;
    const newMsg = createMsg(sender, typing ? "" : "New message", last ? last.startFrame + 35 : 10, newY, typing);
    setMessages([...messages, newMsg]);
    setSelected(newMsg.id);
  };

  const updateMsg = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(messages.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMsg = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
    if (selected === id) setSelected(null);
  };

 const reorderMessages = (fromId: string, toId: string) => {
    const fromIndex = messages.findIndex(m => m.id === fromId);
    const toIndex = messages.findIndex(m => m.id === toId);
    if (fromIndex === -1 || toIndex === -1) return;
    
    // Swap times
    const fromStart = messages[fromIndex].startFrame;
    const fromEnd = messages[fromIndex].endFrame;
    const toStart = messages[toIndex].startFrame;
    const toEnd = messages[toIndex].endFrame;
    
    const newMessages = [...messages];
    newMessages[fromIndex] = { ...newMessages[fromIndex], startFrame: toStart, endFrame: toEnd };
    newMessages[toIndex] = { ...newMessages[toIndex], startFrame: fromStart, endFrame: fromEnd };
    
    // Reorder array
    const [moved] = newMessages.splice(fromIndex, 1);
    newMessages.splice(toIndex, 0, moved);
    setMessages(newMessages);
  };

  const exportVideo = () => {
    // Calculate Y positions based on visual order (matching flex layout)
    const baseY = 25; // Start at 25% from top (matches wizard preview)
    const gap = 8; // Gap between messages in percentage
    
    const messagesWithPositions = messages.map((msg, index) => ({
      ...msg,
      position: {
        // Sender: X controls right edge (96 = 4% from right)
        // Receiver: X controls left edge (4 = 4% from left)
        x: msg.isSender ? 96 : 4,
        y: baseY + (index * gap),
      }
    }));

    sessionStorage.setItem("fakeChatConfig", JSON.stringify({
      chatStyle: "fakechatconversation",
      messages: messagesWithPositions,
      senderAvatarUrl: senderAvatar,
      receiverAvatarUrl: receiverAvatar,
      backgroundVideoUrl: BG_VIDEO,
      backgroundOpacity: bgOpacity,
      totalFrames,
      timestamp: Date.now(),
    }));
    nav(`/editor?template=9&fromWizard=true&t=${Date.now()}`);
  };

  // Theme
  const surface = dk ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
  const border = dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const text = dk ? "#fff" : "#111";
  const textSoft = dk ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const textMuted = dk ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)";

  const selectedMsg = messages.find(m => m.id === selected);

  // ============================================================================
  // PREVIEW COMPONENT (shared between mobile and desktop)
  // Scale: preview width / composition width (1080)
  // ============================================================================
  const renderPreview = (previewWidth: number) => {
    const scale = previewWidth / 1080;
    return (
      <div style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background Video */}
        <video
          src={BG_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: bgOpacity,
          }}
        />
        {/* Chat Bubbles Container */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "25%",
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "flex-end",
          gap: 12 * scale,
          padding: `0 ${40 * scale}px`,
          maxHeight: "70%",
          overflowY: "auto",
        }}>
          {[...messages]
            .reverse()
            .filter(msg => frame >= msg.startFrame && (!msg.isTyping || frame < msg.endFrame))
            .map(msg => (
              <ChatBubble 
                key={msg.id} 
                msg={msg} 
                senderAvatar={senderAvatar}
                receiverAvatar={receiverAvatar}
                frame={frame} 
                scale={scale} 
              />
            ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // MOBILE LAYOUT
  // ============================================================================
  const renderMobileLayout = () => (
    <div style={{
      height: "100vh",
      maxHeight: "100vh",
      background: dk ? "linear-gradient(180deg, #09090b 0%, #0d0d10 50%, #09090b 100%)" : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
      color: text,
      display: "flex",
      flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: "hidden",
    }}>
      {/* Hidden file inputs */}
      <input ref={senderFileInputRef} type="file" accept="image/*" onChange={handleSenderAvatarUpload} style={{ display: "none" }} />
      <input ref={receiverFileInputRef} type="file" accept="image/*" onChange={handleReceiverAvatarUpload} style={{ display: "none" }} />

      {/* Mobile Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: `1px solid ${border}`,
        background: dk ? "rgba(24, 24, 27, 0.98)" : "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => nav(-1)}>
          <span style={{ fontSize: 16, opacity: 0.6 }}>←</span>
          <span style={{ fontSize: 16, fontWeight: 800, background: `linear-gradient(135deg, ${accent}, #38bdf8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Chat Story</span>
        </div>
        <button onClick={exportVideo} style={{
          padding: "10px 20px",
          fontSize: 13,
          fontWeight: 600,
          borderRadius: 24,
          border: "none",
          background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
          color: "#fff",
          cursor: "pointer",
          boxShadow: `0 4px 16px ${accent}40`,
        }}>
          Create →
        </button>
      </header>

      {/* Mobile Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 12px 12px", gap: 12, overflow: "auto", minHeight: 0 }}>
        
        {/* Preview + Controls Row */}
        <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "stretch", justifyContent: "center" }}>
          
          {/* Phone Preview - 160px wide */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 160,
              aspectRatio: "9/19.5",
              borderRadius: 28,
              background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
              padding: 5,
              boxShadow: dk ? "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(14, 165, 233, 0.25)" : "0 12px 40px rgba(0,0,0,0.2)",
              position: "relative",
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: 24, overflow: "hidden", position: "relative", background: "#000" }}>
                {/* Dynamic Island */}
                <div style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", width: 45, height: 14, background: "#000", borderRadius: 10, zIndex: 20 }} />
                {/* Preview */}
                {renderPreview(160)}
              </div>
            </div>
            {/* Playback Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: dk ? "rgba(39, 39, 42, 0.8)" : "rgba(241, 245, 249, 0.9)", borderRadius: 16, backdropFilter: "blur(10px)" }}>
              <button onClick={() => setPlaying(!playing)} style={{ width: 28, height: 28, borderRadius: "50%", border: "none", background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {playing ? "⏸" : "▶"}
              </button>
              <span style={{ fontSize: 11, color: textSoft, fontWeight: 600 }}>{(frame / 30).toFixed(1)}s</span>
            </div>
          </div>

          {/* Settings Panel */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: 12,
            background: dk ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)",
            borderRadius: 16,
            border: `1px solid ${dk ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)"}`,
            backdropFilter: "blur(20px)",
            width: 150,
          }}>
            {/* Background Intensity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase" }}>Intensity</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{Math.round(bgOpacity * 100)}%</span>
              </div>
              <input type="range" min={10} max={80} value={bgOpacity * 100} onChange={e => setBgOpacity(+e.target.value / 100)} style={{ width: "100%", height: 6, borderRadius: 3, appearance: "none", background: dk ? "#27272a" : "#e2e8f0", outline: "none", cursor: "pointer", accentColor: accent }} />
            </div>
            {/* Add Message Buttons */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: "uppercase", marginBottom: 6 }}>Add Message</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button onClick={() => addMessage(false)} style={{ padding: "6px 0", fontSize: 10, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: dk ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)", color: textSoft }}>+ Their Msg</button>
                <button onClick={() => addMessage(true)} style={{ padding: "6px 0", fontSize: 10, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "#fff" }}>+ Your Msg</button>
                <button onClick={() => addMessage(true, true)} style={{ padding: "6px 0", fontSize: 10, fontWeight: 600, border: "none", borderRadius: 6, cursor: "pointer", background: dk ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}>+ Typing ···</button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div style={{ width: "100%", maxWidth: 380, background: dk ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${dk ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)"}`, padding: 12, overflow: "hidden" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 10 }}>Messages ({messages.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
            {messages.map((msg) => (
              <div key={msg.id} onClick={() => setSelected(msg.id)} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 10,
                background: selected === msg.id ? `${accent}15` : (dk ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)"),
                border: `1px solid ${selected === msg.id ? accent : "transparent"}`,
                cursor: "pointer",
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: msg.isTyping ? "linear-gradient(135deg, #F59E0B, #D97706)" : msg.isSender ? `linear-gradient(135deg, ${accent}, ${accent}aa)` : "linear-gradient(135deg, #6B7280, #4B5563)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 600,
                }}>
                  {msg.isTyping ? "···" : msg.isSender ? "Y" : "T"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {msg.isTyping ? "Typing indicator" : msg.message || "Empty message"}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteMsg(msg.id); }} style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: "none",
                  background: "transparent",
                  color: textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l6 6m0-6l-6 6"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Panel */}
        {selectedMsg && (
          <div style={{ width: "100%", maxWidth: 380, background: dk ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${dk ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)"}`, padding: 12 }}>
            {!selectedMsg.isTyping && (
              <textarea
                value={selectedMsg.message}
                onChange={e => updateMsg(selectedMsg.id, { message: e.target.value })}
                placeholder="Type your message..."
                style={{
                  width: "100%",
                  padding: 10,
                  fontSize: 13,
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                  background: dk ? "rgba(0,0,0,0.3)" : "#fff",
                  color: text,
                  resize: "none",
                  height: 60,
                  outline: "none",
                  marginBottom: 10,
                }}
              />
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 9, color: textMuted, display: "block", marginBottom: 3 }}>Start (frames)</label>
                <input
                  type="number"
                  value={selectedMsg.startFrame}
                  onChange={e => updateMsg(selectedMsg.id, { startFrame: +e.target.value })}
                  style={{ width: "100%", padding: "6px 8px", fontSize: 12, borderRadius: 6, border: `1px solid ${border}`, background: dk ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 9, color: textMuted, display: "block", marginBottom: 3 }}>Position Y (%)</label>
                <input
                  type="number"
                  value={selectedMsg.position.y}
                  onChange={e => updateMsg(selectedMsg.id, { position: { ...selectedMsg.position, y: +e.target.value } })}
                  style={{ width: "100%", padding: "6px 8px", fontSize: 12, borderRadius: 6, border: `1px solid ${border}`, background: dk ? "rgba(0,0,0,0.3)" : "#fff", color: text, outline: "none" }}
                />
              </div>
              <button
                onClick={() => updateMsg(selectedMsg.id, { 
                  isSender: !selectedMsg.isSender,
                  position: { ...selectedMsg.position, x: selectedMsg.isSender ? 35 : 65 }
                })}
                style={{
                  padding: "6px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  borderRadius: 6,
                  border: `1px solid ${border}`,
                  background: "transparent",
                  color: textSoft,
                  cursor: "pointer",
                  alignSelf: "flex-end",
                }}
              >
                ⇄ Swap
              </button>
            </div>
          </div>
        )}

        {/* Avatar Selection */}
        <div style={{ width: "100%", maxWidth: 380, background: dk ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)", borderRadius: 14, border: `1px solid ${dk ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)"}`, padding: 12 }}>
          {/* Your Avatar (Sender) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: accent, marginBottom: 6 }}>Your Avatar</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PRESET_AVATARS.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setSenderAvatar(url)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: senderAvatar === url ? `2px solid ${accent}` : "2px solid transparent",
                  }}
                >
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
              <button
                onClick={() => senderFileInputRef.current?.click()}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `2px dashed ${border}`,
                  background: "transparent",
                  color: textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                +
              </button>
            </div>
          </div>
          {/* Their Avatar (Receiver) */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: textMuted, marginBottom: 6 }}>Their Avatar</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PRESET_AVATARS.map((url, i) => (
                <div
                  key={i}
                  onClick={() => setReceiverAvatar(url)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    overflow: "hidden",
                    cursor: "pointer",
                    border: receiverAvatar === url ? `2px solid ${accent}` : "2px solid transparent",
                  }}
                >
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
              <button
                onClick={() => receiverFileInputRef.current?.click()}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `2px dashed ${border}`,
                  background: "transparent",
                  color: textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes typingBounce { 
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; } 
          40% { transform: scale(1); opacity: 1; } 
        }
        @keyframes blink {
          0%, 100% { opacity: 0 }
          50% { opacity: 1 }
        }
        input[type="range"] {
          height: 4px;
          border-radius: 2px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );

  // ============================================================================
  // DESKTOP LAYOUT
  // ============================================================================
  const renderDesktopLayout = () => (
    <div style={{
      minHeight: "100vh",
      background: dk
        ? "linear-gradient(180deg, #09090b 0%, #0d0d10 50%, #09090b 100%)"
        : "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)",
      color: text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Hidden file inputs */}
      <input ref={senderFileInputRef} type="file" accept="image/*" onChange={handleSenderAvatarUpload} style={{ display: "none" }} />
      <input ref={receiverFileInputRef} type="file" accept="image/*" onChange={handleReceiverAvatarUpload} style={{ display: "none" }} />

      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: `1px solid ${border}`,
        background: dk ? "rgba(24, 24, 27, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
          onClick={() => nav(-1)}
        >
          <span style={{ fontSize: 18, opacity: 0.6 }}>←</span>
          <span style={{
            fontSize: 20,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${accent}, #38bdf8)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Chat Story Creator
          </span>
        </div>
        <button
          onClick={exportVideo}
          style={{
            padding: "14px 32px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 30,
            border: "none",
            background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
            color: "#fff",
            cursor: "pointer",
            boxShadow: `0 4px 20px ${accent}40`,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Continue to Editor →
        </button>
      </header>

      <main style={{
        display: "flex",
        justifyContent: "center",
        gap: 48,
        padding: "48px",
        maxWidth: 1400,
        margin: "0 auto",
        minHeight: "calc(100vh - 80px)",
      }}>

        {/* LEFT: Phone Preview - 320px wide */}
        <div style={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "sticky",
          top: 120,
          height: "fit-content",
        }}>
          <div style={{
            width: 320,
            aspectRatio: "9/19.5",
            borderRadius: 48,
            background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
            padding: 8,
            boxShadow: `
              0 50px 100px -20px rgba(0,0,0,0.5),
              0 30px 60px -30px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.1)
            `,
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: 40,
              overflow: "hidden",
              position: "relative",
              background: "#000",
            }}>
              {/* Dynamic Island */}
              <div style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 90,
                height: 28,
                background: "#000",
                borderRadius: 20,
                zIndex: 10,
              }} />

              {/* Preview */}
              {renderPreview(320)}
            </div>
          </div>

          {/* Floating Playback */}
          <div style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "12px 20px",
            background: dk ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: `1px solid ${border}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <button
              onClick={() => { setPlaying(!playing); !playing && setFrame(0); }}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 16px ${accent}50`,
              }}
            >
              {playing ? (
                <svg width="18" height="18" fill="currentColor"><rect x="4" y="4" width="4" height="12" rx="1"/><rect x="12" y="4" width="4" height="12" rx="1"/></svg>
              ) : (
                <svg width="18" height="18" fill="currentColor"><path d="M6 4l10 7-10 7V4z"/></svg>
              )}
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <input
                type="range"
                min={0}
                max={totalFrames}
                value={frame}
                onChange={e => setFrame(+e.target.value)}
                style={{ width: 200, accentColor: accent }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: textMuted }}>
                <span>{(frame / 30).toFixed(1)}s</span>
                <span>{(totalFrames / 30).toFixed(1)}s</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Controls Panel */}
        <div style={{
          flex: "0 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: 500,
        }}>

          {/* Settings Card */}
          <div style={{
            background: dk ? "rgba(30, 30, 35, 0.95)" : "rgba(255, 255, 255, 0.95)",
            borderRadius: 20,
            border: `1px solid ${dk ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.1)"}`,
            padding: 24,
            backdropFilter: "blur(20px)",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 16 }}>Settings</div>

            {/* Your Avatar (Sender) */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: accent, marginBottom: 10 }}>Your Avatar</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PRESET_AVATARS.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setSenderAvatar(url)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: senderAvatar === url ? `3px solid ${accent}` : "3px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
                <button
                  onClick={() => senderFileInputRef.current?.click()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: `2px dashed ${border}`,
                    background: "transparent",
                    color: textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted; }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Their Avatar (Receiver) */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textMuted, marginBottom: 10 }}>Their Avatar</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {PRESET_AVATARS.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => setReceiverAvatar(url)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      overflow: "hidden",
                      cursor: "pointer",
                      border: receiverAvatar === url ? `3px solid ${accent}` : "3px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
                <button
                  onClick={() => receiverFileInputRef.current?.click()}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: `2px dashed ${border}`,
                    background: "transparent",
                    color: textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = textMuted; }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Background Intensity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: textMuted }}>Background Intensity</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: accent }}>{Math.round(bgOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                value={bgOpacity * 100}
                onChange={e => setBgOpacity(+e.target.value / 100)}
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  appearance: "none",
                  background: dk ? "#27272a" : "#e2e8f0",
                  outline: "none",
                  cursor: "pointer",
                  accentColor: accent,
                }}
              />
            </div>
          </div>

          {/* Add Message Buttons */}
          <div style={{
            display: "flex",
            gap: 12,
          }}>
            {[
              { label: "Their Message", sender: false, typing: false, bg: dk ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)", color: textSoft },
              { label: "Your Message", sender: true, typing: false, bg: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "#fff" },
            ].map((opt, i) => (
              <button
                key={i}
                onClick={() => addMessage(opt.sender, opt.typing)}
                style={{
                  flex: 1,
                  padding: "14px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: "none",
                  background: opt.bg,
                  color: opt.color,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                + {opt.label}
              </button>
            ))}
          </div>

          {/* Messages List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px 12px" }}>
            {messages.map((m) => (
              <div
                key={m.id}
                draggable
                onDragStart={() => setDraggedId(m.id)}
                onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                onDragOver={(e) => { e.preventDefault(); setDragOverId(m.id); }}
                onDragLeave={() => setDragOverId(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedId && draggedId !== m.id) reorderMessages(draggedId, m.id);
                  setDraggedId(null);
                  setDragOverId(null);
                }}
                onClick={() => setSelected(m.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  marginBottom: 6,
                  borderRadius: 12,
                  cursor: draggedId ? "grabbing" : "grab",
                  transition: "all 0.15s",
                  background: selected === m.id ? `${accent}15` : surface,
                  border: `1px solid ${dragOverId === m.id && draggedId !== m.id ? accent : selected === m.id ? `${accent}50` : "transparent"}`,
                  opacity: draggedId === m.id ? 0.5 : 1,
                  transform: dragOverId === m.id && draggedId !== m.id ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: m.isSender 
                    ? `linear-gradient(135deg, ${accent}, ${accent}aa)` 
                    : "linear-gradient(135deg, #6B7280, #4B5563)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {m.isSender ? "Y" : "T"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {m.message || "Empty message"}
                  </div>
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>
                    {(m.startFrame / 30).toFixed(1)}s · #{messages.findIndex(msg => msg.id === m.id) + 1}
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); deleteMsg(m.id); }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: "none",
                    background: "transparent",
                    color: textMuted,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#EF444420";
                    e.currentTarget.style.color = "#EF4444";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = textMuted;
                  }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8m0-8l-8 8"/></svg>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Panel */}
          {selectedMsg && (
            <div style={{
              padding: 16,
              borderTop: `1px solid ${border}`,
              background: surface,
              borderRadius: 12,
            }}>
              {!selectedMsg.isTyping && (
                <textarea
                  value={selectedMsg.message}
                  onChange={e => updateMsg(selectedMsg.id, { message: e.target.value })}
                  placeholder="Type your message..."
                  style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 14,
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    background: dk ? "rgba(0,0,0,0.3)" : "#fff",
                    color: text,
                    resize: "none",
                    height: 70,
                    outline: "none",
                    marginBottom: 12,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = accent}
                  onBlur={e => e.currentTarget.style.borderColor = border}
                />
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Start (s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={(selectedMsg.startFrame / 30).toFixed(1)}
                    onChange={e => updateMsg(selectedMsg.id, { startFrame: Math.round(+e.target.value * 30) })}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      fontSize: 13,
                      borderRadius: 8,
                      border: `1px solid ${border}`,
                      background: dk ? "rgba(0,0,0,0.3)" : "#fff",
                      color: text,
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Order</label>
                  <div style={{
                    padding: "8px 10px",
                    fontSize: 13,
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: dk ? "rgba(0,0,0,0.3)" : "#fff",
                    color: textMuted,
                    textAlign: "center",
                  }}>
                    {messages.findIndex(m => m.id === selectedMsg.id) + 1} of {messages.length}
                  </div>
                </div>
                <button
                  onClick={() => updateMsg(selectedMsg.id, { 
                    isSender: !selectedMsg.isSender,
                    position: { ...selectedMsg.position, x: selectedMsg.isSender ? 35 : 65 }
                  })}
                  style={{
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: "transparent",
                    color: textSoft,
                    cursor: "pointer",
                    alignSelf: "flex-end",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${accent}20`;
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.color = accent;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.color = textSoft;
                  }}
                >
                  ⇄ Swap
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes typingBounce { 
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; } 
          40% { transform: scale(1); opacity: 1; } 
        }
        @keyframes blink {
          0%, 100% { opacity: 0 }
          50% { opacity: 1 }
        }
        input[type="range"] {
          height: 4px;
          border-radius: 2px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );

  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

export default FakeChatWizard;