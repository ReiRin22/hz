import { useState } from "react";
import { Save, FileText } from "lucide-react";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Card } from "@shared/components/atoms/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { toast } from "sonner";

type TempDataItem = {
  id: string;
  patientName: string;
  hoursAgo: string;
  inputBy: string;
  category: string;
  detail: string;
};

const INITIAL_TEMP_DATA: TempDataItem[] = [
  { id: "temp-1", patientName: "吉田 目子", hoursAgo: "2時間前", inputBy: "看護師 佐藤", category: "外来カルテ", detail: "診察所見入力途中" },
  { id: "temp-2", patientName: "高木 大輔", hoursAgo: "4時間前", inputBy: "看護師 森本", category: "処方オーダー", detail: "薬剤選択途中" },
  { id: "temp-3", patientName: "吉田 春香", hoursAgo: "6時間前", inputBy: "看護師 高橋", category: "検査オーダー", detail: "血液検査選択中" },
];

type TempSaveDialogMoleculeProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  onCountChange: (count: number) => void;
};

export function TempSaveDialogMolecule({ isOpen, onOpenChange, count, onCountChange }: TempSaveDialogMoleculeProps) {
  const [tempDataList, setTempDataList] = useState<TempDataItem[]>(INITIAL_TEMP_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleLoad = () => {
    if (selectedIds.length === 0) {
      toast.error("読み込むデータを選択してください");
      return;
    }
    const updated = tempDataList.filter((item) => !selectedIds.includes(item.id));
    setTempDataList(updated);
    onCountChange(updated.length);
    setSelectedIds([]);
    toast.success(`${selectedIds.length}件のデータを読み込みました`);
    onOpenChange(false);
  };

  const handleCancel = () => {
    toast.success("一時保存データを保持しました");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-blue-600" />
            <span>一時保存データがあります</span>
            {count > 0 && <Badge className="bg-orange-500 text-white text-xs">{count}件</Badge>}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            以下のデータが一時保存されています。確認をお願いします。
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] mt-4">
          <div className="space-y-2">
            {tempDataList.length > 0 ? (
              tempDataList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                  onClick={() => handleToggle(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleToggle(item.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.patientName}</h4>
                      <span className="text-sm text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0">{item.hoursAgo}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">入力：{item.inputBy}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{item.category} - {item.detail}</p>
                  </div>
                </div>
              ))
            ) : (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <Save className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-lg mb-2">一時保存データはありません</h3>
                    <p className="text-sm text-muted-foreground">診療記録やオーダー入力中に保存すると、こちらに表示されます</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        {tempDataList.length > 0 && (
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} className="px-6">
              キャンセル
            </Button>
            <Button onClick={handleLoad} className="bg-black hover:bg-gray-800 text-white px-6">
              読み込む
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
