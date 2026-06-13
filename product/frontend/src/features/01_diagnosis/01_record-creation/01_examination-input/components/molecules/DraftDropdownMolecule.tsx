import { Button } from '@/shared/components/atoms/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Separator } from '@/shared/components/atoms/separator';
import { FolderOpen, ChevronDown, Clock, Trash2 } from 'lucide-react';
import type { DraftViewModel } from '../../types/recordInput.type';

type DraftDropdownMoleculeProps = {
  drafts: DraftViewModel[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyDraft: (draft: DraftViewModel) => void;
  onDeleteDraft: (draftId: string) => void;
};

export function DraftDropdownMolecule({
  drafts,
  open,
  onOpenChange,
  onApplyDraft,
  onDeleteDraft,
}: DraftDropdownMoleculeProps) {
  if (drafts.length === 0) return null;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <FolderOpen className="w-3 h-3 mr-1" />
          下書き ({drafts.length}件)
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-2" align="end">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground px-2 py-1">
            保存された下書き
          </div>
          <Separator />
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-start gap-2 p-2 hover:bg-accent rounded-md group"
                >
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onApplyDraft(draft)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(draft.savedAt).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {draft.soapContent.substring(0, 100)}
                      {draft.soapContent.length > 100 && '...'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDraft(draft.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
