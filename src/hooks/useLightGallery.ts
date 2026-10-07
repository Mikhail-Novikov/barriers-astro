import { useEffect, useRef, useState } from 'react';
import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface GalleryItem {
  src?: string | { src: string };
  thumb?: string;
  alt?: string;
  subHtml?: string;
  [key: string]: any;
}

interface UseLightGalleryOptions {
  /** Элементы галереи */
  items: GalleryItem[];
  /** Селектор элементов галереи */
  selector?: string;
  /** Селектор контейнера */
  containerSelector?: string;
  /** Показывать кнопку скачивания */
  download?: boolean;
  /** Показывать счетчик */
  counter?: boolean;
  /** Закрывать галерею при клике на фон */
  closeOnTap?: boolean;
  /** Показывать среднюю панель */
  controls?: boolean;
  /** Показывать панель инструментов справа */
  showToolbar?: boolean;
  /** Показывать полноэкранный режим */
  showFullscreen?: boolean;
  /** Показывать навигацию */
  navigation?: boolean;
  /** Показывать стрелки */
  hasArrows?: boolean;
  /** Показывать иконку закрытия */
  showCloseIcon?: boolean;
  /** Класс для основного контейнера */
  mainClass?: string;
  /** Класс для caption */
  captionClassName?: string;
  /** Функция, вызываемая при закрытии галереи */
  onClose?: () => void;
  /** Автозапуск видео при открытии галереи */
  videoAutoplay?: boolean;
  /** Отключает увеличение/уменьшение изображения (Panzoom) */
  disableZoom?: boolean;
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

    // Используем selector для bindings
    const actualSelector = selector || 'a[data-fancybox]';

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
      },
      ...(mainClass ? { mainClass } : {}),
      Carousel: {
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
        // Настройки Panzoom: при disableZoom полностью блокируем зум
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
      },
      Click: closeOnTap ? 'close' : 'toggle',
      Zoom: false,
      Images: {
        wheel: false,
      },
      wheel: 'slide',
      Hash: false,
    };

    // Bind Fancybox к контейнеру с селектором
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