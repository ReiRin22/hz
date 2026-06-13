import { useState } from 'react';
import { X, Edit3, Check, Plus, Save, BookmarkPlus, Trash2, RefreshCw, CalendarDays, Settings2, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Badge } from '@/shared/components/atoms/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog';
import { Label } from '@/shared/components/atoms/label';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { RadioGroup, RadioGroupItem } from '@/shared/components/atoms/radio-group';
import { PrescriptionOrdersDisplay } from './RightPanelOrderDisplay';

interface OrderDetail {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent';
  route?: string;
  routeType?: string; // 内服、外用、注射など
  applicationSite?: string; // 点眼・点耳・点鼻の場合の部位（左・右・両）
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  asNeededCondition?: string;
  maxTimesPerDay?: string;
  priority?: string;
  specimenType?: string;
  collectionDate?: string;
  notes?: string;
  rpNumber?: number;
  rpComment?: string; // RPグループ単位のコメント
  quantity?: string;
  frequency?: string;
  timing?: string;
  scheduledDates?: string[]; // 注射オーダーのスケジュール日付
  // リフィル処方関連
  isRefillEligible?: boolean;
  refillCount?: number;
  // 単位情報
  units?: string[]; // 利用可能な単位のリスト
  selectedUnit?: string; // 選択された単位
  // 後発医薬品変更不可（個別）
  noGenericSubstitution?: boolean;
  // 処方区分
  prescriptionType?: '院外' | '院内' | '定期' | '臨時';
  // 調剤指示
  isOnePackage?: boolean;
  isCrushed?: boolean;
  isMixed?: boolean;
  // アレルギー情報
  hasAllergy?: boolean;
  hasDrugInteraction?: boolean;
  drugInteractionWith?: string;
  isDuplicate?: boolean;
  duplicateWith?: string;
  patientAttributeWarning?: string;
}

interface SavedOrderData {
  id: string;
  name: string;
  savedAt: string;
  orders: OrderDetail[];
  nextRpNumber: number;
}

interface RightPanelProps {
  confirmedOrders: OrderDetail[];
  onUpdateOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onConfirmAllOrders: () => void;
  activeOrderType: string;
  isLabDirectMode?: boolean; // 検体オーダーの直接入力モード
  savedOrderDataList: SavedOrderData[];
  onSaveTemporary: (saveName: string) => void;
  onLoadTemporary: (saveData: SavedOrderData) => void;
  onDeleteSavedData: (saveId: string) => void;
  onEditOrder: (order: OrderDetail) => void; // 編集ボタン押下時のコールバック
  patientType: 'outpatient' | 'inpatient'; // 患者種別（外来/入院）
  prescriptionType?: '院外' | '院内' | '定期' | '臨時'; // 処方区分（App.tsxから渡される）
  onPrescriptionTypeChange?: (type: '院外' | '院内' | '定期' | '臨時') => void; // 処方区分変更コールバック
  onReorderOrders?: (orders: OrderDetail[]) => void; // 並び替えコールバック
}

interface EditingState {
  [key: string]: {
    quantityValue?: string; // 数値部分
    quantityUnit?: string; // 単位部分
    frequency?: string;
    timing?: string;
  };
}

export function RightPanel({ 
  confirmedOrders, 
  onUpdateOrder, 
  onRemoveOrder, 
  onConfirmAllOrders,
  activeOrderType,
  isLabDirectMode = false,
  savedOrderDataList,
  onSaveTemporary,
  onLoadTemporary,
  onDeleteSavedData,
  onEditOrder,
  patientType,
  prescriptionType,
  onPrescriptionTypeChange,
  onReorderOrders
}: RightPanelProps) {
  const [editingOrders, setEditingOrders] = useState<EditingState>({});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  
  // 一括設定用のステート（開始日用と投与日数用で分離）
  const [batchStartDateDialogOpen, setBatchStartDateDialogOpen] = useState(false);
  const [batchPeriodDialogOpen, setBatchPeriodDialogOpen] = useState(false);
  const [batchStartDate, setBatchStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchPeriod, setBatchPeriod] = useState('7日分');
  
  // 処方コメント
  const [prescriptionComment, setPrescriptionComment] = useState('');
  
  // 後発医薬品の変更不可
  const [noGenericSubstitution, setNoGenericSubstitution] = useState(false);
  
  // グループキーを取得するヘルパー関数
  const getGroupKey = (order: OrderDetail) => 
    `${order.routeType || ''}-${order.frequency || ''}-${order.timing || ''}-${order.period || ''}-${order.startDate || ''}-${order.isAsNeeded ? 'asneeded' : 'regular'}-${order.isOnePackage ? 'onepackage' : ''}-${order.isCrushed ? 'crushed' : ''}-${order.isMixed ? 'mixed' : ''}-${order.isRefillEligible ? 'refill' : 'norefill'}-${order.refillCount || 0}`;
  
  // 薬剤の並び替え（同一グループ内のみ）
  const handleReorderDrug = (dragOrderId: string, dropOrderId: string) => {
    const dragIndex = confirmedOrders.findIndex(o => o.id === dragOrderId);
    const dropIndex = confirmedOrders.findIndex(o => o.id === dropOrderId);
    
    if (dragIndex === -1 || dropIndex === -1) return;
    
    // 同じグループかチェック
    if (getGroupKey(confirmedOrders[dragIndex]) !== getGroupKey(confirmedOrders[dropIndex])) {
      return; // 異なるグループ間の移動は不可
    }
    
    const newOrders = [...confirmedOrders];
    const [draggedItem] = newOrders.splice(dragIndex, 1);
    newOrders.splice(dropIndex, 0, draggedItem);
    
    if (onReorderOrders) {
      onReorderOrders(newOrders);
    }
  };
  
  // Rpグループの並び替え
  const handleReorderGroup = (dragGroupKey: string, dropGroupKey: string) => {
    if (dragGroupKey === dropGroupKey) return;
    
    // グループごとに薬剤を分類
    const groups: { [key: string]: OrderDetail[] } = {};
    confirmedOrders.forEach(order => {
      const key = getGroupKey(order);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(order);
    });
    
    // グループの順序を取得
    const groupKeys = Object.keys(groups);
    const dragIndex = groupKeys.indexOf(dragGroupKey);
    const dropIndex = groupKeys.indexOf(dropGroupKey);
    
    if (dragIndex === -1 || dropIndex === -1) return;
    
    // グループの順序を入れ替え
    const [draggedKey] = groupKeys.splice(dragIndex, 1);
    groupKeys.splice(dropIndex, 0, draggedKey);
    
    // 新しい順序で薬剤を並び替え
    const newOrders: OrderDetail[] = [];
    groupKeys.forEach(key => {
      newOrders.push(...groups[key]);
    });
    
    if (onReorderOrders) {
      onReorderOrders(newOrders);
    }
  };

  // オーダー種別ごとに分類し、種別順でソート
  const ordersByType = {
    prescription: confirmedOrders.filter(order => order.type === 'prescription'),
    injection: confirmedOrders.filter(order => order.type === 'injection'),
    lab: confirmedOrders.filter(order => order.type === 'lab')
  };

  // 処方オーダーを同一用法・日数・開始日でグループ化する関数
  const groupPrescriptionOrders = (orders: OrderDetail[]) => {
    const groups: { [key: string]: OrderDetail[] } = {};
    
    orders.forEach(order => {
      // グループ化のキー：用法(frequency + timing) + 日数(period) + 開始日(startDate)
      const key = `${order.frequency || ''}-${order.timing || ''}-${order.period || ''}-${order.startDate || ''}`;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(order);
    });
    
    // グループを配列に変換し、RP番号を振り直す
    let rpNumber = 1;
    const groupedOrders: Array<{ rpNumber: number; orders: OrderDetail[] }> = [];
    
    Object.values(groups).forEach(groupOrders => {
      groupedOrders.push({
        rpNumber: rpNumber++,
        orders: groupOrders
      });
    });
    
    return groupedOrders;
  };

  // オーダー種別の表示名
  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'prescription': return '処方オーダー';
      case 'injection': return '注射オーダー';
      case 'lab': return '検体オーダー';
      default: return 'その他';
    }
  };

  // オーダー種別の背景色
  const getOrderTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'injection': return 'bg-green-100 text-green-800';
      case 'lab': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (order: OrderDetail) => {
    setEditingOrders(prev => ({
      ...prev,
      [order.id]: {
        quantityValue: order.quantity?.split(' ')[0] || '',
        quantityUnit: order.quantity?.split(' ')[1] || '',
        frequency: order.frequency || '',
        timing: order.timing || ''
      }
    }));
  };

  const handleSave = (order: OrderDetail) => {
    const editingData = editingOrders[order.id];
    if (editingData) {
      const updatedOrder = {
        ...order,
        quantity: editingData.quantityValue && editingData.quantityUnit ? `${editingData.quantityValue} ${editingData.quantityUnit}` : '',
        frequency: editingData.frequency,
        timing: editingData.timing
      };
      onUpdateOrder(updatedOrder);
    }
    
    setEditingOrders(prev => {
      const newState = { ...prev };
      delete newState[order.id];
      return newState;
    });
  };

  const handleCancel = (orderId: string) => {
    setEditingOrders(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  const updateEditingValue = (orderId: string, field: keyof EditingState[string], value: string) => {
    setEditingOrders(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const formatOrderDisplay = (order: OrderDetail) => {
    if (order.type === 'prescription') {
      const parts = [order.quantity || ''];
      // 点眼・点耳・点鼻の場合は部位を追加
      if (order.applicationSite && ['点眼', '点耳', '点鼻'].some(r => order.route?.includes(r))) {
        parts.push(`(${order.applicationSite})`);
      }
      return parts.filter(p => p).join(' ').trim();
    } else if (order.type === 'injection') {
      return `${order.name} ${order.dosage || ''} ${order.quantity || ''} ${order.route || ''}`.trim();
    } else if (order.type === 'lab') {
      return order.name;
    }
    return order.name;
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800';
      case 'injection': return 'bg-green-100 text-green-800';
      case 'lab': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'prescription': return '処方';
      case 'injection': return '注射';
      case 'lab': return '検体';
      default: return '';
    }
  };

  const frequencyOptions = ['1日1回', '1日2回', '1日3回', '1日4回', '頓用'];
  const timingOptions = ['食後', '食前', '食間', '朝昼夕', '朝夕', '就寝前', '起床時', '随時'];

  const handleTemporarySave = () => {
    if (saveName.trim()) {
      onSaveTemporary(saveName.trim());
      setSaveName('');
      setSaveDialogOpen(false);
    }
  };
  
  // 処方オーダーの一括設定
  const handleBatchUpdateStartDate = () => {
    // 処方オーダーのみを対象に開始日を一括更新
    ordersByType.prescription.forEach(order => {
      const updatedOrder = {
        ...order,
        startDate: batchStartDate
      };
      onUpdateOrder(updatedOrder);
    });
    setBatchStartDateDialogOpen(false);
  };

  const handleBatchUpdatePeriod = () => {
    // 処方オーダーのみを対象に投与期間を一括更新
    ordersByType.prescription.forEach(order => {
      const updatedOrder = {
        ...order,
        period: batchPeriod
      };
      onUpdateOrder(updatedOrder);
    });
    setBatchPeriodDialogOpen(false);
  };

  // 検体オーダーの直接入力モードの場合は幅を調整
  const panelWidth = isLabDirectMode ? 'flex-1' : 'w-[500px]';

  return (
    <div className={`${panelWidth} bg-card flex flex-col h-full`}>
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2>選択済みオーダーリスト</h2>
            <div className="text-sm text-muted-foreground mt-1">
              全種別統合表示 ({confirmedOrders.length}件)
            </div>
          </div>
          <div className="flex gap-2">
            {/* 一時保存ボタン */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={confirmedOrders.length === 0}
                >
                  <Save className="w-4 h-4 mr-1" />
                  一時保存
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>オーダーの一時保存</DialogTitle>
                  <DialogDescription>
                    現在のオーダー内容を一時保存します。保存名を入力してください。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="save-name" className="text-right">
                      保存名
                    </Label>
                    <Input
                      id="save-name"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="例：午前の処方"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleTemporarySave} disabled={!saveName.trim()}>
                    保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* セット登録ボタン */}
            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLoadDialogOpen(true)}
                  disabled={savedOrderDataList.length === 0}
                >
                  <BookmarkPlus className="w-4 h-4 mr-1" />
                  セット登録
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>保存データの読み込み</DialogTitle>
                  <DialogDescription>
                    読み込むデータを選択してください。現在のオーダー内容は上書きされます。
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {savedOrderDataList.map((saveData) => (
                    <div
                      key={saveData.id}
                      className="p-3 border border-border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{saveData.name}</div>
                          <div className="text-sm text-muted-foreground">
                            保存日時: {saveData.savedAt}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            オーダー数: {saveData.orders.length}件
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => {
                              onLoadTemporary(saveData);
                              setLoadDialogOpen(false);
                            }}
                          >
                            読み込み
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteSavedData(saveData.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={onConfirmAllOrders}
              size="sm"
              disabled={confirmedOrders.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              確定へ進む
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {confirmedOrders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">オーダーがありません</div>
            <div className="text-sm">左パネルから薬剤・検査項目を選択してオーダーを追加</div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* オーダー種別ごとに分類して表示 */}
            {Object.entries(ordersByType).map(([orderType, orders]) => {
              if (orders.length === 0) return null;
              
              return (
                <div key={orderType} className="space-y-2">
                  {/* 処方オーダーの場合は2行成のヘッダーを表示 */}
                  {orderType === 'prescription' && orders.length > 0 ? (
                    <div className="pb-2 border-b border-border space-y-2">
                      {/* 1行：オーダー種別、処方区分、一括設定 */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getOrderTypeBadgeColor(orderType)}>
                            {getOrderTypeLabel(orderType)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {orders.length}件
                          </span>
                        </div>

                        <div className="h-5 w-px bg-border" />

                        {/* 処方区分 */}
                        <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded-md border border-border">
                          <Label className="text-xs font-medium text-muted-foreground whitespace-nowrap">処方区分</Label>
                          {patientType === 'outpatient' ? (
                            // 外来患者：院外/院内
                            <RadioGroup
                              value={prescriptionType === '院内' ? 'inHospital' : 'outHospital'}
                              onValueChange={(value: 'inHospital' | 'outHospital') => {
                                const prescriptionTypeValue: '院外' | '院内' = value === 'outHospital' ? '院外' : '院内';
                                
                                if (onPrescriptionTypeChange) {
                                  onPrescriptionTypeChange(prescriptionTypeValue);
                                }
                                
                                confirmedOrders.forEach(order => {
                                  if (order.type === 'prescription') {
                                    onUpdateOrder({
                                      ...order,
                                      prescriptionType: prescriptionTypeValue
                                    });
                                  }
                                });
                              }}
                              className="flex gap-2"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="outHospital" id="outHospital" className="h-3.5 w-3.5" />
                                <Label htmlFor="outHospital" className="text-xs cursor-pointer">
                                  院外
                                </Label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="inHospital" id="inHospital" className="h-3.5 w-3.5" />
                                <Label htmlFor="inHospital" className="text-xs cursor-pointer">
                                  院内
                                </Label>
                              </div>
                            </RadioGroup>
                          ) : (
                            // 入院患者：定期/臨時
                            <RadioGroup
                              value={prescriptionType === '臨時' ? 'temporary' : 'regular'}
                              onValueChange={(value: 'regular' | 'temporary') => {
                                const prescriptionTypeValue: '定期' | '臨時' = value === 'temporary' ? '臨時' : '定期';
                                
                                if (onPrescriptionTypeChange) {
                                  onPrescriptionTypeChange(prescriptionTypeValue);
                                }
                                
                                confirmedOrders.forEach(order => {
                                  if (order.type === 'prescription') {
                                    onUpdateOrder({
                                      ...order,
                                      prescriptionType: prescriptionTypeValue
                                    });
                                  }
                                });
                              }}
                              className="flex gap-2"
                            >
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="regular" id="regular" className="h-3.5 w-3.5" />
                                <Label htmlFor="regular" className="text-xs cursor-pointer">
                                  定期
                                </Label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <RadioGroupItem value="temporary" id="temporary" className="h-3.5 w-3.5" />
                                <Label htmlFor="temporary" className="text-xs cursor-pointer">
                                  臨時
                                </Label>
                              </div>
                            </RadioGroup>
                          )}
                        </div>

                        <div className="h-5 w-px bg-border" />

                        {/* 一括設定 */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">一括:</span>
                          {/* 開始日一括設定ダイアログ */}
                          <Dialog open={batchStartDateDialogOpen} onOpenChange={setBatchStartDateDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                <CalendarDays className="w-3 h-3 mr-1" />
                                開始日
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>服薬開始日の一括設定</DialogTitle>
                                <DialogDescription>
                                  全ての処方オーダーの服薬開始日を一括で設定します。
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="batch-start-date">服薬開始日</Label>
                                  <Input
                                    id="batch-start-date"
                                    type="date"
                                    value={batchStartDate}
                                    onChange={(e) => setBatchStartDate(e.target.value)}
                                  />
                                </div>
                                <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
                                  <div className="flex items-start gap-2">
                                    <CalendarDays className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                                    <div>
                                      <div className="font-medium text-blue-900 mb-1">対象オーダー</div>
                                      <div className="text-xs text-blue-700">
                                        現在の処方オーダー {orders.length}件すべての服薬開始日が<br />
                                        <span className="font-medium">{batchStartDate}</span> に変更されます。
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setBatchStartDateDialogOpen(false)}>
                                  キャンセル
                                </Button>
                                <Button onClick={handleBatchUpdateStartDate}>
                                  一括設定を適用
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* 投与日数一括設定ダイアログ */}
                          <Dialog open={batchPeriodDialogOpen} onOpenChange={setBatchPeriodDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                                <Settings2 className="w-3 h-3 mr-1" />
                                投与日数
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>投与日数の一括設定</DialogTitle>
                                <DialogDescription>
                                  全ての処方オーダーの投与日数を一括で設定します。
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="batch-period">投与日数</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id="batch-period"
                                      type="number"
                                      value={batchPeriod.replace('日分', '')}
                                      onChange={(e) => setBatchPeriod(e.target.value ? `${e.target.value}日分` : '7日分')}
                                      placeholder="7"
                                      min="1"
                                      max="999"
                                      className="flex-1"
                                    />
                                    <span className="text-sm text-muted-foreground whitespace-nowrap">日分</span>
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded border border-green-200">
                                  <div className="flex items-start gap-2">
                                    <Settings2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                                    <div>
                                      <div className="font-medium text-green-900 mb-1">対象オーダー</div>
                                      <div className="text-xs text-green-700">
                                        現在の処方オーダー {orders.length}件すべての投与期間が<br />
                                        <span className="font-medium">{batchPeriod}</span> に変更されます。
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setBatchPeriodDialogOpen(false)}>
                                  キャンセル
                                </Button>
                                <Button onClick={handleBatchUpdatePeriod}>
                                  一括設定を適用
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // 注射・検体オーダーの場合は従来の1行ヘッダー
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Badge variant="secondary" className={getOrderTypeBadgeColor(orderType)}>
                        {getOrderTypeLabel(orderType)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {orders.length}件
                      </span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {orderType === 'prescription' ? (
                      // 処方オーダーはグループ化して表示
                      <PrescriptionOrdersDisplay
                        orders={orders}
                        orderType={orderType}
                        editingOrders={editingOrders}
                        onEditOrder={onEditOrder}
                        onRemoveOrder={onRemoveOrder}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onUpdateOrder={onUpdateOrder}
                        updateEditingValue={updateEditingValue}
                        formatOrderDisplay={formatOrderDisplay}
                        frequencyOptions={frequencyOptions}
                        timingOptions={timingOptions}
                        onReorderDrug={handleReorderDrug}
                        onReorderGroup={handleReorderGroup}
                      />
                    ) : (
                      // 注射・検体オーダーは従来通り個別表示
                      orders.map((order) => {
                        const isEditing = editingOrders[order.id];
                        
                        return (
                          <div
                            key={order.id}
                            className="p-3 rounded border border-border bg-card"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {order.type === 'prescription' && (
                                  <span className="text-sm font-medium text-primary">
                                    RP.{order.rpNumber}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {!isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => onEditOrder(order)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => onRemoveOrder(order.id)}
                                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleSave(order)}
                                      className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleCancel(order.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className="text-sm font-medium">{order.name}</div>
                                {(order.type === 'prescription' || order.type === 'injection') && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      // 外部連携：薬剤情報参照
                                      console.log('薬剤情報参照:', order.name);
                                    }}
                                    className="h-6 px-2 gap-1 shrink-0"
                                  >
                                    <Info className="w-3 h-3" />
                                    <ExternalLink className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                              {order.notes && (
                                <div className="text-xs text-muted-foreground mt-1">{order.notes}</div>
                              )}
                              {order.scheduledDates && order.scheduledDates.length > 0 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  投与予定: {order.scheduledDates.join(', ')}
                                </div>
                              )}
                              {order.isRefillEligible && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    リフィル処方
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {order.refillCount}回 / {order.period}日間隔
                                  </span>
                                </div>
                              )}
                            </div>

                            {!isEditing ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="text-sm text-muted-foreground flex-1">
                                    {formatOrderDisplay(order)}
                                  </div>
                                  {order.type === 'prescription' && (order.startDate || order.period) && (
                                    <div className="flex items-center gap-2 text-xs bg-muted/50 px-2 py-1 rounded">
                                      {order.startDate && (
                                        <span className="font-medium">{order.startDate.replace(/-/g, '/')}</span>
                                      )}
                                      {order.period && (
                                        <span className="font-medium text-primary">{order.period}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                {/* 薬剤個別の後発医薬品変更不可表示 */}
                                {order.type === 'prescription' && order.noGenericSubstitution && (
                                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      後発品変更不可
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {order.type === 'prescription' && (
                                  <>
                                    <div className="grid grid-cols-4 gap-2">
                                      <div>
                                        <label className="text-xs text-muted-foreground">数量</label>
                                        <Input
                                          type="number"
                                          value={isEditing.quantityValue || ''}
                                          onChange={(e) => updateEditingValue(order.id, 'quantityValue', e.target.value)}
                                          placeholder="1"
                                          className="h-8 text-xs"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground">単位</label>
                                        {order.units && order.units.length > 1 ? (
                                          <Select
                                            value={isEditing.quantityUnit || (order.units && order.units.length > 0 ? order.units[0] : '')}
                                            onValueChange={(value) => updateEditingValue(order.id, 'quantityUnit', value)}
                                          >
                                            <SelectTrigger className="h-8 text-xs">
                                              <SelectValue placeholder="単位" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {order.units.map((unit) => (
                                                <SelectItem key={unit} value={unit}>
                                                  {unit}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        ) : (
                                          <Input
                                            value={isEditing.quantityUnit || order.selectedUnit || '錠'}
                                            disabled
                                            className="h-8 text-xs bg-muted"
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground">頻度</label>
                                        <Select
                                          value={isEditing.frequency || ''}
                                          onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="選択" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {frequencyOptions.map((option) => (
                                              <SelectItem key={option} value={option}>
                                                {option}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <label className="text-xs text-muted-foreground">タイムング</label>
                                        <Select
                                          value={isEditing.timing || ''}
                                          onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="選択" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {timingOptions.map((option) => (
                                              <SelectItem key={option} value={option}>
                                                {option}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    
                                    {/* 後発医薬品変更不可チェックボックス */}
                                    <div className="p-2 bg-muted/30 rounded border border-border">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`no-generic-${order.id}`}
                                          checked={order.noGenericSubstitution || false}
                                          onCheckedChange={(checked) => {
                                            onUpdateOrder({
                                              ...order,
                                              noGenericSubstitution: checked as boolean
                                            });
                                          }}
                                        />
                                        <Label
                                          htmlFor={`no-generic-${order.id}`}
                                          className="text-xs cursor-pointer"
                                        >
                                          後発医薬品への変更不可
                                        </Label>
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {order.type === 'lab' && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-xs text-muted-foreground">採取日</label>
                                      <Input
                                        type="date"
                                        value={isEditing.timing || ''}
                                        onChange={(e) => updateEditingValue(order.id, 'timing', e.target.value)}
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">緊急度</label>
                                      <Select
                                        value={isEditing.frequency || ''}
                                        onValueChange={(value) => updateEditingValue(order.id, 'frequency', value)}
                                      >
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="通常">通常</SelectItem>
                                          <SelectItem value="至急">至急</SelectItem>
                                          <SelectItem value="緊急">緊急</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}

                                {order.type === 'injection' && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="text-xs text-muted-foreground">用量</label>
                                      <Input
                                        type="number"
                                        value={isEditing.quantityValue || ''}
                                        onChange={(e) => updateEditingValue(order.id, 'quantityValue', e.target.value)}
                                        placeholder="1"
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">単位</label>
                                      {order.units && order.units.length > 1 ? (
                                        <Select
                                          value={isEditing.quantityUnit || (order.units && order.units.length > 0 ? order.units[0] : '')}
                                          onValueChange={(value) => updateEditingValue(order.id, 'quantityUnit', value)}
                                        >
                                          <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="単位" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {order.units.map((unit) => (
                                              <SelectItem key={unit} value={unit}>
                                                {unit}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <Input
                                          value={isEditing.quantityUnit || order.selectedUnit || 'A'}
                                          disabled
                                          className="h-8 text-xs bg-muted"
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <label className="text-xs text-muted-foreground">投与経路</label>
                                      <Select
                                        value={isEditing.timing || ''}
                                        onValueChange={(value) => updateEditingValue(order.id, 'timing', value)}
                                      >
                                        <SelectTrigger className="h-8 text-xs">
                                          <SelectValue placeholder="選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="静脈内投与">静脈内投与</SelectItem>
                                          <SelectItem value="筋肉内投与">筋肉内投与</SelectItem>
                                          <SelectItem value="皮下投与">皮下投与</SelectItem>
                                          <SelectItem value="点滴静注">点滴静注</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    
                    {/* 処方コメント（処方オーダーの最後に表示） */}
                    {orderType === 'prescription' && (
                      <div className="space-y-3">
                        <div className="p-3 rounded border border-border bg-muted/30">
                          <Label htmlFor="prescription-comment" className="text-xs font-medium mb-2 block">
                            処方コメント
                          </Label>
                          <Input
                            id="prescription-comment"
                            value={prescriptionComment}
                            onChange={(e) => setPrescriptionComment(e.target.value)}
                            placeholder="処方箋への特記事項を入力してください"
                            className="h-8 text-xs"
                          />
                        </div>
                        
                        <div className="p-3 rounded border border-border bg-muted/30">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="no-generic-substitution"
                              checked={noGenericSubstitution}
                              onCheckedChange={(checked) => setNoGenericSubstitution(checked as boolean)}
                            />
                            <Label
                              htmlFor="no-generic-substitution"
                              className="text-xs cursor-pointer"
                            >
                              後発医薬品への変更不可
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmedOrders.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground text-center">
            {confirmedOrders.length}件のオーダーが選択されています
          </div>
        </div>
      )}
    </div>
  );
}

export default RightPanel;