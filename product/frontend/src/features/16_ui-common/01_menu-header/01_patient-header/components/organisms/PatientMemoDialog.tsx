'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Textarea } from "@/shared/components/atoms/textarea";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { StickyNote, Calendar, User, Save, X } from "lucide-react";
import { useState } from "react";

interface MemoData {
  id: string;
  type: "doctor" | "other";
  content: string;
  updatedDate: string;
  category?: string;
  author?: string;
}

interface PatientMemoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  memos?: MemoData[];
  onSave?: (memoData: MemoData) => void;
}

export function PatientMemoDialog({
  isOpen,
  onClose,
  patientId,
  patientName,
  memos = [],
  onSave
}: PatientMemoDialogProps) {
  const [activeTab, setActiveTab] = useState<"doctor" | "other">("doctor");
  const [doctorMemo, setDoctorMemo] = useState("");
  const [otherMemo, setOtherMemo] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [updatedDate, setUpdatedDate] = useState(new Date().toISOString().split('T')[0]);

  // デモ用のサンプルデータ
  const sampleDoctorMemo = memos.find(m => m.type === "doctor")?.content || 
    "既往歴：高血圧、糖尿病\n\n注意事項：\n- 血圧の変動に注意\n- 定期的な血糖値チェック必須\n- 食事療法継続中\n\n前回診察時の所見：\nバイタル安定、自覚症状なし";
  
  const sampleOtherMemo = memos.find(m => m.type === "other")?.content || 
    "家族構成：配偶者と2人暮らし\n\n連絡先：携帯電話のみ（午前中連絡可）\n\n備考：\n- 毎週月曜日は透析のため来院不可\n- 車椅子使用";

  const handleSave = () => {
    const memoData: MemoData = {
      id: `memo-${Date.now()}`,
      type: activeTab,
      content: activeTab === "doctor" ? doctorMemo : otherMemo,
      updatedDate: new Date().toISOString(),
      category: category || undefined,
      author: author || undefined
    };

    if (onSave) {
      onSave(memoData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <StickyNote className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span>診療メモ</span>
                  <Badge variant="outline" className="medical-border-primary medical-text-primary">
                    ID: {patientId}
                  </Badge>
                </div>
                <div className="text-sm font-normal text-muted-foreground mt-1">
                  患者名: {patientName}
                </div>
              </div>
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            患者の重要事項や注意点を記録・管理します
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "doctor" | "other")} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="doctor" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>医師メモ（参照）</span>
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center space-x-2">
              <StickyNote className="w-4 h-4" />
              <span>その他メモ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctor" className="flex-1 flex flex-col space-y-4 overflow-auto">
            {/* 更新日表示 */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-md border border-blue-100 dark:border-blue-900">
              <Calendar className="w-4 h-4" />
              <span>更新日: {updatedDate}</span>
            </div>

            {/* メモ内容（参照専用） */}
            <div className="flex-1 min-h-[300px]">
              <Textarea
                value={sampleDoctorMemo}
                readOnly
                className="h-full resize-none bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                placeholder="医師メモはありません"
              />
            </div>

            {/* 情報表示 */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                ℹ️ このメモは参照専用です。編集は医師のみ可能です。
              </p>
            </div>
          </TabsContent>

          <TabsContent value="other" className="flex-1 flex flex-col space-y-4 overflow-auto">
            {/* 更新日表示 */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-md border border-blue-100 dark:border-blue-900">
              <Calendar className="w-4 h-4" />
              <span>更新日: {new Date().toLocaleDateString('ja-JP')}</span>
            </div>

            {/* メタ情報入力 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  画像
                </Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="画像ファイル名を入力"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-medium">
                  記載者
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="記載者名を入力"
                  className="h-9"
                />
              </div>
            </div>

            {/* メモ内容（編集可能） */}
            <div className="flex-1 min-h-[280px]">
              <Textarea
                value={otherMemo || sampleOtherMemo}
                onChange={(e) => setOtherMemo(e.target.value)}
                className="h-full resize-none"
                placeholder="その他のメモを入力してください..."
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* フッター */}
        <div className="pt-4 border-t mt-4">
          <div className="text-sm text-muted-foreground">
            {activeTab === "doctor" ? "※ 医師メモは参照のみ可能です" : "※ メモは患者情報として保存されます"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}