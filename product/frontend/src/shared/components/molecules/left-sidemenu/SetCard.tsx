import { SetData } from '@/shared/types/left-sidemenu/menu.types';

interface SetCardProps {
  set: SetData;
  onClick: () => void;
  badgeVariant?: 'primary' | 'secondary';
}

export function SetCard({ set, onClick, badgeVariant = 'primary' }: SetCardProps) {
  return (
    <div
      className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm mb-1">{set.name}</div>
          <div className="text-xs text-muted-foreground mb-2">
            {set.description}
          </div>
          <div className="flex flex-wrap gap-1">
            {set.items.map((item) => (
              <span
                key={item}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                  badgeVariant === 'primary'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary/50 text-secondary-foreground'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
