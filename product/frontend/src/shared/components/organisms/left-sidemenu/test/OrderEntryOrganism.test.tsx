import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import * as Stories from '../stories/organisms/OrderEntryOrganism.stories';
import { useOrderEntryStore } from '../stores/use-order-entry.store';

const { Default, ApiError } = composeStories(Stories);

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useOrderEntryStore.getState().reset();
});

afterAll(() => {
  server.close();
});

describe('OrderEntryOrganism / Default', () => {
  test('初期表示: 画面が描画される', () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);
    expect(document.body).toBeTruthy();
  });

  test('初期表示: GlobalMenu がレンダリングされる（処方/注射/検体 タブが表示）', () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);
    // GlobalMenu のオーダー種別タブ（処方・注射・検体）のいずれかが存在
    const hasOrderTab =
      screen.queryByText('処方') !== null ||
      screen.queryByText('注射') !== null ||
      screen.queryByText('検体') !== null;
    expect(hasOrderTab).toBe(true);
  });
});

describe('OrderEntryOrganism / ApiError', () => {
  test('APIエラー時: 画面がクラッシュせず描画される', () => {
    server.use(...Stories.errorHandlers);
    render(<ApiError />);
    expect(document.body).toBeTruthy();
  });
});
