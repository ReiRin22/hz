import { Badge } from "@/shared/components/atoms/badge";
import type { DoctorUnapproved } from "../../assets/proxyInputData";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type DoctorBadgesProps = {
  doctorSummary: DoctorUnapproved[];
  theme: ThemeColor;
};

export function DoctorBadges({ doctorSummary, theme }: DoctorBadgesProps) {
  const isBlackTheme = theme.value === "black";
  return (
    <div
      className="flex items-center gap-3 flex-wrap px-4 py-3 rounded-lg border-2 shadow-sm"
      style={{
        backgroundColor: isBlackTheme ? "#1A1A1A" : "white",
        borderColor: theme.primary,
      }}
    >
      <span className="font-semibold" style={{ color: theme.primary }}>{t.doctorBadges.unapprovedLabel}</span>
      {doctorSummary.map((doctor) => (
        <div
          key={doctor.doctorId}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border"
          style={{
            background: isBlackTheme ? "#262626" : `linear-gradient(to right, ${theme.secondary}, ${theme.secondary})`,
            borderColor: theme.primary,
            color: isBlackTheme ? "#E5E7EB" : undefined,
          }}
        >
          <span className="font-medium" style={{ color: isBlackTheme ? "#E5E7EB" : "#1F2937" }}>
            {doctor.doctorName}
          </span>
          <Badge
            variant={doctor.unapprovedCount > 0 ? "destructive" : "secondary"}
            className={doctor.unapprovedCount > 0 ? "bg-red-600 hover:bg-red-700 text-white font-semibold px-2.5 py-0.5" : ""}
          >
            {doctor.unapprovedCount}
          </Badge>
        </div>
      ))}
    </div>
  );
}
