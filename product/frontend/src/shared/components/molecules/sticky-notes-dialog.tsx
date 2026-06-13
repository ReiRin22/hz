'use client'

import { useState } from 'react'
import { StickyNote, Plus, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/atoms/button'
import { Badge } from '@/shared/components/atoms/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip'
import { ScrollArea } from '@/shared/components/atoms/scroll-area'
import { Card, CardContent } from '@/shared/components/atoms/card'
import { Input } from '@/shared/components/atoms/input'
import { Textarea } from '@/shared/components/atoms/textarea'
import type { StickyNote as StickyNoteType } from '@/shared/types/user-header.type'

const COLOR_CONFIG = {
  yellow: { border: 'border-l-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-800 dark:text-yellow-200' },
  blue: { border: 'border-l-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-800 dark:text-blue-200' },
  pink: { border: 'border-l-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', text: 'text-pink-800 dark:text-pink-200' },
  green: { border: 'border-l-green-500', bg: 'bg-green-50 dark:bg-green-950/30', text: 'text-green-800 dark:text-green-200' },
} as const

// TODO: BFF API 連携後は付箋データを API から取得する（上流 API 未実装のためモックデータで代替）
const INITIAL_NOTES: StickyNoteType[] = [
  { id: 'note-1', title: '患者対応確認', content: '山田太郎様の次回診察時、血圧測定を確認', createdAt: '2025/12/12 10:30', color: 'yellow' },
  { id: 'note-2', title: 'カンファレンス', content: '12/15 14:00 病棟カンファレンス', createdAt: '2025/12/11 16:00', color: 'blue' },
  { id: 'note-3', title: '処方変更', content: '佐藤花子様の降圧剤を次回から変更予定', createdAt: '2025/12/10 09:15', color: 'pink' },
  { id: 'note-4', title: '検査予定', content: '田中一郎様のCT検査血糖値確認待ち', createdAt: '2025/12/09 11:00', color: 'green' },
]

export function StickyNotesDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [notes, setNotes] = useState<StickyNoteType[]>(INITIAL_NOTES)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEditingNoteId(null)
      setEditingTitle('')
      setEditingContent('')
    }
    setIsOpen(open)
  }

  const handleAddNote = () => {
    const colors: StickyNoteType['color'][] = ['yellow', 'blue', 'pink', 'green']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const now = new Date()
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newNote: StickyNoteType = {
      id: `note-${Date.now()}`,
      title: '新しい付箋',
      content: 'ここに内容を入力してください',
      createdAt: formattedDate,
      color: randomColor,
    }

    setNotes(prev => [newNote, ...prev])
    setEditingNoteId(newNote.id)
    setEditingTitle(newNote.title)
    setEditingContent(newNote.content)
    toast.success('新しい付箋を追加しました')
  }

  const handleDeleteNote = (id: string) => {
    toast.success('付箋を削除しました')
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const handleStartEdit = (note: StickyNoteType) => {
    setEditingNoteId(note.id)
    setEditingTitle(note.title)
    setEditingContent(note.content)
  }

  const handleSaveEdit = () => {
    if (!editingNoteId) return
    setNotes(prev => prev.map(note =>
      note.id === editingNoteId ? { ...note, title: editingTitle, content: editingContent } : note
    ))
    setEditingNoteId(null)
    setEditingTitle('')
    setEditingContent('')
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditingTitle('')
    setEditingContent('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <StickyNote className="h-4 w-4" />
              {notes.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-yellow-500 text-white text-xs">
                  {notes.length > 99 ? '99+' : notes.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>付箋</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StickyNote className="w-5 h-5 medical-text-primary" />
              <DialogTitle>付箋</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" className="medical-primary" onClick={handleAddNote}>
                <Plus className="w-4 h-4 mr-1" />
                追加
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4 mr-1" />
                閉じる
              </Button>
            </div>
          </div>
          <DialogDescription>
            重要なメモや注意事項を付箋として管理できます。付箋をクリックして編集できます。
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] mt-4">
          <div className="grid grid-cols-2 gap-3">
            {notes.length > 0 ? (
              notes.map((note) => {
                const isEditing = editingNoteId === note.id
                const config = COLOR_CONFIG[note.color] ?? COLOR_CONFIG.yellow

                return (
                  <Card key={note.id} className={`border-l-4 ${config.border} ${config.bg} relative`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <CardContent className="p-4 pr-10">
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="font-medium bg-white dark:bg-gray-800"
                            placeholder="タイトル"
                          />
                          <Textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="text-sm bg-white dark:bg-gray-800 min-h-[60px]"
                            placeholder="内容"
                          />
                          <div className="text-xs text-muted-foreground mb-2">{note.createdAt}</div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1 medical-primary" onClick={handleSaveEdit}>
                              <Check className="w-3 h-3 mr-1" />
                              保存
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1" onClick={handleCancelEdit}>
                              キャンセル
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => handleStartEdit(note)} className="cursor-pointer">
                          <h3 className={`font-medium mb-2 ${config.text}`}>{note.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{note.content}</p>
                          <div className="text-xs text-muted-foreground">{note.createdAt}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                付箋がありません。「追加」ボタンで新しい付箋を作成できます。
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
