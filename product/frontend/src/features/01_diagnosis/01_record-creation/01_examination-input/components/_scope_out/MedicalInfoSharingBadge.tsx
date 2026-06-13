import { Shield, ShieldCheck, ShieldX, Info } from "lucide-react";
import { Badge } from "@/shared/components/atoms/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/atoms/tooltip";

export type MedicalInfoSharingStatus = "full-consent" | "partial-consent" | "no-consent";

interface MedicalInfoSharingData {
  status: MedicalInfoSharingStatus;
  consentDate?: string;
  expiryDate?: string;
  lastUpdated?: string;
  details?: {
    emergencyMedicalInfo?: boolean;
    prescriptionHistory?: boolean;
    diagnosticImages?: boolean;
    labResults?: boolean;
    referralLetters?: boolean;
  };
}

interface MedicalInfoSharingBadgeProps {
  data: MedicalInfoSharingData;
  className?: string;
}

export function MedicalInfoSharingBadge({
  data,
  className = ""
}: MedicalInfoSharingBadgeProps) {
  // ステータス情報の設定
  const getStatusInfo = (status: MedicalInfoSharingStatus) => {
    switch (status) {
      case "full-consent":
        return {
          icon: ShieldCheck,
          label: "すべて同意",
          color: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
          iconColor: "text-green-600 dark:text-green-400",
          description: "医療情報共有サービスのすべての項目に同意済み"
        };
      case "partial-consent":
        return {
          icon: Shield,
          label: "一部同意",
          color: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          description: "医療情報共有サービスの一部項目に同意済み"
        };
      case "no-consent":
        return {
          icon: ShieldX,
          label: "同意しない",
          color: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
          iconColor: "text-red-600 dark:text-red-400",
          description: "医療情報共有サービスに同意していません"
        };
      default:
        return {
          icon: Shield,
          label: "不明",
          color: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
          iconColor: "text-gray-600 dark:text-gray-400",
          description: "同意状況が不明です"
        };
    }
  };

  const statusInfo = getStatusInfo(data.status);
  const StatusIcon = statusInfo.icon;

  // 同意詳細の表示
  const formatConsentDetails = () => {
    if (!data.details) return null;

    const items = [
      { key: 'emergencyMedicalInfo', label: '救急医療情報' },
      { key: 'prescriptionHistory', label: '処方歴' },
      { key: 'diagnosticImages', label: '診断画像' },
      { key: 'labResults', label: '検査結果' },
      { key: 'referralLetters', label: '紹介状' }
    ];

    return items.map(item => ({
      ...item,
      consent: data.details?.[item.key as keyof typeof data.details] || false
    }));
  };

  const consentDetails = formatConsentDetails();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-block">
            <Badge
              variant="outline"
              className={`inline-flex items-center space-x-1.5 px-2 py-0.5 border cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 ${statusInfo.color} ${className}`}
              title={`医療情報共有: ${statusInfo.label} - クリックで設定変更`}
            >
              <StatusIcon className={`w-3 h-3 ${statusInfo.iconColor}`} />
              <span className="text-xs font-medium">
                {statusInfo.label}
              </span>
              {data.status === "partial-consent" && (
                <Info className="w-2.5 h-2.5 opacity-60" />
              )}
            </Badge>
          </div>
        </TooltipTrigger>

        <TooltipContent className="max-w-xs p-0" align="end" sideOffset={8}>
          <div className="p-3 space-y-3">
            {/* ヘッダー */}
            <div className="flex items-center space-x-2">
              <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
              <h4 className="font-semibold text-sm">医療情報共有サービス</h4>
            </div>

            {/* 状態説明 */}
            <p className="text-xs text-muted-foreground">
              {statusInfo.description}
            </p>

            {/* 同意詳細（一部同意の場合） */}
            {data.status === "partial-consent" && consentDetails && (
              <div>
                <h5 className="font-medium text-xs mb-2">同意項目</h5>
                <div className="space-y-1">
                  {consentDetails.map((item) => (
                    <div key={item.key} className="flex items-center space-x-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        item.consent 
                          ? 'bg-green-500' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                      <span className={item.consent ? '' : 'opacity-60'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 日付情報 */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="space-y-1 text-xs text-muted-foreground">
                {data.consentDate && (
                  <div>同意日: {data.consentDate}</div>
                )}
                {data.expiryDate && (
                  <div>有効期限: {data.expiryDate}</div>
                )}
                {data.lastUpdated && (
                  <div>最終更新: {data.lastUpdated}</div>
                )}
              </div>
            </div>

            {/* 注意事項 */}
            {data.status === "no-consent" && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  ※ 緊急時の情報共有が制限される可能性があります
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}