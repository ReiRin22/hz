import { RightSideMenuWrapper } from '@/shared/components/organisms/right-sidemenu/RightSideMenuWrapper';
import { GlobalMenuNavFeature } from '@/shared/components/organisms/left-sidemenu/GlobalMenuNavFeature';

export default function ReceptionListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <GlobalMenuNavFeature />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <RightSideMenuWrapper />
      </div>
    </div>
  );
}
