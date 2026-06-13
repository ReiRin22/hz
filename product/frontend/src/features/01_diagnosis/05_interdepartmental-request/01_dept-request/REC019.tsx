"use client";
import { useState } from 'react';
import { GlobalMenu } from './components/GlobalMenu';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { SystemMenu } from './components/SystemMenu';
import { PatientInfoPanel, PatientInfoCategory } from './components/PatientInfoPanel';
import { PatientDetailPanel } from './components/PatientDetailPanel';
import { AppointmentManagement } from './components/AppointmentManagement';
import { ExaminationScheduling } from './components/ExaminationScheduling';

import { InjectionOrderPanel } from './components/InjectionOrderPanel';
import { ChartPanel } from './components/ChartPanel';
import { ExternalInfoPanel } from './components/ExternalInfoPanel';
import { DepartmentConsultPanelNew as DepartmentConsultPanel } from './components/DepartmentConsultPanelNew';
import { Toaster } from '@/shared/components/atoms/sonner';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent';
  groupItems?: OrderItem[]; // グループの場合の子項目
}

interface OrderDetail extends OrderItem {
  route?: string;
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  priority?: string;
  specimenType?: string;
  collectionDate?: string;
  notes?: string;
  rpNumber?: number;
  quantity?: string;
  frequency?: string;
  timing?: string;
}

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface SavedOrderData {
  id: string;
  name: string;
  savedAt: string;
  orders: OrderDetail[];
  nextRpNumber: number;
}

export default function REC019Page() {
  const [currentView, setCurrentView] = useState<'order' | 'patient' | 'appointment' | 'examination' | 'chart' | 'external-info' | 'dept-consult'>('dept-consult');
  const [activeTab, setActiveTab] = useState('prescription');
  const [candidates, setCandidates] = useState<OrderItem[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<OrderDetail[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [nextRpNumber, setNextRpNumber] = useState(1);
  const [activePatientCategory, setActivePatientCategory] = useState<PatientInfoCategory>('basic');
  const [activeSubTab, setActiveSubTab] = useState('history'); // 左パネルのサブタブ状態を管理
  const [selectedDrug, setSelectedDrug] = useState<OrderItem | null>(null);
  const [savedOrderDataList, setSavedOrderDataList] = useState<SavedOrderData[]>([]);
  
  // 現在診察中の患者情報
  const [currentPatient, setCurrentPatient] = useState<CurrentPatient>({
    id: 'p001',
    name: '山田太郎',
    age: 45,
    gender: 'male',
    patientNumber: '12345678',
    visitDate: new Date().toISOString().split('T')[0]
  });

  const handleAddCandidate = (item: OrderItem & { source?: string }) => {
    const newItem = {
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: item.source
    };
    setCandidates(prev => [...prev, newItem]);
    toast.success(`${item.name} を候補に追加しました`);
  };

  const handleAddMultipleCandidates = (items: (OrderItem & { source?: string })[]) => {
    const newItems = items.map(item => ({
      ...item,
      id: `${item.id}-${Date.now()}-${Math.random()}`,
      type: activeTab as 'prescription' | 'injection' | 'lab',
      source: item.source
    }));
    setCandidates(prev => [...prev, ...newItems]);
    toast.success(`${items.length}件のオーダーを候補に追加しました`);
  };

  const handleAddToDetail = (item: OrderItem) => {
    // 処方オーダーで薬剤タブからの場合は中央ペインで詳細入力
    const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
    if (orderType === 'prescription' && (item.source === 'search' || item.source === 'category')) {
      setSelectedDrug(item);
      return;
    }

    // その他の場合は従来通り直接追加
    const detailOrder: OrderDetail = {
      ...item,
      id: `order-${Date.now()}-${Math.random()}`,
      startDate: new Date().toISOString().split('T')[0],
      type: orderType,
      // 処方オーダーのみRP番号を設定
      rpNumber: orderType === 'prescription' ? nextRpNumber : undefined,
      quantity: getDefaultQuantity(item),
      frequency: getDefaultFrequency(item),
      timing: getDefaultTiming(item)
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    // 処方オーダーのみRP番号をインクリメント
    if (orderType === 'prescription') {
      setNextRpNumber(prev => prev + 1);
    }
    toast.success(`${item.name} をオーダーリストに追加しました`);
  };

  const handleDrugDetailConfirm = (orderDetail: OrderDetail) => {
    const detailOrder: OrderDetail = {
      ...orderDetail,
      rpNumber: nextRpNumber
    };
    
    setConfirmedOrders(prev => [...prev, detailOrder]);
    setNextRpNumber(prev => prev + 1);
    toast.success(`${orderDetail.name} をオーダーリストに追加しました`);
  };

  const handleClearDrugSelection = () => {
    setSelectedDrug(null);
  };

  const handleAddMultipleToDetail = (items: OrderItem[]) => {
    if (items.length === 0) return;
    
    let prescriptionCount = 0;
    const detailOrders = items.map((item, index) => {
      const orderType = item.type || (activeTab as 'prescription' | 'injection' | 'lab');
      const detailOrder: OrderDetail = {
        ...item,
        id: `order-${Date.now()}-${Math.random()}-${index}`,
        startDate: new Date().toISOString().split('T')[0],
        type: orderType,
        // 処方オーダーのみRP番号を設定
        rpNumber: orderType === 'prescription' ? nextRpNumber + prescriptionCount : undefined,
        quantity: getDefaultQuantity(item),
        frequency: getDefaultFrequency(item),
        timing: getDefaultTiming(item)
      };
      
      if (orderType === 'prescription') {
        prescriptionCount++;
      }
      
      return detailOrder;
    });
    
    setConfirmedOrders(prev => [...prev, ...detailOrders]);
    // 処方オーダーの件数分だけRP番号をインクリメント
    setNextRpNumber(prev => prev + prescriptionCount);
    toast.success(`${items.length}件のオーダーをオーダーリストに追加しました`);
  };

  // デフォルト値を設定する関数
  const getDefaultQuantity = (item: OrderItem) => {
    if (item.type === 'prescription') return '1錠';
    if (item.type === 'injection') return '1A';
    return '1';
  };

  const getDefaultFrequency = (item: OrderItem) => {
    if (item.usage?.includes('1日3回')) return '1日3回';
    if (item.usage?.includes('1日2回')) return '1日2回';
    return '1日1回';
  };

  const getDefaultTiming = (item: OrderItem) => {
    if (item.usage?.includes('食後')) return '食後';
    if (item.usage?.includes('食前')) return '食前';
    if (item.type === 'prescription') return '朝昼夕';
    return '';
  };

  const handleUpdateOrder = (order: OrderDetail) => {
    setConfirmedOrders(prev => 
      prev.map(o => o.id === order.id ? {
        ...order,
        // 処方オーダーのみRP番号は変更させない（元の番号を保持）
        rpNumber: o.type === 'prescription' ? o.rpNumber : undefined
      } : o)
    );
  };

  const handleRemoveOrder = (id: string) => {
    const removedOrder = confirmedOrders.find(o => o.id === id);
    
    // オーダーを削除してRP番号を振り直し（処方オーダーのみ）
    setConfirmedOrders(prev => {
      const filtered = prev.filter(o => o.id !== id);
      let prescriptionIndex = 1;
      
      // 処方オーダーのみRP番号を1から連番で振り直し
      return filtered.map((order) => {
        if (order.type === 'prescription') {
          return {
            ...order,
            rpNumber: prescriptionIndex++
          };
        }
        return order;
      });
    });
    
    // nextRpNumberも更新（処方オーダーの残り件数 + 1）
    const remainingPrescriptions = confirmedOrders.filter(o => o.id !== id && o.type === 'prescription').length;
    setNextRpNumber(remainingPrescriptions + 1);
    
    if (removedOrder) {
      toast.success(`${removedOrder.name} をオーダーリストから削除しました`);
    }
  };

  const handleConfirmAllOrders = () => {
    if (confirmedOrders.length === 0) {
      toast.error('確定するオーダーがありません');
      return;
    }
    
    // 全オーダー確定処理のシミュレーション
    toast.success(`${confirmedOrders.length}件のオーダーを確定しました`);
    
    // オーダーリストをクリア
    setConfirmedOrders([]);
    setNextRpNumber(1);
    
    // 候補リストもクリア
    setCandidates([]);
  };

  const handleSaveTemporary = (saveName: string) => {
    if (confirmedOrders.length === 0) {
      toast.error('保存するオーダーがありません');
      return;
    }

    const newSaveData: SavedOrderData = {
      id: `save-${Date.now()}`,
      name: saveName,
      savedAt: new Date().toLocaleString('ja-JP'),
      orders: [...confirmedOrders],
      nextRpNumber: nextRpNumber
    };

    setSavedOrderDataList(prev => [...prev, newSaveData]);
    toast.success(`オーダーを「${saveName}」として一時保存しました`);
  };

  const handleLoadTemporary = (saveData: SavedOrderData) => {
    setConfirmedOrders(saveData.orders);
    setNextRpNumber(saveData.nextRpNumber);
    toast.success(`「${saveData.name}」を読み込みました`);
  };

  const handleDeleteSavedData = (saveId: string) => {
    const saveData = savedOrderDataList.find(s => s.id === saveId);
    setSavedOrderDataList(prev => prev.filter(s => s.id !== saveId));
    if (saveData) {
      toast.success(`「${saveData.name}」を削除しました`);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // タブ変更時にフィルタもリセット
    setActiveFilter('all');
    // 検体・処方オーダーの場合はサブタブを検索/検査項目にリセット
    if (tab === 'lab' || tab === 'prescription') {
      setActiveSubTab('search');
    } else {
      setActiveSubTab('history');
    }
  };

  const handleOrderTypeChange = (orderType: string) => {
    handleTabChange(orderType);
  };

  // LeftPanelのサブタブ変更を管理
  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  const handleGlobalMenuClick = (menuId: string) => {
    if (menuId === 'patient') {
      setCurrentView('patient');
    } else if (menuId === 'order') {
      setCurrentView('order');
    } else if (menuId === 'appointment') {
      setCurrentView('appointment');
    } else if (menuId === 'chart') {
      setCurrentView('chart');
    } else if (menuId === 'external-info') {
      setCurrentView('external-info');
    } else if (menuId === 'dept-consult') {
      setCurrentView('dept-consult');
    }
  };

  const handleSystemMenuClick = (menuId: string) => {
    if (menuId === 'examination') {
      setCurrentView('examination');
    }
    // 他のシステムメニューの処理もここに追加可能
  };

  return (
    <div className="h-screen flex bg-background">
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
              />
              
              {/* 中央ペイン：薬剤詳細入力または候補表示 */}
              <CenterPanel 
                selectedDrug={selectedDrug}
                onConfirmDrug={handleDrugDetailConfirm}
                onClearSelection={handleClearDrugSelection}
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
      ) : currentView === 'dept-consult' ? (
        <>
          {/* 他科依頼画面 */}
          <DepartmentConsultPanel 
            currentPatient={currentPatient}
            onNavigateToChart={() => setCurrentView('chart')}
          />
        </>
      ) : (
        <>
          {/* 予約管理画面 */}
          <AppointmentManagement currentPatient={currentPatient} />
        </>
      )}
      
      {/* システムメニュー */}
      <SystemMenu onMenuClick={handleSystemMenuClick} />
      
      {/* トースト通知 */}
      <Toaster />
    </div>
  );
}