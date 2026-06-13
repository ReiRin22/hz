// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
"use client";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, Shield, Heart, Activity, TestTube } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/atoms/accordion';
import { Badge } from '@/shared/components/atoms/badge';

interface SystemMenuProps {
  onMenuClick?: (menuId: string) => void;
}

export function SystemMenu({ onMenuClick }: SystemMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // サンプルデータ
  const patientData = {
    allergies: [
      { id: '1', name: 'ペニシリン系抗生物質', severity: '重度', symptoms: '全身蕁麻疹、呼吸困難' },
      { id: '2', name: '造影剤', severity: '中度', symptoms: '発疹' },
    ],
    infections: [
      { id: '1', name: 'HBs抗原', status: '陰性' },
      { id: '2', name: 'HCV抗体', status: '陰性' },
    ],
    isolationFlag: false,
    medicalHistory: [
      { id: '1', condition: '高血圧症', since: '2020-03', treatment: 'ARB内服中' },
      { id: '2', condition: '脂質異常症', since: '2021-06', treatment: 'スタチン内服中' },
    ],
    vitals: {
      date: '2024/12/02 09:30',
      bp: '128/82',
      pulse: '72',
      temp: '36.5',
      spo2: '98',
    },
    recentLabs: {
      date: '2024/11/28',
      items: [
        { name: 'WBC', value: '6,200', unit: '/μL', status: 'normal' },
        { name: 'Hb', value: '14.2', unit: 'g/dL', status: 'normal' },
        { name: 'CRP', value: '0.3', unit: 'mg/dL', status: 'normal' },
      ],
    },
  };

  return (
    <div className="relative flex">
      {/* 開閉タブ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 bg-sidebar border-l border-sidebar-border flex items-start justify-center hover:bg-sidebar-accent transition-colors z-10"
      >
        <div className="flex flex-col items-center pt-4">
          {isOpen ? (
            <ChevronRight className="w-5 h-5 text-sidebar-foreground" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
          )}
          <div className="text-xs text-sidebar-foreground mt-2 writing-mode-vertical">
            患者詳細
          </div>
        </div>
      </button>

      {/* パネル */}
      <div
        className={`
          fixed right-0 top-0 h-screen bg-card border-l border-border shadow-2xl
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ width: '450px', marginRight: '40px' }}
      >
        <div className="h-full flex flex-col">
          {/* ヘッダー */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-card-foreground">患者詳細情報</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">山田 太郎 (43歳・男性)</p>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 overflow-auto">
            <Accordion type="multiple" defaultValue={['allergy', 'history']} className="px-4">
              {/* アレルギー */}
              <AccordionItem value="allergy">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span>アレルギー</span>
                    <Badge variant="destructive" className="ml-2">{patientData.allergies.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {patientData.allergies.map((allergy) => (
                      <div key={allergy.id} className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <span className="">{allergy.name}</span>
                          <Badge variant="destructive" className="text-xs">{allergy.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">症状: {allergy.symptoms}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 感染症・隔離フラグ */}
              <AccordionItem value="infection">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>感染症・隔離フラグ</span>
                    {patientData.isolationFlag && (
                      <Badge variant="destructive" className="ml-2">隔離中</Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {patientData.infections.map((infection) => (
                      <div key={infection.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{infection.name}</span>
                        <Badge variant={infection.status === '陰性' ? 'secondary' : 'destructive'}>
                          {infection.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 既往歴 */}
              <AccordionItem value="history">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>既往歴</span>
                    <Badge className="ml-2">{patientData.medicalHistory.length}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {patientData.medicalHistory.map((history) => (
                      <div key={history.id} className="p-3 bg-muted/50 border rounded-lg">
                        <div className="mb-1">{history.condition}</div>
                        <p className="text-sm text-muted-foreground">
                          {history.since}〜 | {history.treatment}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 直近バイタル */}
              <AccordionItem value="vitals">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>直近バイタル</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">{patientData.vitals.date}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground">血圧</div>
                        <div className="">{patientData.vitals.bp} mmHg</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground">脈拍</div>
                        <div className="">{patientData.vitals.pulse} bpm</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground">体温</div>
                        <div className="">{patientData.vitals.temp} ℃</div>
                      </div>
                      <div className="p-2 bg-muted/50 rounded">
                        <div className="text-xs text-muted-foreground">SpO2</div>
                        <div className="">{patientData.vitals.spo2} %</div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 直近検査サマリ */}
              <AccordionItem value="labs">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    <span>直近検査サマリ</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">{patientData.recentLabs.date}</p>
                    <div className="space-y-2">
                      {patientData.recentLabs.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{item.name}</span>
                          <span className="">
                            {item.value} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <style>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
