import type { Dispatch, RefObject, SetStateAction } from 'react';

export type TemperatureOption = 'standard' | 'low';
export type OpeningTimeOption = 'lessThan1.5' | '3-4' | '4-6';
export type BoomOption = 'round' | 'square' | 'folding';
export type FotoElementOption = 'with' | 'without';

// выбранные значения фильтров
export type BarrierFilterSelections = {
	maxWidth: number;
	temperatures: readonly TemperatureOption[];
	openingTimes: readonly OpeningTimeOption[];
	booms: readonly BoomOption[];
	fotoElement: readonly FotoElementOption[];
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

// тип формы одной опции секции [value, label]
export type FilterSectionOption<T extends string> = readonly [value: T, label: string];

// Свойства одной секции фильтров
export type FilterSectionProps<T extends string> = {
	title: string;
	options: readonly FilterSectionOption<T>[];
	selected: T[];
	onToggle: (value: T) => void;
	disabledValues?: ReadonlySet<string>;
};

// параметры хуков
export type UseBarrierCatalogEffectsParams = {
  /** выбранная максимальная ширина проезда */
	selectedMaxWidth: number;
  /** максимальная ширина, которую можно установить в соответствии с текущими фильтрами */
	maxWidthLimit: number;
  /** массив выбранных температур */
	temperatures: TemperatureOption[];
	/** выбранные интервалы времени открытия */
	openingTimes: OpeningTimeOption[];
  /** массив выбранных типов стрел шлагбаумов */
	booms: BoomOption[];
  /** тип шлагбаума с фотоэлементом или без него */
	fotoElement: FotoElementOption[];
  /** ссылка на галерею */
	galleryRef: RefObject<HTMLDivElement>;
  /** функция для установки максимальной ширины */
	setMaxWidth: Dispatch<SetStateAction<number>>;
  /** функция для установки состояния открытия фильтров */
	setIsFiltersOpen: Dispatch<SetStateAction<boolean>>;
};