import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { useMemo, useRef, useState } from 'react';

import { useLightGallery } from '@hooks/useLightGallery';

import AboutCarouselControls from '@components/AboutCarouselControls';
import PaginationDots from '@components/PaginationDots';

import 'swiper/css';

/**
 * Описывает фотографию, отображаемую в галерее о компании.
 */
type AboutCarouselImage = {
  /** URL изображения. */
  src: string;
  /** Альтернативное описание изображения. */
  alt: string;
  /** Подпись, показываемая в лайтбоксе. */
  description: string;
};

/**
 * Пропсы галереи фотографий, сгруппированных попарно.
 */
type AboutCarouselStackedProps = {
  /** Изображения, которые будут сгруппированы по два на слайд. */
  images: AboutCarouselImage[];
};

/**
 * Компонент AboutCarouselStacked представляет собой галерею изображений в стеке.
 * 
 * @param props - Данные фотографий для галереи.
 * @returns Галерея с парной группировкой изображений и лайтбоксом.
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

  /**
   * Перемещает карусель на одну пару изображений.
   *
   * @param direction - Направление перемещения.
   */
  const move = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? activePair + 1 : activePair - 1;

    swiperRef.current?.slideTo(nextIndex);
  };

  return (
    <div ref={galleryRef} className="about-gallery-stacked">
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
      <AboutCarouselControls
        className="hidden lg:flex"
        start={activePair * slidesPerPage + 1}
        end={Math.min((activePair + 1) * slidesPerPage, images.length)}
        onPrevious={() => move('prev')}
        onNext={() => move('next')}
        isAtStart={activePair === 0}
        isAtEnd={activePair >= imagePairs.length - 1}
      />
      <PaginationDots
        className="mt-4 lg:hidden"
        count={imagePairs.length}
        activeIndex={activePair}
        onSelect={(index) => swiperRef.current?.slideTo(index)}
        ariaLabel="Навигация по фотографиям"
        getItemLabel={(index) => `Показать слайд ${index + 1}`}
      />
    </div>
  );
}
