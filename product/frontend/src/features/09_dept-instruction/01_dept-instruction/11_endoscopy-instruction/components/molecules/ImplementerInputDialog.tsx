import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/components/atoms/dialog';
import { Label } from '@shared/components/atoms/label';
import { Input } from '@shared/components/atoms/input';
import { Textarea } from '@shared/components/atoms/textarea';
import { Button } from '@shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/components/atoms/select';
import type { ImplementerInput } from '../../types';

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

  useEffect(() => {
    if (open) {
      setImplementer(currentUser);
      setWitness('');
      setLocation('');
      setNotes('');
      setReason('');
    }
  }, [open, currentUser]);

  const handleSave = () => {
    if (isDifferentUser && !reason.trim()) {
      alert('実施者がログインユーザと異なる場合は理由を入力してください');
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
          <DialogTitle>実施者入力（W3）</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 実施者 */}
          <div className="space-y-2">
            <Label htmlFor="implementer">
              実施者 <span className="text-red-500">*</span>
            </Label>
            <Select value={implementer} onValueChange={setImplementer}>
              <SelectTrigger id="implementer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="看護師A">看護師A</SelectItem>
                <SelectItem value="看護師B">看護師B</SelectItem>
                <SelectItem value="看護師C">看護師C</SelectItem>
                <SelectItem value="看護師D">看護師D</SelectItem>
                <SelectItem value="薬剤師A">薬剤師A</SelectItem>
                <SelectItem value="放射線技師A">放射線技師A</SelectItem>
              </SelectContent>
            </Select>
            {isDifferentUser && (
              <p className="text-sm text-orange-600">
                ※ ログインユーザと異なる実施者が選択されています
              </p>
            )}
          </div>

          {/* 理由（実施者が異なる場合） */}
          {isDifferentUser && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                理由 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="実施者が異なる理由を入力してください"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* 立ち会い者 */}
          <div className="space-y-2">
            <Label htmlFor="witness">立ち会い者（任意）</Label>
            <Input
              id="witness"
              placeholder="立ち会い者を入力"
              value={witness}
              onChange={(e) => setWitness(e.target.value)}
            />
          </div>

          {/* 実施場所 */}
          <div className="space-y-2">
            <Label htmlFor="location">実施場所（任意）</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="実施場所を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="外来診察室1">外来診察室1</SelectItem>
                <SelectItem value="外来診察室2">外来診察室2</SelectItem>
                <SelectItem value="処置室">処置室</SelectItem>
                <SelectItem value="検査室">検査室</SelectItem>
                <SelectItem value="薬剤部">薬剤部</SelectItem>
                <SelectItem value="放射線科">放射線科</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 備考 */}
          <div className="space-y-2">
            <Label htmlFor="notes">備考（任意）</Label>
            <Textarea
              id="notes"
              placeholder="備考を入力"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* 実施日時（自動） */}
          <div className="space-y-2">
            <Label>実施日時（自動）</Label>
            <Input
              value={new Date().toLocaleString('ja-JP')}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
