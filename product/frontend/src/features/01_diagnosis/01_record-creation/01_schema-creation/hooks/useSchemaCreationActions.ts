'use client';

import { useCallback } from 'react';
import { useSchemaCreationStore } from '../stores/schemaCreation.store';
import { fetchTemplatesByCategory, toggleFavorite } from '../repository/schema-creation.repository';
import type { DrawTool, DrawOperation } from '../types/schema-creation.types';
import type { TemplatesResponse } from '@front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

type UseSchemaCreationActionsReturn = {
  /** EVT_UI_TOOL_SELECT: 描画ツールを選択する */
  handleToolSelect: (tool: DrawTool) => void;
  /** EVT_UI_DRAW: 描画操作をundoStackに積む */
  handleDraw: (op: DrawOperation) => void;
  /** EVT_UI_FLIP: 描画内容を水平反転する（履歴リセット付き） */
  handleFlip: (op: DrawOperation) => void;
  /** EVT_UI_UNDO: 直前操作を取り消す */
  handleUndo: () => DrawOperation | undefined;
  /** EVT_UI_REDO: Undoを再実行する */
  handleRedo: () => DrawOperation | undefined;
  /** EVT_UI_CLEAR: 描画内容をすべて消去する（confirmダイアログ後に呼ぶ） */
  handleClear: (op: DrawOperation) => void;
  /** EVT_UI_TEMPLATE_SELECT: テンプレートを選択して背景に設定する（履歴リセット付き） */
  handleTemplateSelect: (op: DrawOperation) => void;
  /** EVT_UI_CHANGE_PART: 部位選択を変更して /bff/templates を再取得する */
  handleChangePart: (category: string) => Promise<TemplatesResponse>;
  /** EVT_UI_IMG_IMPORT: 外部画像を背景として取り込む（履歴リセット付き） */
  handleImageImport: (op: DrawOperation) => void;
  /** EVT_UI_IMG_PASTE: クリップボード画像を貼り付ける（履歴リセット付き） */
  handleImagePaste: (op: DrawOperation) => void;
  /** EVT_UI_CHANGE_COLOR: 描画色を変更する */
  handleColorChange: (color: string) => void;
  /** EVT_UI_CHANGE_WIDTH: 線の太さを変更する */
  handleWidthChange: (size: number) => void;
  /** EVT_UI_TEXT_INPUT: テキストを描画する */
  handleTextInput: (op: DrawOperation) => void;
  /** EVT_UI_CLOSE_DIALOG: ダイアログを閉じる */
  handleCloseDialog: () => void;
  /** EVT_CANCEL: 変更内容を破棄して画面を閉じる */
  handleCancel: (onClose: () => void) => void;
  /** EVT_FAVORITE_TOGGLE: お気に入りをトグルする */
  handleFavoriteToggle: (templateId: string) => Promise<void>;
};

/** EVT_FAVORITE_TOGGLE〜EVT_UI_* の全UI操作ハンドラーを提供する操作フック */
export function useSchemaCreationActions(): UseSchemaCreationActionsReturn {
  const pushUndo = useSchemaCreationStore((s) => s.pushUndo);
  const popUndo = useSchemaCreationStore((s) => s.popUndo);
  const popRedo = useSchemaCreationStore((s) => s.popRedo);
  const resetHistoryStack = useSchemaCreationStore((s) => s.resetHistoryStack);
  const setActiveTool = useSchemaCreationStore((s) => s.setActiveTool);
  const setStrokeColor = useSchemaCreationStore((s) => s.setStrokeColor);
  const setPenSize = useSchemaCreationStore((s) => s.setPenSize);
  const setHasDrawContent = useSchemaCreationStore((s) => s.setHasDrawContent);
  const setSelectedBodyPart = useSchemaCreationStore((s) => s.setSelectedBodyPart);
  const toggleFavoriteId = useSchemaCreationStore((s) => s.toggleFavoriteId);

  const handleToolSelect = useCallback(
    (tool: DrawTool) => {
      setActiveTool(tool);
    },
    [setActiveTool],
  );

  const handleDraw = useCallback(
    (op: DrawOperation) => {
      pushUndo(op);
      setHasDrawContent(true);
    },
    [pushUndo, setHasDrawContent],
  );

  const handleFlip = useCallback(
    (op: DrawOperation) => {
      resetHistoryStack(op);
      setHasDrawContent(true);
    },
    [resetHistoryStack, setHasDrawContent],
  );

  const handleUndo = useCallback((): DrawOperation | undefined => {
    return popUndo();
  }, [popUndo]);

  const handleRedo = useCallback((): DrawOperation | undefined => {
    return popRedo();
  }, [popRedo]);

  const handleClear = useCallback(
    (op: DrawOperation) => {
      resetHistoryStack(op);
      setHasDrawContent(false);
    },
    [resetHistoryStack, setHasDrawContent],
  );

  const handleTemplateSelect = useCallback(
    (op: DrawOperation) => {
      resetHistoryStack(op);
      setHasDrawContent(true);
    },
    [resetHistoryStack, setHasDrawContent],
  );

  const handleChangePart = useCallback(
    async (category: string): Promise<TemplatesResponse> => {
      setSelectedBodyPart(category);
      return fetchTemplatesByCategory({ category });
    },
    [setSelectedBodyPart],
  );

  const handleImageImport = useCallback(
    (op: DrawOperation) => {
      resetHistoryStack(op);
      setHasDrawContent(true);
    },
    [resetHistoryStack, setHasDrawContent],
  );

  const handleImagePaste = useCallback(
    (op: DrawOperation) => {
      resetHistoryStack(op);
      setHasDrawContent(true);
    },
    [resetHistoryStack, setHasDrawContent],
  );

  const handleColorChange = useCallback(
    (color: string) => {
      setStrokeColor(color);
    },
    [setStrokeColor],
  );

  const handleWidthChange = useCallback(
    (size: number) => {
      setPenSize(size);
    },
    [setPenSize],
  );

  const handleTextInput = useCallback(
    (op: DrawOperation) => {
      pushUndo(op);
      setHasDrawContent(true);
    },
    [pushUndo, setHasDrawContent],
  );

  const handleCloseDialog = useCallback(() => {
    // ダイアログ状態はコンポーネント側で管理。ストア側では何もしない
  }, []);

  const handleCancel = useCallback((onClose: () => void) => {
    onClose();
  }, []);

  const handleFavoriteToggle = useCallback(
    async (templateId: string): Promise<void> => {
      const isFavorite = !useSchemaCreationStore.getState().favoriteTemplateIds.includes(templateId);
      // 楽観的更新
      toggleFavoriteId(templateId);
      try {
        await toggleFavorite({ templateId, isFavorite });
      } catch {
        // ロールバック
        toggleFavoriteId(templateId);
        // Phase 7 でエラーハンドリングを詳細化する
      }
    },
    [toggleFavoriteId],
  );

  return {
    handleToolSelect,
    handleDraw,
    handleFlip,
    handleUndo,
    handleRedo,
    handleClear,
    handleTemplateSelect,
    handleChangePart,
    handleImageImport,
    handleImagePaste,
    handleColorChange,
    handleWidthChange,
    handleTextInput,
    handleCloseDialog,
    handleCancel,
    handleFavoriteToggle,
  };
}
