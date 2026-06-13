interface SystemInfoProps {
  systemName: string;
  facilityName: string;
}

export function SystemInfo({ systemName, facilityName }: SystemInfoProps) {
  return (
    <div className="flex flex-col">
      <h1 className="font-semibold text-sm">{systemName}</h1>
      <p className="text-xs text-muted-foreground">{facilityName}</p>
    </div>
  );
}
