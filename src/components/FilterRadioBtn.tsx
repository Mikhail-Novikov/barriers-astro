import type { ReactNode } from 'react';

import { HtmlContent } from '@utils/HtmlContent';

type FilterRadioBtnProps = {
  checked: boolean;
  label: ReactNode;
  onChange: (checked: boolean) => void;
  name: string;
  value: string;
  disabled?: boolean;
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
  hoverColor = 'group-hover:bg-grey-200',
}: FilterRadioBtnProps): JSX.Element {
  const hoverClassName = !checked && !disabled ? hoverColor : '';

  return (
    <label className={`group flex items-center gap-4 perco-icons text-md/6 select-none ${disabled ? 'text-grey-700 cursor-default' : ' cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
        onClick={(event) => {
          if (!checked) return;

          event.preventDefault();
          onChange(false);
        }}
        className="sr-only peer"
      />
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors ${hoverClassName} ${disabled ? 'text-grey-400' : checked ? 'text-cta' : 'text-grey-600'} peer-focus-visible:ring-2 peer-focus-visible:ring-cta text-xl`}>
        <i className={checked ? 'perco-icon-radio' : 'perco-icon-no-radio'} aria-hidden="true" />
      </span>
      <HtmlContent>{label}</HtmlContent>
    </label>
  );
}
