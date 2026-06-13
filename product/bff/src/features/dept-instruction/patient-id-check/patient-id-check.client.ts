import { Injectable } from '@nestjs/common';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type {
  PostPatientIdCheckCompleteRequest,
  PostPatientConfirmReasonRequest,
} from './types/patient-id-check.api.request';
import type {
  UpstreamPatientIdCheckExpectations,
  UpstreamReasonTemplates,
  UpstreamStaffByBarcode,
  UpstreamPatientIdCheckComplete,
  UpstreamPatientConfirmReason,
} from './types/patient-id-check.type';

@Injectable()
export class PatientIdCheckClient {
  private headers(correlationId: string, tenantId: string, authHeader: string | undefined) {
    return {
      'X-Correlation-Id': correlationId,
      'X-Tenant-Id': tenantId,
      ...(authHeader && { Authorization: authHeader }),
    };
  }

  async fetchExpectations(
    orderId: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamPatientIdCheckExpectations> {
    const response = await axiosClient.get<UpstreamPatientIdCheckExpectations>(
      `/api/v1/dept-instructions/${orderId}/patient-id-check/expectations`,
      { headers: this.headers(correlationId, tenantId, authHeader) },
    );
    return response.data;
  }

  async fetchReasonTemplates(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamReasonTemplates> {
    const response = await axiosClient.get<UpstreamReasonTemplates>(
      '/api/v1/dept-instructions/patient-id-check/reason-templates',
      { headers: this.headers(correlationId, tenantId, authHeader) },
    );
    return response.data;
  }

  async fetchStaffByBarcode(
    barcode: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamStaffByBarcode> {
    const response = await axiosClient.get<UpstreamStaffByBarcode>(
      `/api/v1/dept-instructions/patient-id-check/staff/${barcode}`,
      { headers: this.headers(correlationId, tenantId, authHeader) },
    );
    return response.data;
  }

  async postComplete(
    orderId: string,
    body: Omit<PostPatientIdCheckCompleteRequest, 'orderId'>,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamPatientIdCheckComplete> {
    const response = await axiosClient.post<UpstreamPatientIdCheckComplete>(
      `/api/v1/dept-instructions/${orderId}/patient-id-check/complete`,
      body,
      { headers: this.headers(correlationId, tenantId, authHeader) },
    );
    return response.data;
  }

  async postConfirmReason(
    orderId: string,
    body: Omit<PostPatientConfirmReasonRequest, 'orderId'>,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamPatientConfirmReason> {
    const response = await axiosClient.post<UpstreamPatientConfirmReason>(
      `/api/v1/dept-instructions/${orderId}/patient-id-check/confirm-reason`,
      body,
      { headers: this.headers(correlationId, tenantId, authHeader) },
    );
    return response.data;
  }
}
