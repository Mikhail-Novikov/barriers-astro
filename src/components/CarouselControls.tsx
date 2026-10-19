/**
 * Пропсы кнопок управления каруселью.
 */
type CarouselControlsProps = {
  /** Обработчик нажатия кнопки перехода к предыдущему слайду. */
  onPrevious?: () => void;
  /** Обработчик нажатия кнопки перехода к следующему слайду. */
  onNext?: () => void;
  /** Доступное название кнопки перехода к предыдущему слайду. */
  previousLabel?: string;
  /** Доступное название кнопки перехода к следующему слайду. */
  nextLabel?: string;
  /** Отключает кнопку перехода к предыдущему слайду. */
  previousDisabled?: boolean;
  /** Отключает кнопку перехода к следующему слайду. */
  nextDisabled?: boolean;
  /** Имя события для отправки событий `${controlEvent}:previous` и `${controlEvent}:next`. */
  controlEvent?: string;
  /** Дополнительные CSS-классы контейнера кнопок. */
  className?: string;
};

/** Стили кнопок управления каруселью. */
const buttonClassName =
  "flex size-7 items-center justify-center rounded-full bg-grey-300 text-grey-800 text-[10px] transition-colors hover:bg-grey-400";

/**
 * Отображает кнопки перехода между слайдами карусели.
 *
 * @param props - Обработчики, подписи, состояние кнопок и параметры событий.
 * @returns Контейнер с кнопками предыдущего и следующего слайдов.
 */
const CarouselControls = ({
  onPrevious,
  onNext,
  previousLabel = "Предыдущий слайд",
  nextLabel = "Следующий слайд",
  previousDisabled = false,
  nextDisabled = false,
  controlEvent,
  className = "",
}: CarouselControlsProps): JSX.Element => (
  <div className={`perco-icons flex gap-1 ${className}`}>
    <button
      className={buttonClassName}
      type="button"
      onClick={() => {
        onPrevious?.();
        if (controlEvent) window.dispatchEvent(new CustomEvent(`${controlEvent}:previous`));
      }}
      disabled={previousDisabled}
      aria-label={previousLabel}
    >
      <span className="perco-icon-arrow-left-small" aria-hidden="true" />
    </button>
    <button
      className={buttonClassName}
      type="button"
      onClick={() => {
        onNext?.();
        if (controlEvent) window.dispatchEvent(new CustomEvent(`${controlEvent}:next`));
      }}
      disabled={nextDisabled}
      aria-label={nextLabel}
    >
      <span
        className="perco-icon-arrow-left-small rotate-180"
        aria-hidden="true"
      />
    </button>
  </div>
);

export default CarouselControls;
