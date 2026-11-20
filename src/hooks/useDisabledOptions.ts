import { useMemo } from 'react';
import options from '@content/options.json';
import type { BarrierFilterSelections, FilterRule, FilterOption } from '@shared-types/barrierFilters';

/**
 * Проверяет, соответствует ли выбранная опция текущему выбору.
 * @param option Опция фильтра, которую нужно проверить.
 * @param current Текущее значение выбора.
 * @returns true, если опция соответствует текущему выбору, иначе false.
 */
const matchesSelection = (option: FilterOption, current: number | string | null): boolean => {
  if (option.name === 'maxWidth' && typeof current === 'number') {
    if (Array.isArray(option.value)) {
      return current > Number(option.value[0]) && current <= Number(option.value[1]);
    }

    return current === Number(option.value);
  }

  return typeof current === 'string' && typeof option.value === 'string' && current === option.value;
};

/**
 * Возвращает отключенные значения, сгруппированные по фильтрам.
 *
 * Ограничения выбранных значений объединяются: значение другой секции недоступно,
 * если оно запрещено хотя бы одним текущим выбором.
 *
 * @param selections Объект, содержащий текущие выборы.
 * @returns Map с наборами отключенных значений по имени фильтра.
 */
const useDisabledOptions = (selections: BarrierFilterSelections): ReadonlyMap<string, ReadonlySet<string>> => {
  const { maxWidth, temperatures, openingTimes, booms } = selections;

  return useMemo(() => {
    const currentSelections: BarrierFilterSelections = { maxWidth, temperatures, openingTimes, booms };
    const rules = options as FilterRule[];
    const disabledOptions = new Map<string, Set<string>>();

    const addDisabled = (name: string, value: string): void => {
      const group = disabledOptions.get(name) ?? new Set<string>();
      group.add(value);
      disabledOptions.set(name, group);
    };

    for (const { selected, disables } of rules) {
      if (!matchesSelection(selected, currentSelections[selected.name])) continue;

      for (const option of disables) {
        if (option.name === selected.name) continue;

        const values = Array.isArray(option.value) ? option.value : [option.value];
        for (const value of values) addDisabled(option.name, value);
      }
    }

    return disabledOptions;
  }, [booms, maxWidth, openingTimes, temperatures]);
};

export default useDisabledOptions;