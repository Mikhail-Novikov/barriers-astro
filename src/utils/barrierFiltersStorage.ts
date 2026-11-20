import type { BarrierFilterSelections } from '@shared-types/barrierFilters';

const FILTERS_STORAGE_KEY = 'barrier-catalog-filters';
let hasCheckedInitialNavigation = false;

/**
 * Проверяет, является ли значение объектом.
 * @param value Значение для проверки.
 * @returns true, если значение является объектом, иначе false.
 */
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Возвращает первое допустимое значение, включая старый формат с массивом.
 * @param value Значение, которое нужно проверить.
 * @param allowedOptions Список допустимых опций.
 * @returns Допустимое значение или null.
 */
const getValidOption = <T extends string>(value: unknown, allowedOptions: readonly T[]): T | null => {
  const candidates = Array.isArray(value) ? value : [value];
  return candidates.find((option): option is T =>
    typeof option === 'string' && allowedOptions.includes(option as T)) ?? null;
};

/**
 * Читает сохраненные фильтры из sessionStorage.
 * @returns Объект с выбранными фильтрами или null, если фильтры не найдены.
 */
export const readBarrierCatalogFilters = (): BarrierFilterSelections | null => {
  try {
    if (!hasCheckedInitialNavigation) {
      hasCheckedInitialNavigation = true;
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (navigationEntry?.type === 'reload') {
        sessionStorage.removeItem(FILTERS_STORAGE_KEY);
        return null;
      }
    }

    const serializedFilters = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (!serializedFilters) return null;

    const parsedFilters: unknown = JSON.parse(serializedFilters);
    if (!isObject(parsedFilters)) return null;

    return {
      maxWidth: typeof parsedFilters.maxWidth === 'number' && Number.isFinite(parsedFilters.maxWidth)
        ? Math.max(0, parsedFilters.maxWidth)
        : 0,
      temperatures: getValidOption(parsedFilters.temperatures, ['standard', 'low']),
      openingTimes: getValidOption(parsedFilters.openingTimes, ['lessThan1.5', '3-4', '4-6']),
      booms: getValidOption(parsedFilters.booms, ['round', 'square', 'folding']),
    };
  } catch {
    return null;
  }
};

/**
 * Сохраняет фильтры в sessionStorage.
 * @param filters Объект с выбранными фильтрами.
 */
export const saveBarrierCatalogFilters = (filters: BarrierFilterSelections): void => {
  try {
    sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    return;
  }
};