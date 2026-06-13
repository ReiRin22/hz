import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { DeptInstructionClient } from './dept-instruction.client';
import type {
  GetDeptInstructionsRequest,
  UpdateDeptInstructionStatusRequest,
  PostThreePointCheckRequest,
  PostImplementerRequest,
  PostBillingLinkRequest,
} from './types/dept-instruction.api.request';
import type {
  GetDeptInstructionsResponse,
  DeptInstructionOrderResponse,
  DeptInstructionStatusHistoryResponse,
  UpdateDeptInstructionStatusResponse,
  PostThreePointCheckResponse,
  PostImplementerResponse,
  PostBillingLinkResponse,
} from './types/dept-instruction.api.response';
import type {
  UpstreamDeptInstructionOrder,
  UpstreamDeptInstructionStatusHistory,
} from './types/dept-instruction.type';

@Injectable()
export class DeptInstructionService {
  constructor(
    @Inject(DeptInstructionClient)
    private readonly client: DeptInstructionClient,
  ) {}

  async getDeptInstructions(
    params: GetDeptInstructionsRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetDeptInstructionsResponse> {
    try {
      const upstream = await this.client.fetchDeptInstructions(params, correlationId, tenantId, authHeader);
      return {
        orders: upstream.orders.map((o) => this.transformOrder(o)),
        total: upstream.total,
        page: upstream.page,
        pageSize: upstream.pageSize,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStatus(
    body: UpdateDeptInstructionStatusRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpdateDeptInstructionStatusResponse> {
    try {
      const { orderId, ...rest } = body;
      const upstream = await this.client.updateStatus(orderId, rest, correlationId, tenantId, authHeader);
      return {
        orderId: upstream.orderId,
        newStatus: upstream.newStatus,
        updatedAt: upstream.updatedAt,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postThreePointCheck(
    body: PostThreePointCheckRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<PostThreePointCheckResponse> {
    try {
      const { orderId, ...rest } = body;
      const upstream = await this.client.postThreePointCheck(orderId, rest, correlationId, tenantId, authHeader);
      return {
        orderId: upstream.orderId,
        checkedAt: upstream.checkedAt,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postImplementer(
    body: PostImplementerRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<PostImplementerResponse> {
    try {
      const { orderId, ...rest } = body;
      const upstream = await this.client.postImplementer(orderId, rest, correlationId, tenantId, authHeader);
      return {
        orderId: upstream.orderId,
        implementedAt: upstream.implementedAt,
        newStatus: upstream.newStatus,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postBillingLink(
    body: PostBillingLinkRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<PostBillingLinkResponse> {
    try {
      const { orderId, ...rest } = body;
      const upstream = await this.client.postBillingLink(orderId, rest, correlationId, tenantId, authHeader);
      return {
        orderId: upstream.orderId,
        billingLinkedAt: upstream.billingLinkedAt,
        success: upstream.success,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private transformOrder(upstream: UpstreamDeptInstructionOrder): DeptInstructionOrderResponse {
    return {
      id: upstream.id,
      status: upstream.status,
      patientId: upstream.patientId,
      patientName: upstream.patientName,
      patientKana: upstream.patientKana,
      gender: upstream.gender,
      birthDate: upstream.birthDate,
      age: upstream.age,
      orderType: upstream.orderType,
      content: upstream.content,
      hasAllergies: upstream.hasAllergies,
      location: upstream.location,
      department: upstream.department,
      ...(upstream.attendingDoctor !== undefined && { attendingDoctor: upstream.attendingDoctor }),
      ...(upstream.ward !== undefined && { ward: upstream.ward }),
      ...(upstream.roomNumber !== undefined && { roomNumber: upstream.roomNumber }),
      ...(upstream.procedureType !== undefined && { procedureType: upstream.procedureType }),
      receivedAt: upstream.receivedAt,
      ...(upstream.acceptedAt !== undefined && { acceptedAt: upstream.acceptedAt }),
      ...(upstream.implementedAt !== undefined && { implementedAt: upstream.implementedAt }),
      ...(upstream.acceptedBy !== undefined && { acceptedBy: upstream.acceptedBy }),
      ...(upstream.implementedBy !== undefined && { implementedBy: upstream.implementedBy }),
      ...(upstream.implementationNotes !== undefined && { implementationNotes: upstream.implementationNotes }),
      ...(upstream.scheduledTime !== undefined && { scheduledTime: upstream.scheduledTime }),
      ...(upstream.materialRecorded !== undefined && { materialRecorded: upstream.materialRecorded }),
      ...(upstream.labTestLocation !== undefined && { labTestLocation: upstream.labTestLocation }),
      ...(upstream.imageTestType !== undefined && { imageTestType: upstream.imageTestType }),
      ...(upstream.physiologicalTestType !== undefined && { physiologicalTestType: upstream.physiologicalTestType }),
      ...(upstream.examinationType !== undefined && { examinationType: upstream.examinationType }),
      ...(upstream.statusHistory != null && {
        statusHistory: upstream.statusHistory.map((h) => this.transformStatusHistory(h)),
      }),
    };
  }

  private transformStatusHistory(upstream: UpstreamDeptInstructionStatusHistory): DeptInstructionStatusHistoryResponse {
    return {
      status: upstream.status,
      timestamp: upstream.timestamp,
      updatedBy: upstream.updatedBy,
    };
  }
}
