import { useEffect, useRef } from 'react';
import lightGallery from 'lightgallery';
import lgZoom from 'lightgallery/plugins/zoom';

interface GalleryItem {
  src: string | { src: string };
  alt?: string;
  thumb?: string;
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

  useEffect(() => {
    if (!galleryRef.current) return;

    const normalizedItems = items.map((item) => ({
      ...item,
      src: typeof item.src === 'string' ? item.src : item.src?.src,
    }));

    galleryInstanceRef.current = lightGallery(galleryRef.current, {
      dynamic: true,
      dynamicEl: normalizedItems,
      plugins: [lgZoom],
      download,
      counter,
      closeOnTap,
      showCloseIcon,
      selector,
    });

    return () => {
      galleryInstanceRef.current?.destroy?.();
      galleryInstanceRef.current = null;
    };
  }, [items, selector, download, counter, closeOnTap, showCloseIcon]);

  const openGallery = (index: number) => {
    galleryInstanceRef.current?.openGallery(index);
  };

  return { galleryRef, openGallery };
};
