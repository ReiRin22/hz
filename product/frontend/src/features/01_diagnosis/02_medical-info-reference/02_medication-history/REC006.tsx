"use client";
import { useState } from "react";
import { MedicationMatrix } from "./src/components/MedicationMatrix";
import { ActionButtons } from "./src/components/ActionButtons";
import { toast } from "sonner";
import { labTestData, medicationData } from "./src/data/sampleData";

export default function REC006Page() {
  const [selectedPeriod, setSelectedPeriod] = useState<14 | 30 | 90>(30);
  const [includeOtherHospitals, setIncludeOtherHospitals] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date("2025-08-21"));

  const handlePDFExport = () => {
    // PDF出力機能の実装
    toast("PDFの出力を開始しました");
  };

  const handlePrint = () => {
    // 印刷機能の実装
    window.print();
    toast("印刷ダイアログを開きました");
  };
  
  return (
    <div className="min-h-screen bg-background p-6 pb-20">
      <div className="mx-auto max-w-full">
        <MedicationMatrix
          medications={medicationData}
          labTests={labTestData}
          period={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          includeOtherHospitals={includeOtherHospitals}
          onIncludeOtherHospitalsChange={setIncludeOtherHospitals}
          startDate={startDate}
          onStartDateChange={setStartDate}
        />
        
        <div className="fixed bottom-6 right-6 z-10">
          <ActionButtons
            onPDFExport={handlePDFExport}
            onPrint={handlePrint}
          />
        </div>
      </div>
    </div>
  );
}