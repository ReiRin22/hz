/**
 * SpecimenOrderEntryFeature テスト
 *
 * テストケースの根拠: 個別機能設計書_検体検査オーダ.xlsx ORD023 オーダー設定シート
 *   - showSpecimenOrderPanel=false のとき画面が表示されない
 *   - showSpecimenOrderPanel=true のとき検体検査オーダー入力画面が表示される
 *   - キャンセルボタン押下で onShowSpecimenOrderPanelChange(false) が呼ばれる
 *
 * 注意: 「確定へ進む」ボタンは SpecimenOrderEntryOrganism の設計上、
 * 親コンポーネント側（SpecimenConfirmPanel / useSpecimenOrderSubmit）が持つ責務のため
 * このテストファイルでは対象外。SpecimenOrderEntryOrganism.stories.test.tsx でカバー済み。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen, fireEvent } from '@testing-library/react'
import { SpecimenOrderEntryFeature } from '../index'
import * as specimenOrderApi from '../api/specimenOrderApi'

vi.mock('../api/specimenOrderApi')

const DEFAULT_PROPS = {
  showSpecimenOrderPanel: true,
  onShowSpecimenOrderPanelChange: vi.fn(),
  patientId: 'P001',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(specimenOrderApi.getSpecimenSets).mockResolvedValue({ specimenSets: [] })
  vi.mocked(specimenOrderApi.getSpecimenItems).mockResolvedValue({ items: [] })
  vi.mocked(specimenOrderApi.getSpecimenHistory).mockResolvedValue({ history: [] })
})

describe('SpecimenOrderEntryFeature', () => {
  it('正常: showSpecimenOrderPanel が false のとき画面が表示されない', () => {
    const { container } = render(
      <SpecimenOrderEntryFeature {...DEFAULT_PROPS} showSpecimenOrderPanel={false} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('正常: showSpecimenOrderPanel が true のとき検体検査オーダー入力画面が表示される', () => {
    render(<SpecimenOrderEntryFeature {...DEFAULT_PROPS} />)

    expect(screen.getByText(/検体検査オーダー/)).toBeInTheDocument()
  })

  it('正常: キャンセルボタン押下で onShowSpecimenOrderPanelChange(false) が呼ばれる', () => {
    const onShowChange = vi.fn()
    render(<SpecimenOrderEntryFeature {...DEFAULT_PROPS} onShowSpecimenOrderPanelChange={onShowChange} />)

    fireEvent.click(screen.getByRole('button', { name: /キャンセル/ }))

    expect(onShowChange).toHaveBeenCalledWith(false)
  })
})
