export interface CreateClinicalRecordRequest {
  recordDate: string;
  recorderId: string;
  recordedBy: string;
  soapRecord: string;
  isConfirmed: boolean;
}
