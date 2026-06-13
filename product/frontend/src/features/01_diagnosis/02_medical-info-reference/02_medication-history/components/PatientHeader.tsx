import { Button } from "@/shared/components/atoms/button";
import { Card, CardContent } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";

interface PatientInfo {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  age: number;
}

interface PatientHeaderProps {
  patient: PatientInfo;
  selectedPeriod: 14 | 30 | 90;
  onPeriodChange: (period: 14 | 30 | 90) => void;
}

export function PatientHeader({ patient, selectedPeriod, onPeriodChange }: PatientHeaderProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">患者ID:</span>
                <span className="font-mono">{patient.id}</span>
                <Badge variant="secondary">{patient.gender}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">患者名:</span>
                <span className="text-lg">{patient.name}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">生年月日:</span>
                <span>{patient.birthDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">年齢:</span>
                <span>{patient.age}歳</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground mr-2">表示期間:</span>
            <Button
              variant={selectedPeriod === 14 ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(14)}
            >
              14日
            </Button>
            <Button
              variant={selectedPeriod === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(30)}
            >
              30日
            </Button>
            <Button
              variant={selectedPeriod === 90 ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(90)}
            >
              90日
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}