import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationPanel } from '../components/molecules/NotificationPanel'

describe('NotificationPanel', () => {
  describe('初期表示', () => {
    it('システムメンテナンスセクションが表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('システムメンテナンス')).toBeInTheDocument()
    })

    it('院内掲示板セクションが表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('院内掲示板')).toBeInTheDocument()
    })
  })

  describe('データ表示', () => {
    it('院内掲示板の記事タイトルが表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('新型インフルエンザ対応について')).toBeInTheDocument()
    })

    it('メンテナンス情報の1件目が表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('定期メンテナンス')).toBeInTheDocument()
    })

    it('メンテナンス情報の2件目が表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('サーバーアップデート')).toBeInTheDocument()
    })

    it('院内掲示板の2件目が表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('医療安全研修会のお知らせ')).toBeInTheDocument()
    })

    it('院内掲示板の3件目が表示される', () => {
      render(<NotificationPanel />)
      expect(screen.getByText('電子カルテ操作マニュアル更新')).toBeInTheDocument()
    })
  })
})
