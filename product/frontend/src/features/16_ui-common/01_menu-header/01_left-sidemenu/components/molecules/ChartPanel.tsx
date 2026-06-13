import { FileText, User, Calendar, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/card';
import type { CurrentPatient } from '../../../types/order.types';

interface ChartPanelProps {
  currentPatient: CurrentPatient;
}

export function ChartPanel({ currentPatient }: ChartPanelProps) {
  return (
    <div className="flex-1 bg-background overflow-auto">
      <div className="p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl">電子カルテ</h1>
          </div>
          
          {/* 患者情報サマリー */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                患者情報
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">患者名</div>
                  <div className="font-medium">{currentPatient.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">患者番号</div>
                  <div className="font-medium">{currentPatient.patientNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">年齢・性別</div>
                  <div className="font-medium">
                    {currentPatient.age}歳 {currentPatient.gender === 'male' ? '男性' : '女性'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    来院日
                  </div>
                  <div className="font-medium">{currentPatient.visitDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 本日の診察記録 */}
          <Card>
            <CardHeader>
              <CardTitle>本日の診察記録</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date().toLocaleString('ja-JP')}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">主訴:</span> 
                      <span className="ml-2">-</span>
                    </div>
                    <div>
                      <span className="font-medium">現病歴:</span> 
                      <span className="ml-2">-</span>
                    </div>
                    <div>
                      <span className="font-medium">診察所見:</span> 
                      <span className="ml-2">-</span>
                    </div>
                    <div>
                      <span className="font-medium">診断:</span> 
                      <span className="ml-2">-</span>
                    </div>
                    <div>
                      <span className="font-medium">治療方針:</span> 
                      <span className="ml-2">-</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* バイタルサイン */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                バイタルサイン
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm text-muted-foreground">血圧</div>
                  <div className="text-xl font-medium">- / - mmHg</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm text-muted-foreground">脈拍</div>
                  <div className="text-xl font-medium">- bpm</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm text-muted-foreground">体温</div>
                  <div className="text-xl font-medium">- ℃</div>
                </div>
                <div className="p-3 bg-muted rounded">
                  <div className="text-sm text-muted-foreground">体重</div>
                  <div className="text-xl font-medium">- kg</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 既往歴 */}
          <Card>
            <CardHeader>
              <CardTitle>既往歴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-8">
                既往歴データはありません
              </div>
            </CardContent>
          </Card>

          {/* アレルギー情報 */}
          <Card>
            <CardHeader>
              <CardTitle>アレルギー・禁忌情報</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-8">
                アレルギー情報はありません
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最近の診察履歴 */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>最近の診察履歴</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center py-8">
              診察履歴データはありません
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}