import { useMemo, useState } from "react";
import { useLightGallery } from "@hooks/useLightGallery";
import { useSwipe } from "@hooks/useSwipe";

import SliderArrow from "@components/SliderArrow";
import Video from "@components/Video";
import PaginationDots from "@components/PaginationDots";
import { publicAsset } from "@utils/publicAsset";

/** Полный набор изображений и видео, доступных в галерее установок. */
const galleryAll = [
  {
    thumb: "/img/gallery/preview/04-03.webp",
    src: "/img/gallery/full/04-03.webp",
    alt: "Шлагбаумы GS04, бизнес-центр Capital Tower, Москва",
  },
  {
    thumb: "",
    src: "",
    alt: "Установки шлагбаумов",
    isVideo: true,
  },
  {
    thumb: "/img/gallery/preview/03-02.webp",
    src: "/img/gallery/full/03-02.webp",
    alt: "Шлагбаум GS04, отель «Репинский курорт», Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/02-01.webp",
    src: "/img/gallery/full/02-01.webp",
    alt: "Шлагбаум GS04, ЖК «Урбанист», Мурино, Ленинградская область",
  },
  // дополнительные изображения для лайтбокса (не показаны на первой странице)
  {
    thumb: "/img/gallery/preview/01-02.webp",
    src: "/img/gallery/full/01-02.webp",
    alt: "Шлагбаумы GS04, фитнес-клуб Opera Fitness, Тюмень",
  },
  {
    thumb: "/img/gallery/preview/01-04.webp",
    src: "/img/gallery/full/01-04.webp",
    alt: "Шлагбаумы GS04, Российский научно-исследовательский нейрохирургический институт им. А.Л. Поленова, Санкт-Петербург",
    moreText: "еще 4 фото",
  },
  {
    thumb: "/img/gallery/preview/02-02.webp",
    src: "/img/gallery/full/02-02.webp",
    alt: "Шлагбаумы GS14, парковка на Сенной площади, Великий Новгород",
  },
  {
    thumb: "/img/gallery/preview/02-03.webp",
    src: "/img/gallery/full/02-03.webp",
    alt: "Шлагбаум GS04, аквапарк, Суздаль",
  },
  {
    thumb: "/img/gallery/preview/02-04.webp",
    src: "/img/gallery/full/02-04.webp",
    alt: "Шлагбаум GS04, городская усадьба Демидовых, Москва",
  },
  {
    thumb: "/img/gallery/preview/03-01.webp",
    src: "/img/gallery/full/03-01.webp",
    alt: "Шлагбаумы GS04 в составе парковочной системы PERCo.Паркинг, деловой центр Sun City, Красное Село",
  },
  {
    thumb: "/img/gallery/preview/01-03.webp",
    src: "/img/gallery/full/01-03.webp",
    alt: "Шлагбаум GS04, ЖК «Лахта», Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/03-03.webp",
    src: "/img/gallery/full/03-03.webp",
    alt: "Шлагбаум GS04, завод PERCo, Псков",
  },
  {
    thumb: "/img/gallery/preview/03-04.webp",
    src: "/img/gallery/full/03-04.webp",
    alt: "Шлагбаум GS04, ЖК «Город солнца», Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/04-01.webp",
    src: "/img/gallery/full/04-01.webp",
    alt: "Шлагбаум GS14, парковка у офиса компании, Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/04-02.webp",
    src: "/img/gallery/full/04-02.webp",
    alt: "Шлагбаум GS04, жилой комплекс, Москва",
  },
  {
    thumb: "/img/gallery/preview/01-01.webp",
    src: "/img/gallery/full/01-01.webp",
    alt: "Шлагбаум GS04, гостиница «Левитанъ», Владимир",
  },
  {
    thumb: "/img/gallery/preview/04-04.webp",
    src: "/img/gallery/full/04-04.webp",
    alt: "Шлагбаум GS04, музей-парк «Россия — Моя история», Тверь",
  },
  {
    thumb: "/img/gallery/preview/05-01.webp",
    src: "/img/gallery/full/05-01.webp",
    alt: "Шлагбаум GS14, подземный паркинг компании, Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/05-02.webp",
    src: "/img/gallery/full/05-02.webp",
    alt: "Шлагбаум GS14, офис компании, Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/05-03.webp",
    src: "/img/gallery/full/05-03.webp",
    alt: "Шлагбаумы GS04, база отдыха Opushka house, Ленинградская область",
  },
  {
    thumb: "/img/gallery/preview/05-04.webp",
    src: "/img/gallery/full/05-04.webp",
    alt: "Шлагбаум GS04, Сокольнический Вал, Москва",
  },
  {
    thumb: "/img/gallery/preview/06-01.webp",
    src: "/img/gallery/full/06-01.webp",
    alt: "Шлагбаумы GF13 в составе парковочной системы PERCo.Паркинг, Многофункциональный миграционный центр, Сахарово, Москва",
  },
  {
    thumb: "/img/gallery/preview/06-02.webp",
    src: "/img/gallery/full/06-02.webp",
    alt: "Шлагбаумы GS04, гостиница «Кранекс», Иваново",
  },
  {
    thumb: "/img/gallery/preview/06-03.webp",
    src: "/img/gallery/full/06-03.webp",
    alt: "Шлагбаум GS14, парковка у бизнес-центра, Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/06-04.webp",
    src: "/img/gallery/full/06-04.webp",
    alt: "Шлагбаум GS04, жилой комплекс, ул. Кедрова, Москва",
  },
].map((item) => ({
  ...item,
  thumb: publicAsset(item.thumb),
  src: publicAsset(item.src),
}));

/** CSS-классы раскладки карточек на первой странице галереи. */
const layoutClasses = [
  "item-gallery",
  "item-gallery",
  "item-gallery",
  "gallery-equipment__more item-gallery relative",
];

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
  /**
   * Возвращает URL миниатюры, используя URL основного изображения как запасной вариант.
   *
   * @param item - Элемент галереи с необязательными URL миниатюры и изображения.
   * @returns URL для превью либо пустую строку.
   */
  const getPreviewSrc = (item: { thumb?: string; src?: string }): string =>
    item.thumb ?? item.src ?? "";
  const { galleryRef, openGallery, totalItems } = useLightGallery({
    items: galleryWithIndexes,
    selector: "a[data-fancybox]",
    closeOnTap: false,
    controls: false,
    captionClassName: "inline-block md:mx-10 md:text-2xl text-white text-center",
    mainClass: 'hero-video',
  });
  const [groupIndex, setGroupIndex] = useState(0);

  // Сколько элементов следует отображать в сетке главной страницы
  const visibleCount = 4;
  const groupSize = 4;
  const totalGroups = Math.ceil(galleryAll.length / groupSize);
  const previewItems = useMemo(
    () =>
      galleryWithIndexes.slice(
        groupIndex * groupSize,
        (groupIndex + 1) * groupSize,
      ),
    [groupIndex],
  );
  const hiddenItems = useMemo(
    () => galleryWithIndexes.slice((groupIndex + 1) * groupSize),
    [groupIndex],
  );
  const firstPreviewIndex = (previewItems[0]?.index ?? 0) + 1;

  /** 
   * Хендлер навигации по галерее - вперед
   * Переключает галерею на следующую группу карточек, не выходя за конец. 
   * returns void
  */
  const goToNext = () =>
    setGroupIndex((prev) => Math.min(prev + 1, totalGroups - 1));

  /** 
   * Хендлер навигации по галерее - назад
   * Переключает галерею на предыдущую группу карточек, не выходя за начало. 
   * returns void
  */
  const goToPrev = () => setGroupIndex((prev) => Math.max(prev - 1, 0));
  const swipeHandlers = useSwipe<HTMLDivElement>({
    onSwipe: (direction) => {
      if (direction === "next") goToNext();
      else goToPrev();
    },
    preventClickAfterSwipe: true,
  });

  return (
    <div className="bg-grey-400 py-10 sm:p-[40px_0_60px] xl:py-15 4xl:py-20">
      <div className="container">
        <h2 className="mb-6 h2 xl:mb-8">Примеры установок</h2>
        <div
          ref={galleryRef}
          className="gallery-equipment"
          style={{ touchAction: "pan-y" }}
          {...swipeHandlers}
        >
          {previewItems.map((item, i) => {
            const absoluteIndex = item.index ?? groupIndex * groupSize + i;
            const itemClassName =
              (layoutClasses[i] ?? "item-gallery cursor-help") + " text-left";

            if (item.isVideo) {
              return (
                <div key={absoluteIndex} className={itemClassName}>
                  <Video
                    containerClassName="h-full w-full"
                    className="object-cover w-full h-full"
                    src={publicAsset('/video/examples-installations/installations.mp4')}
                    poster={publicAsset('/img/examples-installations/preview.webp')}
                    caption={item.alt}
                    muted
                    preload="auto"
                    playsInline
                    loop
                    playButtonVisibility="always"
                  />
                </div>
              );
            }

            return (
              <a
                key={absoluteIndex}
                data-fancybox="gallery"
                data-index={absoluteIndex}
                data-caption={item.alt}
                href={item.src}
                onClick={(event) => {
                  event.preventDefault();
                  openGallery(absoluteIndex);
                }}
                className={itemClassName}
              >
                <img
                  className="object-cover w-full h-auto"
                  src={getPreviewSrc(item)}
                  alt={item.alt}
                  loading="lazy"
                />
              </a>
            );
          })}

          {/* Скрытые для остальных изображений галереи */}
          {hiddenItems.map((item, i) => (
            <a
              key={`hidden-${item.index ?? i}`}
              data-fancybox="gallery"
              data-index={item.index ?? visibleCount + i}
              data-caption={item.alt}
              href={item.src}
              onClick={(event) => {
                event.preventDefault();
                openGallery(item.index ?? visibleCount + i);
              }}
              className="hidden"
            >
              <img src={item.src} alt={item.alt} loading="lazy" />
            </a>
          ))}
        </div>
        <div className="flex items-center justify-center mt-8 sm:justify-between">
          <PaginationDots
            className="sm:hidden"
            count={totalGroups}
            activeIndex={groupIndex}
            onSelect={setGroupIndex}
            ariaLabel="Страницы галереи установок"
            getItemLabel={(index) => `Страница ${index + 1}`}
          />
          <div className="items-center justify-between hidden sm:flex sm:w-full">
            <div className="min-w-[90px] h-10 p-2 text-grey-800 border border-grey-600 rounded-full text-lg/tight text-center">
              {pad(firstPreviewIndex)}<span className="mx-[1px]">/</span>{pad(totalItems)}
            </div>
            <div className="flex items-center gap-1">
              <SliderArrow
                direction="left"
                onClick={goToPrev}
                disabled={groupIndex === 0}
              />
              <SliderArrow
                direction="right"
                onClick={goToNext}
                disabled={groupIndex === totalGroups - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero2;
