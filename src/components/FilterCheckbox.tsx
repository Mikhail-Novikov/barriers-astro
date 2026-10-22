import type { ReactNode } from 'react';

type FilterCheckboxProps = {
  checked: boolean;
  label: ReactNode;
  onChange: () => void;
  type?: 'checkbox' | 'radio';
  name?: string;
  value?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  required?: boolean;
  className?: string;
  indicatorClassName?: string;
};

/**
 * Компонент FilterCheckbox представляет собой настраиваемый чекбокс или радиокнопку с меткой.
 *
 * @param checked - Определяет, выбран ли чекбокс.
 * @param label - Текст метки, отображаемый рядом с чекбоксом.
 * @param onChange - Функция обратного вызова, вызываемая при изменении состояния чекбокса.
 * @param [type='checkbox'] - Тип элемента ввода (по умолчанию 'checkbox').
 * @param [name] - Имя элемента ввода (необязательно).
 * @param [value] - Значение элемента ввода (необязательно).
 *
 * @returns {JSX.Element} JSX-элемент, представляющий настраиваемый чекбокс или радиокнопку.
 *
 * @example
 * <FilterCheckbox
 *   checked={isChecked}
 *   label="Выберите опцию"
 *   onChange={handleCheckboxChange}
 *   type="checkbox"
 *   name="option"
 *   value="value1"
 * />
 */
export default function FilterCheckbox({
  checked,
  label,
  onChange,
  type = 'checkbox',
  name,
  value,
  disabled = false,
  id,
  invalid = false,
  required = false,
  className = '',
  indicatorClassName = '',
}: FilterCheckboxProps): JSX.Element {
  return (
    <label className={`flex items-center gap-4 perco-icons text-md/6 ${disabled ? 'cursor-not-allowed text-grey-600' : 'cursor-pointer text-grey-1000'} ${className}`}>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        required={required}
        aria-invalid={invalid}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-grey-700 text-white peer-checked:border-cta peer-checked:bg-cta peer-disabled:border-grey-400 peer-disabled:bg-grey-200 peer-disabled:text-grey-600 peer-aria-invalid:border-red-500 peer-focus-visible:ring-2 peer-focus-visible:ring-cta text-md/5 ${indicatorClassName}`}>
        {checked && <span className="relative left-[0.5px] perco-icon-check-tag" />}
      </span>
      {label}
    </label>
  );
}
