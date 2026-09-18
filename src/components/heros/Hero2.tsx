import { useMemo, useState } from "react";
import { useLightGallery } from "@hooks/useLightGallery";

import SliderArrow from "@components/SliderArrow";
import { publicAsset } from "@utils/publicAsset";

// Полный набор изображений из папки public/img/gallery
const galleryAll = [
  {
    thumb: "/img/gallery/preview/01-01.webp",
    src: "/img/gallery/full/01-01.webp",
    alt: "Шлагбаум GS04, гостиница «Левитанъ», Владимир",
  },
  {
    thumb: "/img/gallery/preview/01-02.webp",
    src: "/img/gallery/full/01-02.webp",
    alt: "Шлагбаумы GS04, фитнес-клуб Opera Fitness, Тюмень",
  },
  {
    thumb: "/img/gallery/preview/01-03.webp",
    src: "/img/gallery/full/01-03.webp",
    alt: "Шлагбаум GS04, ЖК «Лахта», Санкт-Петербург",
  },
  {
    thumb: "/img/gallery/preview/01-04.webp",
    src: "/img/gallery/full/01-04.webp",
    alt: "Шлагбаумы GS04, Российский научно-исследовательский нейрохирургический институт им. А.Л. Поленова, Санкт-Петербург",
    moreText: "еще 4 фото",
  },
  // дополнительные изображения для лайтбокса (не показаны на первой странице)
  {
    thumb: "/img/gallery/preview/02-01.webp",
    src: "/img/gallery/full/02-01.webp",
    alt: "Шлагбаум GS04, ЖК «Урбанист», Санкт-Петербург",
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
    thumb: "/img/gallery/preview/03-02.webp",
    src: "/img/gallery/full/03-02.webp",
    alt: "Шлагбаум GS04, отель «Репинский курорт», Санкт-Петербург",
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
    thumb: "/img/gallery/preview/04-03.webp",
    src: "/img/gallery/full/04-03.webp",
    alt: "Шлагбаумы GS04, бизнес-центр Capital Tower, Москва",
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
    alt: "Шлагбаумы GS04, база отдыха Opushka house, Санкт-Петербург",
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

// Классы макета для каждой карточки grid сетки
const layoutClasses = [
  "item-gallery",
  "item-gallery",
  "item-gallery",
  "gallery-equipment__more item-gallery relative",
];

const galleryWithIndexes = galleryAll.map((item, index) => ({
  ...item,
  index,
}));

/**
 * Hero2 component
 *
 * Отображает галерею изображений с эффектом лайтбокса.
 */
const Hero2 = () => {
  const getPreviewSrc = (item: { thumb?: string; src?: string }) =>
    item.thumb ?? item.src ?? "";
  const { galleryRef, openGallery, totalItems } = useLightGallery({
    items: galleryWithIndexes,
    selector: "a[data-fancybox]",
    closeOnTap: false,
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

  const goToNext = () => setGroupIndex((prev) => (prev + 1) % totalGroups);
  const goToPrev = () =>
    setGroupIndex((prev) => (prev - 1 + totalGroups) % totalGroups);

  return (
    <div className="bg-grey-400 py-10 sm:py-15 lg:py-18 xl:pb-20 xl:pt-20">
      <div className="container">
        <h2 className="h2 mb-8">Примеры установок</h2>
        <div
          ref={galleryRef}
          className="gallery-equipment rounded-5xl"
        >
          {previewItems.map((item, i) => {
            const absoluteIndex = item.index ?? groupIndex * groupSize + i;

            return (
              <a
                key={absoluteIndex}
                data-fancybox="gallery"
                data-index={absoluteIndex}
                href={item.src}
                onClick={(event) => {
                  event.preventDefault();
                  openGallery(absoluteIndex);
                }}
                className={
                  (layoutClasses[i] ?? "item-gallery cursor-help") +
                  " text-left"
                }
              >
                <img
                  className="w-full h-auto object-cover"
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
        <div className="mt-8 flex justify-between items-center">
          <div className="min-w-[90px] h-10 p-2 text-grey-800 border border-grey-500 rounded-full text-center">
            {firstPreviewIndex}/{totalItems}
          </div>
          <div className="flex gap-2">
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
  );
};

export default Hero2;
