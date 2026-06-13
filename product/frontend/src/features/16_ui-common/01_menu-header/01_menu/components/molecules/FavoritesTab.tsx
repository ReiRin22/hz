import { Button } from "@/shared/components/atoms/button";
import { Star } from "lucide-react";
import type { MenuItem } from "../../types/menu-item.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type FavoritesTabProps = {
  tempMenuItems: MenuItem[];
  onToggleFavorite: (id: string) => void;
};

export function FavoritesTab({ tempMenuItems, onToggleFavorite }: FavoritesTabProps) {
  return (
    <div className="space-y-3">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
        <p className="text-sm text-yellow-700">{t.favorites.hint}</p>
      </div>
      {tempMenuItems.map((item) => (
        <div key={item.id} className="space-y-2">
          <div className="flex items-center gap-3 p-3 border rounded-md bg-white">
            <item.icon className="h-5 w-5 text-gray-600" />
            <span className="flex-1">{item.title}</span>
            <Button
              variant={item.isFavorite ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleFavorite(item.id)}
              className="gap-1"
            >
              <Star className={`h-4 w-4 ${item.isFavorite ? "fill-current" : ""}`} />
              {item.isFavorite ? t.favorites.unregister : t.favorites.register}
            </Button>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="ml-8 space-y-2">
              {item.children.map((child) => (
                <div key={child.id} className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                  <child.icon className="h-5 w-5 text-gray-600" />
                  <span className="flex-1">{child.title}</span>
                  <Button
                    variant={child.isFavorite ? "default" : "outline"}
                    size="sm"
                    onClick={() => onToggleFavorite(child.id)}
                    className="gap-1"
                  >
                    <Star className={`h-4 w-4 ${child.isFavorite ? "fill-current" : ""}`} />
                    {child.isFavorite ? t.favorites.unregister : t.favorites.register}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
