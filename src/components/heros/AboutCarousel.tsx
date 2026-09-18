import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useMemo, useRef, useState } from 'react';
import { useLightGallery } from '@hooks/useLightGallery';
import SliderArrow from '@components/SliderArrow';
import '@splidejs/react-splide/css';

type AboutCarouselProps = {
  images: string[];
};

const slidesPerPage = 2;

export default function AboutCarousel({ images }: AboutCarouselProps): JSX.Element {
  const [startIndex, setStartIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(images.length <= slidesPerPage);
  const splideRef = useRef<{ splide?: { go: (index: number) => void } }>(null);
  const galleryItems = useMemo(
    () => images.map((src, index) => ({ src, alt: `Производство PERCo, фото ${index + 1}` })),
    [images],
  );
  const { galleryRef } = useLightGallery({
    items: galleryItems,
    selector: 'a[data-fancybox="about"]',
  });

  const pageCount = Math.ceil(images.length / slidesPerPage);
  const currentPage = Math.floor(startIndex / slidesPerPage);
  const rangeStart = String(startIndex + 1).padStart(2, '0');
  const rangeEnd = String(Math.min(startIndex + slidesPerPage, images.length)).padStart(2, '0');
  const move = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? startIndex + slidesPerPage : startIndex - slidesPerPage;

    splideRef.current?.splide?.go(nextIndex);
  };
  const updateNavigation = (splide: { index: number; length: number; options: { perPage: number } }) => {
    setStartIndex(splide.index);
    setIsAtStart(splide.index === 0);
    setIsAtEnd(splide.index >= splide.length - splide.options.perPage);
  };

  return (
    <div ref={galleryRef} className="about-gallery">
      <div className="mb-8 flex items-center justify-between gap-4">
        <span className="inline-flex rounded-full border border-grey-500 px-5 py-2 text-lg/7 text-grey-700">
          {rangeStart} - {rangeEnd}
        </span>
        <div className="flex items-center gap-6" aria-label="Управление фотографиями">
          <div className="flex items-center gap-2">
            <SliderArrow direction="left" onClick={() => move('prev')} disabled={isAtStart} />
            <SliderArrow direction="right" onClick={() => move('next')} disabled={isAtEnd} />
          </div>
        </div>
      </div>

      <Splide
        ref={splideRef}
        aria-label="Фотографии о компании"
        options={{
          arrows: false,
          pagination: false,
          perPage: slidesPerPage,
          perMove: slidesPerPage,
          gap: 20,
          rewind: true,
          loop: false,
          breakpoints: {
            767: { perPage: 1, perMove: slidesPerPage, gap: '1rem' },
          },
        }}
        onMounted={updateNavigation}
        onMoved={updateNavigation}
        className="about-gallery__slider"
      >
        {images.map((src, index) => (
          <SplideSlide key={src}>
            <a
              href={src}
              data-fancybox="about"
              data-caption={`Производство PERCo, фото ${index + 1}`}
              className="block h-full cursor-zoom-in"
            >
              <img
                src={src}
                alt={`Производство PERCo, фото ${index + 1}`}
                className={`aspect-[1.72] h-full max-h-[412px] w-full object-cover ${index % 2 !== 0 ? 'rounded-tr-[32px] rounded-br-[32px]' : 'rounded-tl-[32px] rounded-bl-[32px]'}`}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
            </a>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}