import { EmployeeType } from '@/actions/employeeActions';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';

function DetailedProfile({ employee }: { employee: EmployeeType }) {
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const details = [['Email', employee?.email, Mail], ['Phone', employee?.phone, Phone], ['Location', employee?.address, MapPin], ['Joined', dateFormatter.format(employee?.createdAt), CalendarDays]]
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="font-semibold text-white">Employee information</h2>
      <div className="mt-5 divide-y divide-border">{
        details.map(([label, value, Icon]) => {
          const DetailIcon = Icon as typeof Mail;
          return (
            <div key={label as string} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <span className="inline-flex items-center gap-2 text-sm text-slate-400">
                <DetailIcon className="h-4 w-4 text-cyan-400" />{label as string}
              </span>
              <span className="text-right text-sm font-medium text-card-foreground" suppressHydrationWarning>{value as string}</span>
            </div>)
        })}
      </div>
    </section>
  )
}

export default DetailedProfile