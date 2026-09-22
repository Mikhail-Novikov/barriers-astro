import { useLightGallery } from "@hooks/useLightGallery";
import { useBreakpoint } from "@hooks/useBreakpoint";
import FilterCheckbox from "@components/FilterCheckbox";
import { useMemo, useState } from "react";
import { publicAsset } from "@utils/publicAsset";

type IllustrationItem = {
  type: string;
  design: string;
  title: string;
  img: string;
};

const imgPath = publicAsset("/img/picking/");

const illustrationItems: IllustrationItem[] = [
  {
    type: "Прямоугольная",
    design: "Стандартное",
    title: "Шлагбаум GS04.1 со стрелой прямоугольного сечения",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "Прямоугольная",
    design: "Премиум",
    title: "Шлагбаум GS04.1 со стрелой прямоугольного сечения",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "Прямоугольная складная",
    design: "Стандартное",
    title: "Шлагбаум GS04.1 со складной стрелой",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "Прямоугольная складная",
    design: "Премиум",
    title: "Шлагбаум GS04.1 для скоростного проезда",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "Круглая",
    design: "Стандартное",
    title: "Шлагбаум GS04.1 со стрелой круглого сечения",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "Круглая",
    design: "Премиум",
    title: "Шлагбаум GS04.1 со стрелой круглого сечения",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "для скоростного шлагбаума",
    design: "Стандартное",
    title: "Шлагбаум GS14 со складной стрелой прямоугольного сечения",
    img: `${imgPath}rezult/1.webp`,
  },
  {
    type: "для скоростного шлагбаума",
    design: "Премиум",
    title: "Скоростной шлагбаум GF03.1 со стрелой круглого сечения",
    img: `${imgPath}rezult/1.webp`,
  },
];

const radioItemsType = [
  {
    title: "Прямоугольная",
    img: `${imgPath}options/rectangular.webp`,
    size: { width: 222, height: 72 },
  },
  {
    title: "Прямоугольная складная",
    img: `${imgPath}options/rectangular-folding.webp`,
    size: { width: 222, height: 62 },
  },
  {
    title: "Круглая",
    img: `${imgPath}options/round.webp`,
    size: { width: 222, height: 60 },
  },
  {
    title: "Круглая с буфером для скоростного шлагбаума",
    img: `${imgPath}options/high-speed.webp`,
    size: { width: 222, height: 60 },
  },
];

const radioItemsDesign = [
  {
    title: "Стандартное",
    img: `${imgPath}options/standart.webp`,
    size: { width: 222, height: 170 },
  },
  {
    title: "Премиум",
    img: `${imgPath}options/premium.webp`,
    size: { width: 222, height: 170 },
  },
];

const compactTypeItems = [
  { value: "Круглая", label: "круглая" },
  { value: "Прямоугольная", label: "прямоугольная с буферной накладкой" },
  {
    value: "Прямоугольная складная",
    label: "складная прямоугольная с буферной накладкой",
  },
];

const compactDesignItems = [
  { value: "Стандартное", label: "стандартное" },
  { value: "Премиум", label: "премиум" },
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
function OptionCard({
  item,
  isActive,
  name,
  onSelect,
  className,
  size,
}: OptionCardProps): JSX.Element {
  return (
    <label
      className={`relative border bg-white rounded-2xl p-4 flex flex-col justify-between cursor-pointer ${className} ${isActive ? "border-grey-900" : "border-transparent"}`}
    >
      <img
        src={item.img}
        alt={item.title}
        width={size?.width || 100}
        height={size?.height || 100}
      />
      <span className="perco-icons flex items-center gap-2">
        <input
          type="radio"
          name={name}
          value={item.title}
          className="sr-only"
          checked={isActive}
          onChange={onSelect}
        />
        <span className={`text-xl ${isActive ? "text-cta" : "text-grey-700"}`}>
          <i
            className={isActive ? "perco-icon-radio" : "perco-icon-no-radio"}
          />
        </span>
        <span className="text-md/5">{item.title}</span>
      </span>
    </label>
  );
}

function CompactOptionList({
  items,
  name,
  selectedValue,
  onSelect,
}: {
  items: readonly { value: string; label: string }[];
  name: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}): JSX.Element {
  return (
    <ul className="list-none ml-6 space-y-4">
      {items.map((item) => {
        const isActive = selectedValue === item.value;

        return (
          <li key={item.value}>
            <FilterCheckbox
              type="radio"
              name={name}
              value={item.value}
              checked={isActive}
              label={item.label}
              onChange={() => onSelect(item.value)}
            />
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Компонент Hero3 представляет собой секцию с вариантами комплектации.
 * Пользователь может выбрать тип стрелы и исполнение корпуса, после чего отображается соответствующая иллюстрация.
 *
 * @return {JSX.Element} JSX-элемент, представляющий секцию с вариантами комплектации.
 */
export default function Hero7(): JSX.Element {
  const screen = useBreakpoint();
  const [selectedType, setSelectedType] = useState("Прямоугольная");
  const [selectedDesign, setSelectedDesign] = useState("Стандартное");

  const currentVariant = useMemo(
    () =>
      illustrationItems.find(
        (item) => item.type === selectedType && item.design === selectedDesign,
      ) ?? illustrationItems[0],
    [selectedType, selectedDesign],
  );

  const galleryWithIndexes = illustrationItems.map((item, index) => ({
    ...item,
    index,
    src: item.img,
    thumb: item.img,
    alt: item.title,
    title: item.title,
  }));

  const { galleryRef, openGallery, totalItems } = useLightGallery({
    items: galleryWithIndexes,
    containerSelector: ".internal-container",
    closeOnTap: true,
    counter: false,
    controls: false,
  });

  const currentIndex = illustrationItems.findIndex(
    (item) => item.type === selectedType && item.design === selectedDesign,
  );

  return (
    <section
      aria-label="Комплектация"
      className="bg-grey-400 pt-10 md:pt-15 xl:pt-20 pb-10 md:pb-15 lg:pb-20 xl:pb-25"
    >
      <div className="container">
        <h2 id="complectation" className="h2 mb-6 lg:mb-8">
          Комплектация
        </h2>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 mb-4 grid grid-cols-1 gap-8 rounded-6 lg:mb-0 min-[1200px]:col-span-4 min-[1200px]:block min-[1200px]:overflow-hidden">
            {!screen.xl && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 mb-3">
                <div>
                  <h3 className="mb-4 font-manrope-semibold text-xl/6">
                    <span className="text-2xl">1. </span>
                    Выберите тип стрелы
                  </h3>
                  <CompactOptionList
                    items={compactTypeItems}
                    name="compact-type"
                    selectedValue={selectedType}
                    onSelect={setSelectedType}
                  />
                </div>
                <div>
                  <h3 className="mb-6 font-manrope-semibold text-xl/6">
                    <span className="text-2xl">2. </span>
                    Выберите исполнение корпуса
                  </h3>
                  <CompactOptionList
                    items={compactDesignItems}
                    name="compact-design"
                    selectedValue={selectedDesign}
                    onSelect={setSelectedDesign}
                  />
                </div>
              </div>
            )}

            {screen.xl && (
              <div>
                <div className="mb-8">
                  <h3 className="font-manrope-semibold text-xl mb-5">
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
                  <h3 className="font-manrope-semibold text-xl mb-5">
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
            )}
          </div>

          <div className="col-span-12 bg-white rounded-2xl overflow-x-auto min-[1200px]:col-span-8 min-[1200px]:ml-11">
            <div className="p-4 sm:p-10 gap-4 w-full">
              <div className="relative">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    openGallery(currentIndex >= 0 ? currentIndex : 0)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openGallery(currentIndex >= 0 ? currentIndex : 0);
                    }
                  }}
                  className="lg:h-13 text-[52px] text-grey-500 hover:text-grey-800 cursor-pointer transition-all duration-300 ease-out"
                >
                  <i className="icon-plus-circle-fill lg:float-right" />
                </div>
                <h4 className="text-2xl text-grey-700 lg:text-center">
                  {currentVariant.title}
                </h4>
                <img
                  src={currentVariant.img}
                  alt={currentVariant.title}
                  title={currentVariant.title}
                  data-iframe-title={currentVariant.title}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lightgallery-backdrop" />
      <div className="internal-container" />
    </section>
  );
}
