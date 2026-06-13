'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { Button } from '@/shared/components/atoms/button';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Label } from '@/shared/components/atoms/label';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Card, CardContent } from '@/shared/components/atoms/card';
import { MessageSquare, Plus, Edit, Trash2, Save } from 'lucide-react';

type MyComment = {
  id: string;
  content: string;
};

type MyCommentManagementDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments: MyComment[];
  onSaveComment: (args: { commentId?: string; content: string }) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
};

export function MyCommentManagementDialog({
  open,
  onOpenChange,
  comments,
  onSaveComment,
  onDeleteComment,
}: MyCommentManagementDialogProps) {
  const [localComments, setLocalComments] = useState<MyComment[]>(comments);
  const [editingId, setEditingId] = useState<string | null>(null);

  // BFF から取得したコメントリストが更新されたら同期する
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleStartNew = () => {
    setEditingId(null);
    setContent('');
  };

  const handleStartEdit = (comment: LocalComment) => {
    setEditingId(comment.id);
    setContent(comment.content);
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsSaving(true);
    try {
      await onSaveComment({ commentId: editingId ?? undefined, content });
      if (editingId) {
        setLocalComments((prev) => prev.map((c) => c.id === editingId ? { ...c, content } : c));
      } else {
        const newId = `local_${Date.now()}`;
        setLocalComments((prev) => [...prev, { id: newId, content }]);
      }
      setEditingId(null);
      setContent('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await onDeleteComment(id);
    setLocalComments((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setContent('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="max-w-2xl h-[80vh] flex flex-col p-4"
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Myコメント管理</span>
            <span className="text-sm text-muted-foreground font-normal">({localComments.length}件)</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="flex-shrink-0 space-y-2">
            <div className="pb-1.5 border-b flex items-center justify-between">
              <h3 className="text-xs font-semibold">{editingId ? '編集' : '新規作成'}</h3>
              <Button onClick={handleStartNew} size="sm" variant="outline" className="h-6 text-xs px-2">
                <Plus className="w-3 h-3 mr-1" />
                新規
              </Button>
            </div>
            <div>
              <Label htmlFor="comment-content" className="text-xs mb-1 block">内容</Label>
              <Textarea
                id="comment-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="例：次回検査: CBC, CRP, HbA1c"
                className="resize-none text-sm h-[80px] w-full"
                maxLength={200}
                autoFocus
              />
              <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-muted-foreground">{content.length}/200</p>
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-6 text-xs"
                  disabled={!content.trim() || isSaving}
                >
                  <Save className="w-3 h-3 mr-1" />
                  保存
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col border-t pt-3 min-h-0">
            <div className="mb-1.5 pb-1.5 border-b">
              <h3 className="text-xs font-semibold">登録済みコメント</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="pr-1 grid grid-cols-1 gap-1.5">
                {localComments.length === 0 ? (
                  <div className="col-span-1 text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-1 opacity-20" />
                    <p className="text-xs">コメントなし</p>
                  </div>
                ) : (
                  localComments.map((comment) => (
                    <Card
                      key={comment.id}
                      className={`cursor-pointer transition-all hover:shadow-sm rounded-md ${editingId === comment.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-sm' : 'hover:border-blue-200 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                      onClick={() => handleStartEdit(comment)}
                    >
                      <CardContent className="p-1.5 [&:last-child]:pb-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs text-foreground line-clamp-3 whitespace-pre-wrap leading-snug flex-1 min-w-0">
                            {comment.content}
                          </p>
                          <div className="flex items-start gap-0.5 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleStartEdit(comment); }}
                              className="h-5 w-5 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); handleDelete(comment.id); }}
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
