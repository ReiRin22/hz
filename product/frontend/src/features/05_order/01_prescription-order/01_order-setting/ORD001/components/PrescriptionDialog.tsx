import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { FileText, Printer, CheckCircle2 } from 'lucide-react';

interface OrderDetail {
  id: string;
  name: string;
  dosage?: string;
  usage?: string;
  type?: 'prescription' | 'injection' | 'lab';
  rpNumber?: number;
  quantity?: string;
  frequency?: string;
  timing?: string;
  period?: string;
  isRefillEligible?: boolean;
  refillCount?: number;
  notes?: string;
}

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface PrescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  orders: OrderDetail[];
  patient: CurrentPatient;
  onConfirm: () => void;
  initialType: 'external' | 'internal';
  initialStep?: 'sign' | 'preview';
}

export function PrescriptionDialog({ open, onClose, orders, patient, onConfirm, initialType, initialStep }: PrescriptionDialogProps) {
  const [step, setStep] = useState<'sign' | 'preview'>(initialStep || 'sign');
  const [type, setType] = useState<'external' | 'internal'>(initialType);
  const [pin, setPin] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [doctorName, setDoctorName] = useState(''); // 認証後に自動設定される
  
  // ダイアログが開くたびに初期状態を適用
  useEffect(() => {
    if (open) {
      setStep(initialStep || 'sign');
      setType(initialType); // initialTypeが変更されたらtypeを更新
    }
  }, [open, initialStep, initialType]);

  // 処方オーダーのみフィルタリング
  const prescriptionOrders = orders.filter(o => o.type === 'prescription');

  const handleSign = () => {
    if (!pin) {
      return;
    }
    
    // 本来はここで電子署名の検証を行う
    // 仮の検証（PINが4文字以上）
    if (pin.length >= 4) {
      setIsSigned(true);
      setStep('preview');
      setDoctorName('田中 医師'); // 認証後に自動設定される
    }
  };

  const handlePrint = () => {
    // 本来はここで印刷処理を行う
    window.print();
  };

  const handleComplete = () => {
    onConfirm();
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setStep('sign');
    setPin('');
    setIsSigned(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        {step === 'sign' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                電子署名
              </DialogTitle>
              <DialogDescription className="space-y-1">
                <div>{type === 'external' ? '院外' : '院内'}処方箋に電子署名を付与します。</div>
                <div>HPKIカードをカードリーダーにセットしてください。</div>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="space-y-2">
                <Label htmlFor="pin">PINコード</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="電子署名用PINコード"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
              <Button onClick={handleSign} disabled={!pin}>
                署名してプレビュー
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'preview' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Printer className="w-5 h-5" />
                処方箋プレビュー
              </DialogTitle>
              <DialogDescription>
                {type === 'external' ? '院外処方箋' : '院内処方箋'}の内容を確認してください
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="max-h-[50vh] border rounded p-6 bg-white" id="prescription-preview">
              <div className="space-y-6">
                {/* ヘッダー */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">
                    {type === 'external' ? '院外処方箋' : '院内処方箋'}
                  </h2>
                  <div className="text-sm text-muted-foreground mt-2">
                    発行日：{new Date().toLocaleDateString('ja-JP')}
                  </div>
                  {type === 'internal' && (
                    <div className="text-sm font-medium text-blue-600 mt-1">
                      院内調剤用
                    </div>
                  )}
                </div>

                {/* 患者情報 */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded">
                  <div>
                    <div className="text-xs text-muted-foreground">患者氏名</div>
                    <div className="font-medium">{patient.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">患者番号</div>
                    <div className="font-medium">{patient.patientNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">年齢・性別</div>
                    <div className="font-medium">
                      {patient.age}歳 {patient.gender === 'male' ? '男性' : '女性'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">診療日</div>
                    <div className="font-medium">{patient.visitDate.replace(/-/g, '/')}</div>
                  </div>
                </div>

                {/* 医療機関情報 */}
                <div className="p-4 bg-muted/30 rounded">
                  <div className="text-xs text-muted-foreground mb-1">
                    {type === 'external' ? '医療機関' : '調剤場所'}
                  </div>
                  <div className="font-medium">
                    {type === 'external' ? '○○医療センター' : '○○医療センター 院内薬局'}
                  </div>
                  <div className="text-sm mt-1">〒100-0001 東京都千代田区千代田1-1-1</div>
                  <div className="text-sm">TEL: 03-1234-5678</div>
                </div>

                {/* 処方内容 */}
                <div>
                  <div className="font-medium mb-3 flex items-center justify-between">
                    <span>処方内容</span>
                    {type === 'internal' && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                        院内調剤
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-4">
                    {prescriptionOrders.map((order) => (
                      <div key={order.id} className="p-3 border rounded">
                        <div className="flex items-start gap-2 mb-2">
                          {order.rpNumber && (
                            <Badge variant="outline" className="shrink-0">
                              Rp{order.rpNumber}
                            </Badge>
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{order.name}</div>
                            {order.quantity && (
                              <div className="text-sm text-muted-foreground mt-1">
                                用量：{order.quantity}
                              </div>
                            )}
                            {order.frequency && (
                              <div className="text-sm text-muted-foreground">
                                頻度：{order.frequency}
                              </div>
                            )}
                            {order.timing && (
                              <div className="text-sm text-muted-foreground">
                                タイミング：{order.timing}
                              </div>
                            )}
                            {order.period && (
                              <div className="text-sm text-muted-foreground">
                                期間：{order.period}
                              </div>
                            )}
                            {order.isRefillEligible && order.refillCount && (
                              <div className="text-sm text-blue-600 font-medium mt-1">
                                リフィル処方（{order.refillCount}回）
                              </div>
                            )}
                            {order.notes && (
                              <div className="text-sm text-muted-foreground mt-1">
                                備考：{order.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 電子署名情報 */}
                <div className="p-4 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div className="text-sm font-medium text-green-900">電子署名済み</div>
                  </div>
                  <div className="text-sm text-green-800">
                    医師名：{doctorName}
                  </div>
                  <div className="text-xs text-green-700 mt-1">
                    署名日時：{new Date().toLocaleString('ja-JP')}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep('sign')}>
                戻る
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                印刷
              </Button>
              <Button onClick={handleComplete}>
                完了
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PrescriptionDialog;