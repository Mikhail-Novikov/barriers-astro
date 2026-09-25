export type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  className = "",
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const variantClassName = variant === 'outline'
    ? 'border border-white bg-transparent text-white hover:bg-white hover:text-grey-1000'
    : 'bg-cta text-white hover:bg-cta-hover disabled:bg-cta-disabled';

  return (
    <button
      className={`rounded-2xl px-8 py-3 transition-colors disabled:cursor-not-allowed cursor-pointer text-lg ${variantClassName} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};