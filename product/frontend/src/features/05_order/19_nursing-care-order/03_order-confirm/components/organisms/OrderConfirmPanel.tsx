'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/atoms/button';
import { i18n } from '@/shared/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/atoms/dialog';
import { useOrderConfirmStore } from '../../stores/orderConfirm.store';
import { useOrderConfirmInit } from '../../hooks/useOrderConfirmInit';
import { useOrderConfirmActions } from '../../hooks/useOrderConfirmActions';
import { useOrderConfirmSubmit } from '../../hooks/useOrderConfirmSubmit';
import { PendingOrderRow } from '../molecules/PendingOrderRow';
import { ConfirmedOrderRow } from '../molecules/ConfirmedOrderRow';
import { PrintDialog } from '../molecules/PrintDialog';
import { OrderTypeSelectDialog } from '../molecules/OrderTypeSelectDialog';
import { EditConfirmDialog } from '../molecules/EditConfirmDialog';
import { RevokeConfirmDialog } from '../molecules/RevokeConfirmDialog';
import { ReprintConfirmDialog } from '../molecules/ReprintConfirmDialog';

interface OrderConfirmPanelProps {
  patientId: string;
  patientName: string;
  confirmedBy: string;
  isSubstituteUser: boolean;
  patientAllergies?: string[];
  onSpecimenOrderOpen?: () => void;
  onImagingOrderOpen?: () => void;
}

export function OrderConfirmPanel({
  patientId,
  patientName,
  confirmedBy,
  isSubstituteUser,
  patientAllergies = [],
  onSpecimenOrderOpen,
  onImagingOrderOpen,
}: OrderConfirmPanelProps) {
  const store = useOrderConfirmStore();
  const { refresh, initError, clearInitError } = useOrderConfirmInit(patientId);
  const actions = useOrderConfirmActions(isSubstituteUser, { onSpecimenOrderOpen, onImagingOrderOpen });
  const submit = useOrderConfirmSubmit(patientId, confirmedBy, patientAllergies);
  const [pendingOrderIds, setPendingOrderIds] = useState<string[]>([]);

  const totalCount = store.pendingOrders.length + store.confirmedOrders.length;

  const handleConfirmOrders = async () => {
    const orderIds = store.pendingOrders.map((o) => o.id);
    const result = await submit.handleConfirmOrders(orderIds);
    if (result === 'allergy_warning') {
      setPendingOrderIds(orderIds);
      return;
    }
    if (result) await refresh();
  };

  const handleConfirmForcedAfterWarning = async () => {
    const ok = await submit.handleConfirmOrdersForced(pendingOrderIds);
    submit.clearAllergyWarnings();
    setPendingOrderIds([]);
    if (ok) await refresh();
  };

  const handleCancelAllergyWarning = () => {
    submit.clearAllergyWarnings();
    setPendingOrderIds([]);
  };

  const handleDeletePending = async (orderId: string) => {
    const ok = await submit.handleDeletePendingOrder(orderId);
    if (ok) await refresh();
  };

  const handleRevokeOrder = async (cancelReason: string) => {
    if (!store.targetOrderId) return;
    const ok = await submit.handleRevokeOrder(store.targetOrderId, cancelReason);
    if (ok) await refresh();
  };

  const handleOutputForms = async (formIds: string[]) => {
    await submit.handleOutputForms(formIds);
  };

  const handleConfirmEdit = (_editReason: string) => {
    const target = store.confirmedOrders.find((o) => o.id === store.targetOrderId);
    if (!target) { console.error('対象オーダーが見つかりません', store.targetOrderId); return; }
    store.closeEditConfirmDialog();
    if (target.type === 'lab' && onSpecimenOrderOpen) {
      onSpecimenOrderOpen();
    } else if (target.type === 'imaging' && onImagingOrderOpen) {
      onImagingOrderOpen();
    } else {
      const orderType = store.orderTypes.find((ot) => ot.id === target.type);
      if (!orderType) { console.error('オーダー種別が見つかりません', target.type); return; }
      actions.handleConfirmEdit(orderType.route);
    }
  };

  const getOrderRoute = (orderType: string): string => {
    return store.orderTypes.find((ot) => ot.id === orderType)?.route ?? '';
  };

  return (
    <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-xl bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 relative overflow-hidden transition-shadow duration-200 hover:shadow-2xl h-full flex flex-col">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full translate-y-16 -translate-x-16" />

      {/* ヘッダーエリア */}
      <div className="px-3 pb-3 pt-3 relative z-10 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col min-w-0 overflow-hidden flex-1">
            <span className="text-lg font-semibold truncate text-medical-secondary" data-ui-id="LBL_TITLE">
              {i18n.orders.orderConfirmation.orderInput.title}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              {totalCount > 0 && (
                <span className="rounded px-2 py-0.5 text-xs text-white shadow-md bg-medical-secondary" data-ui-id="LBL_ORDER_COUNT">
                  {i18n.orders.orderConfirmation.orderInput.registered(totalCount)}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <Button
              className="text-white shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap disabled:bg-slate-300 disabled:text-slate-500 bg-medical-secondary-dark! hover:bg-[#047857]!"
              size="sm"
              data-ui-id="BTN_PRINT"
              onClick={actions.handleOpenPrintDialog}
            >
              {i18n.orders.orderConfirmation.orderInput.printOutput}
            </Button>
            <Button
              className="text-white shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap bg-medical-primary! hover:bg-medical-primary-dark!"
              size="sm"
              data-ui-id="BTN_CONFIRM"
              disabled={store.pendingOrders.length === 0 || store.isConfirming}
              onClick={handleConfirmOrders}
            >
              {store.isConfirming
                ? '確定中...'
                : i18n.orders.orderConfirmation.orderInput.submitOrder(store.pendingOrders.length)}
            </Button>
          </div>
        </div>

        {/* エラー表示 */}
        {initError && (
          <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
            {initError}
            <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-red-700" onClick={clearInitError}>
              ×
            </Button>
          </div>
        )}
        {submit.error && (
          <div className="mt-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700" role="alert">
            {submit.error.message}
            <Button variant="ghost" size="sm" className="ml-2 h-auto p-0 text-red-700" onClick={submit.clearError}>
              ×
            </Button>
          </div>
        )}
      </div>

      {/* オーダー追加ボタン（全幅） */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 px-3 pb-3 pt-2 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex gap-2">
          <Button
            className="flex-1 hover:opacity-90 text-white shadow-lg bg-medical-primary!"
            size="sm"
            data-ui-id="BTN_ADD_ORDER"
            onClick={actions.handleOpenOrderTypeDialog}
          >
            {i18n.orders.orderConfirmation.orderInputTabs.addOrder}
          </Button>
        </div>
      </div>

      {/* オーダーリスト */}
      <div className="flex-1 overflow-hidden flex flex-col pt-0 relative z-10">
        {totalCount === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{i18n.orders.orderConfirmation.orderInput.emptyTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {i18n.orders.orderConfirmation.orderInput.emptyDescLine1}<br />
                  {i18n.orders.orderConfirmation.orderInput.emptyDescLine2}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="px-3 pb-3 relative z-10">
              <div className="p-2 bg-gradient-to-r from-blue-50 via-white to-green-50 dark:from-blue-950/20 dark:via-gray-800/50 dark:to-green-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 space-y-3">
                {/* 未確定オーダー */}
                {store.pendingOrders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300" data-ui-id="SEC_PENDING">
                        {i18n.orders.orderConfirmation.orderList.pending(store.pendingOrders.length)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {store.pendingOrders.map((order) => (
                        <PendingOrderRow
                          key={order.id}
                          order={order}
                          onEdit={() => {
                            if (order.type === 'lab' && onSpecimenOrderOpen) {
                              onSpecimenOrderOpen();
                            } else if (order.type === 'imaging' && onImagingOrderOpen) {
                              onImagingOrderOpen();
                            } else {
                              const route = getOrderRoute(order.type);
                              if (route) actions.handleEditPendingOrder(order.id, route);
                            }
                          }}
                          onDelete={handleDeletePending}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 確定済みオーダー */}
                {store.confirmedOrders.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-green-700 dark:text-green-300" data-ui-id="SEC_CONFIRMED">
                        {i18n.orders.orderConfirmation.orderList.confirmed(store.confirmedOrders.length)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {store.confirmedOrders.map((order) => (
                        <ConfirmedOrderRow
                          key={order.id}
                          order={order}
                          onEdit={(orderId) => actions.handleOpenEditConfirmDialog(orderId)}
                          onRevoke={(orderId) => actions.handleOpenRevokeConfirmDialog(orderId)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* アレルギー警告ダイアログ */}
      <Dialog
        open={submit.allergyWarnings.length > 0}
        onOpenChange={(open) => { if (!open) handleCancelAllergyWarning(); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>アレルギー警告</DialogTitle>
            <DialogDescription>
              以下のオーダーで患者のアレルギー情報と一致する可能性があります。確認のうえ確定してください。
            </DialogDescription>
          </DialogHeader>
          <ul className="text-sm space-y-1 my-2" role="list">
            {submit.allergyWarnings.map((w) => (
              <li key={w.orderId} className="flex items-center gap-2 text-amber-700">
                <span className="font-medium">{w.orderName}</span>
                <span className="text-muted-foreground">→ アレルギー: {w.matchedAllergy}</span>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAllergyWarning}>キャンセル</Button>
            <Button variant="destructive" onClick={handleConfirmForcedAfterWarning}>
              警告を確認して確定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ダイアログ群 */}
      <PrintDialog
        open={store.isPrintDialogOpen}
        patientName={patientName}
        patientId={patientId}
        allForms={store.allForms}
        selectedForms={store.selectedForms}
        onSelectAll={actions.handleSelectAllForms}
        onToggleForm={actions.handleToggleFormSelection}
        onOutput={handleOutputForms}
        onClose={store.closePrintDialog}
      />

      <OrderTypeSelectDialog
        open={store.isOrderTypeDialogOpen}
        orderTypes={store.orderTypes}
        onSelect={actions.handleSelectOrderType}
        onClose={store.closeOrderTypeDialog}
      />

      <EditConfirmDialog
        open={store.isEditConfirmDialogOpen}
        isSubstituteUser={isSubstituteUser}
        onConfirm={handleConfirmEdit}
        onClose={store.closeEditConfirmDialog}
      />

      <RevokeConfirmDialog
        open={store.isRevokeConfirmDialogOpen}
        isSubstituteUser={isSubstituteUser}
        onConfirm={handleRevokeOrder}
        onClose={store.closeRevokeConfirmDialog}
      />

      <ReprintConfirmDialog
        open={store.isReprintConfirmDialogOpen}
        orderDiff=""
        onConfirmOnly={() => submit.handleConfirmOnly(store.pendingOrders.map((o) => o.id))}
        onReprint={() =>
          submit.handleReprintAndConfirm(
            store.pendingOrders.map((o) => o.id),
            store.selectedForms.map((f) => f.id),
          )
        }
        onClose={store.closeReprintConfirmDialog}
      />
    </div>
  );
}
