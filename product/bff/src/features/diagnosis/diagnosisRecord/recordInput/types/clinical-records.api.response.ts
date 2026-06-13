export interface ClinicalRecordResponse {
  id: string;
  patientId: string;
  recordDate: string;
  recordedBy: string;
  recordedByName: string;
  soapRecord: string;
  isConfirmed: boolean;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetClinicalRecordResponse {
  record: ClinicalRecordResponse;
}

export interface CreateClinicalRecordResponse {
  record: ClinicalRecordResponse;
}

export interface SOAPTemplateResponse {
  id: string;
  name: string;
  content: string;
}

export interface GetSOAPTemplatesResponse {
  templates: SOAPTemplateResponse[];
}

export interface CommentResponse {
  id: string;
  content: string;
}

export interface GetCommentsResponse {
  myComments: CommentResponse[];
  patientComments: CommentResponse[];
  departmentComments: CommentResponse[];
}

export type {
  MedicalRecordResponse,
  GetClinicalRecordsResponse,
} from "../../../../../../../front_bff_shared/features/karte/recordReference/types/responses/record-reference.response";
