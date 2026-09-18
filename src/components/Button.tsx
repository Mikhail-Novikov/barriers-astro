export const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`rounded-2xl bg-cta px-8 py-3 text-white transition-colors hover:bg-cta-hover disabled:cursor-not-allowed disabled:bg-cta-disabled cursor-pointer text-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};