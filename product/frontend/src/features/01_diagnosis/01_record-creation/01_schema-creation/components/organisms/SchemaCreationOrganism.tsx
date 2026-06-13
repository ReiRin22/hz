'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useSchemaCreationStore } from '../../stores/schemaCreation.store';
import { useSchemaCreationInit } from '../../hooks/useSchemaCreationInit';
import { useSchemaCreationActions } from '../../hooks/useSchemaCreationActions';
import { useSchemaCreationSubmit } from '../../hooks/useSchemaCreationSubmit';
import DrawingCanvas, { type DrawingCanvasHandle } from './DrawingCanvas';
import ToolbarPanel from '../molecules/ToolbarPanel';
import DrawingToolPanel from '../molecules/DrawingToolPanel';
import TemplateSelectorPanel from '../molecules/TemplateSelectorPanel';
import FooterActionBar from '../molecules/FooterActionBar';
import { TEMPLATE_COMPONENTS } from '../../assets/MedicalTemplates';
import { TEMPLATE_DATA } from '../../assets/templates';
import { svgComponentToString } from '../../utils/svgToString';
import type { SchemaCreationDialogType } from '../../types/schema-creation.types';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

interface DialogState {
  type: SchemaCreationDialogType | null;
  message: string;
  onConfirm?: () => void;
}

interface SchemaCreationOrganismProps {
  onConfirm?: (schemaUuid: string, base64Image: string) => void;
  onCancel?: () => void;
  mode?: 'new' | 'edit';
  schemaUuid?: string;
  initialCategory?: string;
}

export default function SchemaCreationOrganism({
  onConfirm,
  onCancel,
  mode = 'new',
  schemaUuid,
  initialCategory = '全身図',
}: SchemaCreationOrganismProps) {
  const canvasRef = useRef<DrawingCanvasHandle>(null);

  const activeTool = useSchemaCreationStore((s) => s.activeTool);
  const strokeColor = useSchemaCreationStore((s) => s.strokeColor);
  const penSize = useSchemaCreationStore((s) => s.penSize);
  const selectedBodyPart = useSchemaCreationStore((s) => s.selectedBodyPart);
  const favoriteTemplateIds = useSchemaCreationStore((s) => s.favoriteTemplateIds);
  const hasDrawContent = useSchemaCreationStore((s) => s.hasDrawContent);
  const pushUndo = useSchemaCreationStore((s) => s.pushUndo);
  const popUndo = useSchemaCreationStore((s) => s.popUndo);
  const popRedo = useSchemaCreationStore((s) => s.popRedo);
  const undoStack = useSchemaCreationStore((s) => s.undoStack);
  const redoStack = useSchemaCreationStore((s) => s.redoStack);

  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [imageToLoad, setImageToLoad] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ type: null, message: '' });

  const { isLoading } = useSchemaCreationInit({ category: initialCategory, mode, schemaUuid });

  const {
    handleToolSelect,
    handleColorChange,
    handleWidthChange,
    handleChangePart,
    handleFavoriteToggle,
  } = useSchemaCreationActions();

  const { isSubmitting, handleConfirm } = useSchemaCreationSubmit({
    mode,
    schemaUuid,
    onConfirm: onConfirm ?? (() => {}),
  });

  const showDialog = useCallback((type: SchemaCreationDialogType, message: string, onConfirmAction?: () => void) => {
    setDialog({ type, message, onConfirm: onConfirmAction });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog({ type: null, message: '' });
  }, []);

  // EVT_CLIPBOARD_PASTE: Ctrl+V でクリップボードから画像を取得
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      let hasImageItem = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          hasImageItem = true;
          const blob = items[i].getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setImageToLoad(event.target?.result as string);
            };
            reader.readAsDataURL(blob);
          }
          break;
        }
      }

      if (!hasImageItem && items.length > 0) {
        // E007: クリップボードに貼り付け可能な画像がない
        showDialog('error', 'クリップボードに貼り付け可能な画像がありません');
      }
    };

    const handlePasteWithPermissionCheck = async (e: ClipboardEvent) => {
      try {
        await handlePaste(e);
      } catch {
        // E006: クリップボードへのアクセス権限が拒否された
        showDialog('error', 'クリップボードへのアクセスが許可されていません');
      }
    };

    window.addEventListener('paste', handlePasteWithPermissionCheck);
    return () => window.removeEventListener('paste', handlePasteWithPermissionCheck);
  }, [showDialog]);

  // Page スコープストアのリセット（アンマウント時）
  useEffect(() => {
    return () => {
      useSchemaCreationStore.getState().reset();
    };
  }, []);

  // EVT_UI_CHANGE_PART: 部位変更
  const handleBodyPartChange = useCallback(
    async (category: string) => {
      setSelectedTemplateId('');
      await handleChangePart(category);
    },
    [handleChangePart],
  );

  // EVT_TEMPLATE_LOAD: E005確認ダイアログ → テンプレートをキャンバスに配置
  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      if (hasDrawContent && templateId !== '') {
        // E005: 描画内容があるときのテンプレート変更確認
        showDialog(
          'template-confirm',
          '描画内容が失われますがテンプレートを変更しますか？',
          () => {
            canvasRef.current?.reset();
            setSelectedTemplateId(templateId);
            closeDialog();
          },
        );
      } else {
        setSelectedTemplateId(templateId);
      }
    },
    [hasDrawContent, showDialog, closeDialog],
  );

  // EVT_IMAGE_UPLOAD: E001/E004バリデーション → キャンバスに画像配置
  const handleImageImport = useCallback(
    (file: File) => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        // E001: jpg/png 以外のファイル
        showDialog('error', 'ファイル形式が不正です。画像ファイル（jpg/png）を選択してください。');
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        // E004: 10MB超過
        showDialog('error', 'ファイルサイズが上限（10MB）を超えています。');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageToLoad(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [showDialog],
  );

  // EVT_CLEAR: E003確認ダイアログ → クリア実行
  const handleClearClick = useCallback(() => {
    if (hasDrawContent) {
      showDialog(
        'clear-confirm',
        '描画内容が破棄されますがよろしいですか？',
        () => {
          canvasRef.current?.clear();
          closeDialog();
        },
      );
    } else {
      canvasRef.current?.clear();
    }
  }, [hasDrawContent, showDialog, closeDialog]);

  // EVT_FLIP: hasDrawContent===false の場合は無反応
  const handleFlipClick = useCallback(() => {
    if (!hasDrawContent) return;
    canvasRef.current?.flipHorizontal();
  }, [hasDrawContent]);

  // EVT_UNDO: Undoスタックから前の状態を復元
  const handleUndoClick = useCallback(() => {
    const snapshot = popUndo();
    if (snapshot && canvasRef.current) {
      canvasRef.current.loadSnapshot(snapshot);
    }
  }, [popUndo]);

  // EVT_REDO: Redoスタックから次の状態を復元
  const handleRedoClick = useCallback(() => {
    const snapshot = popRedo();
    if (snapshot && canvasRef.current) {
      canvasRef.current.loadSnapshot(snapshot);
    }
  }, [popRedo]);

  // 描画履歴を保存
  const handleHistoryChange = useCallback(
    (snapshot: string) => {
      pushUndo(snapshot);
    },
    [pushUndo]
  );

  const getTemplateComponent = () => {
    if (!selectedTemplateId) return null;
    const bodyPart = TEMPLATE_DATA.find((bp) => bp.id === selectedBodyPart);
    const template = bodyPart?.templates.find((t) => t.id === selectedTemplateId);
    if (!template) return null;
    const TemplateComponent = TEMPLATE_COMPONENTS[template.component];
    return TemplateComponent ? <TemplateComponent /> : null;
  };

  // テンプレートを SVG 文字列に変換（Fabric.js 背景用）
  const templateSvgString = useMemo(() => {
    const component = getTemplateComponent();
    if (!component) return null;
    return svgComponentToString(component);
  }, [selectedTemplateId, selectedBodyPart]);

  // EVT_CONFIRM: 空白確定確認ダイアログ → Base64変換 → BFF送信
  const handleConfirmClick = useCallback(() => {
    if (!hasDrawContent) {
      showDialog(
        'empty-confirm',
        '描画内容がありません。空白のシェーマとして保存してよろしいですか？',
        () => {
          const imageData = canvasRef.current?.save();
          if (imageData) {
            handleConfirm(imageData);
          }
          closeDialog();
        },
      );
    } else {
      const imageData = canvasRef.current?.save();
      if (imageData) {
        handleConfirm(imageData);
      }
    }
  }, [hasDrawContent, handleConfirm, showDialog, closeDialog]);

  // EVT_CANCEL: E003確認ダイアログ → onCancel呼び出し
  const handleCancelClick = useCallback(() => {
    if (hasDrawContent) {
      showDialog(
        'cancel-confirm',
        '描画内容が破棄されますがよろしいですか？',
        () => {
          closeDialog();
          onCancel?.();
        },
      );
    } else {
      onCancel?.();
    }
  }, [hasDrawContent, showDialog, closeDialog, onCancel]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-sm text-gray-500">読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <div className="w-full h-full bg-white flex flex-col">

        <div className="flex justify-end items-center px-4 py-2 border-b border-border">
          <ToolbarPanel
            onUndo={handleUndoClick}
            onRedo={handleRedoClick}
            onClear={handleClearClick}
            onFlip={handleFlipClick}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-6">
            <DrawingCanvas
              ref={canvasRef}
              tool={activeTool}
              color={strokeColor}
              brushSize={penSize}
              templateComponent={getTemplateComponent()}
              templateSvgString={templateSvgString}
              imageToLoad={imageToLoad}
              onHistoryChange={handleHistoryChange}
            />
          </div>

          <div className="w-80 border-l border-border flex flex-col overflow-hidden">
            <DrawingToolPanel
              activeTool={activeTool}
              strokeColor={strokeColor}
              penSize={penSize}
              onToolSelect={handleToolSelect}
              onColorChange={handleColorChange}
              onWidthChange={handleWidthChange}
            />

            <TemplateSelectorPanel
              selectedBodyPart={selectedBodyPart}
              selectedTemplateId={selectedTemplateId}
              favoriteTemplateIds={favoriteTemplateIds}
              onBodyPartChange={handleBodyPartChange}
              onTemplateSelect={handleTemplateSelect}
              onFavoriteToggle={handleFavoriteToggle}
              onImageImport={handleImageImport}
            />
          </div>
        </div>

        <FooterActionBar
          isSubmitting={isSubmitting}
          onCancel={handleCancelClick}
          onConfirm={handleConfirmClick}
        />
      </div>

      {/* 確認・エラーダイアログ */}
      {dialog.type !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <p className="text-sm text-gray-700 mb-6">{dialog.message}</p>
            <div className="flex justify-end gap-3">
              {dialog.type === 'error' ? (
                <button
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                >
                  閉じる
                </button>
              ) : (
                <>
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={dialog.onConfirm}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
                  >
                    OK
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
