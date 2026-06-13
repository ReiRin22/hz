import { useState } from "react";
import { Badge } from "@/shared/components/atoms/badge";
import { Button } from "@/shared/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/atoms/card";
import { ScrollArea } from "@/shared/components/atoms/scroll-area";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/atoms/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/atoms/popover";
import { Calendar } from "@/shared/components/atoms/calendar";
import { CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { MedicationDetail } from "./MedicationDetail";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface MedicationRecord {
  id: string;
  category: "内服" | "外用" | "注射" | "点眼";
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  amount?: string;
  prescribedBy: "own" | "other";
  patientType: "入院" | "外来";
  admissionDate?: string;
  hospitalName?: string;
  isAllergen?: boolean;
  isNarcotic?: boolean;
  isPsychotropic?: boolean;
  isPotentDrug?: boolean;
}

interface LabTestRecord {
  id: string;
  testName: string;
  testDate: string;
  value: string;
  unit: string;
  referenceRange: string;
  category: string;
}

interface MedicationMatrixProps {
  medications: MedicationRecord[];
  labTests: LabTestRecord[];
  period: 14 | 30 | 90;
  onPeriodChange: (period: 14 | 30 | 90) => void;
  includeOtherHospitals: boolean;
  onIncludeOtherHospitalsChange: (include: boolean) => void;
  startDate: Date;
  onStartDateChange: (date: Date) => void;
}

export function MedicationMatrix({ medications, labTests, period, onPeriodChange, includeOtherHospitals, onIncludeOtherHospitalsChange, startDate, onStartDateChange }: MedicationMatrixProps) {
  const [selectedMedication, setSelectedMedication] = useState<MedicationRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [hoveredTest, setHoveredTest] = useState<{
    testName: string;
    value: string;
    unit: string;
    referenceRange: string;
    date: string;
    x: number;
    y: number;
  } | null>(null);
  
  const [selectedCategories, setSelectedCategories] = useState<Array<"内服" | "外用" | "注射">>(["内服", "外用", "注射"]);
  const [selectedPatientTypes, setSelectedPatientTypes] = useState<Array<"入院" | "外来">>(["入院", "外来"]);
  
  const uniqueTestNames = Array.from(new Set(labTests.map(test => test.testName)));
  const [selectedTests, setSelectedTests] = useState<string[]>(uniqueTestNames);
  
  const handleCategoryToggle = (category: "内服" | "外用" | "注射") => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };
  
  const handlePatientTypeToggle = (patientType: "入院" | "外来") => {
    setSelectedPatientTypes(prev => 
      prev.includes(patientType) 
        ? prev.filter(type => type !== patientType)
        : [...prev, patientType]
    );
  };
  
  const handleTestToggle = (testName: string) => {
    setSelectedTests(prev => 
      prev.includes(testName) 
        ? prev.filter(name => name !== testName)
        : [...prev, testName]
    );
  };

  const handleMedicationClick = (medication: MedicationRecord) => {
    setSelectedMedication(medication);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedMedication(null);
  };

  const generateDates = (days: number, baseDate: Date) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates(period, startDate);

  const filteredLabTests = labTests.filter(test => {
    const testDate = test.testDate;
    const startDateStr = dates[0].toISOString().split('T')[0];
    const endDateStr = dates[dates.length - 1].toISOString().split('T')[0];
    return testDate >= startDateStr && testDate <= endDateStr;
  });

  const allTestNames = Array.from(new Set(filteredLabTests.map(test => test.testName))).sort();
  const colors = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];
  
  const symbols = ["●", "■", "▲", "◆", "★", "▼", "◀", "▶", "♦", "✦", "⬤", "◼"];
  
  const getStyleForTest = (testName: string) => {
    const originalIndex = allTestNames.indexOf(testName);
    return {
      color: colors[originalIndex % colors.length],
      symbol: symbols[originalIndex % symbols.length]
    };
  };

  const filteredMedications = medications.filter(med => {
    if (!includeOtherHospitals && med.prescribedBy !== "own") return false;
    
    if (med.category === "点眼") {
      if (!selectedCategories.includes("外用")) return false;
    } else {
      if (!selectedCategories.includes(med.category)) return false;
    }
    
    if (!selectedPatientTypes.includes(med.patientType)) return false;
    
    return true;
  });

  const prescriptionMedications = filteredMedications.filter(med => 
    med.category === "内服" || med.category === "外用" || med.category === "点眼"
  );
  const injectionMedications = filteredMedications.filter(med => 
    med.category === "注射"
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "内服": return "bg-blue-100 border-blue-300 text-blue-800";
      case "外用": return "bg-green-100 border-green-300 text-green-800";
      case "点眼": return "bg-green-100 border-green-300 text-green-800";
      case "注射": return "bg-red-100 border-red-300 text-red-800";
      default: return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };
  
  const getCategoryColorDark = (category: string) => {
    switch (category) {
      case "内服": return "bg-blue-300 border-blue-500 text-blue-950";
      case "外用": return "bg-green-300 border-green-500 text-green-950";
      case "点眼": return "bg-green-300 border-green-500 text-green-950";
      case "注射": return "bg-red-300 border-red-500 text-red-950";
      default: return "bg-gray-300 border-gray-500 text-gray-950";
    }
  };
  
  const getCategoryDisplayName = (category: string) => {
    return category === "点眼" ? "外用" : category;
  };

  const isDateInRange = (date: Date, startDate: string, endDate: string) => {
    const checkDate = date.toISOString().split('T')[0];
    return checkDate >= startDate && checkDate <= endDate;
  };

  const getDaysDifference = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const isValueNormal = (value: string, referenceRange: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return true;
    
    if (referenceRange.includes('-')) {
      const [min, max] = referenceRange.split('-').map(v => parseFloat(v.trim()));
      if (!isNaN(min) && !isNaN(max)) {
        return numValue >= min && numValue <= max;
      }
    } else if (referenceRange.includes('≥')) {
      const min = parseFloat(referenceRange.replace('≥', '').trim());
      if (!isNaN(min)) {
        return numValue >= min;
      }
    } else if (referenceRange.includes('<')) {
      const max = parseFloat(referenceRange.replace('<', '').trim());
      if (!isNaN(max)) {
        return numValue < max;
      }
    }
    return true;
  };

  const getLabValueColor = (value: string, referenceRange: string) => {
    return isValueNormal(value, referenceRange)
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-orange-100 text-orange-800 border-orange-300";
  };

  // 薬剤リストを描画するヘルパー関数
  const renderMedicationRows = (medicationList: MedicationRecord[]) => {
    const groupedByName = new Map<string, MedicationRecord[]>();
    
    medicationList.forEach(medication => {
      const existing = groupedByName.get(medication.name) || [];
      existing.push(medication);
      groupedByName.set(medication.name, existing);
    });
    
    const rows: JSX.Element[] = [];
    
    groupedByName.forEach((medications, name) => {
      const sortedMedications = medications.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      const representative = sortedMedications[0];
      
      // 行の高さは常に56px（1段のみ）
      const rowHeight = 56;
      
      rows.push(
        <div 
          key={name} 
          className="flex border-b hover:bg-muted/30"
          style={{ height: `${rowHeight}px`, isolation: 'isolate' }}
        >
          <div className="w-[380px] flex-shrink-0 py-2.5 px-3 border-r flex flex-col justify-center gap-1.5">
            <div>
              <span className="text-sm break-words leading-tight">{name}</span>
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs items-center -mt-1">
              <Badge 
                variant="outline" 
                className={`text-xs py-0 h-5 ${getCategoryColor(representative.category)}`}
              >
                {getCategoryDisplayName(representative.category)}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs py-0 h-5 ${representative.prescribedBy === "own" ? "bg-slate-100 border-slate-300 text-slate-800" : "bg-orange-100 border-orange-300 text-orange-800"}`}
              >
                {representative.prescribedBy === "own" ? "自院" : "他院"}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs py-0 h-5 ${representative.patientType === "入院" ? "bg-amber-100 border-amber-300 text-amber-800" : "bg-sky-100 border-sky-300 text-sky-800"}`}
              >
                {representative.patientType}
              </Badge>
              {representative.isAllergen && (
                <Badge 
                  variant="outline" 
                  className="text-xs py-0 h-5 bg-red-100 border-red-300 text-red-800 font-bold"
                >
                  アレルギー
                </Badge>
              )}
              {representative.isNarcotic && (
                <Badge 
                  variant="outline" 
                  className="text-xs py-0 h-5 bg-purple-100 border-purple-300 text-purple-800 font-bold"
                >
                  麻薬
                </Badge>
              )}
              {representative.isPsychotropic && (
                <Badge 
                  variant="outline" 
                  className="text-xs py-0 h-5 bg-pink-100 border-pink-300 text-pink-800 font-bold"
                >
                  向精神薬
                </Badge>
              )}
              {representative.isPotentDrug && (
                <Badge 
                  variant="outline" 
                  className="text-xs py-0 h-5 bg-yellow-100 border-yellow-300 text-yellow-800 font-bold"
                >
                  劇薬
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden" style={{ height: `${rowHeight}px` }}>
            {/* 上段のセル */}
            <div className="absolute top-0 left-0 right-0 h-7 flex">
              {dates.map((date, dateIndex) => {
                const medicationsForDate = sortedMedications.filter(med => {
                  return isDateInRange(date, med.startDate, med.endDate);
                });
                
                let totalAmount = 0;
                let displayText = "";
                
                if (medicationsForDate.length > 0) {
                  const firstMed = medicationsForDate[0];
                  if (firstMed.category === "外用" || firstMed.category === "点眼") {
                    displayText = "●";
                  } else {
                    medicationsForDate.forEach(med => {
                      // dosageから数値を抽出
                      const amount = parseFloat(med.dosage.replace(/[^\d.]/g, ''));
                      if (!isNaN(amount)) {
                        // frequencyから服用回数を抽出（例：「1日3回 朝昼夕食後」→ 3）
                        const frequencyMatch = med.frequency.match(/1日(\d+)回/);
                        const timesPerDay = frequencyMatch ? parseInt(frequencyMatch[1]) : 1;
                        totalAmount += amount * timesPerDay;
                      }
                    });
                    displayText = totalAmount.toString();
                  }
                }
                
                return (
                  <div key={dateIndex} className="w-12 flex-shrink-0 border-r border-b box-border">
                    {medicationsForDate.length > 0 && (
                      <div 
                        className={`h-full flex items-center justify-center ${
                          medicationsForDate.length > 1 
                            ? getCategoryColorDark(medicationsForDate[0].category)
                            : getCategoryColor(medicationsForDate[0].category)
                        } cursor-pointer hover:opacity-80`}
                        title={`${medicationsForDate[0].name}\n用法: ${medicationsForDate.map(m => m.frequency).join(', ')}\n用量: ${medicationsForDate.map(m => m.dosage).join(', ')}\n患者区分: ${medicationsForDate[0].patientType}\n日付: ${date.getMonth() + 1}/${date.getDate()}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMedicationClick(medicationsForDate[0]);
                        }}
                      >
                        <div className="text-xs leading-none font-medium">
                          {displayText}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* 下段の左端と右端の罫線 */}
            <div className="absolute top-7 h-7 w-px bg-border pointer-events-none" style={{ left: '0px' }}></div>
            <div className="absolute top-7 h-7 w-px bg-border right-0 pointer-events-none"></div>
            
            {/* 下段のバー */}
            {sortedMedications.map((medication, medIndex) => {
              // この処方の開始位置を探す
              const startDateIndex = dates.findIndex(date => 
                date.toISOString().split('T')[0] === medication.startDate
              );
              
              if (startDateIndex === -1) return null;
              
              const periodDays = getDaysDifference(medication.startDate, medication.endDate);
              
              // 表示範囲内での表示日数を計算
              let displayDays = 0;
              for (let i = startDateIndex; i < dates.length; i++) {
                if (isDateInRange(dates[i], medication.startDate, medication.endDate)) {
                  displayDays++;
                } else {
                  break;
                }
              }
              
              if (displayDays === 0) return null;
              
              return (
                <div 
                  key={medIndex}
                  className="absolute flex items-center justify-center cursor-pointer hover:bg-muted/50 px-1"
                  style={{ 
                    top: '28px',
                    left: `${startDateIndex * 48}px`,
                    width: `${displayDays * 48}px`,
                    height: '28px',
                    zIndex: 10
                  }}
                  title={`${medication.name}\n用法: ${medication.frequency}\n用量: ${medication.dosage}\n処方日数: ${periodDays}日分\n患者区分: ${medication.patientType}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMedicationClick(medication);
                  }}
                >
                  <div className="absolute top-0 bottom-0 w-px bg-border" style={{ left: '-1px' }}></div>
                  <div className="absolute top-0 bottom-0 w-px bg-border" style={{ right: '0px' }}></div>
                  <div className="text-xs leading-none text-center w-full px-0.5 text-black" title={`${medication.frequency} ${periodDays}日分`}>
                    {medication.frequency} {periodDays}日分
                  </div>
                </div>
              );
            })}
            
            <div style={{ height: `${rowHeight}px` }} className="opacity-0">
              {dates.map((date, dateIndex) => (
                <div key={dateIndex} className="w-12 inline-block"></div>
              ))}
            </div>
          </div>
        </div>
      );
    });
    
    return rows;
  };

  // 検査結果グラフを描画するヘルパー関数
  const renderLabTestChart = () => {
    const uniqueTests = allTestNames.filter(testName => selectedTests.includes(testName));
    const selectedLabTests = filteredLabTests.filter(test => selectedTests.includes(test.testName));
    
    if (uniqueTests.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          検査項目を選択してください
        </div>
      );
    }
    
    const testRanges = new Map<string, { min: number; max: number }>();
    
    uniqueTests.forEach(testName => {
      const testsForThisName = selectedLabTests.filter(test => test.testName === testName);
      let min = Infinity;
      let max = -Infinity;
      
      testsForThisName.forEach(test => {
        const value = parseFloat(test.value);
        if (!isNaN(value)) {
          min = Math.min(min, value);
          max = Math.max(max, value);
        }
      });
      
      const range = max - min;
      const margin = range > 0 ? range * 0.15 : Math.abs(max) * 0.1 || 1;
      testRanges.set(testName, {
        min: min - margin,
        max: max + margin
      });
    });

    const totalGraphHeight = 343;
    const graphPadding = 30;
    const cellWidth = 48;
    const totalWidth = dates.length * cellWidth;
    const baselineOffset = 30;

    const valueToY = (value: number, testName: string, itemIndex: number) => {
      const range = testRanges.get(testName);
      if (!range) return totalGraphHeight / 2;
      
      const offset = itemIndex * baselineOffset;
      const totalOffset = (uniqueTests.length - 1) * baselineOffset;
      const availableHeight = totalGraphHeight - graphPadding * 2 - totalOffset;
      
      const normalized = (value - range.min) / (range.max - range.min);
      return totalGraphHeight - graphPadding - offset - (normalized * availableHeight);
    };

    const dateIndexToX = (index: number) => {
      return index * cellWidth + cellWidth / 2;
    };

    return (
      <div className="relative" style={{ width: `${totalWidth}px`, height: `${totalGraphHeight}px` }}>
        <div className="absolute inset-0 flex">
          {dates.map((date, index) => (
            <div key={index} className="w-12 flex-shrink-0 border-r"></div>
          ))}
        </div>

        <svg 
          width={totalWidth} 
          height={totalGraphHeight} 
          className="absolute inset-0"
        >
          {dates.map((date, index) => (
            <line
              key={`grid-${index}`}
              x1={dateIndexToX(index)}
              y1={0}
              x2={dateIndexToX(index)}
              y2={totalGraphHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {uniqueTests.map((testName, itemIndex) => {
            const { color, symbol } = getStyleForTest(testName);
            
            const dataPoints: { x: number; y: number; test: LabTestRecord }[] = [];
            
            dates.forEach((date, dateIndex) => {
              const dateStr = date.toISOString().split('T')[0];
              const test = selectedLabTests.find(
                t => t.testName === testName && t.testDate === dateStr
              );
              
              if (test) {
                const value = parseFloat(test.value);
                if (!isNaN(value)) {
                  dataPoints.push({
                    x: dateIndexToX(dateIndex),
                    y: valueToY(value, testName, itemIndex),
                    test: test
                  });
                }
              }
            });

            const linePath = dataPoints
              .map((point, index) => {
                if (index === 0) {
                  return `M ${point.x} ${point.y}`;
                } else {
                  return `L ${point.x} ${point.y}`;
                }
              })
              .join(' ');

            return (
              <g key={testName}>
                {dataPoints.length > 1 && (
                  <path
                    d={linePath}
                    stroke={color}
                    strokeWidth="3"
                    fill="none"
                  />
                )}

                {dataPoints.map((point, pointIndex) => {
                  const dateIndex = dates.findIndex(d => d.toISOString().split('T')[0] === point.test.testDate);
                  const displayDate = dateIndex !== -1 ? `${dates[dateIndex].getMonth() + 1}/${dates[dateIndex].getDate()}` : '';
                  
                  return (
                    <g 
                      key={pointIndex}
                      onMouseEnter={(e) => {
                        const rect = (e.target as SVGElement).getBoundingClientRect();
                        setHoveredTest({
                          testName: testName,
                          value: point.test.value,
                          unit: point.test.unit,
                          referenceRange: point.test.referenceRange,
                          date: displayDate,
                          x: rect.left + window.scrollX,
                          y: rect.top + window.scrollY - 10
                        });
                      }}
                      onMouseLeave={() => setHoveredTest(null)}
                    >
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="16"
                        fill="transparent"
                        className="cursor-pointer"
                      />
                      <text
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={color}
                        fontSize="20"
                        fontWeight="bold"
                        style={{ pointerEvents: 'none' }}
                      >
                        {symbol}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <Card className="flex-1 gap-0">
      <CardHeader className="pt-2 pb-0 px-6">
        <div className="flex justify-between items-center pb-2">
          <CardTitle>薬歴参照</CardTitle>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">薬剤区分:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="category-oral"
                    checked={selectedCategories.includes("内服")}
                    onCheckedChange={() => handleCategoryToggle("内服")}
                  />
                  <label htmlFor="category-oral" className="text-sm cursor-pointer">
                    内服
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="category-external"
                    checked={selectedCategories.includes("外用")}
                    onCheckedChange={() => handleCategoryToggle("外用")}
                  />
                  <label htmlFor="category-external" className="text-sm cursor-pointer">
                    外用
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="category-injection"
                    checked={selectedCategories.includes("注射")}
                    onCheckedChange={() => handleCategoryToggle("注射")}
                  />
                  <label htmlFor="category-injection" className="text-sm cursor-pointer">
                    注射
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">患者区分:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="patient-inpatient"
                    checked={selectedPatientTypes.includes("入院")}
                    onCheckedChange={() => handlePatientTypeToggle("入院")}
                  />
                  <label htmlFor="patient-inpatient" className="text-sm cursor-pointer">
                    入院
                  </label>
                </div>
                <div className="flex items-center gap-1.5">
                  <Checkbox
                    id="patient-outpatient"
                    checked={selectedPatientTypes.includes("外来")}
                    onCheckedChange={() => handlePatientTypeToggle("外来")}
                  />
                  <label htmlFor="patient-outpatient" className="text-sm cursor-pointer">
                    外来
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="includeOtherHospitals"
                checked={includeOtherHospitals}
                onCheckedChange={(checked) => onIncludeOtherHospitalsChange(checked as boolean)}
              />
              <label
                htmlFor="includeOtherHospitals"
                className="text-sm cursor-pointer"
              >
                他院も含める
              </label>
            </div>

            <div className="h-6 w-px bg-border"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">開始日:</span>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const newDate = new Date(startDate);
                  newDate.setDate(startDate.getDate() - period);
                  onStartDateChange(newDate);
                }}
                title={`前の${period}日`}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const newDate = new Date(startDate);
                  newDate.setDate(startDate.getDate() - 1);
                  onStartDateChange(newDate);
                }}
                title="前日"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                    size="sm"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy/MM/dd", { locale: ja }) : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && onStartDateChange(date)}
                    locale={ja}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const newDate = new Date(startDate);
                  newDate.setDate(startDate.getDate() + 1);
                  onStartDateChange(newDate);
                }}
                title="翌日"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const newDate = new Date(startDate);
                  newDate.setDate(startDate.getDate() + period);
                  onStartDateChange(newDate);
                }}
                title={`次の${period}日`}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">表示期間:</span>
              <Tabs value={period.toString()} onValueChange={(value) => onPeriodChange(Number(value) as 14 | 30 | 90)}>
                <TabsList>
                  <TabsTrigger value="14">14日</TabsTrigger>
                  <TabsTrigger value="30">30日</TabsTrigger>
                  <TabsTrigger value="90">90日</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-0">
        <div className="overflow-auto">
          <div style={{ width: `${380 + dates.length * 48}px` }}>
            <div className="sticky top-0 z-10 bg-muted/50 flex">
              <div className="w-[380px] flex-shrink-0 border-r border-b py-2 px-3">
                <div className="text-sm font-medium mb-0.5">
                  薬剤情報
                </div>
                <div className="text-xs text-muted-foreground mb-0.5">
                  薬剤名
                </div>
                <div className="text-xs text-muted-foreground">
                  区分 ｜ 処方元 ｜ 患者区分
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex border-b">
                  {(() => {
                    const yearGroups: { year: number; count: number }[] = [];
                    dates.forEach((date, index) => {
                      const year = date.getFullYear();
                      if (index === 0 || year !== dates[index - 1].getFullYear()) {
                        yearGroups.push({ year, count: 1 });
                      } else {
                        yearGroups[yearGroups.length - 1].count++;
                      }
                    });
                    return yearGroups.map((group, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 py-1 text-center border-r"
                        style={{ width: `${group.count * 48}px` }}
                      >
                        <div className="text-xs text-muted-foreground">
                          {group.year}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                
                <div className="flex border-b">
                  {(() => {
                    const monthGroups: { month: number; count: number }[] = [];
                    dates.forEach((date, index) => {
                      const month = date.getMonth() + 1;
                      if (index === 0 || month !== dates[index - 1].getMonth() + 1) {
                        monthGroups.push({ month, count: 1 });
                      } else {
                        monthGroups[monthGroups.length - 1].count++;
                      }
                    });
                    return monthGroups.map((group, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 py-1 text-center border-r"
                        style={{ width: `${group.count * 48}px` }}
                      >
                        <div className="text-xs text-muted-foreground">
                          {group.month}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                
                <div className="flex border-b">
                  {dates.map((date, index) => (
                    <div key={index} className="w-12 flex-shrink-0 py-1 px-1 text-center border-r">
                      <div className="text-xs text-muted-foreground">
                        {date.getDate()}({["日", "月", "火", "水", "木", "金", "土"][date.getDay()]})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {prescriptionMedications.length > 0 && (
              <>
                {renderMedicationRows(prescriptionMedications)}
              </>
            )}
            
            {injectionMedications.length > 0 && (
              <>
                {renderMedicationRows(injectionMedications)}
              </>
            )}
            
            {(prescriptionMedications.length === 0 && injectionMedications.length === 0) && (
              <div className="p-8 text-center text-muted-foreground">
                表示期間内に薬歴データがありません
              </div>
            )}

            {filteredLabTests.length > 0 ? (
              <>
                <div className="flex border-b">
                  <div className="w-[380px] flex-shrink-0 border-r bg-white">
                    <div className="px-3 py-2.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-sm font-medium">検査項目</h4>
                        <span className="text-xs text-muted-foreground">基準値</span>
                      </div>
                      <div className="space-y-0.5">
                        {allTestNames.map((testName, index) => {
                          const test = filteredLabTests.find(t => t.testName === testName);
                          const { color, symbol } = getStyleForTest(testName);
                          const isSelected = selectedTests.includes(testName);
                          return (
                            <div key={testName} className="flex items-center gap-2 text-sm">
                              <Checkbox
                                id={`test-${testName}`}
                                checked={isSelected}
                                onCheckedChange={() => handleTestToggle(testName)}
                              />
                              <span style={{ color: color }} className="text-lg leading-none">
                                {symbol}
                              </span>
                              <label 
                                htmlFor={`test-${testName}`}
                                className="flex-1 truncate cursor-pointer" 
                                title={testName}
                              >
                                {testName}
                              </label>
                              <span className="text-xs text-muted-foreground">
                                {test?.referenceRange}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="relative bg-white" style={{ width: `${dates.length * 48}px` }}>
                    <div style={{ width: "100%", height: "343px" }}>
                      {renderLabTestChart()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                表示期間内に検査結果がありません
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <MedicationDetail
        medication={selectedMedication}
        allMedications={medications}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
      />
      
      {hoveredTest && (
        <div
          className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${hoveredTest.x}px`,
            top: `${hoveredTest.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="font-medium">{hoveredTest.testName}</div>
          <div className="text-xs mt-1">
            <div>値: {hoveredTest.value} {hoveredTest.unit}</div>
            <div>基準範囲: {hoveredTest.referenceRange}</div>
            <div>日付: {hoveredTest.date}</div>
          </div>
        </div>
      )}
    </Card>
  );
}