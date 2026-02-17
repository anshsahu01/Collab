import { Link } from "react-router-dom";
import { Button } from "../button";

export default function CtaSection() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary/20 bg-card p-12 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Ready to streamline your team?</h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using Collab to collaborate better and deliver faster.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">Start your free trial</Button>
            </Link>
            <Button size="lg" variant="outline">
              Schedule a demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-8">No credit card required. Start collaborating in minutes.</p>
        </div>
      </div>
    </section>
  );
}
