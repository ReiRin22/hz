import { Button } from '@/shared/components/atoms/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/shared/components/atoms/command';
import { Mic, MicOff, MessageSquare, FileText, Palette } from 'lucide-react';
import type { TemplateViewModel } from '../../types/recordInput.type';

type RecordToolbarMoleculeProps = {
  isEditable: boolean;
  isVoiceActive: boolean;
  showTemplates: boolean;
  templates: TemplateViewModel[];
  onToggleVoice: () => void;
  onOpenComment: () => void;
  onToggleTemplates: (open: boolean) => void;
  onApplyTemplate: (template: TemplateViewModel) => void;
  onOpenSchema: () => void;
};

export function RecordToolbarMolecule({
  isEditable,
  isVoiceActive,
  showTemplates,
  templates,
  onToggleVoice,
  onOpenComment,
  onToggleTemplates,
  onApplyTemplate,
  onOpenSchema,
}: RecordToolbarMoleculeProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        disabled={!isEditable}
        onClick={onToggleVoice}
        className={isVoiceActive
          ? 'bg-red-50 border-red-300 text-red-600'
          : 'medical-border-primary hover:medical-bg-primary hover:text-white'}
      >
        {isVoiceActive ? (
          <>
            <MicOff className="w-4 h-4 mr-0 animate-pulse" />
            停止
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-0" />
            音声
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        disabled={!isEditable}
        onClick={onOpenComment}
        className="medical-border-primary hover:medical-bg-primary hover:text-white"
      >
        <MessageSquare className="w-4 h-4 mr-0" />
        コメント
      </Button>

      <Popover open={showTemplates} onOpenChange={onToggleTemplates}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={!isEditable}
            className="medical-border-primary hover:medical-bg-primary hover:text-white"
          >
            <FileText className="w-4 h-4 mr-0" />
            テンプレート
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <Command>
            <CommandList>
              <CommandGroup heading="SOAPテンプレート">
                {templates.map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => onApplyTemplate(template)}
                    className="cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        SOAP形式の{template.name}用テンプレート
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        size="sm"
        disabled={!isEditable}
        onClick={onOpenSchema}
        className="medical-border-primary hover:medical-bg-primary hover:text-white"
      >
        <Palette className="w-4 h-4 mr-0" />
        シェーマ
      </Button>
    </div>
  );
}
