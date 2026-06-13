import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';

interface GetCommentsBody {
  type: 'MY' | 'PATIENT' | 'DEPT';
  patientId: string;
}
import { RecordInputService } from './record-input.service';
import type {
  PostMedicalRecordRequest,
  PutMedicalRecordRequest,
  PostCommentRequest,
  PutCommentRequest,
} from '@/front_bff_shared/features/diagnosis/diagnosisRecord/recordInput/types/requests/recordInput.request';
import type {
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

@Controller('')
export class RecordInputController {
  constructor(@Inject(RecordInputService) private readonly service: RecordInputService) {}

  /** GET /bff/records/:patientId/soap/drafts */
  @Get('records/:patientId/soap/drafts')
  async getDrafts(
    @Param('patientId') patientId: string,
  ): Promise<GetDraftListResponse> {
    return this.service.getDrafts(patientId);
  }

  /** POST /bff/records/:patientId/soap/draft */
  @Post('records/:patientId/soap/draft')
  async postDraft(
    @Param('patientId') patientId: string,
    @Body() body: PostMedicalRecordRequest,
  ): Promise<PostMedicalRecordDraftResponse> {
    return this.service.postDraft(patientId, body);
  }

  /** DELETE /bff/records/:patientId/soap/draft/:draftId */
  @Delete('records/:patientId/soap/draft/:draftId')
  @HttpCode(204)
  async deleteDraft(
    @Param('patientId') patientId: string,
    @Param('draftId') draftId: string,
  ): Promise<void> {
    return this.service.deleteDraft(patientId, draftId);
  }

  /** GET /bff/records/:patientId/soap/:recordId */
  @Get('records/:patientId/soap/:recordId')
  async getMedicalRecord(
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
  ): Promise<GetMedicalRecordResponse> {
    return this.service.getMedicalRecord(patientId, recordId);
  }

  /** POST /bff/records/:patientId/soap */
  @Post('records/:patientId/soap')
  async postMedicalRecord(
    @Param('patientId') patientId: string,
    @Body() body: PostMedicalRecordRequest,
  ): Promise<PostMedicalRecordConfirmedResponse | PostMedicalRecordDraftResponse> {
    return this.service.postMedicalRecord(patientId, body);
  }

  /** PUT /bff/records/:patientId/soap/:recordId */
  @Put('records/:patientId/soap/:recordId')
  async putMedicalRecord(
    @Param('patientId') patientId: string,
    @Param('recordId') recordId: string,
    @Body() body: PutMedicalRecordRequest,
  ): Promise<PutMedicalRecordResponse> {
    return this.service.putMedicalRecord(patientId, recordId, body);
  }

  /** GET /bff/templates/soap */
  @Get('templates/soap')
  async getTemplates(): Promise<GetTemplatesResponse> {
    return this.service.getTemplates();
  }

  /** POST /bff/comments */
  @Post('comments')
  async getComments(
    @Body() body: GetCommentsBody,
  ): Promise<GetCommentSelectionsResponse> {
    return this.service.getComments(body.type, body.patientId);
  }

  /** POST /bff/comments/my */
  @Post('comments/my')
  async postComment(
    @Body() body: PostCommentRequest,
  ): Promise<PostCommentResponse> {
    return this.service.postComment(body);
  }

  /** PUT /bff/comments/my/:commentId */
  @Put('comments/my/:commentId')
  async putComment(
    @Param('commentId') commentId: string,
    @Body() body: PutCommentRequest,
  ): Promise<PutCommentResponse> {
    return this.service.putComment(commentId, body);
  }

  /** DELETE /bff/comments/my/:commentId */
  @Delete('comments/my/:commentId')
  @HttpCode(204)
  async deleteComment(
    @Param('commentId') commentId: string,
  ): Promise<void> {
    return this.service.deleteComment(commentId);
  }
}
