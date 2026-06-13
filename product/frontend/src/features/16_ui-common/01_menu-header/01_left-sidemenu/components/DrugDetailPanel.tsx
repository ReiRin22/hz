import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Calendar, Clock, Pill, FileText } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Badge } from '@/shared/components/atoms/badge';
import { Card, CardContent, CardHeader, CardTitle } from '/@/shared/components/atoms/card';
import { Separator } from '@/shared/components/atoms/separator';

interface OrderItem {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  source?: 'history' | 'set' | 'search' | 'frequent' | 'category';
  groupId?: string; // グループID（セットや履歴から追加された場合）
  groupName?: string; // グループ名
  groupType?: 'set' | 'history'; // グループの種類
  groupItems?: OrderItem[]; // グループの場合の子項目
}

interface OrderDetail extends OrderItem {
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
}

interface DrugDetailPanelProps {
  drug: OrderItem | null;
  onConfirm: (orderDetail: OrderDetail) => void;
  onCancel: () => void;
}

export function DrugDetailPanel({ drug, onConfirm, onCancel }: DrugDetailPanelProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDrugIndex, setCurrentDrugIndex] = useState(0);
  const [formData, setFormData] = useState({
    quantity: '1錠',
    frequency: '1日3回',
    timing: '毎食後',
    period: '7',
    startDate: new Date().toISOString().split('T')[0],
    isAsNeeded: false,
    notes: ''
  });

  // セットの場合の薬剤リスト
  const drugList = drug?.groupItems || (drug ? [drug] : []);
  const currentDrug = drugList[currentDrugIndex] || drug;
  const isMultipleDrugs = drugList.length > 1;

  // 薬剤が変更されたときにフォームをリセット
  useEffect(() => {
    if (drug) {
      setCurrentStep(1);
      setCurrentDrugIndex(0);
      setFormData({
        quantity: getDefaultQuantity(currentDrug),
        frequency: getDefaultFrequency(currentDrug),
        timing: getDefaultTiming(currentDrug),
        period: '7',
        startDate: new Date().toISOString().split('T')[0],
        isAsNeeded: false,
        notes: ''
      });
    }
  }, [drug?.id]);

  // 薬剤が変更されたときにフォームデータを更新
  useEffect(() => {
    if (currentDrug) {
      setFormData(prev => ({
        ...prev,
        quantity: getDefaultQuantity(currentDrug),
        frequency: getDefaultFrequency(currentDrug),
        timing: getDefaultTiming(currentDrug)
      }));
    }
  }, [currentDrugIndex]);

  const getDefaultQuantity = (item: OrderItem) => {
    if (item.dosage?.includes('200mg')) return '1錠';
    if (item.dosage?.includes('500mg')) return '1錠';
    if (item.dosage?.includes('散')) return '0.5g';
    return '1錠';
  };

  const getDefaultFrequency = (item: OrderItem) => {
    if (item.usage?.includes('1日3回')) return '1日3回';
    if (item.usage?.includes('1日2回')) return '1日2回';
    if (item.usage?.includes('1日1回')) return '1日1回';
    return '1日3回';
  };

  const getDefaultTiming = (item: OrderItem) => {
    if (item.usage?.includes('食後')) return '毎食後';
    if (item.usage?.includes('食前')) return '毎食前';
    if (item.usage?.includes('朝食後')) return '朝食後';
    return '毎食後';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirm = () => {
    if (!currentDrug) return;

    // グループの場合は親drugのグループ情報を使用
    const groupId = drug?.groupId || (isMultipleDrugs ? `group-${drug?.id}-${Date.now()}` : undefined);
    const groupName = drug?.groupName || (isMultipleDrugs ? drug?.name : undefined);
    const groupType = drug?.groupType;

    const orderDetail: OrderDetail = {
      ...currentDrug,
      id: `order-${Date.now()}-${Math.random()}`,
      type: 'prescription',
      quantity: formData.quantity,
      frequency: formData.frequency,
      timing: formData.timing,
      period: formData.period,
      startDate: formData.startDate,
      isAsNeeded: formData.isAsNeeded,
      notes: formData.notes,
      // グループ情報を設定
      groupId: groupId,
      groupName: groupName,
      groupType: groupType
    };

    onConfirm(orderDetail);

    // 複数薬剤の場合は次の薬剤に進む
    if (isMultipleDrugs && currentDrugIndex < drugList.length - 1) {
      setCurrentDrugIndex(prev => prev + 1);
      setCurrentStep(1);
    } else {
      // 単一薬剤または最後の薬剤の場合は詳細入力を終了
      onCancel();
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!drug) {
    return (
      <div className="w-[450px] bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2>薬剤詳細入力</h2>
          <div className="text-sm text-muted-foreground mt-1">
            左ペインから薬剤を選択してください
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Pill className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <div className="text-lg mb-2">薬剤を選択</div>
            <div className="text-sm">左ペインから処方する薬剤を選択してください</div>
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Pill className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg mb-2">用量設定</h3>
              <p className="text-sm text-muted-foreground">
                1回あたりの投与量を設定してください
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">1回量</label>
                    <Select value={formData.quantity} onValueChange={(value) => handleInputChange('quantity', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5錠">0.5錠</SelectItem>
                        <SelectItem value="1錠">1錠</SelectItem>
                        <SelectItem value="1.5錠">1.5錠</SelectItem>
                        <SelectItem value="2錠">2錠</SelectItem>
                        <SelectItem value="3錠">3錠</SelectItem>
                        <SelectItem value="0.5g">0.5g</SelectItem>
                        <SelectItem value="1g">1g</SelectItem>
                        <SelectItem value="1.5g">1.5g</SelectItem>
                        <SelectItem value="2g">2g</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-muted/30 p-3 rounded">
                    <div className="text-sm">
                      <div className="mb-1"><strong>薬剤情報</strong></div>
                      <div>規格: {currentDrug.dosage || '標準規格'}</div>
                      <div>標準用法: {currentDrug.usage || '医師指示'}</div>
                      {isMultipleDrugs && (
                        <div className="mt-2 text-primary">
                          セット内薬剤 {currentDrugIndex + 1}/{drugList.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg mb-2">用法設定</h3>
              <p className="text-sm text-muted-foreground">
                服薬回数とタイミングを設定してください
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">服薬回数</label>
                    <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1日1回">1日1回</SelectItem>
                        <SelectItem value="1日2回">1日2回</SelectItem>
                        <SelectItem value="1日3回">1日3回</SelectItem>
                        <SelectItem value="1日4回">1日4回</SelectItem>
                        <SelectItem value="1回分">1回分</SelectItem>
                        <SelectItem value="頓用">頓用</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">服薬タイミング</label>
                    <Select value={formData.timing} onValueChange={(value) => handleInputChange('timing', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="毎食後">毎食後</SelectItem>
                        <SelectItem value="毎食前">毎食前</SelectItem>
                        <SelectItem value="毎食間">毎食間</SelectItem>
                        <SelectItem value="朝食後">朝食後</SelectItem>
                        <SelectItem value="夕食後">夕食後</SelectItem>
                        <SelectItem value="就寝前">就寝前</SelectItem>
                        <SelectItem value="起床時">起床時</SelectItem>
                        <SelectItem value="症状時">症状時</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-sm text-blue-800">
                      <div className="mb-1"><strong>設定内容</strong></div>
                      <div>{formData.quantity} × {formData.frequency} {formData.timing}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg mb-2">投与期間</h3>
              <p className="text-sm text-muted-foreground">
                投与期間と開始日を設定してください
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">投与日数</label>
                    <Select value={formData.period} onValueChange={(value) => handleInputChange('period', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1日分</SelectItem>
                        <SelectItem value="3">3日分</SelectItem>
                        <SelectItem value="5">5日分</SelectItem>
                        <SelectItem value="7">7日分</SelectItem>
                        <SelectItem value="14">14日分</SelectItem>
                        <SelectItem value="21">21日分</SelectItem>
                        <SelectItem value="28">28日分</SelectItem>
                        <SelectItem value="30">30日分</SelectItem>
                        <SelectItem value="60">60日分</SelectItem>
                        <SelectItem value="90">90日分</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">服薬開始日</label>
                    <Input 
                      type="date" 
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>

                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-sm text-green-800">
                      <div className="mb-1"><strong>総投与量計算</strong></div>
                      <div>
                        1回量: {formData.quantity}<br />
                        頻度: {formData.frequency}<br />
                        期間: {formData.period}日分<br />
                        <Separator className="my-2" />
                        <strong>
                          総量: {
                            formData.frequency === '1日1回' ? Number(formData.period) :
                            formData.frequency === '1日2回' ? Number(formData.period) * 2 :
                            formData.frequency === '1日3回' ? Number(formData.period) * 3 :
                            formData.frequency === '1日4回' ? Number(formData.period) * 4 :
                            Number(formData.period)
                          } 回分
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="w-8 h-8 mx-auto mb-3 text-primary" />
              <h3 className="text-lg mb-2">確認・備考</h3>
              <p className="text-sm text-muted-foreground">
                設定内容を確認し、必要に応じて備考を入力してください
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  {currentDrug.name}
                  {isMultipleDrugs && (
                    <Badge variant="secondary" className="ml-2">
                      {currentDrugIndex + 1}/{drugList.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">1回量</div>
                    <div className="font-medium">{formData.quantity}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">頻度</div>
                    <div className="font-medium">{formData.frequency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">タイミング</div>
                    <div className="font-medium">{formData.timing}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">期間</div>
                    <div className="font-medium">{formData.period}日分</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-muted-foreground">開始日</div>
                    <div className="font-medium">{formData.startDate}</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm mb-2 block">備考・特記事項</label>
                  <Textarea 
                    placeholder="服薬指導や注意事項があれば入力してください"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="bg-primary/5 p-3 rounded border border-primary/20">
                  <div className="text-sm">
                    <div className="font-medium text-primary mb-2">処方内容サマリー</div>
                    <div>
                      {currentDrug.name} {formData.quantity} {formData.frequency} {formData.timing} {formData.period}日分
                      {formData.notes && <div className="mt-1 text-muted-foreground">備考: {formData.notes}</div>}
                      {isMultipleDrugs && (
                        <div className="mt-2 text-muted-foreground">
                          セット内薬剤 {currentDrugIndex + 1}/{drugList.length} の詳細設定
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-[450px] bg-card border-r border-border flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </Button>
          <div className="flex-1">
            <h2>薬剤詳細入力</h2>
            <div className="text-sm text-muted-foreground mt-1">
              {currentDrug.name}
              {isMultipleDrugs && (
                <span className="ml-2 text-primary">
                  ({currentDrugIndex + 1}/{drugList.length})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step}
              </div>
              {step < 4 && <div className="w-8 h-0.5 bg-muted mx-1" />}
            </div>
          ))}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>用量</span>
          <span>用法</span>
          <span>期間</span>
          <span>確認</span>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderStepContent()}
      </div>

      {/* フッター */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            前へ
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={nextStep}>
              次へ
            </Button>
          ) : (
            <Button onClick={handleConfirm}>
              <Plus className="w-4 h-4 mr-1" />
              {isMultipleDrugs && currentDrugIndex < drugList.length - 1 
                ? `オーダー追加 (次: ${drugList[currentDrugIndex + 1]?.name})` 
                : 'オーダー追加'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}