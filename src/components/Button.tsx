export type ButtonVariant = 'primary' | 'outline' | 'primary-outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * Компонент кнопки
 * @param param children - Содержимое кнопки
 * @param param className - Дополнительные классы для стилизации.
 * @param param variant - Вариант кнопки ('primary' | 'outline')
 * @return {JSX.Element} JSX-элемент, представляющий кнопку
 */
export const Button = ({
  children,
  className = "",
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const variantClassName = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary':
        return 'btn--primary';
      case 'outline':
        return 'btn--outline';
      case 'primary-outline':
        return 'btn-primary--outline';
      default:
        return 'btn--primary';
    }
  }

  return (
    <button
      className={`btn ${variantClassName(variant)} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};