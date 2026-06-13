import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type MailFilterBarProps = {
  showRead: boolean;
  showDeleted: boolean;
  selectedEmailId: string | null;
  onShowReadChange: (checked: boolean) => void;
  onShowDeletedChange: (checked: boolean) => void;
  onComposeClick: () => void;
  theme?: ThemeColor;
};

export function MailFilterBar({
  showRead,
  showDeleted,
  selectedEmailId,
  onShowReadChange,
  onShowDeletedChange,
  onComposeClick,
  theme,
}: MailFilterBarProps) {
  const labelStyle = { color: theme?.value === "black" ? "#E5E7EB" : undefined };

  return (
    <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-read"
            checked={showRead}
            onCheckedChange={(checked) => onShowReadChange(checked as boolean)}
          />
          <label htmlFor="show-read" className="text-sm cursor-pointer whitespace-nowrap" style={labelStyle}>
            {t.mailFilterBar.showRead}
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-deleted"
            checked={showDeleted}
            onCheckedChange={(checked) => onShowDeletedChange(checked as boolean)}
          />
          <label htmlFor="show-deleted" className="text-sm cursor-pointer whitespace-nowrap" style={labelStyle}>
            {t.mailFilterBar.showDeleted}
          </label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={onComposeClick}>
          {t.mailFilterBar.compose}
        </Button>
        <Button size="sm" variant="outline" disabled={!selectedEmailId}>
          {t.mailFilterBar.reply}
        </Button>
      </div>
    </div>
  );
}
