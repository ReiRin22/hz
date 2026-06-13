import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { GlobalMenu } from './GlobalMenu';
import { SystemMenu } from './SystemMenu';
import { Toaster } from 'sonner';
import { sampleCurrentPatient, type CurrentPatient } from '../../src/data/sampleData';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('prescription');
  const [currentPatient] = useState<CurrentPatient>(sampleCurrentPatient);

  // パスから現在のビューを取得
  const getCurrentView = () => {
    const path = location.pathname.slice(1) || 'order';
    return path as any;
  };

  const handleOrderTypeChange = (orderType: string) => {
    setActiveTab(orderType);
    navigate('/order');
  };

  const handleGlobalMenuClick = (menuId: string) => {
    navigate(`/${menuId}`);
  };

  const handleSystemMenuClick = (menuId: string) => {
    navigate(`/${menuId}`);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* 患者コンテキストメニュー */}
      <GlobalMenu 
        activeOrderType={activeTab}
        onOrderTypeChange={handleOrderTypeChange}
        onMenuClick={handleGlobalMenuClick}
        currentView={getCurrentView()}
        currentPatient={currentPatient}
      />
      
      {/* メインコンテンツエリア */}
      <Outlet context={{ activeTab, setActiveTab, currentPatient }} />
      
      {/* システムメニュー */}
      <SystemMenu onMenuClick={handleSystemMenuClick} />
      
      {/* トースト通知 */}
      <Toaster />
    </div>
  );
}
