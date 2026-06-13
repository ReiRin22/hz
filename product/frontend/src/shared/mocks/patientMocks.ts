/**
 * 患者モックデータ
 *
 * @remarks
 * 実装完了後は API / Context から取得する実装に置き換えること。
 */

export const MOCK_PATIENT = {
  id: 'P001',
  name: '山田 太郎',
  allergies: ['ペニシリン系', 'セフェム系', 'NSAIDs'],
  conditions: {
    pregnancy: false,
    renalImpairment: true,
    hepaticImpairment: false,
    elderly: true,
  },
  renalFunction: {
    ccr: 45, // mL/min
  },
} as const;
