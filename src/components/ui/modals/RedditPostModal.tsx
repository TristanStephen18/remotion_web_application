import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

interface RedditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (imageUrl: string) => void;
}

export const RedditPostModal: React.FC<RedditPostModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
}) => {
  const [subreddit, setSubreddit] = useState("AskReddit");
  const [username, setUsername] = useState("Anonymous");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [upvotes, setUpvotes] = useState(12500);
  const [comments, setComments] = useState(342);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const postRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a post title");
      return;
    }

    setIsGenerating(true);
    try {
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (postRef.current) {
        const canvas = await html2canvas(postRef.current, {
          backgroundColor: theme === "dark" ? "#1a1a1b" : "#ffffff",
          scale: 2,
        });
        
        const imageUrl = canvas.toDataURL("image/png");
        onGenerate(imageUrl);
        toast.success("Reddit post generated!");
        onClose();
      }
    } catch (error) {
      console.error("Error generating Reddit post:", error);
      toast.error("Failed to generate Reddit post");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  const isDark = theme === "dark";

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
      overflowY: "auto" as const,
      padding: "20px",
    },
    modal: {
      backgroundColor: "#1a1a1a",
      borderRadius: "12px",
      padding: "24px",
      width: "90%",
      maxWidth: "700px",
      maxHeight: "90vh",
      overflowY: "auto" as const,
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
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "20px",
    },
    section: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "600",
      color: "#888",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      outline: "none",
    },
    textarea: {
      width: "100%",
      minHeight: "100px",
      padding: "12px",
      backgroundColor: "#0f0f0f",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px",
      color: "#e5e5e5",
      fontSize: "14px",
      fontFamily: "inherit",
      resize: "vertical" as const,
      outline: "none",
    },
    themeToggle: {
      display: "flex",
      gap: "8px",
    },
    themeButton: {
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
    themeButtonActive: {
      backgroundColor: "rgba(255, 69, 0, 0.1)",
      borderColor: "#ff4500",
      color: "#ff4500",
    },
    previewSection: {
      marginTop: "24px",
      marginBottom: "20px",
    },
    previewLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#e5e5e5",
      marginBottom: "12px",
    },
    redditPost: {
      backgroundColor: isDark ? "#1a1a1b" : "#ffffff",
      border: `1px solid ${isDark ? "#343536" : "#ccc"}`,
      borderRadius: "4px",
      padding: "12px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    },
    postHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "8px",
      fontSize: "12px",
      color: isDark ? "#818384" : "#7c7c7c",
    },
    subredditName: {
      color: isDark ? "#d7dadc" : "#1c1c1c",
      fontWeight: "700",
    },
    postTitle: {
      fontSize: "18px",
      fontWeight: "500",
      color: isDark ? "#d7dadc" : "#1c1c1c",
      marginBottom: "8px",
      lineHeight: "22px",
    },
    postContent: {
      fontSize: "14px",
      color: isDark ? "#d7dadc" : "#1c1c1c",
      lineHeight: "21px",
      marginBottom: "8px",
    },
    postFooter: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      fontSize: "12px",
      fontWeight: "700",
      color: isDark ? "#818384" : "#7c7c7c",
      marginTop: "8px",
    },
    upvoteButton: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      marginTop: "24px",
    },
    button: {
      flex: 1,
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s",
      border: "none",
    },
    cancelButton: {
      backgroundColor: "transparent",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#888",
    },
    generateButton: {
      background: "linear-gradient(135deg, #ff4500 0%, #ff5722 100%)",
      color: "white",
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="9" cy="10" r="1" />
              <circle cx="15" cy="10" r="1" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 11.5c0 2.21-1.79 4-4 4h-3c-2.21 0-4-1.79-4-4v-.5c0-.28.22-.5.5-.5s.5.22.5.5v.5c0 1.66 1.34 3 3 3h3c1.66 0 3-1.34 3-3v-.5c0-.28.22-.5.5-.5s.5.22.5.5v.5z" />
            </svg>
            Create Reddit Post
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

        <div style={styles.formGrid}>
          <div style={styles.section}>
            <label style={styles.label}>Subreddit</label>
            <input
              type="text"
              style={styles.input}
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              placeholder="AskReddit"
            />
          </div>
          <div style={styles.section}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Anonymous"
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Post Title</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's the most interesting fact you know?"
          />
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Post Content (Optional)</label>
          <textarea
            style={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add post content here..."
          />
        </div>

        <div style={styles.formGrid}>
          <div style={styles.section}>
            <label style={styles.label}>Upvotes</label>
            <input
              type="number"
              style={styles.input}
              value={upvotes}
              onChange={(e) => setUpvotes(parseInt(e.target.value) || 0)}
            />
          </div>
          <div style={styles.section}>
            <label style={styles.label}>Comments</label>
            <input
              type="number"
              style={styles.input}
              value={comments}
              onChange={(e) => setComments(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>Theme</label>
          <div style={styles.themeToggle}>
            <button
              style={{
                ...styles.themeButton,
                ...(theme === "light" ? styles.themeButtonActive : {}),
              }}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              style={{
                ...styles.themeButton,
                ...(theme === "dark" ? styles.themeButtonActive : {}),
              }}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        <div style={styles.previewSection}>
          <div style={styles.previewLabel}>Preview</div>
          <div ref={postRef} style={styles.redditPost}>
            <div style={styles.postHeader}>
              <span style={styles.subredditName}>r/{subreddit}</span>
              <span>•</span>
              <span>Posted by u/{username}</span>
              <span>•</span>
              <span>2h ago</span>
            </div>
            <div style={styles.postTitle}>{title || "Your post title here..."}</div>
            {content && <div style={styles.postContent}>{content}</div>}
            <div style={styles.postFooter}>
              <div style={styles.upvoteButton}>
                <span>↑</span>
                <span>{upvotes.toLocaleString()}</span>
                <span>↓</span>
              </div>
              <span>💬 {comments} Comments</span>
              <span>↗️ Share</span>
              <span>🔖 Save</span>
            </div>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            Cancel
          </button>
          <button
            style={{ ...styles.button, ...styles.generateButton }}
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
            onMouseOver={(e) => {
              if (!isGenerating && title.trim()) {
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isGenerating ? "Generating..." : "Generate Screenshot"}
          </button>
        </div>
      </div>
    </div>
  );
};