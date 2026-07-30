import { useEffect, useRef, useState } from 'react';
import lightGallery from 'lightgallery';
import type { LightGallerySettings } from 'lightgallery/lg-settings';
import type { LightGallery } from 'lightgallery/lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

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
  showCloseIcon?: boolean;
}

type LightGalleryHookOptions = LightGallerySettings & {
  afterChange?: (instance: { index: number }) => void;
};

export const useLightGallery = ({
  items,
  selector = '.gallery-item',
  containerSelector,
  download = false,
  counter = true,
  closeOnTap = true,
  controls = true,
  showCloseIcon = true,
}: UseLightGalleryOptions) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryInstanceRef = useRef<LightGallery | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const container = containerSelector
      ? document.querySelector(containerSelector)
      : galleryRef.current;

    if (!container) return;

    const normalizedItems = items.map((item) => {
      const resolvedSrc = typeof item.src === 'string'
        ? item.src
        : typeof item.src === 'object' && item.src?.src
          ? item.src.src
          : item.img ?? item.thumb;
      const resolvedThumb = item.thumb ?? (typeof resolvedSrc === 'string' ? resolvedSrc : undefined);
      const resolvedTitle = [item.title, item.alt]
        .find((value): value is string => typeof value === 'string' && value.trim().length > 0)
        ?.trim() ?? '';

      return {
        ...item,
        src: resolvedSrc,
        thumb: resolvedThumb,
        subHtml: resolvedTitle ? `<p class="!text-2xl !mb-4">${resolvedTitle}</p>` : undefined,
        title: resolvedTitle,
      };
    });

    const galleryOptions: LightGalleryHookOptions = {
      dynamic: true,
      dynamicEl: normalizedItems,
      plugins: [lgZoom],
      download,
      controls,
      counter,
      closeOnTap,
      showCloseIcon,
      selector,
      addClass: 'lightgallery',
      ...(containerSelector ? { container: container as HTMLElement } : {}),
      afterChange: (instance: { index: number }) => {
        setCurrentIndex(instance.index);
      },
    };

    galleryInstanceRef.current = lightGallery(container as HTMLElement, galleryOptions);

    const galleryElement = container as HTMLElement;

    const handleOpen = () => {
      document.body.classList.add('lightgallery-on');
    };

    const handleClose = () => {
      document.body.classList.remove('lightgallery-on');
    };

    const handleBackdropClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const isOutsideClick = target === document.body || target === document.documentElement;
      const isBackdrop = target?.classList.contains('lightgallery-backdrop');

      if (isOutsideClick || isBackdrop) {
        galleryInstanceRef.current?.closeGallery();
      }
    };

    galleryElement.addEventListener('lgAfterOpen', handleOpen);
    galleryElement.addEventListener('lgBeforeClose', handleClose);
    document.addEventListener('click', handleBackdropClick);

    return () => {
      document.body.classList.remove('lightgallery-on');
      galleryElement.removeEventListener('lgAfterOpen', handleOpen);
      galleryElement.removeEventListener('lgBeforeClose', handleClose);
      document.removeEventListener('click', handleBackdropClick);
      galleryInstanceRef.current?.destroy?.();
      galleryInstanceRef.current = null;
    };
  }, [items, selector, containerSelector, download, counter, closeOnTap, showCloseIcon]);

  const openGallery = (index: number) => {
    galleryInstanceRef.current?.openGallery(index);
  };

  const goToNext = () => {
    const instance = galleryInstanceRef.current as LightGallery & {
      next?: () => void;
      prev?: () => void;
    };
    instance.next?.();
  };

  const goToPrev = () => {
    const instance = galleryInstanceRef.current as LightGallery & {
      next?: () => void;
      prev?: () => void;
    };
    instance.prev?.();
  };

  return { galleryRef, openGallery, goToNext, goToPrev, currentIndex, totalItems: items.length };
};
