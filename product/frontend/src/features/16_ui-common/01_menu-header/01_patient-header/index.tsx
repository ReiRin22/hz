import { PatientHeaderOrganism } from "./components/organisms/PatientHeaderOrganism";

export default function ETC003Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* [PLACEHOLDER: ETC002] グローバルヘッダー領域（ETC002 担当、高さ48px維持） */}
      <div
        style={{ width: '100%', height: '48px' }}
        className="bg-gray-100 border-b border-dashed border-gray-300"
        aria-hidden="true"
      />
      <div className="min-h-[calc(100vh-48px)]">
        <PatientHeaderOrganism />
      </div>
    </div>
  );
}
