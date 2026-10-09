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
  showZoomControls?: boolean;
  className?: string;
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-[zmFade_250ms_ease] sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-zoom-out bg-black/90 backdrop-blur-sm"
        aria-label="Закрыть окно просмотра"
        onClick={onClose}
      />
      <div className={`relative z-10 ${contentClassName}`}>
        <button
          type="button"
          className="perco-icons absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border-none bg-grey-100 text-3xl leading-none text-grey-600 transition-colors hover:text-grey-900 cursor-pointer"
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
  showZoomControls = false,
  className = '',
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
      className={`relative overflow-hidden touch-none ${className}`}
    >
      <img
        ref={imgRef}
        className={`select-none object-contain [will-change:transform] origin-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
      className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-xl text-white transition-colors hover:bg-white/20"
    >
      {children}
    </button>
  );
}
