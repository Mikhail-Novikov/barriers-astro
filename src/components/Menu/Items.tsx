import { MENU_ITEMS } from "./menuItems";
import type { MouseEvent } from "react";

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
const Items = ({ isMobile, isOpen, onItemClick }: ItemsProps) => {
  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      const target = document.getElementById(href.slice(1));
      const header = document.getElementById("top");
      const offset = 16; // Отступ в пикселях

      if (target) {
        const headerHeight = header?.getBoundingClientRect().height ?? 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    }

    onItemClick?.();
  };

  return (
    <ul className={isMobile ? `lg:hidden fixed z-10 w-full top-15 sm:top-20 left-0 bg-grey-1000 p-8 md:pl-12 flex flex-col gap-4 transition-all duration-300 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"}` : "hidden lg:flex items-center gap-x-8 xl:gap-20"}>
      {MENU_ITEMS.map((item) => (
        <li key={item.href} className="transition-transform duration-300 ease-out">
          <a
            href={item.href}
            className="text-white font-manrope-semibold link--underline"
            onClick={(event) => handleItemClick(event, item.href)}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Items;
