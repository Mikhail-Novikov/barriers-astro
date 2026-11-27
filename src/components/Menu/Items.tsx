import { MENU_ITEMS } from "./menuItems";
import type { MouseEvent } from "react";

type ItemsProps = {
  isMobile?: boolean;
  isOpen?: boolean;
  onItemClick?: () => void;
  onConsultationClick?: () => void;
};

/**
 * Компонент списка пунктов меню
 * @param isMobile - признак мобильного меню
 * @param isOpen - признак открытости меню
 * @param onItemClick - коллбек при клике на пункт меню
 */
const Items = ({ isMobile, isOpen, onItemClick, onConsultationClick }: ItemsProps) => {
  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      event.preventDefault();
      const target = document.getElementById(href.slice(1));
      const header = document.getElementById("top");
      const offset = 0; // Отступ в пикселях

      if (target) {
        const headerHeight = header?.getBoundingClientRect().height ?? 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    }

    onItemClick?.();
  };

  const menuItems = MENU_ITEMS.map((item) => {
    if (!isMobile && item.isMobileOnly) {
      return null;
    }

    return (
      <li key={item.href} className={isMobile ? "border-b border-grey-400 last:border-b-0 transition-transform duration-300 ease-out" : "transition-transform duration-300 ease-out"}>
        {item.isMobileOnly ? (
          <button
            type="button"
            className="block w-full py-3.5 text-left cursor-pointer text-md/6 text-grey-1000 font-manrope-semibold"
            onClick={() => {
              onConsultationClick?.();
              onItemClick?.();
            }}
          >
            {item.label}
          </button>
        ) : (
          <a
            href={item.href}
            className={isMobile ? "block py-3.5 text-md/6 text-grey-1000 font-manrope-semibold" : "text-white font-manrope-semibold link--underline"}
            onClick={(event) => handleItemClick(event, item.href)}
          >
            {item.label}
          </a>
        )}
      </li>
    );
  });

  if (isMobile) {
    return (
      <div className={`lg:hidden fixed z-10 w-full top-[64px] sm:top-[90px] left-0 bg-white shadow-[0_2px_2px_0_rgba(0,0,0,0.06),0_0_2px_0_rgba(0,0,0,0.03)] transition-all duration-300 ease-out ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"}`}>
        <ul className="container flex flex-col py-2">
          {menuItems}
        </ul>
      </div>
    );
  }

  return <ul className="hidden lg:flex items-center gap-x-8 xl:gap-20">{menuItems}</ul>;
};

export default Items;
