import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Button } from "@shared/components/atoms/button";
import { Input } from "@shared/components/atoms/input";
import { Textarea } from "@shared/components/atoms/textarea";
import { Label } from "@shared/components/atoms/label";
import { ScrollArea } from "@shared/components/atoms/scroll-area";
import { Card, CardContent } from "@shared/components/atoms/card";
import { MessageSquare, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

export interface MyComment {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface MyCommentManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentsUpdate: (comments: MyComment[]) => void;
}

const STORAGE_KEY = "harz_my_comments";

// LocalStorageからコメントを読み込む
const loadCommentsFromStorage = (): MyComment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("コメント読み込みエラー:", error);
    toast.error("コメントの読み込みに失敗しました");
  }
  
  // デフォルトのコメント
  return [
    { 
      id: 'my1', 
      title: '定期検査フォロー', 
      content: '次回検査: CBC, CRP, HbA1c\n外来予約: 4週間後',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'my2', 
      title: '薬剤調整', 
      content: '降圧薬の用量調整を検討\nBP目標: <130/80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'my3', 
      title: '生活指導', 
      content: '食事療法: 減塩指導\n運動療法: ウォーキング30分/日',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'my4', 
      title: '緊急時対応', 
      content: '胸痛時: ニトロ舌下\n救急搬送基準: 5分持続',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: 'my5', 
      title: '専門医紹介', 
      content: '循環器科紹介状作成予定\n予約調整中',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
  ];
};

// LocalStorageにコメントを保存
const saveCommentsToStorage = (comments: MyComment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch (error) {
    console.error("コメント保存エラー:", error);
    toast.error("コメントの保存に失敗しました");
  }
};

export function MyCommentManagementDialog({
  open,
  onOpenChange,
  onCommentsUpdate
}: MyCommentManagementDialogProps) {
  const [comments, setComments] = useState<MyComment[]>([]);
  const [editingComment, setEditingComment] = useState<MyComment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });

  // 初期読み込み
  useEffect(() => {
    if (open) {
      const loadedComments = loadCommentsFromStorage();
      setComments(loadedComments);
      onCommentsUpdate(loadedComments);
    }
  }, [open, onCommentsUpdate]);

  // 新規作成モード開始
  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingComment(null);
    setFormData({ title: "", content: "" });
  };

  // 編集モード開始
  const handleStartEdit = (comment: MyComment) => {
    setEditingComment(comment);
    setIsCreating(false);
    setFormData({ title: comment.title, content: comment.content });
  };

  // キャンセル
  const handleCancel = () => {
    setIsCreating(false);
    setEditingComment(null);
    setFormData({ title: "", content: "" });
  };

  // 保存（新規作成または編集）
  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("内容を入力してください");
      return;
    }

    let updatedComments: MyComment[];

    if (editingComment) {
      // 編集
      updatedComments = comments.map(c =>
        c.id === editingComment.id
          ? {
              ...c,
              title: formData.title,
              content: formData.content,
              updatedAt: new Date().toISOString()
            }
          : c
      );
      toast.success("コメントを更新しました");
    } else {
      // 新規作成
      const newComment: MyComment = {
        id: `my_${Date.now()}`,
        title: formData.title,
        content: formData.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedComments = [...comments, newComment];
      toast.success("コメントを追加しました");
    }

    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
    onCommentsUpdate(updatedComments);
    handleCancel();
  };

  // 削除
  const handleDelete = (id: string) => {
    if (!confirm("このコメントを削除してもよろしいですか？")) {
      return;
    }

    const updatedComments = comments.filter(c => c.id !== id);
    setComments(updatedComments);
    saveCommentsToStorage(updatedComments);
    onCommentsUpdate(updatedComments);
    toast.success("コメントを削除しました");

    // 編集中のコメントが削除された場合はキャンセル
    if (editingComment && editingComment.id === id) {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Myコメント管理</span>
          </DialogTitle>
          <DialogDescription>
            よく使うコメントを登録・編集できます。診療記録入力時に簡単に挿入できます。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* 左側: コメントリスト */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">登録済みコメント ({comments.length})</h3>
              <Button
                onClick={handleStartCreate}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isCreating || editingComment !== null}
              >
                <Plus className="w-4 h-4 mr-1" />
                新規作成
              </Button>
            </div>

            <ScrollArea className="flex-1 border rounded-lg">
              <div className="p-2 space-y-2">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>コメントがありません</p>
                    <p className="text-sm">「新規作成」ボタンから追加してください</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <Card
                      key={comment.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        editingComment?.id === comment.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "hover:border-blue-300"
                      }`}
                      onClick={() => handleStartEdit(comment)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1 truncate">
                              {comment.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 whitespace-pre-wrap">
                              {comment.content}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              更新: {new Date(comment.updatedAt).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(comment);
                              }}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(comment.id);
                              }}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* 右側: 編集フォーム */}
          {(isCreating || editingComment) && (
            <div className="flex-1 flex flex-col border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {editingComment ? "コメント編集" : "新規コメント作成"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-7 w-7 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="comment-title">
                    タイトル <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="comment-title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="例: 定期検査フォロー"
                    className="mt-1"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.title.length}/50文字
                  </p>
                </div>

                <div className="flex-1 flex flex-col">
                  <Label htmlFor="comment-content">
                    内容 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="comment-content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="例: 次回検査: CBC, CRP, HbA1c&#10;外来予約: 4週間後"
                    className="mt-1 flex-1 min-h-[200px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.content.length}/500文字
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  キャンセル
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!formData.title.trim() || !formData.content.trim()}
                >
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
