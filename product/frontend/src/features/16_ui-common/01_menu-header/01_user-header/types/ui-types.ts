// UI関連の型定義
export interface AlertItem {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired?: boolean;
  category?: 'SYSTEM' | 'MEDICAL' | 'SECURITY' | 'MAINTENANCE';
}

export interface NavigationTab {
  id: string;
  label: string;
  icon?: React.ComponentType;
  count?: number;
  isActive?: boolean;
}

export interface DialogState {
  isOpen: boolean;
  data?: any;
}

export interface ThemeConfig {
  darkMode: boolean;
  compactMode: boolean;
  colorScheme: 'blue' | 'green' | 'purple' | 'medical';
}

export interface UserPreferences {
  theme: ThemeConfig;
  autoSave: boolean;
  notifications: boolean;
  shortcuts: Record<string, string>;
  layout: {
    sidebarCollapsed: boolean;
    panelSizes: Record<string, number>;
  };
}

export interface SearchFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  recordTypes?: string[];
  doctorIds?: string[];
  tags?: string[];
  searchText?: string;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: number;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ActionMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType;
  action: () => void;
  disabled?: boolean;
  divider?: boolean;
}