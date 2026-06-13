import { Injectable } from '@nestjs/common';
import type {
  PostMedicalRecordRequest,
  PutMedicalRecordRequest,
  PostCommentRequest,
  PutCommentRequest,
} from '@/front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/requests/recordInput.request';
import type {
  DraftItem,
  GetDraftListResponse,
  GetMedicalRecordResponse,
  PostMedicalRecordConfirmedResponse,
  PostMedicalRecordDraftResponse,
  PutMedicalRecordResponse,
  GetTemplatesResponse,
  GetCommentSelectionsResponse,
  PostCommentResponse,
  PutCommentResponse,
} from '@/front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';

const MOCK_TEMPLATES = [
  { id: 'tpl-1', name: '内科初診', content: 'S: \nO: \nA: \nP: ' },
  { id: 'tpl-2', name: '経過観察', content: 'S: 経過良好\nO: \nA: \nP: ' },
  { id: 'tpl-3', name: '退院サマリー', content: 'S: 退院可能\nO: \nA: \nP: ' },
];

const MOCK_COMMENTS = [
  { id: 'cmt-1', content: 'アレルギー歴あり', type: 'MY' as const },
  { id: 'cmt-2', content: '血圧管理中', type: 'MY' as const },
  { id: 'cmt-3', content: '服薬コンプライアンス良好', type: 'PATIENT' as const },
  { id: 'cmt-4', content: '処方時は腎機能に注意', type: 'PATIENT' as const },
  { id: 'cmt-5', content: '内科部門：抗菌薬は承認済みのもののみ使用', type: 'DEPT' as const },
];

const draftStore = new Map<string, DraftItem>();

@Injectable()
export class RecordInputService {
  getDrafts(patientId: string): GetDraftListResponse {
    void patientId;
    return { drafts: Array.from(draftStore.values()) };
  }

  postDraft(_patientId: string, body: PostMedicalRecordRequest): PostMedicalRecordDraftResponse {
    const id = `draft-${Date.now()}`;
    const savedAt = new Date().toISOString();
    const draft: DraftItem = { id, soapContent: body.soapContent, savedAt };
    draftStore.set(id, draft);
    return { id, status: 'DRAFT', soapContent: body.soapContent, savedAt };
  }

  deleteDraft(_patientId: string, draftId: string): void {
    draftStore.delete(draftId);
  }

  getMedicalRecord(patientId: string, recordId: string): GetMedicalRecordResponse {
    const now = new Date().toISOString();
    return {
      id: recordId,
      patientId,
      status: 'DRAFT',
      recordDate: now.split('T')[0] ?? '',
      recorderId: 'doc0',
      recorderName: '田中 一郎',
      soapContent: '',
      createdAt: now,
      updatedAt: now,
    };
  }

  postMedicalRecord(
    patientId: string,
    body: PostMedicalRecordRequest,
  ): PostMedicalRecordConfirmedResponse | PostMedicalRecordDraftResponse {
    void patientId;
    const now = new Date().toISOString();
    if (body.status === 'CONFIRMED') {
      return {
        id: `rec-${Date.now()}`,
        status: 'CONFIRMED',
        recordDate: body.recordDate,
        createdAt: now,
      };
    }
    return {
      id: `rec-${Date.now()}`,
      status: 'DRAFT',
      soapContent: body.soapContent,
      savedAt: now,
    };
  }

  putMedicalRecord(
    _patientId: string,
    recordId: string,
    _body: PutMedicalRecordRequest,
  ): PutMedicalRecordResponse {
    return {
      id: recordId,
      status: 'CONFIRMED',
      updatedAt: new Date().toISOString(),
    };
  }

  getTemplates(): GetTemplatesResponse {
    return { templates: MOCK_TEMPLATES };
  }

  getComments(type: 'MY' | 'PATIENT' | 'DEPT', _patientId: string): GetCommentSelectionsResponse {
    const filtered = MOCK_COMMENTS.filter((c) => c.type === type);
    return { myComments: filtered };
  }

  postComment(body: PostCommentRequest): PostCommentResponse {
    return {
      id: `cmt-${Date.now()}`,
      content: body.content,
      createdAt: new Date().toISOString(),
    };
  }

  putComment(commentId: string, body: PutCommentRequest): PutCommentResponse {
    return {
      id: commentId,
      content: body.content,
      updatedAt: new Date().toISOString(),
    };
  }

  deleteComment(_commentId: string): void {
    // モック: 何もしない
  }
}
