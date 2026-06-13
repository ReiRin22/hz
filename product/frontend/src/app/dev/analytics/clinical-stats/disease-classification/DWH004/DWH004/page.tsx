import ORD076 from '@/features/05_order/19_nursing-care-order/03_order-confirm';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    patientId?: string;
    patientName?: string;
    confirmedBy?: string;
    isSubstitute?: string;
  }>;
}) {
  const { patientId = '', patientName = '', confirmedBy = '', isSubstitute } =
    await searchParams;

  return (
    <ORD076
      patientId={patientId}
      patientName={patientName}
      confirmedBy={confirmedBy}
      isSubstituteUser={isSubstitute === 'true'}
    />
  );
}
