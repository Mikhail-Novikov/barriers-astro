import SliderArrow from '@components/SliderArrow';

type AboutCarouselControlsProps = {
  start: number;
  end: number;
  onPrevious: () => void;
  onNext: () => void;
  isAtStart: boolean;
  isAtEnd: boolean;
  className?: string;
};

/**
 * Компонент элементов управления галереей изображений с отображением текущего диапазона изображений.
 * 
 * @param {number} props.start - Индекс первого изображения на текущей странице.
 * @param {number} props.end - Индекс последнего изображения на текущей странице.
 * @param {function} props.onPrevious - Функция, вызываемая при нажатии на кнопку "Предыдущая".
 * @param {function} props.onNext - Функция, вызываемая при нажатии на кнопку "Следующая".
 * @param {boolean} props.isAtStart - Флаг, указывающий, находится ли галерея на первой странице.
 * @param {boolean} props.isAtEnd - Флаг, указывающий, находится ли галерея на последней странице.
 * @param {string} [props.className] - Дополнительные классы для контейнера элементов управления.
 * @return {JSX.Element} JSX-элемент элементов управления галереей.
 */
export default function AboutCarouselControls({
  start,
  end,
  onPrevious,
  onNext,
  isAtStart,
  isAtEnd,
  className = 'flex',
}: AboutCarouselControlsProps): JSX.Element {
  return (
    <div className={`mb-8 ${className} items-center justify-between gap-4`}>
      <span className="inline-flex rounded-full border border-grey-500 px-5 py-2 text-lg/7 text-grey-700">
        {String(start).padStart(2, '0')} - {String(end).padStart(2, '0')}
      </span>
      <div className="flex items-center gap-1" aria-label="Управление фотографиями">
        <SliderArrow direction="left" onClick={onPrevious} disabled={isAtStart} />
        <SliderArrow direction="right" onClick={onNext} disabled={isAtEnd} />
      </div>
    </div>
  );
}
