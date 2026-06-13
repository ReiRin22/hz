'use client';
import { Clock, Stethoscope, CheckCircle, Pause, XCircle } from "lucide-react";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";

type ConsultationStatus = "waiting" | "in-progress" | "completed" | "postponed" | "cancelled";

type ConsultationStatusMoleculeProps = {
  consultationStatus: ConsultationStatus;
  isConsultationStarted: boolean;
  onConsultationToggle: () => void;
};

function getConsultationStatusInfo(status: string) {
  switch (status) {
    case "waiting":
      return { icon: Clock, label: "診察待ち", color: "bg-yellow-100 text-yellow-800 border-yellow-200", iconColor: "text-yellow-600" };
    case "in-progress":
      return { icon: Stethoscope, label: "診察前", color: "bg-blue-100 text-blue-800 border-blue-200", iconColor: "text-blue-600" };
    case "completed":
      return { icon: CheckCircle, label: "診察終了", color: "bg-green-100 text-green-800 border-green-200", iconColor: "text-green-600" };
    case "postponed":
      return { icon: Pause, label: "診察延期", color: "bg-orange-100 text-orange-800 border-orange-200", iconColor: "text-orange-600" };
    case "cancelled":
      return { icon: XCircle, label: "診察中止", color: "bg-red-100 text-red-800 border-red-200", iconColor: "text-red-600" };
    default:
      return { icon: Clock, label: "未設定", color: "bg-gray-100 text-gray-800 border-gray-200", iconColor: "text-gray-600" };
  }
}

export function ConsultationStatusMolecule({
  consultationStatus,
  isConsultationStarted,
  onConsultationToggle,
}: ConsultationStatusMoleculeProps) {
  const statusInfo = getConsultationStatusInfo(consultationStatus);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-muted-foreground text-sm min-w-[60px]">診察:</span>
      {isConsultationStarted && (
        <Badge className="border bg-green-100 text-green-800 border-green-200 text-sm px-2.5 py-0.5">
          診察中
        </Badge>
      )}
      <Button
        size="sm"
        variant={isConsultationStarted ? "destructive" : "default"}
        onClick={onConsultationToggle}
        className={`h-7 px-3 text-base transition-all ${
          isConsultationStarted
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "medical-primary text-white hover:bg-blue-700"
        }`}
      >
        {isConsultationStarted ? "診察終了" : "診察開始"}
      </Button>
    </div>
  );
}
