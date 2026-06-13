'use client';

interface UnconfirmedAlertBarProps {
  message: string;
}

export function UnconfirmedAlertBar({ message }: UnconfirmedAlertBarProps) {
  return (
    <div
      role="alert"
      className="w-full rounded-xl bg-red-500 px-4 py-8 text-center font-medium text-white"
    >
      {message}
    </div>
  );
}
