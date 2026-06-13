"use client";

import { RecordInputOrganism } from "@/features/01_diagnosis/01_record-creation/01_examination-input/components/organisms/RecordInputOrganism";

const DEMO_PATIENT_ID = "P001";

export function SoapInputPanelClient() {
  return (
    <div className="flex flex-col h-full border-r border-slate-200 bg-white flex-1 min-w-0">
      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <RecordInputOrganism
          patientId={DEMO_PATIENT_ID}
          receptionId=""
          loginUserName=""
          recorderId=""
        />
      </div>
    </div>
  );
}
