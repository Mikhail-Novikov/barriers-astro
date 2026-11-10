import SliderArrow from '@components/SliderArrow';

type AboutCarouselControlsProps = {
  /** Номер первого изображения в отображаемом диапазоне. */
  start: number;
  /** Номер последнего изображения в отображаемом диапазоне. */
  end: number;
  /** Обработчик перехода к предыдущему диапазону изображений. */
  onPrevious: () => void;
  /** Обработчик перехода к следующему диапазону изображений. */
  onNext: () => void;
  /** Указывает, что отображается первый диапазон изображений. */
  isAtStart: boolean;
  /** Указывает, что отображается последний диапазон изображений. */
  isAtEnd: boolean;
  /** Дополнительные CSS-классы контейнера элементов управления. */
  className?: string;
};

/**
 * Компонент элементов управления галереей изображений с отображением текущего диапазона изображений.
 *
 * @param props - Диапазон изображений, обработчики навигации и состояние крайних страниц.
 * @returns Элементы управления галереей с текущим диапазоном изображений.
 */
export default function AboutCarouselControls({
  start,
  end,
  onPrevious,
  onNext,
  isAtStart,
  isAtEnd,
  className = '',
}: AboutCarouselControlsProps): JSX.Element {
  return (
    <div className={`flex mb-8 ${className} items-center justify-between gap-4`}>
      <span className="inline-flex px-5 py-2 border rounded-full border-grey-600 text-lg/7 text-grey-800 font-manrope-semibold">
        {String(start).padStart(2, '0')} - {String(end).padStart(2, '0')}
      </span>
      <div className="flex items-center gap-1" aria-label="Управление фотографиями">
        <SliderArrow direction="left" onClick={onPrevious} />
        <SliderArrow direction="right" onClick={onNext} />
      </div>
    </div>
  );
}
