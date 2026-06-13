import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Label } from "@/shared/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { Textarea } from "@/shared/components/atoms/textarea";
import { Badge } from "@/shared/components/atoms/badge";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { RadioGroup, RadioGroupItem } from "@/shared/components/atoms/radio-group";
import { Switch } from "@/shared/components/atoms/switch";
import { Separator } from "@/shared/components/atoms/separator";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Alert, AlertDescription } from "@/shared/components/atoms/alert";
import { 
  X, 
  Plus, 
  Pill, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Calculator, 
  Search,
  Edit2,
  Trash2,
  Check,
  Info,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

// 処方オーダー関連の型定義
export interface PrescriptionOrder {
  id: string;
  medicationName: string;
  dosage: string;
  dosageUnit: string;
  frequency: string;
  route: string;
  duration: number;
  durationUnit: string;
  startDate: Date;
  isRegular: boolean; // true: 定期, false: 頓用
  stopPreviousPrescription: boolean;
  dosageAdjustmentReason?: string;
  instructions?: string;
  status: 'DRAFT' | 'CONFIRMED';
}

export interface DrugInteraction {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  interactingDrugs: string[];
}

export interface AllergyAlert {
  id: string;
  allergen: string;
  reaction: string;
  severity: 'SEVERE' | 'MODERATE' | 'MILD';
}

interface PrescriptionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orders: PrescriptionOrder[]) => void;
  patientId: string;
  patientName: string;
  existingMedications?: string[];
  allergies?: AllergyAlert[];
}

// モックデータ
const medicationDatabase = [
  "アセトアミノフェン錠500mg",
  "ロキソプロフェンNa錠60mg", 
  "オメプラゾールカプセル20mg",
  "アムロジピン錠5mg",
  "メトホルミン錠250mg",
  "フロセミド錠20mg",
  "プレドニゾロン錠5mg",
  "シロスタゾール錠100mg",
  "バルサルタン錠80mg",
  "アトルバスタチン錠10mg"
];

const frequencyOptions = [
  "1日1回（朝食後）",
  "1日2回（朝・夕食後）", 
  "1日3回（毎食後）",
  "1日4回（毎食後・就寝前）",
  "就寝前",
  "頓用（痛い時）",
  "頓用（発熱時）",
  "頓用（必要時）"
];

const routeOptions = [
  "内服",
  "外用",
  "点滴",
  "貼付",
  "坐薬",
  "吸入",
  "注射"
];

const dosageUnits = ["mg", "g", "錠", "カプセル", "包", "ml", "滴"];
const durationUnits = ["日", "週", "ヶ月", "継続"];

const dosageAdjustmentReasons = [
  "腎機能による調整",
  "肝機能による調整", 
  "体重による調整",
  "年齢による調整",
  "併用薬による調整",
  "副作用による調整"
];

export function PrescriptionOrderModal({
  isOpen,
  onClose,
  onConfirm,
  patientId,
  patientName,
  existingMedications = [],
  allergies = []
}: PrescriptionOrderModalProps) {
  const [orders, setOrders] = useState<PrescriptionOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Partial<PrescriptionOrder>>({
    medicationName: "",
    dosage: "",
    dosageUnit: "mg",
    frequency: "",
    route: "内服",
    duration: 7,
    durationUnit: "日",
    startDate: new Date(),
    isRegular: true,
    stopPreviousPrescription: false,
    instructions: "",
    status: 'DRAFT'
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMedications, setFilteredMedications] = useState<string[]>([]);
  const [showGenericOption, setShowGenericOption] = useState(false);
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // 薬剤検索のフィルタリング
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = medicationDatabase.filter(med => 
        med.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedications(filtered);
    } else {
      setFilteredMedications([]);
    }
  }, [searchQuery]);

  // 相互作用チェック（モック）
  useEffect(() => {
    if (currentOrder.medicationName) {
      // 実際の実装では、薬剤名と既存の処方薬をサーバーに送信して相互作用をチェック
      const mockInteractions: DrugInteraction[] = [];
      
      if (currentOrder.medicationName.includes("ロキソプロフェン") && 
          existingMedications.some(med => med.includes("バルサルタン"))) {
        mockInteractions.push({
          id: "interaction_1",
          severity: "MEDIUM",
          description: "NSAIDsとACE阻害薬の併用により腎機能の悪化リスクがあります",
          interactingDrugs: ["ロキソプロフェン", "バルサルタン"]
        });
      }
      
      setInteractions(mockInteractions);
    }
  }, [currentOrder.medicationName, existingMedications]);

  // アレルギーチェック
  const checkAllergy = (medicationName: string): AllergyAlert | null => {
    return allergies.find(allergy => 
      medicationName.toLowerCase().includes(allergy.allergen.toLowerCase())
    ) || null;
  };

  // オーダー追加
  const addOrder = () => {
    if (!currentOrder.medicationName || !currentOrder.dosage || !currentOrder.frequency) {
      toast.error("必須項目を入力してください");
      return;
    }

    const order: PrescriptionOrder = {
      id: editingOrderId || `order_${Date.now()}`,
      medicationName: currentOrder.medicationName,
      dosage: currentOrder.dosage,
      dosageUnit: currentOrder.dosageUnit || "mg",
      frequency: currentOrder.frequency,
      route: currentOrder.route || "内服",
      duration: currentOrder.duration || 7,
      durationUnit: currentOrder.durationUnit || "日",
      startDate: currentOrder.startDate || new Date(),
      isRegular: currentOrder.isRegular ?? true,
      stopPreviousPrescription: currentOrder.stopPreviousPrescription || false,
      dosageAdjustmentReason: currentOrder.dosageAdjustmentReason,
      instructions: currentOrder.instructions,
      status: 'DRAFT'
    };

    if (editingOrderId) {
      setOrders(prev => prev.map(o => o.id === editingOrderId ? order : o));
      setEditingOrderId(null);
      toast.success("オーダーを更新しました");
    } else {
      setOrders(prev => [...prev, order]);
      toast.success("オーダーを追加しました");
    }

    // フォームリセット
    setCurrentOrder({
      medicationName: "",
      dosage: "",
      dosageUnit: "mg",
      frequency: "",
      route: "内服",
      duration: 7,
      durationUnit: "日",
      startDate: new Date(),
      isRegular: true,
      stopPreviousPrescription: false,
      instructions: "",
      status: 'DRAFT'
    });
    setSearchQuery("");
  };

  // オーダー編集
  const editOrder = (order: PrescriptionOrder) => {
    setCurrentOrder(order);
    setEditingOrderId(order.id);
    setSearchQuery(order.medicationName);
  };

  // オーダー削除
  const removeOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
    toast.success("オーダーを削除しました");
  };

  // オーダー確定
  const confirmOrders = () => {
    if (orders.length === 0) {
      toast.error("少なくとも1つのオーダーが必要です");
      return;
    }

    const confirmedOrders = orders.map(order => ({ ...order, status: 'CONFIRMED' as const }));
    onConfirm(confirmedOrders);
    toast.success(`${orders.length}件の処方オーダーを確定しました`);
    
    // リセット処理はhandleCloseに統合
    handleClose();
  };

  const currentAllergy = currentOrder.medicationName ? checkAllergy(currentOrder.medicationName) : null;

  // モーダルクローズ時のリセット処理
  const handleClose = () => {
    // 状態をリセット
    setOrders([]);
    setCurrentOrder({
      medicationName: "",
      dosage: "",
      dosageUnit: "mg",
      frequency: "",
      route: "内服",
      duration: 7,
      durationUnit: "日",
      startDate: new Date(),
      isRegular: true,
      stopPreviousPrescription: false,
      instructions: "",
      status: 'DRAFT'
    });
    setSearchQuery("");
    setFilteredMedications([]);
    setEditingOrderId(null);
    setInteractions([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] h-[90vh] p-0 overflow-hidden">
        {/* ヘッダー */}
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b medical-bg-primary flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0">
              <div className="p-2 md:p-3 medical-primary rounded-xl text-white shadow-lg flex-shrink-0">
                <Pill className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-lg md:text-2xl font-semibold medical-text-primary truncate">処方オーダー追加</DialogTitle>
                <DialogDescription className="text-sm md:text-base text-muted-foreground mt-1 line-clamp-2 md:line-clamp-none">
                  患者: <span className="font-medium">{patientName}</span> ({patientId}) の処方オーダーを入力・管理します
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
              {orders.length > 0 && (
                <Badge className="medical-secondary text-white shadow-md text-xs md:text-sm px-2 md:px-3 py-1">
                  {orders.length}件
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-red-50 hover:text-red-600">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* 左側: 薬剤検索・入力エリア */}
          <div className="flex-1 p-3 md:p-6 overflow-y-auto min-w-0">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-6">
                {/* 薬剤検索 */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="w-5 h-5 medical-text-primary" />
                      <span>薬剤検索</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>薬剤名</Label>
                      <Input
                        placeholder="薬剤名を3文字以上入力してください"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="focus-ring"
                      />
                      {filteredMedications.length > 0 && (
                        <div className="border rounded-lg max-h-32 md:max-h-40 overflow-y-auto">
                          {filteredMedications.map((med, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors border-b last:border-b-0"
                              onClick={() => {
                                setCurrentOrder(prev => ({ ...prev, medicationName: med }));
                                setSearchQuery(med);
                                setFilteredMedications([]);
                              }}
                            >
                              {med}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="generic" 
                        checked={showGenericOption}
                        onCheckedChange={setShowGenericOption}
                      />
                      <Label htmlFor="generic" className="text-sm">ジェネリック選択</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* アレルギー・相互作用警告 */}
                {(currentAllergy || interactions.length > 0) && (
                  <div className="space-y-3">
                    {currentAllergy && (
                      <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          <strong>アレルギー警告:</strong> {currentAllergy.allergen}に対するアレルギー歴があります
                          （重症度: {currentAllergy.severity}）
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {interactions.map((interaction) => (
                      <Alert key={interaction.id} className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                        <Shield className="w-4 h-4 text-orange-600" />
                        <AlertDescription className="text-orange-800 dark:text-orange-200">
                          <strong>相互作用警告 ({interaction.severity}):</strong> {interaction.description}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* 投与情報入力 */}
                {currentOrder.medicationName && (
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 medical-text-secondary" />
                        <span>投与情報</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 用量 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>用量</Label>
                          <Input
                            placeholder="500"
                            value={currentOrder.dosage}
                            onChange={(e) => setCurrentOrder(prev => ({ ...prev, dosage: e.target.value }))}
                            className="focus-ring"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>単位</Label>
                          <Select
                            value={currentOrder.dosageUnit}
                            onValueChange={(value) => setCurrentOrder(prev => ({ ...prev, dosageUnit: value }))}
                          >
                            <SelectTrigger className="focus-ring">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dosageUnits.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 用法 */}
                      <div className="space-y-2">
                        <Label>用法</Label>
                        <Select
                          value={currentOrder.frequency}
                          onValueChange={(value) => setCurrentOrder(prev => ({ ...prev, frequency: value }))}
                        >
                          <SelectTrigger className="focus-ring">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map(freq => (
                              <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 投与経路 */}
                      <div className="space-y-2">
                        <Label>投与経路</Label>
                        <Select
                          value={currentOrder.route}
                          onValueChange={(value) => setCurrentOrder(prev => ({ ...prev, route: value }))}
                        >
                          <SelectTrigger className="focus-ring">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {routeOptions.map(route => (
                              <SelectItem key={route} value={route}>{route}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 投与期間 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>投与期間</Label>
                          <Input
                            type="number"
                            min="1"
                            value={currentOrder.duration}
                            onChange={(e) => setCurrentOrder(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                            className="focus-ring"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>単位</Label>
                          <Select
                            value={currentOrder.durationUnit}
                            onValueChange={(value) => setCurrentOrder(prev => ({ ...prev, durationUnit: value }))}
                          >
                            <SelectTrigger className="focus-ring">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {durationUnits.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 開始日 */}
                      <div className="space-y-2">
                        <Label>開始日</Label>
                        <Input
                          type="date"
                          value={currentOrder.startDate ? currentOrder.startDate.toISOString().split('T')[0] : ''}
                          onChange={(e) => setCurrentOrder(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                          className="focus-ring"
                        />
                      </div>

                      {/* 定期・頓用 */}
                      <div className="space-y-3">
                        <Label>投与タイプ</Label>
                        <RadioGroup
                          value={currentOrder.isRegular ? "regular" : "prn"}
                          onValueChange={(value) => setCurrentOrder(prev => ({ ...prev, isRegular: value === "regular" }))}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular" id="regular" />
                            <Label htmlFor="regular">定期</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prn" id="prn" />
                            <Label htmlFor="prn">頓用</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* 中止指示 */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="stop-previous"
                          checked={currentOrder.stopPreviousPrescription}
                          onCheckedChange={(checked) => 
                            setCurrentOrder(prev => ({ ...prev, stopPreviousPrescription: !!checked }))
                          }
                        />
                        <Label htmlFor="stop-previous" className="text-sm">以前の処方を中止する</Label>
                      </div>

                      {/* 用量調整理由 */}
                      <div className="space-y-2">
                        <Label>用量調整理由（任意）</Label>
                        <Select
                          value={currentOrder.dosageAdjustmentReason || ""}
                          onValueChange={(value) => setCurrentOrder(prev => ({ ...prev, dosageAdjustmentReason: value }))}
                        >
                          <SelectTrigger className="focus-ring">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            {dosageAdjustmentReasons.map(reason => (
                              <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* 指示・備考 */}
                      <div className="space-y-2">
                        <Label>指示・備考（任意）</Label>
                        <Textarea
                          placeholder="追加の指示や注意事項"
                          value={currentOrder.instructions}
                          onChange={(e) => setCurrentOrder(prev => ({ ...prev, instructions: e.target.value }))}
                          className="focus-ring min-h-[80px]"
                        />
                      </div>

                      {/* オーダ追加ボタン */}
                      <Button 
                        onClick={addOrder}
                        className="w-full medical-secondary hover:opacity-90 text-white shadow-md"
                        disabled={!currentOrder.medicationName || !currentOrder.dosage || !currentOrder.frequency}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {editingOrderId ? "オーダー更新" : "オーダー追加"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 右側: オーダー一覧 */}
          <div className="hidden lg:block w-80 xl:w-96 border-l bg-muted/30 p-4 overflow-y-auto">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between flex-shrink-0">
                <h3 className="font-semibold">オーダー一覧</h3>
                <Badge variant="outline">{orders.length}件</Badge>
              </div>

              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-3">
                  {orders.map((order) => (
                    <Card key={order.id} className="relative">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight pr-2 flex-1">{order.medicationName}</h4>
                            <div className="flex space-x-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editOrder(order)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeOrder(order.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>用量: {order.dosage}{order.dosageUnit}</div>
                            <div>用法: {order.frequency}</div>
                            <div>経路: {order.route}</div>
                            <div>期間: {order.duration}{order.durationUnit}</div>
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              <Badge 
                                variant={order.isRegular ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {order.isRegular ? "定期" : "頓用"}
                              </Badge>
                              {order.stopPreviousPrescription && (
                                <Badge variant="outline" className="text-xs text-red-600">
                                  中止指示
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {order.instructions && (
                            <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                              <div className="flex items-start space-x-1">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span className="leading-tight">{order.instructions}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {orders.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">まだオーダーが追加されていません</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* モバイル用オーダー一覧（下部に表示） */}
          {orders.length > 0 && (
            <div className="lg:hidden w-full border-t bg-muted/30">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">追加したオーダー</h3>
                  <Badge variant="outline">{orders.length}件</Badge>
                </div>
                
                <ScrollArea className="max-h-48">
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <Card key={order.id} className="relative">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2">
                              <h4 className="font-medium text-sm leading-tight">{order.medicationName}</h4>
                              <div className="text-xs text-muted-foreground mt-1">
                                {order.dosage}{order.dosageUnit} / {order.frequency}
                              </div>
                            </div>
                            <div className="flex space-x-1 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => editOrder(order)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeOrder(order.id)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-4 md:px-6 py-3 md:py-5 border-t medical-bg-accent flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="hidden md:flex md:flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-2 lg:space-y-0 text-sm lg:text-base text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>約30秒の時短効果</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>相互作用・アレルギーチェック済み</span>
              </div>
            </div>
            
            <div className="flex space-x-3 lg:space-x-4">
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="flex-1 lg:flex-none px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base"
              >
                キャンセル
              </Button>
              <Button 
                onClick={confirmOrders}
                disabled={orders.length === 0}
                className="flex-1 lg:flex-none medical-primary hover:opacity-90 text-white px-4 lg:px-8 py-2 lg:py-3 text-sm lg:text-base shadow-lg"
              >
                <Check className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                オーダー確定 ({orders.length}件)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}