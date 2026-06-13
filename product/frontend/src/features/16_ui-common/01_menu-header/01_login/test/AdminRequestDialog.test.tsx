import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AdminRequestDialog } from '../components/organisms/AdminRequestDialog'

describe('AdminRequestDialog', () => {
  describe('初期表示', () => {
    it('isOpen=trueでダイアログが表示される', () => {
      render(<AdminRequestDialog isOpen onClose={() => {}} />)
      expect(screen.getByText('パスワード再設定依頼')).toBeInTheDocument()
    })

    it('isOpen=falseでダイアログが表示されない', () => {
      render(<AdminRequestDialog isOpen={false} onClose={() => {}} />)
      expect(screen.queryByText('パスワード再設定依頼')).not.toBeInTheDocument()
    })

    it('ユーザーIDまたは氏名が必須である旨のメッセージが表示される', () => {
      render(<AdminRequestDialog isOpen onClose={() => {}} />)
      expect(screen.getByText(/ユーザーIDまたは氏名のいずれかは必須/)).toBeInTheDocument()
    })
  })

  describe('相互必須バリデーション', () => {
    it('ユーザーIDも氏名も空で送信するとエラーメッセージが表示される', () => {
      render(<AdminRequestDialog isOpen onClose={() => {}} />)
      fireEvent.click(screen.getByRole('button', { name: '送信' }))
      expect(screen.getByText('ユーザーIDまたは氏名のいずれかを入力してください。')).toBeInTheDocument()
    })

    it('ユーザーIDのみ入力して送信するとエラーメッセージが表示されない', () => {
      render(<AdminRequestDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('ユーザーID'), { target: { value: 'user01' } })
      fireEvent.click(screen.getByRole('button', { name: '送信' }))
      expect(screen.queryByText('ユーザーIDまたは氏名のいずれかを入力してください。')).not.toBeInTheDocument()
    })

    it('氏名のみ入力して送信するとエラーメッセージが表示されない', () => {
      render(<AdminRequestDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('氏名'), { target: { value: '山田 太郎' } })
      fireEvent.click(screen.getByRole('button', { name: '送信' }))
      expect(screen.queryByText('ユーザーIDまたは氏名のいずれかを入力してください。')).not.toBeInTheDocument()
    })
  })

  describe('キャンセル', () => {
    it('キャンセルボタン押下でonCloseが呼ばれる', () => {
      const onClose = vi.fn()
      render(<AdminRequestDialog isOpen onClose={onClose} />)
      fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('キャンセル後にユーザーIDフィールドが空になる', () => {
      const { rerender } = render(<AdminRequestDialog isOpen onClose={() => {}} />)
      fireEvent.change(screen.getByPlaceholderText('ユーザーID'), { target: { value: 'user01' } })
      fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))
      rerender(<AdminRequestDialog isOpen onClose={() => {}} />)
      expect(screen.getByPlaceholderText('ユーザーID')).toHaveValue('')
    })
  })

  describe('管理者情報', () => {
    it('管理者連絡先が表示される', () => {
      render(<AdminRequestDialog isOpen onClose={() => {}} />)
      expect(screen.getByText(/システム管理部門/)).toBeInTheDocument()
    })
  })
})
