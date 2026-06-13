import { Button } from "@/shared/components/atoms/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/atoms/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { MenuItem } from "../../types/menu-item.type";
import type { ThemeColor } from "../../types/theme.type";

type MenuItemListProps = {
  items: MenuItem[];
  theme: ThemeColor;
};

export function MenuItemList({ items, theme }: MenuItemListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const textStyle = { color: theme.value === "black" ? "#E5E7EB" : undefined };

  // 現在の患者ID を URL から抽出（例: /karte/12345/... → "12345"）
  const extractPatientId = (): string | null => {
    const match = pathname.match(/\/karte1?\/([^\/]+)/);
    return match ? match[1] : null;
  };

  // URL テンプレート（{patientId}）を実際の患者ID に置換
  const resolveUrl = (url: string | undefined): string | null => {
    if (!url) return null;

    // {patientId} が含まれている場合
    if (url.includes("{patientId}")) {
      const patientId = extractPatientId();

      // 患者ID が存在しない場合は "no-patient" をプレースホルダーとして使用
      // layout.tsx 側で患者ヘッダーを非表示にする
      const resolvedPatientId = patientId || "no-patient";

      return url.replace("{patientId}", resolvedPatientId);
    }

    return url;
  };

  return (
    <>
      {items.filter((item) => item.visible).map((item) => {
        if (item.type === "department") {
          return (
            <Collapsible key={item.id} open={isDepartmentOpen} onOpenChange={setIsDepartmentOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start" style={textStyle}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                  <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${isDepartmentOpen ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-2 mt-2">
                {item.children?.filter((child) => child.visible).map((dept) => {
                  const resolvedUrl = resolveUrl(dept.url);
                  return (
                    <Button
                      key={dept.id}
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                      style={textStyle}
                      onClick={() => resolvedUrl && router.push(resolvedUrl)}
                    >
                      <dept.icon className="mr-2 h-4 w-4" />
                      {dept.title}
                    </Button>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          );
        }
        const resolvedUrl = resolveUrl(item.url);
        return (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-start"
            style={textStyle}
            onClick={() => resolvedUrl && router.push(resolvedUrl)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Button>
        );
      })}
    </>
  );
}
