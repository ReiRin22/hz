'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { ja } from '@/shared/i18n/ja';

export interface SpecimenOrderConfirmButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function SpecimenOrderConfirmButton({
  onClick,
  isLoading = false,
  disabled = false,
}: SpecimenOrderConfirmButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full"
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? ja.orders.specimenOrderEntry.confirmButton.submitting : ja.orders.specimenOrderEntry.confirmButton.submit}
    </Button>
  );
}
