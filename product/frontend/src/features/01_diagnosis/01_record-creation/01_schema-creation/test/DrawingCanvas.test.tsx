import { describe, test, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';

// Fabric.js のモック
vi.mock('fabric', () => {
  class MockCanvas {
    width = 600;
    height = 600;
    isDrawingMode = false;
    selection = false;
    backgroundColor = 'white';
    freeDrawingBrush = null;

    dispose = vi.fn();
    renderAll = vi.fn();
    clear = vi.fn();
    toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    toJSON = vi.fn(() => ({}));
    loadFromJSON = vi.fn((json: any, callback?: () => void) => callback?.());
    setBackgroundImage = vi.fn((url: string, callback?: () => void) => callback?.());
    getObjects = vi.fn(() => []);
    add = vi.fn();
    remove = vi.fn();
    getScenePoint = vi.fn(() => ({ x: 0, y: 0 }));
    on = vi.fn();
    off = vi.fn();
    setActiveObject = vi.fn();
  }

  return {
    Canvas: MockCanvas,
    PencilBrush: class {},
    SprayBrush: class {},
    EraserBrush: class {},
    Rect: class {},
    Circle: class {},
    IText: class {},
  };
});

// Fabric.js のモック
vi.mock('fabric', () => {
  class MockCanvas {
    width = 600;
    height = 600;
    isDrawingMode = false;
    selection = false;
    backgroundColor = 'white';
    freeDrawingBrush = null;

    dispose = vi.fn();
    renderAll = vi.fn();
    clear = vi.fn();
    toDataURL = vi.fn(() => 'data:image/png;base64,mock');
    toJSON = vi.fn(() => ({}));
    loadFromJSON = vi.fn((json: any, callback?: () => void) => callback?.());
    setBackgroundImage = vi.fn((url: string, callback?: () => void) => callback?.());
    getObjects = vi.fn(() => []);
    add = vi.fn();
    remove = vi.fn();
    getScenePoint = vi.fn(() => ({ x: 0, y: 0 }));
    on = vi.fn();
    off = vi.fn();
    setActiveObject = vi.fn();
  }

  return {
    Canvas: MockCanvas,
    PencilBrush: class {},
    SprayBrush: class {},
    EraserBrush: class {},
    Rect: class {},
    Circle: class {},
    IText: class {},
  };
});

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_schema-creation/organisms/DrawingCanvas.stories';

const { PenTool, EraserTool, WithTemplate } = composeStories(stories);

beforeEach(() => {
  cleanup();
  PenTool.args.onCanvasChange?.mockClear?.();
  EraserTool.args.onCanvasChange?.mockClear?.();
  WithTemplate.args.onCanvasChange?.mockClear?.();
});

describe('DrawingCanvas', () => {
  // C0: 基本レンダリング
  test('PenTool: キャンバス要素が描画される', () => {
    render(<PenTool />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('EraserTool: キャンバス要素が描画される', () => {
    render(<EraserTool />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('WithTemplate: キャンバス要素が描画される', () => {
    render(<WithTemplate />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
