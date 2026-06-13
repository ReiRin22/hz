'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/components/atoms/tabs';
import { Badge } from '@shared/components/atoms/badge';
import { ScrollArea } from '@shared/components/atoms/scroll-area';
import { AlertCircle, CheckCircle2, AlertTriangle, Save, X } from 'lucide-react';
import type { Order } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const rd = i18n.deptInstruction.resultDialog;

interface TestResult {
  itemName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  abnormalLevel?: 'high' | 'low' | 'critical';
}

interface ResultInputDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (results: TestResult[], notes: string) => void;
  order: Order | null;
}

const TEST_TEMPLATES = {
  CBC: [
    { itemName: 'WBC（白血球数）', unit: '/μL', referenceRange: '3500-9000' },
    { itemName: 'RBC（赤血球数）', unit: '×10⁴/μL', referenceRange: '男:430-570 女:380-500' },
    { itemName: 'Hb（ヘモグロビン）', unit: 'g/dL', referenceRange: '男:13.5-17.5 女:11.5-15.0' },
    { itemName: 'Ht（ヘマトクリット）', unit: '%', referenceRange: '男:40-52 女:35-45' },
    { itemName: 'PLT（血小板数）', unit: '×10⁴/μL', referenceRange: '14-34' },
  ],
  生化学: [
    { itemName: 'TP（総蛋白）', unit: 'g/dL', referenceRange: '6.5-8.2' },
    { itemName: 'Alb（アルブミン）', unit: 'g/dL', referenceRange: '3.9-4.9' },
    { itemName: 'AST（GOT）', unit: 'U/L', referenceRange: '10-40' },
    { itemName: 'ALT（GPT）', unit: 'U/L', referenceRange: '5-45' },
    { itemName: 'γ-GTP', unit: 'U/L', referenceRange: '男:75以下 女:45以下' },
    { itemName: 'T-Bil（総ビリルビン）', unit: 'mg/dL', referenceRange: '0.3-1.2' },
    { itemName: 'BUN（尿素窒素）', unit: 'mg/dL', referenceRange: '8-20' },
    { itemName: 'Cr（クレアチニン）', unit: 'mg/dL', referenceRange: '男:0.6-1.1 女:0.4-0.8' },
    { itemName: 'UA（尿酸）', unit: 'mg/dL', referenceRange: '男:3.6-7.0 女:2.3-7.0' },
    { itemName: 'T-Cho（総コレステロール）', unit: 'mg/dL', referenceRange: '130-219' },
    { itemName: 'TG（中性脂肪）', unit: 'mg/dL', referenceRange: '30-149' },
    { itemName: 'HDL-C', unit: 'mg/dL', referenceRange: '40-96' },
    { itemName: 'LDL-C', unit: 'mg/dL', referenceRange: '70-139' },
    { itemName: 'Glu（血糖）', unit: 'mg/dL', referenceRange: '70-109' },
  ],
  凝固系: [
    { itemName: 'PT（プロトロンビン時間）', unit: '秒', referenceRange: '10.0-13.0' },
    { itemName: 'PT-INR', unit: '', referenceRange: '0.85-1.15' },
    { itemName: 'APTT', unit: '秒', referenceRange: '25-40' },
    { itemName: 'フィブリノゲン', unit: 'mg/dL', referenceRange: '200-400' },
  ],
  血糖: [
    { itemName: '血糖値（空腹時）', unit: 'mg/dL', referenceRange: '70-109' },
    { itemName: 'HbA1c', unit: '%', referenceRange: '4.6-6.2' },
  ]
};

export function ResultInputDialog({ open, onClose, onSave, order }: ResultInputDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('CBC');
  const [results, setResults] = useState<TestResult[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  if (!order) return null;

  const handleValueChange = (itemName: string, value: string) => {
    setInputValues(prev => ({ ...prev, [itemName]: value }));
  };

  const checkAbnormal = (value: string, referenceRange: string): { isAbnormal: boolean; abnormalLevel?: 'high' | 'low' | 'critical' } => {
    if (!value || value.trim() === '') return { isAbnormal: false };
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return { isAbnormal: false };
    const rangeMatch = referenceRange.match(/(\d+\.?\d*)-(\d+\.?\d*)/);
    if (rangeMatch) {
      const lower = parseFloat(rangeMatch[1]);
      const upper = parseFloat(rangeMatch[2]);
      if (numValue < lower) {
        const diff = ((lower - numValue) / lower) * 100;
        return { isAbnormal: true, abnormalLevel: diff > 30 ? 'critical' : 'low' };
      }
      if (numValue > upper) {
        const diff = ((numValue - upper) / upper) * 100;
        return { isAbnormal: true, abnormalLevel: diff > 30 ? 'critical' : 'high' };
      }
    }
    return { isAbnormal: false };
  };

  const handleAddResult = (template: typeof TEST_TEMPLATES.CBC[0]) => {
    const value = inputValues[template.itemName] || '';
    if (!value.trim()) return;
    const abnormalCheck = checkAbnormal(value, template.referenceRange);
    const newResult: TestResult = {
      itemName: template.itemName,
      value,
      unit: template.unit,
      referenceRange: template.referenceRange,
      isAbnormal: abnormalCheck.isAbnormal,
      abnormalLevel: abnormalCheck.abnormalLevel
    };
    setResults(prev => {
      const filtered = prev.filter(r => r.itemName !== template.itemName);
      return [...filtered, newResult];
    });
  };

  const handleRemoveResult = (itemName: string) => {
    setResults(prev => prev.filter(r => r.itemName !== itemName));
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[itemName];
      return newValues;
    });
  };

  const handleSave = () => {
    if (results.length === 0) return;
    onSave(results, notes);
    handleClose();
  };

  const handleClose = () => {
    setResults([]);
    setNotes('');
    setInputValues({});
    onClose();
  };

  const hasAbnormalResults = results.some(r => r.isAbnormal);
  const hasCriticalResults = results.some(r => r.abnormalLevel === 'critical');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {rd.title}
            {hasCriticalResults && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {rd.criticalBadge}
              </Badge>
            )}
            {hasAbnormalResults && !hasCriticalResults && (
              <Badge variant="outline" className="gap-1 border-orange-500 text-orange-700">
                <AlertTriangle className="h-3 w-3" />
                {rd.abnormalBadge}
              </Badge>
            )}
          </DialogTitle>
          <div className="text-sm text-gray-600 space-y-1">
            <div>{rd.patientInfo(order.patientName, order.patientId)}</div>
            <div>{rd.examContent(order.content)}</div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="CBC">{rd.tabs.CBC}</TabsTrigger>
              <TabsTrigger value="生化学">{rd.tabs.biochem}</TabsTrigger>
              <TabsTrigger value="凝固系">{rd.tabs.coagulation}</TabsTrigger>
              <TabsTrigger value="血糖">{rd.tabs.glucose}</TabsTrigger>
            </TabsList>

            {Object.entries(TEST_TEMPLATES).map(([key, items]) => (
              <TabsContent key={key} value={key} className="flex-1 overflow-hidden mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {items.map((item) => {
                      const existingResult = results.find(r => r.itemName === item.itemName);
                      const currentValue = inputValues[item.itemName] || existingResult?.value || '';
                      return (
                        <div
                          key={item.itemName}
                          className={`p-4 border rounded-lg ${
                            existingResult
                              ? existingResult.abnormalLevel === 'critical'
                                ? 'bg-red-50 border-red-300'
                                : existingResult.isAbnormal
                                ? 'bg-orange-50 border-orange-300'
                                : 'bg-green-50 border-green-300'
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm">{item.itemName}</Label>
                                {existingResult && (
                                  existingResult.abnormalLevel === 'critical' ? (
                                    <Badge variant="destructive" className="gap-1">
                                      <AlertCircle className="h-3 w-3" />
                                      {rd.badges.critical}
                                    </Badge>
                                  ) : existingResult.isAbnormal ? (
                                    <Badge variant="outline" className="gap-1 border-orange-500 text-orange-700">
                                      <AlertTriangle className="h-3 w-3" />
                                      {rd.badges.abnormal}
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="gap-1 border-green-500 text-green-700">
                                      <CheckCircle2 className="h-3 w-3" />
                                      {rd.badges.normal}
                                    </Badge>
                                  )
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="text"
                                  placeholder={rd.valuePlaceholder}
                                  value={currentValue}
                                  onChange={(e) => handleValueChange(item.itemName, e.target.value)}
                                  onBlur={() => handleAddResult(item)}
                                  className="w-32"
                                />
                                <span className="text-sm text-gray-600">{item.unit}</span>
                                <span className="text-sm text-gray-500 ml-4">
                                  {rd.referenceRange(item.referenceRange)}
                                </span>
                              </div>
                            </div>
                            {existingResult && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveResult(item.itemName)}
                                className="shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {results.length > 0 && (
          <div className="border-t pt-4">
            <Label className="text-sm">{rd.inputSummary(results.length)}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {results.map((result) => (
                <Badge
                  key={result.itemName}
                  variant={result.abnormalLevel === 'critical' ? 'destructive' : result.isAbnormal ? 'outline' : 'secondary'}
                  className={result.isAbnormal && result.abnormalLevel !== 'critical' ? 'border-orange-500 text-orange-700' : ''}
                >
                  {result.itemName}: {result.value}{result.unit}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">{rd.notes}</Label>
          <Textarea
            id="notes"
            placeholder={rd.notesPlaceholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {rd.cancel}
          </Button>
          <Button onClick={handleSave} disabled={results.length === 0} className="gap-2">
            <Save className="h-4 w-4" />
            {rd.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
