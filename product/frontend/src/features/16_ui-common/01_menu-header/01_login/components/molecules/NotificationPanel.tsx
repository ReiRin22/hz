"use client";
import React from 'react';
import { AlertCircle, Megaphone, Clock } from 'lucide-react';
import { Card } from '@/shared/components/atoms/card';
import { i18n } from '@/shared/i18n';

export function NotificationPanel() {
  // ダミーデータ - システムメンテナンス情報
  const maintenanceNotices = [
    {
      id: 1,
      title: '定期メンテナンス',
      date: '2026/02/08 (土)',
      time: '23:00 - 01:00',
      description: 'システムの定期メンテナンスを実施します。'
    },
    {
      id: 2,
      title: 'サーバーアップデート',
      date: '2026/02/15 (土)',
      time: '22:00 - 24:00',
      description: 'セキュリティアップデートのためサーバーメンテナンスを行います。'
    }
  ];

  // ダミーデータ - 院内掲示板
  const bulletinBoard = [
    {
      id: 1,
      title: '新型インフルエンザ対応について',
      date: '2026/02/05',
      category: 'important' as const,
      excerpt: '新型インフルエンザ患者の対応フローが更新されました。詳細は院内ポータルをご確認ください。'
    },
    {
      id: 2,
      title: '医療安全研修会のお知らせ',
      date: '2026/02/03',
      category: 'notice' as const,
      excerpt: '2月20日(木) 18:00より第4会議室にて医療安全研修会を開催します。'
    },
    {
      id: 3,
      title: '電子カルテ操作マニュアル更新',
      date: '2026/02/01',
      category: 'notice' as const,
      excerpt: '電子カルテシステムのマニュアルがver.3.2に更新されました。'
    }
  ];

  const t = i18n.auth.notificationPanel;

  return (
    <div className="space-y-4 w-[360px]">
      {/* システムメンテナンス情報 */}
      <Card className="p-4 shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="size-5" style={{ color: '#F59E0B' }} />
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
            {t.maintenanceTitle}
          </h3>
        </div>
        <div className="space-y-3">
          {maintenanceNotices.map((notice) => (
            <div
              key={notice.id}
              className="p-3 rounded-md"
              style={{ backgroundColor: '#FEF3C7', borderLeft: '3px solid #F59E0B' }}
            >
              <div className="flex items-start gap-2 mb-1">
                <Clock className="size-4 mt-0.5 flex-shrink-0" style={{ color: '#D97706' }} />
                <div className="flex-1">
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#92400E' }}>
                    {notice.title}
                  </p>
                  <p style={{ fontSize: '11px', color: '#92400E', marginTop: '2px' }}>
                    {notice.date} {notice.time}
                  </p>
                  <p style={{ fontSize: '11px', color: '#78350F', marginTop: '4px' }}>
                    {notice.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 院内掲示板 */}
      <Card className="p-4 shadow-md" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-3">
          <Megaphone className="size-5" style={{ color: '#2563EB' }} />
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
            {t.bulletinBoardTitle}
          </h3>
        </div>
        <div className="space-y-3">
          {bulletinBoard.map((post) => (
            <div
              key={post.id}
              className="p-3 rounded-md"
              style={{ border: '1px solid #E2E8F0' }}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <p style={{ fontSize: '12px', fontWeight: '600', color: '#1E293B' }}>
                  {post.title}
                </p>
                <span
                  className="px-2 py-0.5 rounded text-white flex-shrink-0"
                  style={{
                    fontSize: '9px',
                    backgroundColor: post.category === 'important' ? '#DC2626' : '#64748B'
                  }}
                >
                  {t.categories[post.category]}
                </span>
              </div>
              <p style={{ fontSize: '10px', color: '#64748B', marginBottom: '4px' }}>
                {post.date}
              </p>
              <p style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>
                {post.excerpt}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
