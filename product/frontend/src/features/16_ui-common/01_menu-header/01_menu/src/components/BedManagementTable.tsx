import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/atoms/table";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface BedManagementTableProps {
  theme?: ThemeColor;
}

export function BedManagementTable({ theme }: BedManagementTableProps) {
  const rows = [
    { ward: "一般病棟", total: "40", occupied: "31", available: "9", rate: "77.5％" },
    { ward: "ICU", total: "8", occupied: "7", available: "1", rate: "87.5％" },
    { ward: "HCU", total: "12", occupied: "8", available: "4", rate: "66.7％" },
  ];

  return (
    <Card style={{
      backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined,
      borderColor: theme?.value === 'black' ? '#404040' : undefined
    }}>
      <CardHeader style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined,
        borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
      }}>
        <CardTitle style={{
          color: theme?.value === 'black' ? '#F9FAFB' : undefined
        }}>病床管理表</CardTitle>
      </CardHeader>
      <CardContent style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined
      }}>
        <Table>
          <TableHeader>
            <TableRow style={{
              borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
            }}>
              <TableHead style={{
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}>病棟</TableHead>
              <TableHead style={{
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}>総床数</TableHead>
              <TableHead style={{
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}>入院中</TableHead>
              <TableHead style={{
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}>空床数</TableHead>
              <TableHead style={{
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}>稼働率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} style={{
                borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
              }}>
                <TableCell style={{
                  color: theme?.value === 'black' ? '#F9FAFB' : undefined
                }}>{row.ward}</TableCell>
                <TableCell style={{
                  color: theme?.value === 'black' ? '#F9FAFB' : undefined
                }}>{row.total}</TableCell>
                <TableCell style={{
                  color: theme?.value === 'black' ? '#F9FAFB' : undefined
                }}>{row.occupied}</TableCell>
                <TableCell style={{
                  color: theme?.value === 'black' ? '#F9FAFB' : undefined
                }}>{row.available}</TableCell>
                <TableCell style={{
                  color: theme?.value === 'black' ? '#F9FAFB' : undefined
                }}>{row.rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}