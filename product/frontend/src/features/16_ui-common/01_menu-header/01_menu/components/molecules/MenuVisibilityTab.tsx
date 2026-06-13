import { Button } from "@/shared/components/atoms/button";
import { Checkbox } from "@/shared/components/atoms/checkbox";
import type { MenuItem } from "../../types/menu-item.type";
import { i18n } from "@/shared/i18n";

const t = i18n.menu;

type MenuVisibilityTabProps = {
  tempMenuItems: MenuItem[];
  onToggleVisibility: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onMoveChildUp: (parentId: string, childIndex: number) => void;
  onMoveChildDown: (parentId: string, childIndex: number) => void;
};

export function MenuVisibilityTab({
  tempMenuItems,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onMoveChildUp,
  onMoveChildDown,
}: MenuVisibilityTabProps) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
        <p className="text-sm text-blue-700">{t.menuVisibility.hint}</p>
      </div>
      {tempMenuItems.map((item, index) => (
        <div key={item.id} className="space-y-2">
          <div className="flex items-center gap-2 p-3 border rounded-md bg-white">
            <Checkbox
              id={`menu-${item.id}`}
              checked={item.visible}
              onCheckedChange={() => onToggleVisibility(item.id)}
            />
            <item.icon className="h-4 w-4 text-gray-600" />
            <span className="flex-1">{item.title}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onMoveUp(index)} disabled={index === 0} className="h-8 w-8 p-0">↑</Button>
              <Button variant="ghost" size="sm" onClick={() => onMoveDown(index)} disabled={index === tempMenuItems.length - 1} className="h-8 w-8 p-0">↓</Button>
            </div>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="ml-8 space-y-2">
              {item.children.map((child, childIndex) => (
                <div key={child.id} className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                  <Checkbox
                    id={`menu-${child.id}`}
                    checked={child.visible}
                    onCheckedChange={() => onToggleVisibility(child.id)}
                  />
                  <child.icon className="h-4 w-4 text-gray-600" />
                  <span className="flex-1">{child.title}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onMoveChildUp(item.id, childIndex)} disabled={childIndex === 0} className="h-8 w-8 p-0">↑</Button>
                    <Button variant="ghost" size="sm" onClick={() => onMoveChildDown(item.id, childIndex)} disabled={childIndex === item.children!.length - 1} className="h-8 w-8 p-0">↓</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
