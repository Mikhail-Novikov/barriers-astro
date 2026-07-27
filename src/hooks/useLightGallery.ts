import { useEffect, useRef, useState } from 'react';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

interface GalleryItem {
  src: string | { src: string };
  thumb?: string;
  alt?: string;
  subHtml?: string;
  [key: string]: any;
}

interface UseLightGalleryOptions {
  items: GalleryItem[];
  selector?: string;
  download?: boolean;
  counter?: boolean;
  closeOnTap?: boolean;
  showCloseIcon?: boolean;
}

export const useLightGallery = ({
  items,
  selector = '.gallery-item',
  download = false,
  counter = true,
  closeOnTap = true,
  showCloseIcon = true,
}: UseLightGalleryOptions) => {
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const galleryInstanceRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!galleryRef.current) return;

    const normalizedItems = items.map((item) => {
      const resolvedSrc = typeof item.src === 'string' ? item.src : item.src?.src;
      const resolvedThumb = item.thumb ?? (typeof resolvedSrc === 'string' ? resolvedSrc : undefined);
      const resolvedAlt = item.alt ?? '';

      return {
        ...item,
        src: resolvedSrc,
        thumb: resolvedThumb,
        subHtml: resolvedAlt ? `<div class="lg-sub-html">${resolvedAlt}</div>` : undefined,
      };
    });

    galleryInstanceRef.current = lightGallery(galleryRef.current, {
      dynamic: true,
      dynamicEl: normalizedItems,
      plugins: [lgZoom],
      download,
      counter,
      closeOnTap: false,
      showCloseIcon,
      selector,
      addClass: 'lightgallery',
      selectWithin: 'container-control',
      afterChange: (instance: any) => {
        setCurrentIndex(instance.index);
      },
    } as any);

    return () => {
      galleryInstanceRef.current?.destroy?.();
      galleryInstanceRef.current = null;
    };
  }, [items, selector, download, counter, closeOnTap, showCloseIcon]);

  const openGallery = (index: number) => {
    galleryInstanceRef.current?.openGallery(index);
  };

  const goToNext = () => {
    galleryInstanceRef.current?.next();
  };

  const goToPrev = () => {
    galleryInstanceRef.current?.prev();
  };

  return { galleryRef, openGallery, goToNext, goToPrev, currentIndex, totalItems: items.length };
};
