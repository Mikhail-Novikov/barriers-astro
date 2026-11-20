import { useEffect, useRef } from 'react';

import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import { barrierFeedback } from '@utils/barrierFeedback';
import { readBarrierCatalogFilters, saveBarrierCatalogFilters } from '@utils/barrierFiltersStorage';
import scrollElementBelowStickyHeader from '@utils/scrollElementBelowStickyHeader';

import type { UseBarrierCatalogEffectsParams } from '@shared-types/barrierFilters';

/**
 * Хук для управления эффектами в каталоге барьеров.
 * 1. Восстанавливает и сохраняет состояние фильтров.
 * 2. Скроллит к галерее при изменении фильтров.
 * 3. Открывает модальное окно при клике на кнопку "Заказать".
 * 4. Закрывает фильтры при изменении размера страницы.
 * 
 * @param roadWidthLimit - верхняя граница выбранного диапазона ширины проезда
 * @param temperatures - выбранная температура
 * @param openingTimes - выбранное время открытия
 * @param booms - выбранный тип стрелы
 * @param galleryRef - ссылка на галерею
 * @param setRoadWidthLimit - функция установки верхней границы ширины проезда
 * @param setIsFiltersOpen - функция для установки состояния открытия фильтров
 */
const useBarrierCatalogEffects = ({
  roadWidthLimit,
  temperatures,
  openingTimes,
  booms,
  galleryRef,
  setRoadWidthLimit,
  setTemperatures,
  setOpeningTimes,
  setBooms,
  setIsFiltersOpen,
}: UseBarrierCatalogEffectsParams): void => {
  const previousFilters = useRef({ roadWidthLimit, temperatures, openingTimes, booms });
  const filtersRestored = useRef(false);

  useEffect(() => {
    const savedFilters = readBarrierCatalogFilters();
    if (savedFilters) {
      setRoadWidthLimit(savedFilters.roadWidthLimit);
      setTemperatures(savedFilters.temperatures);
      setOpeningTimes(savedFilters.openingTimes);
      setBooms(savedFilters.booms);
    }
    filtersRestored.current = true;
  }, [setBooms, setRoadWidthLimit, setOpeningTimes, setTemperatures]);

  useEffect(() => {
    if (!filtersRestored.current) return;

    saveBarrierCatalogFilters({
      roadWidthLimit,
      temperatures,
      openingTimes,
      booms,
    });
  }, [booms, openingTimes, roadWidthLimit, temperatures]);

  // скроллим к галерее при изменении фильтров
  useEffect(() => {
    const previous = previousFilters.current;
    const hasChanged = previous.roadWidthLimit !== roadWidthLimit
      || previous.temperatures !== temperatures
      || previous.openingTimes !== openingTimes
      || previous.booms !== booms;

    previousFilters.current = { roadWidthLimit, temperatures, openingTimes, booms };
    if (!hasChanged) return;

    scrollElementBelowStickyHeader(galleryRef.current, 120);
  }, [booms, galleryRef, openingTimes, roadWidthLimit, temperatures]);

  // открываем модальное окно при клике на кнопку "Заказать"
  useEffect(() => {
    const MODAL_OPEN_DELAY_MS = 500;
    const MODAL_TRIGGER_SELECTOR = '#open-modal-sale-barrier';
    const ORDER_BUTTON_ATTR = 'data-order-barrier';

    const handleOrderClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const orderButton = target.closest<HTMLButtonElement>(`[${ORDER_BUTTON_ATTR}]`);
      if (!orderButton) return;

      event.preventDefault();
      event.stopPropagation();

      const barrierName = orderButton.getAttribute(ORDER_BUTTON_ATTR) ?? '';
      const selectedOptions = [
        `Ширина проезда: ${roadWidthLimit > 0 ? `${roadWidthLimit} м` : 'не ограничена'}`,
        `Температура эксплуатации: ${
          temperatures === 'low' ? '−60 °C' : temperatures === 'standard' ? '−40 °C' : 'не ограничена'
        }`,
        `Время открытия: ${
          openingTimes
            ? ({
                'lessThan1.5': 'меньше 1,5 секунды',
                '3-4': '3–4 секунды',
                '4-6': '4–6 секунд',
              })[openingTimes]
            : 'не ограничено'
        }`,
        `Тип стрелы: ${
          booms
            ? ({
                round: 'круглая',
                square: 'прямоугольная',
                folding: 'складная прямоугольная',
              })[booms]
            : 'не ограничен'
        }`,
      ].join('\n');

      barrierFeedback.set(barrierName, selectedOptions);
      Fancybox.close();
      window.setTimeout(() => {
        document.querySelector<HTMLButtonElement>(MODAL_TRIGGER_SELECTOR)?.click();
      }, MODAL_OPEN_DELAY_MS);
    };

    document.addEventListener('click', handleOrderClick);
    return () => document.removeEventListener('click', handleOrderClick);
  }, [booms, openingTimes, roadWidthLimit, temperatures]);

  // закрываем фильтры при изменении размера страницы
  useEffect(() => {
    const handleResize = () => setIsFiltersOpen(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsFiltersOpen]);
};

export default useBarrierCatalogEffects;
