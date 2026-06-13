'use client'

import { useState } from 'react'
import { Save, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/components/atoms/button'
import { Badge } from '@/shared/components/atoms/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/atoms/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/atoms/tooltip'
import { ScrollArea } from '@/shared/components/atoms/scroll-area'
import { Card } from '@/shared/components/atoms/card'
import { Checkbox } from '@/shared/components/atoms/checkbox'
import type { TempDataItem } from '@/shared/types/user-header.type'

// TODO: BFF API 連携後は一時保存データを API から取得する（上流 API 未実装のためモックデータで代替）
const INITIAL_TEMP_DATA: TempDataItem[] = [
  { id: 'temp-1', patientName: '吉田 目子', hoursAgo: '2時間前', inputBy: '看護師 佐藤', category: '外来カルテ', detail: '診察所見入力途中' },
  { id: 'temp-2', patientName: '高木 大輔', hoursAgo: '4時間前', inputBy: '看護師 森本', category: '処方オーダー', detail: '薬剤選択途中' },
  { id: 'temp-3', patientName: '吉田 春香', hoursAgo: '6時間前', inputBy: '看護師 高橋', category: '検査オーダー', detail: '血液検査選択中' },
]

export function TempDataDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDataList, setTempDataList] = useState<TempDataItem[]>(INITIAL_TEMP_DATA)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleToggle = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleLoad = () => {
    if (selectedIds.length === 0) {
      toast.error('読み込むデータを選択してください')
      return
    }
    toast.success(`${selectedIds.length}件のデータを読み込みました`)
    setTempDataList(prev => prev.filter(item => !selectedIds.includes(item.id)))
    setSelectedIds([])
    setIsOpen(false)
  }

  const handleCancel = () => {
    toast.success('一時保存データを保持しました')
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            >
              <Save className="h-4 w-4" />
              {tempDataList.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
                  {tempDataList.length > 99 ? '99+' : tempDataList.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>一時保存データ {tempDataList.length > 0 && `(${tempDataList.length})`}</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5 text-blue-600" />
            <span>一時保存データがあります</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            以下のデータが一時保存されています。確認をお願いします。
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] mt-4">
          <div className="space-y-2">
            {tempDataList.length > 0 ? (
              tempDataList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                  onClick={() => handleToggle(item.id)}
                >
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={() => handleToggle(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 cursor-pointer"
                  />
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.patientName}</h4>
                      <span className="text-sm text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0">{item.hoursAgo}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">入力：{item.inputBy}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{item.category} - {item.detail}</p>
                  </div>
                </div>
              ))
            ) : (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <Save className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-lg mb-2">一時保存データはありません</h3>
                    <p className="text-sm text-muted-foreground">
                      診療記録やオーダー入力中に保存すると、こちらに表示されます
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </ScrollArea>

        {tempDataList.length > 0 && (
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel} className="px-6">
              キャンセル
            </Button>
            <Button onClick={handleLoad} className="bg-black hover:bg-gray-800 text-white px-6">
              読み込む
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
