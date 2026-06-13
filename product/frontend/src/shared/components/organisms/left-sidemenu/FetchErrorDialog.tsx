'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/shared/components/atoms/alert-dialog';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.fetchErrorDialog;

interface FetchErrorDialogProps {
  errorMessage: string | null;
  onClose: () => void;
}

export function FetchErrorDialog({ errorMessage, onClose }: FetchErrorDialogProps) {
  return (
    <AlertDialog open={errorMessage !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>{t.closeBtn}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
