type ItemsProps = {
  isMobile?: boolean;
  isOpen?: boolean;
  onItemClick?: () => void;
};

/**
 * Компонент списка пунктов меню
 * @param isMobile - признак мобильного меню
 * @param isOpen - признак открытости меню
 * @param onItemClick - коллбек при клике на пункт меню
 */
export default function Items({ isMobile, isOpen, onItemClick }: ItemsProps) {
  return (
    <ul className={isMobile ? `fixed z-10 w-full top-20 left-0 bg-grey-1000 p-8 md:pl-12 flex flex-col gap-4 transition-all duration-300 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"}` : "flex items-center gap-20"}>
      <li className="transition-transform duration-300 ease-out" style={{ transitionDelay: "0ms" }}>
        <a href="#catalog" className="text-white font-semibold link--underline" onClick={onItemClick}>Каталог</a>
      </li>
      <li className="transition-transform duration-300 ease-out" style={{ transitionDelay: "50ms" }}>
        <a href="#complectation" className="text-white font-semibold link--underline" onClick={onItemClick}>Комплектация</a>
      </li>
      <li className="transition-transform duration-300 ease-out" style={{ transitionDelay: "100ms" }}>
        <a href="#execution" className="text-white font-semibold link--underline" onClick={onItemClick}>Исполнение</a>
      </li>
      <li className="transition-transform duration-300 ease-out" style={{ transitionDelay: "150ms" }}>
        <a href="#management" className="text-white font-semibold link--underline" onClick={onItemClick}>Способы управления</a>
      </li>
    </ul>
  );
}
