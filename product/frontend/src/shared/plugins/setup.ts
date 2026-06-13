/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { server } from '@/shared/mocks/server';
import { resetMockOrders } from '@/shared/mocks/handlers';

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockOrders();
});

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterAll(() => server.close());

// jsdom does not implement ResizeObserver or canvas — stub them
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Stub canvas getContext so DrawingCanvas.save() returns a non-null base64 string
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    clearRect: () => {},
    fillRect: () => {},
    drawImage: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    putImageData: () => {},
    beginPath: () => {},
    stroke: () => {},
    fill: () => {},
    arc: () => {},
    moveTo: () => {},
    lineTo: () => {},
    save: () => {},
    restore: () => {},
    scale: () => {},
    translate: () => {},
    setLineDash: () => {},
    strokeRect: () => {},
    fillText: () => {},
    measureText: () => ({ width: 0 }),
    createImageData: () => ({ data: new Uint8ClampedArray(4) }),
    canvas: { width: 600, height: 600, toDataURL: () => 'data:image/png;base64,stubbed' },
  }),
  writable: true,
});

// Stub toDataURL on canvas elements
Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: () => 'data:image/png;base64,stubbed',
  writable: true,
});

// jsdom does not implement window.matchMedia — stub for sonner and other media-query users
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
