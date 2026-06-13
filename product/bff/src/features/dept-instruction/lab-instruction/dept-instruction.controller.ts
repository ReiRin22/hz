import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DeptInstructionService } from './dept-instruction.service';
import type { GetDeptInstructionsRequest } from './types/dept-instruction.api.request';
import type {
  GetDeptInstructionsResponse,
  UpdateDeptInstructionStatusResponse,
  PostThreePointCheckResponse,
  PostImplementerResponse,
  PostBillingLinkResponse,
} from './types/dept-instruction.api.response';
import type {
  UpdateDeptInstructionStatusRequest,
  PostThreePointCheckRequest,
  PostImplementerRequest,
  PostBillingLinkRequest,
} from './types/dept-instruction.api.request';

@Controller('dept-instructions')
export class DeptInstructionController {
  constructor(
    @Inject(DeptInstructionService)
    private readonly service: DeptInstructionService,
  ) {}

  /** POST /bff/deptInstructions */
  @Post()
  async getDeptInstructions(
    @Body() body: GetDeptInstructionsRequest,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<GetDeptInstructionsResponse> {
    return this.service.getDeptInstructions(
      body,
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** PATCH /bff/deptInstructions/:orderId/status */
  @Patch(':orderId/status')
  async updateStatus(
    @Param('orderId') orderId: string,
    @Body() body: Omit<UpdateDeptInstructionStatusRequest, 'orderId'>,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<UpdateDeptInstructionStatusResponse> {
    return this.service.updateStatus(
      { orderId, ...body },
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** POST /bff/deptInstructions/:orderId/threePointCheck */
  @Post(':orderId/three-point-check')
  @HttpCode(HttpStatus.OK)
  async postThreePointCheck(
    @Param('orderId') orderId: string,
    @Body() body: Omit<PostThreePointCheckRequest, 'orderId'>,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<PostThreePointCheckResponse> {
    return this.service.postThreePointCheck(
      { orderId, ...body },
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** POST /bff/deptInstructions/:orderId/implementer */
  @Post(':orderId/implementer')
  @HttpCode(HttpStatus.OK)
  async postImplementer(
    @Param('orderId') orderId: string,
    @Body() body: Omit<PostImplementerRequest, 'orderId'>,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<PostImplementerResponse> {
    return this.service.postImplementer(
      { orderId, ...body },
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }

  /** POST /bff/deptInstructions/:orderId/billingLink */
  @Post(':orderId/billing-link')
  @HttpCode(HttpStatus.OK)
  async postBillingLink(
    @Param('orderId') orderId: string,
    @Body() body: Omit<PostBillingLinkRequest, 'orderId'>,
    @Headers('x-correlation-id') correlationId?: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<PostBillingLinkResponse> {
    return this.service.postBillingLink(
      { orderId, ...body },
      correlationId ?? randomUUID(),
      tenantId ?? '',
      authHeader,
    );
  }
}
