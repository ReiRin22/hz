import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { TestItemMasterClient } from '@shared/master/test-item-master/test-item-master.client';
import type { TestItemListResponse } from '@/front_bff_shared/sample/master/types/test-item-master.api.response';

type TestItemsQueryParams = {
  itemName?: string;
  itemCode?: string;
};

@Injectable()
export class TestItemMasterService {
  constructor(
    @Inject(TestItemMasterClient)
    private readonly testItemMasterClient: TestItemMasterClient,
  ) {}

  async getTestItems(
    params: TestItemsQueryParams,
    correlationId: string,
    tenantId: string,
    authHeader: string,
  ): Promise<TestItemListResponse> {
    try {
      return await this.testItemMasterClient.fetchTestItems(params, correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number }; code?: string };

      if (axiosError.code === 'ECONNABORTED') {
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }
      if (axiosError.code === 'ERR_NETWORK') {
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
          HttpStatus.BAD_GATEWAY,
        );
      }
      if (axiosError.response?.status === 401) {
        throw new HttpException(
          { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      if (axiosError.response?.status === 403) {
        throw new HttpException(
          { type: 'AUTH_ERROR', code: 'FORBIDDEN' },
          HttpStatus.FORBIDDEN,
        );
      }
      if (axiosError.response?.status === 500) {
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      if (axiosError.response?.status === 502) {
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
          HttpStatus.BAD_GATEWAY,
        );
      }
      if (axiosError.response?.status === 504) {
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }

      throw new HttpException(
        { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
