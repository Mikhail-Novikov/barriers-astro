import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Описывает один элемент изображения внутри модального окна увеличения.
 */
type ZoomModalImage = {
  /**
   * URL большого изображения.
   */
  src: string;

  /**
   * URL миниатюры изображения.
   */
  thumb: string;
};

/**
 * Содержит данные активного изображения, переданного в модальное окно.
 */
type ZoomModalEntry<T> = {
  /**
   * URL текущего большого изображения.
   */
  src: string;

  /**
   * Сущность барьера, связанная с галереей.
   */
  barrier: T;

  /**
   * Все доступные изображения для выбранной модели.
   */
  images: ZoomModalImage[];
};

/**
 * Состояние навигации по миниатюрам галереи.
 */
type ThumbnailNavigation = {
  /**
   * Есть ли у контейнера горизонтальный overflow.
   */
  hasOverflow: boolean;

  /**
   * Можно ли прокрутить миниатюры влево.
   */
  canScrollLeft: boolean;

  /**
   * Можно ли прокрутить миниатюры вправо.
   */
  canScrollRight: boolean;
};

/**
 * Начальное состояние навигации по миниатюрам.
 */
const INITIAL_THUMBNAIL_NAVIGATION: ThumbnailNavigation = {
  hasOverflow: false,
  canScrollLeft: false,
  canScrollRight: false,
};

/**
 * Возвращаемый результат хука управления модальным окном увеличения изображения.
 */
type UseZoomModalResult<TBarrier> = {
  /**
   * Активное изображение, открытое в модальном окне.
   */
  activeImage: ZoomModalEntry<TBarrier> | null;

  /**
   * Открыт ли модальный слой.
   */
  isOpen: boolean;

  /**
   * Открывает модальное окно с выбранным изображением.
   */
  open: (src: string, barrier: TBarrier, images: ZoomModalImage[]) => void;

  /**
   * Выбирает изображение в текущем открытом модальном окне.
   */
  selectImage: (src: string) => void;

  /**
   * Закрывает модальное окно.
   */
  close: () => void;

  /**
   * Ссылка на контейнер миниатюр.
   */
  thumbnailsRef: React.RefObject<HTMLDivElement>;

  /**
   * Состояние навигации по миниатюрам.
   */
  thumbnailNavigation: ThumbnailNavigation;

  /**
   * Пересчитывает состояние прокрутки миниатюр.
   */
  updateThumbnailNavigation: () => void;

  /**
   * Прокручивает миниатюры в заданном направлении.
   */
  scrollThumbnails: (direction: -1 | 1) => void;
};

/**
 * Хук для управления полноэкранным модальным окном увеличения изображения.
 *
 * @template TBarrier - Тип объекта барьера, связанного с изображениями.
 * @returns Управление состоянием активного изображения и навигацией по миниатюрам.
 */
export function useZoomModal<TBarrier>(): UseZoomModalResult<TBarrier> {
  const [activeImage, setActiveImage] = useState<ZoomModalEntry<TBarrier> | null>(null);
  const [thumbnailNavigation, setThumbnailNavigation] = useState(INITIAL_THUMBNAIL_NAVIGATION);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isOpen = activeImage !== null;

  /**
   * Открывает модальное окно с выбранным изображением и набором галереи.
   *
   * @param src - URL главного изображения.
   * @param barrier - Объект барьера, связанный с изображениями.
   * @param images - Нарезка изображений галереи для модального окна.
   */
  const open = useCallback((
    src: string,
    barrier: TBarrier,
    images: ZoomModalImage[],
  ) => {
    setActiveImage({ src, barrier, images });
  }, []);

  /**
   * Выбирает изображение в уже открытой галерее.
   *
   * @param src - URL изображения, которое нужно сделать активным.
   */
  const selectImage = useCallback((src: string) => {
    setActiveImage((current) => current ? { ...current, src } : current);
  }, []);

  /**
   * Закрывает модальное окно увеличения.
   */
  const close = useCallback(() => setActiveImage(null), []);

  /**
   * Пересчитывает доступность прокрутки миниатюр.
   */
  const updateThumbnailNavigation = useCallback(() => {
    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return;

    const hasOverflow = thumbnails.scrollWidth > thumbnails.clientWidth + 1;
    setThumbnailNavigation({
      hasOverflow,
      canScrollLeft: hasOverflow && thumbnails.scrollLeft > 1,
      canScrollRight: hasOverflow
        && thumbnails.scrollLeft + thumbnails.clientWidth < thumbnails.scrollWidth - 1,
    });
  }, []);

  /**
   * Прокручивает миниатюры влево или вправо.
   *
   * @param direction - Направление прокрутки: -1 влево, 1 вправо.
   */
  const scrollThumbnails = useCallback((direction: -1 | 1) => {
    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return;
    thumbnails.scrollBy({
      left: direction * thumbnails.clientWidth * 0.75,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setThumbnailNavigation(INITIAL_THUMBNAIL_NAVIGATION);
      return undefined;
    }

    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return undefined;

    updateThumbnailNavigation();
    const resizeObserver = new ResizeObserver(updateThumbnailNavigation);
    resizeObserver.observe(thumbnails);
    window.addEventListener('resize', updateThumbnailNavigation);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateThumbnailNavigation);
    };
  }, [isOpen, activeImage?.images.length, updateThumbnailNavigation]);

  return {
    activeImage,
    isOpen,
    open,
    selectImage,
    close,
    thumbnailsRef,
    thumbnailNavigation,
    updateThumbnailNavigation,
    scrollThumbnails,
  };
}
