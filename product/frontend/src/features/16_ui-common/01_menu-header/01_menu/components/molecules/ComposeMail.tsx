import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Textarea } from "@/shared/components/atoms/textarea";
import { Mail, ArrowLeft, Send, X, UserPlus } from "lucide-react";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type ComposeMailProps = {
  to: string;
  subject: string;
  body: string;
  onToChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
};

export function ComposeMail({
  to,
  subject,
  body,
  onToChange,
  onSubjectChange,
  onBodyChange,
  onSend,
  onCancel,
}: ComposeMailProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <span className="font-semibold">{t.composeMail.title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          {t.composeMail.backToList}
        </Button>
      </div>
      <div className="p-6 space-y-4 bg-gray-50">
        <div>
          <label className="block text-sm mb-2">{t.composeMail.toLabel}</label>
          <div className="flex gap-2">
            <Input
              placeholder={t.composeMail.toPlaceholder}
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-1" />
              {t.composeMail.toSelectButton}
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm mb-2">{t.composeMail.subjectLabel}</label>
          <Input
            placeholder={t.composeMail.subjectPlaceholder}
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-2">{t.composeMail.bodyLabel}</label>
          <Textarea
            placeholder={t.composeMail.bodyPlaceholder}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button size="lg" className="bg-gray-600 hover:bg-gray-700 text-white" onClick={onSend}>
            <Send className="h-4 w-4 mr-2" />
            {t.composeMail.send}
          </Button>
          <Button size="lg" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            {i18n.common.buttons.cancel}
          </Button>
        </div>
      </div>
    </div>
  );
}
