import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Badge } from "@/shared/components/atoms/badge";
import { Separator } from "@/shared/components/atoms/separator";
import { Calendar, Clock, MapPin, Pill, RefreshCw, Users, FileText } from "lucide-react";
import { toast } from "sonner";

interface MedicationRecord {
  id: string;
  category: "内服" | "外用" | "注射" | "点眼";
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  amount?: string;
  prescribedBy: "own" | "other";
  patientType: "入院" | "外来";
  admissionDate?: string;
  hospitalName?: string;
  isAllergen?: boolean;
  isNarcotic?: boolean;
  isPsychotropic?: boolean;
  isPotentDrug?: boolean;
  notes?: string;
}

interface MedicationDetailProps {
  medication: MedicationRecord | null;
  allMedications: MedicationRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export function MedicationDetail({ medication, allMedications, isOpen, onClose }: MedicationDetailProps) {
  if (!medication) return null;

  // 薬剤区分の色分け
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "内服": return "bg-blue-100 border-blue-300 text-blue-800";
      case "外用": return "bg-green-100 border-green-300 text-green-800";
      case "点眼": return "bg-green-100 border-green-300 text-green-800"; // 点眼も外用と同じ色
      case "注射": return "bg-red-100 border-red-300 text-red-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };
  
  // 薬剤区分の表示名を取得（点眼→外用に変換）
  const getCategoryDisplayName = (category: string) => {
    return category === "点眼" ? "外用" : category;
  };

  // 1日の総投与量を計算
  const calculateDailyTotal = () => {
    if (!medication.amount || medication.amount === "●") {
      return "●";
    }
    
    const amount = parseFloat(medication.amount);
    if (isNaN(amount)) {
      return medication.amount; // 数値でない場合はそのまま表示（「適量」など）
    }
    
    let frequency = 1;
    if (medication.frequency.includes("2回")) {
      frequency = 2;
    } else if (medication.frequency.includes("3回")) {
      frequency = 3;
    }
    
    const total = amount * frequency;
    const totalValue = total % 1 === 0 ? total.toString() : total.toFixed(1);
    
    // 単位を追加（medication.amountの単位を使用）
    let unit = "";
    if (medication.amount.includes("錠")) {
      unit = "錠";
    } else if (medication.amount.includes("カプセル")) {
      unit = "カプセル";
    } else if (medication.amount.includes("包")) {
      unit = "包";
    } else if (medication.amount.includes("単位")) {
      unit = "単位";
    } else if (medication.amount.includes("mL") || medication.amount.includes("ml")) {
      unit = "mL";
    } else if (medication.amount.includes("g")) {
      unit = "g";
    } else if (medication.amount.includes("回")) {
      unit = "回";
    }
    
    return unit ? `${totalValue}${unit}` : totalValue;
  };

  // 処方期間を計算
  const calculateDuration = () => {
    const start = new Date(medication.startDate);
    const end = new Date(medication.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // 同時処方された薬剤を取得
  const getConcurrentMedications = () => {
    return allMedications.filter(med => 
      med.id !== medication.id && 
      med.startDate === medication.startDate
    );
  };

  // DOボタンのクリックハンドラー
  const handleReorder = () => {
    toast.success(`${medication.name} をカルテに再オーダーしました`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Pill className="h-5 w-5" />
            薬剤詳細情報
          </DialogTitle>
          <DialogDescription>
            選択された薬剤の処方内容、用法用量、処方期間などの詳細情報を表示します
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 薬剤基本情報 */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">{medication.name}</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge className={getCategoryColor(medication.category)}>
                {getCategoryDisplayName(medication.category)}
              </Badge>
              <Badge variant={medication.prescribedBy === "own" ? "default" : "secondary"}>
                {medication.prescribedBy === "own" ? "自院処方" : "他院処方"}
              </Badge>
              <Badge 
                variant="outline" 
                className={medication.patientType === "入院" ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-sky-100 border-sky-300 text-sky-800"}
              >
                {medication.patientType}
              </Badge>
              {medication.isAllergen && (
                <Badge 
                  variant="outline" 
                  className="bg-red-100 border-red-300 text-red-800 font-bold"
                >
                  アレルギー
                </Badge>
              )}
              {medication.isNarcotic && (
                <Badge 
                  variant="outline" 
                  className="bg-purple-100 border-purple-300 text-purple-800 font-bold"
                >
                  麻薬
                </Badge>
              )}
              {medication.isPsychotropic && (
                <Badge 
                  variant="outline" 
                  className="bg-pink-100 border-pink-300 text-pink-800 font-bold"
                >
                  向精神薬
                </Badge>
              )}
              {medication.isPotentDrug && (
                <Badge 
                  variant="outline" 
                  className="bg-yellow-100 border-yellow-300 text-yellow-800 font-bold"
                >
                  劇薬
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* 処方詳細 */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Pill className="h-4 w-4" />
                用法・用量
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">用法：</span>
                  <span>{medication.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">1回量：</span>
                  <span>{medication.dosage}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">1日総量：</span>
                  <span>{calculateDailyTotal()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                処方期間
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">開始日：</span>
                  <span>{formatDate(medication.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">終了日（予定）：</span>
                  <span>{formatDate(medication.endDate)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">処方日数：</span>
                  <span>{calculateDuration()}日分</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 処方元情報 */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              処方元
            </h4>
            <div className="text-sm">
              <span className="text-muted-foreground">処方医療機関：</span>
              <span className="ml-2">
                {medication.hospitalName || (medication.prescribedBy === "own" ? "当院" : "他院")}
              </span>
            </div>
            {medication.patientType === "入院" && medication.admissionDate && (
              <div className="text-sm mt-2">
                <span className="text-muted-foreground">入院日：</span>
                <span className="ml-2">
                  {formatDate(medication.admissionDate)}
                </span>
              </div>
            )}
          </div>

          {/* 備考欄 */}
          {medication.notes && (
            <>
              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  備考
                </h4>
                <div className="text-sm p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-900">{medication.notes}</p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* 同時処方薬 */}
          {getConcurrentMedications().length > 0 && (
            <>
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  同時処方薬（{formatDate(medication.startDate)}）
                </h4>
                <div className="space-y-2">
                  {getConcurrentMedications().map((concurrentMed) => (
                    <div key={concurrentMed.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Badge className={`text-xs ${getCategoryColor(concurrentMed.category)}`}>
                        {getCategoryDisplayName(concurrentMed.category)}
                      </Badge>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{concurrentMed.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {concurrentMed.frequency} · {concurrentMed.dosage}
                        </div>
                      </div>
                      <Badge variant={concurrentMed.prescribedBy === "own" ? "default" : "secondary"} className="text-xs">
                        {concurrentMed.prescribedBy === "own" ? "自院" : "他院"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* アクションボタン */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
            <Button 
              onClick={handleReorder}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Do
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}