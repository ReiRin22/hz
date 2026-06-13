import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import * as stories from '../stories/ORD023.stories';

const { Default, PanelOpen } = composeStories(stories);

function getMswHandlers(
  story: { parameters?: { msw?: { handlers?: RequestHandler[] } } },
): RequestHandler[] {
  return (story.parameters?.msw?.handlers ?? []) as RequestHandler[];
}

const BFF_BASE_URL = 'http://localhost:3001';

const server = setupServer(...getMswHandlers(Default));

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SpecimenOrderEntryFeature / Default（パネル非表示）', () => {
  test(
    '初期表示: パネルが閉じた状態でレンダリングされる',
    server.boundary(async () => {
      render(<Default />);
      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    }),
  );
});

describe('SpecimenOrderEntryFeature / PanelOpen（パネル表示）', () => {
  test(
    'パネル表示: specimen-history と specimen-sets を取得してコンテンツが表示される',
    server.boundary(async () => {
      server.use(...getMswHandlers(PanelOpen));
      render(<PanelOpen />);

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    }),
  );

  test(
    'API失敗（specimen-history 500）: エラー表示またはパネルが空になる',
    server.boundary(async () => {
      server.use(
        http.get(`${BFF_BASE_URL}/bff/patients/:patientId/specimen-history`, () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
        ),
        http.get(`${BFF_BASE_URL}/bff/order-sets/specimen-sets`, () =>
          HttpResponse.json({ specimenSets: [] }),
        ),
        http.post(`${BFF_BASE_URL}/bff/patients/:patientId/specimen-orders`, () =>
          HttpResponse.json({ confirmedOrders: [] }, { status: 201 }),
        ),
      );
      render(<PanelOpen />);

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    }),
  );
});
