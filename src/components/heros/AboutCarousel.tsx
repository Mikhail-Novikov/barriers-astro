import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { useMemo, useRef, useState } from 'react';
import { useLightGallery } from '@hooks/useLightGallery';
import SliderArrow from '@components/SliderArrow';
import 'swiper/css';

type AboutCarouselProps = {
  images: { src: string; alt: string; description: string }[];
};

const slidesPerPage = 2;

export default function AboutCarousel({ images }: AboutCarouselProps): JSX.Element {
  const [startIndex, setStartIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(images.length <= slidesPerPage);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const galleryItems = useMemo(
    () => images.map(({ src, alt }) => ({ src, alt })),
    [images],
  );
  const { galleryRef } = useLightGallery({
    items: galleryItems,
    selector: 'a[data-fancybox="about"]',
    captionClassName: "inline-block md:mx-10 md:text-2xl text-white text-center",
  });

  const rangeStart = String(startIndex + 1).padStart(2, '0');
  const rangeEnd = String(Math.min(startIndex + slidesPerPage, images.length)).padStart(2, '0');
  const move = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? startIndex + slidesPerPage : startIndex - slidesPerPage;

    swiperRef.current?.slideTo(nextIndex);
  };
  const updateNavigation = (swiper: SwiperInstance) => {
    const slidesPerView = Number(swiper.params.slidesPerView);
    setStartIndex(swiper.activeIndex);
    setIsAtStart(swiper.isBeginning);
    setIsAtEnd(swiper.isEnd || swiper.activeIndex >= swiper.slides.length - slidesPerView);
  };

  return (
    <div ref={galleryRef} className="about-gallery">
      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="inline-flex rounded-full border border-grey-500 px-5 py-2 text-lg/7 text-grey-700">
          {rangeStart} - {rangeEnd}
        </span>
        <div className="flex items-center gap-1" aria-label="Управление фотографиями">
          <SliderArrow direction="left" onClick={() => move('prev')} disabled={isAtStart} />
          <SliderArrow direction="right" onClick={() => move('next')} disabled={isAtEnd} />
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateNavigation(swiper);
        }}
        aria-label="Фотографии о компании"
        slidesPerView={slidesPerPage}
        slidesPerGroup={slidesPerPage}
        spaceBetween={20}
        loop={false}
        breakpoints={{
          767: { slidesPerView: slidesPerPage, slidesPerGroup: slidesPerPage, spaceBetween: 16 },
        }}
        onSlideChange={updateNavigation}
      >
        {images.map(({ src, alt, description }, index) => (
          <SwiperSlide key={src}>
            <a
              href={src}
              data-fancybox="about"
              data-caption={description}
              className="block h-full cursor-zoom-in"
            >
              <img
                src={src}
                alt={alt}
                className={`aspect-[1.72] h-full max-h-[412px] w-full object-cover ${index % 2 !== 0 ? 'rounded-tr-[32px] rounded-br-[32px]' : 'rounded-tl-[32px] rounded-bl-[32px]'}`}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}