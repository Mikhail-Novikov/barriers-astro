import { useMemo } from 'react';
import options from '@content/options.json';
import type { BarrierFilterSelections, FilterRule, FilterOption } from '@shared-types/barrierFilters';

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

/** Секции фильтров с массивом выбранных значений. */
const FILTER_SECTIONS = ['temperatures', 'openingTimes', 'booms', 'fotoElement'] as const;

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
  const { maxWidth, temperatures, openingTimes, booms, fotoElement } = selections;

  return useMemo(() => {
    const currentSelections: BarrierFilterSelections = { maxWidth, temperatures, openingTimes, booms, fotoElement };
    const rules = options as FilterRule[];

    // Карта: имя секции -> (значение опции -> набор дизейблов "section:value")
    const disablesBySelection = new Map<string, Map<string, Set<string>>>();

    for (const { selected, disables } of rules) {
      if (!matchesSelection(selected, currentSelections[selected.name])) continue;

      let perValue = disablesBySelection.get(selected.name);
      if (!perValue) {
        perValue = new Map();
        disablesBySelection.set(selected.name, perValue);
      }

      const valueKey = Array.isArray(selected.value) ? selected.value.join('|') : String(selected.value);
      let group = perValue.get(valueKey);
      if (!group) {
        group = new Set();
        perValue.set(valueKey, group);
      }

      for (const option of disables) {
        if (option.name === selected.name) continue;

        const values = Array.isArray(option.value) ? option.value : [option.value];
        for (const value of values) {
          group.add(`${option.name}:${value}`);
        }
      }
    }

    const disabledOptions = new Map<string, Set<string>>();

    const addDisabled = (name: string, value: string): void => {
      const group = disabledOptions.get(name) ?? new Set<string>();
      group.add(value);
      disabledOptions.set(name, group);
    };

    // Объединяем ограничения для всех выбранных значений каждой секции.
    for (const sectionName of FILTER_SECTIONS) {
      const selectedValues = currentSelections[sectionName];
      if (!Array.isArray(selectedValues) || selectedValues.length === 0) continue;

      const perValue = disablesBySelection.get(sectionName);
      if (!perValue) continue;

      for (const value of selectedValues) {
        const group = perValue.get(value);
        if (!group) continue;
        for (const item of group) {
          const separatorIndex = item.indexOf(':');
          addDisabled(item.slice(0, separatorIndex), item.slice(separatorIndex + 1));
        }
      }
    }

    // maxWidth — одиночное значение, логика без пересечения.
    if (typeof maxWidth === 'number' && maxWidth > 0) {
      const perValue = disablesBySelection.get('maxWidth');
      if (perValue) {
        for (const group of perValue.values()) {
          for (const item of group) {
            const separatorIndex = item.indexOf(':');
            addDisabled(item.slice(0, separatorIndex), item.slice(separatorIndex + 1));
          }
        }
      }
    }

    return disabledOptions;
  }, [booms, fotoElement, maxWidth, openingTimes, temperatures]);
};

export default useDisabledOptions;