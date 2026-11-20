import type { ReactNode } from 'react';

type FilterRadioBtnProps = {
  checked: boolean;
  label: ReactNode;
  onChange: (checked: boolean) => void;
  name: string;
  value?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  required?: boolean;
  className?: string;
  indicatorClassName?: string;
  hoverColor?: string;
};

/**
 * Компонент FilterRadioBtn представляет радиокнопку с меткой.
 *
 * @param checked - Определяет, выбрана ли опция.
 * @param label - Текст метки, отображаемый рядом с радиокнопкой.
 * @param onChange - Функция обратного вызова при выборе или снятии опции.
 * @param name - Имя группы радиокнопок.
 * @param [value] - Значение элемента ввода.
 *
 * @returns {JSX.Element} JSX-элемент радиокнопки с меткой.
 *
 * @example
 * <FilterRadioBtn
 *   checked={isChecked}
 *   label="Выберите опцию"
 *   onChange={handleChange}
 *   name="option"
 *   value="value1"
 *   hoverColor="group-hover:bg-blue-300"
 * />
 */
export default function FilterRadioBtn({
  checked,
  label,
  onChange,
  name,
  value,
  disabled = false,
  id,
  invalid = false,
  required = false,
  className = '',
  indicatorClassName = '',
  hoverColor = 'group-hover:bg-grey-200',
}: FilterRadioBtnProps): JSX.Element {
  const hoverClassName = !checked && !disabled ? hoverColor : '';

  return (
    <label className={`group flex items-center gap-4 perco-icons text-md/6 ${disabled ? 'text-grey-800 cursor-default' : ' cursor-pointer'} ${className}`}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        required={required}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.currentTarget.checked)}
        onClick={(event) => {
          if (!checked) return;

          event.preventDefault();
          onChange(false);
        }}
        className="sr-only peer"
      />
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${hoverClassName} ${disabled ? 'text-grey-600/40' : checked ? 'text-cta' : 'text-grey-700'} peer-aria-invalid:text-red-500 peer-focus-visible:ring-2 peer-focus-visible:ring-cta text-xl ${indicatorClassName}`}>
        <i className={checked ? 'perco-icon-radio' : 'perco-icon-no-radio'} aria-hidden="true" />
      </span>
      {label}
    </label>
  );
}
