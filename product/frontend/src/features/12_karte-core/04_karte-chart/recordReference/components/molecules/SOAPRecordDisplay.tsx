import { Card } from '@/shared/components/atoms/card';
import { Separator } from '@/shared/components/atoms/separator';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.soapRecordDisplay;

interface SOAPRecordDisplayProps {
  soapRecord?: string;
}

export function SOAPRecordDisplay({ soapRecord }: SOAPRecordDisplayProps) {
  if (!soapRecord) return null;

  const soapLines = soapRecord.split('\n');
  const soapSections: Record<string, string[]> = { S: [], O: [], A: [], P: [] };
  let currentSection: string | null = null;

  for (const line of soapLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('S:')) {
      currentSection = 'S';
      soapSections.S.push(trimmed.substring(2).trim());
    } else if (trimmed.startsWith('O:')) {
      currentSection = 'O';
      soapSections.O.push(trimmed.substring(2).trim());
    } else if (trimmed.startsWith('A:')) {
      currentSection = 'A';
      soapSections.A.push(trimmed.substring(2).trim());
    } else if (trimmed.startsWith('P:')) {
      currentSection = 'P';
      soapSections.P.push(trimmed.substring(2).trim());
    } else if (currentSection && trimmed) {
      soapSections[currentSection].push(trimmed);
    }
  }

  const sectionLabels: Record<string, string> = {
    S: t.subjectiveLabel,
    O: t.objectiveLabel,
    A: t.assessmentLabel,
    P: t.planLabel,
  };

  const sectionColors: Record<string, string> = {
    S: 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700',
    O: 'bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700',
    A: 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700',
    P: 'bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-700',
  };

  return (
    <Card className="p-4 bg-muted/30">
      <h4 className="text-xs font-semibold mb-3 text-primary">{t.title}</h4>
      <div className="space-y-3">
        {(['S', 'O', 'A', 'P'] as const).map((section) => {
          if (soapSections[section].length === 0) return null;
          return (
            <div key={section}>
              <div className={`px-3 py-2 rounded-lg border ${sectionColors[section]}`}>
                <h5 className="text-xs font-semibold mb-1.5">{sectionLabels[section]}</h5>
                <div className="space-y-1">
                  {soapSections[section].map((content, idx) => (
                    <p key={`${section}-${idx}-${content.slice(0, 10)}`} className="text-xs leading-relaxed">
                      {content}
                    </p>
                  ))}
                </div>
              </div>
              {section !== 'P' && <Separator className="my-2" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
