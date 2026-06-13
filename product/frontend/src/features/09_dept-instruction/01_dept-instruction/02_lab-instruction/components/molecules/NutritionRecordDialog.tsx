'use client';

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
import type { Order } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const nd = i18n.deptInstruction.nutritionDialog;

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
  const now = () => new Date().toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  const [guidanceType, setGuidanceType] = useState<string>(nd.guidanceTypes[0]);
  const [guidanceDate, setGuidanceDate] = useState<string>(now());
  const [guidanceDuration, setGuidanceDuration] = useState<string>('30');
  const [guidanceContent, setGuidanceContent] = useState<string>('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [nutritionGoals, setNutritionGoals] = useState<string>('');
  const [followUpPlan, setFollowUpPlan] = useState<string>('');
  const [instructor, setInstructor] = useState<string>(currentUser);
  const [notes, setNotes] = useState<string>('');

  const handleSave = () => {
    if (!guidanceContent.trim()) {
      alert(nd.guidanceContentAlert);
      return;
    }
    onSave({ guidanceType, guidanceDate, guidanceDuration, guidanceContent, dietaryRestrictions, nutritionGoals, followUpPlan, instructor, notes });
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setGuidanceType(nd.guidanceTypes[0]);
    setGuidanceDate(now());
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
          <DialogTitle>{nd.title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guidanceType">{nd.guidanceType}</Label>
                <Select value={guidanceType} onValueChange={setGuidanceType}>
                  <SelectTrigger id="guidanceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nd.guidanceTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidanceDate">{nd.guidanceDate}</Label>
                <Input
                  id="guidanceDate"
                  type="text"
                  value={guidanceDate}
                  onChange={(e) => setGuidanceDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guidanceDuration">{nd.guidanceDuration}</Label>
                <Select value={guidanceDuration} onValueChange={setGuidanceDuration}>
                  <SelectTrigger id="guidanceDuration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nd.durations.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">{nd.instructor}</Label>
                <Input
                  id="instructor"
                  type="text"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guidanceContent">
                {nd.guidanceContent} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="guidanceContent"
                placeholder={nd.guidanceContentPlaceholder}
                value={guidanceContent}
                onChange={(e) => setGuidanceContent(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietaryRestrictions">{nd.dietaryRestrictions}</Label>
              <Textarea
                id="dietaryRestrictions"
                placeholder={nd.dietaryPlaceholder}
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionGoals">{nd.nutritionGoals}</Label>
              <Textarea
                id="nutritionGoals"
                placeholder={nd.nutritionGoalsPlaceholder}
                value={nutritionGoals}
                onChange={(e) => setNutritionGoals(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpPlan">{nd.followUpPlan}</Label>
              <Textarea
                id="followUpPlan"
                placeholder={nd.followUpPlaceholder}
                value={followUpPlan}
                onChange={(e) => setFollowUpPlan(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{nd.notes}</Label>
              <Textarea
                id="notes"
                placeholder={nd.notesPlaceholder}
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
            {nd.cancel}
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {nd.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
