/** GET /bff/patients/{patientId}/medicalRecords/{recordId} */
export interface GetMedicalRecordResponse {
  id: string;
  patientId: string;
  status: 'CONFIRMED' | 'DRAFT';
  recordDate: string;
  recorderId: string;
  recorderName: string;
  soapContent: string;
  createdAt: string;
  updatedAt: string;
}

/** POST /bff/patients/{patientId}/medicalRecords (CONFIRMED) */
export interface PostMedicalRecordConfirmedResponse {
  id: string;
  status: 'CONFIRMED';
  recordDate: string;
  createdAt: string;
}

/** POST /bff/patients/{patientId}/medicalRecords (DRAFT) */
export interface PostMedicalRecordDraftResponse {
  id: string;
  status: 'DRAFT';
  soapContent: string;
  savedAt: string;
}

/** PUT /bff/patients/{patientId}/medicalRecords/{recordId} */
export interface PutMedicalRecordResponse {
  id: string;
  status: 'CONFIRMED';
  updatedAt: string;
}

/** GET /bff/patients/{patientId}/medicalRecords?status=DRAFT */
export interface DraftItem {
  id: string;
  soapContent: string;
  savedAt: string;
}

export interface GetDraftListResponse {
  drafts: DraftItem[];
}

/** GET /bff/templates */
export interface TemplateItem {
  id: string;
  name: string;
  content: string;
}

export interface GetTemplatesResponse {
  templates: TemplateItem[];
}

/** GET /bff/users */
export interface UserItem {
  id: string;
  name: string;
  role: string;
}

export interface GetUsersResponse {
  users: UserItem[];
}

/** GET /bff/commentSelections?patientId={patientId}&deptId={deptId} */
export interface CommentItem {
  id: string;
  content: string;
  type: 'MY' | 'PATIENT' | 'DEPT';
}

export interface GetCommentSelectionsResponse {
  myComments: CommentItem[];
}

/** POST /bff/comments */
export interface PostCommentResponse {
  id: string;
  content: string;
  createdAt: string;
}

/** PUT /bff/comments/{commentId} */
export interface PutCommentResponse {
  id: string;
  content: string;
  updatedAt: string;
}
