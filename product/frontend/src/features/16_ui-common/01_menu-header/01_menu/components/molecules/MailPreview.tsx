import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import type { Email } from "../../types/internal-mail.type";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type MailPreviewProps = {
  selectedEmail: Email | null;
  mode: "inbox" | "sent";
  theme?: ThemeColor;
};

export function MailPreview({ selectedEmail, mode, theme }: MailPreviewProps) {
  const isBlackTheme = theme?.value === "black";
  const wrapperBg = isBlackTheme
    ? (selectedEmail ? "#1A1A1A" : "#0D0D0D")
    : undefined;
  const wrapperClass = `p-4 border-t ${
    isBlackTheme ? "" : selectedEmail ? "bg-pink-50" : "bg-gray-100"
  }`;

  return (
    <div
      className={wrapperClass}
      style={{ backgroundColor: wrapperBg, borderTopColor: isBlackTheme ? "#404040" : undefined }}
    >
      {selectedEmail ? (
        <ScrollArea className="h-[180px]">
          <div className="space-y-3">
            <div className="text-sm font-semibold" style={{ color: isBlackTheme ? "#E5E7EB" : undefined }}>
              {selectedEmail.subject}
            </div>
            <div className="text-xs space-y-1" style={{ color: isBlackTheme ? "#9CA3AF" : "#4B5563" }}>
              <div>{t.internalMail.sender}{mode === "inbox" ? (selectedEmail.sender ?? t.internalMail.self) : t.internalMail.self}</div>
              <div>{t.internalMail.recipient}{mode === "sent" ? selectedEmail.recipient : t.internalMail.self}</div>
            </div>
            <div className="text-xs text-right" style={{ color: "#6B7280" }}>
              {selectedEmail.date}
            </div>
            <div
              className="pt-2 border-t"
              style={{ borderTopColor: isBlackTheme ? "#404040" : "rgb(252 165 165)" }}
            >
              <div className="whitespace-pre-wrap text-sm" style={{ color: isBlackTheme ? "#E5E7EB" : undefined }}>
                {selectedEmail.content}
              </div>
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div
          className="text-center py-12 h-[180px] flex items-center justify-center"
          style={{ color: "#6B7280" }}
        >
          {t.internalMail.selectMailPrompt}
        </div>
      )}
    </div>
  );
}
