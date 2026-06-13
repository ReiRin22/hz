"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Undo2, Redo2, Pen, Square, Type, Eraser, Circle, Droplets, FlipHorizontal, FlipVertical, Upload, Star } from "lucide-react";
import { Button } from "@/shared/components/atoms/button";
import { Slider } from "@/shared/components/atoms/slider";
import { Card } from "@/shared/components/atoms/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import DrawingCanvas, { Tool } from "./src/components/DrawingCanvas";
import ColorPicker from "./src/components/ColorPicker";
import { TEMPLATE_COMPONENTS } from "./src/components/MedicalTemplates";
import { TEMPLATE_DATA } from "./src/data/templates";

interface REC002PageProps {
  onSave?: (imageData: string) => void;
  onCancel?: () => void;
}

export default function REC002Page({ onSave, onCancel }: REC002PageProps = {}) {
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState([3]);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('head');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { type: 'pen' as Tool, icon: Pen, label: 'ペン' },
    { type: 'rectangle' as Tool, icon: Square, label: '四角形' },
    { type: 'circle' as Tool, icon: Circle, label: '円' },
    { type: 'text' as Tool, icon: Type, label: 'テキスト' },
    { type: 'spray' as Tool, icon: Droplets, label: 'スプレー' },
    { type: 'eraser' as Tool, icon: Eraser, label: '消しゴム' }
  ];

  const handleUndo = () => {
    if ((window as any).canvasUndo) {
      (window as any).canvasUndo();
    }
  };

  const handleRedo = () => {
    if ((window as any).canvasRedo) {
      (window as any).canvasRedo();
    }
  };

  const handleClear = () => {
    if ((window as any).canvasClear) {
      (window as any).canvasClear();
    }
  };

  const handleFlipHorizontal = () => {
    if ((window as any).canvasFlipHorizontal) {
      (window as any).canvasFlipHorizontal();
    }
  };

  const handleFlipVertical = () => {
    if ((window as any).canvasFlipVertical) {
      (window as any).canvasFlipVertical();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle paste event for clipboard images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const result = event.target?.result as string;
              setUploadedImage(result);
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent template selection when clicking star
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const getCurrentBodyPart = () => {
    return TEMPLATE_DATA.find(bp => bp.id === selectedBodyPart);
  };

  const getCurrentTemplates = () => {
    return getCurrentBodyPart()?.templates || [];
  };

  const getTemplateComponent = () => {
    if (!selectedTemplate) return null;
    
    const bodyPart = getCurrentBodyPart();
    const template = bodyPart?.templates.find(t => t.id === selectedTemplate);
    if (!template) return null;

    const TemplateComponent = TEMPLATE_COMPONENTS[template.component];
    return TemplateComponent ? <TemplateComponent /> : null;
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <div className="w-full h-full bg-white flex flex-col">
        
        {/* Top Bar */}
        <div className="flex justify-end items-center px-4 py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUndo}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo}>
              <Redo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              クリア
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Central Drawing Area */}
          <div className="flex-1 flex items-center justify-center p-6">
            <DrawingCanvas
              tool={selectedTool}
              color={selectedColor}
              brushSize={brushSize[0]}
              templateComponent={getTemplateComponent()}
              imageToLoad={uploadedImage}
            />
          </div>

          {/* Right Panel */}
          <div className="w-80 border-l border-border flex flex-col">
            
            {/* Tools Section */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium mb-3">ツール</h3>
              
              {/* Tool Icons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {tools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Button
                      key={tool.type}
                      variant={selectedTool === tool.type ? "default" : "outline"}
                      size="sm"
                      className="aspect-square p-2"
                      onClick={() => setSelectedTool(tool.type)}
                      title={tool.label}
                    >
                      <IconComponent className="w-4 h-4" />
                    </Button>
                  );
                })}
              </div>

              {/* Flip Tools */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleFlipHorizontal}
                  title="水平反転"
                >
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleFlipVertical}
                  title="垂直反転"
                >
                  <FlipVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Color Picker */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">カラー</label>
                <ColorPicker
                  color={selectedColor}
                  onChange={setSelectedColor}
                />
              </div>

              {/* Pen Width Slider */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  ペン太さ ({brushSize[0]} px)
                </label>
                <Slider
                  value={brushSize}
                  onValueChange={setBrushSize}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Templates Section */}
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium mb-3">テンプレート</h3>
              
              {/* Image Upload */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  画像取込
                </Button>
              </div>

              {/* Body Part Selection */}
              <div className="mb-4">
                <Select 
                  value={selectedBodyPart} 
                  onValueChange={(value) => {
                    setSelectedBodyPart(value);
                    setSelectedTemplate(''); // Reset template selection when body part changes
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="部位を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPLATE_DATA.map((bodyPart) => (
                      <SelectItem key={bodyPart.id} value={bodyPart.id}>
                        {bodyPart.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-3 gap-2">
                {getCurrentTemplates().map((template) => {
                  const TemplateComponent = TEMPLATE_COMPONENTS[template.component];
                  return (
                    <Card 
                      key={template.id}
                      className={`p-2 cursor-pointer transition-colors aspect-square relative ${
                        selectedTemplate === template.id ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        {TemplateComponent && (
                          <div className="w-full h-full max-w-full max-h-full">
                            <TemplateComponent />
                          </div>
                        )}
                      </div>
                      {/* Favorite Star */}
                      <button
                        className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                        onClick={(e) => toggleFavorite(template.id, e)}
                        title={favorites.has(template.id) ? 'お気に入りから削除' : 'お気に入りに追加'}
                      >
                        <Star 
                          className={`w-3 h-3 ${
                            favorites.has(template.id) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-400 hover:text-yellow-400'
                          } transition-colors`}
                        />
                      </button>
                    </Card>
                  );
                })}
                
                {/* No template option */}
                <Card 
                  className={`p-2 cursor-pointer transition-colors aspect-square ${
                    selectedTemplate === '' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTemplate('')}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">空白</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button onClick={() => {
            const imageData = (window as any).canvasSave?.();
            if (imageData && onSave) onSave(imageData);
          }}>
            確定
          </Button>
        </div>
      </div>
    </div>
  );
}