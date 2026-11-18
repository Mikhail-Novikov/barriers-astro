import { useEffect, useRef } from 'react';

/**
 * Удерживает сайдбар фильтров видимым при прокрутке каталога.
 */
const useFilterSidebarPositioning = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const track = trackRef.current;
    if (!sidebar || !track) return;

    const header = document.querySelector<HTMLElement>('#top');
    const desktopQuery = window.matchMedia('(min-width: 1200px)');

    let sidebarHeight = 0;
    let topOffset = 0;
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;
    let lastDirection: 'up' | 'down' | null = null;
    let edgeOffset = 0;
    let lastVisualTop = sidebar.getBoundingClientRect().top;
    /** Текущий режим прилипания: к верху или к низу. */
    let edge: 'top' | 'bottom' = 'top';

    /**
     * Пересчитывает высоту сайдбара и высоту хедера.
     * Вызывается только из ResizeObserver, не на каждом кадре скролла.
     */
    const measure = (): void => {
      sidebarHeight = sidebar.getBoundingClientRect().height;
      topOffset = (header?.getBoundingClientRect().height ?? 0) + 30;
    };

    const getAppliedTransformY = (): number => {
      const transform = window.getComputedStyle(sidebar).transform;
      return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
    };

    const updateTransformTransition = (): void => {
      sidebar.style.transition = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? ''
        : 'transform 16ms linear';
    };

    /**
     * Применяет `top` к сайдбару в зависимости от текущего режима.
     * При edge='top' — top = topOffset.
     * При edge='bottom' — top = viewportHeight - sidebarHeight - paddingBottom,
     * чтобы нижний край сайдбара совпал с низом вьюпорта.
     * Если сайдбар помещается во вьюпорт целиком — всегда edge='top'.
     */
    const applyTop = (): void => {
      if (!desktopQuery.matches) {
        sidebar.style.position = '';
        sidebar.style.top = '';
        sidebar.style.alignSelf = '';
        sidebar.style.transform = '';
        sidebar.style.transition = '';
        edgeOffset = 0;
        return;
      }

      const viewportHeight = window.innerHeight;
      const fitsViewport = sidebarHeight <= viewportHeight - topOffset;

      // Если сайдбар помещается — всегда прилипаем к верху.
      if (fitsViewport) {
        edge = 'top';
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${topOffset}px`;
        sidebar.style.alignSelf = 'start';
        return;
      }

      // Иначе — режим может быть 'top' или 'bottom'.
      // Отрицательный top прижимает нижний край сайдбара к низу вьюпорта.
      const topValue = edge === 'top'
        ? topOffset
        : viewportHeight - sidebarHeight;

      sidebar.style.position = 'sticky';
      sidebar.style.top = `${topValue}px`;
      sidebar.style.alignSelf = 'start';
    };

    /**
     * Обработчик скролла: определяет направление и переключает режим
     * прилипания, а переход между краями синхронизирует с прокруткой через transform.
     */
    const handleScroll = (): void => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        if (scrollY === lastScrollY) return;

        const direction: 'up' | 'down' = scrollY > lastScrollY ? 'down' : 'up';
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;
        let edgeChanged = false;

        // Переключаем край прилипания только при смене направления.
        if (direction !== lastDirection) {
          lastDirection = direction;
          const fitsViewport = sidebarHeight <= window.innerHeight - topOffset;
          const nextEdge = fitsViewport || direction === 'up' ? 'top' : 'bottom';
          if (nextEdge !== edge) {
            const previousTop = sidebar.getBoundingClientRect().top;
            sidebar.style.transition = 'none';
            sidebar.style.transform = '';
            edgeOffset = 0;
            edge = nextEdge;
            applyTop();
            edgeOffset = previousTop - sidebar.getBoundingClientRect().top;
            if (Math.abs(edgeOffset) < 1) {
              edgeOffset = 0;
            } else {
              sidebar.style.transform = `translate3d(0, ${edgeOffset}px, 0)`;
            }
            lastVisualTop = previousTop;
            edgeChanged = true;
            sidebar.getBoundingClientRect();
            updateTransformTransition();
          }
        }

        if (!edgeChanged && edgeOffset !== 0) {
          const baseTop = sidebar.getBoundingClientRect().top - getAppliedTransformY();
          const targetTop = lastVisualTop - scrollDelta;
          let nextOffset = targetTop - baseTop;

          if (direction === 'down' && edge === 'bottom' && edgeOffset > 0) {
            nextOffset = Math.max(0, nextOffset);
          } else if (direction === 'up' && edge === 'top' && edgeOffset < 0) {
            nextOffset = Math.min(0, nextOffset);
          }

          edgeOffset = Math.abs(nextOffset) < 1 ? 0 : nextOffset;
          sidebar.style.transform = edgeOffset === 0
            ? ''
            : `translate3d(0, ${edgeOffset}px, 0)`;
          lastVisualTop = baseTop + edgeOffset;
        }
      });
    };

    /**
     * Обработчик ресайза/изменения высоты — пересчитывает метрики и top.
     */
    const handleResize = (): void => {
      sidebar.style.transition = 'none';
      measure();
      edgeOffset = 0;
      sidebar.style.transform = '';
      applyTop();
      lastScrollY = window.scrollY;
      lastDirection = null;
      lastVisualTop = sidebar.getBoundingClientRect().top;
      if (desktopQuery.matches) {
        sidebar.getBoundingClientRect();
        updateTransformTransition();
      }
    };

    // Инициализация.
    measure();
    applyTop();
    if (desktopQuery.matches) updateTransformTransition();

    const resizeObserver = new ResizeObserver(handleResize);
    if (header) resizeObserver.observe(header);
    resizeObserver.observe(sidebar);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', handleResize);
    } else {
      // @ts-expect-error fallback для старых Safari
      desktopQuery.addListener(handleResize);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (typeof desktopQuery.removeEventListener === 'function') {
        desktopQuery.removeEventListener('change', handleResize);
      } else {
        // @ts-expect-error fallback для старых Safari
        desktopQuery.removeListener(handleResize);
      }
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      sidebar.style.position = '';
      sidebar.style.top = '';
      sidebar.style.alignSelf = '';
      sidebar.style.transform = '';
      sidebar.style.transition = '';
    };
  }, []);

  return { sidebarRef, trackRef };
};

export default useFilterSidebarPositioning;
