import { useEffect, useRef, useState } from 'react';
import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

/** Интерфейс для описания элемента галереи.*/
interface GalleryItem {
  /** Источник изображения или объект с источником изображения. */
  src?: string | { src: string };
  /** Путь к уменьшенной версии изображения, используемой в качестве превью. */
  thumb?: string;
  /** Альтернативный текст для изображения.*/
  alt?: string;
  /** HTML-код, отображаемый под изображением (например, подпись).*/
  subHtml?: string;
  /** Дополнительные пользовательские свойства. */
  [key: string]: any;
}

interface SlideWrapperOptions {
  /** Тег обёртки, по умолчанию 'div' */
  tag?: string;
  /** Классы, которые будут добавлены обёртке */
  className?: string;
  /** Дополнительные атрибуты */
  attributes?: Record<string, string>;
}

interface UseLightGalleryOptions {
  items: GalleryItem[];
  selector?: string;
  containerSelector?: string;
  download?: boolean;
  counter?: boolean;
  closeOnTap?: boolean;
  controls?: boolean;
  showToolbar?: boolean;
  showFullscreen?: boolean;
  navigation?: boolean;
  hasArrows?: boolean;
  showCloseIcon?: boolean;
  mainClass?: string;
  captionClassName?: string;
  onClose?: () => void;
  videoAutoplay?: boolean;
  /** Отключает увеличение/уменьшение изображения (Panzoom) */
  disableZoom?: boolean;
  /**
   * Размещение подписи:
   * - `'default'` — стандартный блок Fancybox (`.fancybox__caption`)
   * - `'wrapper'` — внутрь slideWrapper под изображением
   * - `'none'` — не показывать подпись вообще
   */
  captionPlacement?: 'default' | 'wrapper' | 'none';
  /**
   * Обёртка вокруг контента слайда (viewport Panzoom).
   * - `false` — не создавать обёртку
   * - строка — классы для div-обёртки
   * - объект — расширенная настройка (тег, классы, атрибуты)
   */
  slideWrapper?: false | string | SlideWrapperOptions;
}

export const useLightGallery = ({
  items,
  selector = 'a[data-fancybox]',
  containerSelector,
  counter = true,
  closeOnTap = true,
  controls = false,
  showToolbar = true,
  showFullscreen = true,
  showCloseIcon = true,
  download = false,
  navigation = true,
  hasArrows = true,
  mainClass,
  captionClassName,
  onClose,
  videoAutoplay = false,
  disableZoom = false,
  captionPlacement = 'default',
  slideWrapper = false,
}: UseLightGalleryOptions) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fancyboxInstanceRef = useRef<any>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : galleryRef.current;

    if (!container) return;

    const actualSelector = selector || 'a[data-fancybox]';

    // Нормализуем опцию slideWrapper
    const wrapperConfig: Required<SlideWrapperOptions> | null =
      slideWrapper === false
        ? null
        : typeof slideWrapper === 'string'
          ? { tag: 'div', className: slideWrapper, attributes: {} }
          : {
              tag: slideWrapper.tag ?? 'div',
              className: slideWrapper.className ?? '',
              attributes: slideWrapper.attributes ?? {},
            };

    const fancyboxOptions: Record<string, any> = {
      on: {
        destroy: () => {
          onCloseRef.current?.();
          document.dispatchEvent(new Event('fancybox:destroy'));
        },
        'Carousel.ready': (fancybox: any) => {
          const index = fancybox.getIndex?.();
          if (index !== undefined) {
            setCurrentIndex(index);
          }
        },
        // Оборачиваем контент слайда после его готовности
        'Carousel.contentReady': (_fancybox: any, _carousel: any, slide: any) => {
          if (!wrapperConfig) return;

          const viewport = slide?.panzoomRef?.getViewport?.();
          if (!viewport) return;

          const marker = 'data-slide-wrapper';
          if (viewport.querySelector(`[${marker}]`)) return;

          const wrapper = document.createElement(wrapperConfig.tag);
          if (wrapperConfig.className) {
            wrapper.className = wrapperConfig.className;
          }
          wrapper.setAttribute(marker, '');
          Object.entries(wrapperConfig.attributes).forEach(([k, v]) => {
            wrapper.setAttribute(k, v);
          });

          // Переносим содержимое viewport в обёртку
          while (viewport.firstChild) {
            wrapper.appendChild(viewport.firstChild);
          }

          // Если подпись должна быть внутри обёртки — переносим её сюда
          if (captionPlacement === 'wrapper') {
            const captionHtml = slide?.triggerEl?.dataset?.caption;
            if (captionHtml) {
              const captionEl = document.createElement('div');
              captionEl.className = 'barrier-caption__wrapper';
              captionEl.innerHTML = captionHtml;
              wrapper.appendChild(captionEl);
            }
          }

          viewport.appendChild(wrapper);
        },
      },
      ...(mainClass ? { mainClass } : {}),
      // Верхнеуровневая опция в Fancybox 6
      backdropClick: 'close',
      Carousel: {
        adaptiveHeight: true,
        Toolbar: {
          enabled: showToolbar,
          display: {
            left: counter ? ['counter'] : [],
            middle:
              controls && !disableZoom
                ? ['zoomIn', 'zoomOut', 'toggle1to1']
                : [],
            right: [
              ...(showCloseIcon ? ['close'] : []),
              ...(download ? ['download'] : []),
              ...(showFullscreen ? ['fullscreen'] : []),
            ],
          },
        },
        Zoomable: disableZoom
          ? {
              Panzoom: {
                maxScale: 1,
                minScale: 1,
                wheelAction: false,
                pinchToZoom: false,
                clickAction: false,
              },
            }
          : {},
        Navigation: navigation,
        Arrows: hasArrows,
        ...(videoAutoplay ? { Video: { autoplay: true } } : {}),
        formatCaption: (caption: string, slide: any) =>
          captionClassName
            ? `<span class="${captionClassName}">${slide?.triggerEl?.dataset?.caption ?? caption}</span>`
            : slide?.triggerEl?.dataset?.caption ?? caption,
        // Прячем штатную подпись, если она не нужна или переехала в обёртку
        ...(captionPlacement !== 'default'
          ? { formatCaption: () => '' }
          : {}),
      },
      Click: closeOnTap ? 'close' : 'toggle',
      Zoom: false,
      Images: {
        wheel: false,
      },
      wheel: 'slide',
      Hash: false,
    };

    Fancybox.bind(container as HTMLElement, actualSelector, fancyboxOptions);
    fancyboxInstanceRef.current = Fancybox;

    return () => {
      try {
        Fancybox.unbind(container as HTMLElement);
      } catch (e) {
        // Ignore unbind errors
      }
    };
  }, [
    items,
    selector,
    containerSelector,
    counter,
    closeOnTap,
    controls,
    showToolbar,
    showFullscreen,
    showCloseIcon,
    download,
    navigation,
    mainClass,
    captionClassName,
    videoAutoplay,
    disableZoom,
    captionPlacement,
    slideWrapper,
  ]);

  const openGallery = (index: number) => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : galleryRef.current;

    if (container) {
      const actualSelector = selector || 'a[data-fancybox]';
      const links = container.querySelectorAll(actualSelector);
      const link = links[index] as HTMLElement;
      if (link) {
        link.click();
      }
    }
  };

  const goToNext = () => {
    const instance = Fancybox.getInstance?.();
    const carousel = instance?.getCarousel?.();
    if (carousel?.next) {
      carousel.next();
    }
  };

  const goToPrev = () => {
    const instance = Fancybox.getInstance?.();
    const carousel = instance?.getCarousel?.();
    if (carousel?.prev) {
      carousel.prev();
    }
  };

  return {
    galleryRef,
    openGallery,
    goToNext,
    goToPrev,
    currentIndex,
    totalItems: items.length,
  };
};