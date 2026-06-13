import { Button } from "@/shared/components/atoms/button";
import { FileText, Printer } from "lucide-react";

interface ActionButtonsProps {
  onPDFExport: () => void;
  onPrint: () => void;
}

export function ActionButtons({ onPDFExport, onPrint }: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={onPDFExport} className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        PDF出力
      </Button>
      <Button variant="outline" onClick={onPrint} className="flex items-center gap-2">
        <Printer className="h-4 w-4" />
        印刷
      </Button>
    </div>
  );
}