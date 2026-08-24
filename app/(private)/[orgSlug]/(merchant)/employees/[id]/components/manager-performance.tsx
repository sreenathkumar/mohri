import { getManagerPerformanceMetrics } from '@/actions/analyticsActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';

async function ManagerPerformance({ userId }: { userId: string }) {
    const performanceMetrics = await getManagerPerformanceMetrics({ userId });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    <div className="flex justify-between items-center rounded-xl border border-border p-4">
                        <div className='space-y-2'>
                            <h3>Cash Reconciled</h3>
                            <p className='text-muted-foreground text-sm'>Total collected cash from COD orders</p>
                        </div>
                        <span className='font-bold text-xl'>${performanceMetrics.cashReconciled}</span>
                    </div>
                    <div className="flex justify-between items-center rounded-xl border border-border p-4">
                        <div className='space-y-2'>
                            <h3>Fulfilled Orders</h3>
                            <p className='text-muted-foreground text-sm'>Total number of orders fulfilled by him</p>
                        </div>
                        <span className='font-bold text-xl'>{performanceMetrics.orderHandled}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ManagerPerformance