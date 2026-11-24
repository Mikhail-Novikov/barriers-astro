import { useEffect, useState } from "react";

/**
 * Компонент кнопки "Наверх", которая при нажатии плавно прокручивает страницу к началу.
 * @returns JSX.Element - Компонент кнопки "Наверх".
*/
export default function FloatingScrollToTopButton(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const start = document.querySelector("[data-scroll-to-top-trigger]");
    const end = document.querySelector("[data-scroll-to-top-end]");
    const updateVisibility = () => {
      setIsVisible(
        start !== null &&
          end !== null &&
          start.getBoundingClientRect().top <= window.innerHeight &&
          end.getBoundingClientRect().top > window.innerHeight,
      );
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`perco-icons border-0 size-11 2xl:size-15 rounded-full flex place-items-center justify-center bg-grey-200 hover:bg-white px-0 group fixed bottom-4 right-5 z-9 2xl:bottom-8 2xl:right-8 cursor-pointer shadow-[0_2px_5px_0_rgba(134,135,140,0.3)] transition-all ${isVisible ? "opacity-100" : "invisible opacity-0 pointer-events-none"}`}
      onClick={scrollToTop}
      aria-label="Прокрутить страницу к началу"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <span className="text-[22px] 2xl:text-[30px] flex text-cta">
        <span className="perco-icon-link-arrow rotate-180" />
      </span>
    </button>
  );
}
