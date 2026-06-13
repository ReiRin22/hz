import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordResetDialog } from '../components/organisms/PasswordResetDialog'

describe('PasswordResetDialog', () => {
  describe('初期表示', () => {
    it('isOpen=trueでダイアログが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      expect(screen.getByText('パスワード再設定')).toBeInTheDocument()
    })

    it('isOpen=falseでダイアログが表示されない', () => {
      render(<PasswordResetDialog isOpen={false} onClose={() => {}} />)
      expect(screen.queryByText('パスワード再設定')).not.toBeInTheDocument()
    })
  })

  describe('パスワード要件チェック', () => {
    it('8文字以上入力すると「8文字以上」インジケータが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'Abcdefg1!' } })
      const items = screen.getAllByText('8文字以上')
      expect(items[0]).toBeInTheDocument()
    })

    it('大文字入力で「大文字を含む」インジケータが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'A' } })
      expect(screen.getByText('大文字を含む')).toBeInTheDocument()
    })

    it('数字入力で「数字を含む」インジケータが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: '1' } })
      expect(screen.getByText('数字を含む')).toBeInTheDocument()
    })
  })

  describe('パスワード一致チェック', () => {
    it('再入力が一致するとパスワード一致メッセージが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'Abc123!x' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'Abc123!x' } })
      expect(screen.getByText('パスワードが一致しています')).toBeInTheDocument()
    })

    it('再入力が不一致だと不一致メッセージが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'Abc123!x' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'different' } })
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
    })
  })

  describe('バリデーション', () => {
    it('全フィールドが空の場合、変更ボタンがdisabledになる', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      expect(screen.getByRole('button', { name: '変更' })).toBeDisabled()
    })

    it('要件未達パスワードでは変更ボタンがdisabledになる', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'weak' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'weak' } })
      expect(screen.getByRole('button', { name: '変更' })).toBeDisabled()
    })

    it('パスワード不一致で変更ボタンがdisabledになる', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'Abc123!x' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'different' } })
      expect(screen.getByRole('button', { name: '変更' })).toBeDisabled()
    })
  })

  describe('成功', () => {
    it('有効な入力で変更押下すると成功メッセージが表示される', () => {
      render(<PasswordResetDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('現在のパスワード'), { target: { value: 'OldPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'NewPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'NewPass1!' } })
      fireEvent.click(screen.getByRole('button', { name: '変更' }))
      expect(screen.getByText('変更完了')).toBeInTheDocument()
    })
  })

  describe('キャンセル', () => {
    it('キャンセルボタン押下でonCloseが呼ばれる', () => {
      const onClose = vi.fn()
      render(<PasswordResetDialog isOpen onClose={onClose} />)
      fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
