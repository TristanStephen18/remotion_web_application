import React from "react";
import type { ChatBubbleLayer } from "../remotion_compositions/DynamicLayerComposition";

interface ChatEditorProps {
  layer: ChatBubbleLayer;
  onUpdate: (layerId: string, updates: Partial<ChatBubbleLayer>) => void;
  onDelete: (layerId: string) => void;
}

export const ChatEditor: React.FC<ChatEditorProps> = ({ layer, onUpdate, onDelete }) => {
  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: "#fff" }}>
          Message
        </label>
        <textarea
          value={layer.message}
          onChange={(e) => onUpdate(layer.id, { message: e.target.value })}
          placeholder="Type message..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #444",
            backgroundColor: "#2a2a2a",
            color: "#fff",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: "#fff" }}>
          Sender Name
        </label>
        <input
          type="text"
          value={layer.senderName || ""}
          onChange={(e) => onUpdate(layer.id, { senderName: e.target.value })}
          placeholder="Username"
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #444",
            backgroundColor: "#2a2a2a",
            color: "#fff",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 600, color: "#fff", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={layer.isSender}
            onChange={(e) => onUpdate(layer.id, { isSender: e.target.checked })}
            style={{ marginRight: "8px" }}
          />
          This is your message
        </label>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "8px", color: "#fff" }}>
          Chat Style
        </label>
        <select
          value={layer.chatStyle}
          onChange={(e) => onUpdate(layer.id, { chatStyle: e.target.value as any })}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #444",
            backgroundColor: "#2a2a2a",
            color: "#fff",
          }}
        >
          <option value="fakechatconversation">Fake Chat</option>
          <option value="imessage">iMessage</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="messenger">Messenger</option>
        </select>
      </div>

      <button
        onClick={() => { if (confirm("Delete?")) onDelete(layer.id); }}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Delete Message
      </button>
    </div>
  );
};