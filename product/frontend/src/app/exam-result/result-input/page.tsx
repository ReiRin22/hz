import RES002Page from '@/features/06_exam-result/02_result-input/01_result-entry/RES002';

export default async function Page({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId } = await searchParams;
  return <RES002Page orderId={orderId ?? ''} />;
}
