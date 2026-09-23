/**
 * Компонент иконки бургера
 * @param isOpen - признак открытости меню
 * @return {JSX.Element}
 */
type BurgerIconProps = {
  isOpen?: boolean;
  onClick?: () => void;
};

/**
 * Компонент иконки бургера
 * @param isOpen - признак открытости меню
 * @param onClick - коллбек при клике на иконку
 * @return {JSX.Element}
 */
const BurgerIcon = ({ isOpen, onClick }: BurgerIconProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="lg:hidden absolute top-1/2 -translate-y-1/2 right-0 text-white hover:text-grey-700 text-4xl cursor-pointer transition-all duration-300 ease-out"
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
      aria-expanded={isOpen}
    >
      <span className={`perco-icons block transition-transform duration-300 ease-out ${isOpen ? "rotate-90" : "rotate-0"}`}>
        {isOpen ? <i className="perco-icon-close" /> : <i className="perco-icon-burger" />}
      </span>
    </button>
  );
};

export default BurgerIcon;