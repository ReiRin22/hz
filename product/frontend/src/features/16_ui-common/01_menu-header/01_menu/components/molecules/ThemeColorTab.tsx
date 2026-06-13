import { Label } from "@/shared/components/atoms/label";
import { Check } from "lucide-react";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

const THEME_COLORS: ThemeColor[] = [
  { name: t.themeColors.blue, value: "blue", primary: "#3B82F6", secondary: "#DBEAFE" },
  { name: t.themeColors.green, value: "green", primary: "#10B981", secondary: "#D1FAE5" },
  { name: t.themeColors.purple, value: "purple", primary: "#8B5CF6", secondary: "#EDE9FE" },
  { name: t.themeColors.pink, value: "pink", primary: "#EC4899", secondary: "#FCE7F3" },
  { name: t.themeColors.orange, value: "orange", primary: "#F59E0B", secondary: "#FEF3C7" },
  { name: t.themeColors.red, value: "red", primary: "#EF4444", secondary: "#FEE2E2" },
  { name: t.themeColors.white, value: "white", primary: "#64748B", secondary: "#F8FAFC" },
  { name: t.themeColors.black, value: "black", primary: "#9CA3AF", secondary: "#0D0D0D" },
];

type ThemeColorTabProps = {
  tempTheme: ThemeColor;
  onThemeSelect: (theme: ThemeColor) => void;
};

export function ThemeColorTab({ tempTheme, onThemeSelect }: ThemeColorTabProps) {
  return (
    <div>
      <Label className="mb-3 block">{t.themeColor.selectLabel}</Label>
      <div className="grid grid-cols-2 gap-3">
        {THEME_COLORS.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onThemeSelect(theme)}
            className={`p-4 rounded-lg border-2 transition-all ${
              tempTheme.value === theme.value ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.primary }} />
                <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.secondary }} />
              </div>
              <span className="font-medium">{theme.name}</span>
              {tempTheme.value === theme.value && <Check className="ml-auto h-5 w-5 text-blue-500" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
