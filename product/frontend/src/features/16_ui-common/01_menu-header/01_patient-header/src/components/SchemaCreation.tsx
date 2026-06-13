import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Slider } from "@/shared/components/atoms/slider";
import { Separator } from "@/shared/components/atoms/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/components/atoms/toggle-group";
import { 
  Palette,
  Save,
  FolderOpen,
  Undo,
  Redo,
  Trash,
  Pen,
  Minus,
  Circle,
  Type,
  Image as ImageIcon,
  FlipHorizontal,
  FlipVertical
} from "lucide-react";
import { toast } from "sonner";

interface SchemaCreationProps {
  onSave?: (imageData: string) => void;
  isEmbedded?: boolean;
  onCancel?: () => void;
}

export function SchemaCreation({ onSave, isEmbedded = false, onCancel }: SchemaCreationProps) {
  // Canvas and drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("全身");
  const [lineColor, setLineColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState([2]);
  const [drawingMode, setDrawingMode] = useState("フリーハンド");
  const [textInput, setTextInput] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  // Color presets
  const colorPresets = ["#000000", "#FF0000", "#0000FF", "#00AA00"];

  // Template options
  const templateOptions = ["全身", "顔", "手", "足", "胴"];

  // Drawing mode options
  const drawingModeOptions = [
    { value: "フリーハンド", label: "フリーハンド", icon: Pen },
    { value: "直線", label: "直線", icon: Minus },
    { value: "円", label: "円", icon: Circle },
    { value: "テキスト", label: "テキスト", icon: Type }
  ];

  // Initialize canvas
  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on mode
    if (isEmbedded) {
      canvas.width = 700;
      canvas.height = 500;
    } else {
      canvas.width = 800;
      canvas.height = 600;
    }

    // Set initial background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load template background based on selected template
    loadTemplateBackground();
  }, [selectedTemplate, isEmbedded]);

  // Load template background
  const loadTemplateBackground = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw simple template outlines based on selection
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    switch (selectedTemplate) {
      case "全身":
        // Draw full body outline
        ctx.beginPath();
        // Head
        ctx.arc(400, 80, 40, 0, 2 * Math.PI);
        // Body
        ctx.rect(360, 120, 80, 150);
        // Arms
        ctx.moveTo(360, 150);
        ctx.lineTo(320, 220);
        ctx.moveTo(440, 150);
        ctx.lineTo(480, 220);
        // Legs
        ctx.moveTo(375, 270);
        ctx.lineTo(375, 400);
        ctx.moveTo(425, 270);
        ctx.lineTo(425, 400);
        ctx.stroke();
        break;
      
      case "顔":
        // Draw face outline
        ctx.beginPath();
        ctx.arc(400, 300, 120, 0, 2 * Math.PI);
        // Eyes
        ctx.moveTo(360, 280);
        ctx.arc(360, 280, 15, 0, 2 * Math.PI);
        ctx.moveTo(450, 280);
        ctx.arc(440, 280, 15, 0, 2 * Math.PI);
        // Nose
        ctx.moveTo(400, 300);
        ctx.lineTo(400, 320);
        // Mouth
        ctx.moveTo(370, 340);
        ctx.quadraticCurveTo(400, 360, 430, 340);
        ctx.stroke();
        break;

      case "手":
        // Draw hand outline
        ctx.beginPath();
        // Palm
        ctx.roundRect(350, 250, 100, 150, 20);
        // Fingers
        for (let i = 0; i < 4; i++) {
          ctx.roundRect(360 + i * 20, 200, 15, 60, 8);
        }
        // Thumb
        ctx.roundRect(320, 280, 15, 50, 8);
        ctx.stroke();
        break;

      case "足":
        // Draw foot outline
        ctx.beginPath();
        // Foot
        ctx.ellipse(400, 350, 80, 120, 0, 0, 2 * Math.PI);
        // Toes
        for (let i = 0; i < 5; i++) {
          ctx.arc(360 + i * 20, 280, 8, 0, 2 * Math.PI);
        }
        ctx.stroke();
        break;

      case "胴":
        // Draw torso outline
        ctx.beginPath();
        // Chest/torso
        ctx.ellipse(400, 300, 100, 150, 0, 0, 2 * Math.PI);
        // Shoulder line
        ctx.moveTo(300, 200);
        ctx.lineTo(500, 200);
        ctx.stroke();
        break;
    }

    ctx.setLineDash([]);
    toast.success(`${selectedTemplate}テンプレートを読み込みました`);
  }, [selectedTemplate]);

  // Mouse event handlers for drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    if (drawingMode === "テキスト") {
      insertTextAtPosition(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || drawingMode === "テキスト") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth[0];
    ctx.lineCap = 'round';

    if (drawingMode === "フリーハンド") {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      setLastX(x);
      setLastY(y);
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth[0];

    if (drawingMode === "直線") {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (drawingMode === "円") {
      const radius = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
      ctx.beginPath();
      ctx.arc(lastX, lastY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    setIsDrawing(false);
  };

  // Insert text at clicked position
  const insertTextAtPosition = (x: number, y: number) => {
    if (!textInput.trim()) {
      toast.error("テキストを入力してください");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = lineColor;
    ctx.font = `${lineWidth[0] * 8}px Arial`;
    ctx.fillText(textInput, x, y);
    
    toast.success("テキストを挿入しました");
  };

  // Insert text button handler
  const handleInsertText = () => {
    if (!textInput.trim()) {
      toast.error("テキストを入力してください");
      return;
    }
    toast.info("キャンバス上をクリックしてテキストを配置してください");
  };

  // Template change handler
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    setTimeout(loadTemplateBackground, 100);
  };

  // File upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas and draw uploaded image
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Scale image to fit canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        toast.success("画像を読み込みました");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Action handlers
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    
    if (isEmbedded && onSave) {
      // 診療記録への追加モード
      onSave(imageData);
      return;
    } else {
      // 通常の保存モード
      const savedSchemas = JSON.parse(localStorage.getItem('medicalSchemas') || '[]');
      savedSchemas.push({
        id: Date.now(),
        template: selectedTemplate,
        imageData,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('medicalSchemas', JSON.stringify(savedSchemas));
      
      if (onSave) {
        onSave(imageData);
      }
      
      toast.success("シェーマを保存しました");
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    loadTemplateBackground();
    toast.success("キャンバスをクリアしました");
  };

  // Initialize canvas on mount
  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  return (
    <div className={`h-full flex flex-col ${isEmbedded ? 'p-4' : ''}`}>
      {/* Embedded Header Bar */}
      {isEmbedded && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Template Selection */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="template-select-embedded" className="text-sm font-medium">
                  テンプレート
                </Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger id="template-select-embedded" className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templateOptions.map((template) => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="medical-border-primary hover:medical-bg-primary hover:text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                診療記録に追加
              </Button>

              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCancel}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                >
                  キャンセル
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                <Trash className="w-4 h-4 mr-2" />
                クリア
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex gap-4 ${isEmbedded ? 'min-h-0' : ''}`}>
        {/* Left Toolbar */}
        <Card className={`${isEmbedded ? 'w-56' : 'w-64'} h-fit ${isEmbedded ? 'max-h-[calc(95vh-200px)]' : 'max-h-[calc(100vh-200px)]'} overflow-y-auto`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">描画ツール</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color Picker */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">線の色</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm font-mono">{lineColor}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setLineColor(color)}
                      className={`w-8 h-8 rounded border-2 ${
                        lineColor === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Line Width */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">線幅</Label>
              <div className="px-2">
                <Slider
                  value={lineWidth}
                  onValueChange={setLineWidth}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>{lineWidth[0]}</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Drawing Mode */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">描画モード</Label>
              <ToggleGroup
                type="single"
                value={drawingMode}
                onValueChange={(value) => value && setDrawingMode(value)}
                className="grid grid-cols-2 gap-2"
              >
                {drawingModeOptions.map((mode) => {
                  const IconComponent = mode.icon;
                  return (
                    <ToggleGroupItem
                      key={mode.value}
                      value={mode.value}
                      className="text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 data-[state=on]:medical-primary data-[state=on]:text-white data-[state=on]:border-transparent transition-colors duration-200 rounded-md flex items-center space-x-1"
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{mode.label}</span>
                    </ToggleGroupItem>
                  );
                })}
              </ToggleGroup>
            </div>

            <Separator />

            {/* Text Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">テキスト入力</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="テキストを入力"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={handleInsertText}
                  className="medical-secondary"
                >
                  挿入
                </Button>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Canvas Area */}
        <Card className="flex-1 flex flex-col min-w-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">描画エリア</CardTitle>
          </CardHeader>
          <CardContent className={`flex-1 flex items-center justify-center ${isEmbedded ? 'p-3' : 'p-6'}`}>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 w-full h-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={() => setIsDrawing(false)}
                className="bg-white border border-gray-300 rounded shadow-lg cursor-crosshair"
                style={{ 
                  cursor: drawingMode === "テキスト" ? "text" : "crosshair",
                  maxWidth: "100%",
                  maxHeight: isEmbedded ? "calc(95vh - 300px)" : "calc(100vh - 400px)",
                  width: "auto",
                  height: "auto"
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}