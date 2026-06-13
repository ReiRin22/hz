import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/atoms/dialog";
import { Button } from "@/shared/components/atoms/button";
import { Input } from "@/shared/components/atoms/input";
import { Textarea } from "@/shared/components/atoms/textarea";
import { Label } from "@/shared/components/atoms/label";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Card, CardContent } from "@/shared/components/atoms/card";
import { MessageSquare, Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from 'sonner';

export interface MyComment {
  id: string;
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
export const loadCommentsFromStorage = (): MyComment[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const comments = JSON.parse(stored);
      return comments;
    }
  } catch (error) {
    console.error("コメント読み込みエラー:", error);
    toast.error("コメントの読み込みに失敗しました");
  }
  
  // デフォルトのコメント（初回起動時のサンプルデータ）
  const getDefaultComments = (): MyComment[] => {
    // デフォルトのコメント
    return [
      { 
        id: 'my1', 
        content: 'BP 140/90, 降圧薬継続',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'my2', 
        content: '次回HbA1c確認',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'my3', 
        content: '食事療法: 減塩指導\n運動療法: ウォーキング30分/日',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'my4', 
        content: '胸痛時: ニトロ舌下\n救急搬送基準: 5分持続',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { 
        id: 'my5', 
        content: '【服薬アドヒアランス不良】\n前回処方薬が残薬多数。服薬状況を確認したところ、朝食後のアムロジピンを飲み忘れることが多いとのこと。\n対策: ①お薬カレンダー導入を提案 ②1日1回の降圧薬に変更検討 ③次回来院時に必ず残薬を持参するよう指導\n薬剤師との連携も検討。',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
    ];
  };
  
  return getDefaultComments();
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
  const [formData, setFormData] = useState({ content: "" });

  // 初期読み込み（ダイアログの開閉のみを監視）
  useEffect(() => {
    if (open) {
      const loadedComments = loadCommentsFromStorage();
      setComments(loadedComments);
      onCommentsUpdate(loadedComments);
      
      // ダイアログを開いた時は新規作成モードに設定（すぐに入力可能）
      setIsCreating(true);
      setEditingComment(null);
      setFormData({ content: "" });
    } else {
      // ダイアログを閉じたら状態をリセット
      setIsCreating(false);
      setEditingComment(null);
      setFormData({ content: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]); // openのみを監視

  // 新規作成モード開始
  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingComment(null);
    setFormData({ content: "" });
  };

  // 編集モード開始
  const handleStartEdit = (comment: MyComment) => {
    setEditingComment(comment);
    setIsCreating(false);
    setFormData({ content: comment.content });
  };

  // 保存（新規作成または編集）
  const handleSave = () => {
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
    
    // 保存後は新規作成モードに戻る
    setIsCreating(true);
    setEditingComment(null);
    setFormData({ content: "" });
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

    // 編集中のコメントが削除された場合は新規作成モードに戻る
    if (editingComment && editingComment.id === id) {
      setIsCreating(true);
      setEditingComment(null);
      setFormData({ content: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="max-w-2xl h-[80vh] flex flex-col p-4" 
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Myコメント管理</span>
            <span className="text-sm text-muted-foreground font-normal">
              ({comments.length}件)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {/* 上部: 編集エリア */}
          <div className="flex-shrink-0">
            {isCreating || editingComment ? (
              <div className="space-y-2">
                <div className="pb-1.5 border-b flex items-center justify-between">
                  <h3 className="text-xs font-semibold">
                    {editingComment ? "編集" : "新規作成"}
                  </h3>
                  <Button
                    onClick={handleStartCreate}
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs px-2"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    新規
                  </Button>
                </div>

                <div>
                  <Label htmlFor="comment-content" className="text-xs mb-1 block">
                    内容
                  </Label>
                  <Textarea
                    id="comment-content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="例：次回検査: CBC, CRP, HbA1c&#10;外来予約: 4週間後"
                    className="resize-none text-sm h-[80px] w-full"
                    maxLength={200}
                    autoFocus
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground">
                      {formData.content.length}/200
                    </p>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white h-6 text-xs"
                      disabled={!formData.content.trim()}
                    >
                      <Save className="w-3 h-3 mr-1" />
                      保存
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-6 text-center text-muted-foreground border rounded-lg bg-muted/30">
                <div>
                  <MessageSquare className="w-8 h-8 mx-auto mb-1 opacity-20" />
                  <p className="text-xs">
                    コメントを選択して編集、または「新規」ボタンで作成
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 下部: コメントリスト */}
          <div className="flex-1 flex flex-col border-t pt-3 min-h-0">
            <div className="mb-1.5 pb-1.5 border-b">
              <h3 className="text-xs font-semibold">登録済みコメント</h3>
            </div>

            <ScrollArea className="flex-1">
              <div className="pr-1 grid grid-cols-1 gap-1.5">
                {comments.length === 0 ? (
                  <div className="col-span-1 text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-1 opacity-20" />
                    <p className="text-xs">コメントなし</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <Card
                      key={comment.id}
                      className={`cursor-pointer transition-all hover:shadow-sm rounded-md ${
                        editingComment?.id === comment.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm"
                          : "hover:border-blue-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                      }`}
                      onClick={() => handleStartEdit(comment)}
                    >
                      <CardContent className="p-1.5 [&:last-child]:pb-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-foreground line-clamp-3 whitespace-pre-wrap leading-snug">
                              {comment.content}
                            </p>
                          </div>
                          <div className="flex items-start gap-0.5 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(comment);
                              }}
                              className="h-5 w-5 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(comment.id);
                              }}
                              className="h-5 w-5 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="w-3 h-3" />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}