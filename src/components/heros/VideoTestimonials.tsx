import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { FreeMode } from 'swiper/modules';
import { useRef, useState } from 'react';
import { useLightGallery } from '@hooks/useLightGallery';

import SliderArrow from '@components/SliderArrow';
import VideoPlayButton from '@components/VideoPlayButton';

import 'swiper/css';
import 'swiper/css/free-mode';

const aboutImages = Object.entries(
  import.meta.glob<string>('../../assets/about/*.{png,jpg,jpeg,webp}', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
)
  .sort(([first], [second]) => first.localeCompare(second, undefined, { numeric: true }))
  .map(([, src]) => src);

const testimonials = [
  {
    title: 'Шлагбаум PERCo в Морском порту Санкт-Петербурга',
    duration: '01:45',
    videoUrl: 'https://vk.com/video_ext.php?oid=-60562237&id=456239289&hd=2&autoplay=1',
  },
  {
    title: 'Парковочная система PERCo.Паркинг в деловом центре Sun City, Санкт-Петербург',
    duration: '01:45',
    videoUrl: 'https://vk.com/video_ext.php?oid=-60562237&id=456239330&hd=2&autoplay=1',
  },
  {
    title: 'Шлагбаумы PERCo на территории предприятия ДиКом',
    duration: '01:45',
    videoUrl: 'https://vk.com/video_ext.php?oid=-60562237&id=456239217&hd=2&autoplay=1',
  },
  {
    title: 'Шлагбаумы PERCo в музее “Россия – моя история”',
    duration: '01:45',
    videoUrl: 'https://vk.com/video_ext.php?oid=-60562237&id=456239254&hd=2&autoplay=1',
  },
  {
    title: 'Система контроля доступа PERCo-Web в бизнес-центре Capital Tower',
    duration: '01:45',
    videoUrl: 'https://vk.com/video_ext.php?oid=-60562237&id=456239358&hd=2&autoplay=1',
  },
];

export default function VideoTestimonials(): JSX.Element {
  const [startIndex, setStartIndex] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const { galleryRef } = useLightGallery({
    items: testimonials.map(({ title, videoUrl }) => ({ src: videoUrl, subHtml: title })),
    selector: 'a[data-fancybox="video-testimonials"]',
    controls: true,
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
          const image = aboutImages[index % aboutImages.length];

          return (
            <SwiperSlide key={`${videoUrl}-${index}`} className="!w-[min(415px,calc(100vw-32px))]">
              <a
                href={videoUrl}
                data-fancybox="video-testimonials"
                data-type="iframe"
                data-caption={title}
                className="group block cursor-zoom-in"
              >
                <span className="relative block aspect-[1.76] overflow-hidden rounded-2xl">
                  <img
                    src={image}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                  <VideoPlayButton />
                </span>
                <span className="mt-4 mr-6 block text-md/6 text-grey-1000">{title}</span>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="mt-10 flex justify-end gap-2" aria-label="Управление видеоотзывами">
        <SliderArrow direction="left" onClick={() => move('prev')} disabled={isAtStart} />
        <SliderArrow direction="right" onClick={() => move('next')} disabled={isAtEnd} />
      </div>
    </div>
  );
}