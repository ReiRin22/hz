import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ClinicalRecordsService } from "./clinical-records.service";
import type { CreateClinicalRecordRequest } from "./types/clinical-records.api.request";
import type {
  GetClinicalRecordResponse,
  CreateClinicalRecordResponse,
  GetSOAPTemplatesResponse,
  GetCommentsResponse,
  GetClinicalRecordsResponse,
} from "./types/clinical-records.api.response";

@Controller("patients/:patientId")
export class ClinicalRecordsController {
  constructor(@Inject(ClinicalRecordsService) private readonly clinicalRecordsService: ClinicalRecordsService) {}

  /** GET /bff/patients/:patientId/clinicalRecords */
  @Get("clinical-records")
  async getClinicalRecords(
    @Param("patientId") patientId: string,
  ): Promise<GetClinicalRecordsResponse> {
    return this.clinicalRecordsService.getRecords(patientId);
  }

  /** GET /bff/patients/:patientId/clinicalRecords/:recordId */
  @Get("clinical-records/:recordId")
  async getClinicalRecord(
    @Param("patientId") patientId: string,
    @Param("recordId") recordId: string,
  ): Promise<GetClinicalRecordResponse> {
    return this.clinicalRecordsService.getRecord(patientId, recordId);
  }

  /** POST /bff/patients/:patientId/clinicalRecords */
  @Post("clinical-records")
  async createClinicalRecord(
    @Param("patientId") patientId: string,
    @Body() body: CreateClinicalRecordRequest,
  ): Promise<CreateClinicalRecordResponse> {
    return this.clinicalRecordsService.createRecord(patientId, body);
  }

  /** GET /bff/patients/:patientId/soapTemplates */
  @Get("soap-templates")
  async getSOAPTemplates(
    @Param("patientId") patientId: string,
  ): Promise<GetSOAPTemplatesResponse> {
    return this.clinicalRecordsService.getSOAPTemplates(patientId);
  }

  /** GET /bff/patients/:patientId/comments */
  @Get("comments")
  async getComments(
    @Param("patientId") patientId: string,
  ): Promise<GetCommentsResponse> {
    return this.clinicalRecordsService.getComments(patientId);
  }
}
