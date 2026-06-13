import { Label } from '@/shared/components/atoms/label';
import { PatientSelector, type Patient } from '../patient/PatientSelector';
import { samplePatients } from '../../src/data/sampleData';
import { useDocumentScanning } from '../../src/hooks/useDocumentScanning';
import { DocumentUploadLayout } from './DocumentUploadLayout';

interface StandaloneDocumentUploadPanelProps {
  documentTypes: string[];
  departments: string[];
  onUpload: (uploadData: {
    patientId: string;
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

export function StandaloneDocumentUploadPanel({
  documentTypes,
  departments,
  onUpload,
  onClose
}: StandaloneDocumentUploadPanelProps) {
  const documentScanningProps = useDocumentScanning({ onUpload, onClose });

  const patientField = documentScanningProps.selectedDoc ? (
    <PatientFieldForStandalone 
      selectedDoc={documentScanningProps.selectedDoc} 
      onUpdate={documentScanningProps.updateSelectedDocument} 
    />
  ) : null;

  return (
    <DocumentUploadLayout
      {...documentScanningProps}
      documentTypes={documentTypes}
      departments={departments}
      patientField={patientField}
    />
  );
}

function PatientFieldForStandalone({ selectedDoc, onUpdate }: { 
  selectedDoc: any, 
  onUpdate: (field: string, value: any) => void 
}) {
  const selectedPatient: Patient | null = selectedDoc.patientId 
    ? samplePatients.find(p => p.id === selectedDoc.patientId) || { 
        id: selectedDoc.patientId, 
        name: selectedDoc.patientName, 
        kana: '', 
        birthDate: '', 
        gender: '' 
      }
    : null;

  const handleSelectPatient = (patient: Patient | null) => {
    if (patient) {
      onUpdate('patientId', patient.id);
      onUpdate('patientName', patient.name);
    } else {
      // 患者クリア
      onUpdate('patientId', '');
      onUpdate('patientName', '');
    }
  };

  return (
    <div>
      <Label htmlFor="patient" className="text-xs mb-1 block text-gray-600">
        患者 <span className="text-red-500">*</span>
      </Label>
      <div className="relative">
        <PatientSelector
          selectedPatient={selectedPatient}
          onSelectPatient={handleSelectPatient}
          disabled={selectedDoc.registered}
          patients={samplePatients}
        />
      </div>
    </div>
  );
}