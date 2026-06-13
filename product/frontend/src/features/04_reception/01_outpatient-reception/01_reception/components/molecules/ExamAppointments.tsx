import { Button } from '@shared/components/atoms/button';
import { Badge } from '@shared/components/atoms/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';

interface ExamAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  examType: string;
  doctor: string;
  status: '予約済' | '未予約' | '受付待ち' | '受付済';
}

interface ExamAppointmentsProps {
  appointments: ExamAppointment[];
  onAddAppointment: () => void;
  onReception: (appointmentId: string, patientName: string, examType: string, doctor: string) => void;
}

export function ExamAppointments({ appointments, onAddAppointment, onReception }: ExamAppointmentsProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case '予約済':
        return 'default';
      case '受付待ち':
        return 'destructive';
      case '受付済':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>検査予約状況</h3>
        <Button onClick={onAddAppointment} variant="outline" size="sm">
          検査予約追加
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>予約者名</TableHead>
            <TableHead>予約日</TableHead>
            <TableHead>予約時間</TableHead>
            <TableHead>検査内容</TableHead>
            <TableHead>担当者</TableHead>
            <TableHead>状態</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.patientName}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.examType}</TableCell>
              <TableCell>{appointment.doctor}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(appointment.status)}>
                  {appointment.status}
                </Badge>
              </TableCell>
              <TableCell>
                {(appointment.status === '予約済' || appointment.status === '受付待ち') && (
                  <Button
                    onClick={() => onReception(appointment.id, appointment.patientName, appointment.examType, appointment.doctor)}
                    size="sm"
                  >
                    受付
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}