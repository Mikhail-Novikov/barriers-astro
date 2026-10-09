import { useCallback, useEffect, useRef, useState } from 'react';

export interface ZoomModalImage {
  src: string;
  thumb: string;
}

interface ZoomModalEntry<T> {
  src: string;
  barrier: T;
  images: ZoomModalImage[];
}

interface ThumbnailNavigation {
  hasOverflow: boolean;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

const INITIAL_THUMBNAIL_NAVIGATION: ThumbnailNavigation = {
  hasOverflow: false,
  canScrollLeft: false,
  canScrollRight: false,
};

export function useZoomModal<TBarrier>() {
  const [activeImage, setActiveImage] = useState<ZoomModalEntry<TBarrier> | null>(null);
  const [thumbnailNavigation, setThumbnailNavigation] = useState(INITIAL_THUMBNAIL_NAVIGATION);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isOpen = activeImage !== null;

  const open = useCallback((
    src: string,
    barrier: TBarrier,
    images: ZoomModalImage[],
  ) => {
    setActiveImage({ src, barrier, images });
  }, []);

  const selectImage = useCallback((src: string) => {
    setActiveImage((current) => current ? { ...current, src } : current);
  }, []);

  const close = useCallback(() => setActiveImage(null), []);

  const updateThumbnailNavigation = useCallback(() => {
    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return;

    const hasOverflow = thumbnails.scrollWidth > thumbnails.clientWidth + 1;
    setThumbnailNavigation({
      hasOverflow,
      canScrollLeft: hasOverflow && thumbnails.scrollLeft > 1,
      canScrollRight: hasOverflow
        && thumbnails.scrollLeft + thumbnails.clientWidth < thumbnails.scrollWidth - 1,
    });
  }, []);

  const scrollThumbnails = useCallback((direction: -1 | 1) => {
    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return;
    thumbnails.scrollBy({
      left: direction * thumbnails.clientWidth * 0.75,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setThumbnailNavigation(INITIAL_THUMBNAIL_NAVIGATION);
      return undefined;
    }

    const thumbnails = thumbnailsRef.current;
    if (!thumbnails) return undefined;

    updateThumbnailNavigation();
    const resizeObserver = new ResizeObserver(updateThumbnailNavigation);
    resizeObserver.observe(thumbnails);
    window.addEventListener('resize', updateThumbnailNavigation);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateThumbnailNavigation);
    };
  }, [isOpen, activeImage?.images.length, updateThumbnailNavigation]);

  return {
    activeImage,
    isOpen,
    open,
    selectImage,
    close,
    thumbnailsRef,
    thumbnailNavigation,
    updateThumbnailNavigation,
    scrollThumbnails,
  };
}
