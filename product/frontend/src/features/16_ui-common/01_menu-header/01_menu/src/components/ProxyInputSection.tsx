import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { AlertCircle, Clock, Save, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/atoms/alert-dialog";
import { proxyInputsData, temporarySaveData } from "../data/proxyInputData";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface ProxyInputSectionProps {
  theme: ThemeColor;
}

export function ProxyInputSection({ theme }: ProxyInputSectionProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [showTempSaveAlert, setShowTempSaveAlert] = useState(false);
  const [selectedTempSaveIds, setSelectedTempSaveIds] = useState<number[]>([]);

  const proxyInputs = proxyInputsData;
  const tempSaveItems = temporarySaveData;

  const overdueCount = proxyInputs.filter((item) => item.isOverdue).length;

  useEffect(() => {
    // 未承認データがあれば初期表示時にポップアップを表示
    if (proxyInputs.length > 0) {
      setShowAlert(true);
    }
  }, [proxyInputs.length]);

  const handleProxyAlertClose = () => {
    setShowAlert(false);
    // 代行入力ダイアログを閉じた後に一時保存ダイアログを表示
    if (tempSaveItems.length > 0) {
      setTimeout(() => {
        setShowTempSaveAlert(true);
      }, 300);
    }
  };

  const handleTempSaveToggle = (id: number) => {
    setSelectedTempSaveIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleLoadTempSave = () => {
    console.log("読み込む一時保存データ:", selectedTempSaveIds);
    setShowTempSaveAlert(false);
    setSelectedTempSaveIds([]);
  };

  return (
    <>
      <Card style={{ 
        backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined,
        borderColor: theme.value === 'black' ? '#333333' : undefined,
        color: theme.value === 'black' ? '#E5E7EB' : undefined
      }}>
        <CardHeader style={{ backgroundColor: theme.secondary }}>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: theme.primary }}>代行入力未承認</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={overdueCount > 0 ? "destructive" : "secondary"}>
                {(proxyInputs.length)-4}件
              </Badge>
              <Button size="sm" variant="outline" style={{
                color: theme.value === 'black' ? '#FFFFFF' : undefined,
                backgroundColor: theme.value === 'black' ? '#404040' : undefined,
                borderColor: theme.value === 'black' ? '#6B7280' : undefined
              }}>
                承認画面へ
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4" style={{
          backgroundColor: theme.value === 'black' ? '#1A1A1A' : undefined
        }}>
          {/* 個別の代行入力データ */}
          <div className="space-y-3">
            <div className="text-xs" style={{ 
              color: theme.value === 'black' ? '#9CA3AF' : undefined 
            }}>未承認データ一覧</div>
            {proxyInputs.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-md border ${
                item.isOverdue
                  ? "bg-red-50 border-red-200"
                  : theme.value === 'black' ? "" : "bg-white border-gray-200"
              }`}
              style={
                !item.isOverdue && theme.value === 'black'
                  ? { backgroundColor: '#262626', borderColor: '#404040' }
                  : undefined
              }
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.isOverdue && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm" style={{
                      color: item.isOverdue ? '#1F2937' : (theme.value === 'black' ? '#E5E7EB' : undefined)
                    }}>{item.patientName}</span>
                  </div>
                  <div className="text-xs" style={{ 
                    color: item.isOverdue ? '#1F2937' : (theme.value === 'black' ? '#9CA3AF' : undefined)
                  }}>
                    入力者：{item.inputBy}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ 
                  color: item.isOverdue ? '#1F2937' : (theme.value === 'black' ? '#9CA3AF' : undefined)
                }}>
                  <Clock className="h-3 w-3" />
                  {item.hoursAgo}時間前
                </div>
              </div>
            </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              未承認データがあります
            </AlertDialogTitle>
            <AlertDialogDescription>
              以下の代行入力が承認待ちです。確認をお願いします。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4 max-h-[400px] overflow-y-auto">
            {proxyInputs.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-md border ${
                  item.isOverdue
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {item.isOverdue && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">{item.patientName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      入力者：{item.inputBy}
                    </div>
                  </div>
                  <div className={`text-xs ${item.isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                    {item.hoursAgo}時間前
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleProxyAlertClose}>
              保留
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowAlert(false)}>
              承認画面へ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTempSaveAlert} onOpenChange={setShowTempSaveAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-blue-600" />
              一時保存データがあります
            </AlertDialogTitle>
            <AlertDialogDescription>
              以下のデータが一時保存されています。確認をお願いします。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 my-4 max-h-[400px] overflow-y-auto">
            {tempSaveItems.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-md border bg-blue-50 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => handleTempSaveToggle(item.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`temp-save-${item.id}`}
                      checked={selectedTempSaveIds.includes(item.id)}
                      onCheckedChange={() => {}}
                    />
                    <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">{item.patientName}</span>
                  </div>
                  <div className="text-xs text-blue-600">
                    {item.hoursAgo}時間前
                  </div>
                </div>
                <div className="ml-10 space-y-1">
                  <div className="text-xs text-muted-foreground">
                    入力：{item.savedBy}
                  </div>
                  <div className="text-xs text-blue-600">
                    {item.recordType} - {item.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowTempSaveAlert(false)}>
              保留
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLoadTempSave}>
              読み込む
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}