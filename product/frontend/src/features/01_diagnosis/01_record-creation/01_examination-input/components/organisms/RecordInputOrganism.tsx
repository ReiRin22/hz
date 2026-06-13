'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/shared/components/atoms/card';
import { Label } from '@/shared/components/atoms/label';
import { useRecordInputStore } from '../../stores/recordInput.store';
import { useRecordInputInit } from '../../hooks/useRecordInputInit';
import { useRecordInputActions } from '../../hooks/useRecordInputActions';
import { useRecordInputSubmit } from '../../hooks/useRecordInputSubmit';
import { useDraftActions } from '../../hooks/useDraftActions';
import { useMyCommentActions } from '../../hooks/useMyCommentActions';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { RecordInputHeaderMolecule } from '../molecules/RecordInputHeaderMolecule';
import { RecordDateInputMolecule } from '../molecules/RecordDateInputMolecule';
import { RecordRecorderSelectMolecule } from '../molecules/RecordRecorderSelectMolecule';
import { DraftDropdownMolecule } from '../molecules/DraftDropdownMolecule';
import { RecordToolbarMolecule } from '../molecules/RecordToolbarMolecule';
import { VoiceInputIndicatorMolecule } from '../molecules/VoiceInputIndicatorMolecule';
import { TextFormattingToolbar } from '../molecules/TextFormattingToolbar';
import { RichTextEditor, type RichTextEditorRef } from '../molecules/RichTextEditor';
import { DraggableCommentPopup } from './DraggableCommentPopup';
import { DraggableSchemaPopup } from './DraggableSchemaPopup';
import { MyCommentManagementDialog } from './MyCommentManagementDialog';
import type { CommentOption, DraftViewModel, TemplateViewModel } from '../../types/recordInput.type';

const DEFAULT_TEMPLATES: TemplateViewModel[] = [
  {
    id: 'general',
    name: '一般診療',
    content: `S (Subjective - 主観的情報):\n主訴：\n現病歴：\n既往歴：\n家族歴：\n社会歴：\n\nO (Objective - 客観的情報):\nバイタルサイン：\n身体所見：\n検査結果：\n\nA (Assessment - 評価・診断):\n診断：\n鑑別診断：\n\nP (Plan - 計画・治療方針):\n治療方針：\n処方：\n次回予定：`,
  },
  {
    id: 'followup',
    name: 'フォローアップ',
    content: `S (Subjective - 主観的情報):\n前回診療後の経過：\n症状の変化：\n服薬状況：\n\nO (Objective - 客観的情報):\nバイタルサイン：\n身体所見：\n検査結果：\n\nA (Assessment - 評価・診断):\n現状評価：\n治療効果：\n\nP (Plan - 計画・治療方針):\n継続治療：\n調整内容：\n次回予定：`,
  },
  {
    id: 'emergency',
    name: '救急外来',
    content: `S (Subjective - 主観的情報):\n主訴：\n発症時刻・状況：\n既往歴：\nアレルギー：\n\nO (Objective - 客観的情報):\nバイタルサイン：\n意識レベル：\n身体所見：\n緊急検査：\n\nA (Assessment - 評価・診断):\n緊急度：\n診断：\n\nP (Plan - 計画・治療方針):\n緊急処置：\n入院適応：\n継続治療：`,
  },
];

type RecordInputOrganismProps = {
  patientId: string;
  receptionId: string;
  recordId?: string;
  loginUserName: string;
  recorderId: string;
  onConfirmed?: (recordId: string) => void;
};

export function RecordInputOrganism({
  patientId,
  receptionId,
  recordId,
  loginUserName,
  recorderId,
  onConfirmed,
}: RecordInputOrganismProps) {
  const router = useRouter();
  const params = useParams<{ patientId?: string }>();

  const mode = useRecordInputStore((s) => s.mode);
  const recordDate = useRecordInputStore((s) => s.recordDate);
  const authorName = useRecordInputStore((s) => s.authorName);
  const soapText = useRecordInputStore((s) => s.soapText);
  const hasDraft = useRecordInputStore((s) => s.hasDraft);
  const isEditable = useRecordInputStore((s) => s.isEditable);
  const confirmButtonDisabled = useRecordInputStore((s) => s.confirmButtonDisabled);
  const isVoiceActive = useRecordInputStore((s) => s.isVoiceActive);
  const setRecordDate = useRecordInputStore((s) => s.setRecordDate);
  const setSoapText = useRecordInputStore((s) => s.setSoapText);

  // Page スコープストアのアンマウントリセット
  useEffect(() => {
    return () => {
      useRecordInputStore.getState().reset();
    };
  }, []);

  // UI ローカル状態
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [showMyCommentManagement, setShowMyCommentManagement] = useState(false);
  const [comments, setComments] = useState<CommentOption[]>([]);
  const [drafts, setDrafts] = useState<DraftViewModel[]>([]);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  // 音声デモ用ローカル状態
  const [audioLevel, setAudioLevel] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const animationFrameRef = useRef<number | null>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const richTextEditorRef = useRef<RichTextEditorRef>(null);
  const soapContainerRef = useRef<HTMLDivElement>(null);

  // フック
  useRecordInputInit({ patientId, recordId, loginUserName });
  useVoiceInput();

  const { handleLoadComments, handleApplyComment, handleApplyTemplate, handleApplyDraft, handleOpenSchema, handleLoadDrafts, handleToggleVoice } =
    useRecordInputActions({
      patientId,
      onLoadComments: setComments,
      onLoadDrafts: setDrafts,
      onNavigateToSchema: () => {
        setShowSchema(true);
      },
    });

  const { handleConfirm, handleSaveDraft, validationErrors } = useRecordInputSubmit({
    patientId,
    receptionId,
    recordId,
    recorderId,
    onConfirmed,
    onDraftSaved: () => handleLoadDrafts(),
  });

  const { handleDeleteDraft } = useDraftActions({ patientId });
  const { handleSaveMyComment, handleDeleteMyComment } = useMyCommentActions({
    onUpdated: () => handleLoadComments('MY'),
  });

  // 音声デモ: isVoiceActive が true のときアニメーション開始
  useEffect(() => {
    if (!isVoiceActive) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (voiceTimerRef.current) clearTimeout(voiceTimerRef.current);
      setAudioLevel(0);
      setInterimTranscript('');
      return;
    }

    const updateLevel = () => {
      setAudioLevel(20 + Math.random() * 60);
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    updateLevel();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isVoiceActive]);

  const handleOpenComment = useCallback(async () => {
    await handleLoadComments('MY');
    setShowComments(true);
  }, [handleLoadComments]);

  const handleOpenMyCommentManagement = useCallback(async () => {
    await handleLoadComments('MY');
    setShowMyCommentManagement(true);
  }, [handleLoadComments]);

  const handleOpenDrafts = useCallback(async (open: boolean) => {
    if (open) await handleLoadDrafts();
    setShowDrafts(open);
  }, [handleLoadDrafts]);

  const handleApplyCommentToEditor = useCallback((comment: CommentOption) => {
    if (richTextEditorRef.current) {
      richTextEditorRef.current.insertText(`\n${comment.content}\n`);
      richTextEditorRef.current.focus();
    }
    handleApplyComment(comment.content);
  }, [handleApplyComment]);

  const handleApplyTemplateAndClose = useCallback((template: TemplateViewModel) => {
    handleApplyTemplate(template);
    setShowTemplates(false);
  }, [handleApplyTemplate]);

  const handleDeleteDraftAndSync = useCallback(async (draftId: string) => {
    await handleDeleteDraft(draftId);
    await handleLoadDrafts();
  }, [handleDeleteDraft, handleLoadDrafts]);

  const handleSchemaConfirm = useCallback((schemaUuid: string, base64Image: string) => {
    // TODO: シェーマをSOAPテキストに挿入する処理を実装
    console.log('Schema confirmed:', { schemaUuid, base64Image });

    // エディタに挿入（仮実装）
    if (richTextEditorRef.current) {
      richTextEditorRef.current.insertText(`\n[シェーマ: ${schemaUuid}]\n`);
      richTextEditorRef.current.focus();
    }
  }, []);

  return (
    <>
      <MyCommentManagementDialog
        open={showMyCommentManagement}
        onOpenChange={async (open) => {
          if (open) await handleLoadComments('MY');
          setShowMyCommentManagement(open);
        }}
        comments={comments.filter((c) => c.type === 'MY')}
        onSaveComment={handleSaveMyComment}
        onDeleteComment={handleDeleteMyComment}
      />

      <DraggableCommentPopup
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        onCommentSelect={handleApplyCommentToEditor}
        onCommentTabChange={handleLoadComments}
        onMyCommentManagementOpen={() => {
          setShowComments(false);
          handleOpenMyCommentManagement();
        }}
        soapContainerRef={soapContainerRef}
      />

      <DraggableSchemaPopup
        isOpen={showSchema}
        onClose={() => setShowSchema(false)}
        onSchemaConfirm={handleSchemaConfirm}
        soapContainerRef={soapContainerRef}
      />

      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <RecordInputHeaderMolecule
            isEditable={isEditable}
            confirmButtonDisabled={confirmButtonDisabled}
            validationErrors={validationErrors}
            onSaveDraft={handleSaveDraft}
            onConfirm={handleConfirm}
          />
        </CardHeader>

        <CardContent className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <RecordDateInputMolecule
              value={recordDate}
              disabled={!isEditable || mode === 'edit'}
              onChange={setRecordDate}
            />
            <RecordRecorderSelectMolecule authorName={authorName} />
          </div>

          <div className="space-y-4 flex-1" ref={soapContainerRef}>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">診察記録（SOAP形式）</Label>
                {hasDraft && (
                  <DraftDropdownMolecule
                    drafts={drafts}
                    open={showDrafts}
                    onOpenChange={handleOpenDrafts}
                    onApplyDraft={(draft) => {
                      handleApplyDraft(draft);
                      setShowDrafts(false);
                    }}
                    onDeleteDraft={handleDeleteDraftAndSync}
                  />
                )}
              </div>

              <RecordToolbarMolecule
                isEditable={isEditable}
                isVoiceActive={isVoiceActive}
                showTemplates={showTemplates}
                templates={DEFAULT_TEMPLATES}
                onToggleVoice={handleToggleVoice}
                onOpenComment={handleOpenComment}
                onToggleTemplates={setShowTemplates}
                onApplyTemplate={handleApplyTemplateAndClose}
                onOpenSchema={handleOpenSchema}
              />
            </div>

            {isVoiceActive && (
              <VoiceInputIndicatorMolecule
                audioLevel={audioLevel}
                interimTranscript={interimTranscript}
                onStop={handleToggleVoice}
              />
            )}

            <TextFormattingToolbar
              onFormatApply={(format) => richTextEditorRef.current?.applyFormat(format)}
              disabled={!isEditable}
              activeFormats={activeFormats}
            />

            <div className="relative flex-1">
              <RichTextEditor
                ref={richTextEditorRef}
                value={soapText}
                onChange={setSoapText}
                onActiveFormatsChange={setActiveFormats}
                disabled={!isEditable}
                placeholder={`SOAP形式で診察記録を記入してください

S (Subjective - 主観的情報):
・主訴：患者の主な訴えや症状

O (Objective - 客観的情報):
・バイタルサイン：血圧、脈拍、体温

A (Assessment - 評価・診断):
・診断名：疑われる疾患名

P (Plan - 計画・治療方針):
・治療計画：薬物療法、手術、処置など`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
