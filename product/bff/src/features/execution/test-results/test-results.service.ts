import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { TestResultsClient } from '@/features/execution/test-results/test-results.client';
import { TestItemMasterService } from '@shared/master/test-item-master/test-item-master.service';
import type {
  TestResultsInitialResponse,
  TestItemSearchResponse,
  TestItemOption,
  ModificationReasonResponse,
  TestResultSaveResponse,
} from '@/front_bff_shared/execution/test-results/types/test-results.api.response';
import type { TestResultSaveRequest } from '@/front_bff_shared/execution/test-results/types/test-results.api.request';
import type { TestItemRecord } from '@/front_bff_shared/sample/master/types/test-item-master.api.response';
import type {
  BackendLockAcquireResponse,
  BackendTestResultsGetResponse,
  BackendUnitRecord,
  BackendSaveErrorBody,
  BackendSaveResponse,
} from '@/features/execution/test-results/types/backend.type';

// TODO: [認証実装] JWT Middleware 実装時に controller 側の JwtUser と共通型に統合する
type JwtUser = {
  sub: string;
  name: string;
};

type AxiosLikeError = {
  response?: { status?: number; data?: BackendSaveErrorBody | Record<string, unknown> };
  code?: string;
};

@Injectable()
export class TestResultsService {
  constructor(
    @Inject(TestResultsClient)
    private readonly testResultsClient: TestResultsClient,
    @Inject(TestItemMasterService)
    private readonly testItemMasterService: TestItemMasterService,
  ) {}

  async getInitialData(
    orderUuid: string,
    correlationId: string,
    tenantId: string,
    user: JwtUser,
    authHeader: string,
  ): Promise<TestResultsInitialResponse> {
    let lockData: BackendLockAcquireResponse;
    try {
      lockData = await this.testResultsClient.acquireLock(orderUuid, correlationId, tenantId, authHeader);
    } catch (error: unknown) {
      const axiosError = error as AxiosLikeError;
      if (axiosError.response?.status === 409) {
        const errorBody = axiosError.response.data as BackendSaveErrorBody | undefined;
        const errorCode = errorBody?.errorCode;
        if (errorCode === 'LOCK_CONFLICT') {
          throw new HttpException(
            {
              type: 'CONFLICT',
              code: 'CONFLICT',
              ...(errorBody?.lockedByUserName ? { lockedByUserName: errorBody.lockedByUserName } : {}),
            },
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          { type: 'CONFLICT', code: 'CONFLICT' },
          HttpStatus.CONFLICT,
        );
      }
      throw this.normalizeError(error);
    }

    let testResultsData: BackendTestResultsGetResponse;
    let unitsData: BackendUnitRecord[];
    try {
      [testResultsData, unitsData] = await Promise.all([
        this.testResultsClient.fetchTestResults(orderUuid, correlationId, tenantId, authHeader),
        this.testResultsClient.fetchUnits(correlationId, tenantId, authHeader),
      ]);
    } catch (error: unknown) {
      throw this.normalizeError(error);
    }

    return {
      orderUuid: testResultsData.orderUuid,
      testResults: testResultsData.testResults.map((r) => ({
        itemCode: r.itemCode,
        itemName: r.itemName,
        resultValue: r.resultValue,
        unit: r.unit,
        referenceValueDisplay: r.referenceValueDisplay,
        lowerLimit: r.lowerLimit,
        upperLimit: r.upperLimit,
        criticalLower: r.criticalLower,
        criticalUpper: r.criticalUpper,
        previousResultValue: r.previousResultValue,
        hasPreviousResult: r.hasPreviousResult,
        testDate: r.testDate,
        hasTestDate: r.hasTestDate,
        isUserAdded: r.isUserAdded,
      })),
      lockInfo: {
        lockBy: 'SELF',
        lockedAt: lockData.lockedAt,
        lockedByUserId: user.sub,
        lockedByUserName: user.name,
      },
      reasonRequired: testResultsData.hasConfirmedResults,
      availableUnits: unitsData.map((u) => ({ value: u.code, label: u.name })),
    };
  }

  async searchTestItems(
    params: { itemName?: string; itemCode?: string },
    correlationId: string,
    tenantId: string,
    authHeader: string,
  ): Promise<TestItemSearchResponse> {
    // TestItemMasterService が投げた HttpException はステータスコードを保持したまま再スロー。
    // 非 HttpException はここで BAD_GATEWAY に変換する
    let records: TestItemRecord[];
    try {
      const result = await this.testItemMasterService.getTestItems(params, correlationId, tenantId, authHeader);
      records = result.items;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        const status = error.getStatus();
        if (
          status === HttpStatus.BAD_GATEWAY ||
          status === HttpStatus.GATEWAY_TIMEOUT ||
          status === HttpStatus.INTERNAL_SERVER_ERROR ||
          status === HttpStatus.UNAUTHORIZED ||
          status === HttpStatus.FORBIDDEN
        ) {
          throw error;
        }
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
          HttpStatus.BAD_GATEWAY,
        );
      }
      const axiosError = error as AxiosLikeError;
      if (axiosError.code === 'ECONNABORTED' || axiosError.response?.status === 504) {
        throw new HttpException(
          { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }
      throw new HttpException(
        { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
        HttpStatus.BAD_GATEWAY,
      );
    }

    const items: TestItemOption[] = records.map((r) => {
      const referenceValueDisplay =
        r.lower_limit !== null && r.upper_limit !== null
          ? `${r.lower_limit}–${r.upper_limit}` // U+2013 EN DASH（設計書仕様）
          : null;
      return {
        itemCode: r.code,
        itemName: r.name,
        defaultUnit: r.unit_id,
        referenceValueDisplay,
        lowerLimit: r.lower_limit,
        upperLimit: r.upper_limit,
        criticalLower: r.critical_lower,
        criticalUpper: r.critical_upper,
      };
    });

    return { items };
  }

  async getModificationReasons(correlationId: string, tenantId: string, authHeader: string): Promise<ModificationReasonResponse> {
    try {
      const reasons = await this.testResultsClient.fetchModificationReasons(correlationId, tenantId, authHeader);
      return { reasons: reasons.map((r) => ({ code: r.code, label: r.name })) };
    } catch (error: unknown) {
      throw this.normalizeError(error);
    }
  }

  async saveTestResults(
    orderUuid: string,
    body: TestResultSaveRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string,
  ): Promise<TestResultSaveResponse> {
    let saveData: BackendSaveResponse;
    try {
      saveData = await this.testResultsClient.saveTestResults(
        orderUuid,
        body.testResults,
        body.modificationReason,
        correlationId,
        tenantId,
        authHeader,
      );
    } catch (error: unknown) {
      const axiosError = error as AxiosLikeError;
      if (axiosError.response?.status === 400) {
        const errorCode = (axiosError.response.data as BackendSaveErrorBody | undefined)?.errorCode;
        if (errorCode === 'VALIDATION_DELETE') {
          throw new HttpException(
            { type: 'BUSINESS_ERROR', code: 'VALIDATION_DELETE' },
            HttpStatus.BAD_REQUEST,
          );
        }
        throw new HttpException(
          { type: 'BUSINESS_ERROR', code: 'VALIDATION_FORMAT' },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (axiosError.response?.status === 409) {
        const errorBody = axiosError.response.data as BackendSaveErrorBody | undefined;
        const errorCode = errorBody?.errorCode;
        if (errorCode === 'LOCK_CONFLICT') {
          throw new HttpException(
            {
              type: 'CONFLICT',
              code: 'CONFLICT',
              ...(errorBody?.lockedByUserName ? { lockedByUserName: errorBody.lockedByUserName } : {}),
            },
            HttpStatus.CONFLICT,
          );
        }
        throw new HttpException(
          { type: 'CONFLICT', code: 'CONFLICT' },
          HttpStatus.CONFLICT,
        );
      }
      throw this.normalizeError(error);
    }

    this.testResultsClient.releaseLock(orderUuid, tenantId, authHeader).catch((err: unknown) => {
      // TODO: 構造化ログへ移行する
      console.error(`[EVT_RELEASE_LOCK_FAIL] orderUuid: ${orderUuid}`, err);
    });

    return { orderUuid: saveData.orderUuid, savedAt: saveData.savedAt };
  }

  private normalizeError(error: unknown): HttpException {
    const axiosError = error as AxiosLikeError;
    if (axiosError.code === 'ECONNABORTED') {
      return new HttpException(
        { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }
    if (axiosError.code === 'ERR_NETWORK') {
      return new HttpException(
        { type: 'SYSTEM_ERROR', code: 'BAD_GATEWAY' },
        HttpStatus.BAD_GATEWAY,
      );
    }
    if (axiosError.response?.status === 401) {
      return new HttpException(
        { type: 'AUTH_ERROR', code: 'UNAUTHORIZED' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (axiosError.response?.status === 403) {
      return new HttpException(
        { type: 'AUTH_ERROR', code: 'FORBIDDEN' },
        HttpStatus.FORBIDDEN,
      );
    }
    if (axiosError.response?.status === 404) {
      return new HttpException(
        { type: 'NOT_FOUND', code: 'NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (axiosError.response?.status === 504) {
      return new HttpException(
        { type: 'SYSTEM_ERROR', code: 'TIMEOUT' },
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }
    return new HttpException(
      { type: 'SYSTEM_ERROR', code: 'SYSTEM_ERROR' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
