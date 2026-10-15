
/**
 * Компонент кнопки "Наверх", которая при нажатии плавно прокручивает страницу к началу.
 * @returns JSX.Element - Компонент кнопки "Наверх".
 */
export default function ScrollToTopButton(): JSX.Element {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" className="btn-up group" onClick={scrollToTop} aria-label="Прокрутить страницу к началу">
      <span className="text-up-button text-white hidden sm:block">Наверх</span>
      <span className="text-4xl sm:text-5xl flex text-grey-700 group-hover:text-white transition-all">
        <span className="perco-icon-arrow-up" />
      </span>
    </button>
  );
}
