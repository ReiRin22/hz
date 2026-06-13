'use client';

import { useEffect } from 'react';
import { useOrderEntryInit } from '../../hooks/useOrderEntryInit';
import { useOrderEntryActions } from '../../hooks/useOrderEntryActions';
import { useOrderEntrySubmit } from '../../hooks/useOrderEntrySubmit';
import { useOrderEntryStore } from '../../stores/use-order-entry.store';
import { GlobalMenu } from './GlobalMenu';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';
import { SystemMenu } from './SystemMenu';

export function OrderEntryOrganism() {
  const { currentPatient } = useOrderEntryInit();

  const {
    activeFilter,
    handleOrderTypeChange,
    handleAddSetOrders,
    handleAddToOrder,
    handleLoadTemporary,
    handleDeleteSavedData,
    handleAddCandidateFromPanel,
    handleAddMultipleCandidates,
    handleAddToDetailDirect,
    handleAddMultipleToDetailDirect,
    handleFilterChange,
  } = useOrderEntryActions();

  const { isSubmitting, handleConfirmAllOrders, handleSaveTemporary } = useOrderEntrySubmit(currentPatient.id);

  const activeTab = useOrderEntryStore((s) => s.activeTab);
  const candidates = useOrderEntryStore((s) => s.candidates);
  const confirmedOrders = useOrderEntryStore((s) => s.confirmedOrders);
  const savedOrderDataList = useOrderEntryStore((s) => s.savedOrderDataList);
  const updateConfirmedOrder = useOrderEntryStore((s) => s.updateConfirmedOrder);
  const removeConfirmedOrder = useOrderEntryStore((s) => s.removeConfirmedOrder);
  const removeConfirmedOrdersByGroupId = useOrderEntryStore((s) => s.removeConfirmedOrdersByGroupId);
  // T6-2: APIから取得した履歴・セットデータ
  const orderHistoryByTab = useOrderEntryStore((s) => s.orderHistoryByTab);
  const orderSetsByTab = useOrderEntryStore((s) => s.orderSetsByTab);

  useEffect(() => {
    return () => {
      useOrderEntryStore.getState().reset();
    };
  }, []);

  return (
    <div className="h-screen flex bg-background relative">
      <GlobalMenu
        activeOrderType={activeTab}
        onOrderTypeChange={handleOrderTypeChange}
        onMenuClick={() => {}}
        currentView="order"
        currentPatient={currentPatient}
        onAddSetOrders={handleAddSetOrders}
      />

      <div className="w-[300px] border-r border-border">
        <LeftPanel
          activeTab={activeTab}
          onTabChange={handleOrderTypeChange}
          onAddCandidate={handleAddCandidateFromPanel}
          onAddMultipleCandidates={handleAddMultipleCandidates}
          onAddToDetail={handleAddToDetailDirect}
          onAddMultipleToDetail={handleAddMultipleToDetailDirect}
          onAddSetOrders={handleAddSetOrders}
          apiHistoryByTab={orderHistoryByTab}
          apiSetsByTab={orderSetsByTab}
        />
      </div>

      <div className="w-[450px] border-r border-border">
        <CenterPanel
          candidates={candidates}
          onAddToDetail={handleAddToOrder}
          onAddMultipleToDetail={(items) =>
            items.forEach((item) => handleAddToOrder(item))
          }
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>

      <div className="w-[500px] border-r border-border flex-1">
        <RightPanel
          confirmedOrders={confirmedOrders}
          onUpdateOrder={updateConfirmedOrder}
          onRemoveOrder={removeConfirmedOrder}
          onConfirmAllOrders={handleConfirmAllOrders}
          isSubmitting={isSubmitting}
          activeOrderType={activeTab}
          isLabDirectMode={activeTab === 'lab'}
          savedOrderDataList={savedOrderDataList}
          onSaveTemporary={handleSaveTemporary}
          onLoadTemporary={handleLoadTemporary}
          onDeleteSavedData={handleDeleteSavedData}
          patientAllergies={currentPatient.allergies}
          onRemoveGroup={removeConfirmedOrdersByGroupId}
          onAddSetOrders={handleAddSetOrders}
        />
      </div>

      <SystemMenu />
    </div>
  );
}
