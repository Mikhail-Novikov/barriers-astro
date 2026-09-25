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
    ? 'btn--outline'
    : 'btn--primary';

  return (
    <button
      className={`btn ${variantClassName} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};