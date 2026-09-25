import { useEffect, useMemo, useState } from 'react';
import barriers from '../../content/barriers.json';
import FilterCheckbox from '@components/FilterCheckbox';
import WidthSlider from './WidthSlider';
import { publicAsset } from '@utils/publicAsset';
import { useLightGallery } from '@hooks/useLightGallery';
import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import Modal from './Modal';
import FeedbackForm from './FeedbackForm';
import { barrierFeedback } from '@utils/barrierFeedback';

import emptySearchImage from '../../assets/img/empty-search.png';
const previewPath = publicAsset('/img/barriers/');
const barrierMainImages = import.meta.glob('../../assets/img/barriers/*/main/*.{webp,jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const TemperaturesOptions = [
  ['standard', '−40 °C'],
  ['low', '−60 °C'],
] as const;

const timeOpenOptions = [
  ['lessThan1.5', 'меньше 1,5 секунд'],
  ['3-4', '3-4 секунд'],
  ['4-6', '4–6 секунд'],
] as const;

const boomOptions = [
  ['round', 'круглая'],
  ['square', 'прямоугольная'],
  ['folding', 'складная прямоугольная'],
] as const;

const fotoElementOptions = [
  ['with', 'встроенный'],
  ['without', 'место для установки'],
] as const;

type FilterValue = string | boolean;

/** Тип свойств секции фильтрации */
type FilterSectionProps<T extends FilterValue> = {
  title: string;
  options: readonly (readonly [T, string])[];
  selected: T[];
  onToggle: (value: T) => void;
};

/**
 * Создает секцию фильтрации.
 * @param props FilterSectionProps<T>- свойства секции фильтрации
 * @return {JSX.Element} JSX-элемент секции фильтрации
 */
function FilterSection<T extends FilterValue>({
  title,
  options,
  selected,
  onToggle,
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
const createFilterSection = <T extends FilterValue>(props: FilterSectionProps<T>): JSX.Element => {
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
const matchesTemperatureFilter = (selected: string[], isLowTemp: boolean): boolean => {
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
const matchesOpeningFilter = (selected: string[], isHighSpeed: boolean, openingTime: string): boolean => {
  if (selected.length === 0) return true;

  return selected.some((opening) => {
    if (opening === 'lessThan1.5') return isHighSpeed;
    if (opening === '3-4') return openingTime.startsWith('3');
    return openingTime.startsWith('4');
  });
};

/**
 * Проверяет, соответствует ли барьер выбранным фильтрам по шлагбауму.
 * @param selected - массив выбранных фильтров по шлагбауму
 * @param boomShape - форма шлагбаума
 * @param isBoomFoldable - возможность складывать шлагбаум
 * @return {boolean} true, если барьер соответствует фильтрам, иначе false
 */
const matchesBoomFilter = (selected: string[], boomShape: string, isBoomFoldable: boolean): boolean => {
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
const matchesFotoElementFilter = (selected: string[], bodyStyle: string): boolean => {
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
  const [temperatures, setTemperatures] = useState<string[]>(['standard']);
  const [openings, setOpenings] = useState<string[]>([]);
  const [booms, setBooms] = useState<string[]>([]);
  const [fotoElements, setFotoElements] = useState<string[]>([]);
  const barrierGalleryItems = useMemo(
    () => Object.entries(barrierMainImages).map(([path, src]) => ({ src, alt: path })),
    [],
  );
  const { galleryRef } = useLightGallery({
    items: barrierGalleryItems,
    selector: 'a[data-fancybox^="barrier-"]',
    closeOnTap: true,
    counter: false,
    showFullscreen: false,
    mainClass: 'barrier-gallery',
  });

  useEffect(() => {
    const MODAL_OPEN_DELAY_MS = 500;
    const SESSION_STORAGE_KEY = 'barrier-feedback-message';
    const MODAL_TRIGGER_SELECTOR = '#open-modal-sale-barrier';
    const ORDER_BUTTON_ATTR = 'data-order-barrier';

    /**
     * Обработчик клика по кнопке "Заказать"
     * @param event - событие клика по кнопке "Заказать"
     */
    const handleOrderClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Получаем ближайшую кнопку с атрибутом data-order-barrier
      const orderButton = target.closest<HTMLButtonElement>(`[${ORDER_BUTTON_ATTR}]`);
      if (!orderButton) return;

      event.preventDefault();
      event.stopPropagation();

      // Получаем название барьера из атрибута data-order-barrier
      const barrierName = orderButton.getAttribute(ORDER_BUTTON_ATTR) ?? '';
      const message = barrierName ? `Мне нужна консультация: ${barrierName}` : '';

      // Сохраняем сообщение в переменную утилиты barrierFeedback для передачи в модальное окно
      barrierFeedback.set(message);

      // Закрываем Fancybox
      Fancybox.close();
      // и открываем модальное окно с формой обратной связи
      window.setTimeout(() => {
        document.querySelector<HTMLButtonElement>(MODAL_TRIGGER_SELECTOR)?.click();
      }, MODAL_OPEN_DELAY_MS);
    };

    // Добавляем обработчик клика по кнопке "Заказать"
    document.addEventListener('click', handleOrderClick);

    return () => {
      document.removeEventListener('click', handleOrderClick);
    };
  }, []);

  // Закрытие фильтров при изменении размера окна
  useEffect(() => {
    const handleResize = () => setIsFiltersOpen(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Фильтры
  const filterSections = [
    createFilterSection({
      title: 'Минимальная температура эксплуатации',
      options: TemperaturesOptions,
      selected: temperatures,
      onToggle: (value: string) => toggleValue(value, temperatures, setTemperatures),
    }),
    createFilterSection({
      title: 'Время открытия',
      options: timeOpenOptions,
      selected: openings,
      onToggle: (value: string) => toggleValue(value, openings, setOpenings),
    }),
    createFilterSection({
      title: 'Тип стрелы',
      options: boomOptions,
      selected: booms,
      onToggle: (value: string) => toggleValue(value, booms, setBooms),
    }),
    createFilterSection({
      title: 'Фотоэлемент',
      options: fotoElementOptions,
      selected: fotoElements,
      onToggle: (value: string) => toggleValue(value, fotoElements, setFotoElements),
    }),
  ];

  // Фильтрация
  const requiredBoomLength = getRequiredBoomLength(maxWidth);
  const filteredBarriers = useMemo(
    () => barriers.filter(
      (barrier) =>
        (requiredBoomLength === null || barrier.boomLength === requiredBoomLength) &&
        matchesTemperatureFilter(temperatures, barrier.isLowTemp) &&
        matchesOpeningFilter(openings, barrier.isHighSpeed, barrier.openingTime) &&
        matchesBoomFilter(booms, barrier.boomShape, barrier.isBoomFoldable) &&
        matchesFotoElementFilter(fotoElements, barrier.bodyStyle)
    ),
      [booms, fotoElements, openings, requiredBoomLength, temperatures]
  );

  /**
   * Сброс фильтров
   * @return {void}
   */
  const resetFilters = (): void => {
    setMaxWidth(0);
    setTemperatures([]);
    setOpenings([]);
    setBooms([]);
    setFotoElements([]);
  };

  /**
   * Количество примененных фильтров
   * @return {number} количество примененных фильтров
   */
  const appliedFiltersCount = (maxWidth > 0 ? 1 : 0)
    + temperatures.length
    + openings.length
    + booms.length
    + fotoElements.length;

  /**
   * Контент фильтров
   * @return {JSX.Element} JSX-элемент с контентом фильтров
   */
  const filtersContent = (
    <>
      <fieldset>
        <legend className="mb-5 text-md/6 font-manrope-semibold text-grey-1000">Ширина проезда</legend>
        <WidthSlider value={maxWidth} onChange={setMaxWidth} />
      </fieldset>

      {filterSections.map((section, index) => (
        <div key={`filter-section-${index}`}>
          {section}
        </div>
      ))}

      <button type="button" onClick={resetFilters} className="lg:mt-4 shrink-0 w-fit rounded-2xl border border-grey-600 px-8 py-3 text-md/6 font-manrope-semibold text-cta transition-colors hover:border-cta cursor-pointer">
        Сбросить все фильтры
      </button>
    </>
  );

  return (
    <section aria-label="Модели шлагбаумов" className="relative bg-grey-200 pt-10 sm:pt-15 3xl:pt-20 pb-10 sm:pb-20 lg:pb-20">
      <div className="container">
        <Modal
          triggerId="open-modal-sale-barrier"
          triggerClassName="hidden"
          title="Заказать шлагбаум"
        >
          <FeedbackForm idPrefix="open-modal-sale-barrier" />
        </Modal>
        <h2 id="catalog" className="h2 mb-6 lg:mb-8">Модели шлагбаумов</h2>
        <div className="perco-icons mb-4 lg:hidden">
          <button type="button" onClick={() => setIsFiltersOpen(true)} className="flex items-center gap-x-3 cursor-pointer text-cta hover:text-cta/90">
            <span className="text-5xl"><i className="perco-icon-btn-filter" /></span>
            <span className="text-md/5 font-manrope-semibold text-grey-1000 hover:text-cta/90">Фильтр ({appliedFiltersCount})</span>
          </button>
        </div>
        <div
          className={`fixed inset-0 z-50 bg-grey-1000/40 transition-opacity duration-300 lg:hidden ${isFiltersOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setIsFiltersOpen(false)}
          aria-hidden={!isFiltersOpen}
        />
        <aside className={`absolute left-0 top-42 z-50 flex w-full max-w-[390px] flex-col rounded-2xl bg-white px-4 py-6 transition-transform duration-300 ease-out sm:px-8 lg:hidden ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={(event) => event.stopPropagation()}>
          <div className="flex justify-end mb-2">
            <button type="button" aria-label="Закрыть фильтры" onClick={() => setIsFiltersOpen(false)} className="perco-icons shrink-0 cursor-pointer text-2xl/6 text-grey-800 hover:text-cta">
              <i className="perco-icon-close" />
            </button>
          </div>
          <div className="flex flex-col gap-7">
            {filtersContent}
          </div>
        </aside>
        <div className="grid grid-cols-12 items-start gap-5">
          <div className="col-span-4 xl:col-span-3 flex-col gap-2 lg:sticky lg:top-[120px] hidden lg:flex">
            <aside className="rounded-3xl bg-white px-4 2xl:px-8 py-9">
              <h3 className="mb-8 text-xl/6 font-manrope-semibold text-grey-800">Выберите условие эксплуатации</h3>

              <div className="flex flex-col gap-7">
                {filtersContent}
              </div>
            </aside>
            <p className="px-8 py-2 text-md/6 text-grey-700">Все цены указаны со&nbsp;склада в&nbsp;Москве и&nbsp;Санкт-Петербурге</p>
          </div>
          <div ref={galleryRef} className="col-span-12 lg:col-span-8 xl:col-span-9 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredBarriers.map((barrier) => {
              const folderName = barrier.imageNamePreview.replace(/-preview$/, '');
              const galleryImages = Object.entries(barrierMainImages)
                .filter(([path]) => path.includes(`/barriers/${folderName}/main/`))
                .map(([, src]) => src);
              const caption = `
                <div class="barrier-caption flex max-w-[520px] flex-col gap-2 p-4 text-left">
                  <h3 class="mb-7 text-2xl xl:text-3xl/10 text-black font-manrope-semibold">${barrier.fullName}</h3>
                  <div class="flex items-center gap-3">
                    <div class="text-2xl/8 text-cta font-manrope-bold">${barrier.price}</div>
                    <div class="text-grey-800 text-sm/normal">Цена со склада<br> в Москве и СПб</div>
                  </div>
                  <ul class="mt-7 space-y-1 list-disc pl-6 text-grey-800 marker:text-[12px] marker">
                    ${barrier.prodBenefits
                      .map((feature) => `<li class="text-md/normal">
                        ${feature}
                      </li>`)
                      .join('')}
                  </ul>
                  <button type="button" data-order-barrier="${barrier.fullName}" class="mt-8 xl:mt-20 w-full max-w-[280px] rounded-2xl bg-cta px-6 py-3 font-manrope-semibold text-white text-lg transition-colors hover:bg-cta-hover cursor-pointer">Заказать</button>
                </div>
              `;

              return (
              <article
                key={barrier.fullName}
                className="flex min-h-[340px] flex-col rounded-3xl bg-white border border-grey-400 transition-colors hover:border-cta cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => document.querySelector<HTMLAnchorElement>(`a[data-fancybox="barrier-${folderName}"]`)?.click()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    document.querySelector<HTMLAnchorElement>(`a[data-fancybox="barrier-${folderName}"]`)?.click();
                  }
                }}
              >
                <div className="flex min-h-[230px] items-center justify-center">
                  <img className="max-h-[220px] w-full object-contain" src={`${previewPath}${barrier.imageNamePreview.replace(/-preview$/, '')}/preview.webp`} alt={barrier.fullName} loading="lazy" />
                </div>
                <div className="mt-auto p-[8px_8px_20px_32px] font-manrope-semibold">
                  <h3 className="text-xl/7 text-grey-1000">{barrier.baseModel}</h3>
                  <p className="mt-1 text-md/5 text-grey-800">{barrier.tag}</p>
                  <p className="mt-4 text-xl/7 text-cta">{barrier.price}</p>
                </div>
                {galleryImages.map((src, index) => (
                  <a
                    key={src}
                    data-fancybox={`barrier-${folderName}`}
                    href={src}
                    data-caption={caption}
                    aria-label={`${barrier.fullName}, изображение ${index + 1}`}
                    className="sr-only"
                    onClick={(event) => event.stopPropagation()}
                  />
                ))}
              </article>
              );
            })}
            {filteredBarriers.length === 0 && (
              <div className="md:col-span-2 xl:col-span-3 rounded-3xl bg-white p-8 text-lg/6 text-grey-800 text-center">
                <img className="shrink-0 mx-auto mb-8" src={emptySearchImage.src} width="424" height="307" alt="не найдено"></img>
                <p>Ничего не&nbsp;найдено.<br />Уменьшите количество фильтров.</p>
              </div>
            )}
          </div>
          <p className="col-span-12 pl-3 text-md/6 text-grey-700 block lg:hidden">Все цены указаны со&nbsp;склада в&nbsp;Москве и&nbsp;Санкт-Петербурге</p>
        </div>
      </div>
    </section>
  );
}
