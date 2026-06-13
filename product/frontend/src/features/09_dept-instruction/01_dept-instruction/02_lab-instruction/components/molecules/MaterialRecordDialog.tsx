'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@shared/components/atoms/dialog';
import { Button } from '@shared/components/atoms/button';
import { Input } from '@shared/components/atoms/input';
import { Label } from '@shared/components/atoms/label';
import { Textarea } from '@shared/components/atoms/textarea';
import { Trash2, Plus } from 'lucide-react';
import type { Order, MaterialItem } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const md = i18n.deptInstruction.materialDialog;

interface MaterialRecordDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSave: (materials: MaterialItem[], notes?: string) => void;
  order: Order | null;
}

const BLOOD_TEST_DEFAULT_EQUIPMENTS: Omit<MaterialItem, 'id'>[] = [
  { type: 'EQUIPMENT', name: '採血管（紫キャップ / EDTA）', quantity: '1', unit: '本' },
  { type: 'EQUIPMENT', name: '採血管（黄キャップ / 血清分離）', quantity: '1', unit: '本' },
  { type: 'EQUIPMENT', name: '採血針 21G', quantity: '1', unit: '本' },
  { type: 'EQUIPMENT', name: 'アルコール綿', quantity: '2', unit: '枚' },
  { type: 'EQUIPMENT', name: '駆血帯', quantity: '1', unit: '本' },
];

const BLOOD_TEST_DEFAULT_MEDICATIONS: Omit<MaterialItem, 'id'>[] = [
  { type: 'MEDICATION', name: '消毒用エタノール 70%', quantity: '10', unit: 'mL' },
  { type: 'MEDICATION', name: 'ヘパリン生食（ライン維持用）', quantity: '5', unit: 'mL' },
];

function isBloodTest(order: Order | null): boolean {
  if (!order) return false;
  return order.orderType === 'SPECIMEN_TEST' &&
    (order.content.includes('血液') || order.content.includes('CBC') || order.content.includes('生化学'));
}

function makeItems(defaults: Omit<MaterialItem, 'id'>[]): MaterialItem[] {
  return defaults.map((d, i) => ({ ...d, id: `default-${i}` }));
}

export function MaterialRecordDialog({ open, onClose, onSave, order }: MaterialRecordDialogProps) {
  const [medications, setMedications] = useState<MaterialItem[]>([]);
  const [equipments, setEquipments] = useState<MaterialItem[]>([]);

  useEffect(() => {
    if (!open) return;
    if (isBloodTest(order)) {
      setEquipments(makeItems(BLOOD_TEST_DEFAULT_EQUIPMENTS));
      setMedications(makeItems(BLOOD_TEST_DEFAULT_MEDICATIONS));
    } else {
      setEquipments([]);
      setMedications([]);
    }
  }, [open, order]);
  const [notes, setNotes] = useState('');

  const addMedication = () => {
    setMedications([...medications, { id: Date.now().toString(), type: 'MEDICATION', name: '', quantity: '', unit: 'mg' }]);
  };

  const addEquipment = () => {
    setEquipments([...equipments, { id: Date.now().toString(), type: 'EQUIPMENT', name: '', quantity: '', unit: '本' }]);
  };

  const removeMedication = (id: string) => setMedications(medications.filter(m => m.id !== id));
  const removeEquipment  = (id: string) => setEquipments(equipments.filter(e => e.id !== id));

  const updateMedication = (id: string, field: keyof MaterialItem, value: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  const updateEquipment = (id: string, field: keyof MaterialItem, value: string) => {
    setEquipments(equipments.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const reset = () => { setMedications([]); setEquipments([]); setNotes(''); };

  const handleSave = () => {
    const validMedications = medications.filter(m => m.name.trim() !== '');
    const validEquipments  = equipments.filter(e => e.name.trim() !== '');
    onSave([...validMedications, ...validEquipments], notes.trim());
    reset();
  };

  const handleCancel = () => { onClose(false); reset(); };

  const currentDateTime = new Date().toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).replace(/\//g, '/');

  const desc = order?.orderType === 'ENDOSCOPY' ? md.descEndoscopy : md.descDefault;
  const attendingInfo = order?.attendingDoctor
    ? order.orderType === 'ENDOSCOPY'
      ? md.attendingInfoEndoscopy(order.attendingDoctor, order.department)
      : md.attendingInfo(order.attendingDoctor, order.department)
    : null;
  const implementedBy = order?.implementedBy || '看護師C';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{md.title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {order && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">{md.examContent}</Label>
              <div className="bg-gray-50 p-3 rounded text-sm">{order.content}</div>
            </div>
          )}

          {attendingInfo && (
            <div className="bg-pink-50 border border-pink-100 p-3 rounded text-sm">
              {attendingInfo}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 p-3 rounded text-sm">
            {md.enteredBy(implementedBy, currentDateTime)}
          </div>

          {/* 使用機材 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">{md.equipment}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addEquipment} className="gap-1">
                <Plus className="h-4 w-4" />
                {md.addEquipment}
              </Button>
            </div>

            {equipments.map((equipment) => (
              <div key={equipment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-[1fr_120px_80px_40px] gap-3 items-end">
                  <div className="space-y-1">
                    <Label htmlFor={`equip-name-${equipment.id}`} className="text-sm">{md.equipmentName}</Label>
                    <Input
                      id={`equip-name-${equipment.id}`}
                      value={equipment.name}
                      onChange={(e) => updateEquipment(equipment.id, 'name', e.target.value)}
                      placeholder={md.equipmentNamePlaceholder}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`equip-quantity-${equipment.id}`} className="text-sm">{md.quantity}</Label>
                    <Input
                      id={`equip-quantity-${equipment.id}`}
                      value={equipment.quantity}
                      onChange={(e) => updateEquipment(equipment.id, 'quantity', e.target.value)}
                      placeholder="2"
                      type="number"
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm invisible">{md.unit}</Label>
                    <select
                      value={equipment.unit}
                      onChange={(e) => updateEquipment(equipment.id, 'unit', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                    >
                      {md.equipmentUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <button
                    type="button"
                    aria-label={md.deleteEquipmentAria}
                    onClick={() => removeEquipment(equipment.id)}
                    className="h-10 flex items-center justify-center text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

            {equipments.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded">
                {md.noEquipment}
              </div>
            )}
          </div>

          {/* 使用薬剤 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">{md.medication}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication} className="gap-1">
                <Plus className="h-4 w-4" />
                {md.addMedication}
              </Button>
            </div>

            {medications.map((medication) => (
              <div key={medication.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-[1fr_120px_80px_40px] gap-3 items-end">
                  <div className="space-y-1">
                    <Label htmlFor={`med-name-${medication.id}`} className="text-sm">{md.medicationName}</Label>
                    <Input
                      id={`med-name-${medication.id}`}
                      value={medication.name}
                      onChange={(e) => updateMedication(medication.id, 'name', e.target.value)}
                      placeholder={md.medicationNamePlaceholder}
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`med-quantity-${medication.id}`} className="text-sm">{md.usage}</Label>
                    <Input
                      id={`med-quantity-${medication.id}`}
                      value={medication.quantity}
                      onChange={(e) => updateMedication(medication.id, 'quantity', e.target.value)}
                      placeholder="150"
                      type="number"
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm invisible">{md.unit}</Label>
                    <select
                      value={medication.unit}
                      onChange={(e) => updateMedication(medication.id, 'unit', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                    >
                      {md.medicationUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <button
                    type="button"
                    aria-label={md.deleteMedicationAria}
                    onClick={() => removeMedication(medication.id)}
                    className="h-10 flex items-center justify-center text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}

            {medications.length === 0 && (
              <div className="text-sm text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded">
                {md.noMedication}
              </div>
            )}
          </div>

          {/* 備考 */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">{md.notes}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={md.notesPlaceholder}
              rows={3}
              className="bg-gray-50 resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>{md.cancel}</Button>
          <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">{md.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
