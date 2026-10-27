/**
 * Тип данных для хранения выбранного типа шлагбаума и фильтров
 */
export type BarrierFeedbackData = {
  barrierType: string;
  options: string;
};

/**
 * Внутреннее состояние модуля: данные о выбранном типе шлагбаума и фильтрах,
 * передаваемые между компонентами
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
   * Установить данные обратной связи
   * @param barrierType - выбранный тип шлагбаума
   * @param options - выбранные значения фильтров
   */
  set: (barrierType: string, options: string): void => {
    pendingFeedback = { barrierType, options };
  },

  /**
   * Получить текущие данные обратной связи без очистки
   * @returns копия выбранного типа шлагбаума и фильтров
   */
  peekData: (): BarrierFeedbackData => ({ ...pendingFeedback }),

  /**
   * Очистить хранилище данных (сбросить в пустые значения)
   */
  clear: (): void => {
    pendingFeedback = { barrierType: '', options: '' };
  },

  /**
   * Получить и очистить данные обратной связи
   * @returns копия выбранного типа шлагбаума и фильтров
   */
  consume: (): BarrierFeedbackData => {
    const feedback = { ...pendingFeedback };
    barrierFeedback.clear();
    return feedback;
  },

  /**
   * Получить текущий выбранный тип шлагбаума без очистки
   * @returns выбранный тип шлагбаума
   */
  peek: (): string => pendingFeedback.barrierType,
};