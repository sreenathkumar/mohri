//get the start of the day in the local timezone
export function getStartOfLocalDay(date: Date, timezone: string): Date {
    const dateStr = getLocalDateString(date, timezone);

    return new Date(`${dateStr}T00:00:00.000Z`);
}

// format a date to yyyy-mm-dd in the given timezone
export function getLocalDateString(date: Date, timeZone: string): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    return formatter.format(date)
}
