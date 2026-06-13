import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TestItem } from '../lib/types';
import { validateRequiredResultValue, validateLimits } from '../lib/validators';
import { useTestResults } from '../features/test-results/hooks/use-test-results';
import { useDeptInstructionSubmit } from '@/features/09_dept-instruction/01_dept-instruction/02_lab-instruction/hooks/useDeptInstructionSubmit';
import { useAuthStore } from '@shared/stores/use-auth.store';
import { modificationReasonService } from '../features/modification-reason/api/modification-reason-service';
import { pri001Service } from '../features/pri001/api/pri001-service';
import type { ModificationReasonOption } from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import { PatientHeaderOrganism } from '@/shared/components/organisms/patient-header/PatientHeaderOrganism';
import { TestResultTable } from '../components/organisms/TestResultTable';
import { TestItemSearchDialog } from '../components/organisms/TestItemSearchDialog';
import { ReasonDialog } from '../components/organisms/ReasonDialog';
import { ProxyInputConfirmDialog } from '../components/organisms/ProxyInputConfirmDialog';
import { BottomControls } from '../components/organisms/BottomControls';
import { EditingBadge } from '../components/molecules/EditingBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/shared/components/atoms/alert-dialog';
// TODO: 認証実装後にセッションから取得する
import { mockPatient, mockUser } from '../lib/mock-data';
import { BffApiError } from '@/shared/api/test-results/test-results-service';

// 設計書「エラーコード一覧」に基づく BFF エラーコード → 日本語メッセージ変換
const BFF_ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_DELETE: '自動連携された結果項目が含まれているため削除できません。（E003）',
  UNAUTHORIZED: '認証に失敗しました。再ログインしてください。（E004）',
  FORBIDDEN: '権限がありません。（E005）',
  NOT_FOUND: 'データが存在しません。（E006）',
  CONFLICT: '別ユーザーが編集中です。一覧画面に戻ってください。（E007）',
  VALIDATION_FORMAT: '入力内容に不正な値が含まれています。（E008）',
  TIMEOUT: '処理がタイムアウトしました。再度お試しください。（E997）',
  BAD_GATEWAY: 'サーバーとの通信に失敗しました。（E998）',
  SYSTEM_ERROR: 'システムエラーが発生しました。（E999）',
};

function toBffErrorMessage(err: unknown): string {
  if (err instanceof BffApiError) {
    return BFF_ERROR_MESSAGES[err.code] ?? BFF_ERROR_MESSAGES['SYSTEM_ERROR'];
  }
  return BFF_ERROR_MESSAGES['SYSTEM_ERROR'];
}

// 代行入力確認が必要なロール（設計書「前提条件（ロール・ステータス）」参照）
const PROXY_CONFIRM_ROLES = ['研修医', '看護師'];

export function TestResultInputPage({ orderId }: { orderId: string }) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.userName) ?? mockUser.name;
  const deptSubmit = useDeptInstructionSubmit(currentUser);

  const orderUuid = orderId || mockPatient.id;
  // TODO: 認証実装後はセッションから取得する
  const tenantId = mockUser.id;

  // TODO: 認証実装後はorderUuidからpatientIdを取得する（BFFレスポンスに追加予定）
  const patientId = mockPatient.id;
  const {
    correlationId,
    testResults,
    lockInfo,
    reasonRequired,
    availableUnits,
    error: testResultsError,
    addTestResult,
    updateTestResult,
    toggleSelection,
    selectAll,
    deleteSelected,
    confirmResults
  } = useTestResults(orderUuid, tenantId);

  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [modificationReasons, setModificationReasons] = useState<ModificationReasonOption[]>([]);
  // 確定ボタン押下後の多重送信防止
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  // フロントエンドバリデーション実行済み（行のE002表示トリガー）
  const [validationTriggered, setValidationTriggered] = useState(false);
  // エラーダイアログ（BFF通信エラー）
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // PRI001: 代行入力確認ダイアログ
  const [proxyConfirmMessage, setProxyConfirmMessage] = useState<string>('');
  const [showProxyConfirmDialog, setShowProxyConfirmDialog] = useState(false);
  // PRI001: 確認後に実行するアクション（画面ロード後の初期化 or 項目追加）
  const [pendingProxyAction, setPendingProxyAction] = useState<'init' | 'addItem' | null>(null);

  // BFF初期表示エラーをダイアログに反映
  useEffect(() => {
    if (testResultsError) {
      setErrorMessage(toBffErrorMessage(testResultsError));
    }
  }, [testResultsError]);

  // 画面ロード時のPRI001確認（H-03）
  // TODO: 認証実装後にセッションから取得したロールで判定する
  useEffect(() => {
    const role = mockUser.role;
    if (!PROXY_CONFIRM_ROLES.includes(role)) return;

    pri001Service.getProxyInputConfirm(orderUuid)
      .then((res) => {
        if (res.requiresConfirmation) {
          setProxyConfirmMessage(res.message);
          setPendingProxyAction('init');
          setShowProxyConfirmDialog(true);
        }
      })
      .catch((err: unknown) => {
        setErrorMessage(toBffErrorMessage(err));
      });
  }, [orderUuid]);

  const handleProxyConfirm = useCallback(() => {
    setShowProxyConfirmDialog(false);
    if (pendingProxyAction === 'addItem') {
      setShowSearchDialog(true);
    }
    // 'init' の場合は画面ロード済みのため追加アクション不要
    setPendingProxyAction(null);
  }, [pendingProxyAction]);

  const handleProxyCancel = useCallback(() => {
    setShowProxyConfirmDialog(false);
    setPendingProxyAction(null);
    router.back();
  }, [router]);

  // 項目追加ボタン押下時のPRI001確認（H-04）
  const handleAddItemClick = useCallback(() => {
    pri001Service.getProxyInputConfirm(orderUuid)
      .then((res) => {
        if (res.requiresConfirmation) {
          setProxyConfirmMessage(res.message);
          setPendingProxyAction('addItem');
          setShowProxyConfirmDialog(true);
        } else {
          setShowSearchDialog(true);
        }
      })
      .catch((err: unknown) => {
        setErrorMessage(toBffErrorMessage(err));
      });
  }, [orderUuid]);

  const handleTestItemSelect = (item: TestItem) => {
    const referenceValue = item.lowerReference && item.upperReference
      ? `${item.lowerReference}–${item.upperReference}` // U+2013 EN DASH（設計書仕様）
      : item.lowerReference
        ? `${item.lowerReference}–`
        : item.upperReference
          ? `–${item.upperReference}`
          : null;

    addTestResult({
      itemCode: item.code,
      itemName: item.name,
      resultValue: '',
      unit: item.unit,
      referenceValueDisplay: referenceValue,
      judgment: '',
      device: '',
      measurementDateTime: '',
      decimalPlaces: 0,
      comment: '',
      status: 'not-entered',
      hasError: false,
      previousResultValue: '',
      hasPreviousResult: false,
      criticalLower: item.criticalLower,
      criticalUpper: item.criticalUpper,
      lowerLimit: item.lowerReference ? parseFloat(item.lowerReference) : null,
      upperLimit: item.upperReference ? parseFloat(item.upperReference) : null,
      testDate: '',
      hasTestDate: true,
      isEditable: true,
      reasonRequired: false,
    });
  };

  const executeConfirm = useCallback(async (reason = '', otherText?: string) => {
    try {
      await confirmResults(reason, otherText);
      await deptSubmit.handleStatusUpdate(orderUuid, 'result_entered');
      router.back();
    } catch (err) {
      setErrorMessage(toBffErrorMessage(err));
      setConfirmDisabled(false);
    }
  }, [confirmResults, deptSubmit, orderUuid, router]);

  const handleConfirmClick = async () => {
    setValidationTriggered(true);

    // E001: 結果値の形式チェック（必須含む）
    const hasE001 = testResults.some(r => validateRequiredResultValue(r.resultValue) !== null);
    if (hasE001) return;

    // E002: 基準値の下限が上限を超える場合（referenceValueDisplay=null の行のみ）
    const hasE002 = testResults.some(r =>
      r.referenceValueDisplay === null &&
      validateLimits(String(r.lowerLimit ?? ''), String(r.upperLimit ?? '')) !== null
    );
    if (hasE002) return;

    // 単位の必須チェック
    const hasEmptyUnit = testResults.some(r => !r.unit);
    if (hasEmptyUnit) return;

    // バリデーション通過後に確定ボタンを非活性化（多重送信防止）
    setConfirmDisabled(true);

    if (reasonRequired) {
      try {
        const reasons = await modificationReasonService.getReasons(correlationId, tenantId);
        setModificationReasons(reasons);
        setShowReasonDialog(true);
      } catch (err) {
        setErrorMessage(toBffErrorMessage(err));
        setConfirmDisabled(false);
      }
    } else {
      await executeConfirm();
    }
  };

  const handleReasonConfirm = async (reason: string, otherText?: string) => {
    await executeConfirm(reason, otherText);
  };

  const handleReasonDialogOpenChange = (open: boolean) => {
    setShowReasonDialog(open);
    if (!open) {
      // EVT_CANCEL_DIALOG: ダイアログキャンセル時は確定ボタンを再活性化
      // 設計書では「RES002結果入力画面に遷移する」だが、画面遷移は未実装のためボタン再活性化で代替
      // TODO: 画面遷移実装後は router.push で【DEP002】臨床検査科指示受けへ戻る
      setConfirmDisabled(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <PatientHeaderOrganism patientId={patientId} />

      <div className="flex flex-1 overflow-hidden">
        <Tabs defaultValue="input" className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b bg-card px-4 pt-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger data-ui-id="TAB_EDIT" value="input">検査結果入力</TabsTrigger>
              <TabsTrigger
                data-ui-id="TAB_REF"
                data-action-id="ACT_RESULT_REFERENCE"
                value="reference"
              >
                検査結果参照
              </TabsTrigger>
            </TabsList>
            <EditingBadge lockStatus={lockInfo?.lockBy ?? null} />
          </div>

          <TabsContent value="input" className="flex-1 flex flex-col overflow-hidden m-0">
            <TestResultTable
              data={testResults}
              validationTriggered={validationTriggered}
              availableUnits={availableUnits}
              onUpdate={updateTestResult}
              onToggleSelection={toggleSelection}
              onSelectAll={selectAll}
              onDelete={deleteSelected}
              onAddItem={handleAddItemClick}
            />
          </TabsContent>

          <TabsContent value="reference" className="flex-1 flex flex-col overflow-hidden m-0">
            <div className="p-4 border-b bg-card">
              <h2>検査結果参照</h2>
              <p className="text-sm text-muted-foreground">
                過去の検査結果を参照します
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>検査結果参照画面（準備中）</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomControls
        disabled={confirmDisabled}
        onCancel={handleCancel}
        onConfirm={handleConfirmClick}
      />

      <ProxyInputConfirmDialog
        open={showProxyConfirmDialog}
        message={proxyConfirmMessage}
        onConfirm={handleProxyConfirm}
        onCancel={handleProxyCancel}
      />

      <TestItemSearchDialog
        open={showSearchDialog}
        onOpenChange={setShowSearchDialog}
        onSelect={handleTestItemSelect}
        correlationId={correlationId}
        tenantId={tenantId}
      />

      <ReasonDialog
        open={showReasonDialog}
        reasons={modificationReasons}
        onOpenChange={handleReasonDialogOpenChange}
        onConfirm={handleReasonConfirm}
      />

      <AlertDialog open={errorMessage !== null} onOpenChange={(open) => { if (!open) setErrorMessage(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>エラー</AlertDialogTitle>
            <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorMessage(null)}>閉じる</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
