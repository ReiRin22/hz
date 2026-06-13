'use client';

import { useAuthStore } from '@shared/stores/use-auth.store';
import { Toaster } from '@shared/components/atoms/sonner';
import { toast } from 'sonner';
import { Button } from '@shared/components/atoms/button';
import { Printer, FileText, Upload } from 'lucide-react';
import { SearchCriteria, type SearchFilters } from '../molecules/SearchCriteria';
import { OrderTable } from '../molecules/OrderTable';
import { ImplementerInputDialog } from '../molecules/ImplementerInputDialog';
import { AllergyDetailDialog } from '../molecules/AllergyDetailDialog';
import { ResultInputDialog } from '../molecules/ResultInputDialog';
import { MaterialRecordDialog } from '../molecules/MaterialRecordDialog';
import { PrintDialog } from '../molecules/PrintDialog';
import { useRouter } from 'next/navigation';
import { useDeptInstructionInit } from '../../hooks/useDeptInstructionInit';
import { useDeptInstructionActions } from '../../hooks/useDeptInstructionActions';
import { useDeptInstructionSubmit } from '../../hooks/useDeptInstructionSubmit';
import { useDeptInstructionStore } from '../../stores/useDeptInstructionStore';
import type { DeptInstructionConfig } from '../../types/deptInstructionConfig.type';
import type { Order, ImplementerInput, TestResult, MaterialItem } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const sc = i18n.deptInstruction.screen;

interface DeptInstructionScreenProps {
  config: DeptInstructionConfig;
  date?: string;
  onStatusUpdated?: (orderId: string, newStatus: string) => void;
}


export function DeptInstructionScreen({ config, date, onStatusUpdated }: DeptInstructionScreenProps) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.userName) ?? '';

  const store = useDeptInstructionStore();
  const actions = useDeptInstructionActions();
  const submit = useDeptInstructionSubmit(currentUser);
  const { initError } = useDeptInstructionInit(config, date);

  // 検索フィルター
  const handleSearch = (criteria: SearchFilters) => {
    actions.handleFilterOrders((order) => {
      const startOfDay = new Date(criteria.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(criteria.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      const orderDate = new Date(order.receivedAt);
      if (orderDate < startOfDay || orderDate > endOfDay) return false;
      if (criteria.locationFilter !== 'all' && order.location !== criteria.locationFilter) return false;
      if (criteria.department !== 'all' && order.department !== criteria.department) return false;
      if (criteria.orderType !== 'all' && order.orderType !== criteria.orderType) return false;
      if (criteria.orderType === 'SPECIMEN_TEST' && criteria.labTestLocation !== 'all' && order.labTestLocation !== criteria.labTestLocation) return false;
      if (criteria.orderType === 'PHYSIOLOGICAL_TEST' && criteria.physiologicalTestType !== 'all' && order.physiologicalTestType !== criteria.physiologicalTestType) return false;
      if (criteria.selectedStatuses.length > 0) {
        const matched = criteria.selectedStatuses.some(s => s.status === order.status);
        if (!matched) return false;
      }
      if (criteria.patientId.trim() && !order.patientId.toLowerCase().includes(criteria.patientId.toLowerCase())) return false;
      if (criteria.patientName.trim() && !order.patientName.toLowerCase().includes(criteria.patientName.toLowerCase()) && !order.patientKana.toLowerCase().includes(criteria.patientName.toLowerCase())) return false;
      if (criteria.attendingDoctor.trim() && !order.attendingDoctor?.toLowerCase().includes(criteria.attendingDoctor.toLowerCase())) return false;
      if (criteria.ward !== 'all' && order.ward !== criteria.ward) return false;
      // TODO: statusCompletion（受付未/済）は REG001 から受付済み情報を取得するフローで実装予定
      return true;
    });
  };

  const handleClear = () => {
    store.setFilteredOrders(store.orders);
    toast.info(sc.toasts.clearFilter);
  };

  // ステータス遷移ハンドラー
  const handleAccept = async (orderId: string) => {
    const result = await submit.handleStatusUpdate(orderId, 'accepted');
    if (result.ok) { toast.success(sc.toasts.accepted); onStatusUpdated?.(orderId, 'accepted'); }
    else { toast.error(result.message); }
  };

  const handleStart = (orderId: string) => {
    router.push(`/dept-instruction/patient-id-check?orderId=${orderId}`);
  };

  const handleImplement = (orderId: string) => {
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) return;
    actions.handleOpenImplementerDialog(order);
  };

  const handleImplementerSave = async (data: ImplementerInput) => {
    const order = store.selectedOrder;
    if (!order) return;
    actions.handleCloseImplementerDialog();
    const nextStatus = resolveNextStatus(order);
    const result = await submit.handleImplementer(order.id, data, nextStatus);
    if (result.ok) { toast.success(sc.toasts.implementerSaved); onStatusUpdated?.(order.id, nextStatus); }
    else { toast.error(result.message); }
  };

  const handleCollect = async (orderId: string) => {
    const result = await submit.handleStatusUpdate(orderId, 'collected');
    if (result.ok) { toast.success(sc.toasts.collected); onStatusUpdated?.(orderId, 'collected'); }
    else { toast.error(result.message); }
  };

  const handleReceive = async (orderId: string) => {
    const result = await submit.handleStatusUpdate(orderId, 'specimen_received');
    if (result.ok) {
      toast.success(sc.toasts.specimenReceived);
      onStatusUpdated?.(orderId, 'specimen_received');
      // [PLACEHOLDER: BILLING] 医事会計連携（検体受領時）— Phase 6 T6-3 で実装
      if (config.billingLinkTriggerStatuses?.includes('specimen_received')) {
        await submit.handleBillingLink(orderId, 'specimen_received');
      }
    } else { toast.error(result.message); }
  };

  const handleTestRequest = async (orderId: string) => {
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) return;
    const result = await submit.handleStatusUpdate(orderId, 'awaiting_result');
    if (result.ok) {
      const requestType = sc.testRequestTypes[order.orderType] ?? order.orderType;
      toast.success(sc.toasts.testRequested(requestType));
      onStatusUpdated?.(orderId, 'awaiting_result');
    } else { toast.error(result.message); }
  };

  const handleResultInput = (orderId: string) => {
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) return;
    router.push(`/exam-result/result-input?orderId=${orderId}`);
  };

  const handleResultSave = async (results: TestResult[], notes: string) => {
    const order = store.selectedOrder;
    if (!order) return;
    actions.handleCloseResultInputDialog();
    const abnormal = results.filter((r) => r.isAbnormal).length;
    const critical = results.filter((r) => r.abnormalLevel === 'critical').length;
    const result = await submit.handleStatusUpdate(order.id, 'result_entered');
    if (result.ok) {
      if (critical > 0) toast.error(sc.toasts.resultCritical(critical), { duration: 5000 });
      else if (abnormal > 0) toast.warning(sc.toasts.resultAbnormal(abnormal), { duration: 4000 });
      else toast.success(sc.toasts.resultSaved);
      onStatusUpdated?.(order.id, 'result_entered');
      // [PLACEHOLDER: BILLING] 結果入力済時の医事会計連携 — Phase 6 T6-3 で実装
      if (config.billingLinkTriggerStatuses?.includes('result_entered')) {
        await submit.handleBillingLink(order.id, 'result_entered');
      }
    } else { toast.error(result.message); }
    void notes;
  };

  const handleMaterialRecord = (orderId: string) => {
    const order = store.orders.find((o) => o.id === orderId);
    if (!order) return;
    actions.handleOpenMaterialRecordDialog(order);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMaterialSave = (_materials: MaterialItem[], _notes?: string) => {
    const order = store.selectedOrder;
    actions.handleCloseMaterialRecordDialog();
    if (order) store.setMaterialRecorded(order.id, true);
    toast.success(sc.toasts.materialSaved);
  };

  // 印刷・帳票
  const handleDocumentPrint = () => {
    if (store.selectedOrderIds.length === 0) { toast.warning(sc.toasts.selectForDocument); return; }
    actions.handleOpenPrintDialog('document');
  };

  const handleLabelPrint = () => {
    if (store.selectedOrderIds.length === 0) { toast.warning(sc.toasts.selectForLabel); return; }
    actions.handleOpenPrintDialog('label');
  };

  const handlePrint = (selectedTypes: string[]) => {
    const labels = selectedTypes.map((t) => sc.printTypeLabels[t] ?? t).join('、');
    toast.success(sc.toasts.printSuccess(store.selectedOrderIds.length, labels));
    actions.handleClosePrintDialog();
    store.toggleAllOrders(false);
  };

  const handleResultUpload = () => {
    if (store.selectedOrderIds.length === 0) { toast.warning(sc.toasts.selectForUpload); return; }
    // [PLACEHOLDER: RESULT-UPLOAD] Phase 6 T6-4 で実装
    toast.info(sc.toasts.uploadNotImpl);
  };

  const handleRowDoubleClick = (patientId: string) => {
    router.push(`/karte/${patientId}`);
  };

  // SCOPE-OUT スタブ（他部門向け）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const noop = (orderId: string) => {};

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      <Toaster position="top-right" />

      {!config.hideTitle && (
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <h1 className="text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{config.description}</p>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
          {initError && (
            <div className="text-sm text-red-600">{initError}</div>
          )}
        <SearchCriteria onSearch={handleSearch} onClear={handleClear} availableOrderTypes={config.targetOrderTypes} />

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            {store.selectedOrderIds.length > 0 && (
              <div className="text-sm text-gray-600">
                <span className="text-blue-600">{sc.ordersSelected(store.selectedOrderIds.length)}</span>
              </div>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleResultUpload} className="gap-2">
                <Upload className="h-4 w-4" />
                {sc.buttons.resultUpload}
              </Button>
              <Button variant="outline" onClick={handleDocumentPrint} disabled={store.selectedOrderIds.length === 0} className="gap-2">
                <FileText className="h-4 w-4" />
                {sc.buttons.documentPrint}
              </Button>
              <Button variant="outline" onClick={handleLabelPrint} disabled={store.selectedOrderIds.length === 0} className="gap-2">
                <Printer className="h-4 w-4" />
                {sc.buttons.labelPrint}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-gray-700">{sc.orderListTitle}</h2>
            <div className="text-sm text-gray-600">{sc.ordersDisplayed(store.filteredOrders.length)}</div>
          </div>
          <OrderTable
            orders={store.filteredOrders}
            allOrders={store.orders}
            onRowDoubleClick={handleRowDoubleClick}
            onAccept={handleAccept}
            onStart={handleStart}
            onImplement={handleImplement}
            onDispense={noop}
            onCollect={handleCollect}
            onReceive={handleReceive}
            onAllergyClick={(order: Order) => actions.handleOpenAllergyDialog(order)}
            onResultInput={handleResultInput}
            onTestRequest={handleTestRequest}
            onNutritionRecord={noop}
            onPharmacistGuidance={noop}
            onMedicationHistory={noop}
            onEndoscopyReport={noop}
            onPacsReference={noop}
            onMaterialRecord={handleMaterialRecord}
            selectedOrders={store.selectedOrderIds}
            onToggleOrder={actions.handleToggleOrderSelection}
            onToggleAll={actions.handleToggleAllOrders}
          />
        </div>
        </div>
      </main>

      <ImplementerInputDialog
        open={store.isImplementerDialogOpen}
        onClose={actions.handleCloseImplementerDialog}
        onSave={handleImplementerSave}
        currentUser={currentUser}
      />

      {/* TODO: contraindications/medicalHistory は将来の患者アレルギー API 実装後に BFF 経由で取得して渡す */}
      <AllergyDetailDialog
        open={store.isAllergyDialogOpen}
        onClose={actions.handleCloseAllergyDialog}
        order={store.selectedOrder}
        currentUser={currentUser}
      />

      <ResultInputDialog
        open={store.isResultInputDialogOpen}
        onClose={actions.handleCloseResultInputDialog}
        onSave={handleResultSave}
        order={store.selectedOrder}
      />

      <MaterialRecordDialog
        open={store.isMaterialRecordDialogOpen}
        onClose={actions.handleCloseMaterialRecordDialog}
        order={store.selectedOrder}
        onSave={handleMaterialSave}
      />

      {/* [PLACEHOLDER: EXTERNAL-LAB] externalLabSlip prop を Phase 6 T6-4 で追加 */}
      <PrintDialog
        open={store.isPrintDialogOpen}
        onClose={actions.handleClosePrintDialog}
        onPrint={handlePrint}
        selectedCount={store.selectedOrderIds.length}
        type={store.printType}
        selectedOrderTypes={
          store.orders
            .filter((o) => store.selectedOrderIds.includes(o.id))
            .map((o) => o.orderType)
        }
      />
    </div>
  );
}

function resolveNextStatus(order: Order): Order['status'] {
  if (order.orderType === 'SPECIMEN_TEST') {
    if (order.status === 'accepted') return 'started';
    if (order.status === 'started') return 'collected';
    if (order.status === 'collected') return 'specimen_received';
    if (order.status === 'specimen_received') return 'implemented';
  } else if (order.orderType === 'PHYSIOLOGICAL_TEST') {
    if (order.status === 'started') return 'implemented';
  } else if (order.orderType === 'PATHOLOGY' || order.orderType === 'BACTERIA') {
    if (order.status === 'awaiting_result') return 'implemented';
  }
  return 'implemented';
}
