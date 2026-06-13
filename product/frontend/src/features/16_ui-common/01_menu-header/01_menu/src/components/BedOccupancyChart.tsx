import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface BedOccupancyChartProps {
  theme?: ThemeColor;
}

export function BedOccupancyChart({ theme }: BedOccupancyChartProps) {
  const data = [
    { name: "一般病棟", value: 78 },
    { name: "ICU", value: 90 },
    { name: "HCU", value: 65 },
    { name: "小児病棟", value: 55 },
    { name: "回復期", value: 70 },
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
        }}>病床稼働状況チャート</CardTitle>
      </CardHeader>
      <CardContent style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined
      }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme?.value === 'black' ? '#404040' : undefined} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 11, fill: theme?.value === 'black' ? '#F9FAFB' : undefined }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
              stroke={theme?.value === 'black' ? '#6B7280' : undefined}
            />
            <YAxis 
              label={{ value: '稼働率（％）', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: theme?.value === 'black' ? '#F9FAFB' : undefined } }}
              tick={{ fontSize: 11, fill: theme?.value === 'black' ? '#F9FAFB' : undefined }}
              stroke={theme?.value === 'black' ? '#6B7280' : undefined}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme?.value === 'black' ? '#262626' : undefined,
                borderColor: theme?.value === 'black' ? '#404040' : undefined,
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}
            />
            <Bar dataKey="value" fill="#2563EB" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{
          color: theme?.value === 'black' ? '#D1D5DB' : '#6B7280'
        }}>平均稼働率：71.6％</p>
      </CardContent>
    </Card>
  );
}