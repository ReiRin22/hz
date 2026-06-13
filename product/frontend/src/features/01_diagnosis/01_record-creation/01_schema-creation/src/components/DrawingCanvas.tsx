import React, { useRef, useEffect, useState, useCallback } from 'react';

export type Tool = 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'spray';

interface DrawingCanvasProps {
  tool: Tool;
  color: string;
  brushSize: number;
  templateComponent?: React.ReactNode;
  onCanvasChange?: () => void;
  imageToLoad?: string | null;
}

interface DrawingState {
  canvas: ImageData | null;
}

export default function DrawingCanvas({ 
  tool, 
  color, 
  brushSize, 
  templateComponent,
  onCanvasChange,
  imageToLoad
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState({ active: false, x: 0, y: 0, text: '' });
  const [loadedImageUrl, setLoadedImageUrl] = useState<string | null>(null);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ canvas: imageData });
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onCanvasChange?.();
  }, [history, historyIndex, onCanvasChange]);

  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const prevState = history[historyIndex - 1];
      if (prevState.canvas) {
        ctx.putImageData(prevState.canvas, 0, 0);
        setHistoryIndex(historyIndex - 1);
      }
    }
  }, [history, historyIndex]);

  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const nextState = history[historyIndex + 1];
      if (nextState.canvas) {
        ctx.putImageData(nextState.canvas, 0, 0);
        setHistoryIndex(historyIndex + 1);
      }
    }
  }, [history, historyIndex]);

  // Clear canvas
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save state to history (template remains as overlay)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ canvas: imageData });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Flip canvas horizontally
  const flipHorizontal = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Get current canvas content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create temporary canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.putImageData(imageData, 0, 0);

    // Clear main canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Flip and draw
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(tempCanvas, -canvas.width, 0);
    ctx.restore();

    saveToHistory();
  }, [saveToHistory]);

  // Flip canvas vertically
  const flipVertical = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Get current canvas content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Create temporary canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.putImageData(imageData, 0, 0);

    // Clear main canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Flip and draw
    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(tempCanvas, 0, -canvas.height);
    ctx.restore();

    saveToHistory();
  }, [saveToHistory]);

  // Initialize canvas - separate from history management to avoid infinite loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;

    // Initialize with transparent background (so template shows through)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save initial state to history (template will be rendered as overlay)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([{ canvas: imageData }]);
    setHistoryIndex(0);
  }, []); // Remove templateComponent from dependencies to prevent reinit on template change

  // Load image if provided
  useEffect(() => {
    if (imageToLoad && imageToLoad !== loadedImageUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const img = new Image();
      img.src = imageToLoad;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveToHistory();
      };
      setLoadedImageUrl(imageToLoad);
    }
  }, [imageToLoad, loadedImageUrl, saveToHistory]);

  // Get mouse position relative to canvas
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);
    
    if (tool === 'text') {
      setTextInput({ active: true, x: pos.x, y: pos.y, text: '' });
      return;
    }

    setIsDrawing(true);
    setStartPos(pos);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';

    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tool === 'spray') {
      sprayPaint(ctx, pos.x, pos.y);
    }
  };

  // Draw function
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);

    if (tool === 'pen') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (tool === 'spray') {
      sprayPaint(ctx, pos.x, pos.y);
    }
  };

  // Stop drawing
  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);

    if (tool === 'rectangle') {
      ctx.strokeRect(
        Math.min(startPos.x, pos.x),
        Math.min(startPos.y, pos.y),
        Math.abs(pos.x - startPos.x),
        Math.abs(pos.y - startPos.y)
      );
    } else if (tool === 'circle') {
      const radius = Math.sqrt(
        Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
      );
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
    setIsDrawing(false);
    saveToHistory();
  };

  // Spray paint effect
  const sprayPaint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const sprayRadius = brushSize * 2;
    const density = brushSize;

    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * sprayRadius;
      const offsetY = (Math.random() - 0.5) * sprayRadius;
      
      ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
  };

  // Handle text input
  const handleTextSubmit = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !textInput.text) return;

    ctx.fillStyle = color;
    ctx.font = `${brushSize * 4}px Arial`;
    ctx.fillText(textInput.text, textInput.x, textInput.y);
    
    setTextInput({ active: false, x: 0, y: 0, text: '' });
    saveToHistory();
  };

  // Expose functions to parent
  useEffect(() => {
    (window as any).canvasUndo = undo;
    (window as any).canvasRedo = redo;
    (window as any).canvasClear = clear;
    (window as any).canvasFlipHorizontal = flipHorizontal;
    (window as any).canvasFlipVertical = flipVertical;
    (window as any).canvasSave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL('image/png');
    };
  }, [undo, redo, clear, flipHorizontal, flipVertical]);

  return (
    <div className="relative inline-block bg-white border-2 border-dashed border-gray-300">
      {/* Template overlay - positioned behind canvas */}
      {templateComponent && (
        <div 
          className="absolute top-0 left-0 pointer-events-none z-0"
          style={{ width: '400px', height: '400px' }}
        >
          <div className="w-full h-full flex items-center justify-center opacity-40">
            {templateComponent}
          </div>
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        className="cursor-crosshair relative z-10"
        style={{ display: 'block' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      {textInput.active && (
        <div 
          className="absolute bg-white border rounded p-2 shadow-lg"
          style={{ 
            left: textInput.x, 
            top: textInput.y,
            zIndex: 20
          }}
        >
          <input
            type="text"
            value={textInput.text}
            onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTextSubmit();
              if (e.key === 'Escape') setTextInput({ active: false, x: 0, y: 0, text: '' });
            }}
            placeholder="テキストを入力"
            className="border rounded px-2 py-1 text-sm"
            autoFocus
          />
          <div className="flex gap-1 mt-1">
            <button 
              onClick={handleTextSubmit}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              OK
            </button>
            <button 
              onClick={() => setTextInput({ active: false, x: 0, y: 0, text: '' })}
              className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}