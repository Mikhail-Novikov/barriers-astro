import {
  useRef,
  type MouseEventHandler,
  type TouchEvent,
  type TouchEventHandler,
} from "react";

/** Направление горизонтального свайпа относительно текущего элемента. */
type SwipeDirection = "prev" | "next";

type UseSwipeOptions = {
  /** Вызывается с направлением распознанного свайпа. */
  onSwipe: (direction: SwipeDirection) => void;
  /** Включает или отключает распознавание свайпов. */
  enabled?: boolean;
  /** Минимальное горизонтальное смещение в пикселях для распознавания свайпа. */
  threshold?: number;
  /** Отменяет следующий пользовательский клик после распознанного свайпа. */
  preventClickAfterSwipe?: boolean;
};

type UseSwipeResult<T extends HTMLElement> = {
  /** Обработчик начала касания. */
  onTouchStart: TouchEventHandler<T>;
  /** Обработчик завершения касания; возвращает `true`, если свайп распознан. */
  onTouchEnd: (event: TouchEvent<T>) => boolean;
  /** Обработчик отмены касания, очищающий состояние жеста. */
  onTouchCancel: TouchEventHandler<T>;
  /** Захват клика для предотвращения клика после свайпа, если включена опция. */
  onClickCapture?: MouseEventHandler<T>;
};

/**
 * Распознаёт горизонтальный свайп и вызывает обработчик направления.
 */
export function useSwipe<T extends HTMLElement = HTMLElement>({
  onSwipe,
  enabled = true,
  threshold = 50,
  preventClickAfterSwipe = false,
}: UseSwipeOptions): UseSwipeResult<T> {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  const onTouchStart: TouchEventHandler<T> = (event) => {
    suppressClickRef.current = false;
    const touch = event.touches[0];
    touchStartRef.current = touch
      ? { x: touch.clientX, y: touch.clientY }
      : null;
  };

  const onTouchEnd = (event: TouchEvent<T>): boolean => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;

    if (!enabled || !start || !touch) return false;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) < threshold || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return false;
    }

    suppressClickRef.current = preventClickAfterSwipe;
    onSwipe(deltaX < 0 ? "next" : "prev");
    return true;
  };

  const onTouchCancel: TouchEventHandler<T> = () => {
    touchStartRef.current = null;
    suppressClickRef.current = false;
  };

  const onClickCapture: MouseEventHandler<T> | undefined = preventClickAfterSwipe
    ? (event) => {
        if (!suppressClickRef.current || event.detail === 0) return;

        suppressClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
      }
    : undefined;

  return { onTouchStart, onTouchEnd, onTouchCancel, onClickCapture };
}

export type { SwipeDirection };
