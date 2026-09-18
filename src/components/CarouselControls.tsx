type CarouselControlsProps = {
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  controlEvent?: string;
  className?: string;
};

const buttonClassName =
  "flex size-7 items-center justify-center rounded-full bg-grey-300 text-grey-800 text-[10px] transition-colors hover:bg-grey-400 disabled:cursor-not-allowed disabled:opacity-40";

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
