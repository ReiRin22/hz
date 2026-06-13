"use client";
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { GlobalMenu } from './components/GlobalMenu';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { SystemMenu } from './components/SystemMenu';
import { InjectionOrderPanel } from './components/InjectionOrderPanel';
import { PatientInfoPanel } from './components/PatientInfoPanel';
import { PatientDetailPanel } from './components/PatientDetailPanel';
import { ExaminationScheduling } from './components/ExaminationScheduling';
import { ChartPanel } from './components/ChartPanel';
import { ExternalInfoPanel } from './components/ExternalInfoPanel';
import { DepartmentConsultationPanel } from './components/DepartmentConsultationPanel';
import { DocumentManagementPanel } from './components/DocumentManagementPanel';
import { DocumentImportPanel } from './components/DocumentImportPanel';
import { LabResultsPanel } from './components/LabResultsPanel';
import { AppointmentManagement } from './components/AppointmentManagement';
import { PrescriptionDialog } from './components/PrescriptionDialog';
import { mockPatient, mockPatientAllergies } from './src/data/mockPatients';
import { mockCurrentMedications } from './src/data/mockMedications';
import { mockDrugMasterData } from './src/data/mockDrugs';
import type { CurrentPatient, AllergyInfo, CurrentMedication, HistoryRecord, OrderDetail, SavedOrderData } from './types';
import { DrugMaster } from './src/data/mockDrugs';
import { AllergyWarningDialog } from './components/AllergyWarningDialog';
import { PatientAttributeWarningDialog } from './components/PatientAttributeWarningDialog';
import { ContraindicationWarningDialog } from './components/ContraindicationWarningDialog';
import { DuplicationWarningDialog } from './components/DuplicationWarningDialog';
import { mockDoctors } from './data/mockDoctors';
import { checkAllergy, checkContraindication, checkDuplication, checkPatientAttribute } from './src/utils/safetyValidation';
import { useSavedOrders } from './src/hooks/useSavedOrders';
import { useViewManagement } from './src/hooks/useViewManagement';
import { useDoctorManagement } from './src/hooks/useDoctorManagement';
import { useWarningChain } from './src/hooks/useWarningChain';
import { useOrderOperations } from './src/hooks/useOrderOperations';
import { usePrescriptionDialog } from './src/hooks/usePrescriptionDialog';

export default function ORD001Page() {
  // 医師管理のカスタムフック
  const { currentDoctor, handleDoctorChange } = useDoctorManagement();
  
  // ビュー・タブ管理のカスタムフック
  const {
    currentView,
    showDocumentImport,
    activeTab,
    activeFilter,
    activePatientCategory,
    activeSubTab,
    setCurrentView,
    setShowDocumentImport,
    setActivePatientCategory,
    handleTabChange,
    handleOrderTypeChange,
    handleSubTabChange,
    handleGlobalMenuClick,
    handleSystemMenuClick
  } = useViewManagement();
  
  // 処方区分（外来：院内/院外、入院：定期/臨時）の状態管理
  const [prescriptionType, setPrescriptionType] = useState<'院外' | '院内' | '定期' | '臨時'>('院外');
  
  // 現在診察中の患者情報
  const [currentPatient, setCurrentPatient] = useState<CurrentPatient>(mockPatient);
  
  // 患者のアレルギー情報
  const [patientAllergies] = useState<AllergyInfo[]>(mockPatientAllergies);
  
  // 薬剤マスタデータ
  const [drugMasterData] = useState<DrugMaster[]>(mockDrugMasterData);
  
  // 患者の現在服用中薬剤
  const [currentMedications] = useState<CurrentMedication[]>(mockCurrentMedications);
  
  // オーダー管理の基本状態
  const [confirmedOrders, setConfirmedOrders] = useState<OrderDetail[]>([]);
  const [nextRpNumber, setNextRpNumber] = useState(1);
  const [selectedHistory, setSelectedHistory] = useState<HistoryRecord | null>(null);
  
  // 警告ダイアログの状態
  const [allergyWarning, setAllergyWarning] = useState<any>({
    show: false,
    drugName: '',
    allergies: [],
    onConfirm: () => {}
  });
  
  const [contraindicationWarning, setContraindicationWarning] = useState<any>({
    show: false,
    drugName: '',
    conflicts: [],
    onConfirm: () => {}
  });
  
  const [duplicationWarning, setDuplicationWarning] = useState<any>({
    show: false,
    drugName: '',
    duplicates: [],
    onConfirm: () => {}
  });
  
  const [patientAttributeWarning, setPatientAttributeWarning] = useState<any>({
    show: false,
    drugName: '',
    warnings: [],
    onConfirm: () => {}
  });
  
  // チェック関数のラッパー
  const checkAllergyLocal = (drugName: string) => checkAllergy(drugName, patientAllergies);
  const checkContraindicationLocal = (drugName: string) => checkContraindication(drugName, drugMasterData, currentMedications);
  const checkDuplicationLocal = (drugName: string, startDate?: string, period?: string) => checkDuplication(drugName, drugMasterData, confirmedOrders, currentMedications, startDate, period);
  const checkPatientAttributeLocal = (drugName: string) => checkPatientAttribute(drugName, drugMasterData, currentPatient);
  
  // 警告チェーンのカスタムフック
  const { showDuplicationWarningOnly, showWarningChainWithoutDuplication, showWarningChainForDrug, showWarningChainForOrders } = useWarningChain(
    {
      setAllergyWarning,
      setContraindicationWarning,
      setDuplicationWarning,
      setPatientAttributeWarning
    },
    {
      checkAllergy: checkAllergyLocal,
      checkContraindication: checkContraindicationLocal,
      checkDuplication: checkDuplicationLocal,
      checkPatientAttribute: checkPatientAttributeLocal
    }
  );
  
  // オーダー操作のカスタムフック
  const {
    candidates,
    setCandidates,
    selectedDrug,
    setSelectedDrug,
    editingOrder,
    handleAddCandidate,
    handleAddMultipleCandidates,
    handleAddToDetail,
    handleAddHistoryToConfirmed,
    handleAddMultipleHistoryToConfirmed,
    handleAddMultipleToDetail,
    handleDrugDetailConfirm,
    handleUpdateOrder,
    handleRemoveOrder,
    handleEditOrder,
    handleClearDrugSelection
  } = useOrderOperations({
    activeTab,
    prescriptionType,
    nextRpNumber,
    setNextRpNumber,
    confirmedOrders,
    setConfirmedOrders,
    checkAllergy: checkAllergyLocal,
    checkContraindication: checkContraindicationLocal,
    checkDuplication: checkDuplicationLocal,
    checkPatientAttribute: checkPatientAttributeLocal,
    showDuplicationWarningOnly,
    showWarningChainWithoutDuplication
  });
  
  // 処方箋ダイアログのカスタムフック
  const {
    prescriptionDialog,
    setPrescriptionDialog,
    handleConfirmAllOrders,
    confirmOrdersWithoutPrescription,
    closePrescriptionDialog
  } = usePrescriptionDialog({
    confirmedOrders,
    setConfirmedOrders,
    setNextRpNumber,
    setCandidates,
    currentDoctor,
    checkAllergy: checkAllergyLocal,
    showWarningChainForOrders
  });
  
  // 一時保存管理のカスタムフック
  const {
    savedOrderDataList,
    handleSaveTemporary: saveTemporary,
    handleLoadTemporary: loadTemporary,
    handleDeleteSavedData: deleteSavedData
  } = useSavedOrders();
  
  // 一時保存のラッパー関数
  const handleSaveTemporary = (saveName: string) => {
    saveTemporary(saveName, confirmedOrders, nextRpNumber);
  };
  
  const handleLoadTemporary = (saveData: SavedOrderData) => {
    const { orders, nextRpNumber: loadedNextRpNumber } = loadTemporary(saveData);
    setConfirmedOrders(orders);
    setNextRpNumber(loadedNextRpNumber);
  };
  
  const handleDeleteSavedData = (saveId: string) => {
    deleteSavedData(saveId);
  };
  
  // 並び替えハンドラ
  const handleReorderOrders = (newOrders: OrderDetail[]) => {
    setConfirmedOrders(newOrders);
  };
  
  // 履歴を選択して中央ペインに表示する関数
  const handleSelectHistory = (history: HistoryRecord) => {
    setSelectedHistory(history);
    setSelectedDrug(null);
  };

  // 履歴選択をクリアする関数
  const handleClearHistorySelection = () => {
    setSelectedHistory(null);
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        {/* メインコンテンツ */}
        <div className="flex-1 flex overflow-hidden">
          {/* 患者コンテキストメニュー */}
          <GlobalMenu 
            activeOrderType={activeTab}
            onOrderTypeChange={handleOrderTypeChange}
            onMenuClick={handleGlobalMenuClick}
            currentView={currentView}
            currentPatient={currentPatient}
          />
        
        {currentView === 'order' ? (
          <>
            {/* 注射オーダー専用画面 */}
            {activeTab === 'injection' ? (
              <>
                <InjectionOrderPanel 
                  onAddToUnifiedOrderList={(orders) => {
                    // 注射オーダーを統一オーダーリストに追加
                    const detailOrders: OrderDetail[] = orders.map(order => ({
                      ...order,
                      id: `injection-unified-${Date.now()}-${Math.random()}`,
                      type: 'injection' as const,
                    }));
                    
                    setConfirmedOrders(prev => [...prev, ...detailOrders]);
                    toast.success(`${orders.length}件の注射オーダーをオーダーリストに追加しました`);
                  }}
                />
                
                <RightPanel 
                  confirmedOrders={confirmedOrders}
                  onUpdateOrder={handleUpdateOrder}
                  onRemoveOrder={handleRemoveOrder}
                  onConfirmAllOrders={handleConfirmAllOrders}
                  activeOrderType={activeTab}
                  isLabDirectMode={false}
                  savedOrderDataList={savedOrderDataList}
                  onSaveTemporary={handleSaveTemporary}
                  onLoadTemporary={handleLoadTemporary}
                  onDeleteSavedData={handleDeleteSavedData}
                  onEditOrder={handleEditOrder}
                  patientType={currentPatient.patientType}
                  prescriptionType={prescriptionType}
                  onPrescriptionTypeChange={setPrescriptionType}
                  onReorderOrders={handleReorderOrders}
                />
              </>
            ) : (
              <>
                {/* 処方・検体オーダー入力画面 */}
                <LeftPanel 
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  onAddCandidate={handleAddCandidate}
                  onAddMultipleCandidates={handleAddMultipleCandidates}
                  onAddToDetail={handleAddToDetail}
                  onAddMultipleToDetail={handleAddMultipleToDetail}
                  activeSubTab={activeSubTab}
                  onSubTabChange={handleSubTabChange}
                  onAddHistoryToConfirmed={handleAddHistoryToConfirmed}
                  onAddMultipleHistoryToConfirmed={handleAddMultipleHistoryToConfirmed}
                  onSelectHistory={handleSelectHistory}
                  patientAllergies={patientAllergies}
                  currentDoctorId={currentDoctor?.id}
                />
                
                {/* 中央ペイン：薬剤詳細入力または候補表示 */}
                <CenterPanel 
                  selectedDrug={selectedDrug}
                  onConfirmDrug={handleDrugDetailConfirm}
                  onClearSelection={handleClearDrugSelection}
                  selectedHistory={selectedHistory}
                  onSelectHistory={handleSelectHistory}
                  onClearHistorySelection={handleClearHistorySelection}
                  onAddMultipleHistoryToConfirmed={handleAddMultipleHistoryToConfirmed}
                  prescriptionType={prescriptionType}
                />
                
                <RightPanel 
                  confirmedOrders={confirmedOrders}
                  onUpdateOrder={handleUpdateOrder}
                  onRemoveOrder={handleRemoveOrder}
                  onConfirmAllOrders={handleConfirmAllOrders}
                  activeOrderType={activeTab}
                  isLabDirectMode={(activeTab === 'lab' || activeTab === 'prescription') && activeSubTab !== 'history'}
                  savedOrderDataList={savedOrderDataList}
                  onSaveTemporary={handleSaveTemporary}
                  onLoadTemporary={handleLoadTemporary}
                  onDeleteSavedData={handleDeleteSavedData}
                  onEditOrder={handleEditOrder}
                  patientType={currentPatient.patientType}
                  prescriptionType={prescriptionType}
                  onPrescriptionTypeChange={setPrescriptionType}
                  onReorderOrders={handleReorderOrders}
                />
              </>
            )}
          </>
        ) : currentView === 'patient' ? (
          <>
            {/* 患者情報画面 */}
            <PatientInfoPanel 
              activeCategory={activePatientCategory}
              onCategoryChange={setActivePatientCategory}
              patientGender="male"
            />
            
            <PatientDetailPanel 
              activeCategory={activePatientCategory}
            />
          </>
        ) : currentView === 'examination' ? (
          <>
            {/* 検査予約画面 */}
            <ExaminationScheduling 
              onBack={() => setCurrentView('order')} 
              currentPatient={currentPatient}
            />
          </>
        ) : currentView === 'chart' ? (
          <>
            {/* カルテ画面 */}
            <ChartPanel currentPatient={currentPatient} />
          </>
        ) : currentView === 'external-info' ? (
          <>
            {/* 他院情報参照画面 */}
            <ExternalInfoPanel currentPatient={currentPatient} />
          </>
        ) : currentView === 'consultation' ? (
          <>
            {/* 他科依頼画面 */}
            <DepartmentConsultationPanel 
              onBack={() => setCurrentView('order')}
              patientName={currentPatient.name}
            />
          </>
        ) : currentView === 'document' ? (
          <>
            {/* 文書管理画面 or 文書取込画面 */}
            {showDocumentImport ? (
              <DocumentImportPanel 
                currentPatient={currentPatient} 
                onBack={() => setShowDocumentImport(false)}
                requirePatientSelection={false}
              />
            ) : (
              <DocumentManagementPanel 
                currentPatient={currentPatient}
                onImportClick={() => setShowDocumentImport(true)}
              />
            )}
          </>
        ) : currentView === 'standalone-document-import' ? (
          <>
            {/* スタンドアロン文書取込画面（患者選択が必要） */}
            <DocumentImportPanel 
              onBack={() => setCurrentView('order')}
              requirePatientSelection={true}
            />
          </>
        ) : currentView === 'results' ? (
          <>
            {/* 検査結果参照画面 */}
            <LabResultsPanel currentPatient={currentPatient} />
          </>
        ) : (
          <>
            {/* 予約管理画面 */}
            <AppointmentManagement currentPatient={currentPatient} />
          </>
        )}
        
        {/* システムメニュー */}
        <SystemMenu onMenuClick={handleSystemMenuClick} />
        
        {/* アレルギー警告ダイアログ */}
        <AllergyWarningDialog
          show={allergyWarning.show}
          drugName={allergyWarning.drugName}
          allergies={allergyWarning.allergies}
          onConfirm={allergyWarning.onConfirm}
          onCancel={() => setAllergyWarning({ show: false, drugName: '', allergies: [], onConfirm: () => {} })}
        />
        
        {/* 併用禁忌警告ダイアログ */}
        <ContraindicationWarningDialog
          show={contraindicationWarning.show}
          drugName={contraindicationWarning.drugName}
          conflicts={contraindicationWarning.conflicts}
          onConfirm={contraindicationWarning.onConfirm}
          onCancel={() => setContraindicationWarning({ show: false, drugName: '', conflicts: [], onConfirm: () => {} })}
        />
        
        {/* 重複投薬警告ダイアログ */}
        <DuplicationWarningDialog
          show={duplicationWarning.show}
          drugName={duplicationWarning.drugName}
          duplicates={duplicationWarning.duplicates}
          onConfirm={duplicationWarning.onConfirm}
          onCancel={() => setDuplicationWarning({ show: false, drugName: '', duplicates: [], onConfirm: () => {} })}
        />
        
        {/* 患者属性適合性警告ダイアログ */}
        <PatientAttributeWarningDialog
          show={patientAttributeWarning.show}
          drugName={patientAttributeWarning.drugName}
          warnings={patientAttributeWarning.warnings}
          currentPatient={currentPatient}
          onConfirm={patientAttributeWarning.onConfirm}
          onCancel={() => setPatientAttributeWarning({ show: false, drugName: '', warnings: [], onConfirm: () => {} })}
        />
        
        {/* 処方箋発行ダイアログ */}
        <PrescriptionDialog 
          open={prescriptionDialog.show}
          onClose={() => setPrescriptionDialog({ show: false, type: null })}
          orders={confirmedOrders}
          patient={currentPatient}
          initialType={prescriptionDialog.type || 'external'}
          onConfirm={() => {
            // オーダー確定処理
            confirmOrdersWithoutPrescription();
          }}
        />
        
        {/* トースト通知 */}
        <Toaster />
        </div>
      </div>
    </DndProvider>
  );
}