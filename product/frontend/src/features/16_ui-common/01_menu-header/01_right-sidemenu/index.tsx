"use client";
import { RightSideMenu } from './components/organisms/RightSideMenu';
import { Toaster } from '@/shared/components/atoms/sonner';

export default function ETC005Page() {
  return (
    <div className="h-screen flex justify-end bg-background overflow-hidden">
      {/* 左サイドメニュー (87.5px) */}
      <RightSideMenu />

      {/* トースト通知 */}
      <Toaster />
    </div>
  );
}
