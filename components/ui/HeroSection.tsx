import { ArrowRight } from "lucide-react";
import { Button } from "../shadcn/button";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-50"></div>
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                <div className="mb-6 inline-block">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/10 border border-muted/20 text-muted-foreground text-sm font-medium">
                        Unified Order Management
                    </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                    Manage Orders from{' '}
                    <span className="bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                        Every Store
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    Centralize your Shopify and WooCommerce orders in one powerful platform. Streamline delivery operations and reconcile cash payments effortlessly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-base px-8 py-6">
                        Get Started Free
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary text-base px-8 py-6">
                        Watch Demo
                    </Button>
                </div>


                {/* <div className="border-t border-border pt-8">
                    <p className="text-muted-foreground text-sm mb-4">Trusted by leading e-commerce merchants</p>
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">500+</div>
                            <p className="text-xs text-muted-foreground">Active Merchants</p>
                        </div>
                        <div className="w-px h-8 bg-border"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">1M+</div>
                            <p className="text-xs text-muted-foreground">Orders Managed</p>
                        </div>
                        <div className="w-px h-8 bg-border"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary">99.9%</div>
                            <p className="text-xs text-muted-foreground">Uptime</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </section>
    )
}