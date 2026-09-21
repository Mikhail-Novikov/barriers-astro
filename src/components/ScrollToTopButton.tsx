
/**
 * Компонент кнопки "Наверх", которая при нажатии плавно прокручивает страницу к началу.
 * @returns JSX.Element - Компонент кнопки "Наверх".
 */
export default function ScrollToTopButton(): JSX.Element {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button type="button" className="btn btn-up" onClick={scrollToTop} aria-label="Прокрутить страницу к началу">
      <span className="text-up-button text-white">Наверх</span>
      <span className="text-5xl">
        <span className="perco-icon-arrow-up size-8 text-grey-700" />
      </span>
    </button>
  );
}
