'use client';

import { useRouter } from 'next/navigation';
import REC002 from '@/features/01_diagnosis/01_record-creation/01_schema-creation';

export default function SchemaCreationPage() {
  const router = useRouter();
  return <REC002 onCancel={() => router.back()} />;
}
