import { getMedicalRecord } from '../api/getMedicalRecord.api';
import { postMedicalRecord } from '../api/postMedicalRecord.api';
import { putMedicalRecord } from '../api/putMedicalRecord.api';
import { getDrafts } from '../api/getDrafts.api';
import { postDraft } from '../api/postDraft.api';
import { deleteDraft } from '../api/deleteDraft.api';
import { getComments } from '../api/getComments.api';
import { postComment } from '../api/postComment.api';
import { putComment } from '../api/putComment.api';
import { deleteComment } from '../api/deleteComment.api';
import { getTemplates } from '../api/getTemplates.api';
import type { GetMedicalRecordResponse } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';
import type {
  PostMedicalRecordConfirmedResponse,
  PostMedicalRecordDraftResponse,
  PutMedicalRecordResponse,
  GetDraftListResponse,
  GetCommentSelectionsResponse,
  PostCommentResponse,
  PutCommentResponse,
  GetTemplatesResponse,
} from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/responses/recordInput.response';
import type { PostMedicalRecordRequest } from '@front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/requests/recordInput.request';

/** EVT_INIT_EDIT: 修正モードの初期表示（既存記録取得） */
export async function fetchExistingRecord(params: {
  patientId: string;
  recordId: string;
}): Promise<GetMedicalRecordResponse> {
  return getMedicalRecord(params);
}

/** EVT_LOAD_DRAFTS: 下書き一覧取得 */
export async function fetchDrafts(params: {
  patientId: string;
}): Promise<GetDraftListResponse> {
  return getDrafts(params);
}

/** EVT_CONFIRM_RECORD: 確定（新規=POST / 修正=PUT） */
export async function confirmRecord(params: {
  patientId: string;
  recordId?: string;
  body: PostMedicalRecordRequest;
  correlationId: string;
}): Promise<PostMedicalRecordConfirmedResponse | PutMedicalRecordResponse> {
  if (params.recordId) {
    return putMedicalRecord(
      params.patientId,
      params.recordId,
      {
        recordDate: params.body.recordDate,
        recorderId: params.body.recorderId,
        soapContent: params.body.soapContent,
      },
      params.correlationId
    );
  }
  return postMedicalRecord(params.patientId, params.body, params.correlationId);
}

/** EVT_SAVE_DRAFT: 下書き保存 */
export async function saveDraft(params: {
  patientId: string;
  body: PostMedicalRecordRequest;
}): Promise<PostMedicalRecordDraftResponse> {
  return postDraft(params.patientId, params.body);
}

/** EVT_DELETE_DRAFT: 下書き削除 */
export async function removeDraft(params: {
  patientId: string;
  draftId: string;
}): Promise<void> {
  return deleteDraft(params);
}

/** EVT_LOAD_COMMENTS: コメント一覧取得（タブ切替時も再取得） */
export async function fetchComments(params: {
  type: 'MY' | 'PATIENT' | 'DEPT';
  patientId: string;
}): Promise<GetCommentSelectionsResponse> {
  return getComments(params);
}

/** EVT_SAVE_MY_COMMENT: Myコメント保存（新規=POST / 更新=PUT） */
export async function saveMyComment(params: {
  commentId?: string;
  content: string;
}): Promise<PostCommentResponse | PutCommentResponse> {
  if (params.commentId) {
    return putComment(params.commentId, { content: params.content });
  }
  return postComment({ content: params.content });
}

/** EVT_DELETE_MY_COMMENT: Myコメント削除 */
export async function removeMyComment(commentId: string): Promise<void> {
  return deleteComment(commentId);
}

/** テンプレート一覧取得 */
export async function fetchTemplates(): Promise<GetTemplatesResponse> {
  return getTemplates();
}
