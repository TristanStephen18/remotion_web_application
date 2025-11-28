import React, { useState } from 'react';
import { 
  ChevronLeft,
  Upload,
  Captions,
  Type,
  AudioLines,
  Film,
  Wand2,
  Undo2,
  Redo2,
  Scissors,
  Trash2,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Minus,
  Plus,
  FileText,
  Sparkles
} from 'lucide-react';

type TabType = 'media' | 'subtitles' | 'text' | 'audio' | 'video' | 'tools';

interface Track {
  id: string;
  name: string;
  type: 'text' | 'video' | 'audio';
  color: string;
  bgColor: string;
  start: number;
  end: number;
}

const Template: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('subtitles');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(7.4);
  const [zoom, setZoom] = useState(50);
  const [projectName] = useState('streamer video');

  const totalDuration = 57.42;
  const visibleDuration = 30;

  const tabs = [
    { id: 'media' as TabType, icon: Upload, label: 'Media' },
    { id: 'subtitles' as TabType, icon: Captions, label: 'Subtitles' },
    { id: 'text' as TabType, icon: Type, label: 'Text' },
    { id: 'audio' as TabType, icon: AudioLines, label: 'Audio' },
    { id: 'video' as TabType, icon: Film, label: 'Video' },
    { id: 'tools' as TabType, icon: Wand2, label: 'Tools' },
  ];

  const tracks: Track[] = [
    { 
      id: '1', 
      name: 'This kid has to be stopped', 
      type: 'text',
      color: '#10B981',
      bgColor: '#D1FAE5',
      start: 0,
      end: 100
    },
    { 
      id: '2', 
      name: 'video', 
      type: 'video',
      color: '#A855F7',
      bgColor: '#F3E8FF',
      start: 0,
      end: 50
    },
    { 
      id: '3', 
      name: 'video', 
      type: 'video',
      color: '#A855F7',
      bgColor: '#F3E8FF',
      start: 0,
      end: 100
    },
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
  };

  const timeMarkers = [0, 5, 10, 15, 20, 25, 30];

  const renderPanelContent = () => {
    switch (activeTab) {
      case 'subtitles':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Subtitles</h2>
            
            {/* AI Subtitles Option */}
            <div className="p-4 border border-gray-200 rounded-xl mb-4 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200 group">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                <Sparkles size={20} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Subtitles</h3>
              <p className="text-sm text-gray-500">Automatically recognize speech and add subtitles</p>
            </div>

            {/* Manual Subtitles Option */}
            <div className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200 group">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                <Captions size={20} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Manual Subtitles</h3>
              <p className="text-sm text-gray-500">Add subtitles manually with custom timing</p>
            </div>
          </div>
        );
      case 'media':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Media Library</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer">
              <Upload size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Upload Media</p>
              <p className="text-sm text-gray-400 mt-1">Drag & drop or click to browse</p>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Text</h2>
            <div className="space-y-3">
              {['Heading', 'Subheading', 'Body Text', 'Caption'].map((type) => (
                <div key={type} className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                  <p className="font-medium text-gray-700">{type}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Audio</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-all cursor-pointer">
              <AudioLines size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Add Audio</p>
              <p className="text-sm text-gray-400 mt-1">Music, voiceover, sound effects</p>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Video Settings</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl">
                <p className="font-medium text-gray-700 mb-2">Aspect Ratio</p>
                <div className="flex gap-2">
                  {['9:16', '16:9', '1:1', '4:5'].map((ratio) => (
                    <button key={ratio} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ratio === '9:16' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tools</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Crop', 'Trim', 'Speed', 'Filters', 'Effects', 'Transitions'].map((tool) => (
                <div key={tool} className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-center">
                  <p className="font-medium text-gray-700">{tool}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-['Inter',system-ui,sans-serif]">
      {/* Left Sidebar - Navigation */}
      <div className="w-[72px] bg-white border-r border-gray-200 flex flex-col items-center py-4">
        {/* Back Button */}
        <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all mb-6">
          <ChevronLeft size={20} />
        </button>

        {/* Navigation Tabs */}
        <nav className="flex flex-col items-center gap-1 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Left Panel - Content */}
      <div className="w-[340px] border-r border-gray-200 bg-white overflow-y-auto">
        {renderPanelContent()}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          {/* Project Name */}
          <div className="flex items-center gap-2">
            <span className="text-gray-900 font-medium">{projectName}</span>
            <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </button>
          </div>

          {/* Export Button */}
          <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40">
            Export Video
          </button>
        </div>

        {/* Video Preview Area */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl" style={{ width: '280px', aspectRatio: '9/16' }}>
            {/* Mock Video Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-400 to-sky-300">
              {/* Clouds */}
              <div className="absolute top-8 left-4 w-16 h-8 bg-white rounded-full opacity-90" />
              <div className="absolute top-12 left-12 w-12 h-6 bg-white rounded-full opacity-80" />
              <div className="absolute top-6 right-8 w-20 h-10 bg-white rounded-full opacity-85" />
            </div>
            
            {/* Text Overlay */}
            <div className="absolute top-12 left-0 right-0 text-center px-4">
              <p className="text-white text-2xl font-bold drop-shadow-lg leading-tight">
                This kid has to<br />be stopped
              </p>
            </div>

            {/* Person placeholder */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-64">
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 bg-emerald-500 rounded-t-3xl" />
              <div className="absolute bottom-44 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-200 rounded-full" />
            </div>

            {/* Bottom text overlay */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded text-lg">
                panel,
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white border-t border-gray-200">
          {/* Timeline Controls */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
            {/* Left Controls */}
            <div className="flex items-center gap-1">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Undo">
                <Undo2 size={18} />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-1" />
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Redo">
                <Redo2 size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Cut">
                <Scissors size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>

            {/* Center - Playback Controls */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Previous">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all" title="Next">
                <SkipForward size={20} fill="currentColor" />
              </button>
              
              {/* Timestamp */}
              <div className="ml-4 text-sm font-mono text-gray-600">
                <span className="text-gray-900">{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

            {/* Right - Zoom Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setZoom(Math.max(0, zoom - 10))}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-24 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <button 
                onClick={() => setZoom(Math.min(100, zoom + 10))}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus size={16} />
              </button>
              <span className="text-sm text-gray-500 ml-2">Fit</span>
            </div>
          </div>

          {/* Timeline Ruler */}
          <div className="h-8 flex items-end border-b border-gray-100 relative" style={{ marginLeft: '120px' }}>
            {timeMarkers.map((time) => (
              <div 
                key={time} 
                className="absolute bottom-0 flex flex-col items-center"
                style={{ left: `${(time / visibleDuration) * 100}%` }}
              >
                <span className="text-xs text-gray-400 mb-1">{time}s</span>
                <div className="w-px h-2 bg-gray-300" />
              </div>
            ))}
            
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 z-10 flex flex-col items-center"
              style={{ left: `${(currentTime / visibleDuration) * 100}%` }}
            >
              <div className="w-3 h-3 bg-blue-500 rotate-45 transform -translate-y-0.5" />
            </div>
          </div>

          {/* Timeline Tracks */}
          <div className="relative min-h-[180px]">
            {/* Playhead Line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20"
              style={{ left: `calc(120px + ${(currentTime / visibleDuration) * (100% - 120)}%)`, marginLeft: `${(currentTime / visibleDuration) * 100}%` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20"
              style={{ left: `calc(120px + ((100% - 120px) * ${currentTime / visibleDuration}))` }}
            />

            {/* Tracks */}
            {tracks.map((track, index) => (
              <div key={track.id} className="flex items-center h-12 border-b border-gray-100">
                {/* Track Label */}
                <div className="w-[120px] px-4 flex items-center gap-2 shrink-0">
                  {track.type === 'text' ? (
                    <FileText size={14} className="text-emerald-500" />
                  ) : (
                    <Film size={14} className="text-purple-500" />
                  )}
                  <span className="text-xs text-gray-600 truncate">{track.type}</span>
                </div>
                
                {/* Track Content */}
                <div className="flex-1 h-full relative py-1.5 pr-4">
                  <div
                    className="absolute top-1.5 bottom-1.5 rounded-md flex items-center px-3 cursor-pointer hover:brightness-95 transition-all"
                    style={{ 
                      left: `${track.start}%`,
                      width: `${track.end - track.start}%`,
                      backgroundColor: track.bgColor,
                      borderLeft: `3px solid ${track.color}`
                    }}
                  >
                    {track.type === 'text' ? (
                      <FileText size={12} className="text-emerald-600 mr-2 shrink-0" />
                    ) : (
                      <Film size={12} className="text-purple-600 mr-2 shrink-0" />
                    )}
                    <span 
                      className="text-xs font-medium truncate"
                      style={{ color: track.color }}
                    >
                      {track.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Vertical Playhead Line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-20 pointer-events-none"
              style={{ left: `calc(120px + (100% - 120px) * ${currentTime / visibleDuration})` }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;