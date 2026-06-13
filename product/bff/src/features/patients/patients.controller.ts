import { Controller, Get, Inject, Param } from "@nestjs/common";
import { PatientsService } from "./patients.service";
import type { PatientResponse, GetPatientInfoResponse, GetPatientHeaderResponse } from "./types/patients.api.response";

@Controller("patients")
export class PatientsController {
  constructor(@Inject(PatientsService) private readonly patientsService: PatientsService) {}

  /** GET /bff/patients/:patientId */
  @Get(":patientId")
  async getPatient(@Param("patientId") patientId: string): Promise<PatientResponse> {
    return this.patientsService.getPatient(patientId);
  }

  /** GET /bff/patients/:patientId/patientInfo */
  @Get(":patientId/patient-info")
  async getPatientInfo(@Param("patientId") patientId: string): Promise<GetPatientInfoResponse> {
    return this.patientsService.getPatientInfo(patientId);
  }

  /** GET /bff/patients/:patientId/header */
  @Get(":patientId/header")
  async getPatientHeader(@Param("patientId") patientId: string): Promise<GetPatientHeaderResponse> {
    return this.patientsService.getPatientHeader(patientId);
  }
}
