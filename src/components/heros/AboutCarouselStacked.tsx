import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { useMemo, useRef, useState } from 'react';
import { useLightGallery } from '@hooks/useLightGallery';
import 'swiper/css';

type AboutCarouselStackedProps = {
  images: string[];
};

export default function AboutCarouselStacked({ images }: AboutCarouselStackedProps): JSX.Element {
  const [activePair, setActivePair] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const galleryItems = useMemo(
    () => images.map((src, index) => ({ src, alt: `Производство PERCo, фото ${index + 1}` })),
    [images],
  );
  const imagePairs = useMemo(
    () => Array.from({ length: Math.ceil(images.length / 2) }, (_, pairIndex) => images.slice(pairIndex * 2, pairIndex * 2 + 2)),
    [images],
  );
  const { galleryRef } = useLightGallery({
    items: galleryItems,
    selector: 'a[data-fancybox="about-stacked"]',
  });

  return (
    <div ref={galleryRef} className="about-gallery-stacked">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActivePair(swiper.activeIndex);
        }}
        slidesPerView={1}
        slidesPerGroup={1}
        spaceBetween={8}
        loop={false}
        onSlideChange={(swiper) => setActivePair(swiper.activeIndex)}
        className="about-gallery-stacked__slider"
      >
        {imagePairs.map((pair, pairIndex) => (
          <SwiperSlide key={`about-pair-${pairIndex}`}>
            {pair.map((src, imageIndex) => {
              const index = pairIndex * 2 + imageIndex;

              return (
                <a
                  key={src}
                  href={src}
                  data-fancybox="about-stacked"
                  data-caption={`Производство PERCo, фото ${index + 1}`}
                  className="block cursor-zoom-in"
                >
                  <img
                    src={src}
                    alt={`Производство PERCo, фото ${index + 1}`}
                    className={`mb-1 aspect-[1.72] h-full w-full object-cover ${pair.length === 1 ? 'rounded-3xl' : imageIndex === 0 ? 'rounded-t-3xl' : 'rounded-b-3xl'}`}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </a>
              );
            })}
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-4 flex justify-center items-center gap-2" aria-label="Навигация по фотографиям">
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
