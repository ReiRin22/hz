import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { Clock, FileText, Trash2, Eye } from "lucide-react";

interface TempSavedData {
  id: string;
  orderType: string;
  savedAt: string;
  content: string;
}

interface TempSavedDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  tempSavedData?: TempSavedData[];
  onLoad?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TempSavedDataDialog({
  isOpen,
  onClose,
  patientId,
  patientName,
  tempSavedData = [],
  onLoad,
  onDelete
}: TempSavedDataDialogProps) {
  // デモ用のサンプルデータ（実際のアプリケーションでは親コンポーネントから渡される）
  const sampleData: TempSavedData[] = tempSavedData.length > 0 ? tempSavedData : [
    {
      id: "temp-001",
      orderType: "処方オーダー",
      savedAt: "2025-12-01 14:30",
      content: "ロキソプロフェン錠60mg 3錠 分3 毎食後 7日分"
    },
    {
      id: "temp-002",
      orderType: "検査オーダー",
      savedAt: "2025-12-01 13:15",
      content: "血液検査（CBC, 生化学）"
    },
    {
      id: "temp-003",
      orderType: "診察記録",
      savedAt: "2025-12-01 11:45",
      content: "S: 頭痛が続いている\nO: バイタル安定..."
    }
  ];

  const handleLoad = (id: string) => {
    if (onLoad) {
      onLoad(id);
    }
    console.log(`一時保存データ読み込み: ${id}`);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
    console.log(`一時保存データ削除: ${id}`);
  };

  // オーダー種別のバッジカラーを取得
  const getOrderTypeBadgeColor = (orderType: string) => {
    if (orderType.includes("処方")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (orderType.includes("検査")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (orderType.includes("診察")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    if (orderType.includes("注射")) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-amber-500 rounded-full">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div>一時保存データ</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                患者ID: {patientId} / {patientName}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            一時保存されたデータを確認し、必要に応じて読み込みまたは削除できます。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {sampleData.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>一時保存データはありません</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sampleData.map((data) => (
                <div
                  key={data.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* ヘッダー部分 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge className={getOrderTypeBadgeColor(data.orderType)}>
                        {data.orderType}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{data.savedAt}</span>
                      </div>
                    </div>
                    
                    {/* アクションボタン */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoad(data.id)}
                        className="flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>読込</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(data.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* コンテンツプレビュー */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap line-clamp-3">
                      {data.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}