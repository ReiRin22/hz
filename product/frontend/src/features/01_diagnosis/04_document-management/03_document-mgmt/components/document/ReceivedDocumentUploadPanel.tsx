import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { useDocumentScanning } from '../../src/hooks/useDocumentScanning';
import { DocumentUploadLayout } from './DocumentUploadLayout';
import { Patient } from '../../src/types/patient';

interface ReceivedDocumentUploadPanelProps {
  currentPatient: Patient;
  documentTypes: string[];
  departments: string[];
  onUpload: (uploadData: {
    type: string;
    department: string;
    doctor: string;
    createdDate: Date;
    referralType?: string;
    referralHospital?: string;
    referralDepartment?: string;
    referralDoctor?: string;
    comment?: string;
  }) => void;
  onClose: () => void;
}

export function ReceivedDocumentUploadPanel({
  currentPatient,
  documentTypes,
  departments,
  onUpload,
  onClose
}: ReceivedDocumentUploadPanelProps) {
  const documentScanningProps = useDocumentScanning({ currentPatient, onUpload, onClose });

  const patientField = (
    <div>
      <Label htmlFor="patient" className="text-xs mb-1 block text-gray-600">
        患者
      </Label>
      <Input
        id="patient"
        type="text"
        value={`${currentPatient.name} (ID: ${currentPatient.id})`}
        disabled
        className="bg-gray-100 border-gray-300 h-9"
      />
    </div>
  );

  return (
    <DocumentUploadLayout
      {...documentScanningProps}
      documentTypes={documentTypes}
      departments={departments}
      patientField={patientField}
    />
  );
}
