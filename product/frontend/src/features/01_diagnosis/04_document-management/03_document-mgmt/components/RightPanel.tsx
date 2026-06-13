import { useState } from 'react';
import { X, Edit3, Check, Plus, Save, FolderOpen, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Badge } from '@/shared/components/atoms/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog';
import { Label } from '@/shared/components/atoms/label';

interface OrderDetail {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent';
  route?: string;
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  priority?: string;
  specimenType?: string;
  collectionDate?: string;
  notes?: string;
  rpNumber?: number;
  quantity?: string;
  frequency?: string;
  timing?: string;
  scheduledDates?: string[]; // 注射オーダーのスケジュール日付
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
}

interface EditingState {
  [key: string]: {
    quantity?: string;
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
  onDeleteSavedData
}: RightPanelProps) {
  const [editingOrders, setEditingOrders] = useState<EditingState>({});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  // オーダー種別ごとに分類し、種別順でソート
  const ordersByType = {
    prescription: confirmedOrders.filter(order => order.type === 'prescription'),
    injection: confirmedOrders.filter(order => order.type === 'injection'),
    lab: confirmedOrders.filter(order => order.type === 'lab')
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
        quantity: order.quantity || '',
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
        quantity: editingData.quantity,
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
      return `${order.name} ${order.dosage || ''} ${order.quantity || ''} ${order.frequency || ''} ${order.timing || ''}`.trim();
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
  const timingOptions = ['朝', '昼', '夕', '朝昼', '朝夕', '昼夕', '朝昼夕', '食前', '食後', '食間', '就寝前'];

  const handleTemporarySave = () => {
    if (saveName.trim()) {
      onSaveTemporary(saveName.trim());
      setSaveName('');
      setSaveDialogOpen(false);
    }
  };

  // 検体オーダーの直接入力モードの場合は幅を調整
  const panelWidth = isLabDirectMode ? 'flex-1' : 'w-[500px]';

  return (
    <div className={`${panelWidth} bg-card flex flex-col`}>
      <div className="p-4 border-b border-border">
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

            {/* 読み込みボタン */}
            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={savedOrderDataList.length === 0}
                >
                  <FolderOpen className="w-4 h-4 mr-1" />
                  読み込み
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
              オーダー確定
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
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <Badge variant="secondary" className={getOrderTypeBadgeColor(orderType)}>
                      {getOrderTypeLabel(orderType)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {orders.length}件
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {orders.map((order) => {
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
                                    onClick={() => handleEdit(order)}
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
                            <div className="text-sm font-medium">{order.name}</div>
                            {order.notes && (
                              <div className="text-xs text-muted-foreground mt-1">{order.notes}</div>
                            )}
                            {order.scheduledDates && order.scheduledDates.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                投与予定: {order.scheduledDates.join(', ')}
                              </div>
                            )}
                          </div>

                          {!isEditing ? (
                            <div className="text-sm text-muted-foreground">
                              {formatOrderDisplay(order)}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {order.type === 'prescription' && (
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground">数量</label>
                                    <Input
                                      value={isEditing.quantity || ''}
                                      onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                      placeholder="1錠"
                                      className="h-8 text-xs"
                                    />
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
                                    <label className="text-xs text-muted-foreground">タイミング</label>
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
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-xs text-muted-foreground">用量</label>
                                    <Input
                                      value={isEditing.quantity || ''}
                                      onChange={(e) => updateEditingValue(order.id, 'quantity', e.target.value)}
                                      placeholder="1A"
                                      className="h-8 text-xs"
                                    />
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
                    })}
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