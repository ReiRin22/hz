// オーダー表示用のヘルパーコンポーネント
import { X, Edit3, Check, Info, RefreshCw, AlertTriangle, MessageSquare } from 'lucide-react';
import { Badge } from '@/shared/components/atoms/badge';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/atoms/select';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import { Label } from '@/shared/components/atoms/label';
import { useDrag, useDrop } from 'react-dnd';
import { useRef, useState } from 'react';

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
  scheduledDates?: string[];
  isRefillEligible?: boolean;
  refillCount?: number;
  units?: string[];
  selectedUnit?: string;
  noGenericSubstitution?: boolean;
  prescriptionType?: '院外' | '院内' | '定期' | '臨時'; // 処方区分
  hasAllergy?: boolean; // アレルギー該当フラグ
  hasDrugInteraction?: boolean; // 併用禁忌フラグ
  drugInteractionWith?: string; // 併用禁忌の相手薬剤名
  isDuplicate?: boolean; // 重複投薬フラグ
  duplicateWith?: string; // 重複している薬剤名
  patientAttributeWarning?: string; // 患者属性警告（例：高齢者禁忌、妊婦禁忌、腎機能低下注意）
  isOnePackage?: boolean; // 一包化
  isCrushed?: boolean; // 粉砕
  isMixed?: boolean; // 混合
  // 用法詳細情報（編集時の復元用）
  usageDetails?: {
    usageType?: 'meal' | 'interval' | 'time' | 'breastfeeding' | 'asneeded' | 'uneven';
    mealFrequency?: string;
    mealTiming?: string;
    unevenFrequency?: string;
    unevenTiming?: string;
    unevenDoses?: {
      wakeup: string;
      breakfast: string;
      lunch: string;
      dinner: string;
      bedtime: string;
    };
    intervalType?: string;
    timesPerDay?: string;
    timeSlots?: string[];
    breastfeedingFrequency?: string;
    asNeededCondition?: string;
    maxTimesPerDay?: string;
    topicalUsageType?: 'lifestyle' | 'frequency' | 'interval' | 'asneeded';
    topicalLifestyleFrequency?: string;
    topicalLifestyleTiming?: string;
    topicalFrequency?: string;
    topicalIntervalType?: string;
    topicalAsNeededCondition?: string;
    topicalMaxTimesPerDay?: string;
    scheduleType?: 'none' | 'dayinterval' | 'weekday' | 'datespecific' | 'periodcount';
    scheduleWeekdays?: string[];
    intervalDays?: string;
    restDays?: string;
    dateSpecificType?: 'monthly' | 'absolute';
    monthlyDates?: string[];
    absoluteDates?: string[];
    periodType?: 'week' | 'month' | 'year';
    timesInPeriod?: string;
  };
}

interface EditingState {
  quantityValue?: string;
  quantityUnit?: string;
  frequency?: string;
  timing?: string;
}

interface OrderDisplayProps {
  orders: OrderDetail[];
  orderType: string;
  editingOrders: { [key: string]: EditingState };
  onEditOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onSave: (order: OrderDetail) => void;
  onCancel: (orderId: string) => void;
  onUpdateOrder: (order: OrderDetail) => void;
  updateEditingValue: (orderId: string, field: keyof EditingState, value: string) => void;
  formatOrderDisplay: (order: OrderDetail) => string;
  frequencyOptions: string[];
  timingOptions: string[];
  onReorderDrug?: (dragOrderId: string, dropOrderId: string) => void; // 薬剤の並び替え（グループ内）
  onReorderGroup?: (dragGroupKey: string, dropGroupKey: string) => void; // グループの並び替え
}

// 処方オーダーを同一用法・日数・開始日でグループ化する関数
export const groupPrescriptionOrders = (orders: OrderDetail[]) => {
  const groups: { [key: string]: OrderDetail[] } = {};
  
  orders.forEach(order => {
    // グループ化のキー：種別(routeType) + 用法(frequency + timing) + 日数(period) + 開始日(startDate) + 頓用フラグ + 調剤指示(一包化・粉砕・混合) + リフィル(有無・回数)
    const key = `${order.routeType || ''}-${order.frequency || ''}-${order.timing || ''}-${order.period || ''}-${order.startDate || ''}-${order.isAsNeeded ? 'asneeded' : 'regular'}-${order.isOnePackage ? 'onepackage' : ''}-${order.isCrushed ? 'crushed' : ''}-${order.isMixed ? 'mixed' : ''}-${order.isRefillEligible ? 'refill' : 'norefill'}-${order.refillCount || 0}`;
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(order);
  });
  
  // グループを配列に変換し、RP番号を振り直す
  let rpNumber = 1;
  const groupedOrders: Array<{ key: string; rpNumber: number; orders: OrderDetail[] }> = [];
  
  Object.entries(groups).forEach(([key, groupOrders]) => {
    groupedOrders.push({
      key,
      rpNumber: rpNumber++,
      orders: groupOrders
    });
  });
  
  return groupedOrders;
};

// ドラッグ可能な薬剤カードコンポーネント
function DraggableDrugCard({
  order,
  index,
  groupKey,
  isEditing,
  isFirst,
  isLast,
  onEditOrder,
  onRemoveOrder,
  onSave,
  onCancel,
  onUpdateOrder,
  updateEditingValue,
  formatOrderDisplay,
  onDrag
}: {
  order: OrderDetail;
  index: number;
  groupKey: string;
  isEditing: EditingState | undefined;
  isFirst: boolean;
  isLast: boolean;
  onEditOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onSave: (order: OrderDetail) => void;
  onCancel: (orderId: string) => void;
  onUpdateOrder: (order: OrderDetail) => void;
  updateEditingValue: (orderId: string, field: keyof EditingState, value: string) => void;
  formatOrderDisplay: (order: OrderDetail) => string;
  onDrag?: (dragOrderId: string, dropOrderId: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'DRUG',
    item: { orderId: order.id, groupKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => !isEditing && !!onDrag
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'DRUG',
    drop: (item: { orderId: string; groupKey: string }) => {
      if (item.orderId !== order.id && item.groupKey === groupKey && onDrag) {
        onDrag(item.orderId, order.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    canDrop: (item) => item.groupKey === groupKey
  });

  // カード全体をドラッグ可能に
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-3 border border-blue-200 bg-card ${
        isFirst ? '' : 'border-t-0'
      } ${
        isLast ? 'rounded-b' : ''
      } ${
        isDragging ? 'opacity-50' : ''
      } ${
        isOver ? 'bg-blue-50' : ''
      } ${
        onDrag && !isEditing ? 'cursor-move' : ''
      }`}
    >
      {/* 薬剤名と操作ボタン */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="text-sm font-medium flex-shrink-0 w-48">
            {order.name}
          </div>
          {!isEditing && formatOrderDisplay(order) && (
            <>
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {formatOrderDisplay(order)}
              </div>
              <div className="h-4 w-px bg-border flex-shrink-0"></div>
            </>
          )}
          {!isEditing && order.period && (() => {
            // 日数の表示（頓用の場合は「回分」、それ以外は「日分」）
            const periodText = order.period.includes('日分') || order.period.includes('回分')
              ? order.period
              : order.isAsNeeded 
                ? `${order.period}回分`
                : `${order.period}日分`;
            
            return (
              <>
                <div className="text-xs text-muted-foreground flex-shrink-0">
                  {periodText}
                </div>
                <div className="h-4 w-px bg-border flex-shrink-0"></div>
              </>
            );
          })()}
          {!isEditing && order.startDate && (() => {
            // 開始日のフォーマット (YYYY/MM/DD)
            const start = new Date(order.startDate);
            const year = start.getFullYear();
            const month = String(start.getMonth() + 1).padStart(2, '0');
            const day = String(start.getDate()).padStart(2, '0');
            const formattedDate = `${year}/${month}/${day}`;
            
            return (
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {formattedDate}
              </div>
            );
          })()}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              // 外部連携：薬剤情報参照
              console.log('薬剤情報参照:', order.name);
            }}
            className="h-6 w-6 p-0"
          >
            <Info className="w-3 h-3" />
          </Button>
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
                onClick={() => onSave(order)}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCancel(order.id)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* アレルギー、後発医薬品変更不可、リフィル処方を同じ行に表示 */}
      {(order.hasAllergy || order.noGenericSubstitution || order.isRefillEligible) && (
        <div className="mb-2 flex items-center gap-2">
          {order.hasAllergy && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              アレルギー
            </Badge>
          )}
          {order.noGenericSubstitution && (
            <Badge variant="outline" className="text-xs">
              後発品変更不可
            </Badge>
          )}
        </div>
      )}

      <div className="mb-2">
        {/* notesのみ表示 */}
        {order.notes && (
          <div className="text-xs text-muted-foreground mt-1">特記事項：{order.notes}</div>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-1">
          {/* 後発医薬品変更不可表示は上部に移動済み */}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
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
        </div>
      )}
    </div>
  );
}

// ドラッグ可能なRpグループコンポーネント
function DraggableRpGroup({
  group,
  editingOrders,
  onEditOrder,
  onRemoveOrder,
  onSave,
  onCancel,
  onUpdateOrder,
  updateEditingValue,
  formatOrderDisplay,
  onDragDrug,
  onDragGroup
}: {
  group: { key: string; rpNumber: number; orders: OrderDetail[] };
  editingOrders: { [key: string]: EditingState };
  onEditOrder: (order: OrderDetail) => void;
  onRemoveOrder: (id: string) => void;
  onSave: (order: OrderDetail) => void;
  onCancel: (orderId: string) => void;
  onUpdateOrder: (order: OrderDetail) => void;
  updateEditingValue: (orderId: string, field: keyof EditingState, value: string) => void;
  formatOrderDisplay: (order: OrderDetail) => string;
  onDragDrug?: (dragOrderId: string, dropOrderId: string) => void;
  onDragGroup?: (dragGroupKey: string, dropGroupKey: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isCommentExpanded, setIsCommentExpanded] = useState(false);
  
  // RPコメントの有無を確認
  const hasComment = group.orders[0]?.rpComment && group.orders[0].rpComment.trim().length > 0;

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'GROUP',
    item: { groupKey: group.key },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: () => !!onDragGroup
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'GROUP',
    drop: (item: { groupKey: string }) => {
      if (item.groupKey !== group.key && onDragGroup) {
        onDragGroup(item.groupKey, group.key);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  });

  // ヘッダー全体をドラッグ可能に
  drag(headerRef);
  preview(drop(ref));

  return (
    <div 
      ref={ref} 
      className={`space-y-0 ${isDragging ? 'opacity-50' : ''} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      {/* RPヘッダー */}
      <div 
        ref={headerRef}
        className={`flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-t border border-b-0 border-blue-200 ${
          onDragGroup ? 'cursor-move' : ''
        }`}
      >
        <span className="text-sm font-medium text-primary">
          RP.{group.rpNumber}
        </span>
        {group.orders[0].routeType && (
          <Badge 
            variant="outline" 
            className={`text-xs h-5 ${
              group.orders[0].routeType === '内服' 
                ? 'bg-blue-50 text-blue-700 border-blue-300' 
                : group.orders[0].routeType === '外用'
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            {group.orders[0].routeType}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {group.orders[0].isAsNeeded ? (
            <>
              {group.orders[0].asNeededCondition || '頓用'} {group.orders[0].maxTimesPerDay}
            </>
          ) : (
            <>
              {group.orders[0].frequency}{group.orders[0].frequency && group.orders[0].timing ? ' ' : ''}{group.orders[0].timing}
            </>
          )}
        </span>
        {/* 調剤指示バッジ */}
        {(group.orders[0].isOnePackage || group.orders[0].isCrushed || group.orders[0].isMixed) && (
          <div className="flex items-center gap-1">
            {group.orders[0].isOnePackage && (
              <Badge variant="secondary" className="text-xs h-5 bg-purple-50 text-purple-700 border-purple-300">
                一包化
              </Badge>
            )}
            {group.orders[0].isCrushed && (
              <Badge variant="secondary" className="text-xs h-5 bg-amber-50 text-amber-700 border-amber-300">
                粉砕
              </Badge>
            )}
            {group.orders[0].isMixed && (
              <Badge variant="secondary" className="text-xs h-5 bg-teal-50 text-teal-700 border-teal-300">
                混合
              </Badge>
            )}
          </div>
        )}
        {/* リフィル処方バッジ */}
        {group.orders[0].isRefillEligible && (
          <Badge variant="secondary" className="text-xs h-5 bg-purple-100 text-purple-800">
            <RefreshCw className="w-3 h-3 mr-1" />
            リフィル処方: {group.orders[0].refillCount}回
          </Badge>
        )}
        
        <div className="flex-1"></div>
        
        {/* RPコメントトグルボタン */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsCommentExpanded(!isCommentExpanded)}
          className={`h-6 w-6 p-0 ${hasComment ? 'text-blue-600 hover:text-blue-700' : 'text-muted-foreground hover:text-foreground'}`}
          title={hasComment ? 'RPコメントあり' : 'RPコメント'}
        >
          <MessageSquare className={`w-4 h-4 ${hasComment ? 'fill-blue-600' : ''}`} />
        </Button>
      </div>
      
      {/* グループ内のオーダー */}
      {group.orders.map((order, index) => (
        <DraggableDrugCard
          key={order.id}
          order={order}
          index={index}
          groupKey={group.key}
          isEditing={editingOrders[order.id]}
          isFirst={index === 0}
          isLast={index === group.orders.length - 1 && !isCommentExpanded}
          onEditOrder={onEditOrder}
          onRemoveOrder={onRemoveOrder}
          onSave={onSave}
          onCancel={onCancel}
          onUpdateOrder={onUpdateOrder}
          updateEditingValue={updateEditingValue}
          formatOrderDisplay={formatOrderDisplay}
          onDrag={group.orders.length > 1 ? onDragDrug : undefined}
        />
      ))}
      
      {/* RPコメント入力欄（展開時のみ表示） */}
      {isCommentExpanded && (
        <div className="p-3 bg-blue-50/50 border border-blue-200 border-t-0 rounded-b">
          <Label htmlFor={`rp-comment-${group.key}`} className="text-xs font-medium text-muted-foreground mb-1 block">
            RPコメント
          </Label>
          <Input
            id={`rp-comment-${group.key}`}
            value={group.orders[0]?.rpComment || ''}
            onChange={(e) => {
              // 同一グループ内の全薬剤にコメントを設定
              group.orders.forEach(order => {
                onUpdateOrder({
                  ...order,
                  rpComment: e.target.value
                });
              });
            }}
            placeholder="このRPグループへのコメント（例：食事に注意、症状に応じて調整可）"
            className="h-8 text-xs bg-white"
          />
        </div>
      )}
    </div>
  );
}

export function PrescriptionOrdersDisplay({
  orders,
  editingOrders,
  onEditOrder,
  onRemoveOrder,
  onSave,
  onCancel,
  onUpdateOrder,
  updateEditingValue,
  formatOrderDisplay,
  frequencyOptions,
  timingOptions,
  onReorderDrug,
  onReorderGroup
}: OrderDisplayProps) {
  const groupedOrders = groupPrescriptionOrders(orders);

  return (
    <>
      {groupedOrders.map((group) => (
        <DraggableRpGroup
          key={group.key}
          group={group}
          editingOrders={editingOrders}
          onEditOrder={onEditOrder}
          onRemoveOrder={onRemoveOrder}
          onSave={onSave}
          onCancel={onCancel}
          onUpdateOrder={onUpdateOrder}
          updateEditingValue={updateEditingValue}
          formatOrderDisplay={formatOrderDisplay}
          onDragDrug={onReorderDrug}
          onDragGroup={onReorderGroup}
        />
      ))}
    </>
  );
}