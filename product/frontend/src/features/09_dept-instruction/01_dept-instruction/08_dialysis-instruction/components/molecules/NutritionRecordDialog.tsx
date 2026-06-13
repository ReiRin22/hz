import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Input } from '@shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { ScrollArea } from '@shared/components/atoms/scroll-area';
import { Alert, AlertDescription } from '@shared/components/atoms/alert';
import { Info, Save, X } from 'lucide-react';
import type { Order } from '../../types';

interface NutritionRecordDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NutritionRecordData) => void;
  order: Order | null;
  currentUser: string;
}

export interface NutritionRecordData {
  guidanceType: string;
  guidanceDate: string;
  guidanceDuration: string;
  guidanceContent: string;
  dietaryRestrictions: string;
  nutritionGoals: string;
  followUpPlan: string;
  instructor: string;
  notes: string;
}

export function NutritionRecordDialog({
  open,
  onClose,
  onSave,
  order,
  currentUser
}: NutritionRecordDialogProps) {
  const [guidanceType, setGuidanceType] = useState<string>('個別指導');
  const [guidanceDate, setGuidanceDate] = useState<string>(
    new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  );
  const [guidanceDuration, setGuidanceDuration] = useState<string>('30');
  const [guidanceContent, setGuidanceContent] = useState<string>('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [nutritionGoals, setNutritionGoals] = useState<string>('');
  const [followUpPlan, setFollowUpPlan] = useState<string>('');
  const [instructor, setInstructor] = useState<string>(currentUser);
  const [notes, setNotes] = useState<string>('');

  const handleSave = () => {
    if (!guidanceContent.trim()) {
      alert('指導内容を入力してください');
      return;
    }

    onSave({
      guidanceType,
      guidanceDate,
      guidanceDuration,
      guidanceContent,
      dietaryRestrictions,
      nutritionGoals,
      followUpPlan,
      instructor,
      notes
    });

    // フォームをリセット
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setGuidanceType('個別指導');
    setGuidanceDate(new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }));
    setGuidanceDuration('30');
    setGuidanceContent('');
    setDietaryRestrictions('');
    setNutritionGoals('');
    setFollowUpPlan('');
    setInstructor(currentUser);
    setNotes('');
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>栄養指導記録入力</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6">
            {/* 患者情報 */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>患者ID: {order.patientId}</div>
                  <div>患者名: {order.patientName}</div>
                  <div>オーダ内容: {order.content}</div>
                  <div>診療科: {order.department}</div>
                </div>
              </AlertDescription>
            </Alert>

            {/* 指導情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guidanceType">指導種別</Label>
                <Select value={guidanceType} onValueChange={setGuidanceType}>
                  <SelectTrigger id="guidanceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="個別指導">個別指導</SelectItem>
                    <SelectItem value="集団指導">集団指導</SelectItem>
                    <SelectItem value="電話指導">電話指導</SelectItem>
                    <SelectItem value="オンライン指導">オンライン指導</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidanceDate">指導日時</Label>
                <Input
                  id="guidanceDate"
                  type="text"
                  value={guidanceDate}
                  onChange={(e) => setGuidanceDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidanceDuration">指導時間（分）</Label>
                <Select value={guidanceDuration} onValueChange={setGuidanceDuration}>
                  <SelectTrigger id="guidanceDuration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15分</SelectItem>
                    <SelectItem value="30">30分</SelectItem>
                    <SelectItem value="45">45分</SelectItem>
                    <SelectItem value="60">60分</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">指導者</Label>
                <Input
                  id="instructor"
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                />
              </div>
            </div>

            {/* 指導内容 */}
            <div className="space-y-2">
              <Label htmlFor="guidanceContent">
                指導内容 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="guidanceContent"
                placeholder="実施した栄養指導の内容を詳しく記入してください"
                value={guidanceContent}
                onChange={(e) => setGuidanceContent(e.target.value)}
                rows={6}
              />
            </div>

            {/* 食事制限 */}
            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">食事制限・配慮事項</Label>
              <Textarea
                id="dietaryRestrictions"
                placeholder="例：減塩食、糖尿病食、カロリー制限など"
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                rows={3}
              />
            </div>

            {/* 栄養目標 */}
            <div className="space-y-2">
              <Label htmlFor="nutritionGoals">栄養目標</Label>
              <Textarea
                id="nutritionGoals"
                placeholder="患者の栄養状態改善に向けた目標を記入してください"
                value={nutritionGoals}
                onChange={(e) => setNutritionGoals(e.target.value)}
                rows={3}
              />
            </div>

            {/* フォローアップ計画 */}
            <div className="space-y-2">
              <Label htmlFor="followUpPlan">フォローアップ計画</Label>
              <Textarea
                id="followUpPlan"
                placeholder="次回指導予定や継続的な支援計画を記入してください"
                value={followUpPlan}
                onChange={(e) => setFollowUpPlan(e.target.value)}
                rows={3}
              />
            </div>

            {/* 備考 */}
            <div className="space-y-2">
              <Label htmlFor="notes">備考</Label>
              <Textarea
                id="notes"
                placeholder="その他特記事項があれば記入してください"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
