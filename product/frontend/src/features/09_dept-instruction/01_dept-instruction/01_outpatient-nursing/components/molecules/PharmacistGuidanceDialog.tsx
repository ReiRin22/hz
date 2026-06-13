import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Input } from '@shared/components/atoms/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/atoms/tabs';
import { Badge } from '@shared/components/atoms/badge';
import { ScrollArea } from '@shared/components/atoms/scroll-area';
import { Separator } from '@shared/components/atoms/separator';
import { ClipboardList, User, Calendar, Clock } from 'lucide-react';
import type { Order } from '../../types';

export interface PharmacistGuidanceData {
  guidanceDate: string;
  pharmacist: string;
  guidanceDuration: string; // 指導時間（分）
  guidanceType: string; // 指導区分
  patientCondition: string; // 患者の状態
  drugUnderstanding: string; // 薬剤理解度
  adverseReactions: string; // 副作用の有無
  adherence: string; // 服薬状況
  guidanceContent: string; // 指導内容
  pharmacistNotes: string; // 薬剤師コメント
  followUpNeeded: boolean; // 継続指導の必要性
  nextGuidanceDate?: string; // 次回指導予定日
}

interface PharmacistGuidanceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PharmacistGuidanceData) => void;
  order: Order | null;
  currentUser: string;
}

export function PharmacistGuidanceDialog({
  open,
  onClose,
  onSave,
  order,
  currentUser
}: PharmacistGuidanceDialogProps) {
  const [guidanceDate, setGuidanceDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [pharmacist, setPharmacist] = useState(currentUser);
  const [guidanceDuration, setGuidanceDuration] = useState('');
  const [guidanceType, setGuidanceType] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [drugUnderstanding, setDrugUnderstanding] = useState('');
  const [adverseReactions, setAdverseReactions] = useState('');
  const [adherence, setAdherence] = useState('');
  const [guidanceContent, setGuidanceContent] = useState('');
  const [pharmacistNotes, setPharmacistNotes] = useState('');
  const [followUpNeeded, setFollowUpNeeded] = useState(false);
  const [nextGuidanceDate, setNextGuidanceDate] = useState('');

  const handleSave = () => {
    if (!guidanceType || !guidanceDuration || !guidanceContent) {
      return;
    }

    onSave({
      guidanceDate,
      pharmacist,
      guidanceDuration,
      guidanceType,
      patientCondition,
      drugUnderstanding,
      adverseReactions,
      adherence,
      guidanceContent,
      pharmacistNotes,
      followUpNeeded,
      nextGuidanceDate: followUpNeeded ? nextGuidanceDate : undefined
    });

    // リセット
    resetForm();
  };

  const resetForm = () => {
    setGuidanceDate(new Date().toISOString().slice(0, 16));
    setPharmacist(currentUser);
    setGuidanceDuration('');
    setGuidanceType('');
    setPatientCondition('');
    setDrugUnderstanding('');
    setAdverseReactions('');
    setAdherence('');
    setGuidanceContent('');
    setPharmacistNotes('');
    setFollowUpNeeded(false);
    setNextGuidanceDate('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!order) return null;

  const isValid = guidanceType && guidanceDuration && guidanceContent;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            薬剤師管理指導記録入力
          </DialogTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {order.patientName}（{order.patientId}）
              </span>
            </div>
            <Badge variant="outline">{order.orderType}</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="assessment">アセスメント</TabsTrigger>
              <TabsTrigger value="guidance">指導内容</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guidance-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    指導実施日時 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guidance-date"
                    type="datetime-local"
                    value={guidanceDate}
                    onChange={(e) => setGuidanceDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pharmacist">
                    指導薬剤師
                  </Label>
                  <Input
                    id="pharmacist"
                    value={pharmacist}
                    onChange={(e) => setPharmacist(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guidance-type">
                    指導区分 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={guidanceType} onValueChange={setGuidanceType}>
                    <SelectTrigger id="guidance-type">
                      <SelectValue placeholder="指導区分を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">初回指導</SelectItem>
                      <SelectItem value="follow-up">継続指導</SelectItem>
                      <SelectItem value="discharge">退院時指導</SelectItem>
                      <SelectItem value="special">特別指導</SelectItem>
                      <SelectItem value="phone">電話指導</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    指導時間（分） <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder="例: 15"
                    value={guidanceDuration}
                    onChange={(e) => setGuidanceDuration(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="patient-condition">患者の状態</Label>
                <Textarea
                  id="patient-condition"
                  placeholder="患者の全身状態、訴え、バイタルサインなど"
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="understanding">薬剤理解度</Label>
                <Select value={drugUnderstanding} onValueChange={setDrugUnderstanding}>
                  <SelectTrigger id="understanding">
                    <SelectValue placeholder="理解度を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">十分理解している</SelectItem>
                    <SelectItem value="good">概ね理解している</SelectItem>
                    <SelectItem value="fair">一部理解不足あり</SelectItem>
                    <SelectItem value="poor">理解不足</SelectItem>
                    <SelectItem value="unknown">評価困難</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adverse">副作用の有無</Label>
                <Select value={adverseReactions} onValueChange={setAdverseReactions}>
                  <SelectTrigger id="adverse">
                    <SelectValue placeholder="副作用の有無を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    <SelectItem value="mild">軽度あり（対処不要）</SelectItem>
                    <SelectItem value="moderate">中等度あり（要観察）</SelectItem>
                    <SelectItem value="severe">重度あり（要対応）</SelectItem>
                    <SelectItem value="suspected">疑い</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adherence">服薬状況（アドヒアランス）</Label>
                <Select value={adherence} onValueChange={setAdherence}>
                  <SelectTrigger id="adherence">
                    <SelectValue placeholder="服薬状況を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">良好（100%服用）</SelectItem>
                    <SelectItem value="good">概ね良好（80%以上）</SelectItem>
                    <SelectItem value="fair">やや不良（50-80%）</SelectItem>
                    <SelectItem value="poor">不良（50%未満）</SelectItem>
                    <SelectItem value="unknown">不明</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="guidance" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="guidance-content">
                  指導内容 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="guidance-content"
                  placeholder="薬効、用法・用量、副作用、注意事項など指導した内容を記載"
                  value={guidanceContent}
                  onChange={(e) => setGuidanceContent(e.target.value)}
                  rows={6}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">薬剤師コメント</Label>
                <Textarea
                  id="notes"
                  placeholder="特記事項、患者の反応、今後の方針など"
                  value={pharmacistNotes}
                  onChange={(e) => setPharmacistNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="follow-up"
                    checked={followUpNeeded}
                    onChange={(e) => setFollowUpNeeded(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="follow-up" className="cursor-pointer">
                    継続指導が必要
                  </Label>
                </div>

                {followUpNeeded && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="next-date">次回指導予定日</Label>
                    <Input
                      id="next-date"
                      type="date"
                      value={nextGuidanceDate}
                      onChange={(e) => setNextGuidanceDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
