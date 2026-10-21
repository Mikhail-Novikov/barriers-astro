type PaginationDotsProps = {
  /** Количество отображаемых точек. */
  count: number;
  /** Индекс активной точки, начиная с нуля. */
  activeIndex: number;
  /** Вызывается с индексом выбранной точки. */
  onSelect: (index: number) => void;
  /** Доступное название списка точек. */
  ariaLabel: string;
  /** Возвращает доступное название точки по её индексу. */
  getItemLabel: (index: number) => string;
  /** Дополнительные CSS-классы контейнера точек. */
  className?: string;
};

/**
 * Навигация между страницами или слайдами с помощью точек.
 */
export default function PaginationDots({
  count,
  activeIndex,
  onSelect,
  ariaLabel,
  getItemLabel,
  className = "",
}: PaginationDotsProps): JSX.Element {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-label={getItemLabel(index)}
          aria-selected={activeIndex === index}
          onClick={() => onSelect(index)}
          className={`cursor-pointer rounded-full transition-colors ${
            activeIndex === index
              ? "size-2 bg-grey-700"
              : "size-1 bg-grey-500"
          }`}
        />
      ))}
    </div>
  );
}
