import { http, HttpResponse } from 'msw';
import { mockOrders, mockOrdersWithStartedSpecimen } from '../fixtures/orderFixtures';

const BASE_URL = 'http://localhost:3001/bff';

/**
 * 指示受け一覧取得・ステータス更新・実施者登録・会計連携の成功ハンドラ群。
 * DEP002/DEP009 両機能の story および stories.test で再利用する。
 */
export const deptInstructionSuccessHandlers = [
  http.post(`${BASE_URL}/dept-instructions`, () =>
    HttpResponse.json({
      orders: mockOrders,
      total: mockOrders.length,
      page: 1,
      pageSize: 50,
    }),
  ),
  http.patch(`${BASE_URL}/dept-instructions/:orderId/status`, ({ params }) =>
    HttpResponse.json({
      orderId: params.orderId,
      newStatus: 'implemented',
      updatedAt: new Date().toISOString(),
    }),
  ),
  http.post(`${BASE_URL}/dept-instructions/:orderId/implementer`, ({ params }) =>
    HttpResponse.json({
      orderId: params.orderId,
      implementedAt: new Date().toISOString(),
      newStatus: 'implemented',
    }),
  ),
  http.post(`${BASE_URL}/dept-instructions/:orderId/billing-link`, ({ params }) =>
    HttpResponse.json({
      orderId: params.orderId,
      billingLinkedAt: new Date().toISOString(),
      success: true,
    }),
  ),
];

/**
 * 指示受け一覧取得が 500 エラーを返すハンドラ（ApiError story 用）。
 */
export const deptInstructionFetchErrorHandlers = [
  http.post(`${BASE_URL}/dept-instructions`, () =>
    HttpResponse.json(
      { errorCode: 'E_DEP002_01', message: '通信エラーが発生しました' },
      { status: 500 },
    ),
  ),
];

/**
 * ステータス更新が 500 エラーを返すハンドラ（StatusUpdateError story 用）。
 * 一覧取得は成功し、その後の PATCH のみ失敗する。
 */
export const deptInstructionStatusUpdateErrorHandlers = [
  http.post(`${BASE_URL}/dept-instructions`, () =>
    HttpResponse.json({
      orders: mockOrdersWithStartedSpecimen,
      total: mockOrdersWithStartedSpecimen.length,
      page: 1,
      pageSize: 50,
    }),
  ),
  http.patch(`${BASE_URL}/dept-instructions/:orderId/status`, () =>
    HttpResponse.json(
      { errorCode: 'E_DEP002_02', message: 'ステータス更新に失敗しました' },
      { status: 500 },
    ),
  ),
  http.post(`${BASE_URL}/dept-instructions/:orderId/implementer`, ({ params }) =>
    HttpResponse.json({
      orderId: params.orderId,
      implementedAt: new Date().toISOString(),
      newStatus: 'implemented',
    }),
  ),
  http.post(`${BASE_URL}/dept-instructions/:orderId/billing-link`, ({ params }) =>
    HttpResponse.json({
      orderId: params.orderId,
      billingLinkedAt: new Date().toISOString(),
      success: true,
    }),
  ),
];
