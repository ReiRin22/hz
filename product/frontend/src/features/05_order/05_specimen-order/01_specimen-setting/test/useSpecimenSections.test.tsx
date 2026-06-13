/**
 * useSpecimenSections テスト
 *
 * テストケースの根拠: 個別機能設計書_検体検査オーダ.xlsx ORD023 オーダー設定シート
 *   - 5.2-4: 検査項目選択 → 選択済みオーダーリストに検査項目を検査単位で追加
 *   - 5.3-1: チェックボックス → 検査項目を追加するか否かを切り替える
 *   - 5.3-2: 選択項目を追加押下 → 選択済みオーダーリストにチェックがついている検査項目を一括で追加
 *   - 5.3-3: 個別追加押下 → 検査項目を個別で選択済みオーダーリストに追加
 *   - 5.4-3: 削除アイコン押下 → 検査単位で選択済みオーダーリストから削除する
 *   - 5.4プルダウン: 削除アイコン押下 → 個別項目ごとに削除が可能
 *   - エラー③: 同一内容のオーダーがすでに登録されています。（バリデーションエラー：重複）
 *   - エラー④: 検査項目が未設定のため、追加できません。（バリデーションエラー：未設定）
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSpecimenSections } from '../hooks/useSpecimenSections'

beforeEach(() => {
  vi.clearAllMocks()
})

const ITEM_CBC = { orderCode: 'CBC', testName: '血算（CBC）', specimenType: 'blood' as const }
const ITEM_UA = { orderCode: 'UA', testName: '尿一般', specimenType: 'urine' as const }

describe('useSpecimenSections', () => {
  it('正常: 初期状態では選択済みオーダーリストが空である', () => {
    const { result } = renderHook(() => useSpecimenSections())

    expect(result.current.items).toHaveLength(0)
  })

  it('正常(5.2-4): 検査項目を選択すると選択済みオーダーリストに追加される', () => {
    // spec 5.2-4: 検査項目選択 → 選択済みオーダーリストに検査項目を検査単位で追加
    const { result } = renderHook(() => useSpecimenSections())

    act(() => {
      result.current.addItem(ITEM_CBC)
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('正常(5.3-2): チェックがついている項目のみ「選択項目を追加」で一括追加される', () => {
    // spec 5.3-2: チェックがついている検査項目を一括で追加
    const { result } = renderHook(() => useSpecimenSections())
    const candidates = [
      { ...ITEM_CBC, checked: true },
      { ...ITEM_UA, checked: false },
    ]

    act(() => {
      result.current.addCheckedItems(candidates)
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('正常(5.3-1, 5.3-2): チェックがOFFの項目は「選択項目を追加」で追加されない', () => {
    // spec 5.3-1: チェックボックス → 追加するか否かを切り替える
    const { result } = renderHook(() => useSpecimenSections())
    const candidates = [{ ...ITEM_CBC, checked: false }]

    act(() => {
      result.current.addCheckedItems(candidates)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('正常(5.3-3): 「個別追加」で検査項目が1件追加される', () => {
    // spec 5.3-3: 検査項目を個別で選択済みオーダーリストに追加
    const { result } = renderHook(() => useSpecimenSections())

    act(() => {
      result.current.addSingleItem(ITEM_CBC)
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('正常(5.4-3): 削除アイコン押下で検査単位の全項目が削除される', () => {
    // spec 5.4-3: 検査単位で選択済みオーダーリストから削除する
    const { result } = renderHook(() => useSpecimenSections())
    act(() => { result.current.addItem(ITEM_CBC) })

    act(() => {
      result.current.removeGroup(ITEM_CBC.orderCode)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('正常(5.4プルダウン): 個別項目削除で対象項目のみ削除される', () => {
    // spec 5.4プルダウン: 個別項目ごとに削除が可能
    const { result } = renderHook(() => useSpecimenSections())
    act(() => {
      result.current.addItem(ITEM_CBC)
      result.current.addItem(ITEM_UA)
    })

    act(() => {
      result.current.removeItem(ITEM_CBC.orderCode)
    })

    expect(result.current.items).toHaveLength(1)
  })

  it('エラー③: 同一内容のオーダーが既にある場合、追加するとエラーメッセージが返る', () => {
    // spec エラー③: 同一内容のオーダーがすでに登録されています。
    const { result } = renderHook(() => useSpecimenSections())
    act(() => { result.current.addItem(ITEM_CBC) })

    let error: string | undefined
    act(() => {
      error = result.current.addItem(ITEM_CBC)
    })

    expect(error).toBe('同一内容のオーダーがすでに登録されています。')
  })

  it('エラー③(確定済み重複): ORD076確定済みオーダーと同一のコードを追加するとエラーメッセージが返る', () => {
    // spec エラー③: 確定済みオーダーとの重複も「同一内容のオーダーがすでに登録されています。」
    const { result } = renderHook(() => useSpecimenSections({ confirmedOrderCodes: ['CBC'] }))

    let error: string | undefined
    act(() => {
      error = result.current.addItem(ITEM_CBC)
    })

    expect(error).toBe('同一内容のオーダーがすでに登録されています。')
    expect(result.current.items).toHaveLength(0)
  })

  it('エラー③(確定済み重複 addCheckedItems): ORD076確定済みコードはチェック一括追加でもスキップされる', () => {
    const { result } = renderHook(() => useSpecimenSections({ confirmedOrderCodes: ['CBC'] }))
    const candidates = [
      { ...ITEM_CBC, checked: true },
      { ...ITEM_UA, checked: true },
    ]

    act(() => {
      result.current.addCheckedItems(candidates)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].orderCode).toBe('UA')
  })

  it('エラー③(確定済み重複 addSingleItem): ORD076確定済みコードは個別追加でもスキップされる', () => {
    const { result } = renderHook(() => useSpecimenSections({ confirmedOrderCodes: ['CBC'] }))

    act(() => {
      result.current.addSingleItem(ITEM_CBC)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('エラー④: 検査項目が未設定の状態で追加しようとするとエラーメッセージが返る', () => {
    // spec エラー④: 検査項目が未設定のため、追加できません。
    const { result } = renderHook(() => useSpecimenSections())
    const emptyCandidates: Array<{ orderCode: string; testName: string; specimenType: 'blood'; checked: boolean }> = []

    let error: string | undefined
    act(() => {
      error = result.current.addCheckedItems(emptyCandidates)
    })

    expect(error).toBe('検査項目が未設定のため、追加できません。')
  })
})
