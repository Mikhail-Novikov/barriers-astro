import { publicAsset } from '@utils/publicAsset';

const previewPath = publicAsset('/img/barriers/');

/**
 * Нормализует имя файла изображения барьера для сопоставления файлов основной галереи и миниатюр.
 *
 * @param path - Полный путь к файлу изображения.
 * @return Ключ названия файла без расширения и служебных суффиксов, пригодный для сравнения.
 */
const normalizeBarrierImageName = (path: string): string => (path.split('/').pop() ?? path)
  .replace(/\.[^.]+$/, '')
  .replace(/-(?:prev|preview|full)$/, '')
  .replace(/p$/, '');

/**
 * Элемент галереи барьера.
 */
type BarrierGalleryImage = {
  src: string;
  thumb: string;
};

/**
 * Результат сборки галереи барьера.
 */
type BarrierGalleryData = {
  images: BarrierGalleryImage[];
  initialImage: string;
};

/**
 * Параметры для построения галереи изображений конкретного барьера.
 */
type BuildBarrierGalleryParams = {
  folderName: string;
  mainImages: Record<string, string>;
  thumbImages: Record<string, string>;
};

/**
 * Список изображений для карточки шлагбаума и его миниатюр.
 *
 * @param params.folderName - Имя папки с изображениями барьера.
 * @param params.mainImages - Объект с основными изображениями барьера.
 * @param params.thumbImages - Объект с миниатюрами изображений барьера.
 * @return Объект с массивом изображений и исходной картинкой для открытия галереи.
 */
export const buildBarrierGallery = ({
  folderName,
  mainImages,
  thumbImages,
}: BuildBarrierGalleryParams): BarrierGalleryData => {
  const galleryImages = Object.entries(mainImages)
    .filter(([path]) => path.includes(`/barriers/${folderName}/main/`))
    .map(([path, src]) => ({
      src,
      key: normalizeBarrierImageName(path),
    }));

  const thumbnails = Object.entries(thumbImages)
    .filter(([path]) => path.includes(`/barriers/${folderName}/thumb/`))
    .map(([path, thumb]) => ({
      thumb,
      key: normalizeBarrierImageName(path),
    }))
    .sort((first, second) =>
      first.key.localeCompare(second.key, undefined, {
        numeric: true,
      }),
    );

  const barrierImages = thumbnails
    .map(({ key, thumb }) => {
      const image = galleryImages.find((item) => item.key === key);
      return image ? { src: image.src, thumb } : null;
    })
    .filter((image): image is BarrierGalleryImage => image !== null);

  const images = barrierImages.length > 0
    ? barrierImages
    : galleryImages.map(({ src }) => ({ src, thumb: src }));

  return {
    images,
    initialImage: images[0]?.src ?? `${previewPath}${folderName}/preview.webp`,
  };
};
