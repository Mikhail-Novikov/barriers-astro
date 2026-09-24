let pendingMessage = '';

/**
 * Объект для хранения и обмена данными между компонентами
 */
export const barrierFeedback = {
  /**
   * Установить сообщение
   * @param message - сообщение
   * @return {void}
   */
  set: (message: string): void => {
    pendingMessage = message;
  },
  /**
   * Получить и очистить сообщение
   * @return {string} сообщение
   */
  consume: (): string => {
    const message = pendingMessage;
    pendingMessage = '';
    return message;
  },
  /**
   * Получить текущее сообщение
   * @return {string} сообщение
   */ 
  peek: (): string => pendingMessage,
};
