/** POST /bff/patients/{patientId}/medicalRecords */
export interface PostMedicalRecordRequest {
  /** 記録種別: CONFIRMED=確定 / DRAFT=下書き */
  status: 'CONFIRMED' | 'DRAFT';
  /** 記載日（YYYY-MM-DD） */
  recordDate: string;
  /** 記載者 ID */
  recorderId: string;
  /** SOAP 記録本文 */
  soapContent: string;
  /** 受付 ID */
  receptionId: string;
}

/** PUT /bff/patients/{patientId}/medicalRecords/{recordId} */
export interface PutMedicalRecordRequest {
  /** 記載日（YYYY-MM-DD） */
  recordDate: string;
  /** 記載者 ID */
  recorderId: string;
  /** SOAP 記録本文 */
  soapContent: string;
}

/** POST /bff/comments */
export interface PostCommentRequest {
  /** コメント内容（最大 200 文字） */
  content: string;
}

/** PUT /bff/comments/{commentId} */
export interface PutCommentRequest {
  /** コメント内容（最大 200 文字） */
  content: string;
}
