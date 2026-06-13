import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/atoms/card';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { Button } from '@shared/components/atoms/button';
import { Progress } from '@shared/components/atoms/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@shared/components/atoms/badge';
import type { Order, ThreePointCheck } from '../../types';

interface ThreePointCheckModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  order: Order | null;
}

export function ThreePointCheckModal({ open, onClose, onComplete, order }: ThreePointCheckModalProps) {
  const [checks, setChecks] = useState<ThreePointCheck>({
    patientConfirmed: false,
    orderConfirmed: false,
    allergyConfirmed: false
  });

  if (!order) return null;

  const totalChecks = 3;
  const completedChecks = Object.values(checks).filter(Boolean).length;
  const progress = (completedChecks / totalChecks) * 100;
  const allChecked = completedChecks === totalChecks;

  const handleCheckChange = (field: keyof ThreePointCheck) => {
    setChecks(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleComplete = () => {
    if (allChecked) {
      onComplete();
      // Reset checks for next time
      setChecks({
        patientConfirmed: false,
        orderConfirmed: false,
        allergyConfirmed: false
      });
    }
  };

  const handleCancel = () => {
    setChecks({
      patientConfirmed: false,
      orderConfirmed: false,
      allergyConfirmed: false
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>3点チェック画面（W2）</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                進捗: {completedChecks}/{totalChecks}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {/* Card 1: 患者確認 */}
          <Card className={checks.patientConfirmed ? 'border-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>1. 患者確認</span>
                {checks.patientConfirmed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">患者ID</div>
                  <div>{order.patientId}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">性別</div>
                  <div>{order.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">氏名</div>
                  <div>{order.patientName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">氏名カナ</div>
                  <div>{order.patientKana}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">生年月日</div>
                  <div>{order.birthDate} ({order.age}歳)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="patient-check"
                  checked={checks.patientConfirmed}
                  onCheckedChange={() => handleCheckChange('patientConfirmed')}
                />
                <label htmlFor="patient-check" className="cursor-pointer">
                  患者情報を確認しました
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: オーダ内容確認 */}
          <Card className={checks.orderConfirmed ? 'border-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>2. オーダ内容確認</span>
                {checks.orderConfirmed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">オーダ種</div>
                  <Badge variant="outline">{order.orderType}</Badge>
                </div>
                <div>
                  <div className="text-sm text-gray-600">診療科</div>
                  <div>{order.department}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-600">実施内容</div>
                  <div className="p-3 bg-gray-50 rounded mt-1">{order.content}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">日付</div>
                  <div>{new Date().toLocaleDateString('ja-JP')}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="order-check"
                  checked={checks.orderConfirmed}
                  onCheckedChange={() => handleCheckChange('orderConfirmed')}
                />
                <label htmlFor="order-check" className="cursor-pointer">
                  オーダ内容を確認しました
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: 禁忌・注意確認 */}
          <Card className={checks.allergyConfirmed ? 'border-green-500' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>3. 禁忌・注意確認</span>
                {checks.allergyConfirmed && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.hasAllergies ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertCircle className="h-5 w-5" />
                    <span>アレルギー情報があります</span>
                  </div>
                  {order.allergies.map((allergy) => (
                    <div key={allergy.id} className="p-3 bg-orange-50 border border-orange-200 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div>{allergy.component}</div>
                          <div className="text-sm text-gray-600">症状: {allergy.symptoms}</div>
                        </div>
                        <Badge variant={allergy.severity === '重度' ? 'destructive' : 'secondary'}>
                          {allergy.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>アレルギー情報はありません</span>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="allergy-check"
                  checked={checks.allergyConfirmed}
                  onCheckedChange={() => handleCheckChange('allergyConfirmed')}
                />
                <label htmlFor="allergy-check" className="cursor-pointer">
                  禁忌・注意事項を確認しました
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleCancel}>
              中断
            </Button>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={handleCancel}>
                戻る
              </Button>
              <Button onClick={handleComplete} disabled={!allChecked}>
                確認完了
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
