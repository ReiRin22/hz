import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface MessageMemoProps {
  theme?: ThemeColor;
}

export function MessageMemo({ theme }: MessageMemoProps) {
  const items = [
    { title: "看護部：患者ID12345 採血追加確認願い", subtitle: "10/27 11:40" },
    { title: "検査科：検体ラベル不一致報告", subtitle: "10/27 10:10" },
    { title: "事務：紹介状データ再出力依頼", subtitle: "10/26 16:20" },
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
        }}>伝言メモ（医師宛通達）</CardTitle>
      </CardHeader>
      <CardContent style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined
      }}>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="border-b pb-2 last:border-b-0" style={{
              borderBottomColor: theme?.value === 'black' ? '#404040' : undefined
            }}>
              <div className="text-sm" style={{
                color: theme?.value === 'black' ? '#F9FAFB' : undefined
              }}>{item.title}</div>
              <div className="text-xs mt-1" style={{
                color: theme?.value === 'black' ? '#D1D5DB' : '#6B7280'
              }}>{item.subtitle}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}