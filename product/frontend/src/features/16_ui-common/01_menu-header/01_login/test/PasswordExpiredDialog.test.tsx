import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordExpiredDialog } from '../components/organisms/PasswordExpiredDialog'

describe('PasswordExpiredDialog', () => {
  describe('初期表示', () => {
    it('isOpen=trueでダイアログが表示される', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      expect(screen.getByText('パスワード有効期限切れ')).toBeInTheDocument()
    })

    it('isOpen=falseでダイアログが表示されない', () => {
      render(<PasswordExpiredDialog isOpen={false} onClose={() => {}} onResetPassword={() => {}} />)
      expect(screen.queryByText('パスワード有効期限切れ')).not.toBeInTheDocument()
    })

    it('有効期限切れの警告メッセージが表示される', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      expect(screen.getByText(/パスワードの有効期限が切れています/)).toBeInTheDocument()
    })
  })

  describe('バリデーション', () => {
    it('8文字未満のパスワードでは変更ボタンがdisabledになる', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'Abc1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'Abc1!' } })
      expect(screen.getByRole('button', { name: '変更' })).toBeDisabled()
    })

    it('全要件充足かつ一致で変更ボタンが有効になる', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'NewPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'NewPass1!' } })
      expect(screen.getByRole('button', { name: '変更' })).not.toBeDisabled()
    })

    it('パスワード再入力が不一致で変更ボタンがdisabledになる', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'NewPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'different' } })
      expect(screen.getByRole('button', { name: '変更' })).toBeDisabled()
    })
  })

  describe('成功', () => {
    it('有効な入力で変更押下すると成功メッセージが表示される', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'NewPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'NewPass1!' } })
      fireEvent.click(screen.getByRole('button', { name: '変更' }))
      expect(screen.getByText('変更完了')).toBeInTheDocument()
    })

    it('成功後に閉じるボタンが表示される', () => {
      render(<PasswordExpiredDialog isOpen onClose={() => {}} onResetPassword={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'NewPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'NewPass1!' } })
      fireEvent.click(screen.getByRole('button', { name: '変更' }))
      expect(screen.getByRole('button', { name: '閉じる' })).toBeInTheDocument()
    })

    it('成功後に閉じるボタン押下でonCloseが呼ばれる', () => {
      const onClose = vi.fn()
      render(<PasswordExpiredDialog isOpen onClose={onClose} onResetPassword={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('新しいパスワード（8文字以上）'), { target: { value: 'NewPass1!' } })
      fireEvent.change(screen.getByPlaceholderText('新しいパスワードを再入力'), { target: { value: 'NewPass1!' } })
      fireEvent.click(screen.getByRole('button', { name: '変更' }))
      fireEvent.click(screen.getByRole('button', { name: '閉じる' }))
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })
})
