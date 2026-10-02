/**
 * Возвращает путь к файлу из public папки с учетом пути сайта.
 * @param path Путь к публичной папке.
 * @returns Полный путь к публичной папке.
 */
export const publicAsset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
