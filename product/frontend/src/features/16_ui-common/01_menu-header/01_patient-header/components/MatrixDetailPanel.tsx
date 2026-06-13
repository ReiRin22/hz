import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Separator } from "@/shared/components/atoms/separator";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  AlertTriangle,
  CheckCircle,
  Pause,
  XCircle,
  Flag,
  FileText,
  Edit,
  MoreVertical,
  Copy,
  FileCheck,
  Clipboard,
  ArrowRight
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

interface MatrixDetailPanelProps {
  item: MatrixItem;
  onClose: () => void;
  onReuseRecord?: (item: MatrixItem) => void; // 記録再利用のコールバック
  onReuseOrder?: (item: MatrixItem) => void;  // オーダー再利用のコールバック
}

export function MatrixDetailPanel({ item, onClose, onReuseRecord, onReuseOrder }: MatrixDetailPanelProps) {
  // ステータス情報を取得
  const getStatusInfo = (status: MatrixItem["status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: "medical-secondary",
          bgColor: "medical-secondary-bg",
          label: "完了",
          description: "処理が完了しています"
        };
      case "pending":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "medical-warning",
          bgColor: "medical-warning-bg",
          label: "待機中",
          description: "処理待ちの状態です"
        };
      case "in-progress":
        return {
          icon: <Pause className="w-5 h-5" />,
          color: "medical-primary",
          bgColor: "medical-primary-bg",
          label: "進行中",
          description: "現在処理中です"
        };
      case "overdue":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: "medical-danger",
          bgColor: "medical-danger-bg",
          label: "遅延",
          description: "期限を過ぎています"
        };
      case "cancelled":
        return {
          icon: <XCircle className="w-5 h-5" />,
          color: "gray-500",
          bgColor: "gray-100",
          label: "中止",
          description: "処理が中止されました"
        };
      default:
        return {
          icon: <FileText className="w-5 h-5" />,
          color: "gray-500",
          bgColor: "gray-100",
          label: "不明",
          description: "状態が不明です"
        };
    }
  };

  // 優先度情報を取得
  const getPriorityInfo = (priority: MatrixItem["priority"]) => {
    switch (priority) {
      case "high":
        return { label: "高", color: "medical-danger", description: "緊急対応が必要" };
      case "medium":
        return { label: "中", color: "medical-warning", description: "通常の優先度" };
      case "low":
        return { label: "低", color: "medical-accent", description: "時間に余裕がある" };
      default:
        return { label: "不明", color: "gray-500", description: "優先度不明" };
    }
  };

  // カテゴリ情報を取得
  const getCategoryInfo = (category: string) => {
    const categoryMap: { [key: string]: { name: string; description: string } } = {
      "orders": { name: "オーダ", description: "検査・処置オーダ" },
      "documents": { name: "文書", description: "診断書・証明書等" },
      "prescriptions": { name: "処方", description: "薬剤処方" },
      "nursing": { name: "看護記録", description: "看護観察・ケア記録" },
      "tests": { name: "検査結果", description: "検体検査・生理検査" },
      "vitals": { name: "バイタル", description: "生体兆候測定" },
      "consultations": { name: "診察", description: "医師診察記録" }
    };
    return categoryMap[category] || { name: "その他", description: "その他の項目" };
  };

  // 再利用可能かどうかを判定
  const canReuseAsRecord = () => {
    return ["consultations", "nursing", "documents"].includes(item.category);
  };

  const canReuseAsOrder = () => {
    return ["orders", "prescriptions", "tests"].includes(item.category);
  };

  // 再利用ボタンのハンドラー
  const handleReuseAsRecord = () => {
    if (onReuseRecord && canReuseAsRecord()) {
      onReuseRecord(item);
    }
  };

  const handleReuseAsOrder = () => {
    if (onReuseOrder && canReuseAsOrder()) {
      onReuseOrder(item);
    }
  };

  const statusInfo = getStatusInfo(item.status);
  const priorityInfo = getPriorityInfo(item.priority);
  const categoryInfo = getCategoryInfo(item.category);

  // 日付フォーマット
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    return `${year}年${month}月${day}日 (${dayOfWeek})`;
  };

  return (
    <Card className="h-full flex flex-col border-medical-border-primary">
      {/* ヘッダー */}
      <CardHeader className={`${statusInfo.bgColor} border-b`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`p-2 rounded-lg bg-white/20`}>
              <div className={`text-${statusInfo.color}`}>
                {statusInfo.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight mb-1 truncate">
                {item.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {categoryInfo.name}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {statusInfo.label}
                </Badge>
                <Badge 
                  className={`text-xs text-white bg-${priorityInfo.color}`}
                  variant="secondary"
                >
                  優先度: {priorityInfo.label}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {/* コンテンツ */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {/* DO（再利用）ボタンセクション - 最上部に配置 */}
            {(canReuseAsRecord() || canReuseAsOrder()) && (
              <>
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center space-x-2">
                    <Copy className="w-4 h-4 medical-text-primary" />
                    <span>記録の再利用</span>
                  </h3>
                  
                  <div className="bg-gradient-to-r from-medical-primary-bg to-medical-secondary-bg p-4 rounded-lg border border-medical-primary-border">
                    <div className="text-sm text-muted-foreground mb-3">
                      この記録の内容を新しい診療記録またはオーダーとして再利用できます
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {canReuseAsRecord() && (
                        <Button
                          onClick={handleReuseAsRecord}
                          className="w-full medical-primary text-white hover:bg-medical-primary-dark"
                          size="sm"
                        >
                          <FileCheck className="w-4 h-4 mr-2" />
                          診療記録として再利用
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                      
                      {canReuseAsOrder() && (
                        <Button
                          onClick={handleReuseAsOrder}
                          className="w-full medical-secondary text-white hover:bg-medical-secondary-dark"
                          size="sm"
                        >
                          <Clipboard className="w-4 h-4 mr-2" />
                          オーダーとして再利用
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* 基本情報 */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <FileText className="w-4 h-4 medical-text-primary" />
                <span>基本情報</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">日付:</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">時間:</span>
                  <span>{item.timestamp}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">担当者:</span>
                  <span>{item.author}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* ステータス詳細 */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Flag className="w-4 h-4 medical-text-primary" />
                <span>ステータス詳細</span>
              </h3>
              
              <div className={`p-3 rounded-lg ${statusInfo.bgColor}`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`text-${statusInfo.color}`}>
                    {statusInfo.icon}
                  </div>
                  <div>
                    <div className="font-medium">{statusInfo.label}</div>
                    <div className="text-sm text-muted-foreground">{statusInfo.description}</div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium mb-1">優先度: {priorityInfo.label}</div>
                  <div className="text-muted-foreground">{priorityInfo.description}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 詳細内容 */}
            {item.details && (
              <>
                <div className="space-y-3">
                  <h3 className="font-medium flex items-center space-x-2">
                    <FileText className="w-4 h-4 medical-text-primary" />
                    <span>詳細内容</span>
                  </h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm space-y-2">
                      {item.details.content && (
                        <div>
                          <div className="font-medium mb-1">内容:</div>
                          <div className="text-muted-foreground whitespace-pre-wrap">
                            {item.details.content}
                          </div>
                        </div>
                      )}
                      
                      {item.details.soapRecord && (
                        <div>
                          <div className="font-medium mb-1">SOAP記録:</div>
                          <div className="text-muted-foreground whitespace-pre-wrap font-mono text-xs">
                            {item.details.soapRecord}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* 従来のアクションボタン */}
            <div className="space-y-3">
              <h3 className="font-medium flex items-center space-x-2">
                <Edit className="w-4 h-4 medical-text-primary" />
                <span>その他のアクション</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                {item.status === "pending" && (
                  <Button variant="default" size="sm" className="w-full">
                    処理開始
                  </Button>
                )}
                {item.status === "in-progress" && (
                  <Button variant="default" size="sm" className="w-full">
                    完了にする
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full">
                  編集
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  詳細を表示
                </Button>
                <Button variant="ghost" size="sm" className="w-full flex items-center space-x-2">
                  <MoreVertical className="w-4 h-4" />
                  <span>その他</span>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}