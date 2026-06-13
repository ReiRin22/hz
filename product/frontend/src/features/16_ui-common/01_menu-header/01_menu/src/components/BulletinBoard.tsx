import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface BulletinBoardProps {
  theme?: ThemeColor;
}

export function BulletinBoard({ theme }: BulletinBoardProps) {
  const items = [
    { title: "10/27 院内停電のお知らせ", subtitle: "11/2 22時〜24時 予定" },
    { title: "看護部勉強会のご案内", subtitle: "11/5 17:00 第2会議室" },
    { title: "電子カルテ更新予定", subtitle: "11/10 夜間メンテナンス" },
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
        }}>掲示板</CardTitle>
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