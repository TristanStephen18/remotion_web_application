import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

interface EmojiPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  "😀 Smileys": [
    "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇",
    "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝",
    "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄",
    "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧",
  ],
  "❤️ Hearts": [
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞",
    "💓", "💗", "💖", "💘", "💝", "💟",
  ],
  "👍 Gestures": [
    "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙",
    "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏",
    "🙌", "👐", "🤲", "🤝", "🙏",
  ],
  "🎉 Symbols": [
    "💯", "💢", "💥", "💫", "💦", "💨", "🕳", "💬", "👁️‍🗨️", "🗨", "🗯", "💭", "💤",
    "🔥", "⭐", "🌟", "✨", "💥", "💫", "💢", "💦", "💨", "🎉", "🎊", "🎈", "🎁",
  ],
  "🐶 Animals": [
    "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷",
    "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴",
    "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦗", "🕷", "🦂", "🐢", "🐍", "🦎",
  ],
  "🍕 Food": [
    "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥",
    "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🌽", "🥕", "🧄", "🧅", "🥔",
    "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓",
    "🍕", "🍔", "🌭", "🥪", "🌮", "🌯", "🍿", "🧂", "🥗", "🍱",
  ],
  "⚽ Sports": [
    "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸",
    "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋",
    "🎽", "🛹", "🛼", "🛷", "⛸", "🥌", "🎿", "⛷", "🏂",
  ],
  "✈️ Travel": [
    "🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛",
    "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍", "🛺", "🚨", "🚔", "🚍", "🚘",
    "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆",
    "✈️", "🛫", "🛬", "🚁", "🛩", "🚀", "🛸",
  ],
};

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("😀 Smileys");
  const [selectedSize, setSelectedSize] = useState("medium");

  const filteredEmojis = useMemo(() => {
    if (!searchTerm) {
      return EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES] || [];
    }

    // Simple search across all emojis
    const allEmojis = Object.values(EMOJI_CATEGORIES).flat();
    return allEmojis;
  }, [searchTerm, selectedCategory]);

  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    toast.success(`Added ${emoji} emoji`);
    onClose();
  };

  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      padding: "24px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column" as const,
      border: "1px solid rgba(255,255,255,0.1)",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    title: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#e5e5e5",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#888",
      fontSize: "24px",
      cursor: "pointer",
      padding: "4px",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "6px",
      transition: "all 0.2s",
    },
    searchBox: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      outline: "none",
      marginBottom: "16px",
    },
    categoryTabs: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
      overflowX: "auto" as const,
      paddingBottom: "8px",
    },
    categoryTab: {
      padding: "8px 16px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      whiteSpace: "nowrap" as const,
    },
    categoryTabActive: {
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "#f59e0b",
      color: "#f59e0b",
    },
    emojiGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))",
      gap: "8px",
      overflowY: "auto" as const,
      maxHeight: "400px",
      padding: "8px",
      marginBottom: "16px",
    },
    emojiButton: {
      width: "50px",
      height: "50px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      fontSize: "28px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sizeSection: {
      marginTop: "auto",
      paddingTop: "16px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
    },
    sizeLabel: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#888",
      marginBottom: "8px",
    },
    sizeButtons: {
      display: "flex",
      gap: "8px",
    },
    sizeButton: {
      flex: 1,
      padding: "10px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    sizeButtonActive: {
      backgroundColor: "rgba(245, 158, 11, 0.1)",
      borderColor: "#f59e0b",
      color: "#f59e0b",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
            Emoji Picker
          </div>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ×
          </button>
        </div>

        <input
          type="text"
          style={styles.searchBox}
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {!searchTerm && (
          <div style={styles.categoryTabs}>
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                style={{
                  ...styles.categoryTab,
                  ...(selectedCategory === category ? styles.categoryTabActive : {}),
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div style={styles.emojiGrid}>
          {filteredEmojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              style={styles.emojiButton}
              onClick={() => handleEmojiSelect(emoji)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.backgroundColor = "rgba(245, 158, 11, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#0f0f0f";
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div style={styles.sizeSection}>
          <div style={styles.sizeLabel}>Emoji Size</div>
          <div style={styles.sizeButtons}>
            {["small", "medium", "large"].map((size) => (
              <button
                key={size}
                style={{
                  ...styles.sizeButton,
                  ...(selectedSize === size ? styles.sizeButtonActive : {}),
                }}
                onClick={() => setSelectedSize(size)}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .emoji-grid::-webkit-scrollbar {
          width: 8px;
        }
        .emoji-grid::-webkit-scrollbar-track {
          background: #0f0f0f;
          border-radius: 4px;
        }
        .emoji-grid::-webkit-scrollbar-thumb {
          background: #f59e0b;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};