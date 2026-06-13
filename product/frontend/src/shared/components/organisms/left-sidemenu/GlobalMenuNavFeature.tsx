'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useGlobalMenuState } from '@/shared/hooks/left-sidemenu/useGlobalMenuState';
import { useAddMySetDialog } from '@/shared/hooks/left-sidemenu/useAddMySetDialog';
import { useOrderSets } from '@/shared/hooks/left-sidemenu/useOrderSets';
import { GlobalMenuNav } from '@/shared/components/organisms/left-sidemenu/GlobalMenuNav';
import { CurrentPatient, AddSetOrdersPayload, OrderTypeKey, ViewType } from '@/shared/types/left-sidemenu/menu.types';

// TODO: 認証セッション実装後、ログインユーザー情報から動的に取得する
const currentPatient: CurrentPatient = {
  id: 'P001',
  name: '山田太郎',
  age: 45,
  gender: 'male',
  patientNumber: '12345678',
  visitDate: new Date().toISOString().split('T')[0],
  allergies: ['ペニシリン系', 'アルコール'],
};

interface GlobalMenuNavFeatureProps {
  onAddSetOrders?: (payload: AddSetOrdersPayload) => void;
  defaultShowOrderSubmenu?: boolean;
}

export function GlobalMenuNavFeature({ onAddSetOrders, defaultShowOrderSubmenu = false }: GlobalMenuNavFeatureProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentView: ViewType =
    pathname === '/examination' ? 'testAppointment' :
    pathname.startsWith('/reception-list') ? 'receptionList' :
    pathname.includes('/diagnosis/patient-list') ? 'receptionList' :
    pathname.startsWith('/exam-result') ? 'results' :
    'chart';

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'testAppointment') {
      router.push('/examination');
    } else if (menuId === 'chart') {
      router.push(`/karte/${currentPatient.id}`);
    } else if (menuId === 'patient') {
      router.push('/reception-list');
    }
  };

  const {
    showOrderSubmenu,
    setShowOrderSubmenu,
    isCollapsed,
    setIsCollapsed,
    patientInfoOpen,
    setPatientInfoOpen,
    setDialogOpen,
    setSetDialogOpen,
    activeOrderType,
    setActiveOrderType,
    selectedSetOrderType,
    setSelectedSetOrderType,
    activeSetTab,
    setActiveSetTab,
  } = useGlobalMenuState(defaultShowOrderSubmenu);

  const { mySets, compositeSets, availableOrders, errorMessage, clearError, createMySet } =
    useOrderSets(selectedSetOrderType);

  const {
    addMySetDialogOpen,
    setAddMySetDialogOpen,
    newSetName,
    setNewSetName,
    selectedItems,
    setSelectedItems,
    handleSave,
    handleCancel,
  } = useAddMySetDialog({ createMySet });

  const handleItemToggle = (itemName: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemName]);
    } else {
      setSelectedItems(selectedItems.filter(item => item !== itemName));
    }
  };

  return (
    <div className={`bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[6.25rem]'}`}>
      <GlobalMenuNav
        currentView={currentView}
        activeOrderType={activeOrderType}
        onMenuClick={handleMenuClick}
        onOrderTypeChange={(type) => {
          setActiveOrderType(type as OrderTypeKey);
          if (type === 'imaging') {
            router.push('/orders/order-confirmed?openImaging=true');
          }
          if (type === 'lab') {
            router.push('/orders/order-confirmed?openSpecimen=true');
          }
        }}
        currentPatient={currentPatient}
        isCollapsed={isCollapsed}
        showOrderSubmenu={showOrderSubmenu}
        patientInfoOpen={patientInfoOpen}
        setDialogOpen={setDialogOpen}
        addMySetDialogOpen={addMySetDialogOpen}
        activeSetTab={activeSetTab}
        selectedSetOrderType={selectedSetOrderType}
        newSetName={newSetName}
        selectedItems={selectedItems}
        mySets={mySets}
        compositeSets={compositeSets}
        availableOrders={availableOrders}
        errorMessage={errorMessage}
        onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
        onShowOrderSubmenuToggle={() => setShowOrderSubmenu(!showOrderSubmenu)}
        onPatientInfoOpenChange={setPatientInfoOpen}
        onSetDialogOpenChange={setSetDialogOpen}
        onAddMySetDialogOpenChange={setAddMySetDialogOpen}
        onActiveSetTabChange={setActiveSetTab}
        onSelectedSetOrderTypeChange={setSelectedSetOrderType}
        onNewSetNameChange={setNewSetName}
        onItemToggle={handleItemToggle}
        onAddSetOrders={onAddSetOrders}
        onSaveMySet={handleSave}
        onCancelMySet={handleCancel}
        onClearError={clearError}
      />
    </div>
  );
}
