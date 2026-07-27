/**
 * Компонент иконки бургера
 * @param isOpen - признак открытости меню
 * @return {JSX.Element}
 */
type BurgerIconProps = {
  isOpen?: boolean;
  onClick?: () => void;
};

export default function BurgerIcon({ isOpen, onClick }: BurgerIconProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 right-0 text-white hover:text-grey-700 text-5xl cursor-pointer transition-all duration-300 ease-out"
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
    >
      <span className={`block transition-transform duration-300 ease-out ${isOpen ? "rotate-90" : "rotate-0"}`}>
        {isOpen ? <i className="icon-close" /> : <i className="icon-burger" />}
      </span>
    </button>
  );
}