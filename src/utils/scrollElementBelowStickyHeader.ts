/**
 * Утилита для плавного скролла элемента в область видимости, учитывая высоту фиксированного заголовка.
 * @param element - Элемент, который нужно прокрутить в область видимости.
 * @param offset - Дополнительный отступ от заголовка (по умолчанию 16 пикселей).
 */
const scrollElementBelowStickyHeader = (element: HTMLElement | null, offset = 16): void => {
  if (!element) return;

  const elementTop = element.getBoundingClientRect().top;
  const stickyHeaderHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
  if (elementTop >= stickyHeaderHeight) return;

  window.scrollTo({
    top: Math.max(0, window.scrollY + elementTop - stickyHeaderHeight - offset),
    behavior: 'smooth',
  });
};

export default scrollElementBelowStickyHeader;
