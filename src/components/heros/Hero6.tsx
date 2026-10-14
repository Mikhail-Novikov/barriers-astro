import { useMemo, useState, useCallback, useRef } from 'react';
import Modal from './Modal';
import FeedbackForm from './FeedbackForm';
import WidthSlider from './WidthSlider';

import FilterCheckbox from '@components/FilterCheckbox';
import { publicAsset } from '@utils/publicAsset';
import useBarrierCatalogEffects from '@hooks/useBarrierCatalogEffects';
import useDisabledOptions, { getMaxWidthLimit } from '@hooks/useDisabledOptions';
import { useZoomModal } from '@hooks/useZoomModal';

import barriers from '@content/barriers.json';

import type {
  BoomOption,
  FotoElementOption,
  FilterSectionOption,
  FilterSectionProps,
  OpeningTimeFilterOption,
  OpeningTimeOption,
  TemperatureOption,
} from '@shared-types/barrierFilters';

import emptySearchImage from '../../assets/img/empty-search.png';
import { ZoomModal, ZoomableImage } from './ZoomModal';

const previewPath = publicAsset('/img/barriers/');
const barrierMainImages = import.meta.glob('../../assets/img/barriers/*/main/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
const barrierThumbImages = import.meta.glob('../../assets/img/barriers/*/thumb/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const normalizeBarrierImageName = (path: string): string => (path.split('/').pop() ?? path)
  .replace(/\.[^.]+$/, '')
  .replace(/-(?:prev|preview|full)$/, '')
  .replace(/p$/, '');

const TemperaturesOptions: readonly FilterSectionOption<TemperatureOption>[] = [
  ['standard', '−40 °C'],
  ['low', '−60 °C'],
] as const;

const openingTimeOptions: readonly FilterSectionOption<OpeningTimeFilterOption>[] = [
  ['lessThan1.5', 'меньше 1,5 секунд'],
  ['3-4', '3-4 секунд'],
  ['4-6', '4–6 секунд'],
] as const;

const boomOptions: readonly FilterSectionOption<BoomOption>[] = [
  ['round', 'круглая'],
  ['square', 'прямоугольная'],
  ['folding', 'складная прямоугольная'],
] as const;

const fotoElementOptions: readonly FilterSectionOption<FotoElementOption>[] = [
  ['with', 'встроенный'],
  ['without', 'место для установки'],
] as const;

/**
 * Создает секцию фильтрации.
 * @param props FilterSectionProps<T>- свойства секции фильтрации
 * @return {JSX.Element} JSX-элемент секции фильтрации
 */
function FilterSection<T extends string>({
  title,
  options,
  selected,
  onToggle,
  disabledValues,
}: FilterSectionProps<T>): JSX.Element {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 text-md/6 font-manrope-semibold text-grey-1000">{title}</legend>
      {options.map(([value, label], index) => (
        <FilterCheckbox
          key={`${value}-${index}`}
          checked={selected.includes(value)}
          label={label}
          onChange={() => onToggle(value)}
          disabled={disabledValues?.has(value) ?? false}
        />
      ))}
    </fieldset>
  );
}

/**
 * Переключает значение в массиве.
 * @param value - значение, которое нужно переключить
 * @param values - массив значений
 * @param setValues - функция для установки нового массива значений
 * @return {void}
 */
const toggleValue = <T,>(value: T, values: T[], setValues: (values: T[]) => void): void => {
  setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
};

/**
 * Создает секцию фильтрации.
 * @param props FilterSectionProps<T>- свойства секции фильтрации
 * @return {JSX.Element} JSX-элемент секции фильтрации
 */
const createFilterSection = <T extends string>(props: FilterSectionProps<T>): JSX.Element => {
  return <FilterSection {...props} />;
}

/**
 * Возвращает длину барьера в зависимости от ширины дороги.
 * @param roadWidth - ширина дороги
 * @return {string} длина барьера
 */
const getRequiredBoomLength = (roadWidth: number): string | null => {
  if (roadWidth === 0) return null;
  if (roadWidth <= 3) return '3';
  if (roadWidth <= 4) return '4.3';
  return '6.3';
};

/**
 * Проверяет, соответствует ли барьер выбранным фильтрам по температуре.
 * @param selected - массив выбранных фильтров по температуре
 * @param isLowTemp - признак низкой температуры
 * @return {boolean} true, если барьер соответствует фильтрам, иначе false
 */
const matchesTemperatureFilter = (selected: TemperatureOption[], isLowTemp: boolean): boolean => {
  const hasStandard = selected.includes('standard');
  const hasLow = selected.includes('low');

  if (hasStandard === hasLow) return true;
  return hasLow === isLowTemp;
};

/**
 * Проверяет, соответствует ли барьер выбранным фильтрам по времени открытия.
 * @param selected - массив выбранных фильтров по времени открытия
 * @param isHighSpeed - признак высокой скорости
 * @param openingTime - время открытия
 * @return {boolean} true, если барьер соответствует фильтрам, иначе false
 */
const matchesOpeningTimeFilter = (
  selected: OpeningTimeFilterOption[],
  isHighSpeed: boolean,
  openingTime: OpeningTimeOption,
): boolean => {
  if (selected.length === 0) return true;

  return selected.some((opening) => {
    if (opening === 'lessThan1.5') return isHighSpeed;
    if (isHighSpeed) return false;

    const [filterMin, filterMax] = opening === '3-4' ? [3, 4] : [4, 6];

    return openingTime.to > filterMin && openingTime.from < filterMax;
  });
};

/**
 * Проверяет, соответствует ли барьер складываемому шлагбауму.
 * @param selected - массив выбранных фильтров по шлагбауму
 * @param boomShape - форма шлагбаума
 * @param isBoomFoldable - возможность складывать шлагбаум
 * @return {boolean} true, если барьер соответствует фильтрам, иначе false
 */
const matchesBoomFilter = (selected: BoomOption[], boomShape: string, isBoomFoldable: boolean): boolean => {
  if (selected.length === 0) return true;

  return selected.some((boom) => {
    if (boom === 'folding') return isBoomFoldable;
    return boom === boomShape;
  });
};

/**
 * Проверяет, соответствует ли барьер выбранным фильтрам по фотоэлементу.
 * @param selected - массив выбранных фильтров по фотоэлементу
 * @param bodyStyle - стиль корпуса барьера
 * @return {boolean} true, если барьер соответствует фильтрам, иначе false
 */
const matchesFotoElementFilter = (selected: FotoElementOption[], bodyStyle: string): boolean => {
  if (selected.length === 0) return true;

  return selected.some((fotoElement) => {
    if (fotoElement === 'with') return bodyStyle === 'premium';
    return bodyStyle === 'standard';
  });
};

/**
 * Компонент Hero6 отображает каталог моделей шлагбаумов с возможностью фильтрации.
 * @return {JSX.Element} JSX-элемент, представляющий каталог моделей шлагбаумов
 */
export default function Hero6(): JSX.Element {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [temperatures, setTemperatures] = useState<TemperatureOption[]>([]);
  const [openingTimes, setOpeningTimes] = useState<OpeningTimeFilterOption[]>([]);
  const [booms, setBooms] = useState<BoomOption[]>([]);
  const [fotoElement, setFotoElement] = useState<FotoElementOption[]>([]);
  // получаем отключенные опции для фильтров на основе текущих выбранных значений
  const disabledOptions = useDisabledOptions({ maxWidth, temperatures, openingTimes, booms, fotoElement });
  const maxWidthLimit = getMaxWidthLimit(disabledOptions.get('maxWidth'));

  const galleryRef = useRef<HTMLDivElement>(null);

  useBarrierCatalogEffects({
    selectedMaxWidth: maxWidth,
    maxWidthLimit,
    temperatures,
    openingTimes,
    booms,
    fotoElement,
    galleryRef,
    setMaxWidth,
    setTemperatures,
    setOpeningTimes,
    setBooms,
    setFotoElement,
    setIsFiltersOpen,
  });

  // Фильтры
  const filterSections = [
    createFilterSection({
      title: 'Минимальная температура эксплуатации',
      options: TemperaturesOptions,
      selected: temperatures,
      onToggle: (value: TemperatureOption) => toggleValue(value, temperatures, setTemperatures),
      disabledValues: disabledOptions.get('temperatures'),
    }),
    createFilterSection({
      title: 'Время открытия',
      options: openingTimeOptions,
      selected: openingTimes,
      onToggle: (value: OpeningTimeFilterOption) => toggleValue(value, openingTimes, setOpeningTimes),
      disabledValues: disabledOptions.get('openingTimes'),
    }),
    createFilterSection({
      title: 'Тип стрелы',
      options: boomOptions,
      selected: booms,
      onToggle: (value: BoomOption) => toggleValue(value, booms, setBooms),
      disabledValues: disabledOptions.get('booms'),
    }),
    createFilterSection({
      title: 'Фотоэлемент',
      options: fotoElementOptions,
      selected: fotoElement,
      disabledValues: disabledOptions.get('fotoElement'),
      onToggle: (value: FotoElementOption) => toggleValue(value, fotoElement, setFotoElement),
    }),
  ];

  // Фильтрация
  const requiredBoomLength = getRequiredBoomLength(maxWidth);
  const filteredBarriers = useMemo(
    () => barriers.filter(
      (barrier) =>
        (requiredBoomLength === null || barrier.boomLength === requiredBoomLength) &&
        matchesTemperatureFilter(temperatures, barrier.isLowTemp) &&
        matchesOpeningTimeFilter(openingTimes, barrier.isHighSpeed, barrier.openingTime) &&
        matchesBoomFilter(booms, barrier.boomShape, barrier.isBoomFoldable) &&
        matchesFotoElementFilter(fotoElement, barrier.bodyStyle)
    ),
      [booms, fotoElement, openingTimes, requiredBoomLength, temperatures]
  );

  /**
   * Сброс фильтров
   * @return {void}
   */
  const resetFilters = (): void => {
    setMaxWidth(0);
    setTemperatures([]);
    setOpeningTimes([]);
    setBooms([]);
    setFotoElement([]);
  };

  /**
   * Количество примененных фильтров
   * @return {number} количество примененных фильтров
   */
  const appliedFiltersCount = (maxWidth > 0 ? 1 : 0)
    + temperatures.length
    + openingTimes.length
    + booms.length
    + fotoElement.length;

  /**
   * Контент фильтров
   * @return {JSX.Element} JSX-элемент с контентом фильтров
   */
  const filtersContent = (
    <>
      <fieldset>
        <legend className="mb-5 text-md/6 font-manrope-semibold text-grey-1000">Ширина проезда</legend>
        <WidthSlider value={maxWidth} max={maxWidthLimit} onChange={setMaxWidth} />
      </fieldset>

      {filterSections.map((section, index) => (
        <div key={`filter-section-${index}`}>
          {section}
        </div>
      ))}

      <button type="button" onClick={resetFilters} className="px-8 py-3 transition-colors border cursor-pointer lg:mt-4 shrink-0 w-fit rounded-2xl border-grey-600 text-md/6 font-manrope-semibold text-cta hover:border-cta">
        Сбросить все фильтры
      </button>
    </>
  );

  const {
    activeImage,
    isOpen,
    open: handleOpen,
    selectImage: handleSelectImage,
    close: handleClose,
    thumbnailsRef,
    thumbnailNavigation,
    updateThumbnailNavigation,
    scrollThumbnails,
  } = useZoomModal<(typeof barriers)[number]>();

  return (
    <section
      id="catalog"
      aria-label="Модели шлагбаумов"
      className="relative pt-10 pb-10 bg-grey-200 sm:pt-15 3xl:pt-20 sm:pb-20 lg:pb-20"
    >
      <div className="container">
        <Modal
          triggerId="open-modal-sale-barrier"
          triggerClassName="hidden"
          title="Заказать шлагбаум"
        >
          <FeedbackForm idPrefix="open-modal-sale-barrier" />
        </Modal>
        <ZoomModal
          isOpen={isOpen}
          onClose={handleClose}
          contentClassName="w-full max-w-[1600px] h-full lg:h-[900px] overflow-y-auto bg-white sm:rounded-2xl"
        >
          {activeImage && (
            <div className="flex flex-col items-center lg:flex-row h-full px-4 sm:px-8 lg:px-[66px]">
              <div className="flex flex-col min-w-0 min-h-0 bg-white lg:flex-1 lg:pt-20">
                <ZoomableImage
                  src={activeImage.src}
                  alt={activeImage.barrier.fullName}
                  className="w-full max-w-[800px] sm:h-[500px] bg-white mt-15 md:mt-0"
                  imgClassName="max-w-full"
                />
                {activeImage.images.length > 0 && (
                  <div className="flex shrink-0 items-center gap-2 py-3 sm:pt-4 lg:pl-10">
                    {thumbnailNavigation.hasOverflow && (
                      <button
                        type="button"
                        aria-label="Прокрутить миниатюры влево"
                        disabled={!thumbnailNavigation.canScrollLeft}
                        onClick={() => scrollThumbnails(-1)}
                        className="flex items-center justify-center transition-colors rounded-full perco-icons size-8 shrink-0 bg-grey-300 text-grey-800 hover:bg-grey-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span
                          className="perco-icon-arrow-left-small"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                    <div
                      ref={thumbnailsRef}
                      onScroll={updateThumbnailNavigation}
                      className="relative flex min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-x-4"
                    >
                      {activeImage.images.map((image, index) => (
                        <button
                          key={image.src}
                          type="button"
                          aria-label={`Показать изображение ${index + 1}`}
                          aria-pressed={activeImage.src === image.src}
                          onClick={() => handleSelectImage(image.src)}
                          className={`size-[76px] p-2 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-colors ${activeImage.src === image.src ? "border-black" : "border-transparent hover:border-grey-500"}`}
                        >
                          <img
                            src={image.thumb}
                            alt=""
                            className="object-contain w-full h-full"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                    {thumbnailNavigation.hasOverflow && (
                      <button
                        type="button"
                        aria-label="Прокрутить миниатюры вправо"
                        disabled={!thumbnailNavigation.canScrollRight}
                        onClick={() => scrollThumbnails(1)}
                        className="flex items-center justify-center transition-colors rounded-full perco-icons size-8 shrink-0 bg-grey-300 text-grey-800 hover:bg-grey-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span
                          className="rotate-180 perco-icon-arrow-left-small"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <aside className="flex-1 overflow-y-auto pt-4 pb-10 sm:pt-8 lg:pt-15 lg:max-h-full md:max-w-[470px] bg-white text-left text-grey-1000 flex flex-col">
                <h3 className="mb-4 text-2xl text-black md:mb-7 xl:text-3xl/10 font-manrope-semibold">
                  {activeImage.barrier.fullName}
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-2xl/8 text-cta font-manrope-bold">
                    {activeImage.barrier.price}
                  </div>
                  <div className="text-grey-800 text-sm/normal">
                    Цена со склада
                    <br /> в Москве и СПб
                  </div>
                </div>
                <ul className="pl-0 mt-4 mb-8 space-y-2 sm:mb-0 perco-icons md:mt-7">
                  {activeImage.barrier.prodBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-x-2 text-md/6"
                    >
                      <i
                        className="mt-1 perco-icon-check-tag text-cta"
                        aria-hidden="true"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-order-barrier={activeImage.barrier.fullName}
                  onClick={handleClose}
                  className="w-full md:max-w-[280px] rounded-2xl bg-cta px-6 py-3 text-lg font-manrope-semibold text-white transition-colors hover:bg-cta-hover cursor-pointer mt-auto md:mt-20"
                >
                  Заказать
                </button>
              </aside>
            </div>
          )}
        </ZoomModal>
        <h2 className="mb-6 h2 lg:mb-8">Модели шлагбаумов</h2>
        <div className="mb-4 perco-icons lg:hidden">
          <button
            type="button"
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center cursor-pointer gap-x-3 text-cta hover:text-cta/90"
          >
            <span className="text-5xl">
              <i className="perco-icon-btn-filter" />
            </span>
            <span className="text-md/5 font-manrope-semibold text-grey-1000 hover:text-cta/90">
              Фильтр ({appliedFiltersCount})
            </span>
          </button>
        </div>
        <div
          className={`fixed inset-0 z-50 bg-grey-1000/40 transition-opacity duration-300 lg:hidden ${isFiltersOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
          onClick={() => setIsFiltersOpen(false)}
          aria-hidden={!isFiltersOpen}
        />
        <aside
          className={`absolute left-0 top-42 z-50 flex w-full max-w-[390px] flex-col rounded-2xl bg-white px-4 py-6 transition-transform duration-300 ease-out sm:px-8 lg:hidden ${isFiltersOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex justify-end mb-2">
            <button
              type="button"
              aria-label="Закрыть фильтры"
              onClick={() => setIsFiltersOpen(false)}
              className="cursor-pointer perco-icons shrink-0 text-2xl/6 text-grey-800 hover:text-cta"
            >
              <i className="perco-icon-close" />
            </button>
          </div>
          <div className="flex flex-col gap-7">{filtersContent}</div>
        </aside>
        <div className="grid items-start grid-cols-12 gap-5">
          <div className="col-span-4 xl:col-span-3 flex-col gap-2 lg:sticky lg:top-[120px] hidden lg:flex">
            <aside className="px-4 bg-white rounded-3xl 2xl:px-8 py-9">
              <h3 className="mb-8 text-xl/6 font-manrope-semibold text-grey-800">
                Выберите условие эксплуатации
              </h3>

              <div className="flex flex-col gap-7">{filtersContent}</div>
            </aside>
            <p className="px-8 py-2 text-md/6 text-grey-900">
              Все цены указаны со&nbsp;склада в&nbsp;Москве
              и&nbsp;Санкт-Петербурге
            </p>
          </div>
          <div
            ref={galleryRef}
            style={{ overflowAnchor: "none" }}
            className="grid grid-cols-1 col-span-12 gap-5 lg:col-span-8 xl:col-span-9 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredBarriers.map((barrier) => {
              const folderName = barrier.imageNamePreview.replace(
                /-preview$/,
                "",
              );
              const galleryImages = Object.entries(barrierMainImages)
                .filter(([path]) =>
                  path.includes(`/barriers/${folderName}/main/`),
                )
                .map(([path, src]) => ({
                  src,
                  key: normalizeBarrierImageName(path),
                }));
              const thumbnails = Object.entries(barrierThumbImages)
                .filter(([path]) =>
                  path.includes(`/barriers/${folderName}/thumb/`),
                )
                .map(([path, thumb]) => ({
                  thumb,
                  key: normalizeBarrierImageName(path),
                }))
                .sort((first, second) =>
                  first.key.localeCompare(second.key, undefined, {
                    numeric: true,
                  }),
                );
              const barrierImages = thumbnails
                .map(({ key, thumb }) => {
                  const image = galleryImages.find((item) => item.key === key);
                  return image ? { src: image.src, thumb } : null;
                })
                .filter(
                  (image): image is { src: string; thumb: string } =>
                    image !== null,
                );
              const images =
                barrierImages.length > 0
                  ? barrierImages
                  : galleryImages.map(({ src }) => ({ src, thumb: src }));
              const initialImage =
                images[0]?.src ?? `${previewPath}${folderName}/preview.webp`;
              return (
                <article
                  key={barrier.fullName}
                  className="flex min-h-[340px] flex-col rounded-3xl bg-white border border-grey-400 transition-colors hover:border-cta cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpen(initialImage, barrier, images)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpen(initialImage, barrier, images);
                    }
                  }}
                >
                  <div className="flex min-h-[230px] items-center justify-center">
                    <img
                      className="max-h-[220px] w-full object-contain"
                      src={`${previewPath}${barrier.imageNamePreview.replace(/-preview$/, "")}/preview.webp`}
                      alt={barrier.fullName}
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-auto p-[8px_8px_20px_32px] font-manrope-semibold">
                    <h3 className="text-xl/7 text-grey-1000">
                      {barrier.baseModel}
                    </h3>
                    <p className="mt-1 text-md/5 text-grey-800">
                      {barrier.tag}
                    </p>
                    <p className="mt-4 text-xl/7 text-cta">{barrier.price}</p>
                  </div>
                </article>
              );
            })}
            {filteredBarriers.length === 0 && (
              <div className="p-8 text-center bg-white md:col-span-2 xl:col-span-3 rounded-3xl text-lg/6 text-grey-800">
                <img
                  className="mx-auto mb-8 shrink-0"
                  src={emptySearchImage.src}
                  width="424"
                  height="307"
                  alt="не найдено"
                ></img>
                <p>
                  Ничего не&nbsp;найдено.
                  <br />
                  Уменьшите количество фильтров.
                </p>
              </div>
            )}
          </div>
          <p className="block col-span-12 pl-3 text-md/6 text-grey-900 lg:hidden">
            Все цены указаны со&nbsp;склада в&nbsp;Москве
            и&nbsp;Санкт-Петербурге
          </p>
        </div>
      </div>
    </section>
  );
}
