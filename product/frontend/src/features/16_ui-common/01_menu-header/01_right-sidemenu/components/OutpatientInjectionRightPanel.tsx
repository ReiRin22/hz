// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
import { useState } from 'react';
import { Check, X, Edit3, Calendar, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Separator } from '@/shared/components/atoms/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/atoms/collapsible';
import { toast } from 'sonner';

interface OrderDetail {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent' | 'category';
  // 外来注射特有のフィールド
  route?: string;
  timing?: string;
  frequency?: string;
  notes?: string;
  injectionSite?: string;
  administrationDate?: string;
  isUrgent?: boolean;
}

interface OutpatientInjectionRightPanelProps {
  confirmedOrders: OrderDetail[];
  onUpdateOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onConfirmAllOrders: () => void;
}

export function OutpatientInjectionRightPanel({
  confirmedOrders,
  onUpdateOrder,
  onRemoveOrder,
  onConfirmAllOrders
}: OutpatientInjectionRightPanelProps) {
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const injectionRoutes = [
    '筋肉内注射',
    '皮下注射',
    '静脈内注射',
    '関節内注射',
    '局所注射',
    '皮内注射'
  ];

  const injectionSites = [
    '上腕部',
    '大腿部',
    '臀部',
    '腹部',
    '膝関節',
    '肩関節',
    '局所（病変部）'
  ];

  const timingOptions = [
    '即時実施',
    '30分後',
    '1時間後',
    '2時間後',
    '次回診察時',
    '指定日時'
  ];

  const frequencyOptions = [
    '1回のみ',
    '週1回',
    '週2回',
    '週3回',
    '隔週',
    '月1回'
  ];

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleEdit = (order: OrderDetail) => {
    setEditingOrderId(order.id);
    setExpandedOrders(prev => new Set(prev).add(order.id));
  };

  const handleSave = (order: OrderDetail) => {
    onUpdateOrder(order);
    setEditingOrderId(null);
    toast.success(`${order.name}の設定を更新しました`);
  };

  const handleCancel = () => {
    setEditingOrderId(null);
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'history': return '履歴';
      case 'set': return 'セット';
      case 'frequent': return '頻用';
      case 'search': return '薬剤';
      case 'category': return '薬効';
      default: return '手入力';
    }
  };

  const getDefaultValues = (order: OrderDetail): OrderDetail => {
    return {
      ...order,
      route: order.route || '筋肉内注射',
      timing: order.timing || '即時実施',
      frequency: order.frequency || '1回のみ',
      injectionSite: order.injectionSite || '上腕部',
      administrationDate: order.administrationDate || new Date().toISOString().split('T')[0],
      isUrgent: order.isUrgent || false,
      notes: order.notes || ''
    };
  };

  return (
    <div className="w-[500px] bg-card border-r border-border flex flex-col h-screen">
      <div className="border-b border-border p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-muted-foreground font-medium">オーダー詳細</div>
            <h2 className="font-normal">外来注射オーダー ({confirmedOrders.length}件)</h2>
          </div>
          <Button
            onClick={onConfirmAllOrders}
            disabled={confirmedOrders.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="w-4 h-4 mr-2" />
            オーダー確定
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {confirmedOrders.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <div className="text-center">
                <div className="text-lg mb-2">オーダーがありません</div>
                <div className="text-sm">左側から注射薬を選択してください</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {confirmedOrders.map((order) => {
                const isEditing = editingOrderId === order.id;
                const isExpanded = expandedOrders.has(order.id);
                const orderWithDefaults = getDefaultValues(order);

                return (
                  <Card key={order.id} className="relative">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">{order.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">
                              {getSourceLabel(order.source)}
                            </Badge>
                            {order.isUrgent && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                緊急
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(order)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveOrder(order.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* 基本情報（常に表示） */}
                      <div className="text-sm text-muted-foreground mb-2">
                        {order.dosage && <span>用量: {order.dosage}</span>}
                        {order.usage && order.dosage && <span className="mx-2">•</span>}
                        {order.usage && <span>用法: {order.usage}</span>}
                      </div>

                      {/* 展開可能な詳細設定 */}
                      <Collapsible open={isExpanded || isEditing}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-between p-0 h-auto"
                            onClick={() => !isEditing && toggleOrderExpansion(order.id)}
                            disabled={isEditing}
                          >
                            <span className="text-sm text-primary">詳細設定</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="mt-3">
                          {isEditing ? (
                            <EditableOrderForm
                              order={orderWithDefaults}
                              onSave={handleSave}
                              onCancel={handleCancel}
                              injectionRoutes={injectionRoutes}
                              injectionSites={injectionSites}
                              timingOptions={timingOptions}
                              frequencyOptions={frequencyOptions}
                            />
                          ) : (
                            <OrderDetailView order={orderWithDefaults} />
                          )}
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* フッター情報 */}
      {confirmedOrders.length > 0 && (
        <div className="border-t border-border p-3 bg-muted/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              合計 {confirmedOrders.length} 件のオーダー
            </span>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>確定待ち</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 編集フォームコンポーネント
interface EditableOrderFormProps {
  order: OrderDetail;
  onSave: (order: OrderDetail) => void;
  onCancel: () => void;
  injectionRoutes: string[];
  injectionSites: string[];
  timingOptions: string[];
  frequencyOptions: string[];
}

function EditableOrderForm({
  order,
  onSave,
  onCancel,
  injectionRoutes,
  injectionSites,
  timingOptions,
  frequencyOptions
}: EditableOrderFormProps) {
  const [editedOrder, setEditedOrder] = useState<OrderDetail>(order);

  const handleSave = () => {
    onSave(editedOrder);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="route">投与経路</Label>
          <Select
            value={editedOrder.route}
            onValueChange={(value) => setEditedOrder(prev => ({ ...prev, route: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {injectionRoutes.map((route) => (
                <SelectItem key={route} value={route}>
                  {route}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="site">注射部位</Label>
          <Select
            value={editedOrder.injectionSite}
            onValueChange={(value) => setEditedOrder(prev => ({ ...prev, injectionSite: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {injectionSites.map((site) => (
                <SelectItem key={site} value={site}>
                  {site}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="timing">実施タイミング</Label>
          <Select
            value={editedOrder.timing}
            onValueChange={(value) => setEditedOrder(prev => ({ ...prev, timing: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timingOptions.map((timing) => (
                <SelectItem key={timing} value={timing}>
                  {timing}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">頻度</Label>
          <Select
            value={editedOrder.frequency}
            onValueChange={(value) => setEditedOrder(prev => ({ ...prev, frequency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="date">実施日</Label>
        <Input
          type="date"
          value={editedOrder.administrationDate}
          onChange={(e) => setEditedOrder(prev => ({ ...prev, administrationDate: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="notes">備考</Label>
        <Textarea
          placeholder="注射に関する特記事項があれば入力してください"
          value={editedOrder.notes}
          onChange={(e) => setEditedOrder(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button onClick={handleSave}>
          <Check className="w-4 h-4 mr-2" />
          保存
        </Button>
      </div>
    </div>
  );
}

// 詳細表示コンポーネント
interface OrderDetailViewProps {
  order: OrderDetail;
}

function OrderDetailView({ order }: OrderDetailViewProps) {
  return (
    <div className="space-y-3 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-muted-foreground">投与経路:</span>
          <div>{order.route}</div>
        </div>
        <div>
          <span className="text-muted-foreground">注射部位:</span>
          <div>{order.injectionSite}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-muted-foreground">タイミング:</span>
          <div>{order.timing}</div>
        </div>
        <div>
          <span className="text-muted-foreground">頻度:</span>
          <div>{order.frequency}</div>
        </div>
      </div>

      <div>
        <span className="text-muted-foreground">実施日:</span>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {order.administrationDate}
        </div>
      </div>

      {order.notes && (
        <div>
          <span className="text-muted-foreground">備考:</span>
          <div className="mt-1 p-2 bg-muted/50 rounded text-xs">
            {order.notes}
          </div>
        </div>
      )}
    </div>
  );
}