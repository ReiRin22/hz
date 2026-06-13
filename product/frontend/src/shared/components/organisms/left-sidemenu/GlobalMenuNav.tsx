'use client';

import { Dialog } from '@/shared/components/atoms/dialog';
import { TooltipProvider } from '@/shared/components/atoms/tooltip';
import { CollapseButton } from '@/shared/components/atoms/left-sidemenu/CollapseButton';
import { MenuItemButton } from '@/shared/components/molecules/left-sidemenu/MenuItemButton';
import { PatientInfoButton } from '@/shared/components/molecules/left-sidemenu/PatientInfoButton';
import { SetButton } from '@/shared/components/molecules/left-sidemenu/SetButton';
import { OrderSubmenu } from '@/shared/components/molecules/left-sidemenu/OrderSubmenu';
import { PatientInfoDialog } from '@/shared/components/organisms/left-sidemenu/PatientInfoDialog';
import { SetSelectionDialog } from '@/shared/components/organisms/left-sidemenu/SetSelectionDialog';
import { AddMySetDialog } from '@/shared/components/organisms/left-sidemenu/AddMySetDialog';
import { FetchErrorDialog } from '@/shared/components/organisms/left-sidemenu/FetchErrorDialog';
import { getMenuItems } from '@/shared/assets/left-sidemenu/menuData';
import { CurrentPatient, ViewType, AddSetOrdersPayload, OrderTypeKey, OrderSetType } from '@/shared/types/left-sidemenu/menu.types';
import type { SetDataResponse, OrderItemResponse } from '@/front_bff_shared/features/ui-common/left-sidemenu/order-sets/types/responses/order-sets.response';

interface GlobalMenuNavProps {
  currentView: ViewType;
  activeOrderType: string;
  currentPatient?: CurrentPatient;
  isCollapsed: boolean;
  showOrderSubmenu: boolean;
  patientInfoOpen: boolean;
  setDialogOpen: boolean;
  addMySetDialogOpen: boolean;
  activeSetTab: OrderSetType;
  selectedSetOrderType: OrderTypeKey;
  newSetName: string;
  selectedItems: string[];
  mySets: SetDataResponse[];
  compositeSets: SetDataResponse[];
  availableOrders: OrderItemResponse[];
  errorMessage: string | null;
  onCollapseToggle: () => void;
  onShowOrderSubmenuToggle: () => void;
  onMenuClick?: (menuId: string) => void;
  onOrderTypeChange?: (type: string) => void;
  onPatientInfoOpenChange: (open: boolean) => void;
  onSetDialogOpenChange: (open: boolean) => void;
  onAddMySetDialogOpenChange: (open: boolean) => void;
  onActiveSetTabChange: (tab: OrderSetType) => void;
  onSelectedSetOrderTypeChange: (type: OrderTypeKey) => void;
  onNewSetNameChange: (name: string) => void;
  onItemToggle: (itemName: string, checked: boolean) => void;
  onAddSetOrders?: (payload: AddSetOrdersPayload) => void;
  onSaveMySet: () => void;
  onCancelMySet: () => void;
  onClearError: () => void;
}

export function GlobalMenuNav({
  currentView,
  activeOrderType,
  currentPatient,
  isCollapsed,
  showOrderSubmenu,
  patientInfoOpen,
  setDialogOpen,
  addMySetDialogOpen,
  activeSetTab,
  selectedSetOrderType,
  newSetName,
  selectedItems,
  mySets,
  compositeSets,
  availableOrders,
  errorMessage,
  onCollapseToggle,
  onShowOrderSubmenuToggle,
  onMenuClick,
  onOrderTypeChange,
  onPatientInfoOpenChange,
  onSetDialogOpenChange,
  onAddMySetDialogOpenChange,
  onActiveSetTabChange,
  onSelectedSetOrderTypeChange,
  onNewSetNameChange,
  onItemToggle,
  onAddSetOrders,
  onSaveMySet,
  onCancelMySet,
  onClearError,
}: GlobalMenuNavProps) {
  const menuItems = getMenuItems(currentView);

  // 各メニュー項目を取得
  const chartItem = menuItems.find(item => item.id === 'chart');
  const orderItem = menuItems.find(item => item.id === 'order');
  const resultsItem = menuItems.find(item => item.id === 'results');
  const patientItem = menuItems.find(item => item.id === 'patient');
  const documentItem = menuItems.find(item => item.id === 'document');
  const testAppointmentItem = menuItems.find(item => item.id === 'testAppointment');
  const appointmentItem = menuItems.find(item => item.id === 'appointment');
  // 個別のクリックハンドラー
  const handleChartClick = () => onMenuClick?.('chart');
  const handleOrderClick = () => {
    onShowOrderSubmenuToggle();
    onMenuClick?.('order');
  };
  const handleResultsClick = () => onMenuClick?.('results');
  const handlePatientClick = () => onMenuClick?.('patient');
  const handleDocumentClick = () => onMenuClick?.('document');
  const handleTestAppointmentClick = () => onMenuClick?.('testAppointment');
  const handleAppointmentClick = () => onMenuClick?.('appointment');

  return (
    <TooltipProvider delayDuration={300}>
      <nav className="flex-1 py-4">
        {/* 折りたたみボタン */}
        <CollapseButton isCollapsed={isCollapsed} onClick={onCollapseToggle} />

        {/* カルテ */}
        {chartItem && (
          <MenuItemButton
            item={chartItem}
            isCollapsed={isCollapsed}
            showOrderSubmenu={showOrderSubmenu}
            onClick={handleChartClick}
          />
        )}

        {/* オーダー + サブメニュー */}
        {orderItem && (
          <>
            <MenuItemButton
              item={{ ...orderItem, active: showOrderSubmenu }}
              isCollapsed={isCollapsed}
              showOrderSubmenu={showOrderSubmenu}
              onClick={handleOrderClick}
            />
            {showOrderSubmenu && orderItem.subItems && !isCollapsed && (
              <OrderSubmenu
                subItems={orderItem.subItems}
                activeOrderType={activeOrderType}
                onOrderTypeChange={onOrderTypeChange}
              />
            )}
          </>
        )}

        {/* 検査結果 */}
        {resultsItem && (
          <MenuItemButton
            item={resultsItem}
            isCollapsed={isCollapsed}
            showOrderSubmenu={showOrderSubmenu}
            onClick={handleResultsClick}
          />
        )}

        {/* 患者情報 + 患者一覧 */}
        {patientItem && (
          <>
            {currentPatient && (
              <Dialog open={patientInfoOpen} onOpenChange={onPatientInfoOpenChange}>
                <PatientInfoButton isCollapsed={isCollapsed} />
                <PatientInfoDialog currentPatient={currentPatient} />
              </Dialog>
            )}
            <MenuItemButton
              item={patientItem}
              isCollapsed={isCollapsed}
              showOrderSubmenu={showOrderSubmenu}
              onClick={handlePatientClick}
            />
          </>
        )}

        {/* 文書 */}
        {documentItem && (
          <MenuItemButton
            item={documentItem}
            isCollapsed={isCollapsed}
            showOrderSubmenu={showOrderSubmenu}
            onClick={handleDocumentClick}
          />
        )}

        {/* 検査予約 */}
        {testAppointmentItem && (
          <MenuItemButton
            item={testAppointmentItem}
            isCollapsed={isCollapsed}
            showOrderSubmenu={showOrderSubmenu}
            onClick={handleTestAppointmentClick}
          />
        )}

        {/* 診察予約 */}
        {appointmentItem && (
          <MenuItemButton
            item={appointmentItem}
            isCollapsed={isCollapsed}
            showOrderSubmenu={showOrderSubmenu}
            onClick={handleAppointmentClick}
          />
        )}

        {/* セットボタン */}
        <Dialog open={setDialogOpen} onOpenChange={onSetDialogOpenChange}>
          <SetButton isCollapsed={isCollapsed} />
          <SetSelectionDialog
            activeSetTab={activeSetTab}
            selectedSetOrderType={selectedSetOrderType}
            mySets={mySets}
            compositeSets={compositeSets}
            onSetTabChange={onActiveSetTabChange}
            onOrderTypeChange={onSelectedSetOrderTypeChange}
            onAddSetOrders={onAddSetOrders}
            onClose={() => onSetDialogOpenChange(false)}
            onAddMySet={() => onAddMySetDialogOpenChange(true)}
          />
        </Dialog>
      </nav>

      {/* Myセット追加ダイアログ */}
      <Dialog open={addMySetDialogOpen} onOpenChange={onAddMySetDialogOpenChange}>
        <AddMySetDialog
          newSetName={newSetName}
          selectedItems={selectedItems}
          availableOrders={availableOrders}
          onSetNameChange={onNewSetNameChange}
          onItemToggle={onItemToggle}
          onSave={onSaveMySet}
          onCancel={onCancelMySet}
        />
      </Dialog>

      {/* BFF fetch エラーダイアログ */}
      <FetchErrorDialog errorMessage={errorMessage} onClose={onClearError} />
    </TooltipProvider>
  );
}
