type SliderArrowProps = {
  direction: "left" | "right";
  onClick: () => void;
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
const SliderArrow = ({ direction, onClick, theme = "", icon = "icon-arrow-left-big" }: SliderArrowProps): JSX.Element => {
  const themeClass = theme ? `${theme}` : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-white text-sm cursor-pointer"
      aria-label={direction === "left" ? "Предыдущий слайд" : "Следующий слайд"}
    >
      <span className={`flex items-center justify-center size-13 rounded-full bg-grey-800 hover:bg-grey-500 transition-background duration-100 ${themeClass}`}>
        {direction === "left" ? <i className={`${icon}`} /> : <i className={`${icon} rotate-180`} />}
      </span>
    </button>
  );
};

export default SliderArrow;