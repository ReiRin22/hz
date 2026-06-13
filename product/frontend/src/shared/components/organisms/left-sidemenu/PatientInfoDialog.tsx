import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/atoms/dialog';
import { CurrentPatient } from '@/shared/types/left-sidemenu/menu.types';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.globalMenuNav.patientInfoDialog;

interface PatientInfoDialogProps {
  currentPatient: CurrentPatient;
}

export function PatientInfoDialog({ currentPatient }: PatientInfoDialogProps) {
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>{t.title}</DialogTitle>
        <DialogDescription>
          {t.description}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">{t.patientId}</div>
            <div>{currentPatient.patientNumber}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t.visitDate}</div>
            <div>{currentPatient.visitDate}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">{t.name}</div>
            <div>{currentPatient.name}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{t.ageGender}</div>
            <div>{currentPatient.age}{t.ageSuffix} {currentPatient.gender === 'male' ? t.male : t.female}</div>
          </div>
        </div>
        {currentPatient.allergies && currentPatient.allergies.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">{t.allergies}</div>
            <div className="flex flex-wrap gap-1">
              {currentPatient.allergies.map((allergy) => (
                <span key={allergy} className="inline-flex items-center px-2 py-1 rounded bg-destructive/10 text-destructive text-xs">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
