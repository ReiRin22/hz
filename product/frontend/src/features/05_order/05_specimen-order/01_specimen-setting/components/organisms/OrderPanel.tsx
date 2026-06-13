'use client';

/**
 * 右パネル - オーダーリスト
 *
 * 参照元: 【ORD032～ORD035】src/components/features/order-entry/organisms/RightPanel.tsx
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { ContrastAllergyConfirmDialog } from '@/features/05_order/08_imaging-order/01_imaging-setting/components/molecules/ContrastAllergyConfirmDialog';
import { useOrderEditing } from '../../hooks/useOrderEditing';
import { useOrderGrouping } from '../../hooks/useOrderGrouping';
import { useImagingOrders } from '../../hooks/useImagingOrders';
import { useOrderDialogs } from '../../hooks/useOrderDialogs';
import { checkAllergies } from '../../utils/allergyCheck';
import { groupOrdersByType } from '../../utils/orderCategorization';
import { getOrderTypeBadgeColor, getOrderTypeLabel, getGroupTypeBadgeInfo } from '../../utils/orderDisplayHelpers';
import { frequencyOptions, timingOptions } from '../../data/rightPanelData';
import { useImagingPanelData } from '../../hooks/useImagingPanelData';
import { OrderListHeaderActions } from '../molecules/OrderListHeaderActions';
import { ImagingSubTabs } from '../molecules/ImagingSubTabs';
import { ImagingHistoryList } from '../molecules/ImagingHistoryList';
import { ImagingSetsList } from '../molecules/ImagingSetsList';
import type { ImagingSetItem } from '../../hooks/useImagingPanelData';
import { EmptyOrderMessage } from '../molecules/EmptyOrderMessage';
import { OrderTypeSection } from '../molecules/OrderTypeSection';
import { OrderGroupCollapsible } from '../molecules/OrderGroupCollapsible';
import { SpecimenSetsList } from '../molecules/SpecimenSetsList';
import { SpecimenHistoryList } from '../molecules/SpecimenHistoryList';
import { SpecimenOrderEditForm } from './SpecimenOrderEditForm';
import type { RightPanelProps, OrdersByType } from '../../types/right-panel.types';

export type { RightPanelProps };

export function OrderPanel({
  confirmedOrders,
  onUpdateOrder,
  onAddOrder,
  onRemoveOrder,
  onConfirmAllOrders,
  activeOrderType,
  isLabDirectMode = false,
  savedOrderDataList,
  onSaveTemporary,
  onLoadTemporary,
  onDeleteSavedData,
  onDuplicateOrder,
  onAddNewOrder,
  onCloseImagingInput,
  onCloseLabInput,
  onNavigateToExamination,
  patientAllergies,
  onRemoveGroup,
  isTwoColumnMode = false,
  onEditImagingOrder,
  activeSubTab,
  onSubTabChange,
  showImagingOrderPanel,
  onShowImagingOrderPanelChange,
  editingOrders: externalEditingOrders,
  onEditingOrdersChange,
  patientId,
  specimenSets = [],
  specimenHistory = [],
  selectedSpecimenSetType = 'hospital',
  onSpecimenSetTypeChange,
  isSpecimenLoading = false,
  specimenError,
  onAddSpecimenItem,
  onAddSpecimenItems,
  showSpecimenEditForm = true,
  onShowSpecimenEditFormChange,
  confirmedSpecimenOrderCodes = [],
  onUpdateSpecimenGroupDate,
}: RightPanelProps) {
  const {
    imagingHistory,
    imagingSets,
    selectedSetType,
    setSelectedSetType,
    isLoading: isImagingLoading,
    error: imagingError,
  } = useImagingPanelData(patientId, activeSubTab ?? 'search');
  const {
    editingOrders,
    orderNotes,
    handleEdit,
    handleSave,
    handleCancel,
    updateEditingValue,
    setOrderNotes
  } = useOrderEditing({
    confirmedOrders,
    onUpdateOrder,
    onAddOrder,
    onNavigateToExamination,
    externalEditingOrders,
    onEditingOrdersChange
  });

  const {
    openGroups,
    setOpenGroups,
    editingGroups,
    setEditingGroups,
    groupNotes,
    setGroupNotes,
    groupPriority,
    setGroupPriority
  } = useOrderGrouping();

  const {
    expandedImagingOrders,
    setExpandedImagingOrders
  } = useImagingOrders({
    confirmedOrders,
    editingOrders,
    setEditingOrders: (value) => {
      if (onEditingOrdersChange) {
        if (typeof value === 'function') {
          onEditingOrdersChange(value(editingOrders));
        } else {
          onEditingOrdersChange(value);
        }
      }
    }
  });

  const {
    saveDialogOpen,
    setSaveDialogOpen,
    loadDialogOpen,
    setLoadDialogOpen,
    setRegistrationDialogOpen,
    setSetRegistrationDialogOpen,
    saveName,
    setSaveName,
    setName,
    setSetName,
    selectedOrdersForSet,
    setSelectedOrdersForSet,
    allergyWarningOpen,
    setAllergyWarningOpen,
    allergyWarnings,
    setAllergyWarnings,
    contrastAllergyWarningOpen,
    setContrastAllergyWarningOpen,
    contrastAllergyInstructions,
    setContrastAllergyInstructions,
    printConfirmDialogOpen,
    setPrintConfirmDialogOpen,
    selectedReports,
    setSelectedReports
  } = useOrderDialogs();

  // 造影剤アレルギー確認の対象オーダーを特定するための state
  const [contrastAllergyTargetOrderId, setContrastAllergyTargetOrderId] = useState<string | null>(null);

  const ordersByType: OrdersByType = {
    prescription: confirmedOrders.filter(order => order.type === 'prescription'),
    injection: confirmedOrders.filter(order => order.type === 'injection'),
    lab: confirmedOrders.filter(order => order.type === 'lab'),
    imaging: confirmedOrders.filter(order => order.type === 'imaging')
  };

  const handleConfirmWithAllergyCheck = () => {
    const warnings = checkAllergies(confirmedOrders, patientAllergies);

    if (warnings.length > 0) {
      setAllergyWarnings(warnings);
      setAllergyWarningOpen(true);
    } else {
      const hasImagingOrders = ordersByType.imaging.length > 0;
      if (hasImagingOrders) {
        setPrintConfirmDialogOpen(true);
      } else {
        onConfirmAllOrders();
      }
    }
  };

  const handleConfirmDespiteWarning = () => {
    setAllergyWarningOpen(false);
    setAllergyWarnings([]);

    const hasImagingOrders = ordersByType.imaging.length > 0;
    if (hasImagingOrders) {
      setPrintConfirmDialogOpen(true);
    } else {
      onConfirmAllOrders();
    }
  };

  const handleConfirmWithPrint = () => {
    setPrintConfirmDialogOpen(false);
    const selectedCount = Object.values(selectedReports).filter(v => v).length;
    if (selectedCount > 0) {
      window.print();
    }
    onConfirmAllOrders();
  };

  const handleConfirmWithoutPrint = () => {
    setPrintConfirmDialogOpen(false);
    onConfirmAllOrders();
  };

  const handleSetRegistration = () => {
    if (!setName.trim() || selectedOrdersForSet.length === 0) {
      return;
    }

    // ダイアログを閉じてリセット
    setSetRegistrationDialogOpen(false);
    setSetName('');
    setSelectedOrdersForSet([]);
  };

  const handleOpenSetRegistrationDialog = (open: boolean) => {
    setSetRegistrationDialogOpen(open);
    if (open) {
      setSelectedOrdersForSet(confirmedOrders.map(order => order.id));
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrdersForSet(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const selectAllOrders = () => {
    setSelectedOrdersForSet(confirmedOrders.map(order => order.id));
  };

  const deselectAllOrders = () => {
    setSelectedOrdersForSet([]);
  };

  const handleTemporarySave = () => {
    if (saveName.trim()) {
      onSaveTemporary(saveName.trim());
      setSaveName('');
      setSaveDialogOpen(false);
    }
  };

  const panelWidth = isTwoColumnMode ? 'flex-1' : (isLabDirectMode ? 'flex-1' : 'w-full');

  const handleTemporarySaveClick = () => {
    setSaveDialogOpen(true);
  };

  const handleAddNewImagingOrder = () => {
    const newOrder = {
      id: `new-imaging-${Date.now()}`,
      name: '新規画像検査',
      type: 'imaging' as const,
    };
    onAddOrder?.(newOrder);
    handleEdit(newOrder);
  };

  const handleAddClick = () => {
    if (activeOrderType === 'lab') {
      onCloseLabInput?.();
      return;
    }

    const imagingOrder = confirmedOrders.find(o => o.type === 'imaging');

    if (imagingOrder) {
      const editingData = editingOrders[imagingOrder.id];
      const useContrast = editingData?.useContrast ?? imagingOrder.useContrast;
      const hasAllergy = editingData?.hasAllergy ?? imagingOrder.hasAllergy;
      const allergyInstructions = editingData?.allergySpecialInstructions ?? imagingOrder.allergySpecialInstructions ?? '';

      if (useContrast && hasAllergy) {
        setContrastAllergyTargetOrderId(imagingOrder.id);
        setContrastAllergyInstructions(allergyInstructions);
        setContrastAllergyWarningOpen(true);
        return;
      }
    }

    if (onCloseImagingInput) {
      onCloseImagingInput();
    }
    if (onShowImagingOrderPanelChange) {
      onShowImagingOrderPanelChange(false);
    }
  };

  const handleContrastAllergyConfirm = () => {
    const imagingOrder = confirmedOrders.find(o => o.id === contrastAllergyTargetOrderId);

    if (imagingOrder) {
      updateEditingValue(imagingOrder.id, 'allergySpecialInstructions', contrastAllergyInstructions);

      const editingData = editingOrders[imagingOrder.id];
      if (editingData) {
        const updatedOrder = {
          ...imagingOrder,
          ...editingData,
          allergySpecialInstructions: contrastAllergyInstructions,
        };
        onUpdateOrder(updatedOrder);
      }
    }

    setContrastAllergyWarningOpen(false);
    setContrastAllergyInstructions('');

    if (onCloseImagingInput) {
      onCloseImagingInput();
    }
    if (onShowImagingOrderPanelChange) {
      onShowImagingOrderPanelChange(false);
    }
  };

  const handleContrastAllergyCancel = () => {
    setContrastAllergyWarningOpen(false);
    setContrastAllergyInstructions('');
  };

  return (
    <div className={`${panelWidth} bg-card flex flex-col h-full border-r border-border`}>
      <OrderListHeaderActions
        onTemporarySaveClick={handleTemporarySaveClick}
        onAddClick={handleAddClick}
      />

      <div className="flex-1 overflow-y-auto">
        {(activeOrderType === 'imaging' || activeOrderType === 'lab') && activeSubTab && onSubTabChange && (
          <ImagingSubTabs
            activeSubTab={activeSubTab}
            onSubTabChange={(value) => {
              onSubTabChange(value as 'search' | 'history' | 'sets');
            }}
          />
        )}

        {/* 検体検査コンテンツ */}
        {activeOrderType === 'lab' && activeSubTab && (
          <>
            {isSpecimenLoading && (
              <p role="status" aria-live="polite" className="text-sm text-muted-foreground py-2 px-4">
                読み込み中...
              </p>
            )}
            {specimenError && (
              <p role="alert" className="text-sm text-destructive py-2 px-4">{specimenError}</p>
            )}
            {!isSpecimenLoading && !specimenError && activeSubTab === 'sets' && onSubTabChange && (
              <div className="p-4">
                <SpecimenSetsList
                  setsData={specimenSets}
                  selectedSetType={selectedSpecimenSetType}
                  onSetTypeChange={onSpecimenSetTypeChange ?? (() => {})}
                  onAddItems={onAddSpecimenItems ?? (() => {})}
                  onSubTabChange={(tab) => {
                    onSubTabChange(tab);
                    if (tab === 'search') onShowSpecimenEditFormChange?.(false);
                  }}
                  confirmedOrderCodes={confirmedSpecimenOrderCodes}
                />
              </div>
            )}
            {!isSpecimenLoading && !specimenError && activeSubTab === 'history' && onSubTabChange && (
              <div className="p-4">
                <SpecimenHistoryList
                  historyData={specimenHistory}
                  onAddItem={onAddSpecimenItem ?? (() => undefined)}
                  onSubTabChange={(tab) => {
                    onSubTabChange(tab);
                    if (tab === 'search') onShowSpecimenEditFormChange?.(false);
                  }}
                  confirmedOrderCodes={confirmedSpecimenOrderCodes}
                />
              </div>
            )}
            {activeSubTab === 'search' && (confirmedOrders.length === 0 || showSpecimenEditForm) && (
              <div className="p-4">
                <SpecimenOrderEditForm
                  onAddItems={(items) => {
                    onAddSpecimenItems?.(items);
                    onShowSpecimenEditFormChange?.(false);
                  }}
                  onRemoveItem={(orderCode) => {
                    const order = confirmedOrders.find((o) => o.itemCode === orderCode);
                    if (order) onRemoveOrder(order.id);
                  }}
                  onCancel={confirmedOrders.length > 0 ? () => onShowSpecimenEditFormChange?.(false) : undefined}
                  addedOrderCodes={[
                    ...confirmedOrders.map((o) => o.itemCode ?? '').filter(Boolean),
                    ...confirmedSpecimenOrderCodes,
                  ]}
                />
              </div>
            )}
          </>
        )}

        {activeOrderType === 'imaging' && activeSubTab && activeSubTab !== 'search' ? (
          <div className="p-4">
            {isImagingLoading && (
              <p role="status" aria-live="polite" className="text-sm text-muted-foreground py-2">
                読み込み中...
              </p>
            )}
            {imagingError && (
              <p role="alert" className="text-sm text-destructive py-2">
                {imagingError}
              </p>
            )}
            {!isImagingLoading && !imagingError && activeSubTab === 'history' && (
              <ImagingHistoryList
                historyData={imagingHistory}
                onAddOrder={onAddOrder}
                onSubTabChange={onSubTabChange}
              />
            )}

            {!isImagingLoading && !imagingError && activeSubTab === 'sets' && (
              <ImagingSetsList
                setsData={imagingSets}
                onAddOrder={onAddOrder}
                onSubTabChange={onSubTabChange}
                selectedSetType={selectedSetType}
                onSetTypeChange={setSelectedSetType}
              />
            )}
          </div>
        ) : activeOrderType === 'lab' && (confirmedOrders.length === 0 || showSpecimenEditForm) ? null
        : activeOrderType !== 'lab' && confirmedOrders.length === 0 ? (
          activeOrderType === 'imaging' ? (
            <div className="p-8 text-center text-muted-foreground">
              <div className="text-lg mb-2">オーダーがありません</div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddNewImagingOrder}
                className="mt-2 gap-1"
              >
                <Plus className="w-4 h-4" />
                新規画像検査を追加
              </Button>
            </div>
          ) : (
            <EmptyOrderMessage />
          )
        ) : (
          <div className="p-4 space-y-4">
            {Object.entries(ordersByType).map(([orderType, orders]) => {
              if (orders.length === 0) return null;
              const { grouped, ungrouped } = groupOrdersByType(orders);

              return (
                <OrderTypeSection
                  key={orderType}
                  orderType={orderType}
                  orders={orders}
                  grouped={grouped}
                  ungrouped={ungrouped}
                  editingOrders={editingOrders}
                  expandedImagingOrders={expandedImagingOrders}
                  orderNotes={orderNotes}
                  frequencyOptions={frequencyOptions}
                  timingOptions={timingOptions}
                  openGroups={openGroups}
                  editingGroups={editingGroups}
                  groupNotes={groupNotes}
                  groupPriority={groupPriority}
                  onAddNewOrder={
                    orderType === 'imaging' ? handleAddNewImagingOrder
                    : orderType === 'lab' ? () => onShowSpecimenEditFormChange?.(true)
                    : undefined
                  }
                  onEdit={handleEdit}
                  onEditImagingOrder={onEditImagingOrder}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onRemove={onRemoveOrder}
                  onNavigateToExamination={onNavigateToExamination}
                  onExpandedChange={(orderId, expanded) =>
                    setExpandedImagingOrders(prev => ({ ...prev, [orderId]: expanded }))
                  }
                  updateEditingValue={updateEditingValue}
                  setOpenGroups={setOpenGroups}
                  setEditingGroups={setEditingGroups}
                  setGroupNotes={setGroupNotes}
                  setGroupPriority={setGroupPriority}
                  getOrderTypeBadgeColor={getOrderTypeBadgeColor}
                  getOrderTypeLabel={getOrderTypeLabel}
                  getGroupTypeBadge={getGroupTypeBadgeInfo}
                  renderGroupCollapsible={(groupId, groupOrders) => {
                    const isGroupOpen = openGroups[groupId] ?? groupId.startsWith('lab-specimen-');

                    return (
                      <OrderGroupCollapsible
                        key={groupId}
                        groupId={groupId}
                        groupOrders={groupOrders}
                        isGroupOpen={isGroupOpen}
                        editingGroups={editingGroups}
                        groupPriority={groupPriority}
                        groupNotes={groupNotes}
                        editingOrders={editingOrders}
                        expandedImagingOrders={expandedImagingOrders}
                        orderNotes={orderNotes}
                        frequencyOptions={frequencyOptions}
                        timingOptions={timingOptions}
                        onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, [groupId]: open }))}
                        onEditGroup={() => {
                          const isCurrentlyEditing = editingGroups[groupId];
                          setEditingGroups(prev => ({ ...prev, [groupId]: !isCurrentlyEditing }));
                          if (!isCurrentlyEditing) {
                            setOpenGroups(prev => ({ ...prev, [groupId]: true }));
                          }
                        }}
                        onSaveGroup={() => {
                          setEditingGroups(prev => ({ ...prev, [groupId]: false }));
                        }}
                        onCancelGroup={() => {
                          setEditingGroups(prev => ({ ...prev, [groupId]: false }));
                        }}
                        onRemoveGroup={() => {
                          groupOrders.forEach(order => {
                            onRemoveOrder(order.id);
                          });
                        }}
                        onUpdateGroupDate={onUpdateSpecimenGroupDate}
                        onNavigateToExamination={onNavigateToExamination}
                        onEdit={handleEdit}
                        onEditImagingOrder={onEditImagingOrder}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onRemove={onRemoveOrder}
                        onExpandedChange={(orderId, expanded) =>
                          setExpandedImagingOrders(prev => ({ ...prev, [orderId]: expanded }))
                        }
                        updateEditingValue={updateEditingValue}
                        setGroupPriority={(value) => setGroupPriority(prev => ({ ...prev, [groupId]: value }))}
                        setGroupNotes={(value) => setGroupNotes(prev => ({ ...prev, [groupId]: value }))}
                        getGroupTypeBadge={getGroupTypeBadgeInfo}
                      />
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <ContrastAllergyConfirmDialog
        open={contrastAllergyWarningOpen}
        onOpenChange={setContrastAllergyWarningOpen}
        specialInstructions={contrastAllergyInstructions}
        onSpecialInstructionsChange={setContrastAllergyInstructions}
        onConfirm={handleContrastAllergyConfirm}
        onCancel={handleContrastAllergyCancel}
      />
    </div>
  );
}
