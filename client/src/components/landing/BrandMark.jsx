export default function BrandMark({ nameClass = "text-xl", showName = true }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">C</span>
      </div>
      {showName && <span className={`${nameClass} font-bold text-foreground`}>Collab</span>}
    </div>
  );
}
