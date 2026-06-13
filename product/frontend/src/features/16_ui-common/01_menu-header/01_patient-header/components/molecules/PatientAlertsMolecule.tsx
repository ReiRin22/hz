import { AlertTriangle, Shield, Radiation } from "lucide-react";
import { Badge } from "@/shared/components/atoms/badge";
import type { PatientViewModel } from "../../types/patient-header.type";

type PatientAlertsMoleculeProps = {
  allergies: string[];
  infections: string[];
  radiationExposure?: PatientViewModel["radiationExposure"];
};

export function PatientAlertsMolecule({
  allergies,
  infections,
  radiationExposure,
}: PatientAlertsMoleculeProps) {
  return (
    <div className="flex items-center space-x-1.5">
      {allergies.length > 0 && (
        <div className="flex items-center space-x-1 p-1.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md shadow-sm">
          <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
            <AlertTriangle className="w-2.5 h-2.5 text-white" />
          </div>
          <div className="flex flex-col">
            <Badge variant="destructive" className="text-xs font-medium mb-0.5 px-1 py-0 text-[12px]">
              アレルギー
            </Badge>
            <span className="text-xs text-red-700 dark:text-red-300 font-medium truncate max-w-[120px]">
              {allergies.slice(0, 2).join(", ")}
              {allergies.length > 2 && "..."}
            </span>
          </div>
        </div>
      )}

      {infections.length > 0 && (
        <div className="flex items-center space-x-1 p-1.5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 rounded-md shadow-sm">
          <div className="flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full">
            <Shield className="w-2.5 h-2.5 text-white" />
          </div>
          <div className="flex flex-col">
            <Badge className="bg-orange-500 text-white text-xs font-medium mb-0.5 px-1 py-0 text-[12px]">
              感染症
            </Badge>
            <span className="text-xs text-orange-700 dark:text-orange-300 font-medium truncate max-w-[120px]">
              {infections.slice(0, 2).join(", ")}
              {infections.length > 2 && "..."}
            </span>
          </div>
        </div>
      )}

      {radiationExposure && (
        <div className={`flex items-center space-x-1 p-1.5 border rounded-md shadow-sm ${
          radiationExposure.level === "high"
            ? "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800"
            : radiationExposure.level === "moderate"
            ? "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800"
            : "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800"
        }`}>
          <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
            radiationExposure.level === "high" ? "bg-red-500"
            : radiationExposure.level === "moderate" ? "bg-yellow-500"
            : "bg-green-500"
          }`}>
            <Radiation className="w-2.5 h-2.5 text-white" />
          </div>
          <div className="flex flex-col">
            <Badge className={`text-xs font-medium mb-0.5 px-1 py-0 text-[12px] ${
              radiationExposure.level === "high" ? "bg-red-500 text-white"
              : radiationExposure.level === "moderate" ? "bg-yellow-500 text-white"
              : "bg-green-500 text-white"
            }`}>
              放射線量（直近1年）
            </Badge>
            <span className={`text-xs font-medium truncate max-w-[120px] ${
              radiationExposure.level === "high" ? "text-red-700 dark:text-red-300"
              : radiationExposure.level === "moderate" ? "text-yellow-700 dark:text-yellow-300"
              : "text-green-700 dark:text-green-300"
            }`}>
              {radiationExposure.dose}{radiationExposure.unit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
