"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";
import { Button } from "./button";

interface DatePickerCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  onClear?: () => void;
  initialFocus?: boolean;
}

export function DatePickerCalendar({
  selected,
  onSelect,
  onClear,
  initialFocus,
}: DatePickerCalendarProps) {
  const formatYearMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const eraYear = year - 2018;
    return `${year}年(令和${eraYear}年) ${month}月`;
  };

  const handleTodayClick = () => {
    onSelect?.(new Date());
  };

  const handleClearClick = () => {
    onClear?.();
    onSelect?.(undefined);
  };

  return (
    <div className="p-3">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        showOutsideDays={true}
        autoFocus={initialFocus}
        className={cn("p-0")}
        classNames={{
          months: "flex flex-col gap-4",
          month: "flex flex-col gap-4",
          month_caption: "flex justify-center pt-1 relative items-center mb-2",
          caption_label: "text-sm font-medium",
          nav: "flex items-center gap-1",
          button_previous: cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
          ),
          button_next: cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
          ),
          month_grid: "w-full border-collapse",
          weekdays: "flex",
          weekday: "rounded-md w-9 font-normal text-[0.8rem] text-center",
          week: "flex w-full mt-1",
          day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          day_button: cn(
            buttonVariants({ variant: "ghost" }),
            "size-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent"
          ),
          selected:
            "bg-slate-700 text-white hover:bg-slate-700 hover:text-white focus:bg-slate-700 focus:text-white",
          today: "bg-accent text-accent-foreground font-semibold",
          outside: "text-muted-foreground opacity-50",
          disabled: "text-muted-foreground opacity-50",
          hidden: "invisible",
        }}
        formatters={{
          formatCaption: formatYearMonth,
          formatWeekdayName: (date) => {
            const days = ["日", "月", "火", "水", "木", "金", "土"];
            return days[date.getDay()];
          },
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            ),
        }}
        modifiers={{
          sunday: (date) => date.getDay() === 0,
          saturday: (date) => date.getDay() === 6,
        }}
        modifiersClassNames={{
          sunday: "text-red-500",
          saturday: "text-blue-500",
        }}
      />
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearClick}
          className="text-blue-500 hover:text-blue-600 h-8 px-3"
        >
          クリア
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTodayClick}
          className="text-blue-500 hover:text-blue-600 h-8 px-3"
        >
          今日
        </Button>
      </div>
    </div>
  );
}
