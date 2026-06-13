import { Patient } from '@/app/patient/_types/patient.type';

export const PatientInfo = ({ name, patientCode }: Pick<Patient, 'name' | 'patientCode'>) => (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500">コード: {patientCode}</span>
    <span className="text-lg font-bold">{name} <small className="font-normal">様</small></span>
  </div>
);