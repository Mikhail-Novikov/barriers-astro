type FilterCheckboxProps = {
  checked: boolean;
  label: string;
  onChange: () => void;
  type?: 'checkbox' | 'radio';
  name?: string;
  value?: string;
  disabled?: boolean;
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
}: FilterCheckboxProps): JSX.Element {
  return (
    <label className={`flex items-center gap-4 perco-icons text-md/6 ${disabled ? 'cursor-not-allowed text-grey-600' : 'cursor-pointer text-grey-1000'}`}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-grey-700 text-white peer-checked:border-cta peer-checked:bg-cta peer-disabled:border-grey-400 peer-disabled:bg-grey-200 peer-disabled:text-grey-600 text-md/5">
        {checked && <span className="relative left-[0.5px] perco-icon-check-tag" />}
      </span>
      {label}
    </label>
  );
}
