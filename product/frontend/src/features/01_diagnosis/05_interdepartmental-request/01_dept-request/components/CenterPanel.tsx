import { useState, useEffect } from 'react';
import { Calendar, CalendarDays, Pill, Clock, FileText, Plus } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Switch } from '@/shared/components/atoms/switch';

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent';
  groupItems?: OrderItem[]; // グループの場合の子項目
}

interface OrderDetail extends OrderItem {
  route?: string;
  period?: string;
  startDate?: string;
  isAsNeeded?: boolean;
  priority?: string;
  notes?: string;
  quantity?: string;
  frequency?: string;
  timing?: string;
}

interface CenterPanelProps {
  selectedDrug: OrderItem | null;
  onConfirmDrug: (orderDetail: OrderDetail) => void;
  onClearSelection: () => void;
}

export function CenterPanel({ selectedDrug, onConfirmDrug, onClearSelection }: CenterPanelProps) {
  const [quantity, setQuantity] = useState('1錠');
  const [frequency, setFrequency] = useState('1日3回');
  const [timing, setTiming] = useState('食後');
  const [route, setRoute] = useState('経口');
  const [period, setPeriod] = useState('7日分');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAsNeeded, setIsAsNeeded] = useState(false);
  const [notes, setNotes] = useState('');

  // 薬剤が選択されたときにデフォルト値を設定
  useEffect(() => {
    if (selectedDrug) {
      // 薬剤の用法から適切なデフォルト値を設定
      if (selectedDrug.usage?.includes('1日3回')) {
        setFrequency('1日3回');
      } else if (selectedDrug.usage?.includes('1日2回')) {
        setFrequency('1日2回');
      } else if (selectedDrug.usage?.includes('1日1回')) {
        setFrequency('1日1回');
      }

      if (selectedDrug.usage?.includes('食後')) {
        setTiming('食後');
      } else if (selectedDrug.usage?.includes('食前')) {
        setTiming('食前');
      }

      // 用量のデフォルト設定
      if (selectedDrug.dosage) {
        setQuantity('1錠');
      }
    }
  }, [selectedDrug]);

  const handleConfirm = () => {
    if (!selectedDrug) return;

    const orderDetail: OrderDetail = {
      ...selectedDrug,
      id: `order-${Date.now()}-${Math.random()}`,
      quantity,
      frequency,
      timing,
      route,
      period,
      startDate,
      isAsNeeded,
      notes,
      type: 'prescription'
    };

    onConfirmDrug(orderDetail);
    handleClear();
  };

  const handleClear = () => {
    // フォームをリセット
    setQuantity('1錠');
    setFrequency('1日3回');
    setTiming('食後');
    setRoute('経口');
    setPeriod('7日分');
    setStartDate(new Date().toISOString().split('T')[0]);
    setIsAsNeeded(false);
    setNotes('');
    onClearSelection();
  };

  return (
    <div className="w-[450px] bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-600" />
          処方詳細設定
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          選択された薬剤の用量、用法、投与期間などの詳細を設定してください。
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedDrug ? (
          <div className="p-8 text-center text-muted-foreground">
            <div className="text-lg mb-2">薬剤が選択されていません</div>
            <div className="text-sm">左ペインから薬剤を選択してください</div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* 薬剤名表示 */}
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium">{selectedDrug.name}</h4>
              {selectedDrug.dosage && (
                <p className="text-sm text-muted-foreground mt-1">
                  規格: {selectedDrug.dosage}
                </p>
              )}
            </div>

            {/* 用量設定 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="quantity" className="flex items-center gap-1">
                  <Pill className="w-4 h-4" />
                  用量
                </Label>
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1錠"
                />
              </div>
              <div>
                <Label htmlFor="route">投与経路</Label>
                <Select value={route} onValueChange={setRoute}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="経口">経口</SelectItem>
                    <SelectItem value="静脈内">静脈内</SelectItem>
                    <SelectItem value="筋肉内">筋肉内</SelectItem>
                    <SelectItem value="皮下">皮下</SelectItem>
                    <SelectItem value="外用">外用</SelectItem>
                    <SelectItem value="吸入">吸入</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 用法設定 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="frequency" className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  頻度
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1日1回">1日1回</SelectItem>
                    <SelectItem value="1日2回">1日2回</SelectItem>
                    <SelectItem value="1日3回">1日3回</SelectItem>
                    <SelectItem value="1日4回">1日4回</SelectItem>
                    <SelectItem value="1日6回">1日6回</SelectItem>
                    <SelectItem value="8時間毎">8時間毎</SelectItem>
                    <SelectItem value="12時間毎">12時間毎</SelectItem>
                    <SelectItem value="週1回">週1回</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timing">服薬タイミング</Label>
                <Select value={timing} onValueChange={setTiming}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="食後">食後</SelectItem>
                    <SelectItem value="食前">食前</SelectItem>
                    <SelectItem value="食間">食間</SelectItem>
                    <SelectItem value="朝昼夕">朝昼夕</SelectItem>
                    <SelectItem value="朝夕">朝夕</SelectItem>
                    <SelectItem value="就寝前">就寝前</SelectItem>
                    <SelectItem value="起床時">起床時</SelectItem>
                    <SelectItem value="随時">随時</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 投与期間・開始日 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="period" className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  投与期間
                </Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1日分">1日分</SelectItem>
                    <SelectItem value="3日分">3日分</SelectItem>
                    <SelectItem value="5日分">5日分</SelectItem>
                    <SelectItem value="7日分">7日分</SelectItem>
                    <SelectItem value="14日分">14日分</SelectItem>
                    <SelectItem value="21日分">21日分</SelectItem>
                    <SelectItem value="28日分">28日分</SelectItem>
                    <SelectItem value="30日分">30日分</SelectItem>
                    <SelectItem value="60日分">60日分</SelectItem>
                    <SelectItem value="90日分">90日分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="startDate" className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  開始日
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>

            {/* 頓用設定 */}
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div>
                <Label htmlFor="asNeeded" className="text-sm">頓用（症状時）</Label>
                <p className="text-xs text-muted-foreground">
                  症状がある時のみ服用
                </p>
              </div>
              <Switch
                id="asNeeded"
                checked={isAsNeeded}
                onCheckedChange={setIsAsNeeded}
              />
            </div>

            {/* 備考欄 */}
            <div>
              <Label htmlFor="notes" className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                備考・特記事項
              </Label>
              <Textarea
                id="notes"
                placeholder="特別な指示や注意事項があれば入力してください"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {selectedDrug && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              キャンセル
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              <Plus className="w-4 h-4 mr-1" />
              オーダーリストに追加
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}