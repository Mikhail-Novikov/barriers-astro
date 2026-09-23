import { useEffect, useMemo, useState } from 'react';
import barriers from '../../content/barriers.json';
import FilterCheckbox from '@components/FilterCheckbox';
import WidthSlider from './WidthSlider';
import { publicAsset } from '@utils/publicAsset';

const previewPath = publicAsset('/img/barriers/preview/');

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

type FilterSectionProps<T extends FilterValue> = {
  title: string;
  options: readonly (readonly [T, string])[];
  selected: T[];
  onToggle: (value: T) => void;
};

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

function toggleValue<T>(value: T, values: T[], setValues: (values: T[]) => void) {
  setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
}

function createFilterSection<T extends FilterValue>(props: FilterSectionProps<T>): JSX.Element {
  return <FilterSection {...props} />;
}

const getRequiredBoomLength = (roadWidth: number): string | null => {
  if (roadWidth === 0) return null;
  if (roadWidth <= 3) return '3';
  if (roadWidth <= 4) return '4.3';
  return '6.3';
};

const matchesTemperatureFilter = (selected: string[], isLowTemp: boolean): boolean => {
  const hasStandard = selected.includes('standard');
  const hasLow = selected.includes('low');

  if (hasStandard === hasLow) return true;
  return hasLow === isLowTemp;
};

const matchesOpeningFilter = (selected: string[], isHighSpeed: boolean, openingTime: string): boolean => {
  if (selected.length === 0) return true;

  return selected.some((opening) => {
    if (opening === 'lessThan1.5') return isHighSpeed;
    if (opening === '3-4') return openingTime.startsWith('3');
    return openingTime.startsWith('4');
  });
};

const matchesBoomFilter = (selected: string[], boomShape: string, isBoomFoldable: boolean): boolean => {
  if (selected.length === 0) return true;

  return selected.some((boom) => {
    if (boom === 'folding') return isBoomFoldable;
    return boom === boomShape;
  });
};

const matchesFotoElementFilter = (selected: string[], bodyStyle: string): boolean => {
  if (selected.length === 0) return true;

  return selected.some((fotoElement) => {
    if (fotoElement === 'with') return bodyStyle === 'premium';
    return bodyStyle === 'standard';
  });
};

export default function Hero6(): JSX.Element {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);
  const [temperatures, setTemperatures] = useState<string[]>(['standard']);
  const [openings, setOpenings] = useState<string[]>([]);
  const [booms, setBooms] = useState<string[]>([]);
  const [fotoElements, setFotoElements] = useState<string[]>([]);

  useEffect(() => {
    const handleResize = () => setIsFiltersOpen(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const resetFilters = () => {
    setMaxWidth(0);
    setTemperatures([]);
    setOpenings([]);
    setBooms([]);
    setFotoElements([]);
  };

  const appliedFiltersCount = (maxWidth > 0 ? 1 : 0)
    + temperatures.length
    + openings.length
    + booms.length
    + fotoElements.length;

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
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 grid grid-cols-1 gap-5 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {filteredBarriers.map((barrier) => (
              <article key={barrier.fullName} className="flex min-h-[340px] flex-col rounded-3xl bg-white border border-grey-400 transition-colors hover:border-cta cursor-pointer">
                <div className="flex min-h-[230px] items-center justify-center">
                  <img className="max-h-[220px] w-full object-contain" src={`${previewPath}${barrier.imageNamePreview}.webp`} alt={barrier.fullName} loading="lazy" />
                </div>
                <div className="mt-auto p-[8px_8px_20px_32px] font-manrope-semibold">
                  <h3 className="text-xl/7 text-grey-1000">{barrier.baseModel}</h3>
                  <p className="mt-1 text-md/5 text-grey-800">{barrier.tag}</p>
                  <p className="mt-4 text-xl/7 text-cta">{barrier.price}</p>
                </div>
              </article>
            ))}
            {filteredBarriers.length === 0 && (
              <p className="rounded-3xl bg-white p-8 text-lg/6 text-grey-700 md:col-span-2 xl:col-span-3">По выбранным условиям модели не найдены.</p>
            )}
          </div>
          <p className="col-span-12 pl-3 text-md/6 text-grey-700 block lg:hidden">Все цены указаны со&nbsp;склада в&nbsp;Москве и&nbsp;Санкт-Петербурге</p>
        </div>
      </div>
    </section>
  );
}
