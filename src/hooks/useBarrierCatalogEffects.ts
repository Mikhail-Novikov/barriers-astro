import { useEffect, useRef } from 'react';

import { Fancybox } from '@fancyapps/ui/dist/fancybox/fancybox.js';
import { barrierFeedback } from '@utils/barrierFeedback';
import { readBarrierCatalogFilters, saveBarrierCatalogFilters } from '@utils/barrierFiltersStorage';
import scrollElementBelowStickyHeader from '@utils/scrollElementBelowStickyHeader';

import type {
  UseBarrierCatalogEffectsParams,
} from '@shared-types/barrierFilters';

/**
 * Хук для управления эффектами в каталоге барьеров.
 * 1. Устанавливает ограничение на максимальную ширину в соответствии с текущими фильтрами.
 * 2. Скроллит к галерее при изменении фильтров.
 * 3. Открывает модальное окно при клике на кнопку "Заказать".
 * 4. Закрывает фильтры при изменении размера страницы.
 * 
 * @param selectedMaxWidth - текущее значение слайдера максимальной ширины
 * @param maxWidthLimit - максимальная ширина, которую можно установить
 * @param temperatures - массив температур
 * @param openingTimes - выбранные интервалы времени открытия
 * @param booms - массив выстрелов
 * @param fotoElement - выбранные варианты фотоэлемента
 * @param galleryRef - ссылка на галерею
 * @param setMaxWidth - функция для установки максимальной ширины
 * @param setIsFiltersOpen - функция для установки состояния открытия фильтров
 */
const useBarrierCatalogEffects = ({
  selectedMaxWidth,
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
}: UseBarrierCatalogEffectsParams): void => {
  const previousFilters = useRef({ selectedMaxWidth, temperatures, openingTimes, booms, fotoElement });
  const filtersRestored = useRef(false);

  useEffect(() => {
    const savedFilters = readBarrierCatalogFilters();
    if (savedFilters) {
      setMaxWidth(savedFilters.maxWidth);
      setTemperatures([...savedFilters.temperatures]);
      setOpeningTimes([...savedFilters.openingTimes]);
      setBooms([...savedFilters.booms]);
      setFotoElement([...savedFilters.fotoElement]);
    }
    filtersRestored.current = true;
  }, [setBooms, setFotoElement, setMaxWidth, setOpeningTimes, setTemperatures]);

  useEffect(() => {
    if (!filtersRestored.current) return;

    saveBarrierCatalogFilters({
      maxWidth: selectedMaxWidth,
      temperatures,
      openingTimes,
      booms,
      fotoElement,
    });
  }, [booms, fotoElement, openingTimes, selectedMaxWidth, temperatures]);

  // устанавливаем ограничение на максимальную ширину в соответствии с текущими фильтрами
  useEffect(() => {
    setMaxWidth((currentWidth) => Math.min(currentWidth, maxWidthLimit));
  }, [maxWidthLimit, setMaxWidth]);

  // скроллим к галерее при изменении фильтров
  useEffect(() => {
    const previous = previousFilters.current;
    const hasChanged = previous.selectedMaxWidth !== selectedMaxWidth
      || previous.temperatures !== temperatures
      || previous.openingTimes !== openingTimes
      || previous.booms !== booms
      || previous.fotoElement !== fotoElement;

    previousFilters.current = { selectedMaxWidth, temperatures, openingTimes, booms, fotoElement };
    if (!hasChanged) return;

    scrollElementBelowStickyHeader(galleryRef.current, 120);
  }, [booms, fotoElement, galleryRef, selectedMaxWidth, openingTimes, temperatures]);

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
      const message = barrierName
        ? `Нужна консультация:<br /> <strong class="font-manrope-semibold">${barrierName}</strong>`
        : '';

      barrierFeedback.set(message);
      Fancybox.close();
      window.setTimeout(() => {
        document.querySelector<HTMLButtonElement>(MODAL_TRIGGER_SELECTOR)?.click();
      }, MODAL_OPEN_DELAY_MS);
    };

    document.addEventListener('click', handleOrderClick);
    return () => document.removeEventListener('click', handleOrderClick);
  }, []);

  // закрываем фильтры при изменении размера страницы
  useEffect(() => {
    const handleResize = () => setIsFiltersOpen(false);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsFiltersOpen]);
};

export default useBarrierCatalogEffects;
