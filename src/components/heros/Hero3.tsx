import { useLightGallery } from '@hooks/useLightGallery';
import { useMemo, useState } from 'react';

type IllustrationItem = {
  type: string;
  design: string;
  title: string;
  img: string;
};

const imgPath = '/img/picking/';

const illustrationItems: IllustrationItem[] = [
  {
    type: 'Прямоугольная',
    design: 'Стандартное',
    title: 'Шлагбаум GS04.1 со стрелой прямоугольного сечения',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'Прямоугольная',
    design: 'Премиум',
    title: 'Шлагбаум GS04.1 со стрелой прямоугольного сечения',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'Прямоугольная складная',
    design: 'Стандартное',
    title: 'Шлагбаум GS04.1 со складной стрелой',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'Прямоугольная складная',
    design: 'Премиум',
    title: 'Шлагбаум GS04.1 для скоростного проезда',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'Круглая',
    design: 'Стандартное',
    title: 'Шлагбаум GS04.1 со стрелой круглого сечения',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'Круглая',
    design: 'Премиум',
    title: 'Шлагбаум GS04.1 со стрелой круглого сечения',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'для скоростного шлагбаума',
    design: 'Стандартное',
    title: 'Шлагбаум GS14 со складной стрелой прямоугольного сечения',
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: 'для скоростного шлагбаума',
    design: 'Премиум',
    title: 'Скоростной шлагбаум GF03.1 со стрелой круглого сечения',
    img: `${imgPath}rezult/1.webp`,
  },
];

const radioItemsType = [
  {
    title: 'Прямоугольная',
    img: `${imgPath}options/rectangular.webp`,
    size: { width: 222, height: 72 },
  },
  {
    title: 'Прямоугольная складная',
    img: `${imgPath}options/rectangular-folding.webp`,
    size: { width: 222, height: 62 },
  },
  {
    title: 'Круглая',
    img: `${imgPath}options/round.webp`,
    size: { width: 222, height: 60 },
  },
  {
    title: 'для скоростного шлагбаума',
    img: `${imgPath}options/high-speed.webp`,
    size: { width: 222, height: 60 },
  },
];

const radioItemsDesign = [
  {
    title: 'Стандартное',
    img: `${imgPath}options/standart.webp`,
    size: { width: 222, height: 170 },
  },
  {
    title: 'Премиум',
    img: `${imgPath}options/premium.webp`,
    size: { width: 222, height: 170 },
  },
];

/**
 * Типы свойств для компонента OptionCard.
 */
type OptionCardProps = {
  item: {
    title: string;
    img: string;
  };
  isActive: boolean;
  name: string;
  onSelect: () => void;
  className?: string;
  size?: {
    width?: number;
    height?: number;
  };
};

/**
 * Компонент OptionCard представляет собой карточку с опцией выбора.
 * @param {OptionCardProps} props - Свойства компонента.
 * @param {Object} props.item - Объект с данными опции.
 * @param {string} props.item.title - Заголовок опции.
 * @param {string} props.item.img - Путь к изображению опции.
 * @param {boolean} props.isActive - Флаг, указывающий, активна ли опция.
 * @param {string} props.name - Имя группы радио-кнопок.
 * @param {Function} props.onSelect - Функция, вызываемая при выборе опции.
 * @param {string} [props.className] - Дополнительные классы для стилизации.
 * @param {Object} [props.size] - Размеры изображения.
 * @return {JSX.Element} JSX-элемент, представляющий карточку с опцией выбора.
 */
function OptionCard({ item, isActive, name, onSelect, className, size }: OptionCardProps): JSX.Element {
  return (
    <label className={`relative border bg-white rounded-2xl p-4 flex flex-col justify-between cursor-pointer ${className} ${isActive ? 'border-grey-900' : 'border-transparent'}`}>
      <img src={item.img} alt={item.title} width={size?.width || 100} height={size?.height || 100} />
      <span className="flex items-center gap-2">
        <input
          type="radio"
          name={name}
          value={item.title}
          className="sr-only"
          checked={isActive}
          onChange={onSelect}
        />
        <span className={`text-2xl ${isActive ? 'text-grey-900' : 'text-grey-700'}`}>
          <i className={isActive ? 'icon-radio' : 'icon-no-radio'} />
        </span>
        <span>{item.title}</span>
      </span>
    </label>
  );
}

/**
 * Компонент Hero3 представляет собой секцию с вариантами комплектации.
 * Пользователь может выбрать тип стрелы и исполнение корпуса, после чего отображается соответствующая иллюстрация.
 * 
 * @return {JSX.Element} JSX-элемент, представляющий секцию с вариантами комплектации.
 */
export default function Hero3(): JSX.Element {
  const [selectedType, setSelectedType] = useState('Прямоугольная');
  const [selectedDesign, setSelectedDesign] = useState('Стандартное');

  const currentVariant = useMemo(
    () =>
      illustrationItems.find(
        (item) => item.type === selectedType && item.design === selectedDesign
      ) ?? illustrationItems[0],
    [selectedType, selectedDesign]
  );

  const galleryWithIndexes = illustrationItems.map((item, index) => ({
    ...item,
    index,
    src: item.img,
    thumb: item.img,
    alt: item.title,
  }));

  const { galleryRef, openGallery, totalItems } = useLightGallery({
    items: galleryWithIndexes,
    containerSelector: '.internal-container',
    closeOnTap: true,
  });

  const currentIndex = illustrationItems.findIndex(
    (item) => item.type === selectedType && item.design === selectedDesign
  );

  return (
    <section aria-label="Варианты комплектации" className="bg-grey-300 pb-30 pt-20">
      <div className="container">
        <div className="flex flex-col gap-8">
          <h2 className="h2">Варианты комплектации</h2>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 relative overflow-hidden rounded-6 mb-8 lg:mb-0">
              <div className="mb-10">
                <h3 className="font-semibold text-xl mb-5">
                  <span className="text-2xl">1. </span>
                  Выберите тип стрелы
                </h3>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  {radioItemsType.map((item) => {
                    const isActive = selectedType === item.title;

                    return (
                      <OptionCard
                        key={item.title}
                        item={item}
                        isActive={isActive}
                        name="type"
                        onSelect={() => setSelectedType(item.title)}
                        className="h-[140px]"
                        size={item.size}
                      />
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-xl mb-5">
                  <span className="text-2xl">2. </span>
                  Выберите исполнение корпуса
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {radioItemsDesign.map((item) => {
                    const isActive = selectedDesign === item.title;

                    return (
                      <OptionCard
                        key={item.title}
                        item={item}
                        isActive={isActive}
                        name="design"
                        onSelect={() => setSelectedDesign(item.title)}
                        className="md:h-[262px]"
                        size={item.size}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 xl:ml-11 bg-white rounded-2xl overflow-x-auto">
              <div className="p-4 sm:p-10 gap-4 w-full">
                <div className="relative">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openGallery(currentIndex >= 0 ? currentIndex : 0)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openGallery(currentIndex >= 0 ? currentIndex : 0);
                      }
                    }}
                    className="lg:h-13 text-[52px] text-grey-500 hover:text-grey-800 cursor-pointer transition-all duration-300 ease-out"
                  >
                    <i className="icon-plus-circle-fill lg:float-right" />
                  </div>
                  <h4 className="text-2xl text-grey-700 lg:text-center">{currentVariant.title}</h4>
                  <img src={currentVariant.img} alt={currentVariant.title} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lightgallery-backdrop" />
        <div className="internal-container" />
      </div>
    </section>
  );
}
