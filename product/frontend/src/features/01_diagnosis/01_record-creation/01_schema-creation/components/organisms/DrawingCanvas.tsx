'use client';

import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as fabric from 'fabric';
import { CANVAS_SIZE } from '../../types/schema-creation.types';

const { Canvas: FabricCanvas, PencilBrush, SprayBrush, EraserBrush, Rect, Circle, IText } = fabric;

export type Tool = 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'spray';

export type DrawingCanvasHandle = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  /** キャンバスを白紙に戻して履歴をリセット（テンプレート切り替え時に使用） */
  reset: () => void;
  flipHorizontal: () => void;
  /** Returns base64 PNG data URL or null */
  save: () => string | null;
  fabricCanvas: FabricCanvas | null;
  /** スナップショットから復元 */
  loadSnapshot: (snapshot: string) => void;
};

interface DrawingCanvasProps {
  tool: Tool;
  color: string;
  brushSize: number;
  templateComponent?: React.ReactNode;
  templateSvgString?: string | null;
  onCanvasChange?: () => void;
  imageToLoad?: string | null;
  onHistoryChange?: (snapshot: string) => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(function DrawingCanvas(
  { tool, color, brushSize, templateComponent, templateSvgString, onCanvasChange, imageToLoad, onHistoryChange },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [tempShape, setTempShape] = useState<Rect | Circle | null>(null);
  const [loadedImageUrl, setLoadedImageUrl] = useState<string | null>(null);
  const [loadedTemplateSvg, setLoadedTemplateSvg] = useState<string | null>(null);

  // スナップショットを保存するヘルパー
  const saveSnapshot = useCallback(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas || !onHistoryChange) return;
    const json = JSON.stringify(fabricCanvas.toJSON(['id', 'selectable']));
    onHistoryChange(json);
  }, [onHistoryChange]);

  // Fabric.js キャンバスの初期化
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const fabricCanvas = new FabricCanvas(canvasEl, {
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      backgroundColor: 'white',
      isDrawingMode: false,
      selection: false,
    });

    fabricCanvasRef.current = fabricCanvas;

    // 描画完了時にスナップショットを保存
    const handlePathCreated = () => {
      saveSnapshot();
      onCanvasChange?.();
    };

    const handleObjectModified = () => {
      saveSnapshot();
      onCanvasChange?.();
    };

    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:added', handleObjectModified);

    // クリーンアップ
    return () => {
      fabricCanvas.off('path:created', handlePathCreated);
      fabricCanvas.off('object:modified', handleObjectModified);
      fabricCanvas.off('object:added', handleObjectModified);
      fabricCanvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [saveSnapshot, onCanvasChange]);

  // ツールの切り替え
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    // ペン、スプレー、消しゴムは isDrawingMode = true
    if (tool === 'pen') {
      const brush = new PencilBrush(fabricCanvas);
      brush.color = color;
      brush.width = brushSize;
      fabricCanvas.freeDrawingBrush = brush;
      fabricCanvas.isDrawingMode = true;
      setIsDrawingMode(true);
    } else if (tool === 'spray') {
      const brush = new SprayBrush(fabricCanvas);
      brush.color = color;
      brush.width = brushSize * 2;
      fabricCanvas.freeDrawingBrush = brush;
      fabricCanvas.isDrawingMode = true;
      setIsDrawingMode(true);
    } else if (tool === 'eraser') {
      const brush = new EraserBrush(fabricCanvas);
      brush.width = brushSize;
      fabricCanvas.freeDrawingBrush = brush;
      fabricCanvas.isDrawingMode = true;
      setIsDrawingMode(true);
    } else {
      // 図形・テキストツールは isDrawingMode = false
      fabricCanvas.isDrawingMode = false;
      setIsDrawingMode(false);
    }

    fabricCanvas.renderAll();
  }, [tool, color, brushSize]);

  const loadSnapshot = useCallback((snapshot: string) => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    try {
      const json = JSON.parse(snapshot);
      fabricCanvas.loadFromJSON(json, () => {
        fabricCanvas.renderAll();
      });
    } catch (error) {
      console.error('Failed to load snapshot:', error);
    }
  }, []);

  const undo = useCallback(() => {
    // Store から snapshot を取得して loadSnapshot を呼ぶ
    // （呼び出し側で実装）
  }, []);

  const redo = useCallback(() => {
    // Store から snapshot を取得して loadSnapshot を呼ぶ
    // （呼び出し側で実装）
  }, []);

  // 図形描画イベント（四角・円）
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    if (tool === 'rectangle' || tool === 'circle') {
      const handleMouseDown = (e: any) => {
        const pointer = fabricCanvas.getScenePoint(e.e);
        setShapeStart({ x: pointer.x, y: pointer.y });
      };

      const handleMouseMove = (e: any) => {
        if (!shapeStart) return;
        const pointer = fabricCanvas.getScenePoint(e.e);

        // 既存の一時図形を削除
        if (tempShape) {
          fabricCanvas.remove(tempShape);
        }

        // 新しい一時図形を作成
        let shape: Rect | Circle;
        if (tool === 'rectangle') {
          const width = Math.abs(pointer.x - shapeStart.x);
          const height = Math.abs(pointer.y - shapeStart.y);
          shape = new Rect({
            left: Math.min(shapeStart.x, pointer.x),
            top: Math.min(shapeStart.y, pointer.y),
            width,
            height,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
          });
        } else {
          const radius = Math.sqrt(
            Math.pow(pointer.x - shapeStart.x, 2) + Math.pow(pointer.y - shapeStart.y, 2)
          );
          shape = new Circle({
            left: shapeStart.x - radius,
            top: shapeStart.y - radius,
            radius,
            fill: 'transparent',
            stroke: color,
            strokeWidth: brushSize,
          });
        }

        fabricCanvas.add(shape);
        setTempShape(shape);
        fabricCanvas.renderAll();
      };

      const handleMouseUp = () => {
        setShapeStart(null);
        setTempShape(null);
        onCanvasChange?.();
      };

      fabricCanvas.on('mouse:down', handleMouseDown);
      fabricCanvas.on('mouse:move', handleMouseMove);
      fabricCanvas.on('mouse:up', handleMouseUp);

      return () => {
        fabricCanvas.off('mouse:down', handleMouseDown);
        fabricCanvas.off('mouse:move', handleMouseMove);
        fabricCanvas.off('mouse:up', handleMouseUp);
      };
    }
  }, [tool, color, brushSize, shapeStart, tempShape, onCanvasChange]);

  const clear = useCallback(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = 'white';
    fabricCanvas.renderAll();
    onCanvasChange?.();
  }, [onCanvasChange]);

  const reset = useCallback(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = 'white';
    fabricCanvas.renderAll();
    onCanvasChange?.();
  }, [onCanvasChange]);

  const flipHorizontal = useCallback(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    objects.forEach((obj) => {
      obj.set({
        flipX: !obj.flipX,
        left: CANVAS_SIZE - (obj.left ?? 0),
      });
      obj.setCoords();
    });

    fabricCanvas.renderAll();
    onCanvasChange?.();
  }, [onCanvasChange]);

  const save = useCallback((): string | null => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas) return null;
    return fabricCanvas.toDataURL({ format: 'png' });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      undo,
      redo,
      clear,
      reset,
      flipHorizontal,
      save,
      fabricCanvas: fabricCanvasRef.current,
      loadSnapshot,
    }),
    [undo, redo, clear, reset, flipHorizontal, save, loadSnapshot]
  );

  // 画像読み込み
  useEffect(() => {
    if (imageToLoad && imageToLoad !== loadedImageUrl) {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) return;

      const img = new Image();
      img.src = imageToLoad;
      img.onload = () => {
        fabricCanvas.setBackgroundImage(
          imageToLoad,
          () => {
            fabricCanvas.renderAll();
            onCanvasChange?.();
          },
          {
            scaleX: CANVAS_SIZE / img.width,
            scaleY: CANVAS_SIZE / img.height,
          }
        );
      };
      setLoadedImageUrl(imageToLoad);
    }
  }, [imageToLoad, loadedImageUrl, onCanvasChange]);

  // SVG テンプレート読み込み（Fabric.js 背景として設定）
  useEffect(() => {
    if (templateSvgString && templateSvgString !== loadedTemplateSvg) {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) return;

      // SVG を Data URL に変換
      const svgBlob = new Blob([templateSvgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        fabricCanvas.setBackgroundImage(
          url,
          () => {
            fabricCanvas.renderAll();
            URL.revokeObjectURL(url);
            onCanvasChange?.();
          },
          {
            scaleX: CANVAS_SIZE / img.width,
            scaleY: CANVAS_SIZE / img.height,
            opacity: 0.4,
          }
        );
      };
      img.src = url;
      setLoadedTemplateSvg(templateSvgString);
    }
  }, [templateSvgString, loadedTemplateSvg, onCanvasChange]);

  // テキストツールの実装
  useEffect(() => {
    const fabricCanvas = fabricCanvasRef.current;
    if (!fabricCanvas || tool !== 'text') return;

    const handleTextClick = (e: any) => {
      const pointer = fabricCanvas.getScenePoint(e.e);
      const text = new IText('テキストを入力', {
        left: pointer.x,
        top: pointer.y,
        fill: color,
        fontSize: brushSize * 4,
        fontFamily: 'Arial',
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      text.enterEditing();
      fabricCanvas.renderAll();
      onCanvasChange?.();
    };

    fabricCanvas.on('mouse:down', handleTextClick);

    return () => {
      fabricCanvas.off('mouse:down', handleTextClick);
    };
  }, [tool, color, brushSize, onCanvasChange]);

  return (
    <div className="relative inline-block bg-white border-2 border-dashed border-gray-300">
      {templateComponent && (
        <div
          className="absolute top-0 left-0 pointer-events-none z-0"
          style={{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }}
        >
          <div className="w-full h-full flex items-center justify-center opacity-40">
            {templateComponent}
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{
          display: 'block',
          cursor: isDrawingMode ? 'crosshair' : 'default',
        }}
      />
    </div>
  );
});

export default DrawingCanvas;
