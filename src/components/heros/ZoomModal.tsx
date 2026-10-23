import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useZoom } from '@hooks/useZoom';
import { useSwipe } from '@hooks/useSwipe';

/**
 * Пропсы полноэкранного модального окна просмотра.
 */
type ZoomModalProps = {
  /** Определяет, отображается ли модальное окно. */
  isOpen: boolean;
  /** Вызывается при закрытии модального окна. */
  onClose: () => void;
  /** Содержимое модального окна. */
  children: ReactNode;
  /** Дополнительные CSS-классы области содержимого. */
  contentClassName?: string;
};

/**
 * Пропсы изображения с поддержкой масштабирования и перетаскивания.
 */
type ZoomableImageProps = {
  /** URL отображаемого изображения. */
  src: string;
  /** Альтернативное описание изображения. */
  alt?: string;
  /** Заголовок над изображением. */
  title?: string;
  /** Показывает ли панель кнопок масштабирования. */
  showZoomControls?: boolean;
  /** Дополнительные CSS-классы контейнера изображения. */
  className?: string;
  /** Дополнительные CSS-классы самого изображения. */
  imgClassName?: string;
  /** Вызывается при горизонтальном свайпе по изображению. */
  onSwipe?: (direction: 'prev' | 'next') => void;
};

/**
 * Отображает содержимое в полноэкранном модальном окне через React portal.
 *
 * @param props - Состояние открытия, содержимое и обработчик закрытия.
 * @returns Модальное окно или null, если оно закрыто.
 */
export function ZoomModal({
  isOpen,
  onClose,
  children,
  contentClassName = '',
}: ZoomModalProps): JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden md:p-4 animate-[fade_250ms_ease] sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-zoom-out bg-black/90 backdrop-blur-sm"
        aria-label="Закрыть окно просмотра"
        onClick={onClose}
      />
      <div className={`relative z-10 max-h-full ${contentClassName}`}>
        <button
          type="button"
          className="absolute z-20 flex items-center justify-center text-3xl leading-none transition-colors border-none cursor-pointer top-2 right-2 md:right-4 perco-icons md:top-4 text-grey-600 hover:text-grey-900"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <i className="perco-icon-close" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

/**
 * Отображает изображение с масштабированием, перетаскиванием и поддержкой свайпов.
 *
 * @param props - Источник и подписи изображения, стили и обработчик свайпа.
 * @returns Контейнер изображения с необязательными элементами управления масштабом.
 */
export function ZoomableImage({
  src,
  alt = '',
  title,
  showZoomControls = false,
  className = '',
  imgClassName = '',
  onSwipe,
}: ZoomableImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const {
    scale,
    position,
    isDragging,
    reset,
    zoomIn,
    zoomOut,
    onImageLoad,
    handleDoubleClick,
    handleTouchEnd,
  } = useZoom({ imgRef, viewportRef });
  const swipeHandlers = useSwipe<HTMLImageElement>({
    onSwipe: (direction) => onSwipe?.(direction),
    enabled: scale <= 1,
  });

  useEffect(() => {
    reset();
  }, [reset, src]);

  return (
    <div
      ref={viewportRef}
      className={`flex sm:block min-h-0 min-w-0 flex-1 flex-col justify-center overflow-hidden touch-pan-y ${className}`}
    >
      {title && (
        <h4 className="max-w-[95%] my-4 text-center sm:my-6 3xl:pt-10 font-manrope-semibold text-md/6 sm:text-lg/normal md:text-2xl xl:text-3xl text-grey-800">
          {title}
        </h4>
      )}
      <img
        ref={imgRef}
        className={`select-none object-contain [will-change:transform] origin-center bg-white ${imgClassName} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        src={src}
        alt={alt}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 250ms cubic-bezier(.2,.8,.2,1)',
        }}
        onLoad={onImageLoad}
        onDoubleClick={handleDoubleClick}
        onTouchStart={swipeHandlers.onTouchStart}
        onTouchEnd={(event) => {
          const didSwipe = swipeHandlers.onTouchEnd(event);
          if (!didSwipe) handleTouchEnd(event);
        }}
        onTouchCancel={swipeHandlers.onTouchCancel}
        draggable={false}
      />
      {showZoomControls && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 text-white backdrop-blur-md">
          <ToolbarButton onClick={zoomOut} label="Уменьшить">−</ToolbarButton>
          <span className="min-w-[56px] text-center tabular-numbs text-sm opacity-90">
            {Math.round(scale * 100)}%
          </span>
          <ToolbarButton onClick={zoomIn} label="Увеличить">+</ToolbarButton>
          <ToolbarButton onClick={reset} label="Сбросить">⟳</ToolbarButton>
        </div>
      )}
    </div>
  );
}

/**
 * Пропсы кнопки панели масштабирования.
 */
type ToolbarButtonProps = {
  /** Содержимое кнопки, например символ или иконка. */
  children: ReactNode;
  /** Вызывается при нажатии кнопки. */
  onClick: () => void;
  /** Доступное название кнопки для вспомогательных технологий. */
  label: string;
};

/**
 * Кнопка панели управления масштабированием.
 *
 * @param props - Содержимое, обработчик нажатия и доступная подпись.
 * @returns Кнопка управления масштабом.
 */
function ToolbarButton({
  children,
  onClick,
  label,
}: ToolbarButtonProps): JSX.Element {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 text-xl text-white transition-colors bg-transparent rounded-full hover:bg-white/20"
    >
      {children}
    </button>
  );
}
