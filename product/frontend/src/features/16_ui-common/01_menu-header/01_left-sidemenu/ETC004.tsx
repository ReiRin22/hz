"use client";
import { useState } from 'react';
import { GlobalMenu } from './components/GlobalMenu';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { SystemMenu } from './components/SystemMenu';
import { Toaster } from '@/shared/components/atoms/sonner';
import { toast } from 'sonner';

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
  allergies?: string[];
}

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  date?: string;
  source?: 'history' | 'set' | 'search' | 'frequent';
  type?: 'prescription' | 'injection' | 'lab';
  groupItems?: OrderItem[];
  groupId?: string;
  groupName?: string;
  groupType?: 'set' | 'history';
  itemCode?: string;
  subcategory?: string;
  subcategoryName?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;
  notes?: string;
  priority?: string;
  rpNumber?: number;
}

interface SavedOrderData {
  id: string;
  name: string;
  savedAt: string;
  orders: OrderItem[];
  nextRpNumber: number;
}

export default function ETC004Page() {
  const [activeTab, setActiveTab] = useState('prescription');
  const [candidates, setCandidates] = useState<OrderItem[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<OrderItem[]>([]);
  const [savedOrderDataList, setSavedOrderDataList] = useState<SavedOrderData[]>([]);
  const [nextRpNumber, setNextRpNumber] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [currentPatient] = useState<CurrentPatient>({
    id: 'p001',
    name: '山田太郎',
    age: 45,
    gender: 'male',
    patientNumber: '12345678',
    visitDate: new Date().toISOString().split('T')[0],
    allergies: ['ペニシリン系', 'アルコール']
  });

  const handleOrderTypeChange = (orderType: string) => {
    setActiveTab(orderType);
  };

  const handleGlobalMenuClick = (menuId: string) => {
    console.log(`Menu clicked: ${menuId}`);
  };

  const handleAddCandidate = (item: OrderItem) => {
    setCandidates(prev => [...prev, item]);
  };

  const handleAddMultipleCandidates = (items: OrderItem[]) => {
    setCandidates(prev => [...prev, ...items]);
  };

  const handleAddToDetail = (item: OrderItem) => {
    setConfirmedOrders(prev => [...prev, { ...item, id: `order-${Date.now()}-${Math.random()}` }]);
  };

  const handleAddMultipleToDetail = (items: OrderItem[]) => {
    const newOrders = items.map(item => ({
      ...item,
      id: `order-${Date.now()}-${Math.random()}`
    }));
    setConfirmedOrders(prev => [...prev, ...newOrders]);
  };

  const handleRemoveCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  // セットからのオーダー追加処理
  const handleAddSetOrders = (setData: { id: string; name: string; items: string[]; type: 'my-set' | 'composite-set' }) => {
    const groupId = `group-${Date.now()}`;
    const newOrders = setData.items.map((itemName, index) => ({
      id: `${groupId}-${index}`,
      name: itemName,
      groupId: groupId,
      groupName: setData.name,
      groupType: 'set' as const,
      type: 'lab' as 'prescription' | 'injection' | 'lab', // セットは検体検査として扱う
      source: 'set' as const,
    }));
    
    setConfirmedOrders(prev => [...prev, ...newOrders]);
    toast.success(`${setData.name}を追加しました`);
  };

  const handleAddToOrder = (item: OrderItem) => {
    // グループアイテムの場合
    if (item.groupItems && item.groupItems.length > 0) {
      const groupId = `group-${Date.now()}`;
      const newOrders = item.groupItems.map((groupItem, index) => ({
        ...groupItem,
        id: `${groupId}-${index}`,
        groupId: groupId,
        groupName: item.name,
        groupType: item.source === 'set' ? 'set' as const : 'history' as const,
        type: activeTab as 'prescription' | 'injection' | 'lab'
      }));
      
      // 処方オーダーの場合、Rp番号を割り当て
      if (activeTab === 'prescription') {
        const rpNum = nextRpNumber;
        newOrders.forEach(order => {
          order.rpNumber = rpNum;
        });
        setNextRpNumber(prev => prev + 1);
      }
      
      setConfirmedOrders(prev => [...prev, ...newOrders]);
    } else {
      // 単一アイテムの場合
      const newOrder = {
        ...item,
        id: `order-${Date.now()}-${Math.random()}`,
        type: activeTab as 'prescription' | 'injection' | 'lab'
      };
      
      // 処方オーダーの場合、Rp番号を割り当て
      if (activeTab === 'prescription') {
        newOrder.rpNumber = nextRpNumber;
        setNextRpNumber(prev => prev + 1);
      }
      
      setConfirmedOrders(prev => [...prev, newOrder]);
    }
    
    handleRemoveCandidate(item.id);
  };

  const handleUpdateOrder = (order: OrderItem) => {
    setConfirmedOrders(prev => prev.map(o => o.id === order.id ? order : o));
  };

  const handleRemoveOrder = (id: string) => {
    setConfirmedOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleRemoveGroup = (groupId: string) => {
    setConfirmedOrders(prev => prev.filter(o => o.groupId !== groupId));
  };

  const handleConfirmAllOrders = () => {
    if (confirmedOrders.length === 0) {
      toast.error('オーダーが選択されていません');
      return;
    }
    
    toast.success(`${confirmedOrders.length}件のオーダーを確定しました`);
    // オーダー確定後の処理（実際はAPIコール等）
    console.log('Confirmed orders:', confirmedOrders);
    
    // オーダーリストをクリア
    setConfirmedOrders([]);
    setCandidates([]);
    setNextRpNumber(1);
  };

  const handleSaveTemporary = (saveName: string) => {
    const newSave: SavedOrderData = {
      id: `save-${Date.now()}`,
      name: saveName,
      savedAt: new Date().toISOString(),
      orders: confirmedOrders,
      nextRpNumber: nextRpNumber
    };
    
    setSavedOrderDataList(prev => [...prev, newSave]);
    toast.success(`「${saveName}」として一時保存しました`);
  };

  const handleLoadTemporary = (saveData: SavedOrderData) => {
    setConfirmedOrders(saveData.orders);
    setNextRpNumber(saveData.nextRpNumber);
    toast.success(`「${saveData.name}」を読み込みました`);
  };

  const handleDeleteSavedData = (saveId: string) => {
    setSavedOrderDataList(prev => prev.filter(s => s.id !== saveId));
    toast.success('保存データを削除しました');
  };

  return (
    <div className="h-screen flex bg-background relative">
      {/* 患者コンテキストメニュー（100px） */}
      <GlobalMenu 
        activeOrderType={activeTab}
        onOrderTypeChange={handleOrderTypeChange}
        onMenuClick={handleGlobalMenuClick}
        currentView="order"
        currentPatient={currentPatient}
        onAddSetOrders={handleAddSetOrders}
      />
      
      {/* 左ペイン（300px） - 過去の診療履歴やオーダーセット */}
      <div className="w-[300px] border-r border-border">
        <LeftPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddCandidate={handleAddCandidate}
          onAddMultipleCandidates={handleAddMultipleCandidates}
          onAddToDetail={handleAddToDetail}
          onAddMultipleToDetail={handleAddMultipleToDetail}
          onAddSetOrders={handleAddSetOrders}
        />
      </div>
      
      {/* 中央ペイン（450px） - 候補一覧 */}
      <div className="w-[450px] border-r border-border">
        <CenterPanel
          candidates={candidates}
          onAddToDetail={handleAddToOrder}
          onAddMultipleToDetail={handleAddMultipleToDetail}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>
      
      {/* 右ペイン（500px） - 詳細入力と確定 */}
      <div className="w-[500px] border-r border-border flex-1">
        <RightPanel
          confirmedOrders={confirmedOrders}
          onUpdateOrder={handleUpdateOrder}
          onRemoveOrder={handleRemoveOrder}
          onConfirmAllOrders={handleConfirmAllOrders}
          activeOrderType={activeTab}
          isLabDirectMode={activeTab === 'lab'}
          savedOrderDataList={savedOrderDataList}
          onSaveTemporary={handleSaveTemporary}
          onLoadTemporary={handleLoadTemporary}
          onDeleteSavedData={handleDeleteSavedData}
          patientAllergies={currentPatient.allergies}
          onRemoveGroup={handleRemoveGroup}
          onAddSetOrders={handleAddSetOrders}
        />
      </div>
      
      {/* 右端システムメニュー（80px） */}
      <SystemMenu />
      
      {/* トースト通知 */}
      <Toaster />
    </div>
  );
}