type VideoPlayButtonProps = {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  visibility?: 'hover' | 'always' | 'hidden';
};

/**
 * Компонент кнопки воспроизведения видео.
 *
 * @param props - Параметры компонента.
 * @param props.onClick - Обработчик клика по кнопке воспроизведения.
 * @param props.visibility - Видимость иконки при наведении или всегда.
 * @returns= {JSX.Element} Компонент VideoPlayButton.
 */
export default function VideoPlayButton({ onClick, visibility = 'hover' }: VideoPlayButtonProps): JSX.Element | null {
  if (visibility === 'hidden') {
    return null;
  }

  const isAlwaysVisible = visibility === 'always';

  return (
    <span
      className={`perco-icons absolute inset-0 flex items-center justify-center text-[60px] cursor-pointer ${isAlwaysVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      onClick={onClick}
    >
      <i className="perco-icon-play" />
    </span>
  );
}
