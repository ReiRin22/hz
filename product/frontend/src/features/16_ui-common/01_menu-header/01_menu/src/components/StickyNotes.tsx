import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Clock, User } from "lucide-react";

interface StickyNote {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  color: string;
  priority?: "high" | "normal";
}

interface ThemeColor {
  name: string;
  value: string;
  primary: string;
  secondary: string;
}

interface StickyNotesProps {
  theme?: ThemeColor;
}

const stickyNotesData: StickyNote[] = [
  {
    id: 1,
    title: "緊急連絡",
    content: "本日15時より救急対応訓練を実施します。全スタッフご協力お願いします。",
    author: "管理部",
    date: "2025-12-12 09:00",
    color: "#FEE2E2",
    priority: "high"
  },
  {
    id: 2,
    title: "カンファレンス",
    content: "明日10時から第2会議室にて症例検討会を行います。",
    author: "田中医師",
    date: "2025-12-11 16:30",
    color: "#DBEAFE"
  },
  {
    id: 3,
    title: "システムメンテナンス",
    content: "12/15(日)の深夜2時～5時にシステムメンテナンスを実施します。",
    author: "情報システム部",
    date: "2025-12-10 14:20",
    color: "#FEF3C7"
  },
  {
    id: 4,
    title: "備品補充",
    content: "3階ナースステーションの消耗品在庫が少なくなっています。",
    author: "看護部",
    date: "2025-12-12 08:15",
    color: "#D1FAE5"
  },
  {
    id: 5,
    title: "患者様対応",
    content: "301号室の患者様、食事制限について家族への説明が必要です。",
    author: "栄養科",
    date: "2025-12-11 13:45",
    color: "#EDE9FE"
  }
];

export function StickyNotes({ theme }: StickyNotesProps) {
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
        }}>付箋</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3" style={{
        backgroundColor: theme?.value === 'black' ? '#0D0D0D' : undefined
      }}>
        {stickyNotesData.map((note) => (
          <Card 
            key={note.id}
            className="relative overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4"
            style={{ 
              backgroundColor: theme?.value === 'black' ? '#262626' : note.color,
              borderLeftColor: note.priority === "high" ? "#EF4444" : "#9CA3AF",
              borderColor: theme?.value === 'black' ? '#404040' : undefined
            }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold" style={{
                  color: theme?.value === 'black' ? '#F9FAFB' : '#1F2937'
                }}>{note.title}</h3>
                {note.priority === "high" && (
                  <Badge variant="destructive" className="ml-2">
                    重要
                  </Badge>
                )}
              </div>
              <p className="mb-3" style={{
                color: theme?.value === 'black' ? '#E5E7EB' : '#374151'
              }}>
                {note.content}
              </p>
              <div className="flex items-center justify-between text-sm" style={{
                color: theme?.value === 'black' ? '#D1D5DB' : '#4B5563'
              }}>
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>{note.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{note.date}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}