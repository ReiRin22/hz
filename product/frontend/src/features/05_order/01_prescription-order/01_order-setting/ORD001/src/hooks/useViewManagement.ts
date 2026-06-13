import { useState } from 'react';
import type { PatientInfoCategory } from '../components/PatientInfoPanel';

type ViewType = 'order' | 'patient' | 'appointment' | 'examination' | 'chart' | 'external-info' | 'consultation' | 'document' | 'document-import' | 'standalone-document-import' | 'results';

export function useViewManagement() {
  const [currentView, setCurrentView] = useState<ViewType>('order');
  const [showDocumentImport, setShowDocumentImport] = useState(false);
  const [activeTab, setActiveTab] = useState('prescription');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePatientCategory, setActivePatientCategory] = useState<PatientInfoCategory>('basic');
  const [activeSubTab, setActiveSubTab] = useState('history');

  /**
   * タブ変更ハンドラー
   */
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

  /**
   * オーダータイプ変更ハンドラー
   */
  const handleOrderTypeChange = (orderType: string) => {
    handleTabChange(orderType);
  };

  /**
   * サブタブ変更ハンドラー
   */
  const handleSubTabChange = (subTab: string) => {
    setActiveSubTab(subTab);
  };

  /**
   * グローバルメニュークリックハンドラー
   */
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
    } else if (menuId === 'consultation') {
      setCurrentView('consultation');
    } else if (menuId === 'document') {
      setCurrentView('document');
      setShowDocumentImport(false);
    } else if (menuId === 'results') {
      setCurrentView('results');
    }
  };

  /**
   * システムメニュークリックハンドラー
   */
  const handleSystemMenuClick = (menuId: string) => {
    if (menuId === 'examination') {
      setCurrentView('examination');
    } else if (menuId === 'document-import') {
      setCurrentView('standalone-document-import');
    }
  };

  return {
    // 状態
    currentView,
    showDocumentImport,
    activeTab,
    activeFilter,
    activePatientCategory,
    activeSubTab,
    // Setter（外部から直接使う場合のため）
    setCurrentView,
    setShowDocumentImport,
    setActiveTab,
    setActiveFilter,
    setActivePatientCategory,
    setActiveSubTab,
    // ハンドラー
    handleTabChange,
    handleOrderTypeChange,
    handleSubTabChange,
    handleGlobalMenuClick,
    handleSystemMenuClick
  };
}
