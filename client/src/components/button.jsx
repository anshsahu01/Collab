export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none";

  const variants = {
    default:
      "bg-primary text-primary-foreground hover:opacity-90",
    outline:
      "border border-border bg-transparent text-foreground hover:bg-card",

    ghost:
      "hover:bg-secondary text-muted-foreground hover:text-foreground",
  };

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
