import { Button } from "@/shared/components/atoms/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/atoms/tooltip";
import { Separator } from "@/shared/components/atoms/separator";
import { Bold, Underline, Highlighter, List, Heading } from "lucide-react";

interface TextFormattingToolbarProps {
  onFormatApply: (formatType: string) => void;
  disabled?: boolean;
  activeFormats?: Set<string>;
}

export function TextFormattingToolbar({
  onFormatApply,
  disabled,
  activeFormats = new Set(),
}: TextFormattingToolbarProps) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">文字装飾:</span>
      
      <TooltipProvider>
        {/* 太字 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeFormats.has('bold') ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onFormatApply('bold')}
              className="h-8 w-8 p-0"
            >
              <Bold className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">太字</p>
              <p className="text-muted-foreground">**テキスト**</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* 下線 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeFormats.has('underline') ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onFormatApply('underline')}
              className="h-8 w-8 p-0"
            >
              <Underline className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">下線</p>
              <p className="text-muted-foreground">__テキスト__</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* 赤マーカー */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeFormats.has('red') ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onFormatApply('red')}
              className="h-8 w-8 p-0"
            >
              <Highlighter className="w-4 h-4 text-red-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">赤マーカー（緊急/警告）</p>
              <p className="text-muted-foreground">[赤]テキスト[/赤]</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* 黄マーカー */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeFormats.has('yellow') ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onFormatApply('yellow')}
              className="h-8 w-8 p-0"
            >
              <Highlighter className="w-4 h-4 text-yellow-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">黄マーカー（注意）</p>
              <p className="text-muted-foreground">[黄]テキスト[/黄]</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* 箇条書き */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeFormats.has('list') ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onFormatApply('list')}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">箇条書き</p>
              <p className="text-muted-foreground">- 項目</p>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* 見出し */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={activeFormats.has('heading') ? "default" : "outline"}
              size="sm"
              disabled={disabled}
              onClick={() => onFormatApply('heading')}
              className="h-8 w-8 p-0"
            >
              <Heading className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium">見出し</p>
              <p className="text-muted-foreground">## 見出し</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />
      </TooltipProvider>
    </div>
  );
}