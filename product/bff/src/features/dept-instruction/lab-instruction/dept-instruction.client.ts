import { Injectable } from '@nestjs/common';
import { axiosClient } from '@shared/plugins/bffAxiosClient';
import type {
  GetDeptInstructionsRequest,
  UpdateDeptInstructionStatusRequest,
  PostThreePointCheckRequest,
  PostImplementerRequest,
  PostBillingLinkRequest,
} from './types/dept-instruction.api.request';
import type {
  UpstreamGetDeptInstructionsResponse,
  UpstreamUpdateStatusResponse,
  UpstreamThreePointCheckResponse,
  UpstreamImplementerResponse,
  UpstreamBillingLinkResponse,
} from './types/dept-instruction.type';

@Injectable()
export class DeptInstructionClient {
  async fetchDeptInstructions(
    params: GetDeptInstructionsRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamGetDeptInstructionsResponse> {
    const response = await axiosClient.post<UpstreamGetDeptInstructionsResponse>(
      '/api/v1/dept-instructions',
      params,
      {
        headers: {
          'X-Correlation-Id': correlationId,
          'X-Tenant-Id': tenantId,
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );
    return response.data;
  }

  async updateStatus(
    orderId: string,
    body: Omit<UpdateDeptInstructionStatusRequest, 'orderId'>,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamUpdateStatusResponse> {
    const response = await axiosClient.patch<UpstreamUpdateStatusResponse>(
      `/api/v1/dept-instructions/${orderId}/status`,
      {
        newStatus: body.newStatus,
        updatedBy: body.updatedBy,
        timestamp: body.timestamp,
      },
      {
        headers: {
          'X-Correlation-Id': correlationId,
          'X-Tenant-Id': tenantId,
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );
    return response.data;
  }

  async postThreePointCheck(
    orderId: string,
    body: Omit<PostThreePointCheckRequest, 'orderId'>,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamThreePointCheckResponse> {
    const response = await axiosClient.post<UpstreamThreePointCheckResponse>(
      `/api/v1/dept-instructions/${orderId}/three-point-check`,
      {
        patientConfirmed: body.patientConfirmed,
        orderConfirmed: body.orderConfirmed,
        allergyConfirmed: body.allergyConfirmed,
        checkedBy: body.checkedBy,
        timestamp: body.timestamp,
      },
      {
        headers: {
          'X-Correlation-Id': correlationId,
          'X-Tenant-Id': tenantId,
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );
    return response.data;
  }

  async postImplementer(
    orderId: string,
    body: Omit<PostImplementerRequest, 'orderId'>,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamImplementerResponse> {
    const response = await axiosClient.post<UpstreamImplementerResponse>(
      `/api/v1/dept-instructions/${orderId}/implementer`,
      {
        implementer: body.implementer,
        implementedAt: body.implementedAt,
        ...(body.witness !== undefined && { witness: body.witness }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.reason !== undefined && { reason: body.reason }),
      },
      {
        headers: {
          'X-Correlation-Id': correlationId,
          'X-Tenant-Id': tenantId,
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );
    return response.data;
  }

  async postBillingLink(
    orderId: string,
    body: Omit<PostBillingLinkRequest, 'orderId'>,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamBillingLinkResponse> {
    const response = await axiosClient.post<UpstreamBillingLinkResponse>(
      `/api/v1/dept-instructions/${orderId}/billing-link`,
      {
        triggerStatus: body.triggerStatus,
        timestamp: body.timestamp,
      },
      {
        headers: {
          'X-Correlation-Id': correlationId,
          'X-Tenant-Id': tenantId,
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    );
    return response.data;
  }
}
