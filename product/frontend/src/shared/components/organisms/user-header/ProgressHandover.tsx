import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Textarea } from "@shared/components/atoms/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { Avatar, AvatarFallback } from "@shared/components/atoms/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@shared/components/atoms/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/atoms/select";
import { Clock, User, AlertCircle, CheckCircle, Plus, Calendar, MessageSquare, FileText, Eye, EyeOff, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface ProgressRecord {
  id: string;
  date: string;
  time: string;
  type: "progress" | "observation" | "treatment" | "vital";
  title: string;
  content: string;
  author: string;
  department: string;
  isImportant: boolean;
}

interface HandoverItem {
  id: string;
  date: string;
  time: string;
  shift: "day" | "evening" | "night";
  fromUser: string;
  toUser: string;
  priority: "high" | "medium" | "low";
  category: "patient-condition" | "treatment" | "medication" | "family" | "other";
  title: string;
  content: string;
  isRead: boolean;
  isResolved: boolean;
}

interface ProgressHandoverProps {
  progressRecords: ProgressRecord[];
  handoverItems: HandoverItem[];
  onAddProgress: (record: Omit<ProgressRecord, "id" | "date" | "time">) => void;
  onAddHandover: (item: Omit<HandoverItem, "id" | "date" | "time">) => void;
  onMarkAsRead: (id: string) => void;
  onMarkAsResolved: (id: string) => void;
  currentUser: { name: string; role: string; department: string };
}

export function ProgressHandover({
  progressRecords,
  handoverItems,
  onAddProgress,
  onAddHandover,
  onMarkAsRead,
  onMarkAsResolved,
  currentUser,
}: ProgressHandoverProps) {
  const [activeSubTab, setActiveSubTab] = useState("progress");
  const [newProgressRecord, setNewProgressRecord] = useState({
    type: "progress" as const,
    title: "",
    content: "",
    author: currentUser.name,
    department: currentUser.department,
    isImportant: false,
  });
  const [newHandoverItem, setNewHandoverItem] = useState({
    shift: "day" as const,
    fromUser: currentUser.name,
    toUser: "",
    priority: "medium" as const,
    category: "patient-condition" as const,
    title: "",
    content: "",
    isRead: false,
    isResolved: false,
  });
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showHandoverDialog, setShowHandoverDialog] = useState(false);

  const getProgressTypeColor = (type: string) => {
    const colors = {
      progress: "medical-primary",
      observation: "medical-secondary",
      treatment: "medical-tests",
      vital: "medical-vitals",
    };
    return colors[type as keyof typeof colors] || "medical-accent";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
      low: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      "patient-condition": User,
      treatment: FileText,
      medication: AlertCircle,
      family: MessageSquare,
      other: Calendar,
    };
    const IconComponent = icons[category as keyof typeof icons] || Calendar;
    return <IconComponent className="w-4 h-4" />;
  };

  const getShiftBadge = (shift: string) => {
    const shifts = {
      day: { label: "日勤", color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" },
      evening: { label: "準夜", color: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300" },
      night: { label: "深夜", color: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-300" },
    };
    const shiftInfo = shifts[shift as keyof typeof shifts] || shifts.day;
    return <Badge className={shiftInfo.color}>{shiftInfo.label}</Badge>;
  };

  const handleAddProgress = () => {
    if (!newProgressRecord.title.trim() || !newProgressRecord.content.trim()) {
      toast.error("タイトルと内容を入力してください");
      return;
    }
    
    onAddProgress(newProgressRecord);
    toast.success("経過記録を追加しました");
    setNewProgressRecord({
      type: "progress",
      title: "",
      content: "",
      author: currentUser.name,
      department: currentUser.department,
      isImportant: false,
    });
    setShowProgressDialog(false);
  };

  const handleAddHandover = () => {
    if (!newHandoverItem.title.trim() || !newHandoverItem.content.trim() || !newHandoverItem.toUser.trim()) {
      toast.error("すべての必須項目を入力してください");
      return;
    }
    
    onAddHandover(newHandoverItem);
    toast.success("申し送り事項を追加しました");
    setNewHandoverItem({
      shift: "day",
      fromUser: currentUser.name,
      toUser: "",
      priority: "medium",
      category: "patient-condition",
      title: "",
      content: "",
      isRead: false,
      isResolved: false,
    });
    setShowHandoverDialog(false);
  };

  const unreadHandovers = handoverItems.filter(item => !item.isRead);
  const unresolvedHandovers = handoverItems.filter(item => !item.isResolved);

  return (
    <div className="space-y-4">
      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="medical-bg-primary border medical-border-primary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 medical-text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">経過記録</div>
                <div className="text-xl font-bold medical-text-primary">{progressRecords.length}件</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="medical-bg-secondary border medical-border-secondary">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 medical-text-secondary" />
              <div>
                <div className="text-sm text-muted-foreground">申し送り</div>
                <div className="text-xl font-bold medical-text-secondary">{handoverItems.length}件</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <EyeOff className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-sm text-muted-foreground">未読申し送り</div>
                <div className="text-xl font-bold text-red-600">{unreadHandovers.length}件</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border border-orange-200 dark:bg-orange-950 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-sm text-muted-foreground">未解決事項</div>
                <div className="text-xl font-bold text-orange-600">{unresolvedHandovers.length}件</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <div className="flex justify-between items-center">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>経過記録</span>
            </TabsTrigger>
            <TabsTrigger value="handover" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>申し送り</span>
              {unreadHandovers.length > 0 && (
                <Badge className="bg-red-500 text-white ml-1">
                  {unreadHandovers.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex space-x-2">
            <AlertDialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
              <AlertDialogTrigger asChild>
                <Button className="medical-primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  経過記録追加
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>新しい経過記録</AlertDialogTitle>
                  <AlertDialogDescription>
                    患者の経過や観察事項を記録してください
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">記録種別</label>
                      <Select value={newProgressRecord.type} onValueChange={(value: any) => setNewProgressRecord(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="progress">経過記録</SelectItem>
                          <SelectItem value="observation">観察事項</SelectItem>
                          <SelectItem value="treatment">治療経過</SelectItem>
                          <SelectItem value="vital">バイタル変化</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">記録者</label>
                      <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                        {currentUser.name} ({currentUser.department})
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">タイトル</label>
                    <input
                      type="text"
                      value={newProgressRecord.title}
                      onChange={(e) => setNewProgressRecord(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 border rounded focus-ring"
                      placeholder="記録のタイトルを入力"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">内容</label>
                    <Textarea
                      value={newProgressRecord.content}
                      onChange={(e) => setNewProgressRecord(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[120px] resize-none"
                      placeholder="詳細な経過や観察事項を記録してください"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="important"
                      checked={newProgressRecord.isImportant}
                      onChange={(e) => setNewProgressRecord(prev => ({ ...prev, isImportant: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="important" className="text-sm">重要な記録として登録</label>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddProgress} className="medical-primary">
                    記録を追加
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showHandoverDialog} onOpenChange={setShowHandoverDialog}>
              <AlertDialogTrigger asChild>
                <Button className="medical-secondary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  申し送り追加
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>新しい申し送り事項</AlertDialogTitle>
                  <AlertDialogDescription>
                    次のシフト担当者への重要な申し送り事項を記録してください
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">シフト</label>
                      <Select value={newHandoverItem.shift} onValueChange={(value: any) => setNewHandoverItem(prev => ({ ...prev, shift: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">日勤</SelectItem>
                          <SelectItem value="evening">準夜</SelectItem>
                          <SelectItem value="night">深夜</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">優先度</label>
                      <Select value={newHandoverItem.priority} onValueChange={(value: any) => setNewHandoverItem(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">カテゴリ</label>
                      <Select value={newHandoverItem.category} onValueChange={(value: any) => setNewHandoverItem(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient-condition">患者状態</SelectItem>
                          <SelectItem value="treatment">治療</SelectItem>
                          <SelectItem value="medication">服薬</SelectItem>
                          <SelectItem value="family">家族対応</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">申し送り者</label>
                      <div className="text-sm text-muted-foreground p-2 bg-gray-50 rounded">
                        {currentUser.name}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">申し送り先 *</label>
                      <input
                        type="text"
                        value={newHandoverItem.toUser}
                        onChange={(e) => setNewHandoverItem(prev => ({ ...prev, toUser: e.target.value }))}
                        className="w-full p-2 border rounded focus-ring"
                        placeholder="担当者名を入力"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">タイトル *</label>
                    <input
                      type="text"
                      value={newHandoverItem.title}
                      onChange={(e) => setNewHandoverItem(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 border rounded focus-ring"
                      placeholder="申し送り事項のタイトル"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">内容 *</label>
                    <Textarea
                      value={newHandoverItem.content}
                      onChange={(e) => setNewHandoverItem(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[120px] resize-none"
                      placeholder="申し送り事項の詳細を記録してください"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction onClick={handleAddHandover} className="medical-secondary">
                    申し送りを追加
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <TabsContent value="progress" className="mt-4">
          <div className="space-y-3">
            {progressRecords.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">経過記録がありません</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    「経過記録追加」ボタンから新しい記録を作成してください
                  </p>
                </CardContent>
              </Card>
            ) : (
              progressRecords.map((record) => (
                <Card key={record.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getProgressTypeColor(record.type)}>
                            {record.type === "progress" && "経過記録"}
                            {record.type === "observation" && "観察事項"}
                            {record.type === "treatment" && "治療経過"}
                            {record.type === "vital" && "バイタル変化"}
                          </Badge>
                          {record.isImportant && (
                            <Badge variant="destructive" className="text-xs">
                              重要
                            </Badge>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{record.date} {record.time}</span>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{record.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {record.content}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{record.author} ({record.department})</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="handover" className="mt-4">
          <div className="space-y-3">
            {handoverItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">申し送り事項がありません</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    「申し送り追加」ボタンから新しい申し送りを作成してください
                  </p>
                </CardContent>
              </Card>
            ) : (
              handoverItems.map((item) => (
                <Card key={item.id} className={`card-hover ${!item.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            優先度：{item.priority === "high" ? "高" : item.priority === "medium" ? "中" : "低"}
                          </Badge>
                          {getShiftBadge(item.shift)}
                          <div className="flex items-center space-x-1">
                            {getCategoryIcon(item.category)}
                            <span className="text-xs text-muted-foreground">
                              {item.category === "patient-condition" && "患者状態"}
                              {item.category === "treatment" && "治療"}
                              {item.category === "medication" && "服薬"}
                              {item.category === "family" && "家族対応"}
                              {item.category === "other" && "その他"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{item.date} {item.time}</span>
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {item.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {item.fromUser} → {item.toUser}
                          </div>
                          <div className="flex items-center space-x-2">
                            {!item.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onMarkAsRead(item.id)}
                                className="text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                既読にする
                              </Button>
                            )}
                            {!item.isResolved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onMarkAsResolved(item.id)}
                                className="text-xs medical-text-secondary"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                解決済み
                              </Button>
                            )}
                            {item.isResolved && (
                              <Badge className="medical-secondary text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                解決済み
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}