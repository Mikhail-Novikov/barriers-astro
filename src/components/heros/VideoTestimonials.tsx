import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useRef, useState } from 'react';
import { useLightGallery } from '@hooks/useLightGallery';
import SliderArrow from '@components/SliderArrow';
import '@splidejs/react-splide/css';

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
  const splideRef = useRef<{ splide?: { go: (index: number | string) => void } }>(null);
  const { galleryRef } = useLightGallery({
    items: testimonials.map(({ title, videoUrl }) => ({ src: videoUrl, subHtml: title })),
    selector: 'a[data-fancybox="video-testimonials"]',
    controls: true,
  });

  const move = (direction: 'prev' | 'next') => {
    const nextIndex = direction === 'next' ? startIndex + 1 : startIndex - 1;

    splideRef.current?.splide?.go(nextIndex);
  };

  const updateNavigation = (splide: { index: number; length: number; options: { perPage: number } }) => {
    setStartIndex(splide.index);
    setIsAtStart(splide.index === 0);
    setIsAtEnd(splide.index >= splide.length - splide.options.perPage);
  };

  return (
    <div ref={galleryRef}>
      <Splide
        ref={splideRef}
        aria-label="Видеоотзывы клиентов"
        options={{
          arrows: false,
          pagination: false,
          perPage: 3.2,
          perMove: 1,
          gap: 8,
          rewind: false,
          loop: false,
          breakpoints: {
            320: { perPage: 1.4  },
            1019: { perPage: 2.25  },
            1200: { perPage: 2.5 },
            1400: { perPage: 3.2 },
            1600: { perPage: 3.4 },
          },
        }}
        onMounted={updateNavigation}
        onMoved={updateNavigation}
      >
        {testimonials.map(({ title, duration, videoUrl }, index) => {
          const image = aboutImages[index % aboutImages.length];

          return (
            <SplideSlide key={title}>
              <a
                href={videoUrl}
                data-fancybox="video-testimonials"
                data-type="iframe"
                data-caption={title}
                className="group block cursor-zoom-in"
              >
                <span className="relative block aspect-[1.76] overflow-hidden rounded-3xl">
                  <img
                    src={image}
                    alt=""
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={index < 3 ? 'eager' : 'lazy'}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                    <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-grey-1000 opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
                      <span className="ml-1 block h-0 w-0 border-y-[9px] border-y-transparent border-l-[13px] border-l-grey-1000" />
                    </span>
                  </span>
                </span>
                <span className="mt-4 mr-6 block text-md/6 text-grey-1000">{title}</span>
              </a>
            </SplideSlide>
          );
        })}
      </Splide>

      <div className="mt-10 flex justify-end gap-2" aria-label="Управление видеоотзывами">
        <SliderArrow direction="left" onClick={() => move('prev')} disabled={isAtStart} />
        <SliderArrow direction="right" onClick={() => move('next')} disabled={isAtEnd} />
      </div>
    </div>
  );
}