'use client';
import { OrderEntryOrganism } from './components/organisms/OrderEntryOrganism';
import { Toaster } from '@/shared/components/atoms/sonner';

export default function ETC004Page() {
  return (
    <>
      <OrderEntryOrganism />
      <Toaster />
    </>
  );
}
