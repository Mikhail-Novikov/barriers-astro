import { useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { useLightGallery } from "@hooks/useLightGallery";

import SliderArrow from "@components/SliderArrow";
import Video from "@components/Video";
import PaginationDots from "@components/PaginationDots";
import { publicAsset } from "@utils/publicAsset";

import "swiper/css";

type GalleryRatio = "rectangle" | "square";
type GalleryItem = {
  srcPreview: string;
  srcFull: string;
  id: string;
  description: string;
  ratio: GalleryRatio;
  isVideo?: boolean;
  moreText?: string;
};

/** Полный набор изображений и видео, доступных в галерее установок. */
const galleryAll = ([
  {
    "srcPreview": "preview/01-01.webp",
    "srcFull": "fullsize/01-01.webp",
    "id": "1",
    "ratio": "square",
    "description": "Шлагбаумы GS04, бизнес-центр Capital Tower, Москва"
  },
  {
    "srcPreview": "preview/01-02.webp",
    "srcFull": "",
    "id": "1-video",
    "description": "Установки шлагбаумов",
    "ratio": "rectangle",
    isVideo: true,
  },
  {
    "srcPreview": "preview/01-03.webp",
    "srcFull": "fullsize/01-03.webp",
    "id": "2",
    "ratio": "square",
    "description": "Шлагбаум GS04, ЖК «Лахта», Санкт-Петербург"
  },
  {
    "srcPreview": "preview/01-04.webp",
    "srcFull": "fullsize/01-04.webp",
    "id": "3",
    "ratio": "square",
    "description": "Шлагбаум GS04, отель «Репинский курорт», Санкт-Петербург"
  },

  {
    "srcPreview": "preview/02-01.webp",
    "srcFull": "fullsize/02-01.webp",
    "id": "5",
    "ratio": "square",
    "description": "Шлагбаум GS04, гостиница «Левитанъ», Владимир"
  },
  {
    "srcPreview": "preview/02-02.webp",
    "srcFull": "fullsize/02-02.webp",
    "id": "6",
    "ratio": "rectangle",
    "description": "Шлагбаумы GS04, фитнес-клуб Opera Fitness, Тюмень"
  },
  {
    "srcPreview": "preview/02-03.webp",
    "srcFull": "fullsize/02-03.webp",
    "id": "7",
    "ratio": "square",
    "description": "Шлагбаум GS14, парковка у бизнес-центра, Санкт-Петербург"
  },
  {
    "srcPreview": "preview/02-04.webp",
    "srcFull": "fullsize/02-04.webp",
    "id": "8",
    "ratio": "square",
    "description": "Шлагбаумы GS04, Российский научно-исследовательский нейрохирургический институт им. А.Л. Поленова, Санкт-Петербург"
  },

  {
    "srcPreview": "preview/03-01.webp",
    "srcFull": "fullsize/03-01.webp",
    "id": "9",
    "ratio": "square",
    "description": "Шлагбаум GS04, ЖК «Урбанист», Санкт-Петербург"
  },
  {
    "srcPreview": "preview/03-02.webp",
    "srcFull": "fullsize/03-02.webp",
    "id": "10",
    "ratio": "rectangle",
    "description": "Шлагбаумы GS14, парковка на Сенной площади, Великий Новгород"
  },
  {
    "srcPreview": "preview/03-03.webp",
    "srcFull": "fullsize/03-03.webp",
    "id": "11",
    "ratio": "square",
    "description": "Шлагбаум GS04, аквапарк, Суздаль"
  },
  {
    "srcPreview": "preview/03-04.webp",
    "srcFull": "fullsize/03-04.webp",
    "id": "12",
    "ratio": "square",
    "description": "Шлагбаум GS04, городская усадьба Демидовых, Москва"
  },

  {
    "srcPreview": "preview/04-01.webp",
    "srcFull": "fullsize/04-01.webp",
    "id": "13",
    "ratio": "square",
    "description": "Шлагбаумы GS04 в составе парковочной системы PERCo.Паркинг, деловой центр Sun City, Красное Село"
  },
  {
    "srcPreview": "preview/04-02.webp",
    "srcFull": "fullsize/04-02.webp",
    "id": "14",
    "ratio": "rectangle",
    "description": "Шлагбаум GS04, музей-парк «Россия — Моя история», Тверь"
  },
  {
    "srcPreview": "preview/04-03.webp",
    "srcFull": "fullsize/04-03.webp",
    "id": "15",
    "ratio": "square",
    "description": "Шлагбаум GS04, завод PERCo, Псков"
  },
  {
    "srcPreview": "preview/04-04.webp",
    "srcFull": "fullsize/04-04.webp",
    "id": "16",
    "ratio": "square",
    "description": "Шлагбаум GS04, ЖК «Город солнца», Санкт-Петербург"
  },

  {
    "srcPreview": "preview/05-01.webp",
    "srcFull": "fullsize/05-01.webp",
    "id": "17",
    "ratio": "square",
    "description": "Шлагбаум GS14, парковка у офиса компании, Санкт-Петербург"
  },
  {
    "srcPreview": "preview/05-02.webp",
    "srcFull": "fullsize/05-02.webp",
    "id": "18",
    "ratio": "rectangle",
    "description": "Шлагбаумы GS04, гостиница «Кранекс», Иваново"
  },
  {
    "srcPreview": "preview/05-03.webp",
    "srcFull": "fullsize/05-03.webp",
    "id": "19",
    "ratio": "square",
    "description": "Шлагбаум GS04, жилой комплекс, Москва"
  },
  {
    "srcPreview": "preview/05-04.webp",
    "srcFull": "fullsize/05-04.webp",
    "id": "20",
    "ratio": "square",
    "description": "Шлагбаум GS04, жилой комплекс, ул. Кедрова, Москва"
  },

  {
    "srcPreview": "preview/06-01.webp",
    "srcFull": "fullsize/06-01.webp",
    "id": "21",
    "ratio": "square",
    "description": "Шлагбаум GS14, подземный паркинг компании, Санкт-Петербург"
  },
  {
    "srcPreview": "preview/06-02.webp",
    "srcFull": "fullsize/06-02.webp",
    "id": "22",
    "ratio": "rectangle",
    "description": "Шлагбаум GS14, офис компании, Санкт-Петербург"
  },
  {
    "srcPreview": "preview/06-03.webp",
    "srcFull": "fullsize/06-03.webp",
    "id": "23",
    "ratio": "square",
    "description": "Шлагбаумы GS04, база отдыха Opushka house, Санкт-Петербург"
  },
  {
    "srcPreview": "preview/06-04.webp",
    "srcFull": "fullsize/06-04.webp",
    "id": "24",
    "ratio": "square",
    "description": "Шлагбаум GS04, Сокольнический Вал, Москва"
  }
] satisfies GalleryItem[]).map((item) => ({
  ...item,
  srcPreview: item.srcPreview
    ? publicAsset(`img/gallery/${item.srcPreview}`)
    : "",
  srcFull: item.srcFull
    ? publicAsset(`img/gallery/${item.srcFull.replace(/^fullsize\//, "full/")}`)
    : "",
}));

/** CSS-классы раскладки карточек на странице галереи. */
const layoutClasses = [
  "item-gallery",
  "item-gallery",
  "item-gallery",
  "gallery-equipment__more item-gallery relative",
];

const galleryGroupSize = 4;

/** Элементы галереи с индексами, используемыми для навигации лайтбокса. */
const galleryWithIndexes = galleryAll.map((item, index) => ({
  ...item,
  index,
}));

/**
 * Дополняет число ведущим нулём для отображения счётчика галереи.
 *
 * @param value - Число для форматирования.
 * @returns Двухзначное строковое представление числа.
 */
const pad = (value: number): string => String(value).padStart(2, "0");

/**
 * Hero2 component
 *
 * Отображает галерею изображений с эффектом лайтбокса.
 */
const Hero2 = (): JSX.Element => {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const { galleryRef, openGallery, totalItems } = useLightGallery({
    items: galleryWithIndexes,
    selector: "a[data-fancybox]",
    closeOnTap: false,
    controls: false,
    mainClass: 'hero-video',
    placeFocusBack: false,
    onClose: () => {
      window.requestAnimationFrame(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        swiper.update();
      });
    },
  });
  const [groupIndex, setGroupIndex] = useState(0);
  const wasDraggedRef = useRef(false);

  const groupSize = galleryGroupSize;
  const totalGroups = Math.ceil(galleryAll.length / groupSize);
  const galleryGroups = useMemo(
    () =>
      Array.from({ length: totalGroups }, (_, index) =>
        galleryWithIndexes.slice(
          index * groupSize,
          (index + 1) * groupSize,
        ),
      ),
    [totalGroups],
  );
  const firstPreviewIndex = groupIndex * groupSize + 1;
  const goToNext = () => swiperRef.current?.slideNext();
  const goToPrev = () => swiperRef.current?.slidePrev();

  return (
    <div className="bg-grey-400 py-10 sm:p-[40px_0_60px] xl:py-15 4xl:py-20">
      <div className="container">
        <h2 className="mb-6 h2 xl:mb-8">Примеры установок</h2>
        <div ref={galleryRef}>
          <Swiper
            className="gallery-equipment"
            rewind
            slidesPerView={1}
            slidesPerGroup={1}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setGroupIndex(swiper.realIndex);
            }}
            onTouchStart={() => {
              wasDraggedRef.current = false;
            }}
            onSliderFirstMove={() => {
              wasDraggedRef.current = true;
            }}
            onRealIndexChange={(swiper) => setGroupIndex(swiper.realIndex)}
            aria-label="Примеры установок"
            style={{ touchAction: "pan-y" }}
          >
            {galleryGroups.map((items, pageIndex) => (
              <SwiperSlide key={`gallery-page-${pageIndex}`} className="gallery-equipment__slide">
                <div className="gallery-equipment__grid">
                  {items.map((item, itemIndex) => {
                    const absoluteIndex = item.index ?? pageIndex * groupSize + itemIndex;
                    const itemClassName =
                      (layoutClasses[itemIndex] ?? "item-gallery cursor-help") + " text-left";

                    if (item.isVideo) {
                      return (
                        <div key={item.id} className={itemClassName}>
                          <Video
                            containerClassName="h-full w-full"
                            className="object-cover w-full h-full"
                            src={publicAsset('/video/examples-installations/installations.mp4')}
                            poster={item.srcPreview}
                            caption={item.description}
                            muted
                            preload="auto"
                            playsInline
                            loop
                            playButtonVisibility="always"
                            inlinePlayback
                            showFullscreen={false}
                          />
                        </div>
                      );
                    }

                    return (
                      <a
                        key={item.id}
                        data-fancybox="gallery"
                        data-index={absoluteIndex}
                        data-caption={item.description}
                        data-id={item.id}
                        href={item.srcFull}
                        onClickCapture={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          if (wasDraggedRef.current) {
                            wasDraggedRef.current = false;
                            return;
                          }

                          openGallery(Number(event.currentTarget.dataset.index));
                        }}
                        className={itemClassName}
                      >
                        <img
                          className="object-cover w-full h-auto"
                          src={item.srcPreview}
                          alt={item.description}
                          data-id={item.id}
                          data-ratio={item.ratio}
                          loading="lazy"
                        />
                      </a>
                    );
                  })}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="flex items-center justify-center mt-8 sm:justify-between">
          <PaginationDots
            className="sm:hidden"
            count={totalGroups}
            activeIndex={groupIndex}
            onSelect={(index) => swiperRef.current?.slideTo(index)}
            ariaLabel="Страницы галереи установок"
            getItemLabel={(index) => `Страница ${index + 1}`}
          />
          <div className="items-center justify-between hidden sm:flex sm:w-full">
            <div className="min-w-[90px] inline-flex px-5 py-2 border rounded-full border-grey-600 text-lg/7 text-grey-800 font-manrope-semibold">
              {pad(firstPreviewIndex)}<span className="mx-[1px]">/</span>{pad(totalItems)}
            </div>
            <div className="flex items-center gap-1">
              <SliderArrow
                direction="left"
                onClick={goToPrev}
              />
              <SliderArrow
                direction="right"
                onClick={goToNext}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero2;
