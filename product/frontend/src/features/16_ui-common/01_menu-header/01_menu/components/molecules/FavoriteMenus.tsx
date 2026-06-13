import { Button } from "@/shared/components/atoms/button";
import { Label } from "@/shared/components/atoms/label";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MenuItem } from "../../types/menu-item.type";
import type { ThemeColor } from "../../types/theme.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type FavoriteMenusProps = {
  favorites: MenuItem[];
  theme: ThemeColor;
};

export function FavoriteMenus({ favorites, theme }: FavoriteMenusProps) {
  const router = useRouter();

  if (favorites.length === 0) return null;

  return (
    <>
      <div className="pt-2">
        <Label className="text-xs flex items-center gap-1 mb-2" style={{ color: theme.value === "black" ? "#9CA3AF" : undefined }}>
          <Star className="h-3 w-3" />
          {t.favorites.label}
        </Label>
        <div className="space-y-1">
          {favorites.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start"
              style={{ backgroundColor: theme.secondary, color: theme.primary }}
              onClick={() => item.url && router.push(item.url)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
              <Star className="ml-auto h-3 w-3 fill-current" />
            </Button>
          ))}
        </div>
      </div>
      <div className="border-t my-2 pt-2" style={{ borderColor: theme.value === "black" ? "#333333" : undefined }} />
    </>
  );
}
