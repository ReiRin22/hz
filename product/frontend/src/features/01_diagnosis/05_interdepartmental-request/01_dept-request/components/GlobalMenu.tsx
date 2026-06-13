import { useState, useEffect } from 'react';
import { FileText, Calendar, User, ClipboardList, Stethoscope, ChevronRight, TestTube, Building2, Users } from 'lucide-react';

const getMenuItems = (currentView: string) => [
  { id: 'chart', label: 'カルテ', icon: Stethoscope, active: currentView === 'chart' },
  { 
    id: 'order', 
    label: 'オーダー', 
    icon: ClipboardList, 
    active: currentView === 'order',
    subItems: [
      { id: 'prescription', label: '処方オーダー' },
      { id: 'injection', label: '注射オーダー' },
      { id: 'lab', label: '検体オーダー' }
    ]
  },
  { id: 'results', label: '検査結果', icon: TestTube },
  { id: 'external-info', label: '他院情報', icon: Building2, active: currentView === 'external-info' },
  { id: 'dept-consult', label: '他科依頼', icon: Users, active: currentView === 'dept-consult' },
  { id: 'patient', label: '患者情報', icon: User, active: currentView === 'patient' },
  { id: 'document', label: '文書', icon: FileText },
  { id: 'appointment', label: '予約', icon: Calendar, active: currentView === 'appointment' },
];

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface GlobalMenuProps {
  activeOrderType?: string;
  onOrderTypeChange?: (type: string) => void;
  onMenuClick?: (menuId: string) => void;
  currentView?: 'order' | 'patient' | 'appointment' | 'chart' | 'external-info' | 'dept-consult';
  currentPatient?: CurrentPatient;
}

export function GlobalMenu({ 
  activeOrderType = 'prescription', 
  onOrderTypeChange,
  onMenuClick,
  currentView = 'order',
  currentPatient
}: GlobalMenuProps) {
  const [showOrderSubmenu, setShowOrderSubmenu] = useState(true);
  
  // カルテ表示時はオーダーメニューを展開状態にする
  useEffect(() => {
    if (currentView === 'chart') {
      setShowOrderSubmenu(true);
    }
  }, [currentView]);
  return (
    <div className="w-25 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* 患者情報表示 */}
      
      <nav className="flex-1 py-4">
        {getMenuItems(currentView).map((item) => {
          const Icon = item.icon;
          const hasSubmenu = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.id}>
              <div
                className={`
                  mx-2 mb-1 p-2 rounded-lg cursor-pointer transition-colors
                  group relative
                  ${item.active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }
                `}
                onClick={() => {
                  if (item.id === 'order') {
                    setShowOrderSubmenu(!showOrderSubmenu);
                    onMenuClick?.('order');
                  } else if (item.id === 'patient') {
                    onMenuClick?.('patient');
                  } else if (item.id === 'appointment') {
                    onMenuClick?.('appointment');
                  } else if (item.id === 'chart') {
                    onMenuClick?.('chart');
                  } else if (item.id === 'external-info') {
                    onMenuClick?.('external-info');
                  } else if (item.id === 'dept-consult') {
                    onMenuClick?.('dept-consult');
                  } else {
                    onMenuClick?.(item.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-6 h-6" />
                  {hasSubmenu && (
                    <ChevronRight 
                      className={`w-3 h-3 transition-transform ${showOrderSubmenu ? 'rotate-90' : ''}`} 
                    />
                  )}
                </div>
                <div className="text-xs mt-1 text-center leading-tight">
                  {item.label}
                </div>
              </div>
              
              {/* オーダーサブメニュー */}
              {item.id === 'order' && showOrderSubmenu && item.subItems && (currentView === 'order' || currentView === 'chart') && (
                <div className="mx-2 mb-2 bg-sidebar-accent rounded-lg overflow-hidden">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={`
                        px-3 py-2 text-xs cursor-pointer transition-colors
                        ${activeOrderType === subItem.id && currentView !== 'chart'
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        }
                      `}
                      onClick={() => onOrderTypeChange?.(subItem.id)}
                    >
                      {subItem.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}