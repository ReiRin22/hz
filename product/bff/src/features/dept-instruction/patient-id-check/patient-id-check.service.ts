import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { PatientIdCheckClient } from './patient-id-check.client';
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

@Injectable()
export class PatientIdCheckService {
  constructor(
    @Inject(PatientIdCheckClient)
    private readonly client: PatientIdCheckClient,
  ) {}

  // NOTE: Upstream 型と front_bff_shared レスポンス型は現状同一構造のためマッピング不要。
  //       BE レスポンス構造変更時はここに mapper 関数を追加すること。
  async getExpectations(
    orderId: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetPatientIdCheckExpectationsResponse> {
    try {
      return await this.client.fetchExpectations(orderId, correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getReasonTemplates(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetReasonTemplatesResponse> {
    try {
      return await this.client.fetchReasonTemplates(correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStaffByBarcode(
    barcode: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetStaffByBarcodeResponse> {
    try {
      return await this.client.fetchStaffByBarcode(barcode, correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postComplete(
    body: PostPatientIdCheckCompleteRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<PostPatientIdCheckCompleteResponse> {
    try {
      const { orderId, ...rest } = body;
      return await this.client.postComplete(orderId, rest, correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postConfirmReason(
    body: PostPatientConfirmReasonRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<PostPatientConfirmReasonResponse> {
    try {
      const { orderId, ...rest } = body;
      return await this.client.postConfirmReason(orderId, rest, correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
