import { MENU_ITEMS } from "./menuItems";

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
      {MENU_ITEMS.map((item) => (
        <li key={item.href} className="transition-transform duration-300 ease-out">
          <a href={item.href} className="text-white font-semibold link--underline" onClick={onItemClick}>
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
