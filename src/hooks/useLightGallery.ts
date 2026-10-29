import { useEffect, useRef, useState } from 'react';
import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

import { Dots } from "@fancyapps/ui/dist/carousel/carousel.dots.js";
import "@fancyapps/ui/dist/carousel/carousel.dots.css";

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
  captionClassName = 'inline-block md:mx-10 md:text-[20px] font-manrope-semibold text-center',
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
      mainStyle: {
        '--f-carousel-slide-bg': '#F3F4F8',
        '--f-button-bg': '#F3F4F8',
        '--f-button-color': '#7F808A',
        '--f-button-hover-color': '#22252F',
        '--f-caption-bg': '#F3F4F8',
        '--f-caption-color': '#22252F',
        '--f-arrow-bg': '#F3F4F8',
        '--f-arrow-hover-bg': '#22252F',
        '--f-arrow-color': '#7F808A',
        '--f-carousel-dots-top': 'auto',
        '--f-carousel-dots-bottom': '24px',
        '--f-carousel-dot-bg': '#7F808A',
        '--f-carousel-dot-hover-bg': '#22252F',
        '--f-carousel-dot-selected-bg': '#8E8F9E',
        '--f-carousel-dot-height': '4px',
        '--f-carousel-dot-width': '4px',
        '--f-carousel-dot-active-width': '8px',
        '--f-carousel-dot-active-height': '8px',
        '--f-carousel-dots-width': '12px',
        '--f-toolbar-text-shadow': 'none',
        '--f-toolbar-color': '#636C79',
      },
      // Верхнеуровневая опция в Fancybox 6
      backdropClick: 'close',
      Carousel: {
        plugins: { Dots },
        Thumbs: false,
        adaptiveHeight: true,
        transition: "slide",
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