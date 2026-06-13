import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/atoms/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/atoms/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/atoms/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Badge } from "@shared/components/atoms/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Patient {
  name: string;
  kana: string;
  patientId: string;
  birthDate: string;
  gender: string;
  age: number;
  department: string;
  ward: string;
  room: string;
  doctor: string;
  allergies: string[];
  infections: string[];
  insurance: {
    type: string;
    number: string;
    burden: string;
  };
}

interface TestResult {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

interface PatientDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  latestTestResults: TestResult[];
}

// サンプルデータ
const vitalSignsData = [
  { date: "12/20", bloodPressureSys: 145, bloodPressureDia: 95, pulse: 78, temperature: 36.7, spo2: 99 },
  { date: "12/21", bloodPressureSys: 142, bloodPressureDia: 92, pulse: 80, temperature: 36.8, spo2: 98 },
  { date: "12/22", bloodPressureSys: 150, bloodPressureDia: 95, pulse: 78, temperature: 36.7, spo2: 99 },
  { date: "12/23", bloodPressureSys: 148, bloodPressureDia: 94, pulse: 82, temperature: 36.9, spo2: 97 },
  { date: "12/24", bloodPressureSys: 140, bloodPressureDia: 90, pulse: 82, temperature: 36.8, spo2: 98 },
  { date: "12/25", bloodPressureSys: 138, bloodPressureDia: 88, pulse: 79, temperature: 36.8, spo2: 98 },
  { date: "12/26", bloodPressureSys: 140, bloodPressureDia: 90, pulse: 82, temperature: 36.8, spo2: 98 },
  { date: "12/27", bloodPressureSys: 145, bloodPressureDia: 92, pulse: 88, temperature: 36.9, spo2: 97 }
];

const labResultsData = [
  { date: "12/15", bloodSugar: 165, hba1c: 7.5, cholesterol: 235, ldl: 145, triglycerides: 190 },
  { date: "12/18", bloodSugar: 158, hba1c: 7.4, cholesterol: 230, ldl: 142, triglycerides: 185 },
  { date: "12/21", bloodSugar: 152, hba1c: 7.2, cholesterol: 225, ldl: 140, triglycerides: 180 },
  { date: "12/24", bloodSugar: 145, hba1c: 7.2, cholesterol: 220, ldl: 140, triglycerides: 180 },
  { date: "12/27", bloodSugar: 142, hba1c: 7.1, cholesterol: 218, ldl: 138, triglycerides: 175 }
];

const medicationData = [
  { date: "12/15", amlodipine: 2.5, metformin: 250, aspirin: 100 },
  { date: "12/18", amlodipine: 2.5, metformin: 250, aspirin: 100 },
  { date: "12/21", amlodipine: 5.0, metformin: 250, aspirin: 100 },
  { date: "12/24", amlodipine: 5.0, metformin: 500, aspirin: 100 },
  { date: "12/27", amlodipine: 5.0, metformin: 500, aspirin: 100 }
];

const getTrendIcon = (current: number, previous: number) => {
  if (current > previous) return <TrendingUp className="w-3 h-3 text-red-500" />;
  if (current < previous) return <TrendingDown className="w-3 h-3 text-green-500" />;
  return <Minus className="w-3 h-3 text-gray-500" />;
};

export function PatientDetailDialog({ isOpen, onClose, patient, latestTestResults }: PatientDetailDialogProps) {
  const latestVitals = vitalSignsData[vitalSignsData.length - 1];
  const previousVitals = vitalSignsData[vitalSignsData.length - 2];
  const latestLab = labResultsData[labResultsData.length - 1];
  const previousLab = labResultsData[labResultsData.length - 2];

  // 検査結果をカテゴリ別にグループ化
  const groupedTestResults = latestTestResults.reduce((groups, result) => {
    const key = result.name;
    if (!groups[key]) {
      groups[key] = result;
    }
    return groups;
  }, {} as { [key: string]: TestResult });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>{patient.name}さんの詳細情報</span>
          </DialogTitle>
          <DialogDescription>
            患者の時系列データ（バイタルサイン、検査結果、処方推移）を表示します。
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="vitals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vitals">バイタルサイン</TabsTrigger>
            <TabsTrigger value="lab">検査結果</TabsTrigger>
            <TabsTrigger value="medication">処方推移</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vitals" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    血圧
                    {getTrendIcon(latestVitals.bloodPressureSys, previousVitals.bloodPressureSys)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestVitals.bloodPressureSys}/{latestVitals.bloodPressureDia}
                  </div>
                  <div className="text-xs text-muted-foreground">mmHg</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    脈拍
                    {getTrendIcon(latestVitals.pulse, previousVitals.pulse)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{latestVitals.pulse}</div>
                  <div className="text-xs text-muted-foreground">bpm</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    体温
                    {getTrendIcon(latestVitals.temperature, previousVitals.temperature)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{latestVitals.temperature}</div>
                  <div className="text-xs text-muted-foreground">°C</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    SpO2
                    {getTrendIcon(latestVitals.spo2, previousVitals.spo2)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{latestVitals.spo2}</div>
                  <div className="text-xs text-muted-foreground">%</div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>血圧・脈拍推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vitalSignsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bloodPressureSys" stroke="#ef4444" strokeWidth={2} name="収縮期血圧" />
                    <Line type="monotone" dataKey="bloodPressureDia" stroke="#f97316" strokeWidth={2} name="拡張期血圧" />
                    <Line type="monotone" dataKey="pulse" stroke="#3b82f6" strokeWidth={2} name="脈拍" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>体温・SpO2推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vitalSignsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2} name="体温" />
                    <Line type="monotone" dataKey="spo2" stroke="#8b5cf6" strokeWidth={2} name="SpO2" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lab" className="space-y-4">
            {/* 実際の検査結果を表示 */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {latestTestResults.length > 0 ? (
                latestTestResults.map((result, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        {result.name}
                        <Minus className="w-4 h-4 text-gray-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${result.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                        {result.value}
                      </div>
                      <div className="text-xs text-muted-foreground">{result.unit}</div>
                      <Badge 
                        variant={result.isAbnormal ? "destructive" : "secondary"} 
                        className="text-xs mt-1"
                      >
                        {result.isAbnormal ? "異常" : "正常"}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        基準値: {result.normalRange}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center p-8">
                  <div className="text-center space-y-2">
                    <div className="text-gray-400 text-lg">検査結果がありません</div>
                    <div className="text-sm text-muted-foreground">
                      新患または検査未実施の患者です
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 従来のサンプルデータも表示（参考用） */}
            {latestTestResults.length > 0 && (
              <>
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">参考：サンプルデータによる時系列検査結果</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          血糖値（サンプル）
                          {getTrendIcon(latestLab.bloodSugar, previousLab.bloodSugar)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{latestLab.bloodSugar}</div>
                        <div className="text-xs text-muted-foreground">mg/dl</div>
                        <Badge variant="destructive" className="text-xs mt-1">高値</Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          HbA1c（サンプル）
                          {getTrendIcon(latestLab.hba1c, previousLab.hba1c)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{latestLab.hba1c}</div>
                        <div className="text-xs text-muted-foreground">%</div>
                        <Badge variant="destructive" className="text-xs mt-1">高値</Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          総コレステロール（サンプル）
                          {getTrendIcon(latestLab.cholesterol, previousLab.cholesterol)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{latestLab.cholesterol}</div>
                        <div className="text-xs text-muted-foreground">mg/dl</div>
                        <Badge variant="secondary" className="text-xs mt-1">正常</Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          LDL-C（サンプル）
                          {getTrendIcon(latestLab.ldl, previousLab.ldl)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{latestLab.ldl}</div>
                        <div className="text-xs text-muted-foreground">mg/dl</div>
                        <Badge variant="destructive" className="text-xs mt-1">高値</Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          中性脂肪（サンプル）
                          {getTrendIcon(latestLab.triglycerides, previousLab.triglycerides)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{latestLab.triglycerides}</div>
                        <div className="text-xs text-muted-foreground">mg/dl</div>
                        <Badge variant="destructive" className="text-xs mt-1">高値</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle>血糖・HbA1c推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={labResultsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bloodSugar" stroke="#ef4444" strokeWidth={2} name="血糖値" />
                    <Line type="monotone" dataKey="hba1c" stroke="#f97316" strokeWidth={2} name="HbA1c" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>脂質検査推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={labResultsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cholesterol" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="総コレステロール" />
                    <Area type="monotone" dataKey="ldl" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="LDL-C" />
                    <Area type="monotone" dataKey="triglycerides" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="中性脂肪" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>処方薬推移</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={medicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amlodipine" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="アムロジピン (mg)" />
                    <Area type="monotone" dataKey="metformin" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="メトホルミン (mg)" />
                    <Area type="monotone" dataKey="aspirin" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="アスピリン (mg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">アムロジピン</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5mg</div>
                  <div className="text-xs text-muted-foreground">1日1回</div>
                  <Badge variant="outline" className="text-xs mt-1">増量</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">メトホルミン</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">500mg</div>
                  <div className="text-xs text-muted-foreground">1日2回</div>
                  <Badge variant="outline" className="text-xs mt-1">増量</Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">アスピリン</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100mg</div>
                  <div className="text-xs text-muted-foreground">1日1回</div>
                  <Badge variant="secondary" className="text-xs mt-1">継続</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}