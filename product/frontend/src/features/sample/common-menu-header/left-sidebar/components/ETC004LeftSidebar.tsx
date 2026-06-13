// src/features/common-menu-header/left-sidebar/ETC004LeftSidebar.tsx
import Link from 'next/link';

export const ETC004LeftSidebar = () => (
  <nav className="w-64 bg-slate-800 text-white h-full p-4">
    <div className="text-xs text-slate-400 mb-4 font-mono">ETC004:左サイドメニュー</div>
    <ul className="space-y-2">
      <li>
        <Link href="/diagnosis/record-view/view" prefetch={false} className="block p-2 hover:bg-slate-700 rounded">
          診療情報参照 (REC005)
        </Link>
      </li>
      <li>
        <Link href="/diagnosis/record-management/clinical-entry" prefetch={false} className="block p-2 hover:bg-slate-700 rounded">
          診療記録入力 (CLT001)
        </Link>
      </li>
    </ul>
  </nav>
);