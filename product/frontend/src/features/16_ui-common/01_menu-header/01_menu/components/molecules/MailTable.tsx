import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import type { Email } from "../../types/internal-mail.type";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type MailTableProps = {
  emails: Email[];
  selectedEmailId: string | null;
  mode: "inbox" | "sent";
  onEmailClick: (email: Email) => void;
  theme?: ThemeColor;
};

export function MailTable({ emails, selectedEmailId, mode, onEmailClick, theme }: MailTableProps) {
  const isBlackTheme = theme?.value === "black";
  const headerBg = isBlackTheme ? "#262626" : undefined;
  const headerText = { color: isBlackTheme ? "#E5E7EB" : undefined };
  const borderColor = isBlackTheme ? "#404040" : undefined;
  const listBg = isBlackTheme ? "#1A1A1A" : undefined;

  return (
    <div style={{ backgroundColor: listBg }} className={isBlackTheme ? "" : "bg-green-50"}>
      <table className="w-full">
        <thead>
          <tr
            className={isBlackTheme ? "" : "bg-gray-200"}
            style={{ backgroundColor: headerBg, borderBottomWidth: "1px", borderBottomColor: borderColor }}
          >
            <th className="text-left p-3 font-semibold text-sm" style={headerText}>{t.internalMail.subject}</th>
            <th className="text-left p-3 font-semibold text-sm w-[200px]" style={headerText}>
              {mode === "inbox" ? t.internalMail.from : t.internalMail.to}
            </th>
            <th className="text-left p-3 font-semibold text-sm w-[120px]" style={headerText}>{t.internalMail.date}</th>
          </tr>
        </thead>
      </table>
      <ScrollArea className="h-[180px]">
        <table className="w-full">
          <tbody>
            {emails.map((email) => {
              const isSelected = selectedEmailId === email.id;
              const rowBg = isBlackTheme
                ? isSelected ? "#333333" : (email.isRead ? "#1A1A1A" : "#262626")
                : mode === "inbox" && !email.isRead
                  ? (isSelected ? "#E5E7EB" : "#FFFFFF")
                  : (isSelected ? "rgb(187 247 208)" : undefined);
              return (
                <tr
                  key={email.id}
                  className={`cursor-pointer transition-colors ${email.isDeleted ? "opacity-50 line-through" : ""}`}
                  style={{
                    backgroundColor: rowBg,
                    borderBottomWidth: "1px",
                    borderBottomColor: isBlackTheme ? "#404040" : "rgb(187 247 208)",
                    color: isBlackTheme ? "#E5E7EB" : undefined,
                  }}
                  onClick={() => onEmailClick(email)}
                >
                  <td className="p-3 text-sm">
                    {mode === "inbox" && !email.isRead && <span className="text-blue-600 mr-2">●</span>}
                    <span className={mode === "inbox" && !email.isRead ? "font-semibold" : ""}>{email.subject}</span>
                  </td>
                  <td className="p-3 text-sm w-[200px]">{mode === "inbox" ? email.sender : email.recipient}</td>
                  <td className="p-3 text-sm w-[120px]" style={{ color: isBlackTheme ? "#9CA3AF" : "#4B5563" }}>
                    {email.date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
