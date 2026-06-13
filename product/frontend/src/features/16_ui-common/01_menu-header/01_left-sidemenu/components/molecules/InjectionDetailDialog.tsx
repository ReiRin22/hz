import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Checkbox } from '@/shared/components/atoms/checkbox';
import type { OrderItem } from '../../../types/order.types';

interface InjectionDetailOrder extends OrderItem {
  route?: string;
  infusionRate?: string;
  timing?: string;
  frequency?: string;
  period?: string;
  startDate?: string;
  notes?: string;
  isAsNeeded?: boolean;
}

interface InjectionDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  drug: OrderItem | null;
  onConfirm: (orderDetail: InjectionDetailOrder) => void;
}

export function InjectionDetailDialog({ isOpen, onClose, drug, onConfirm }: InjectionDetailDialogProps) {
  const [formData, setFormData] = useState<InjectionDetailOrder>({
    id: '',
    name: '',
    dosage: '',
    usage: '',
    route: '',
    infusionRate: '',
    timing: '',
    frequency: '1日1回',
    period: '1日間',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    isAsNeeded: false,
  });

  useEffect(() => {
    if (drug) {
      setFormData({
        id: `injection-${drug.name.replace(/\s+/g, '_')}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: drug.name,
        dosage: drug.dosage || '',
        usage: drug.usage || '',
        route: getDefaultRoute(drug),
        infusionRate: getDefaultInfusionRate(drug),
        timing: '朝',
        frequency: '1日1回',
        period: '1日間',
        startDate: new Date().toISOString().split('T')[0],
        notes: '',
        isAsNeeded: false,
      });
    }
  }, [drug]);

  // デフォルト投与経路を推定
  const getDefaultRoute = (drug: OrderItem): string => {
    const usage = drug.usage?.toLowerCase() || '';
    if (usage.includes('点滴') || usage.includes('輸液')) return '点滴静注';
    if (usage.includes('静注') || usage.includes('静脈内')) return '静脈内注射';
    if (usage.includes('筋注') || usage.includes('筋肉内')) return '筋肉内注射';
    if (usage.includes('皮下')) return '皮下注射';
    return '静脈内注射';
  };

  // デフォルト投与速度を推定
  const getDefaultInfusionRate = (drug: OrderItem): string => {
    const usage = drug.usage || '';
    const rateMatch = usage.match(/(\d+ml\/h)/);
    if (rateMatch) return rateMatch[1];
    
    if (usage.includes('点滴') || usage.includes('輸液')) return '100ml/h';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    onClose();
  };

  const handleInputChange = (field: keyof InjectionDetailOrder, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!drug) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>注射オーダー詳細設定</DialogTitle>
          <DialogDescription>
            選択された注射薬の投与経路、速度、タイミングなどの詳細を設定してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 薬剤基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="drug-name">薬剤名</Label>
              <Input
                id="drug-name"
                value={formData.name}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="dosage">用量・規格</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                placeholder="例: 500ml, 1A"
              />
            </div>
          </div>

          {/* 投与経路と速度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="route">投与経路</Label>
              <Select value={formData.route} onValueChange={(value) => handleInputChange('route', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="投与経路を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="点滴静注">点滴静注</SelectItem>
                  <SelectItem value="静脈内注射">静脈内注射</SelectItem>
                  <SelectItem value="筋肉内注射">筋肉内注射</SelectItem>
                  <SelectItem value="皮下注射">皮下注射</SelectItem>
                  <SelectItem value="点滴内混注">点滴内混注</SelectItem>
                  <SelectItem value="動脈内注射">動脈内注射</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="infusion-rate">投与速度</Label>
              <Input
                id="infusion-rate"
                value={formData.infusionRate}
                onChange={(e) => handleInputChange('infusionRate', e.target.value)}
                placeholder="例: 100ml/h, 緩徐に"
              />
            </div>
          </div>

          {/* 投与タイミングと頻度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timing">投与タイミング</Label>
              <Select value={formData.timing} onValueChange={(value) => handleInputChange('timing', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="投与タイミングを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="朝">朝</SelectItem>
                  <SelectItem value="昼">昼</SelectItem>
                  <SelectItem value="夕">夕</SelectItem>
                  <SelectItem value="朝昼">朝昼</SelectItem>
                  <SelectItem value="朝夕">朝夕</SelectItem>
                  <SelectItem value="昼夕">昼夕</SelectItem>
                  <SelectItem value="朝昼夕">朝昼夕</SelectItem>
                  <SelectItem value="就寝前">就寝前</SelectItem>
                  <SelectItem value="食前">食前</SelectItem>
                  <SelectItem value="食後">食後</SelectItem>
                  <SelectItem value="随時">随時</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="frequency">頻度</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="頻度を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1日1回">1日1回</SelectItem>
                  <SelectItem value="1日2回">1日2回</SelectItem>
                  <SelectItem value="1日3回">1日3回</SelectItem>
                  <SelectItem value="1日4回">1日4回</SelectItem>
                  <SelectItem value="週1回">週1回</SelectItem>
                  <SelectItem value="週2回">週2回</SelectItem>
                  <SelectItem value="週3回">週3回</SelectItem>
                  <SelectItem value="隔日">隔日</SelectItem>
                  <SelectItem value="必要時">必要時</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 期間と開始日 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period">投与期間</Label>
              <Select value={formData.period} onValueChange={(value) => handleInputChange('period', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="投与期間を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1日間">1日間</SelectItem>
                  <SelectItem value="2日間">2日間</SelectItem>
                  <SelectItem value="3日間">3日間</SelectItem>
                  <SelectItem value="7日間">7日間</SelectItem>
                  <SelectItem value="14日間">14日間</SelectItem>
                  <SelectItem value="30日間">30日間</SelectItem>
                  <SelectItem value="継続">継続</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-date">開始日</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
          </div>

          {/* 頓用チェックボックス */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="as-needed"
              checked={formData.isAsNeeded}
              onCheckedChange={(checked) => handleInputChange('isAsNeeded', !!checked)}
            />
            <Label htmlFor="as-needed">頓用（必要時に使用）</Label>
          </div>

          {/* 備考 */}
          <div>
            <Label htmlFor="notes">備考・注意事項</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="投与時の注意事項、観察項目など"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              確定
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}