import { useEffect, useRef, useState } from 'react';
import { Arrows, Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

interface GalleryItem {
  src?: string | { src: string };
  thumb?: string;
  alt?: string;
  subHtml?: string;
  [key: string]: any;
}

interface UseLightGalleryOptions {
  items: GalleryItem[];
  selector?: string;
  containerSelector?: string;
  download?: boolean;
  counter?: boolean;
  closeOnTap?: boolean;
  controls?: boolean;
  showFullscreen?: boolean;
  navigation?: boolean;
  hasArrows?: boolean;
  showCloseIcon?: boolean;
  mainClass?: string;
  captionClassName?: string;
  onClose?: () => void;
  videoAutoplay?: boolean;
}

export const useLightGallery = ({
  items,
  selector = 'a[data-fancybox]',
  containerSelector,
  counter = true,
  closeOnTap = true,
  controls = true,
  showFullscreen = true,
  navigation = true,
  hasArrows = true,
  mainClass,
  captionClassName,
  onClose,
  videoAutoplay = false,
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
      Toolbar: {
        display: {
          left: counter ? ['counter'] : [],
          middle: [],
          right: controls
            ? ['zoom', ...(showFullscreen ? ['fullscreen'] : []), 'close']
            : ['close'],
        },
      },
      Carousel: {
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
        wheel: false, // или wheel: false
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
  }, [items, selector, containerSelector, counter, closeOnTap, controls, showFullscreen, navigation, mainClass, captionClassName, videoAutoplay]);

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

  return { galleryRef, openGallery, goToNext, goToPrev, currentIndex, totalItems: items.length };
};
