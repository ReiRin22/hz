import { describe, it, expect } from 'vitest';
import { TestResultSaveRequestSchema } from './test-results-save.schema';

const VALID_ITEM = { itemCode: 'GLU', resultValue: 95, unit: 'mg/dL' };

describe('TestResultSaveRequestSchema', () => {
  describe('正常系', () => {
    it('最小構成（testResults のみ）でパース成功', () => {
      const result = TestResultSaveRequestSchema.safeParse({ testResults: [VALID_ITEM] });
      expect(result.success).toBe(true);
    });

    it('optionalフィールド（lowerLimit, upperLimit, testDate）を含めてパース成功', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [{ ...VALID_ITEM, lowerLimit: 70, upperLimit: 110, testDate: '2026-04-22' }],
      });
      expect(result.success).toBe(true);
    });

    it('testDate が YYYY-MM-DD 形式 → パース成功', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [{ ...VALID_ITEM, testDate: '2026-04-22' }],
      });
      expect(result.success).toBe(true);
    });

    it('reasonCode が OTHER 以外かつ reasonText なし → パース成功', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [VALID_ITEM],
        modificationReason: { reasonCode: 'INPUT_ERROR' },
      });
      expect(result.success).toBe(true);
    });

    it('reasonCode が OTHER かつ reasonText あり → パース成功', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [VALID_ITEM],
        modificationReason: { reasonCode: 'OTHER', reasonText: '理由の詳細' },
      });
      expect(result.success).toBe(true);
    });

    it('testResults が複数件でもパース成功', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [VALID_ITEM, { itemCode: 'HBA1C', resultValue: 6.0, unit: '%' }],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('異常系', () => {
    it('testResults が空配列でもパース成功（BFF 定義書に件数下限の記載なし。バックエンドで弾く前提）', () => {
      const result = TestResultSaveRequestSchema.safeParse({ testResults: [] });
      expect(result.success).toBe(true);
    });

    it('testResults が欠落 → パース失敗', () => {
      const result = TestResultSaveRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('resultValue が文字列 → パース失敗', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [{ itemCode: 'GLU', resultValue: '95', unit: 'mg/dL' }],
      });
      expect(result.success).toBe(false);
    });

    it('itemCode が欠落 → パース失敗', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [{ resultValue: 95, unit: 'mg/dL' }],
      });
      expect(result.success).toBe(false);
    });

    it('reasonCode が OTHER かつ reasonText が欠落 → superRefine でパース失敗', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [VALID_ITEM],
        modificationReason: { reasonCode: 'OTHER' },
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map(i => i.path.join('.'));
        expect(paths).toContain('modificationReason.reasonText');
      }
    });

    it('testDate が YYYY-MM-DD 形式でない → パース失敗', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [{ ...VALID_ITEM, testDate: '20260422' }],
      });
      expect(result.success).toBe(false);
    });

    it('reasonCode が OTHER かつ reasonText が空文字 → superRefine でパース失敗', () => {
      const result = TestResultSaveRequestSchema.safeParse({
        testResults: [VALID_ITEM],
        modificationReason: { reasonCode: 'OTHER', reasonText: '' },
      });
      expect(result.success).toBe(false);
    });
  });
});
