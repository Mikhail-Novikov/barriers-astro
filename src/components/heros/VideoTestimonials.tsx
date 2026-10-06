import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { useRef, useState } from 'react';
import { useLightGallery } from '@hooks/useLightGallery';
import { useBreakpoint } from '@hooks/useBreakpoint';

import { publicAsset } from "@utils/publicAsset";

import SliderArrow from '@components/SliderArrow';
import VideoPlayButton from '@components/VideoPlayButton';

import 'swiper/css';
import 'swiper/css/free-mode';

const previewImages = [1, 2, 3, 4, 5].map((index) =>
  publicAsset(`/img/video-reviews/vr-${index}.webp`),
);

const testimonials = [
  {
    title: 'Парковочная система PERCo.Паркинг в деловом центре Sun City, Санкт-Петербург',
    duration: '02:44',
    videoUrl: publicAsset('/video/video-reviews/vr-1.mp4'),
  },
  {
    title: 'Система контроля доступа PERCo-Web в бизнес-центре Capital Tower',
    duration: '02:11',
    videoUrl: publicAsset('/video/video-reviews/vr-2.mp4'),
  },
  {
    title: 'Шлагбаумы PERCo на территории предприятия ДиКом',
    duration: '01:06',
    videoUrl: publicAsset('/video/video-reviews/vr-3.mp4'),
  },
  {
    title: 'Шлагбаум PERCo в Морском порту Санкт-Петербурга',
    duration: '02:34',
    videoUrl: publicAsset('/video/video-reviews/vr-4.mp4'),
  },
  {
    title: 'Шлагбаумы PERCo в музее “Россия – моя история”',
    duration: '01:02',
    videoUrl: publicAsset('/video/video-reviews/vr-5.mp4'),
  },
];

/**
 * Компонент видео-ролликов
 * 
 * @return VideoTestimonials
 */
export default function VideoTestimonials(): JSX.Element {
  const screen = useBreakpoint();
  const [startIndex, setStartIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const { galleryRef } = useLightGallery({
    items: testimonials.map(({ title, videoUrl }) => ({ src: videoUrl, subHtml: title })),
    selector: 'a[data-fancybox="video-testimonials"]',
    captionClassName: "inline-block md:mx-10 md:text-2xl text-white text-center",
    mainClass: 'hero-video',
    controls: true,
    navigation: false,
    hasArrows: false,
  });

  const move = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? startIndex + 1 : startIndex - 1;

    swiperRef.current?.slideTo(nextIndex);
  };

  const updateNavigation = (swiper: SwiperInstance) => {
    setStartIndex(swiper.activeIndex);
    setIsAtStart(swiper.isBeginning);
    setIsAtEnd(swiper.isEnd);
  };

  return (
    <div ref={galleryRef}>
      <Swiper
        modules={[FreeMode]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateNavigation(swiper);
        }}
        aria-label="Видеоотзывы клиентов"
        slidesPerView="auto"
        slidesPerGroup={1}
        spaceBetween={4}
        freeMode={{ enabled: true, sticky: true }}
        loop={false}
        onSlideChange={updateNavigation}
      >
        {testimonials.map(({ title, duration, videoUrl }, index) => {
          const image = previewImages[index % previewImages.length];

          return (
            <SwiperSlide key={`${videoUrl}-${index}`} className="sm:!w-[min(415px,calc(100vw-32px))]">
              <a
                href={videoUrl}
                data-fancybox="video-testimonials"
                data-caption={title}
                className="group block cursor-zoom-in outline-none focus:outline-none focus-visible:outline-none"
              >
                <span className="relative block aspect-[1.76] overflow-hidden rounded-2xl">
                  <img
                    src={image}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                  <span className="px-2 absolute bottom-2 right-2 bg-black/40 rounded-2xl font-manrope-medium text-white text-sm/7">
                    {duration}
                  </span>
                  <VideoPlayButton />
                </span>
                <span className="mt-4 mr-6 block text-md/6 text-grey-1000">{title}</span>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div aria-label="Управление видеоотзывами">
        {!screen.sm ? (
          <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Выбор видеоотзыва">
            {testimonials.map(({ videoUrl, title }, index) => (
              <button
                key={videoUrl}
                type="button"
                role="tab"
                aria-label={title}
                aria-selected={startIndex === index}
                onClick={() => swiperRef.current?.slideTo(index)}
                className={`cursor-pointer rounded-full transition-colors ${startIndex === index ? 'size-2 bg-grey-700' : 'size-1 bg-grey-500'}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1 mt-10" aria-label="Управление видеоотзывами">
            <SliderArrow direction="left" onClick={() => move('prev')} disabled={isAtStart} />
            <SliderArrow direction="right" onClick={() => move('next')} disabled={isAtEnd} />
          </div>
        )}
      </div>
    </div>
  );
}