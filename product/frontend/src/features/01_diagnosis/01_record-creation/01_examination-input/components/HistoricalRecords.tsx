import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Separator } from "@/shared/components/atoms/separator";
import { Input } from "@/shared/components/atoms/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/atoms/select";
import { FileText, Heart, Pill, FlaskConical, Copy, Search, Filter, CreditCard, Activity, Eye, HeartPulse } from "lucide-react";
import { useState, useMemo } from "react";

interface Record {
  id: string;
  date: string;
  time: string;
  type: "progress" | "vital" | "observation" | "treatment" | "nursing" | "prescription" | "test";
  title: string;
  content: string;
  author: string;
  insurance?: { type: string; burden: string };
  soapRecord?: string;
  vitalSigns?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
  schemas?: { [key: string]: string };  // シェーマ画像データ
}

interface HistoricalRecordsProps {
  records: Record[];
  onRecordSelect: (record: Record) => void;
  selectedRecordId?: string;
  onApplyRecord?: (record: Record) => void;
}

const recordTypeConfig = {
  progress: { icon: FileText, label: "経過記録", color: "bg-blue-500" },
  vital: { icon: Activity, label: "バイタル記録", color: "bg-green-500" },
  observation: { icon: Eye, label: "観察記録", color: "bg-purple-500" },
  treatment: { icon: HeartPulse, label: "治療記録", color: "bg-orange-500" },
  nursing: { icon: Heart, label: "看護記録", color: "bg-green-500" },
  prescription: { icon: Pill, label: "処方履歴", color: "bg-purple-500" },
  test: { icon: FlaskConical, label: "検査結果", color: "bg-orange-500" }
} as const;

export function HistoricalRecords({ records, onRecordSelect, selectedRecordId, onApplyRecord }: HistoricalRecordsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [insuranceFilter, setInsuranceFilter] = useState<string>("all");
  
  const selectedRecord = records.find(record => record.id === selectedRecordId);
  
  // フィルタリングされた記録
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = searchQuery === "" || 
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.soapRecord && record.soapRecord.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === "all" || record.type === typeFilter;
      const matchesAuthor = authorFilter === "all" || record.author === authorFilter;
      const matchesInsurance = insuranceFilter === "all" || 
        (record.insurance && record.insurance.type === insuranceFilter);
      
      return matchesSearch && matchesType && matchesAuthor && matchesInsurance;
    });
  }, [records, searchQuery, typeFilter, authorFilter, insuranceFilter]);
  
  // ユニークな記録者リスト
  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(records.map(record => record.author)));
  }, [records]);

  // ユニークな保険種別リスト
  const uniqueInsuranceTypes = useMemo(() => {
    return Array.from(new Set(records
      .filter(record => record.insurance)
      .map(record => record.insurance!.type)
    ));
  }, [records]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">時系列記録</span>
            <Badge variant="secondary" className="text-xs">
              {filteredRecords.length}/{records.length}
            </Badge>
          </div>
        </CardTitle>
        
        {/* 検索・フィルター */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="記録を検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-xs"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="記録種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">全ての種別</SelectItem>
                <SelectItem value="progress" className="text-xs">経過記録</SelectItem>
                <SelectItem value="vital" className="text-xs">バイタル記録</SelectItem>
                <SelectItem value="observation" className="text-xs">観察記録</SelectItem>
                <SelectItem value="treatment" className="text-xs">治療記録</SelectItem>
                <SelectItem value="nursing" className="text-xs">看護記録</SelectItem>
                <SelectItem value="prescription" className="text-xs">処方履歴</SelectItem>
                <SelectItem value="test" className="text-xs">検査結果</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="記録者" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">全ての記録者</SelectItem>
                {uniqueAuthors.map(author => (
                  <SelectItem key={author} value={author} className="text-xs">{author}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={insuranceFilter} onValueChange={setInsuranceFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="保険種別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">全ての保険</SelectItem>
                {uniqueInsuranceTypes.map(insuranceType => (
                  <SelectItem key={insuranceType} value={insuranceType} className="text-xs">
                    <div className="flex items-center space-x-1">
                      <CreditCard className="w-3 h-3" />
                      <span>{insuranceType}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* 記録一覧 */}
        <div className="space-y-2 p-4 pt-0 max-h-[400px] overflow-y-auto">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-xs">該当する記録が見つかりません</p>
              <p className="text-xs mt-1 opacity-75">検索条件を変更してください</p>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const config = recordTypeConfig[record.type as keyof typeof recordTypeConfig];
              // 設定が見つからない場合はデフォルト値を使用
              if (!config) {
                console.warn(`Unknown record type: ${record.type}`);
                return null;
              }
              const Icon = config.icon;
              const isSelected = selectedRecordId === record.id;
              
              return (
                <div
                  key={record.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm ${
                    isSelected ? "bg-accent border-primary shadow-sm" : "bg-card"
                  }`}
                  onClick={() => onRecordSelect(record)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded ${config.color} text-white flex-shrink-0`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          {record.date} {record.time}
                        </span>
                      </div>
                      <div className="text-xs font-medium truncate mb-2" title={record.title}>
                        {record.title}
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">記録者:</span>
                          <span>{record.author}</span>
                        </div>
                        {record.insurance && (
                          <div className="flex items-center space-x-1">
                            <CreditCard className="w-3 h-3 flex-shrink-0" />
                            <span className="font-medium">保険:</span>
                            <span>{record.insurance.type}({record.insurance.burden})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>


      </CardContent>
    </Card>
  );
}