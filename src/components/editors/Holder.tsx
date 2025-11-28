



import React, { useState, useRef, useEffect, type MouseEvent } from 'react';
import { Film, Upload, Type, Volume2, FileVideo, Scissors, Play, Pause, SkipBack, SkipForward, Maximize2, type LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  icon: LucideIcon;
  label: string;
}

type PhoneStyle = 'iphone' | 'android';
type TabType = 'project' | 'cloud';

export default function VideoEditor() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration] = useState<number>(300); // 5 minutes in seconds
  const [activeTab, setActiveTab] = useState<TabType>('project');
  const [activeTool, setActiveTool] = useState<string>('media');
  const [playheadPosition, setPlayheadPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [phoneStyle, setPhoneStyle] = useState<PhoneStyle>('iphone');
  const timelineRef = useRef<HTMLDivElement>(null);

  const tools: Tool[] = [
    { id: 'media', icon: Film, label: 'Media' },
    { id: 'subtitles', icon: FileVideo, label: 'Subtitles' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'audio', icon: Volume2, label: 'Audio' },
    { id: 'video', icon: Scissors, label: 'Video' },
  ];

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleTimelineClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(Math.max(0, Math.min(newTime, duration)));
    setPlayheadPosition(percentage * 100);
  };

  const handlePlayPause = (): void => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          const newTime = prev + 0.1;
          setPlayheadPosition((newTime / duration) * 100);
          return newTime;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  const handleMouseMove = (e: globalThis.MouseEvent): void => {
    if (isDragging) {
      handleTimelineClick(e as any);
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="video-editor">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .video-editor {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          display: flex;
          flex-direction: column;
          font-family: 'DM Sans', sans-serif;
          color: #1e293b;
          overflow: hidden;
          position: relative;
        }

        .video-editor::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(14, 165, 233, 0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .main-container {
          display: flex;
          flex: 1;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }

        /* Sidebar */
        .sidebar {
          width: 80px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          gap: 8px;
        }

        .tool-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 12px;
          margin: 0 12px;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .tool-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1));
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 12px;
        }

        .tool-button:hover::before {
          opacity: 1;
        }

        .tool-button:hover {
          color: #3b82f6;
          transform: translateY(-2px);
        }

        .tool-button.active {
          color: #3b82f6;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1));
        }

        .tool-button svg {
          width: 24px;
          height: 24px;
          margin-bottom: 6px;
          position: relative;
          z-index: 1;
        }

        .tool-label {
          font-size: 11px;
          font-weight: 500;
          position: relative;
          z-index: 1;
          letter-spacing: 0.3px;
        }

        /* Content Area */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .tabs-header {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 20px 24px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .tab {
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s;
          position: relative;
        }

        .tab:hover {
          color: #334155;
          background: rgba(148, 163, 184, 0.08);
        }

        .tab.active {
          color: #3b82f6;
          background: rgba(99, 102, 241, 0.08);
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #0ea5e9);
        }

        .workspace {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .upload-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .upload-area {
          text-align: center;
          padding: 60px;
          border: 2px dashed rgba(148, 163, 184, 0.4);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .upload-area:hover {
          border-color: #3b82f6;
          background: rgba(239, 246, 255, 0.8);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15);
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          color: #3b82f6;
          opacity: 0.6;
          transition: all 0.3s;
        }

        .upload-area:hover .upload-icon {
          opacity: 1;
          transform: scale(1.1);
        }

        .upload-text {
          font-size: 16px;
          color: #64748b;
          font-weight: 500;
        }

        .upload-text span {
          color: #3b82f6;
          cursor: pointer;
        }

        /* Preview Panel */
        .preview-panel {
          width: 400px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          padding: 20px 12px 12px;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          padding: 0 8px;
          flex-shrink: 0;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .video-title {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .phone-selector {
          display: flex;
          gap: 6px;
          background: rgba(241, 245, 249, 0.8);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        .phone-option {
          padding: 6px 12px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          border-radius: 7px;
          transition: all 0.2s;
          position: relative;
        }

        .phone-option::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 7px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(14, 165, 233, 0.1));
          opacity: 0;
          transition: opacity 0.2s;
        }

        .phone-option:hover::before {
          opacity: 1;
        }

        .phone-option:hover {
          color: #3b82f6;
        }

        .phone-option.active {
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          color: white;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.25);
        }

        .phone-option.active::before {
          opacity: 0;
        }

        .export-button {
          padding: 8px 16px;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
          white-space: nowrap;
        }

        .export-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
        }

        .video-preview {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 0;
          padding: 8px;
        }

        .phone-mockup {
          position: relative;
          height: 100%;
          width: auto;
          aspect-ratio: 9 / 19.5;
          background: #000;
          border-radius: 48px;
          padding: 14px;
          box-shadow: 0 30px 100px rgba(0, 0, 0, 0.35),
                      0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .phone-mockup.android {
          border-radius: 42px;
        }

        .phone-screen {
          width: 100%;
          height: 100%;
          background: #000;
          border-radius: 36px;
          overflow: hidden;
          position: relative;
        }

        .phone-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 40%, 
            transparent 60%, 
            rgba(255, 255, 255, 0.05) 100%);
          pointer-events: none;
          z-index: 20;
        }

        .phone-mockup.android .phone-screen {
          border-radius: 32px;
        }

        /* iPhone Notch */
        .phone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 160px;
          height: 30px;
          background: #000;
          border-radius: 0 0 20px 20px;
          z-index: 10;
          transition: all 0.3s;
        }

        .phone-mockup.android .phone-notch {
          width: 120px;
          height: 24px;
          border-radius: 0 0 12px 12px;
        }

        /* Dynamic Island style for iPhone */
        .dynamic-island {
          position: absolute;
          top: 1.5%;
          left: 50%;
          transform: translateX(-50%);
          width: 28%;
          height: 4%;
          background: #1a1a1a;
          border-radius: 18px;
          z-index: 11;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .phone-mockup.android .dynamic-island {
          width: 7%;
          aspect-ratio: 1;
          height: auto;
          border-radius: 50%;
          top: 1.8%;
          background: #0a0a0a;
          box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.4);
        }

        /* Phone buttons */
        .phone-button {
          position: absolute;
          background: #1a1a1a;
          border-radius: 2px;
        }

        .power-button {
          right: -3px;
          top: 25%;
          width: 3px;
          height: 12%;
        }

        .volume-button {
          left: -3px;
          top: 22%;
          width: 3px;
          height: 7%;
        }

        .volume-button-2 {
          left: -3px;
          top: 31%;
          width: 3px;
          height: 7%;
        }

        .phone-mockup.android .power-button {
          right: -3px;
          top: 27%;
          height: 9%;
        }

        .phone-mockup.android .volume-button {
          left: -3px;
          top: 25%;
          height: 6%;
        }

        .phone-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        }

        @keyframes phoneTransition {
          0% {
            opacity: 0.7;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .phone-mockup {
          animation: phoneTransition 0.3s ease-out;
        }



        /* Timeline */
        .timeline-container {
          height: 200px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          padding: 16px;
          position: relative;
          z-index: 2;
        }

        .playback-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .control-button {
          width: 36px;
          height: 36px;
          border: none;
          background: rgba(241, 245, 249, 0.8);
          color: #64748b;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .control-button:hover {
          background: rgba(219, 234, 254, 0.8);
          color: #3b82f6;
        }

        .control-button.play {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6366f1, #0ea5e9);
          color: white;
        }

        .control-button.play:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .time-display {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: #475569;
          letter-spacing: 1px;
        }

        .timeline-wrapper {
          position: relative;
          height: 80px;
          background: rgba(248, 250, 252, 0.8);
          border-radius: 8px;
          overflow: hidden;
        }

        .timeline-ruler {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 24px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          background: rgba(241, 245, 249, 0.9);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }

        .time-marker {
          position: absolute;
          font-size: 10px;
          color: #94a3b8;
          font-family: 'Space Mono', monospace;
        }

        .timeline-track {
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          bottom: 0;
          cursor: pointer;
        }

        .timeline-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
        }

        .playhead {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #3b82f6, #2563eb);
          left: ${playheadPosition}%;
          transition: ${isDragging ? 'none' : 'left 0.1s linear'};
          pointer-events: none;
          z-index: 10;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .playhead::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.6);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sidebar, .content-area, .preview-panel {
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
        }

        .sidebar {
          animation-delay: 0.1s;
        }

        .content-area {
          animation-delay: 0.2s;
        }

        .preview-panel {
          animation-delay: 0.3s;
        }

        .timeline-container {
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s backwards;
        }
      `}</style>

      <div className="main-container">
        {/* Sidebar */}
        <div className="sidebar">
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <tool.icon />
              <span className="tool-label">{tool.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="tabs-header">
            <button
              className={`tab ${activeTab === 'project' ? 'active' : ''}`}
              onClick={() => setActiveTab('project')}
            >
              Project Uploads
            </button>
            <button
              className={`tab ${activeTab === 'cloud' ? 'active' : ''}`}
              onClick={() => setActiveTab('cloud')}
            >
              Cloud Uploads
            </button>
          </div>

          <div className="workspace">
            <div className="upload-section">
              <div className="upload-area">
                <Upload className="upload-icon" />
                <p className="upload-text">
                  There's nothing yet.<br />
                  <span>Click here to upload a file</span>
                </p>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="preview-panel">
              <div className="preview-header">
                <div className="header-left">
                  <span className="video-title">Untitled Video</span>
                </div>
                <div className="header-right">
                  <div className="phone-selector">
                    <button 
                      className={`phone-option ${phoneStyle === 'iphone' ? 'active' : ''}`}
                      onClick={() => setPhoneStyle('iphone')}
                    >
                      iPhone
                    </button>
                    <button 
                      className={`phone-option ${phoneStyle === 'android' ? 'active' : ''}`}
                      onClick={() => setPhoneStyle('android')}
                    >
                      Android
                    </button>
                  </div>
                  <button className="export-button">Export Video</button>
                </div>
              </div>
              <div className="video-preview">
                <div className={`phone-mockup ${phoneStyle}`}>
                  {phoneStyle === 'iphone' ? (
                    <div className="dynamic-island" />
                  ) : (
                    <div className="dynamic-island" />
                  )}
                  
                  <div className="phone-button power-button" />
                  <div className="phone-button volume-button" />
                  {phoneStyle === 'iphone' && <div className="phone-button volume-button-2" />}
                  
                  <div className="phone-screen">
                    <div className="phone-content">
                      {/* Video content goes here */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-container">
        <div className="playback-controls">
          <button className="control-button">
            <SkipBack size={16} />
          </button>
          <button className="control-button play" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="control-button">
            <SkipForward size={16} />
          </button>
          <span className="time-display">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button className="control-button">
            <Maximize2 size={16} />
          </button>
        </div>

        <div
          className="timeline-wrapper"
          ref={timelineRef}
          onMouseDown={handleMouseDown}
        >
          <div className="timeline-ruler">
            {[0, 5, 10, 15, 20, 25, 30, 35].map((time) => (
              <span
                key={time}
                className="time-marker"
                style={{ left: `${(time / 35) * 100}%` }}
              >
                {time}s
              </span>
            ))}
          </div>
          <div className="timeline-track">
            <div className="timeline-placeholder">Click to add elements</div>
          </div>
          <div className="playhead" />
        </div>
      </div>
    </div>
  );
}