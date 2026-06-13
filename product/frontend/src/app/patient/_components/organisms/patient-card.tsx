import { Patient } from '@/app/patient/_types/patient.type';
import { PatientInfo } from '../molecules/patient-info';
import { FileUploader } from '../molecules/file-uploader';

interface Props {
  patient: Patient;
  onImageUpload: (file: File) => void; // IDは親(Page)が知っているのでここでは不要にできる
}

export const PatientCard = ({ patient, onImageUpload }: Props) => {
  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl shadow-lg bg-white flex flex-col items-center gap-6">
      {/* 写真セクション */}
      <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-blue-50">
        {patient.fullImagePath ? (
          <img src={patient.fullImagePath} alt={patient.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>

      {/* 情報セクション */}
      <div className="text-center">
        <PatientInfo name={patient.name} patientCode={patient.patientCode} />
      </div>
      
      {/* 操作セクション */}
      <div className="w-full pt-6 border-t border-gray-100">
        <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
          写真を更新する
        </label>
        <FileUploader onUpload={onImageUpload} />
      </div>
    </div>
  );
};