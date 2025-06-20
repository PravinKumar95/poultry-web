import * as React from "react";
import { Calendar } from "../calendar";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import { formatDateDDMMYYYY } from "@/utils/date";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label?: string;
}

function getMonthOptions(year: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date(year, i, 1);
    return {
      value: i,
      label: date.toLocaleString("default", { month: "long" }),
    };
  });
}

export function DateRangeFilter({
  value,
  onChange,
  label,
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [monthYear, setMonthYear] = React.useState<{
    month: number;
    year: number;
  }>(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const handleMonthSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split("-").map(Number);
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0); // last day of month
    onChange({ from, to });
    setMonthYear({ month, year });
    setOpen(false);
  };

  // Generate options for the last 5 years including current
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const monthOptions = getMonthOptions(monthYear.year);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          {label ?? "Filter by date"}
          {value.from && value.to
            ? `: ${formatDateDDMMYYYY(value.from)} - ${formatDateDDMMYYYY(
                value.to
              )}`
            : ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex items-center gap-2 px-3 pt-3 pb-1">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={`${monthYear.year}-${monthYear.month}`}
            onChange={handleMonthSelect}
          >
            {yearOptions.map((year) =>
              monthOptions.map((month) => (
                <option
                  key={`${year}-${month.value}`}
                  value={`${year}-${month.value}`}
                >
                  {month.label} {year}
                </option>
              ))
            )}
          </select>
          <span className="text-xs text-muted-foreground">(Select month)</span>
          <Button
            variant="outline"
            size="sm"
            className="ml-2"
            onClick={() => {
              onChange({});
              setOpen(false);
            }}
          >
            Clear
          </Button>
        </div>
        <Calendar
          mode="range"
          selected={value as DayPickerDateRange}
          onSelect={(range) => {
            if (range) onChange(range);
            setOpen(false);
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
