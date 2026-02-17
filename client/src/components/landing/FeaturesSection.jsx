import SectionHeader from "./SectionHeader";
import { FEATURE_ITEMS } from "./constants";

function FeatureCard({ feature }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Powerful features for modern teams"
          description="Everything you need to organize, collaborate, and deliver better work together."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURE_ITEMS.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
