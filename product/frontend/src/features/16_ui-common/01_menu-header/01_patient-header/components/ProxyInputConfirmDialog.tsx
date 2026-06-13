import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Label } from "@/shared/components/atoms/label";
import { Input } from "@/shared/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { AlertTriangle, User } from "lucide-react";
import { toast } from "sonner";

interface ProxyInputConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  primaryDoctorName: string;
}

export function ProxyInputConfirmDialog({
  open,
  onOpenChange,
  patientName,
  primaryDoctorName,
}: ProxyInputConfirmDialogProps) {
  const [proxyDoctorName, setProxyDoctorName] = useState("");
  const [proxyDoctorId, setProxyDoctorId] = useState("");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!proxyDoctorName || !proxyDoctorId || !reason) {
      toast.error("すべての項目を入力してください");
      return;
    }

    // 代行入力開始処理
    toast.success(`代行入力を開始しました\n代行者: ${proxyDoctorName}\n理由: ${reason}`);
    
    // リセット
    setProxyDoctorName("");
    setProxyDoctorId("");
    setReason("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    // リセット
    setProxyDoctorName("");
    setProxyDoctorId("");
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            代行入力確認
          </DialogTitle>
          <DialogDescription>
            他の医師の代わりに診療記録を入力します。代行入力者の情報を入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 患者情報 */}
          <div className="rounded-lg border bg-slate-50 p-3">
            <div className="text-sm text-slate-600">患者</div>
            <div className="font-semibold">{patientName}</div>
          </div>

          {/* 主治医情報 */}
          <div className="rounded-lg border bg-blue-50 p-3">
            <div className="text-sm text-blue-600">主治医（記録責任者）</div>
            <div className="font-semibold text-blue-900">{primaryDoctorName}</div>
          </div>

          {/* 代行入力者情報 */}
          <div className="space-y-3 rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
              <User className="h-4 w-4" />
              代行入力者情報
            </div>

            <div className="space-y-2">
              <Label htmlFor="proxyDoctorName">代行入力者氏名 *</Label>
              <Input
                id="proxyDoctorName"
                placeholder="例: 佐藤 花子"
                value={proxyDoctorName}
                onChange={(e) => setProxyDoctorName(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proxyDoctorId">医師ID *</Label>
              <Input
                id="proxyDoctorId"
                placeholder="例: D12345"
                value={proxyDoctorId}
                onChange={(e) => setProxyDoctorId(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">代行理由 *</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason" className="bg-white">
                  <SelectValue placeholder="理由を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency">緊急対応のため</SelectItem>
                  <SelectItem value="absence">主治医不在のため</SelectItem>
                  <SelectItem value="request">主治医の依頼による</SelectItem>
                  <SelectItem value="handover">引継ぎのため</SelectItem>
                  <SelectItem value="other">その他</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <div className="font-semibold">⚠️ 注意事項</div>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>代行入力はすべて記録され、監査対象となります</li>
              <li>入力内容は主治医が最終確認する必要があります</li>
              <li>緊急時以外は主治医の許可を得てください</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button onClick={handleConfirm} className="bg-orange-600 hover:bg-orange-700">
            代行入力を開始
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
