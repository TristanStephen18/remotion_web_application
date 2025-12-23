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

const uid = () => Math.random().toString(36).slice(2, 9);

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
];

const BG_VIDEO = "https://res.cloudinary.com/dcu9xuof0/video/upload/v1765260195/Subway_Surfers_2024_-_Gameplay_4K_9x16_No_Copyright_n4ym8w.mp4";

// ============================================================================
// CHAT BUBBLE
// ============================================================================
const ChatBubble: React.FC<{ msg: ChatMessage; avatar: string; frame: number; scale: number }> = ({ msg, avatar, frame, scale }) => {
  if (frame < msg.startFrame || (msg.isTyping && frame >= msg.endFrame)) return null;
  
  const rel = frame - msg.startFrame;
  const progress = Math.min(rel / 18, 1);
  const ease = 1 - Math.pow(1 - progress, 3);
  const { isSender, isTyping, message } = msg;

  const text = message || "";
  const typeProgress = Math.min(rel / (Math.max(1.2, text.length * 0.06) * 30), 1);
  const visibleText = text.slice(0, Math.floor(text.length * typeProgress));

  const bubbleColor = isSender ? "#0EA5E9" : "#E5E5EA";
  const textColor = isSender ? "#fff" : "#000";
  const ringColor = isSender ? "#8B5CF6" : "#0EA5E9";

  return (
    <div style={{
      position: "absolute",
      left: `${msg.position.x}%`,
      top: `${msg.position.y}%`,
      transform: `translate(-50%, -50%) translateY(${(1 - ease) * 24}px)`,
      opacity: ease,
      display: "flex",
      flexDirection: isSender ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 12 * scale,
    }}>
      <div style={{
        width: 64 * scale,
        height: 64 * scale,
        borderRadius: "50%",
        padding: 3 * scale,
        background: `linear-gradient(135deg, ${ringColor}, ${ringColor}88)`,
        boxShadow: `0 4px 20px ${ringColor}40`,
      }}>
        <img src={avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
      </div>
      <div style={{
        maxWidth: 180 * scale,
        background: isSender ? "linear-gradient(135deg, #0EA5E9, #0284C7)" : bubbleColor,
        color: textColor,
        borderRadius: 22 * scale,
        padding: `${14 * scale}px ${20 * scale}px`,
        fontSize: 24 * scale,
        fontWeight: 600,
        lineHeight: 1.4,
        boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
        position: "relative",
      }}>
        {isTyping ? (
          <div style={{ display: "flex", gap: 4 * scale, padding: `${4 * scale}px 0` }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 8 * scale, height: 8 * scale, borderRadius: "50%",
                background: textColor, opacity: 0.8,
                animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
              }} />
            ))}
          </div>
        ) : visibleText}
        <div style={{
          position: "absolute",
          bottom: 12 * scale,
          [isSender ? "right" : "left"]: -8 * scale,
          width: 0, height: 0,
          borderTop: `${12 * scale}px solid ${isSender ? "#0EA5E9" : bubbleColor}`,
          [isSender ? "borderLeft" : "borderRight"]: `${12 * scale}px solid transparent`,
        }} />
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createMsg = (sender: boolean, text: string, start: number, y: number, typing = false): ChatMessage => ({
    id: uid(),
    message: text,
    isSender: sender,
    isTyping: typing,
    startFrame: start,
    endFrame: typing ? start + 35 : 9999,
    position: { x: sender ? 72 : 28, y },
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    createMsg(false, "Hey! Check this out 👀", 10, 28),
    createMsg(true, "", 45, 46, true),
    createMsg(true, "Omg that's amazing! 🔥", 80, 64),
  ]);
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [bgOpacity, setBgOpacity] = useState(0.45);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const rafRef = useRef<number | null>(null);
  const totalFrames = Math.max(...messages.map(m => m.startFrame + 100), 300);
  const accent = "#0EA5E9";

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

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setAvatar(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addMessage = (sender: boolean, typing = false) => {
    const last = messages[messages.length - 1];
    const newMsg = createMsg(sender, typing ? "" : "New message", last ? last.startFrame + 35 : 10, last ? Math.min(last.position.y + 18, 82) : 28, typing);
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

  const exportVideo = () => {
    sessionStorage.setItem("fakeChatConfig", JSON.stringify({
      chatStyle: "fakechatconversation",
      messages,
      avatarUrl: avatar,
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

  return (
    <div style={{
      height: "100vh",
      background: dk ? "#0A0A0B" : "#F8F9FA",
      color: text,
      display: "flex",
      flexDirection: "column",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        style={{ display: "none" }}
      />

      {/* Header */}
      <header style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 24px",
        gap: 20,
        background: dk ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${border}`,
      }}>
        <button onClick={() => nav(-1)} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "none", border: "none", color: textSoft,
          cursor: "pointer", fontSize: 14, fontWeight: 500,
        }}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          Back
        </button>

        <div style={{ width: 1, height: 24, background: border }} />

        <h1 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Text Story Creator</h1>

        <div style={{ flex: 1 }} />

        <div style={{ fontSize: 13, color: textMuted }}>
          {messages.length} messages · {(totalFrames / 30).toFixed(1)}s
        </div>

        <button onClick={exportVideo} style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          fontSize: 14,
          fontWeight: 600,
          borderRadius: 10,
          border: "none",
          background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
          color: "#fff",
          cursor: "pointer",
          boxShadow: `0 4px 14px ${accent}40`,
        }}>
          Create Video →
        </button>
      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Preview */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          position: "relative",
          background: dk 
            ? "radial-gradient(ellipse at center, #1a1a2e 0%, #0A0A0B 70%)"
            : "radial-gradient(ellipse at center, #fff 0%, #f0f0f0 70%)",
        }}>
          {/* Phone */}
          <div style={{
            height: "min(85vh, 640px)",
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

              {/* Background Video */}
              <video
                src={BG_VIDEO}
                autoPlay loop muted playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: bgOpacity,
                  filter: "brightness(0.6) saturate(1.1)",
                }}
              />

              {/* Messages */}
              {messages.map(m => (
                <ChatBubble key={m.id} msg={m} avatar={avatar} frame={frame} scale={0.5} />
              ))}
            </div>
          </div>

          {/* Floating Playback */}
          <div style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
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

        {/* Right Panel */}
        <div style={{
          width: 360,
          display: "flex",
          flexDirection: "column",
          background: dk ? "rgba(255,255,255,0.02)" : "#fff",
          borderLeft: `1px solid ${border}`,
        }}>
          {/* Avatar Section */}
          <div style={{ padding: 20, borderBottom: `1px solid ${border}` }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
              Avatar
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {/* Current Avatar (large) */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  padding: 3,
                  background: `linear-gradient(135deg, ${accent}, #8B5CF6)`,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <img src={avatar} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0"}
                >
                  <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 5l3 3m-3-3l-9 9v3h3l9-9m-3-3l3 3"/></svg>
                </div>
              </div>

              {/* Preset Avatars */}
              {PRESET_AVATARS.map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    padding: 2,
                    background: avatar === a ? `linear-gradient(135deg, ${accent}, #8B5CF6)` : "transparent",
                    border: "none",
                    cursor: "pointer",
                    opacity: avatar === a ? 1 : 0.6,
                    transition: "all 0.2s",
                  }}
                >
                  <img src={a} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                </button>
              ))}

              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: `2px dashed ${border}`,
                  background: "transparent",
                  color: textMuted,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = border;
                  e.currentTarget.style.color = textMuted;
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>

            {/* Background Opacity */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: textSoft }}>Background Intensity</span>
                <span style={{ fontSize: 12, color: textMuted }}>{Math.round(bgOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                value={bgOpacity * 100}
                onChange={e => setBgOpacity(+e.target.value / 100)}
                style={{ width: "100%", accentColor: accent }}
              />
            </div>
          </div>

          {/* Add Message */}
          <div style={{ padding: "12px 20px", borderBottom: `1px solid ${border}` }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "Their Message", sender: false, typing: false },
                { label: "Your Message", sender: true, typing: false },
                { label: "Typing ···", sender: true, typing: true },
              ].map(opt => (
                <button
                  key={opt.label}
                  onClick={() => addMessage(opt.sender, opt.typing)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 10,
                    border: `1px dashed ${border}`,
                    background: "transparent",
                    color: textSoft,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.color = accent;
                    e.currentTarget.style.background = `${accent}10`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = border;
                    e.currentTarget.style.color = textSoft;
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  + {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages List */}
          <div style={{ flex: 1, overflow: "auto", padding: "8px 12px" }}>
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelected(m.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  marginBottom: 6,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: selected === m.id ? `${accent}15` : surface,
                  border: `1px solid ${selected === m.id ? `${accent}50` : "transparent"}`,
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: m.isTyping 
                    ? "linear-gradient(135deg, #F59E0B, #D97706)" 
                    : m.isSender 
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
                  {m.isTyping ? "···" : m.isSender ? "Y" : "T"}
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
                    {m.isTyping ? "Typing indicator" : m.message || "Empty message"}
                  </div>
                  <div style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>
                    {(m.startFrame / 30).toFixed(1)}s · Y: {m.position.y}%
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
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Start (frames)</label>
                  <input
                    type="number"
                    value={selectedMsg.startFrame}
                    onChange={e => updateMsg(selectedMsg.id, { startFrame: +e.target.value })}
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
                  <label style={{ fontSize: 10, color: textMuted, display: "block", marginBottom: 4 }}>Position Y (%)</label>
                  <input
                    type="number"
                    value={selectedMsg.position.y}
                    onChange={e => updateMsg(selectedMsg.id, { position: { ...selectedMsg.position, y: +e.target.value } })}
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
                <button
                  onClick={() => updateMsg(selectedMsg.id, { isSender: !selectedMsg.isSender, position: { ...selectedMsg.position, x: selectedMsg.isSender ? 28 : 72 } })}
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
        @keyframes pulse {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        input[type="range"] {
          height: 4px;
          border-radius: 2px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default FakeChatWizard;