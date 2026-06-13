'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Label } from '@shared/components/atoms/label';
import { Input } from '@shared/components/atoms/input';
import { Textarea } from '@shared/components/atoms/textarea';
import { Button } from '@shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import type { ImplementerInput } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const id_ = i18n.deptInstruction.implementerDialog;

interface ImplementerInputDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ImplementerInput) => void;
  currentUser?: string;
}

export function ImplementerInputDialog({
  open,
  onClose,
  onSave,
  currentUser = '看護師C'
}: ImplementerInputDialogProps) {
  const [implementer, setImplementer] = useState<string>(currentUser);
  const [witness, setWitness] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const isDifferentUser = implementer !== currentUser;

  /* eslint-disable react-hooks/set-state-in-effect -- ダイアログ open 時のフォームリセット */
  useEffect(() => {
    if (open) {
      setImplementer(currentUser);
      setWitness('');
      setLocation('');
      setNotes('');
      setReason('');
    }
  }, [open, currentUser]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = () => {
    if (isDifferentUser && !reason.trim()) {
      alert(id_.differentUserAlert);
      return;
    }

    const data: ImplementerInput = {
      implementer,
      witness: witness || undefined,
      location: location || undefined,
      notes: notes || undefined,
      implementedAt: new Date().toLocaleString('ja-JP'),
      reason: isDifferentUser ? reason : undefined
    };

    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{id_.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="implementer">
              {id_.implementer} <span className="text-red-500">*</span>
            </Label>
            <Select value={implementer} onValueChange={setImplementer}>
              <SelectTrigger id="implementer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {id_.implementers.map((name) => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isDifferentUser && (
              <p className="text-sm text-orange-600">{id_.differentUserWarning}</p>
            )}
          </div>

          {isDifferentUser && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                {id_.reason} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder={id_.reasonPlaceholder}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="witness">{id_.witness}</Label>
            <Input
              id="witness"
              placeholder={id_.witnessPlaceholder}
              value={witness}
              onChange={(e) => setWitness(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{id_.location}</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder={id_.locationSelectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {id_.locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{id_.notes}</Label>
            <Textarea
              id="notes"
              placeholder={id_.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>{id_.implementedAt}</Label>
            <Input
              value={new Date().toLocaleString('ja-JP')}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>{id_.cancel}</Button>
            <Button onClick={handleSave}>{id_.save}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
