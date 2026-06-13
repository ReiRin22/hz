import { Badge } from "@shared/components/atoms/badge";
import { Button } from "@shared/components/atoms/button";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Pause,
  MoreHorizontal
} from "lucide-react";

interface MatrixItem {
  id: string;
  date: string;
  category: string;
  type: string;
  title: string;
  status: "completed" | "pending" | "in-progress" | "overdue" | "cancelled";
  priority: "high" | "medium" | "low";
  author: string;
  timestamp: string;
  details?: any;
}

interface MatrixCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface MatrixCellProps {
  items: MatrixItem[];
  category: MatrixCategory;
  date: string;
  onItemSelect: (item: MatrixItem) => void;
  selectedItemId?: string;
}

export function MatrixCell({ items, category, date, onItemSelect, selectedItemId }: MatrixCellProps) {
  // ステータスアイコンを取得
  const getStatusIcon = (status: MatrixItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-medical-secondary" />;
      case "pending":
        return <Clock className="w-3 h-3 text-medical-warning" />;
      case "in-progress":
        return <Pause className="w-3 h-3 text-medical-primary" />;
      case "overdue":
        return <AlertCircle className="w-3 h-3 text-medical-danger" />;
      case "cancelled":
        return <XCircle className="w-3 h-3 text-gray-400" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  // ステータス色を取得
  const getStatusColor = (status: MatrixItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-medical-secondary-bg border-medical-secondary-border";
      case "pending":
        return "bg-medical-warning-bg border-medical-warning-border";
      case "in-progress":
        return "bg-medical-primary-bg border-medical-primary-border";
      case "overdue":
        return "bg-medical-danger-bg border-medical-danger-border";
      case "cancelled":
        return "bg-gray-100 border-gray-300";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // 優先度色を取得
  const getPriorityColor = (priority: MatrixItem["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-medical-danger text-white";
      case "medium":
        return "bg-medical-warning text-white";
      case "low":
        return "bg-medical-accent text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // アイテムがない場合
  if (items.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center text-gray-300">
        <div className="text-xs">---</div>
      </div>
    );
  }

  // 単一アイテム表示
  if (items.length === 1) {
    const item = items[0];
    const isSelected = selectedItemId === item.id;
    
    return (
      <Button
        variant="ghost"
        className={`w-full h-16 p-2 flex flex-col items-start justify-between border-l-2 ${getStatusColor(item.status)} ${
          isSelected ? 'ring-2 ring-medical-primary shadow-md' : 'hover:shadow-sm'
        }`}
        onClick={() => onItemSelect(item)}
      >
        <div className="w-full flex items-center justify-between">
          {getStatusIcon(item.status)}
          <Badge 
            className={`text-xs px-1 py-0 ${getPriorityColor(item.priority)}`}
            variant="secondary"
          >
            {item.priority === "high" ? "高" : item.priority === "medium" ? "中" : "低"}
          </Badge>
        </div>
        
        <div className="w-full text-left">
          <div className="text-xs font-medium leading-tight truncate">
            {item.title}
          </div>
          <div className="text-xs text-muted-foreground">
            {item.timestamp}
          </div>
        </div>
      </Button>
    );
  }

  // 複数アイテム表示
  const completedCount = items.filter(item => item.status === "completed").length;
  const pendingCount = items.filter(item => item.status === "pending" || item.status === "in-progress").length;
  const overdueCount = items.filter(item => item.status === "overdue").length;
  const highPriorityCount = items.filter(item => item.priority === "high").length;

  return (
    <Button
      variant="ghost"
      className="w-full h-16 p-2 flex flex-col items-start justify-between bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-sm"
      onClick={() => onItemSelect(items[0])} // 最初のアイテムを選択
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <MoreHorizontal className="w-3 h-3 text-gray-400" />
          <span className="text-xs font-medium">{items.length}件</span>
        </div>
        {highPriorityCount > 0 && (
          <Badge className="text-xs px-1 py-0 bg-medical-danger text-white" variant="secondary">
            緊急
          </Badge>
        )}
      </div>
      
      <div className="w-full space-y-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {completedCount > 0 && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-2 h-2 text-medical-secondary" />
                <span className="text-medical-secondary">{completedCount}</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="w-2 h-2 text-medical-warning" />
                <span className="text-medical-warning">{pendingCount}</span>
              </div>
            )}
            {overdueCount > 0 && (
              <div className="flex items-center space-x-1">
                <AlertCircle className="w-2 h-2 text-medical-danger" />
                <span className="text-medical-danger">{overdueCount}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground truncate">
          {items[0].title}
          {items.length > 1 && " 他"}
        </div>
      </div>
    </Button>
  );
}