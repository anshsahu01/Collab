export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`
        bg-card
        text-card-foreground
        border border-border
        rounded-lg
        hover:border-primary/40
        transition-colors
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
