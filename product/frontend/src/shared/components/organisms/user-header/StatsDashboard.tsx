import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { Badge } from "@shared/components/atoms/badge";
import { Progress } from "@shared/components/atoms/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Activity, Heart, Thermometer, BarChart3 } from "lucide-react";

interface VitalTrend {
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulse: number;
  temperature: number;
  oxygenSaturation: number;
}

interface LabTrend {
  date: string;
  bloodSugar: number;
  hba1c: number;
  cholesterol: number;
}

interface StatsData {
  vitalTrends: VitalTrend[];
  labTrends: LabTrend[];
  recordCounts: {
    progress: number;
    nursing: number;
    prescription: number;
    test: number;
  };
  totalRecords: number;
  averageVitals: {
    bloodPressure: string;
    pulse: number;
    temperature: number;
    oxygenSaturation: number;
  };
}

interface StatsDashboardProps {
  data: StatsData;
}

export function StatsDashboard({ data }: StatsDashboardProps) {
  const { vitalTrends, labTrends, recordCounts, totalRecords, averageVitals } = data;

  // 血圧の傾向分析
  const latestVital = vitalTrends[vitalTrends.length - 1];
  const previousVital = vitalTrends[vitalTrends.length - 2];
  
  const bloodPressureTrend = latestVital && previousVital
    ? latestVital.bloodPressureSystolic > previousVital.bloodPressureSystolic ? "up" : "down"
    : "stable";

  const pulseTrend = latestVital && previousVital
    ? latestVital.pulse > previousVital.pulse ? "up" : "down"
    : "stable";

  return (
    <div className="space-y-6">
      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">総記録数</p>
                <p className="text-2xl font-bold">{totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">平均血圧</p>
                <p className="text-2xl font-bold">{averageVitals.bloodPressure}</p>
                <div className="flex items-center text-xs">
                  {bloodPressureTrend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  )}
                  <span className={bloodPressureTrend === "up" ? "text-red-500" : "text-green-500"}>
                    {bloodPressureTrend === "up" ? "上昇傾向" : "下降傾向"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-pink-600" />
              <div>
                <p className="text-sm text-muted-foreground">平均脈拍</p>
                <p className="text-2xl font-bold">{averageVitals.pulse}</p>
                <div className="flex items-center text-xs">
                  {pulseTrend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  )}
                  <span className={pulseTrend === "up" ? "text-red-500" : "text-green-500"}>
                    bpm
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">平均体温</p>
                <p className="text-2xl font-bold">{averageVitals.temperature}°C</p>
                <p className="text-xs text-muted-foreground">SpO2: {averageVitals.oxygenSaturation}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* チャートセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* バイタルサイン推移 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">バイタルサイン推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      value,
                      name === "bloodPressureSystolic" ? "収縮期血圧" :
                      name === "bloodPressureDiastolic" ? "拡張期血圧" :
                      name === "pulse" ? "脈拍" :
                      name === "temperature" ? "体温" : "SpO2"
                    ]}
                    labelFormatter={(value) => `日付: ${value}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bloodPressureSystolic" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="収縮期血圧"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pulse" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="脈拍"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="oxygenSaturation" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="SpO2"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 検査値推移 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">検査値推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={labTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [
                      value,
                      name === "bloodSugar" ? "血糖値" :
                      name === "hba1c" ? "HbA1c" : "総コレステロール"
                    ]}
                    labelFormatter={(value) => `日付: ${value}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bloodSugar" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="血糖値"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="hba1c" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="HbA1c"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cholesterol" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    name="総コレステロール"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 記録種別分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">記録種別分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-500">経過記録</Badge>
                <span className="text-sm">{recordCounts.progress}件</span>
              </div>
              <Progress 
                value={(recordCounts.progress / totalRecords) * 100} 
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-500">看護記録</Badge>
                <span className="text-sm">{recordCounts.nursing}件</span>
              </div>
              <Progress 
                value={(recordCounts.nursing / totalRecords) * 100} 
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-500">処方履歴</Badge>
                <span className="text-sm">{recordCounts.prescription}件</span>
              </div>
              <Progress 
                value={(recordCounts.prescription / totalRecords) * 100} 
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-500">検査結果</Badge>
                <span className="text-sm">{recordCounts.test}件</span>
              </div>
              <Progress 
                value={(recordCounts.test / totalRecords) * 100} 
                className="w-32"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}