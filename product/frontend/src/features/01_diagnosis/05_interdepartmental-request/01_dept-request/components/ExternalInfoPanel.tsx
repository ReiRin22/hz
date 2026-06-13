import { useState } from 'react';
import { Search, Building2, Calendar, FileText, TestTube, Clock, User, MapPin, Phone } from 'lucide-react';
import { Input } from '@/shared/components/atoms/input';
import { Button } from '@/shared/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/atoms/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/atoms/tabs';
import { Badge } from '@/shared/components/atoms/badge';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface ExternalInfoPanelProps {
  currentPatient: CurrentPatient;
}

// モック他院情報データ
const mockExternalData = {
  hospitals: [
    {
      id: 'h001',
      name: '○○総合病院',
      address: '東京都新宿区○○町1-2-3',
      phone: '03-1234-5678',
      lastVisit: '2024-11-15',
      department: '循環器内科',
      visits: [
        {
          date: '2024-11-15',
          department: '循環器内科',
          doctor: '田中一郎',
          diagnosis: '高血圧症、狭心症',
          medications: [
            { name: 'アムロジピン錠5mg', dosage: '1日1回朝食後', days: '28日分' },
            { name: 'アスピリン錠100mg', dosage: '1日1回夕食後', days: '28日分' }
          ],
          labResults: [
            { name: '総コレステロール', value: '220', unit: 'mg/dL', reference: '150-220' },
            { name: 'LDLコレステロール', value: '145', unit: 'mg/dL', reference: '<120' },
            { name: 'HDLコレステロール', value: '52', unit: 'mg/dL', reference: '>40' }
          ]
        },
        {
          date: '2024-10-18',
          department: '循環器内科',
          doctor: '田中一郎',
          diagnosis: '高血圧症',
          medications: [
            { name: 'アムロジピン錠2.5mg', dosage: '1日1回朝食後', days: '28日分' }
          ],
          labResults: [
            { name: '血圧', value: '145/92', unit: 'mmHg', reference: '<140/90' }
          ]
        }
      ]
    },
    {
      id: 'h002',
      name: '△△クリニック',
      address: '東京都渋谷区△△1-5-7',
      phone: '03-9876-5432',
      lastVisit: '2024-10-28',
      department: '内科',
      visits: [
        {
          date: '2024-10-28',
          department: '内科',
          doctor: '佐藤花子',
          diagnosis: '感冒',
          medications: [
            { name: 'カロナール錠200mg', dosage: '1日3回食後', days: '5日分' },
            { name: 'ムコダイン錠250mg', dosage: '1日3回食後', days: '5日分' }
          ],
          labResults: []
        }
      ]
    }
  ],
  summary: {
    totalHospitals: 2,
    recentVisit: '2024-11-15',
    chronicConditions: ['高血圧症', '狭心症'],
    currentMedications: [
      'アムロジピン錠5mg',
      'アスピリン錠100mg'
    ],
    allergies: ['ペニシリン系抗生物質'],
    bloodType: 'A型'
  }
};

export function ExternalInfoPanel({ currentPatient }: ExternalInfoPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  const filteredHospitals = mockExternalData.hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedHospitalData = selectedHospital 
    ? mockExternalData.hospitals.find(h => h.id === selectedHospital)
    : null;

  return (
    <div className="flex h-full bg-background">
      {/* 左ペイン：医療機関一覧 */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            他院情報参照
          </h2>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm">患者名: {currentPatient.name}</span>
            </div>
            <div>
              <span className="text-sm">患者番号: {currentPatient.patientNumber}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="医療機関名または診療科で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filteredHospitals.map((hospital) => (
              <Card 
                key={hospital.id} 
                className={`cursor-pointer transition-colors ${
                  selectedHospital === hospital.id 
                    ? 'ring-2 ring-primary' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedHospital(hospital.id)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">{hospital.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {hospital.department}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{hospital.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>最終受診: {hospital.lastVisit}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{hospital.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 右ペイン：詳細情報 */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border">
          <h2>詳細情報</h2>
        </div>

        {!selectedHospital ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">医療機関を選択してください</p>
              <p className="text-sm">左側の一覧から確認したい医療機関をクリックしてください</p>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">概要</TabsTrigger>
                <TabsTrigger value="visits">受診履歴</TabsTrigger>
                <TabsTrigger value="medications">処方薬</TabsTrigger>
                <TabsTrigger value="lab">検査結果</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="summary" className="h-full">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {/* 医療機関情報 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            {selectedHospitalData?.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">住所:</span>
                              <p>{selectedHospitalData?.address}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">電話番号:</span>
                              <p>{selectedHospitalData?.phone}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">最終受診日:</span>
                              <p>{selectedHospitalData?.lastVisit}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">受診診療科:</span>
                              <p>{selectedHospitalData?.department}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 全体サマリー */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">全体サマリー</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <span className="text-sm text-muted-foreground">慢性疾患:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mockExternalData.summary.chronicConditions.map((condition, index) => (
                                <Badge key={index} variant="outline">{condition}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm text-muted-foreground">継続薬物治療:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mockExternalData.summary.currentMedications.map((med, index) => (
                                <Badge key={index} variant="secondary">{med}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm text-muted-foreground">アレルギー:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mockExternalData.summary.allergies.map((allergy, index) => (
                                <Badge key={index} variant="destructive">{allergy}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm text-muted-foreground">血液型:</span>
                            <span className="ml-2">{mockExternalData.summary.bloodType}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="visits" className="h-full">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {selectedHospitalData?.visits.map((visit, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {visit.date} - {visit.department}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <span className="text-sm text-muted-foreground">担当医:</span>
                              <span className="ml-2">{visit.doctor}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">診断:</span>
                              <p className="mt-1">{visit.diagnosis}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="medications" className="h-full">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {selectedHospitalData?.visits.map((visit, visitIndex) => (
                        visit.medications.length > 0 && (
                          <Card key={visitIndex}>
                            <CardHeader>
                              <CardTitle className="text-base">{visit.date} 処方</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {visit.medications.map((med, medIndex) => (
                                  <div key={medIndex} className="p-2 bg-muted/30 rounded">
                                    <div className="font-medium">{med.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {med.dosage} / {med.days}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="lab" className="h-full">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-4">
                      {selectedHospitalData?.visits.map((visit, visitIndex) => (
                        visit.labResults.length > 0 && (
                          <Card key={visitIndex}>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <TestTube className="w-4 h-4" />
                                {visit.date} 検査結果
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {visit.labResults.map((lab, labIndex) => (
                                  <div key={labIndex} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                                    <span className="font-medium">{lab.name}</span>
                                    <div className="text-right">
                                      <div className="font-medium">
                                        {lab.value} {lab.unit}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        基準値: {lab.reference}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}