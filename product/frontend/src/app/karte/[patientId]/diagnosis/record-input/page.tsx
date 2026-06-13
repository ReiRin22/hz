import REC001 from "@/features/01_diagnosis/01_record-creation/01_examination-input";

export default async function RecordInputPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;

  return (
    <REC001
      patientId={patientId}
      receptionId=""
    />
  );
}
