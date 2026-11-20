import type { Dispatch, RefObject, SetStateAction } from 'react';

// типы для фильтров каталога шлагбаумов
export type TemperatureOption = 'standard' | 'low';
export type OpeningTimeFilterOption = 'lessThan1.5' | '3-4' | '4-6';
export type BoomOption = 'round' | 'square' | 'folding';

// интервал открытия
export type OpeningTimeOption = { from: number; to: number };

// выбранные значения фильтров
export type BarrierFilterSelections = {
	maxWidth: number;
	temperatures: TemperatureOption | null;
	openingTimes: OpeningTimeFilterOption | null;
	booms: BoomOption | null;
};

// опция фильтрации
export type FilterOption = {
  // имя(ключ) фильтра, к которому относится опция
	name: keyof BarrierFilterSelections;
  // значение опции фильтра
	value: string | string[];
};

// правило зависимости между фильтрами для деактивации
export type FilterRule = {
  //выбранная опция, при которой срабатывает правило.
	selected: FilterOption;
  // опции других фильтров, которые нужно отключить.
	disables: FilterOption[];
};

// параметры хуков
export type UseBarrierCatalogEffectsParams = {
  /** выбранный диапазон ширины проезда */
	selectedMaxWidth: number;
  /** выбранная температура */
	temperatures: TemperatureOption | null;
	/** выбранный интервал времени открытия */
	openingTimes: OpeningTimeFilterOption | null;
  /** выбранный тип стрелы шлагбаума */
	booms: BoomOption | null;
  /** ссылка на галерею */
	galleryRef: RefObject<HTMLDivElement>;
  /** функция для установки выбранного диапазона ширины */
	setMaxWidth: Dispatch<SetStateAction<number>>;
	setTemperatures: Dispatch<SetStateAction<TemperatureOption | null>>;
	setOpeningTimes: Dispatch<SetStateAction<OpeningTimeFilterOption | null>>;
	setBooms: Dispatch<SetStateAction<BoomOption | null>>;
  /** функция для установки состояния открытия фильтров */
	setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
};