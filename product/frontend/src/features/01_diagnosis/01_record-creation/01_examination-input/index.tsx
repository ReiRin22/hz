import { RecordInputOrganism } from './components/organisms/RecordInputOrganism';

type REC001Props = {
  patientId: string;
  receptionId: string;
  recordId?: string;
  loginUserName?: string;
  recorderId?: string;
  onConfirmed?: (recordId: string) => void;
};

export default function REC001({
  patientId,
  receptionId,
  recordId,
  loginUserName = '',
  recorderId = '',
  onConfirmed,
}: REC001Props) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <RecordInputOrganism
          patientId={patientId}
          receptionId={receptionId}
          recordId={recordId}
          loginUserName={loginUserName}
          recorderId={recorderId}
          onConfirmed={onConfirmed}
        />
      </div>
    </div>
  );
}
