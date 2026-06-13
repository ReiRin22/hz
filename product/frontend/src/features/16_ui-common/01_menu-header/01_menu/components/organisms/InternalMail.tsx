"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/atoms/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/card";
import { useState } from "react";
import { MailFilterBar } from "../molecules/MailFilterBar";
import { MailTable } from "../molecules/MailTable";
import { MailPreview } from "../molecules/MailPreview";
import { ComposeMail } from "../molecules/ComposeMail";
import type { Email } from "../../types/internal-mail.type";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

const INITIAL_RECEIVED_EMAILS: Email[] = [
  { id: "1", subject: "代行入力承認のお願い", sender: "看護師 山田花子", date: "12/19 15:27", content: "山田さん\n\n承認いただきました。\n処方については橋口先生割を3日分で対応します。", isRead: false, isDeleted: false },
  { id: "2", subject: "緊急：検査結果の確認依頼", sender: "臨床検査科 佐藤次郎", date: "12/19 14:57", content: "お疲れ様です。\n\n患者ID: 12345 の血液検査において、以下の異常値を検出しました。\n\nCRP: 8.5 mg/dL (基準値: 0.0-0.3)\n白血球数: 12,500 /μL (基準値: 3,500-9,000)\n\n至急ご確認をお願いいたします。", isRead: false, isDeleted: false },
  { id: "3", subject: "CT検査予約変更のお願い", sender: "放射線科 鈴木三郎", date: "12/19 14:27", content: "お疲れ様です。\n\n本日15:00に予約されている患者様のCT検査について、機器メンテナンスのため16:30への変更をお願いできますでしょうか。\n\n患者様への連絡は当科で対応いたします。", isRead: true, isDeleted: false },
  { id: "4", subject: "薬剤供給停止のお知らせ", sender: "薬剤部 高橋花子", date: "12/19 13:57", content: "薬剤部からの重要なお知らせです。\n\n以下の薬剤が製造中止により供給停止となります：\n- ○○錠 50mg（12月末で在庫終了予定）\n- △△カプセル 100mg（1月中旬で在庫終了予定）\n\n代替薬については薬剤部までご相談ください。", isRead: true, isDeleted: false },
  { id: "5", subject: "病棟カンファレンスの日程変更", sender: "看護部 田中美咲", date: "12/18 16:45", content: "看護部からのお知らせです。\n\n来週予定していた病棟カンファレンスを以下の通り変更させていただきます。\n\n変更前: 12月25日（水）14:00-\n変更後: 12月26日（木）14:00-\n場所: 3階カンファレンスルーム\n\nご出席よろしくお願いいたします。", isRead: true, isDeleted: false },
  { id: "6", subject: "新レセプトルールについて", sender: "医事課 山田太郎", date: "12/18 09:12", content: "令和6年度の診療報酬改定に伴い、新しいレセプトルールが適用されます。\n\n主な変更点：\n1. 入院基本料の算定要件の見直し\n2. リハビリテーション料の上限日数変更\n3. 在宅医療関連の新設項目\n\n詳細は添付の資料をご確認ください。", isRead: true, isDeleted: false },
  { id: "7", subject: "【削除済】古い通知", sender: "システム管理", date: "12/10 12:00", content: "この通知は削除されました。", isRead: true, isDeleted: true },
];

const INITIAL_SENT_EMAILS: Email[] = [
  { id: "s1", subject: "Re: CT予約変更のお願い", recipient: "放射線科 鈴木三郎", date: "12/19 14:30", content: "了解いたしました。\n\n16:30への変更で問題ございません。\n患者様への連絡ありがとうございます。", isRead: true, isDeleted: false },
  { id: "s2", subject: "入院患者の検査依頼", recipient: "臨床検査科", date: "12/18 15:30", content: "お世話になっております。\n\n以下の患者様の血液検査をお願いいたします。\n\n患者ID: 54321\n患者名: ○○ ○○\n病棟: 3階西病棟\n検査項目: 血算、生化学一般\n\nよろしくお願いいたします。", isRead: true, isDeleted: false },
  { id: "s3", subject: "カンファレンス資料の送付", recipient: "看護部 田中美咲", date: "12/17 17:00", content: "お疲れ様です。\n\n来週のカンファレンスで使用する資料を添付いたします。\n事前にご確認いただければ幸いです。\n\nよろしくお願いいたします。", isRead: true, isDeleted: false },
];

interface InternalMailProps {
  theme?: ThemeColor;
}

export function InternalMail({ theme }: InternalMailProps) {
  const [showRead, setShowRead] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [newEmailTo, setNewEmailTo] = useState("");
  const [newEmailSubject, setNewEmailSubject] = useState("");
  const [newEmailBody, setNewEmailBody] = useState("");
  const [receivedEmails, setReceivedEmails] = useState<Email[]>(INITIAL_RECEIVED_EMAILS);
  const [sentEmails, setSentEmails] = useState<Email[]>(INITIAL_SENT_EMAILS);

  const filterEmails = (emails: Email[]) =>
    emails.filter((email) => {
      if (!showRead && email.isRead) return false;
      if (!showDeleted && email.isDeleted) return false;
      return true;
    });

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead && email.sender) {
      setReceivedEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, isRead: true } : e));
    }
  };

  const handleSend = () => {
    const newEmail: Email = {
      id: `s${sentEmails.length + 1}`,
      subject: newEmailSubject,
      recipient: newEmailTo,
      date: new Date().toLocaleDateString("ja-JP"),
      content: newEmailBody,
      isRead: true,
      isDeleted: false,
    };
    setSentEmails((prev) => [...prev, newEmail]);
    setIsComposing(false);
    setSelectedEmail(newEmail);
    setNewEmailTo("");
    setNewEmailSubject("");
    setNewEmailBody("");
  };

  const handleCancelCompose = () => {
    setIsComposing(false);
    setNewEmailTo("");
    setNewEmailSubject("");
    setNewEmailBody("");
  };

  const isBlackTheme = theme?.value === "black";
  const cardStyle = {
    backgroundColor: isBlackTheme ? "#0D0D0D" : undefined,
    borderColor: isBlackTheme ? "#404040" : undefined,
  };

  return (
    <Card style={cardStyle}>
      <CardHeader style={{ backgroundColor: isBlackTheme ? "#0D0D0D" : undefined, borderBottomColor: isBlackTheme ? "#404040" : undefined }}>
        <CardTitle style={{ color: isBlackTheme ? "#F9FAFB" : undefined }}>{t.internalMail.title}</CardTitle>
      </CardHeader>
      <CardContent style={{ backgroundColor: isBlackTheme ? "#0D0D0D" : undefined }}>
        {!isComposing ? (
          <Tabs defaultValue="inbox" className="w-full">
            <MailFilterBar
              showRead={showRead}
              showDeleted={showDeleted}
              selectedEmailId={selectedEmail?.id ?? null}
              onShowReadChange={setShowRead}
              onShowDeletedChange={setShowDeleted}
              onComposeClick={() => { setIsComposing(true); setSelectedEmail(null); }}
              theme={theme}
            />
            <TabsList>
              <TabsTrigger value="inbox">{t.internalMail.inbox}</TabsTrigger>
              <TabsTrigger value="sent">{t.internalMail.sent}</TabsTrigger>
            </TabsList>
            <TabsContent value="inbox" className="mt-0">
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: isBlackTheme ? "#333333" : undefined }}>
                <MailTable emails={filterEmails(receivedEmails)} selectedEmailId={selectedEmail?.id ?? null} mode="inbox" onEmailClick={handleEmailClick} theme={theme} />
                <MailPreview selectedEmail={selectedEmail} mode="inbox" theme={theme} />
              </div>
            </TabsContent>
            <TabsContent value="sent" className="mt-0">
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: isBlackTheme ? "#333333" : undefined }}>
                <MailTable emails={filterEmails(sentEmails)} selectedEmailId={selectedEmail?.id ?? null} mode="sent" onEmailClick={handleEmailClick} theme={theme} />
                <MailPreview selectedEmail={selectedEmail} mode="sent" theme={theme} />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <ComposeMail
            to={newEmailTo}
            subject={newEmailSubject}
            body={newEmailBody}
            onToChange={setNewEmailTo}
            onSubjectChange={setNewEmailSubject}
            onBodyChange={setNewEmailBody}
            onSend={handleSend}
            onCancel={handleCancelCompose}
          />
        )}
      </CardContent>
    </Card>
  );
}
