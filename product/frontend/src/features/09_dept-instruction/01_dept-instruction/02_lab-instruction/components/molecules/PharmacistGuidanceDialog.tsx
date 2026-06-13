'use client';

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
import type { Order } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const phd = i18n.deptInstruction.pharmacistDialog;

export interface PharmacistGuidanceData {
  guidanceDate: string;
  pharmacist: string;
  guidanceDuration: string;
  guidanceType: string;
  patientCondition: string;
  drugUnderstanding: string;
  adverseReactions: string;
  adherence: string;
  guidanceContent: string;
  pharmacistNotes: string;
  followUpNeeded: boolean;
  nextGuidanceDate?: string;
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
  const [guidanceDate, setGuidanceDate] = useState(new Date().toISOString().slice(0, 16));
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
    if (!guidanceType || !guidanceDuration || !guidanceContent) return;
    onSave({
      guidanceDate, pharmacist, guidanceDuration, guidanceType,
      patientCondition, drugUnderstanding, adverseReactions, adherence,
      guidanceContent, pharmacistNotes, followUpNeeded,
      nextGuidanceDate: followUpNeeded ? nextGuidanceDate : undefined
    });
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
            {phd.title}
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
              <TabsTrigger value="basic">{phd.tabs.basic}</TabsTrigger>
              <TabsTrigger value="assessment">{phd.tabs.assessment}</TabsTrigger>
              <TabsTrigger value="guidance">{phd.tabs.guidance}</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guidance-date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {phd.guidanceDate} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guidance-date"
                    type="datetime-local"
                    value={guidanceDate}
                    onChange={(e) => setGuidanceDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pharmacist">{phd.pharmacist}</Label>
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
                    {phd.guidanceType} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={guidanceType} onValueChange={setGuidanceType}>
                    <SelectTrigger id="guidance-type">
                      <SelectValue placeholder={phd.guidanceTypePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {phd.guidanceTypes.map((gt) => (
                        <SelectItem key={gt.value} value={gt.value}>{gt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {phd.duration} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    placeholder={phd.durationPlaceholder}
                    value={guidanceDuration}
                    onChange={(e) => setGuidanceDuration(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="patient-condition">{phd.patientCondition}</Label>
                <Textarea
                  id="patient-condition"
                  placeholder={phd.patientConditionPlaceholder}
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="understanding">{phd.understanding}</Label>
                <Select value={drugUnderstanding} onValueChange={setDrugUnderstanding}>
                  <SelectTrigger id="understanding">
                    <SelectValue placeholder={phd.understandingPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {phd.understandingLevels.map((ul) => (
                      <SelectItem key={ul.value} value={ul.value}>{ul.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adverse">{phd.adverseReactions}</Label>
                <Select value={adverseReactions} onValueChange={setAdverseReactions}>
                  <SelectTrigger id="adverse">
                    <SelectValue placeholder={phd.adverseReactionsPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {phd.adverseReactionLevels.map((al) => (
                      <SelectItem key={al.value} value={al.value}>{al.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adherence">{phd.adherence}</Label>
                <Select value={adherence} onValueChange={setAdherence}>
                  <SelectTrigger id="adherence">
                    <SelectValue placeholder={phd.adherencePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {phd.adherenceLevels.map((al) => (
                      <SelectItem key={al.value} value={al.value}>{al.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="guidance" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="guidance-content">
                  {phd.guidanceContent} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="guidance-content"
                  placeholder={phd.guidanceContentPlaceholder}
                  value={guidanceContent}
                  onChange={(e) => setGuidanceContent(e.target.value)}
                  rows={6}
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">{phd.pharmacistNotes}</Label>
                <Textarea
                  id="notes"
                  placeholder={phd.pharmacistNotesPlaceholder}
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
                    {phd.followUpNeeded}
                  </Label>
                </div>

                {followUpNeeded && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="next-date">{phd.nextGuidanceDate}</Label>
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
            {phd.cancel}
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {phd.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
