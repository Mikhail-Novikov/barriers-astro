import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { useMemo, useRef, useState } from 'react';

import { useLightGallery } from '@hooks/useLightGallery';

import AboutCarouselControls from '@components/AboutCarouselControls';

import 'swiper/css';

type AboutCarouselStackedProps = {
  // массив изображений в галерее в формате { src: string; alt: string; description: string }
  images: { src: string; alt: string; description: string }[];
};

/**
 * Компонент AboutCarouselStacked представляет собой галерею изображений в стеке.
 * 
 * @param {Array} props.images - Массив изображений в галерее в формате { src: string; alt: string; description: string }.
 * @return {JSX.Element} JSX-элемент галереи.
 */
export default function AboutCarouselStacked({ images }: AboutCarouselStackedProps): JSX.Element {
  const slidesPerPage = 2;
  const [activePair, setActivePair] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const galleryItems = useMemo(
    () => images.map(({ src, alt }) => ({ src, alt })),
    [images],
  );
  const imagePairs = useMemo(
    () => Array.from({ length: Math.ceil(images.length / 2) }, (_, pairIndex) => images.slice(pairIndex * 2, pairIndex * 2 + 2)),
    [images],
  );
  const { galleryRef } = useLightGallery({
    items: galleryItems,
    selector: 'a[data-fancybox="about-stacked"]',
    controls: false,
  });

  const move = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? activePair + 1 : activePair - 1;

    swiperRef.current?.slideTo(nextIndex);
  };

  return (
    <div ref={galleryRef} className="about-gallery-stacked">
      <AboutCarouselControls
        className="hidden sm:flex"
        start={activePair * slidesPerPage + 1}
        end={Math.min((activePair + 1) * slidesPerPage, images.length)}
        onPrevious={() => move('prev')}
        onNext={() => move('next')}
        isAtStart={activePair === 0}
        isAtEnd={activePair >= imagePairs.length - 1}
      />
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActivePair(swiper.activeIndex);
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        loop={false}
        onSlideChange={(swiper) => setActivePair(swiper.activeIndex)}
        className="about-gallery-stacked__slider"
      >
        {imagePairs.map((pair, pairIndex) => (
          <SwiperSlide key={`about-pair-${pairIndex}`}>
            {pair.map(({ src, alt, description }, imageIndex) => {
              const index = pairIndex * 2 + imageIndex;

              return (
                <a
                  key={src}
                  href={src}
                  data-fancybox="about-stacked"
                  data-caption={description}
                  className="block cursor-zoom-in"
                >
                  <img
                    src={src}
                    alt={alt}
                    className={`mb-1 sm:mb-4 aspect-[1.72] h-[172px] sm:h-[294px] w-full object-cover ${pair.length === 1 ? 'rounded-2xl' : imageIndex === 0 ? 'rounded-t-2xl' : 'rounded-b-2xl'}`}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </a>
              );
            })}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4 flex justify-center items-center gap-2 sm:hidden" aria-label="Навигация по фотографиям">
        {imagePairs.map((_, pairIndex) => (
          <button
            key={`about-pair-pagination-${pairIndex}`}
            type="button"
            aria-label={`Показать cлайд ${pairIndex + 1}`}
            aria-current={activePair === pairIndex ? 'true' : undefined}
            onClick={() => swiperRef.current?.slideTo(pairIndex)}
            className={`rounded-full transition-colors ${activePair === pairIndex ? 'size-2 bg-grey-700' : 'size-1 bg-grey-500'}`}
          />
        ))}
      </div>
    </div>
  );
}
