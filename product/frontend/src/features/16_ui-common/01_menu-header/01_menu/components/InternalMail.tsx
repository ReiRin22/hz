import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/atoms/tabs";
import { useState } from "react";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Mail, Reply, ArrowLeft, Send, X, UserPlus } from "lucide-react";
import { Input } from "@/shared/components/atoms/input";
import { Textarea } from "@/shared/components/atoms/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/card";

interface Email {
  id: string;
  subject: string;
  sender?: string;
  recipient?: string;
  date: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
}

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

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

  const receivedEmails: Email[] = [
    {
      id: "1",
      subject: "代行入力承認のお願い",
      sender: "看護師 山田花子",
      date: "12/19 15:27",
      content: "山田さん\n\n承認いただきました。\n処方については橋口先生割を3日分で対応します。",
      isRead: false,
      isDeleted: false
    },
    {
      id: "2",
      subject: "緊急：検査結果の確認依頼",
      sender: "臨床検査科 佐藤次郎",
      date: "12/19 14:57",
      content: "お疲れ様です。\n\n患者ID: 12345 の血液検査において、以下の異常値を検出しました。\n\nCRP: 8.5 mg/dL (基準値: 0.0-0.3)\n白血球数: 12,500 /μL (基準値: 3,500-9,000)\n\n至急ご確認をお願いいたします。",
      isRead: false,
      isDeleted: false
    },
    {
      id: "3",
      subject: "CT検査予約変更のお願い",
      sender: "放射線科 鈴木三郎",
      date: "12/19 14:27",
      content: "お疲れ様です。\n\n本日15:00に予約されている患者様のCT検査について、機器メンテナンスのため16:30への変更をお願いできますでしょうか。\n\n患者様への連絡は当科で対応いたします。",
      isRead: true,
      isDeleted: false
    },
    {
      id: "4",
      subject: "薬剤供給停止のお知らせ",
      sender: "薬剤部 高橋花子",
      date: "12/19 13:57",
      content: "薬剤部からの重要なお知らせです。\n\n以下の薬剤が製造中止により供給停止となります：\n- ○○錠 50mg（12月末で在庫終了予定）\n- △△カプセル 100mg（1月中旬で在庫終了予定）\n\n代替薬については薬剤部までご相談ください。",
      isRead: true,
      isDeleted: false
    },
    {
      id: "5",
      subject: "病棟カンファレンスの日程変更",
      sender: "看護部 田中美咲",
      date: "12/18 16:45",
      content: "看護部からのお知らせです。\n\n来週予定していた病棟カンファレンスを以下の通り変更させていただきます。\n\n変更前: 12月25日（水）14:00-\n変更後: 12月26日（木）14:00-\n場所: 3階カンファレンスルーム\n\nご出席よろしくお願いいたします。",
      isRead: true,
      isDeleted: false
    },
    {
      id: "6",
      subject: "新レセプトルールについて",
      sender: "医事課 山田太郎",
      date: "12/18 09:12",
      content: "令和6年度の診療報酬改定に伴い、新しいレセプトルールが適用されます。\n\n主な変更点：\n1. 入院基本料の算定要件の見直し\n2. リハビリテーション料の上限日数変更\n3. 在宅医療関連の新設項目\n\n詳細は添付の資料をご確認ください。",
      isRead: true,
      isDeleted: false
    },
    {
      id: "7",
      subject: "【削除済】古い通知",
      sender: "システム管理",
      date: "12/10 12:00",
      content: "この通知は削除されました。",
      isRead: true,
      isDeleted: true
    }
  ];

  const sentEmails: Email[] = [
    {
      id: "s1",
      subject: "Re: CT予約変更のお願い",
      recipient: "放射線科 鈴木三郎",
      date: "12/19 14:30",
      content: "了解いたしました。\n\n16:30への変更で問題ございません。\n患者様への連絡ありがとうございます。",
      isRead: true,
      isDeleted: false
    },
    {
      id: "s2",
      subject: "入院患者の検査依頼",
      recipient: "臨床検査科",
      date: "12/18 15:30",
      content: "お世話になっております。\n\n以下の患者様の血液検査をお願いいたします。\n\n患者ID: 54321\n患者名: ○○ ○○\n病棟: 3階西病棟\n検査項目: 血算、生化学一般\n\nよろしくお願いいたします。",
      isRead: true,
      isDeleted: false
    },
    {
      id: "s3",
      subject: "カンファレンス資料の送付",
      recipient: "看護部 田中美咲",
      date: "12/17 17:00",
      content: "お疲れ様です。\n\n来週のカンファレンスで使用する資料を添付いたします。\n事前にご確認いただければ幸いです。\n\nよろしくお願いいたします。",
      isRead: true,
      isDeleted: false
    }
  ];

  const filterEmails = (emails: Email[]) => {
    return emails.filter(email => {
      if (!showRead && email.isRead) return false;
      if (!showDeleted && email.isDeleted) return false;
      return true;
    });
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    // 開封済みにする（受信メールの場合）
    if (!email.isRead && email.sender) {
      email.isRead = true;
    }
  };

  const handleComposeClick = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleSendClick = () => {
    const newEmail: Email = {
      id: `s${sentEmails.length + 1}`,
      subject: newEmailSubject,
      recipient: newEmailTo,
      date: new Date().toLocaleString(),
      content: newEmailBody,
      isRead: true,
      isDeleted: false
    };
    sentEmails.push(newEmail);
    setIsComposing(false);
    setSelectedEmail(newEmail);
    setNewEmailTo("");
    setNewEmailSubject("");
    setNewEmailBody("");
  };

  return (
    <Card style={{
      backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined,
      borderColor: theme?.value === 'black' ? '#404040' : undefined
    }}>
      <CardHeader style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined,
        borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
      }}>
        <CardTitle style={{
          color: theme?.value === 'black' ? '#F9FAFB' : undefined
        }}>院内メール</CardTitle>
      </CardHeader>
      <CardContent style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined
      }}>
        {!isComposing ? (
          <Tabs defaultValue="inbox" className="w-full">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <TabsList>
                <TabsTrigger value="inbox">受信箱</TabsTrigger>
                <TabsTrigger value="sent">送信履歴</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="show-read" 
                    checked={showRead}
                    onCheckedChange={(checked) => setShowRead(checked as boolean)}
                  />
                  <label htmlFor="show-read" className="text-sm cursor-pointer whitespace-nowrap" style={{
                    color: theme?.value === 'black' ? '#E5E7EB' : undefined
                  }}>
                    開封済を表示
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="show-deleted" 
                    checked={showDeleted}
                    onCheckedChange={(checked) => setShowDeleted(checked as boolean)}
                  />
                  <label htmlFor="show-deleted" className="text-sm cursor-pointer whitespace-nowrap" style={{
                    color: theme?.value === 'black' ? '#E5E7EB' : undefined
                  }}>
                    削除済を表示
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={handleComposeClick}>
                  新規
                </Button>
                <Button size="sm" variant="outline" disabled={!selectedEmail}>
                  <Reply className="h-4 w-4 mr-1" />
                  返信
                </Button>
              </div>
            </div>

            <TabsContent value="inbox" className="mt-0">
              <div className="border rounded-lg overflow-hidden" style={{
                borderColor: theme?.value === 'black' ? '#333333' : undefined
              }}>
                {/* メールリスト - 緑色背景 */}
                <div style={{
                  backgroundColor: theme?.value === 'black' ? '#1A1A1A' : undefined
                }} className={theme?.value === 'black' ? '' : 'bg-green-50'}>
                  <table className="w-full">
                    <thead>
                      <tr className={theme?.value === 'black' ? '' : 'bg-gray-200'} style={{
                        backgroundColor: theme?.value === 'black' ? '#262626' : undefined,
                        borderBottomWidth: '1px',
                        borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
                      }}>
                        <th className="text-left p-3 font-semibold text-sm" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>件名</th>
                        <th className="text-left p-3 font-semibold text-sm w-[200px]" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>差出人</th>
                        <th className="text-left p-3 font-semibold text-sm w-[120px]" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>日時</th>
                      </tr>
                    </thead>
                  </table>
                  <ScrollArea className="h-[180px]">
                    <table className="w-full">
                      <tbody>
                        {filterEmails(receivedEmails).map((email) => {
                          const isBlackTheme = theme?.value === 'black';
                          return (
                            <tr 
                              key={email.id}
                              className={`cursor-pointer transition-colors ${email.isDeleted ? 'opacity-50 line-through' : ''}`}
                              style={{
                                backgroundColor: isBlackTheme 
                                  ? (selectedEmail?.id === email.id ? '#333333' : email.isRead ? '#1A1A1A' : '#262626')
                                  : (!email.isRead 
                                      ? (selectedEmail?.id === email.id ? '#E5E7EB' : '#FFFFFF')
                                      : (selectedEmail?.id === email.id ? 'rgb(187 247 208)' : undefined)),
                                borderBottomWidth: '1px',
                                borderBottomColor: isBlackTheme ? '#404040' : 'rgb(187 247 208)',
                                color: isBlackTheme ? '#E5E7EB' : undefined
                              }}
                              onClick={() => handleEmailClick(email)}
                            >
                              <td className="p-3 text-sm">
                                {!email.isRead && <span className="text-blue-600 mr-2">●</span>}
                                <span className={!email.isRead ? 'font-semibold' : ''}>{email.subject}</span>
                              </td>
                              <td className="p-3 text-sm w-[200px]">{email.sender}</td>
                              <td className="p-3 text-sm w-[120px]" style={{
                                color: isBlackTheme ? '#9CA3AF' : '#4B5563'
                              }}>{email.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>

                {/* メール本文プレビュー - ピンク色背景 */}
                <div className={`p-4 border-t ${theme?.value === 'black' ? '' : (selectedEmail ? 'bg-pink-50' : 'bg-gray-100')}`} style={{
                  backgroundColor: theme?.value === 'black' ? (selectedEmail ? '#1A1A1A' : '#0D0D0D') : undefined,
                  borderTopColor: theme?.value === 'black' ? '#404040' : undefined
                }}>
                  {selectedEmail ? (
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        <div className="text-sm font-semibold" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>
                          {selectedEmail.subject}
                        </div>
                        <div className="text-xs space-y-1" style={{
                          color: theme?.value === 'black' ? '#9CA3AF' : '#4B5563'
                        }}>
                          <div>差出人: {selectedEmail.sender || '自分'}</div>
                          <div>宛先: {selectedEmail.recipient || '自分'}</div>
                        </div>
                        <div className="text-xs text-right" style={{
                          color: theme?.value === 'black' ? '#6B7280' : '#6B7280'
                        }}>
                          {selectedEmail.date}
                        </div>
                        <div className="pt-2 border-t" style={{
                          borderTopColor: theme?.value === 'black' ? '#404040' : 'rgb(252 165 165)'
                        }}>
                          <div className="whitespace-pre-wrap text-sm" style={{
                            color: theme?.value === 'black' ? '#E5E7EB' : undefined
                          }}>{selectedEmail.content}</div>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 h-[180px] flex items-center justify-center" style={{
                      color: theme?.value === 'black' ? '#6B7280' : '#6B7280'
                    }}>
                      メールを選択してください
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sent" className="mt-0">
              <div className="border rounded-lg overflow-hidden" style={{
                borderColor: theme?.value === 'black' ? '#333333' : undefined
              }}>
                {/* メールリスト - 緑色背景 */}
                <div style={{
                  backgroundColor: theme?.value === 'black' ? '#1A1A1A' : undefined
                }} className={theme?.value === 'black' ? '' : 'bg-green-50'}>
                  <table className="w-full">
                    <thead>
                      <tr className={theme?.value === 'black' ? '' : 'bg-gray-200'} style={{
                        backgroundColor: theme?.value === 'black' ? '#262626' : undefined,
                        borderBottomWidth: '1px',
                        borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
                      }}>
                        <th className="text-left p-3 font-semibold text-sm" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>件名</th>
                        <th className="text-left p-3 font-semibold text-sm w-[200px]" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>宛先</th>
                        <th className="text-left p-3 font-semibold text-sm w-[120px]" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>日時</th>
                      </tr>
                    </thead>
                  </table>
                  <ScrollArea className="h-[180px]">
                    <table className="w-full">
                      <tbody>
                        {filterEmails(sentEmails).map((email) => {
                          const isBlackTheme = theme?.value === 'black';
                          return (
                            <tr 
                              key={email.id}
                              className={`cursor-pointer transition-colors ${email.isDeleted ? 'opacity-50 line-through' : ''}`}
                              style={{
                                backgroundColor: isBlackTheme 
                                  ? (selectedEmail?.id === email.id ? '#333333' : '#1A1A1A')
                                  : (selectedEmail?.id === email.id ? 'rgb(187 247 208)' : undefined),
                                borderBottomWidth: '1px',
                                borderBottomColor: isBlackTheme ? '#404040' : 'rgb(187 247 208)',
                                color: isBlackTheme ? '#E5E7EB' : undefined
                              }}
                              onClick={() => handleEmailClick(email)}
                            >
                              <td className="p-3 text-sm">{email.subject}</td>
                              <td className="p-3 text-sm w-[200px]">{email.recipient}</td>
                              <td className="p-3 text-sm w-[120px]" style={{
                                color: isBlackTheme ? '#9CA3AF' : '#4B5563'
                              }}>{email.date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </ScrollArea>
                </div>

                {/* メール本文プレビュー - ピンク色背景 */}
                <div className={`p-4 border-t ${theme?.value === 'black' ? '' : (selectedEmail ? 'bg-pink-50' : 'bg-gray-100')}`} style={{
                  backgroundColor: theme?.value === 'black' ? (selectedEmail ? '#1A1A1A' : '#0D0D0D') : undefined,
                  borderTopColor: theme?.value === 'black' ? '#404040' : undefined
                }}>
                  {selectedEmail ? (
                    <ScrollArea className="h-[180px]">
                      <div className="space-y-3">
                        <div className="text-sm font-semibold" style={{
                          color: theme?.value === 'black' ? '#E5E7EB' : undefined
                        }}>
                          {selectedEmail.subject}
                        </div>
                        <div className="text-xs space-y-1" style={{
                          color: theme?.value === 'black' ? '#9CA3AF' : '#4B5563'
                        }}>
                          <div>差出人: 自分</div>
                          <div>宛先: {selectedEmail.recipient}</div>
                        </div>
                        <div className="text-xs text-right" style={{
                          color: theme?.value === 'black' ? '#6B7280' : '#6B7280'
                        }}>
                          {selectedEmail.date}
                        </div>
                        <div className="pt-2 border-t" style={{
                          borderTopColor: theme?.value === 'black' ? '#404040' : 'rgb(252 165 165)'
                        }}>
                          <div className="whitespace-pre-wrap text-sm" style={{
                            color: theme?.value === 'black' ? '#E5E7EB' : undefined
                          }}>{selectedEmail.content}</div>
                        </div>
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-12 h-[180px] flex items-center justify-center" style={{
                      color: theme?.value === 'black' ? '#6B7280' : '#6B7280'
                    }}>
                      メールを選択してください
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            {/* ヘッダー */}
            <div className="bg-white border-b p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="font-semibold">新規メール作成</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsComposing(false)}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                一覧に戻る
              </Button>
            </div>

            {/* フォーム */}
            <div className="p-6 space-y-4 bg-gray-50">
              <div>
                <label className="block text-sm mb-2">宛先</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="宛先を入力してください"
                    value={newEmailTo}
                    onChange={(e) => setNewEmailTo(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    宛先を選択
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">件名</label>
                <Input
                  placeholder="件名を入力してください"
                  value={newEmailSubject}
                  onChange={(e) => setNewEmailSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-2">本文</label>
                <Textarea
                  placeholder="本文を入力してください"
                  value={newEmailBody}
                  onChange={(e) => setNewEmailBody(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>

              {/* ボタン */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button 
                  size="lg" 
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  onClick={handleSendClick}
                >
                  <Send className="h-4 w-4 mr-2" />
                  送信
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    setIsComposing(false);
                    setNewEmailTo("");
                    setNewEmailSubject("");
                    setNewEmailBody("");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}