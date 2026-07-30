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
      const resolvedAlt = item.alt ?? '';

      return {
        ...item,
        src: resolvedSrc,
        thumb: resolvedThumb,
        subHtml: resolvedAlt ? `<div class="lg-sub-html">${resolvedAlt}</div>` : undefined,
      };
    });

    const galleryOptions: LightGalleryHookOptions = {
      dynamic: true,
      dynamicEl: normalizedItems,
      plugins: [lgZoom],
      download,
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

    galleryElement.addEventListener('lgAfterOpen', handleOpen);
    galleryElement.addEventListener('lgBeforeClose', handleClose);

    return () => {
      document.body.classList.remove('lightgallery-on');
      galleryElement.removeEventListener('lgAfterOpen', handleOpen);
      galleryElement.removeEventListener('lgBeforeClose', handleClose);
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
