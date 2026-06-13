import { useRef } from 'react';
import { Upload, Star } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Card } from '@/shared/components/atoms/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { TEMPLATE_COMPONENTS } from '../../assets/MedicalTemplates';
import { TEMPLATE_DATA } from '../../assets/templates';

interface TemplateSelectorPanelProps {
  selectedBodyPart: string;
  selectedTemplateId: string;
  favoriteTemplateIds: string[];
  onBodyPartChange: (category: string) => void;
  onTemplateSelect: (templateId: string) => void;
  onFavoriteToggle: (templateId: string) => void;
  /** バリデーション（形式・サイズ）は Organism 側で実施。Molecule はファイルをそのまま渡す */
  onImageImport: (file: File) => void;
}

export default function TemplateSelectorPanel({
  selectedBodyPart,
  selectedTemplateId,
  favoriteTemplateIds,
  onBodyPartChange,
  onTemplateSelect,
  onFavoriteToggle,
  onImageImport,
}: TemplateSelectorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onImageImport(file);
    // 同じファイルを再選択できるよう value をリセット
    e.target.value = '';
  };

  const currentBodyPart = TEMPLATE_DATA.find((bp) => bp.id === selectedBodyPart);
  const currentTemplates = currentBodyPart?.templates ?? [];

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h3 className="text-sm font-medium mb-3">テンプレート</h3>

      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4" />
          画像取込
        </Button>
      </div>

      <div className="mb-4">
        <Select
          value={selectedBodyPart}
          onValueChange={(value) => {
            onBodyPartChange(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="部位を選択してください" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_DATA.map((bodyPart) => (
              <SelectItem key={bodyPart.id} value={bodyPart.id}>
                {bodyPart.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {currentTemplates.map((template) => {
          const TemplateComponent = TEMPLATE_COMPONENTS[template.component];
          const isFav = favoriteTemplateIds.includes(template.id);
          return (
            <Card
              key={template.id}
              className={`p-2 cursor-pointer transition-colors aspect-square relative ${
                selectedTemplateId === template.id
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="w-full h-full flex items-center justify-center">
                {TemplateComponent && (
                  <div className="w-full h-full max-w-full max-h-full">
                    <TemplateComponent />
                  </div>
                )}
              </div>
              <button
                className="absolute top-1 right-1 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(template.id);
                }}
                title={isFav ? 'お気に入りから削除' : 'お気に入りに追加'}
              >
                <Star
                  className={`w-3 h-3 ${
                    isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                  } transition-colors`}
                />
              </button>
            </Card>
          );
        })}

        <Card
          className={`p-2 cursor-pointer transition-colors aspect-square ${
            selectedTemplateId === '' ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
          }`}
          onClick={() => onTemplateSelect('')}
        >
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-gray-600">空白</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
