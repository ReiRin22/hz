import { OrderConfirmedClient } from "../order-confirmed-client";
import { SoapInputPanelClient } from "../soap-input-panel-client";
import { RecordReferencePanelsClient } from "../record-reference-panels-client";

// TODO: 認証セッションから取得する
const CONFIRMED_BY = "田中 医師";
const PATIENT_NAME = "患者名";

/** オーダー確定画面（Server Component） */
export default async function OrderConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ scheduledDate?: string; scheduledTime?: string; updatedOrderId?: string; openImaging?: string; openSpecimen?: string }>;
}) {
  const { patientId } = await params;
  const { scheduledDate, scheduledTime, updatedOrderId, openImaging, openSpecimen } = await searchParams;

  return (
    <div className="flex h-full overflow-hidden">
      <RecordReferencePanelsClient />
      <SoapInputPanelClient />
      <div className="relative overflow-hidden p-1 flex-1 min-w-0">
        <OrderConfirmedClient
          patientId={patientId}
          patientName={PATIENT_NAME}
          confirmedBy={CONFIRMED_BY}
          isSubstituteUser={false}
          scheduledDate={scheduledDate}
          scheduledTime={scheduledTime}
          updatedOrderId={updatedOrderId}
          openImaging={openImaging}
          openSpecimen={openSpecimen}
        />
      </div>
    </div>
  );
}
