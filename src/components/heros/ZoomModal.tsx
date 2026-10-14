import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useZoom } from '@hooks/useZoom';

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
}

interface ZoomableImageProps {
  src: string;
  alt?: string;
  title?: string;
  showZoomControls?: boolean;
  className?: string;
  imgClassName?: string;
}

export function ZoomModal({
  isOpen,
  onClose,
  children,
  contentClassName = '',
}: ZoomModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
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
      className="fixed inset-0 z-[9999] flex items-center justify-center md:p-4 animate-[fade_250ms_ease] sm:p-8"
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

export function ZoomableImage({
  src,
  alt = '',
  title,
  showZoomControls = false,
  className = '',
  imgClassName = '',
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

  useEffect(() => {
    reset();
  }, [reset, src]);

  return (
    <div
      ref={viewportRef}
      className={`flex sm:block min-h-0 min-w-0 flex-1 flex-col justify-center touch-pan-y ${className}`}
    >
      {title && (
        <h4 className="max-w-[95%] my-4 text-center sm:my-6 3xl:pt-10 font-manrope-semibold text-md/6 sm:text-lg/normal md:text-2xl xl:text-3xl text-grey-800">
          {title}
        </h4>
      )}
      <img
        ref={imgRef}
        className={`select-none object-contain [will-change:transform] origin-center ${imgClassName} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        src={src}
        alt={alt}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 250ms cubic-bezier(.2,.8,.2,1)',
        }}
        onLoad={onImageLoad}
        onDoubleClick={handleDoubleClick}
        onTouchEnd={handleTouchEnd}
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

function ToolbarButton({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) {
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
