interface OrderTypeBadgeProps {
  type: string;
}

export function OrderTypeBadge({ type }: OrderTypeBadgeProps) {
  const getBadgeClass = () => {
    switch (type) {
      case '処方':
        return 'bg-blue-100 text-blue-700';
      case '検体':
        return 'bg-green-100 text-green-700';
      case '注射':
        return 'bg-purple-100 text-purple-700';
      case '画像':
        return 'bg-cyan-100 text-cyan-700';
      case '処置':
        return 'bg-orange-100 text-orange-700';
      case '生理':
        return 'bg-pink-100 text-pink-700';
      case 'リハビリ':
        return 'bg-yellow-100 text-yellow-700';
      case '指導':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ml-2 ${getBadgeClass()}`}>
      {type}
    </span>
  );
}
