import React, { useRef, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface EraserModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  existingMask?: string;
  onSave: (maskDataUrl: string) => void;
}

export const EraserModal: React.FC<EraserModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  existingMask,
  onSave,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [mode, setMode] = useState<'erase' | 'restore'>('erase');
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Step 1: Load the image
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    let cancelled = false;

    const loadImage = async () => {
      setImageLoaded(false);
      setImageReady(false);
      setLoadError(null);
      setLoadingStatus('Loading image...');

      console.log('[Eraser] Starting to load:', imageSrc.substring(0, 100));

      // Helper to load image from URL
      const loadFromUrl = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load'));
          img.src = url;
        });
      };

      // Helper to fetch via proxy
      const fetchViaProxy = async (originalUrl: string): Promise<string> => {
        const proxies = [
          `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`,
          `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(originalUrl)}`,
        ];

        for (const proxyUrl of proxies) {
          try {
            setLoadingStatus('Fetching image...');
            console.log('[Eraser] Trying proxy:', proxyUrl.substring(0, 60));
            
            const response = await fetch(proxyUrl);
            if (!response.ok) continue;

            const blob = await response.blob();
            console.log('[Eraser] Got blob:', blob.size, 'bytes');
            return URL.createObjectURL(blob);
          } catch (e) {
            continue;
          }
        }
        throw new Error('All proxies failed');
      };

      try {
        let img: HTMLImageElement;

        if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
          setLoadingStatus('Loading local image...');
          img = await loadFromUrl(imageSrc);
        } else if (imageSrc.startsWith('http')) {
          try {
            const blobUrl = await fetchViaProxy(imageSrc);
            setLoadingStatus('Processing...');
            img = await loadFromUrl(blobUrl);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
          } catch {
            setLoadingStatus('Trying direct load...');
            img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error('Load failed'));
              img.src = imageSrc;
            });
          }
        } else {
          img = await loadFromUrl(imageSrc);
        }

        if (!cancelled) {
          console.log('[Eraser] Image loaded:', img.width, 'x', img.height);
          imageRef.current = img;
          
          const maxWidth = window.innerWidth * 0.75;
          const maxHeight = window.innerHeight * 0.6;
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
          
          setCanvasSize({
            width: Math.floor(img.width * scale),
            height: Math.floor(img.height * scale),
          });
          setImageReady(true);
        }
      } catch (e) {
        console.error('[Eraser] Load error:', e);
        if (!cancelled) {
          setLoadError('Cannot load this image. Please try re-adding it from the media gallery.');
        }
      }
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [isOpen, imageSrc]);

  // Step 2: Setup canvas when image is ready AND refs are available
  useEffect(() => {
    if (!imageReady || !isOpen) return;
    
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    
    if (!img || !canvas || !maskCanvas) {
      console.log('[Eraser] Refs not ready, retrying...');
      const timer = setTimeout(() => {
        // Force re-run by toggling imageReady
        setImageReady(false);
        setTimeout(() => setImageReady(true), 10);
      }, 100);
      return () => clearTimeout(timer);
    }

    console.log('[Eraser] Setting up canvas:', img.width, 'x', img.height);
    setLoadingStatus('Setting up canvas...');

    canvas.width = img.width;
    canvas.height = img.height;
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;

    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      if (existingMask) {
        const maskImg = new Image();
        maskImg.onload = () => {
          maskCtx.drawImage(maskImg, 0, 0);
          setImageLoaded(true);
          console.log('[Eraser] Ready with existing mask');
        };
        maskImg.onerror = () => {
          maskCtx.fillStyle = 'white';
          maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
          setImageLoaded(true);
        };
        maskImg.src = existingMask;
      } else {
        maskCtx.fillStyle = 'white';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        setImageLoaded(true);
        console.log('[Eraser] Ready');
      }
    }
  }, [imageReady, isOpen, existingMask]);

  // Update display
  const updateDisplay = useCallback(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const img = imageRef.current;
    if (!canvas || !maskCanvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Checkerboard
    const patternSize = 20;
    for (let x = 0; x < canvas.width; x += patternSize) {
      for (let y = 0; y < canvas.height; y += patternSize) {
        ctx.fillStyle = ((Math.floor(x / patternSize) + Math.floor(y / patternSize)) % 2 === 0) ? '#3a3a3a' : '#2a2a2a';
        ctx.fillRect(x, y, patternSize, patternSize);
      }
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(img, 0, 0);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(maskCanvas, 0, 0);

    ctx.drawImage(tempCanvas, 0, 0);
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      updateDisplay();
    }
  }, [imageLoaded, updateDisplay]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const draw = useCallback((x: number, y: number) => {
    const maskCanvas = maskCanvasRef.current;
    const canvas = canvasRef.current;
    if (!maskCanvas || !canvas) {
      console.log('[Eraser] Draw: no canvas refs');
      return;
    }

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) {
      console.log('[Eraser] Draw: no mask context');
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const scaledBrush = brushSize * scale;

    console.log('[Eraser] Drawing at', x, y, 'brush:', scaledBrush, 'mode:', mode);

    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.lineWidth = scaledBrush;
    
    // Use globalCompositeOperation for better erasing
    if (mode === 'erase') {
      maskCtx.globalCompositeOperation = 'destination-out';
      maskCtx.strokeStyle = 'rgba(0,0,0,1)';
      maskCtx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.strokeStyle = 'white';
      maskCtx.fillStyle = 'white';
    }

    if (lastPosRef.current) {
      maskCtx.beginPath();
      maskCtx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      maskCtx.lineTo(x, y);
      maskCtx.stroke();
    } else {
      maskCtx.beginPath();
      maskCtx.arc(x, y, scaledBrush / 2, 0, Math.PI * 2);
      maskCtx.fill();
    }

    // Reset composite operation
    maskCtx.globalCompositeOperation = 'source-over';

    lastPosRef.current = { x, y };
    updateDisplay();
  }, [brushSize, mode, updateDisplay]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    console.log('[Eraser] Mouse down');
    setIsDrawing(true);
    lastPosRef.current = null;
    const coords = getCanvasCoords(e);
    console.log('[Eraser] Coords:', coords);
    draw(coords.x, coords.y);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    draw(coords.x, coords.y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const handleReset = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    updateDisplay();
  };

  const handleClearMask = () => {
    onSave('');
    onClose();
  };

  const handleSave = () => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const maskDataUrl = maskCanvas.toDataURL('image/png');
    onSave(maskDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          backgroundColor: '#1f2937',
          borderRadius: 12,
          overflow: 'hidden',
          maxWidth: '90vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #374151',
          }}
        >
          <h3 style={{ margin: 0, color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🧽</span> Eraser Tool
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: 20,
              cursor: 'pointer',
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 20px',
            backgroundColor: '#111827',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setMode('erase')}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: mode === 'erase' ? '#ef4444' : '#374151',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              🧽 Erase
            </button>
            <button
              onClick={() => setMode('restore')}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: mode === 'restore' ? '#22c55e' : '#374151',
                color: '#fff',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              🖌️ Restore
            </button>
          </div>

          <div style={{ width: 1, height: 24, backgroundColor: '#374151' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 200 }}>
            <span style={{ color: '#9ca3af', fontSize: 13, whiteSpace: 'nowrap' }}>Brush:</span>
            <input
              type="range"
              min="5"
              max="150"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              style={{ flex: 1, accentColor: '#3b82f6' }}
            />
            <span style={{ color: '#fff', fontSize: 13, minWidth: 40, textAlign: 'right' }}>{brushSize}px</span>
          </div>

          <div style={{ width: 1, height: 24, backgroundColor: '#374151' }} />

          <button
            onClick={handleReset}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #374151',
              backgroundColor: 'transparent',
              color: '#9ca3af',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ↺ Reset
          </button>

          {existingMask && (
            <button
              onClick={handleClearMask}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: '1px solid #7f1d1d',
                backgroundColor: 'transparent',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              🗑️ Remove Mask
            </button>
          )}
        </div>

        {/* Canvas Area */}
        <div
          style={{
            backgroundColor: '#000',
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            overflow: 'auto',
            minHeight: 300,
            position: 'relative',
          }}
        >
          {loadError ? (
            <div style={{ color: '#ef4444', fontSize: 14, textAlign: 'center', padding: 40, maxWidth: 400 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <div>{loadError}</div>
            </div>
          ) : !imageLoaded ? (
            <div style={{ color: '#9ca3af', fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                border: '3px solid #374151', 
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'eraser-spin 1s linear infinite',
              }} />
              <div>{loadingStatus}</div>
              <style>{`
                @keyframes eraser-spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : null}
          
          {/* Always render canvases but hide until ready */}
          <canvas
            ref={canvasRef}
            style={{
              width: canvasSize.width,
              height: canvasSize.height,
              cursor: 'crosshair',
              borderRadius: 4,
              display: imageLoaded && !loadError ? 'block' : 'none',
              position: 'relative',
              zIndex: 10,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          />
          <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
        </div>

        {/* Brush Preview */}
        <div
          style={{
            padding: '8px 20px',
            backgroundColor: '#111827',
            borderTop: '1px solid #374151',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ color: '#6b7280', fontSize: 12 }}>Brush preview:</span>
          <div
            style={{
              width: Math.min(brushSize, 50),
              height: Math.min(brushSize, 50),
              borderRadius: '50%',
              backgroundColor: mode === 'erase' ? '#ef4444' : '#22c55e',
              opacity: 0.7,
            }}
          />
          <span style={{ color: '#6b7280', fontSize: 12, marginLeft: 'auto' }}>
            Tip: Use Restore mode to bring back accidentally erased areas
          </span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            padding: '16px 20px',
            borderTop: '1px solid #374151',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #374151',
              backgroundColor: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!imageLoaded || !!loadError}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: !imageLoaded || loadError ? '#374151' : '#3b82f6',
              color: '#fff',
              cursor: !imageLoaded || loadError ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 500,
              opacity: !imageLoaded || loadError ? 0.5 : 1,
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EraserModal;