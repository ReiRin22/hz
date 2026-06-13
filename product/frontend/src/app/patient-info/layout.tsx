import { GlobalMenuNavFeature } from '@/shared/components/organisms/left-sidemenu/GlobalMenuNavFeature';
import { RightSideMenuWrapper } from '@/shared/components/organisms/right-sidemenu/RightSideMenuWrapper';

export default function PatientInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full overflow-hidden">
      <GlobalMenuNavFeature />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
      <RightSideMenuWrapper />
    </div>
  );
}
