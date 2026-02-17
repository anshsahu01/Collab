export default function SectionHeader({ title, description }) {
  return (
    <div className="text-center mb-16 sm:mb-20">
      <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{title}</h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </div>
  );
}
