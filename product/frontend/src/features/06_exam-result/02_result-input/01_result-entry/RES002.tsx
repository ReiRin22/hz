"use client";
import { MainLayout } from './components/templates/MainLayout';
import { TestResultInputPage } from './pages/TestResultInputPage';

export default function RES002Page({ orderId }: { orderId: string }) {
  return (
    <MainLayout>
      <TestResultInputPage orderId={orderId} />
    </MainLayout>
  );
}
