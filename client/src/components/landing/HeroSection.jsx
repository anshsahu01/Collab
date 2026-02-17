import { Link } from "react-router-dom";
import { Button } from "../button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight mb-6">
            Work together, <span className="text-primary">in real-time</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Collaborate seamlessly with your team. Manage tasks, assign work, and track progress-all in one
            powerful platform designed for modern teams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Start for free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">No credit card required. 14-day free trial.</p>
        </div>
      </div>
    </section>
  );
}
