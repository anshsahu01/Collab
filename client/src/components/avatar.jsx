export function Avatar({ children, className = "" }) {
  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full
        bg-secondary
        text-secondary-foreground
        font-medium
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function AvatarFallback({ children }) {
  return <span>{children}</span>;
}
