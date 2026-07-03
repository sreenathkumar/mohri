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
import React, { useEffect, useState } from "react"
import { DateRange } from "react-day-picker"
import { getDateRangeText } from "@/lib/formatDate"

const DATE_INTERVAL = process.env.DEFAULT_DATE_INTERVAL || 14

//type for the chart header component props
type DateRangePickerProps = { className?: React.HTMLAttributes<HTMLDivElement>, title: string, chartKey: string }

function ChartHeader({ className, chartKey, title }: DateRangePickerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rangeText, setRangeText] = useState<string>("last 15 days");


  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), Number(DATE_INTERVAL)),
    to: new Date(),
  });


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
    setDate(
      {
        from: subDays(new Date(), Number(DATE_INTERVAL)),
        to: new Date(),
      }
    )
    // Update URL without adding to browser history
    router.replace(`?${params.toString()}`);
  }


  //update the selected date when the page is visited with query parameters
  useEffect(() => {
    const from = searchParams.get(`${chartKey}_from`);
    const to = searchParams.get(`${chartKey}_to`);

    //if start date exists but end date not exists
    if (from && !to) {
      setDate(() => ({
        from: new Date(parseISO(from)),
        to: new Date(parseISO(from))
      }));
    }

    //if end date exists but start date not exists
    if (to && !from) {
      setDate(() => ({
        from: subDays(to, Number(DATE_INTERVAL)),
        to: new Date(parseISO(to)),
      }));
    }

    //if both start date and end date exists
    if (from && to) {
      setDate(() => ({
        from: new Date(parseISO(from)),
        to: new Date(parseISO(to))
      }));
    }

    //get the range text
    const { rangeText } = getDateRangeText(date?.from, date?.to);
    setRangeText(rangeText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              initialFocus
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