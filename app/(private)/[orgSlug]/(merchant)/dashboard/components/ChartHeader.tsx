"use client"

import {
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/shadcn/card"
import { Button } from "@/components/shadcn/button"
import { Calendar } from "@/components/shadcn/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover"
import { cn } from "@/lib/utils"
import { format, parseISO, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState } from "react"
import { DateRange } from "react-day-picker"
import { getDateRangeText } from "@/lib/formatDate"

const DATE_INTERVAL = process.env.DEFAULT_DATE_INTERVAL || 14

//type for the chart header component props
type DateRangePickerProps = { className?: React.HTMLAttributes<HTMLDivElement>, title: string, chartKey: string }

// Compute the initial date range from URL search params (falls back to the default window).
function getInitialDateRange(searchParams: URLSearchParams, chartKey: string): DateRange {
  const from = searchParams.get(`${chartKey}_from`);
  const to = searchParams.get(`${chartKey}_to`);

  if (from && !to) {
    return { from: new Date(parseISO(from)), to: new Date(parseISO(from)) };
  }

  if (to && !from) {
    const toDate = new Date(parseISO(to));
    return { from: subDays(toDate, Number(DATE_INTERVAL)), to: toDate };
  }

  if (from && to) {
    return { from: new Date(parseISO(from)), to: new Date(parseISO(to)) };
  }

  return { from: subDays(new Date(), Number(DATE_INTERVAL)), to: new Date() };
}

function ChartHeader({ className, chartKey, title }: DateRangePickerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [date, setDate] = useState<DateRange | undefined>(
    () => getInitialDateRange(searchParams, chartKey)
  );
  const [rangeText, setRangeText] = useState<string>(
    () => getDateRangeText(date?.from, date?.to).rangeText
  );

  //set query parameter on date change
  const handleDateChange = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing parameters
    params.delete(`${chartKey}_from`);
    params.delete(`${chartKey}_to`);

    // Set new parameters only if values exist
    if (date?.from) {
      params.set(`${chartKey}_from`, date.from.toISOString());
    }
    if (date?.to) {
      params.set(`${chartKey}_to`, date.to.toISOString());
    }

    // Set the range text
    if (date?.from || date?.to) {
      const { rangeText } = getDateRangeText(date?.from, date?.to);
      setRangeText(rangeText);
    } else {
      setRangeText('')
    }

    // Update URL without adding to browser history
    router.replace(`?${params.toString()}`);
  }

  //Reset the selected date range
  const resetDateChange = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Clear existing parameters
    params.delete(`${chartKey}_from`);
    params.delete(`${chartKey}_to`);

    // set as initial range
    const resetRange = {
      from: subDays(new Date(), Number(DATE_INTERVAL)),
      to: new Date(),
    };
    setDate(resetRange);
    setRangeText(getDateRangeText(resetRange.from, resetRange.to).rangeText);

    // Update URL without adding to browser history
    router.replace(`?${params.toString()}`);
  }

  return (
    <CardHeader className="flex flex-col items-start justify-between gap-2 mb-10 p-4 lg:flex-row">
      <div>
        <CardTitle>{title}</CardTitle>
        {rangeText && <CardDescription>Showing the report for {rangeText}</CardDescription>}
      </div>

      <div className={cn("grid gap-2", className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-auto justify-start text-left font-normal border-muted",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
            <div className="p-3 flex gap-4 justify-between">
              <Button onClick={handleDateChange}>Apply</Button>
              <Button className="bg-red-500" onClick={resetDateChange}>Reset</Button>
            </div>

          </PopoverContent>
        </Popover>

      </div>
    </CardHeader>
  )
}

export default ChartHeader