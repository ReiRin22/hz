import { RightSideMenuWrapper } from '@/shared/components/organisms/right-sidemenu/RightSideMenuWrapper';

export default function DeptInstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        <RightSideMenuWrapper />
      </div>
    </div>
  );
}
