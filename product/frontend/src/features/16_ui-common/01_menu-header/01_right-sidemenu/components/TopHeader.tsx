// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
import { Filter, List } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';

export function TopHeader() {
  return (
    <div className="h-[71px] border-b border-[rgba(0,0,0,0.1)] px-[14px] pt-[14px] pb-[7px] bg-background">
      <div className="flex items-start justify-between mb-[3.5px]">
        <div>
          <h1 className="text-[14px] leading-[21px]">オーダー入力</h1>
          <p className="text-[12.25px] leading-[17.5px] text-[#717182]">処方オーダー</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
