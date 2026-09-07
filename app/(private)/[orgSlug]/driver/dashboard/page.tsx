import { getDriverTasks } from "@/actions/driverActions";
import TaskCard from "../components/task-card";
import StatusBanner from "../components/StatusBanner";
import TabControl from "../components/tabs-control";
import InProgressTaskCard from "../components/inprogress-task-card";
import { OrderStatus } from "@prisma/client";

interface DriverDashPageProps {
    searchParams: Promise<{ [task: string]: 'active' | 'issues' }>;

}
async function DriverDashPage({ searchParams }: DriverDashPageProps) {
    const tab = (await searchParams).task || 'active';
    const tasks = await getDriverTasks();

    //Separate issues/holds safely
    const issueTasks = tasks.filter(task => task.status === 'FAILED');

    //Find the active moving route, fallback to the first queue item if none are running
    const featuredTask = tasks.find(task => task.status === OrderStatus.OUT_FOR_DELIVERY) ||
        tasks.find(task => task.status === OrderStatus.ASSIGNED);

    //remaining active items
    const activeTasks = tasks.filter(task => {
        const isValidStatus = task.status === OrderStatus.ASSIGNED || task.status === OrderStatus.OUT_FOR_DELIVERY;
        const isCurrentlyFeatured = featuredTask && task.order_id === featuredTask.order_id;

        return isValidStatus && !isCurrentlyFeatured;
    });

    //Calculate the number of deliveries made today
    const deliveredToday = tasks.filter(task => {
        if (task.status !== OrderStatus.DELIVERED || !task.date_delivered) return false;
        const today = new Date();
        const deliveredDate = new Date(task.date_delivered);
        return deliveredDate.toDateString() === today.toDateString();
    }).length;

    // The counter total for your banner (includes the featured item if it exists + the remaining list items)
    const activeCount = activeTasks.length + (featuredTask ? 1 : 0);

    return (
        <div className="flex-1 overflow-y-auto pb-20">
            <StatusBanner remaining={activeCount} deliveredToday={deliveredToday} />

            <TabControl />

            <div className="px-4 py-10 space-y-12">
                {tab === 'active' && (featuredTask || activeTasks.length > 0 ? (
                    <>
                        {featuredTask && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Delivery</h2>
                                </div>

                                <InProgressTaskCard
                                    id={featuredTask.order_id}
                                    customer={featuredTask.name}
                                    location={`${featuredTask.city}, ${featuredTask?.address}`}
                                    amount={featuredTask?.amount}
                                    isOutForDelivery={featuredTask.status === OrderStatus.OUT_FOR_DELIVERY}
                                />
                            </section>
                        )}

                        {activeTasks.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Remaining Route</h2>
                                    <span className="ml-auto text-xs font-semibold text-muted-foreground">2 stops</span>
                                </div>
                                <div className="space-y-2">
                                    {
                                        activeTasks.map((task) => (
                                            <TaskCard
                                                key={task.order_id}
                                                id={task.order_id}
                                                customer={task.name}
                                                amount={task.amount}
                                            />
                                        ))
                                    }
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="py-12 text-center space-y-3">
                        <p className="text-3xl">✅</p>
                        <p className="text-sm font-medium text-foreground">No Active Tasks</p>
                        <p className="text-xs text-muted-foreground">Contact your merchant</p>
                    </div>
                ))}

                {tab === 'issues' && (issueTasks.length > 0 ?
                    <div className="space-y-2">
                        {
                            issueTasks.map((task) => (
                                <TaskCard
                                    key={task.order_id}
                                    id={task.order_id}
                                    customer={task.name}
                                    amount={task.amount}
                                />
                            ))
                        }
                    </div>
                    : (
                        <div className="py-12 text-center space-y-3">
                            <p className="text-3xl">✅</p>
                            <p className="text-sm font-medium text-foreground">No Active Issues</p>
                            <p className="text-xs text-muted-foreground">All deliveries are on track</p>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default DriverDashPage