type SliderArrowProps = {
  direction: "left" | "right";
  onClick: () => void;
  disabled?: boolean;
  theme?: string;
  icon?: string;
}

/**
 * Компонент стрелки слайдера
 * @param direction - направление стрелки
 * @param onClick - коллбек при клике
 * @param theme - кастомная тема стрелки
 * @param icon - иконка стрелки
 * @return {JSX.Element}
 */
const SliderArrow = ({ direction, onClick, disabled = false, theme = "", icon = "icon-arrow-left-big" }: SliderArrowProps): JSX.Element => {
  const themeClass = theme ? `${theme}` : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`perco-icons text-white text-sm ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
      aria-label={direction === "left" ? "Предыдущий слайд" : "Следующий слайд"}
    >
      <span className={`flex items-center justify-center size-13 rounded-full bg-grey-800 transition-background duration-100 ${disabled ? "" : "hover:bg-grey-500"} ${themeClass}`}>
        {direction === "left" ? <i className={`perco-${icon}`} /> : <i className={`perco-${icon} rotate-180`} />}
      </span>
    </button>
  );
};

export default SliderArrow;