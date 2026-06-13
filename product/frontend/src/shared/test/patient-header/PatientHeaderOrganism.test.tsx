import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import * as Stories from '../../../../test/stories/shared/patient-header/organisms/PatientHeaderOrganism.stories';
import { usePatientHeaderStore } from '@/shared/stores/use-patient-header.store';

const { Default, NewPatient, LoadError } = composeStories(Stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  usePatientHeaderStore.getState().reset();
});

afterAll(() => server.close());

describe('PatientHeaderOrganism / Default', () => {
  test('初期表示: 患者名が表示される', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText('山田 太郎')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('初期表示: 詳細表示ボタンが存在する', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /詳細表示/ })).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test('初期表示: 読み込み中スピナーが最初に表示される', () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });
});

describe('PatientHeaderOrganism / NewPatient', () => {
  test('新患の場合: 患者名が表示される', async () => {
    server.use(...Stories.newPatientHandlers);
    render(<NewPatient />);

    await waitFor(() => {
      expect(screen.getByText('新 患者')).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});

describe('PatientHeaderOrganism / LoadError', () => {
  test('エラー時: 読み込み中表示のまま（患者データなし）', async () => {
    server.use(...Stories.errorHandlers);
    render(<LoadError />);

    // エラー時は isLoading が false になりエラー状態のまま patient が null → ローディング表示
    await waitFor(() => {
      // ローディング中またはエラー後の表示（patient === null）
      const loading = screen.queryByText('読み込み中...');
      expect(loading).not.toBeNull();
    }, { timeout: 5000 });
  });
});

describe('PatientHeaderOrganism / MSWハンドラー確認', () => {
  test('commonHandlers: GET /api/patients/:id/header が定義されている', () => {
    const hasGetHandler = Stories.commonHandlers.some((h) => {
      const info = (h as unknown as { info: { method: string; path: string } }).info;
      return info?.method === 'GET' && String(info?.path).includes('/api/patients/');
    });
    expect(hasGetHandler).toBe(true);
  });

  test('commonHandlers: PUT /api/patients/:id/prescription-status が定義されている', () => {
    const hasPutHandler = Stories.commonHandlers.some((h) => {
      const info = (h as unknown as { info: { method: string; path: string } }).info;
      return info?.method === 'PUT' && String(info?.path).includes('prescription-status');
    });
    expect(hasPutHandler).toBe(true);
  });

  test('commonHandlers: PUT /api/patients/:id/medical-info-sharing が定義されている', () => {
    const hasPutHandler = Stories.commonHandlers.some((h) => {
      const info = (h as unknown as { info: { method: string; path: string } }).info;
      return info?.method === 'PUT' && String(info?.path).includes('medical-info-sharing');
    });
    expect(hasPutHandler).toBe(true);
  });
});
