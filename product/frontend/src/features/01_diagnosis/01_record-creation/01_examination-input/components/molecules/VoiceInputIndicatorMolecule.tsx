import { Button } from '@/shared/components/atoms/button';
import { Volume2, MicOff } from 'lucide-react';

type VoiceInputIndicatorMoleculeProps = {
  audioLevel: number;
  interimTranscript: string;
  onStop: () => void;
};

export function VoiceInputIndicatorMolecule({
  audioLevel,
  interimTranscript,
  onStop,
}: VoiceInputIndicatorMoleculeProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
        <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />
        <span className="text-sm text-red-700">音声入力中... 話してください</span>
        <div className="flex-1 flex items-center space-x-2">
          <div className="flex-1 max-w-[200px] h-2 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-100"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
          <span className="text-xs text-red-600 font-mono min-w-[40px]">
            {Math.round(audioLevel)}%
          </span>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onStop}
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          <MicOff className="w-4 h-4 mr-1" />
          停止
        </Button>
      </div>
      {interimTranscript && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-xs text-blue-600 font-medium mt-0.5">認識中:</div>
            <div className="text-sm text-blue-800 italic flex-1">
              {interimTranscript}
              <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
