import { useMemo } from 'react';
import options from '@content/options.json';
import type { BarrierFilterSelections, FilterRule, FilterOption } from '@shared-types/barrierFilters';

/**
 * Возвращает максимальное значение ширины барьера.
 * @param disabledValues Множество неактивных значений ширины барьера.
 * @returns Максимальное значение ширины барьера.
 */
export const getMaxWidthLimit = (disabledValues?: ReadonlySet<string>): number => {
  const configuredMaximum = (options as FilterRule[]).reduce((maximum, { selected }) => {
    if (selected.name !== 'maxWidth') return maximum;
    const values = Array.isArray(selected.value) ? selected.value : [selected.value];
    return Math.max(maximum, ...values.map(Number));
  }, 0);
  const disabledMaximum = disabledValues
    ? Math.min(...Array.from(disabledValues, Number).filter(Number.isFinite))
    : configuredMaximum;

  return Math.min(configuredMaximum, disabledMaximum);
};

/**
 * Проверяет, соответствует ли выбранная опция текущему выбору.
 * @param option Опция фильтра, которую нужно проверить.
 * @param current Текущее значение выбора.
 * @returns true, если опция соответствует текущему выбору, иначе false.
 */
const matchesSelection = (option: FilterOption, current: number | readonly string[]): boolean => {

  if (option.name === 'maxWidth' && typeof current === 'number') {
    if (Array.isArray(option.value)) {
      return current > Number(option.value[0]) && current <= Number(option.value[1]);
    }

    return current === Number(option.value);
  }

  if (typeof current === 'number' || Array.isArray(option.value)) return false;
  return current.includes(option.value);
};

/**
 * Возвращает отключенные значения, сгруппированные по фильтрам.
 * @param selections Объект, содержащий текущие выборы.
 * @returns Map с наборами отключенных значений по имени фильтра.
 */
const useDisabledOptions = (selections: BarrierFilterSelections): ReadonlyMap<string, ReadonlySet<string>> => {
  const { maxWidth, temperatures, openingTimes, booms, fotoElement } = selections;

  return useMemo(() => {
    const currentSelections: BarrierFilterSelections = { maxWidth, temperatures, openingTimes, booms, fotoElement };
    const disabledOptions = new Map<string, Set<string>>();

    for (const { selected, disables } of options as FilterRule[]) {
      if (!matchesSelection(selected, currentSelections[selected.name])) continue;

      for (const option of disables) {
        const values = Array.isArray(option.value) ? option.value : [option.value];
        const group = disabledOptions.get(option.name) ?? new Set<string>();
        values.forEach((value) => group.add(value));
        disabledOptions.set(option.name, group);
      }
    }

    return disabledOptions;
  }, [booms, fotoElement, maxWidth, openingTimes, temperatures]);
};

export default useDisabledOptions;