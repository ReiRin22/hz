import { Injectable, Inject } from "@nestjs/common";
import { ClinicalRecordsClient } from "./clinical-records.client";
import type { UpstreamClinicalRecord, UpstreamSOAPTemplate, UpstreamComment, UpstreamMedicalRecord } from "./types/clinical-records.type";
import type {
  ClinicalRecordResponse,
  GetClinicalRecordResponse,
  CreateClinicalRecordResponse,
  SOAPTemplateResponse,
  GetSOAPTemplatesResponse,
  CommentResponse,
  GetCommentsResponse,
  MedicalRecordResponse,
  GetClinicalRecordsResponse,
} from "./types/clinical-records.api.response";
import type { CreateClinicalRecordRequest } from "./types/clinical-records.api.request";

@Injectable()
export class ClinicalRecordsService {
  constructor(@Inject(ClinicalRecordsClient) private readonly clinicalRecordsClient: ClinicalRecordsClient) {}

  async getRecord(patientId: string, recordId: string): Promise<GetClinicalRecordResponse> {
    const upstream = await this.clinicalRecordsClient.fetchRecord(patientId, recordId);
    return { record: this.transformRecord(upstream) };
  }

  async createRecord(
    patientId: string,
    body: CreateClinicalRecordRequest,
  ): Promise<CreateClinicalRecordResponse> {
    const upstream = await this.clinicalRecordsClient.createRecord(patientId, body);
    return { record: this.transformRecord(upstream) };
  }

  async getSOAPTemplates(patientId: string): Promise<GetSOAPTemplatesResponse> {
    const upstream = await this.clinicalRecordsClient.fetchSOAPTemplates(patientId);
    return { templates: upstream.map((t) => this.transformTemplate(t)) };
  }

  async getComments(patientId: string): Promise<GetCommentsResponse> {
    const upstream = await this.clinicalRecordsClient.fetchComments(patientId);

    const myComments: CommentResponse[] = [];
    const patientComments: CommentResponse[] = [];
    const departmentComments: CommentResponse[] = [];

    for (const c of upstream) {
      const comment = this.transformComment(c);
      if (c.commentType === "MY") myComments.push(comment);
      else if (c.commentType === "PATIENT") patientComments.push(comment);
      else departmentComments.push(comment);
    }

    return { myComments, patientComments, departmentComments };
  }

  async getRecords(patientId: string): Promise<GetClinicalRecordsResponse> {
    const upstream = await this.clinicalRecordsClient.fetchRecords(patientId);
    return { records: upstream.map((r) => this.transformMedicalRecord(r)) };
  }

  private transformRecord(upstream: UpstreamClinicalRecord): ClinicalRecordResponse {
    return {
      id: upstream.recordId,
      patientId: upstream.patientId,
      recordDate: upstream.recordDate,
      recordedBy: upstream.recordedBy,
      recordedByName: upstream.recordedByName,
      soapRecord: upstream.soapRecord,
      isConfirmed: upstream.isConfirmed,
      ...(upstream.confirmedAt !== undefined && { confirmedAt: upstream.confirmedAt }),
      createdAt: upstream.createdAt,
      updatedAt: upstream.updatedAt,
    };
  }

  private transformTemplate(upstream: UpstreamSOAPTemplate): SOAPTemplateResponse {
    return {
      id: upstream.templateId,
      name: upstream.templateName,
      content: upstream.templateContent,
    };
  }

  private transformComment(upstream: UpstreamComment): CommentResponse {
    return {
      id: upstream.commentId,
      content: upstream.commentContent,
    };
  }

  private transformMedicalRecord(upstream: UpstreamMedicalRecord): MedicalRecordResponse {
    // NOTE: UpstreamMedicalRecord と MedicalRecordResponse は現時点で同一構造。
    // 上流 API 実装後にフィールド名が diverge した場合に備えて明示的にマッピングする。
    return {
      id: upstream.id,
      date: upstream.date,
      time: upstream.time,
      type: upstream.type,
      content: upstream.content,
      author: upstream.author,
      ...(upstream.visitType !== undefined && { visitType: upstream.visitType }),
      ...(upstream.hospitalizationId !== undefined && { hospitalizationId: upstream.hospitalizationId }),
      ...(upstream.insurance !== undefined && { insurance: upstream.insurance }),
      ...(upstream.soapRecord !== undefined && { soapRecord: upstream.soapRecord }),
      ...(upstream.schema !== undefined && { schema: upstream.schema }),
      ...(upstream.vitalSigns !== undefined && { vitalSigns: upstream.vitalSigns }),
    };
  }
}
