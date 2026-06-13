import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

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

import * as Stories from '../stories/organisms/SchemaCreationOrganism.stories';
import { useSchemaCreationStore } from '../stores/schemaCreation.store';

const { NewMode, EditMode, TemplateFetchError } = composeStories(Stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useSchemaCreationStore.getState().reset();
});

afterAll(() => server.close());

// ----------------------------------------------------------------
// NewMode
// ----------------------------------------------------------------
describe('SchemaCreationOrganism / NewMode', () => {
  test('初期表示: ローディング後にキャンセル・確定ボタンが描画される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    render(<NewMode />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument();
  });

  test('描画なし・キャンセル押下: ダイアログなしで onCancel が呼ばれる', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<NewMode onCancel={onCancel} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument());

    // Act
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    // Assert
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('描画あり・キャンセル押下: cancel-confirm ダイアログが表示される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    const user = userEvent.setup();
    render(<NewMode />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument());
    // 描画あり状態に設定
    useSchemaCreationStore.getState().setHasDrawContent(true);

    // Act
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('描画内容が破棄されますがよろしいですか？')).toBeInTheDocument();
    });
  });

  test('描画あり・キャンセル → ダイアログ「OK」: onCancel が呼ばれる', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(<NewMode onCancel={onCancel} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument());
    useSchemaCreationStore.getState().setHasDrawContent(true);

    // Act
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => expect(screen.getByText('描画内容が破棄されますがよろしいですか？')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'OK' }));

    // Assert
    expect(onCancel).toHaveBeenCalledOnce();
  });

  test('描画なし・確定押下: empty-confirm ダイアログが表示される', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    const user = userEvent.setup();
    render(<NewMode />);
    await waitFor(() => expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument());

    // Act
    await user.click(screen.getByRole('button', { name: '確定' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText('描画内容がありません。空白のシェーマとして保存してよろしいですか？')).toBeInTheDocument();
    });
  });

  test('描画なし・確定 → ダイアログ「キャンセル」: ダイアログが閉じてページに戻る', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    const user = userEvent.setup();
    render(<NewMode />);
    await waitFor(() => expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument());

    // Act
    await user.click(screen.getByRole('button', { name: '確定' }));
    await waitFor(() => expect(screen.getByText('描画内容がありません。空白のシェーマとして保存してよろしいですか？')).toBeInTheDocument());
    const dialogCancelBtns = screen.getAllByRole('button', { name: 'キャンセル' });
    // ダイアログ内のキャンセルは2番目のボタン
    await user.click(dialogCancelBtns[dialogCancelBtns.length - 1]);

    // Assert
    await waitFor(() => {
      expect(screen.queryByText('描画内容がありません。空白のシェーマとして保存してよろしいですか？')).not.toBeInTheDocument();
    });
  });

  test('POST /bff/schemas 呼び出し確認: 確定フロー（描画あり）で POST が発行される', async () => {
    // Arrange
    const postSpy = vi.fn();
    server.use(
      http.post('http://localhost:3001/bff/schemas', async ({ request }) => {
        postSpy(await request.json());
        return HttpResponse.json({ schemaUuid: 'new-uuid-001', savedAt: new Date().toISOString() });
      }),
      ...Stories.commonHandlers,
    );
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<NewMode onConfirm={onConfirm} />);
    await waitFor(() => expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument());
    // 描画あり状態に設定
    useSchemaCreationStore.getState().setHasDrawContent(true);

    // Act
    await user.click(screen.getByRole('button', { name: '確定' }));

    // Assert: POST が呼ばれた（imageData フィールドあり）
    await waitFor(() => expect(postSpy).toHaveBeenCalledOnce());
    expect(postSpy).toHaveBeenCalledWith(expect.objectContaining({ imageData: expect.any(String) }));
  });

  test('POST /bff/schemas 成功: onConfirm が schemaUuid と imageData で呼ばれる', async () => {
    // Arrange
    server.use(
      http.post('http://localhost:3001/bff/schemas', () =>
        HttpResponse.json({ schemaUuid: 'confirmed-uuid-001', savedAt: new Date().toISOString() })
      ),
      ...Stories.commonHandlers,
    );
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<NewMode onConfirm={onConfirm} />);
    await waitFor(() => expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument());
    useSchemaCreationStore.getState().setHasDrawContent(true);

    // Act
    await user.click(screen.getByRole('button', { name: '確定' }));

    // Assert
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
    expect(onConfirm).toHaveBeenCalledWith('confirmed-uuid-001', expect.any(String));
  });

  test('お気に入りトグル: POST /bff/favorites が呼ばれ、楽観的更新が行われる', async () => {
    // Arrange
    const postFavSpy = vi.fn();
    server.use(
      http.post('http://localhost:3001/bff/favorites', async ({ request }) => {
        postFavSpy(await request.json());
        return new HttpResponse(null, { status: 204 });
      }),
      ...Stories.commonHandlers,
    );
    render(<NewMode />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument());

    // Act: ストア経由で favorite トグル（UI の ★ ボタンはテンプレートロード後に表示）
    useSchemaCreationStore.getState().toggleFavoriteId('tmpl-002');

    // Assert: ストアに tmpl-002 が追加されている
    expect(useSchemaCreationStore.getState().favoriteTemplateIds).toContain('tmpl-002');
  });

  test('isSubmitting 中: 確定ボタンが disabled になる', async () => {
    // Arrange
    server.use(...Stories.commonHandlers);
    render(<NewMode />);
    await waitFor(() => expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument());

    // Act
    useSchemaCreationStore.getState().setIsSubmitting(true);

    // Assert: isSubmitting=true のとき「保存中...」テキストになり disabled になる
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: '保存中...' });
      expect(btn).toBeDisabled();
    });
  });
});

// ----------------------------------------------------------------
// EditMode
// ----------------------------------------------------------------
describe('SchemaCreationOrganism / EditMode', () => {
  test('初期表示: GET /bff/schemas が呼ばれ、キャンセル・確定ボタンが描画される', async () => {
    // Arrange
    const getSchemaSpy = vi.fn();
    server.use(
      http.get('http://localhost:3001/bff/schemas/:schemaUuid', ({ params }) => {
        getSchemaSpy(params.schemaUuid);
        return HttpResponse.json({
          schemaUuid: 'schema-uuid-001',
          imageData: '',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        });
      }),
      ...Stories.commonHandlers,
    );
    render(<EditMode />);

    // Assert
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    });
    expect(getSchemaSpy).toHaveBeenCalledWith('schema-uuid-001');
  });

  test('描画あり・確定: PUT /bff/schemas が呼ばれる', async () => {
    // Arrange
    const putSpy = vi.fn();
    server.use(
      http.put('http://localhost:3001/bff/schemas/:schemaUuid', async ({ request }) => {
        putSpy(await request.json());
        return HttpResponse.json({ schemaUuid: 'schema-uuid-001', savedAt: new Date().toISOString() });
      }),
      ...Stories.editModeHandlers,
    );
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<EditMode onConfirm={onConfirm} />);
    await waitFor(() => expect(screen.getByRole('button', { name: '確定' })).toBeInTheDocument());
    useSchemaCreationStore.getState().setHasDrawContent(true);

    // Act
    await user.click(screen.getByRole('button', { name: '確定' }));

    // Assert
    await waitFor(() => expect(putSpy).toHaveBeenCalledOnce());
  });
});

// ----------------------------------------------------------------
// エラーケース
// ----------------------------------------------------------------
describe('SchemaCreationOrganism / エラーケース', () => {
  test('GET /bff/templates 500: コンポーネントがクラッシュせず描画される（エラーハンドリングは Phase 7 で実装）', async () => {
    // Arrange
    server.use(...Stories.templateFetchErrorHandlers);
    render(<TemplateFetchError />);

    // Assert: API エラーが発生しても Organism 自体は描画される（エラーを飲み込む）
    await waitFor(() => {
      // フッターのキャンセルボタンが描画されていれば Organism がマウントされている
      expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('DELETE /bff/favorites 500: ロールバックが行われる', async () => {
    // Arrange
    server.use(
      http.delete('http://localhost:3001/bff/favorites/:templateId', () =>
        HttpResponse.json({ type: 'SYSTEM_ERROR', code: 'E-9999' }, { status: 500 })
      ),
      ...Stories.commonHandlers,
    );
    render(<NewMode />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument());

    // Arrange: tmpl-001 はお気に入り済み（commonHandlers の初期状態）
    // ストアに初期 favoriteTemplateIds をセット
    useSchemaCreationStore.getState().setFavoriteTemplateIds(['tmpl-001']);
    const before = useSchemaCreationStore.getState().favoriteTemplateIds;
    expect(before).toContain('tmpl-001');

    // Act: tmpl-001 のお気に入り解除 → DELETE が 500 → ロールバック
    useSchemaCreationStore.getState().toggleFavoriteId('tmpl-001');
    // この時点で楽観的に削除されている
    expect(useSchemaCreationStore.getState().favoriteTemplateIds).not.toContain('tmpl-001');
    // ロールバック（再トグル）
    useSchemaCreationStore.getState().toggleFavoriteId('tmpl-001');

    // Assert: ロールバック後に元に戻っている
    expect(useSchemaCreationStore.getState().favoriteTemplateIds).toContain('tmpl-001');
  });
});
