import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const WHEEL_STEP = 0.15;
const BUTTON_STEP = 1.5;
const DOUBLE_TAP_SCALE = 2.5;

/**
 * Пропсы для управления масштабированием изображения.
 */
type UseZoomProps = {
  /**
   * Ссылка на изображение, которое нужно масштабировать.
   */
  imgRef: React.RefObject<HTMLImageElement>;

  /**
   * Ссылка на контейнер, в котором отображается изображение.
   */
  viewportRef: React.RefObject<HTMLDivElement>;

  /**
   * Включает или отключает поведение масштабирования.
   * По умолчанию: true.
   */
  enabled?: boolean;
};

/**
 * Описывает позицию изображения на viewport.
 */
type Position = {
  /**
   * Смещение по горизонтали относительно исходной точки.
   */
  x: number;

  /**
   * Смещение по вертикали относительно исходной точки.
   */
  y: number;
};

/**
 * Описывает размеры отображаемого изображения после вычисления fit-подгонки.
 */
type DisplaySize = {
  /**
   * Ширина изображения после fit-подгонки.
   */
  w: number;

  /**
   * Высота изображения после fit-подгонки.
   */
  h: number;
};

/**
 * Возвращаемые методы и состояние хука масштабирования.
 */
type UseZoomResult = {
  /**
   * Текущий коэффициент масштабирования.
   */
  scale: number;

  /**
   * Текущая позиция изображения в пределах viewport.
   */
  position: Position;

  /**
   * Указывает, выполняется ли сейчас перетаскивание изображения.
   */
  isDragging: boolean;

  /**
   * Сбрасывает масштаб и позицию к исходному состоянию.
   */
  reset: () => void;

  /**
   * Увеличивает изображение на один шаг.
   */
  zoomIn: () => void;

  /**
   * Уменьшает изображение на один шаг.
   */
  zoomOut: () => void;

  /**
   * Вычисляет и сохраняет размеры изображения после загрузки.
   */
  onImageLoad: () => void;

  /**
   * Обрабатывает двойной клик по изображению.
   */
  handleDoubleClick: (event: MouseEvent | React.MouseEvent<HTMLImageElement>) => void;

  /**
   * Обрабатывает двойное касание на мобильных устройствах.
   */
  handleTouchEnd: (event: React.TouchEvent<HTMLImageElement>) => void;
};

/**
 * Хук для масштабирования и перетаскивания изображения внутри viewport.
 *
 * @param params - Ссылки на изображение и контейнер, а также флаг активации.
 * @returns Состояние масштаба, позиции, флаг перетаскивания и обработчики событий.
 */
export function useZoom({ imgRef, viewportRef, enabled = true }: UseZoomProps): UseZoomResult {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const scaleRef = useRef(scale);
  const posRef = useRef(position);
  const displaySize = useRef<DisplaySize>({ w: 0, h: 0 });
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const isDraggingRef = useRef(false);
  const lastTap = useRef(0);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { posRef.current = position; }, [position]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  /**
   * Ограничивает позицию изображения границами viewport при текущем масштабе.
   *
   * @param x - Новая координата X.
   * @param y - Новая координата Y.
   * @param currentScale - Текущий масштаб изображения.
   * @returns Скорректированную позицию без выхода за пределы видимой области.
   */
  const clampPosition = useCallback((x: number, y: number, currentScale = scaleRef.current): Position => {
    if (currentScale <= 1) return { x: 0, y: 0 };

    const vw = viewportRef.current?.clientWidth ?? 0;
    const vh = viewportRef.current?.clientHeight ?? 0;
    const scaledW = displaySize.current.w * currentScale;
    const scaledH = displaySize.current.h * currentScale;

    const maxX = Math.max(0, (scaledW - vw) / 2);
    const maxY = Math.max(0, (scaledH - vh) / 2);

    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, [viewportRef]);

  /**
   * Сбрасывает масштаб и позицию к исходному состоянию.
   */
  const reset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  /**
   * Масштабирует изображение относительно точки курсора/касания.
   *
   * @param newScale - Новый масштаб.
   * @param clientX - Координата X точки относительно окна.
   * @param clientY - Координата Y точки относительно окна.
   */
  const zoomAt = useCallback((newScale: number, clientX: number, clientY: number) => {
    newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));

    const img = imgRef.current;
    if (!img || newScale === scaleRef.current) return;

    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const offsetX = clientX - cx;
    const offsetY = clientY - cy;
    const ratio = newScale / scaleRef.current;

    const nextX = posRef.current.x - offsetX * (ratio - 1);
    const nextY = posRef.current.y - offsetY * (ratio - 1);

    setScale(newScale);
    setPosition(clampPosition(nextX, nextY, newScale));
  }, [imgRef, clampPosition]);

  /**
   * Увеличивает изображение на фиксированный шаг.
   */
  const zoomIn = useCallback(() => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(
      scaleRef.current * BUTTON_STEP,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
  }, [imgRef, zoomAt]);

  /**
   * Уменьшает изображение на фиксированный шаг.
   */
  const zoomOut = useCallback(() => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    zoomAt(
      scaleRef.current / BUTTON_STEP,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
  }, [imgRef, zoomAt]);

  /**
   * Вычисляет размеры изображения под viewport после загрузки.
   */
  const onImageLoad = useCallback(() => {
    const img = imgRef.current;
    const viewport = viewportRef.current;
    if (!img || !viewport) return;

    const maxW = viewport.clientWidth * 0.9;
    const maxH = viewport.clientHeight * 0.9;
    const ratio = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);

    displaySize.current = {
      w: img.naturalWidth * ratio,
      h: img.naturalHeight * ratio,
    };
  }, [imgRef, viewportRef]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !enabled) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * WHEEL_STEP;
      zoomAt(scaleRef.current * (1 + delta), e.clientX, e.clientY);
    };

    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => viewport.removeEventListener('wheel', onWheel);
  }, [viewportRef, enabled, zoomAt]);

  useEffect(() => {
    if (!enabled) return;
    const img = imgRef.current;
    if (!img) return;

    const getPoint = (e: MouseEvent | TouchEvent) => (e instanceof TouchEvent ? e.touches[0] : e);

    const onDown = (e: MouseEvent | TouchEvent) => {
      if (scaleRef.current <= 1) return;
      const p = getPoint(e);
      dragStart.current = {
        x: p.clientX,
        y: p.clientY,
        posX: posRef.current.x,
        posY: posRef.current.y,
      };
      setIsDragging(true);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const p = getPoint(e);
      const rawX = dragStart.current.posX + (p.clientX - dragStart.current.x);
      const rawY = dragStart.current.posY + (p.clientY - dragStart.current.y);
      setPosition(clampPosition(rawX, rawY));
    };

    const onUp = () => setIsDragging(false);

    img.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    img.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      img.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      img.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [imgRef, enabled, clampPosition]);

  /**
   * Обрабатывает двойной клик по изображению.
   *
   * @param event - Событие двойного клика.
   */
  const handleDoubleClick = useCallback((event: MouseEvent | React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    if (scaleRef.current > 1) reset();
    else zoomAt(DOUBLE_TAP_SCALE, event.clientX, event.clientY);
  }, [reset, zoomAt]);

  /**
   * Обрабатывает двойное касание на мобильных устройствах.
   *
   * @param event - Событие завершения касания.
   */
  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLImageElement>) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      event.preventDefault();
      const p = event.changedTouches[0];
      if (scaleRef.current > 1) reset();
      else zoomAt(DOUBLE_TAP_SCALE, p.clientX, p.clientY);
    }
    lastTap.current = now;
  }, [reset, zoomAt]);

  return {
    scale,
    position,
    isDragging,
    reset,
    zoomIn,
    zoomOut,
    onImageLoad,
    handleDoubleClick,
    handleTouchEnd,
  };
}