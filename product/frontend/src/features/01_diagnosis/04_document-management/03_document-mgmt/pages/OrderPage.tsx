import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LeftPanel } from '../../components/LeftPanel';
import { CenterPanel } from '../../components/CenterPanel';
import { RightPanel } from '../../components/RightPanel';
import { InjectionOrderPanel } from '../../components/InjectionOrderPanel';
import { useOrderManagement } from '../hooks/useOrderManagement';
import { useTemporarySave } from '../hooks/useTemporarySave';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPatient: CurrentPatient;
}

export function OrderPage() {
  const { activeTab, setActiveTab } = useOutletContext<OutletContext>();
  const [activeSubTab, setActiveSubTab] = useState('history');
  const [activeFilter, setActiveFilter] = useState('all');

  const orderManagement = useOrderManagement();
  const temporarySave = useTemporarySave();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setActiveFilter('all');
    if (tab === 'lab' || tab === 'prescription') {
      setActiveSubTab('search');
    } else {
      setActiveSubTab('history');
    }
  };

  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  return (
    <>
      {/* 注射オーダー専用画面 */}
      {activeTab === 'injection' ? (
        <>
          <InjectionOrderPanel 
            onAddToUnifiedOrderList={orderManagement.handleAddInjectionToUnifiedList}
          />
          
          <RightPanel 
            confirmedOrders={orderManagement.confirmedOrders}
            onUpdateOrder={orderManagement.handleUpdateOrder}
            onRemoveOrder={orderManagement.handleRemoveOrder}
            onConfirmAllOrders={orderManagement.handleConfirmAllOrders}
            activeOrderType={activeTab}
            isLabDirectMode={false}
            savedOrderDataList={temporarySave.savedOrderDataList}
            onSaveTemporary={(saveName) => 
              temporarySave.handleSaveTemporary(
                saveName, 
                orderManagement.confirmedOrders, 
                orderManagement.nextRpNumber
              )
            }
            onLoadTemporary={(saveData) => 
              temporarySave.handleLoadTemporary(
                saveData,
                orderManagement.setConfirmedOrders,
                orderManagement.setNextRpNumber
              )
            }
            onDeleteSavedData={temporarySave.handleDeleteSavedData}
          />
        </>
      ) : (
        <>
          {/* 処方・検体オーダー入力画面 */}
          <LeftPanel 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddCandidate={(item) => orderManagement.handleAddCandidate(item, activeTab)}
            onAddMultipleCandidates={(items) => orderManagement.handleAddMultipleCandidates(items, activeTab)}
            onAddToDetail={(item) => orderManagement.handleAddToDetail(item, activeTab)}
            onAddMultipleToDetail={(items) => orderManagement.handleAddMultipleToDetail(items, activeTab)}
            activeSubTab={activeSubTab}
            onSubTabChange={handleSubTabChange}
          />
          
          {/* 中央ペイン：薬剤詳細入力または候補表示 */}
          <CenterPanel 
            selectedDrug={orderManagement.selectedDrug}
            onConfirmDrug={orderManagement.handleDrugDetailConfirm}
            onClearSelection={orderManagement.handleClearDrugSelection}
          />
          
          <RightPanel 
            confirmedOrders={orderManagement.confirmedOrders}
            onUpdateOrder={orderManagement.handleUpdateOrder}
            onRemoveOrder={orderManagement.handleRemoveOrder}
            onConfirmAllOrders={orderManagement.handleConfirmAllOrders}
            activeOrderType={activeTab}
            isLabDirectMode={(activeTab === 'lab' || activeTab === 'prescription') && activeSubTab !== 'history'}
            savedOrderDataList={temporarySave.savedOrderDataList}
            onSaveTemporary={(saveName) => 
              temporarySave.handleSaveTemporary(
                saveName, 
                orderManagement.confirmedOrders, 
                orderManagement.nextRpNumber
              )
            }
            onLoadTemporary={(saveData) => 
              temporarySave.handleLoadTemporary(
                saveData,
                orderManagement.setConfirmedOrders,
                orderManagement.setNextRpNumber
              )
            }
            onDeleteSavedData={temporarySave.handleDeleteSavedData}
          />
        </>
      )}
    </>
  );
}