import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PatientIdCheckService } from './patient-id-check.service';
import type {
  PostPatientIdCheckCompleteRequest,
  PostPatientConfirmReasonRequest,
} from './types/patient-id-check.api.request';
import type {
  GetPatientIdCheckExpectationsResponse,
  GetReasonTemplatesResponse,
  GetStaffByBarcodeResponse,
  PostPatientIdCheckCompleteResponse,
  PostPatientConfirmReasonResponse,
} from './types/patient-id-check.api.response';

@Controller('dept-instructions')
export class PatientIdCheckController {
  constructor(
    @Inject(PatientIdCheckService)
    private readonly service: PatientIdCheckService,
  ) {}

  /** GET /bff/deptInstructions/:orderId/patientIdCheck/expectations */
  @Get(':orderId/patient-id-check/expectations')
  async getExpectations(
    @Param('orderId') orderId: string,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<GetPatientIdCheckExpectationsResponse> {
    return this.service.getExpectations(
      orderId,
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** GET /bff/deptInstructions/patientIdCheck/reasonTemplates */
  @Get('patient-id-check/reason-templates')
  async getReasonTemplates(
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<GetReasonTemplatesResponse> {
    return this.service.getReasonTemplates(
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** GET /bff/deptInstructions/patientIdCheck/staff/:barcode */
  @Get('patient-id-check/staff/:barcode')
  async getStaffByBarcode(
    @Param('barcode') barcode: string,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<GetStaffByBarcodeResponse> {
    return this.service.getStaffByBarcode(
      barcode,
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** POST /bff/deptInstructions/:orderId/patientIdCheck/complete */
  @Post(':orderId/patient-id-check/complete')
  @HttpCode(HttpStatus.OK)
  async postComplete(
    @Param('orderId') orderId: string,
    @Body() body: Omit<PostPatientIdCheckCompleteRequest, 'orderId'>,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<PostPatientIdCheckCompleteResponse> {
    return this.service.postComplete(
      { orderId, ...body },
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** POST /bff/deptInstructions/:orderId/patientIdCheck/confirmReason */
  @Post(':orderId/patient-id-check/confirm-reason')
  @HttpCode(HttpStatus.OK)
  async postConfirmReason(
    @Param('orderId') orderId: string,
    @Body() body: Omit<PostPatientConfirmReasonRequest, 'orderId'>,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<PostPatientConfirmReasonResponse> {
    return this.service.postConfirmReason(
      { orderId, ...body },
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }
}
