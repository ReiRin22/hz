import type { Canvas as FabricCanvas } from 'fabric';

export const CANVAS_SIZE = 600;

export type DrawTool = 'pen' | 'rectangle' | 'circle' | 'text' | 'spray' | 'eraser';

export type DrawOperation = {
  type: 'draw' | 'clear' | 'flip' | 'image' | 'template' | 'text';
  imageData: string;
};

export type FabricCanvasRef = {
  fabricCanvas: FabricCanvas | null;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  reset: () => void;
  flipHorizontal: () => void;
  save: () => string | null;
};

export type FabricCanvasSnapshot = string;

export type TemplateViewModel = {
  templateId: string;
  name: string;
  category: string;
  svgComponent: string;
  isFavorite: boolean;
};

export type SchemaCreationMode = 'new' | 'edit';

export type SchemaCreationDialogType =
  | 'clear-confirm'
  | 'cancel-confirm'
  | 'empty-confirm'
  | 'template-confirm'
  | 'error';

export type SchemaCreationError = {
  code: 'E001' | 'E002' | 'E003' | 'E004' | 'E005' | 'E006' | 'E007' | 'E401' | 'E403' | 'E999' | 'TEMPLATE_LOAD_ERROR';
  message: string;
};
