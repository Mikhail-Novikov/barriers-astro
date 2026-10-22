/**
 * Тип данных для хранения выбранного типа шлагбаума и фильтров
 */
export type BarrierFeedbackData = {
  barrierType: string;
  options: string;
};

/**
 * Хранилище данных о выбранном типе шлагбаума и фильтрах для передачи между компонентами
 */
let pendingFeedback: BarrierFeedbackData = {
  barrierType: '',
  options: '',
};

/**
 * Объект для хранения и обмена данными между компонентами
 */
export const barrierFeedback = {
  /**
   * Установить сообщение
   * @param barrierType - выбранный тип шлагбаума
   * @param options - выбранные значения фильтров
   * @return {void}
   */
  set: (barrierType: string, options: string): void => {
    pendingFeedback = { barrierType, options };
  },
  peekData: (): BarrierFeedbackData => pendingFeedback,
  clear: (): void => {
    pendingFeedback = { barrierType: '', options: '' };
  },
  /**
   * Получить и очистить сообщение
   * @return {BarrierFeedbackData} выбранный тип и фильтры
   */
  consume: (): BarrierFeedbackData => {
    const feedback = pendingFeedback;
    barrierFeedback.clear();
    return feedback;
  },
  /**
   * Получить текущее сообщение
   * @return {string} выбранный тип шлагбаума
   */ 
  peek: (): string => pendingFeedback.barrierType,
};
