export function Input({ className = "", ...props }) {
  return (
    <input
      className={`
        px-3 py-2
        bg-input
        border border-border
        rounded-md
        text-foreground
        placeholder:text-muted-foreground
        focus:outline-none
        focus:ring-2 focus:ring-ring
        w-full
        ${className}
      `}
      {...props}
    />
  );
}
