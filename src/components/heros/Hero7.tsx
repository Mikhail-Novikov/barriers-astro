import { useBreakpoint } from "@hooks/useBreakpoint";
import FilterCheckbox from "@components/FilterCheckbox";
import { useMemo, useState } from "react";
import { publicAsset } from "@utils/publicAsset";
import { ZoomModal, ZoomableImage } from "./ZoomModal";

type BodyStyle = "standard" | "premium";
type BoomShape = "round" | "square" | "foldable" | "soft";

type IllustrationItem = {
  bodyStyle: BodyStyle;
  boomShape: BoomShape;
  title: string;
  img: string;
};

const imgPath = publicAsset("/img/picking/");

const illustrationItems: IllustrationItem[] = [
  {
    bodyStyle: "standard",
    boomShape: "round",
    title: "Шлагбаум GS14&nbsp;со стрелой круглого сечения",
    img: `${imgPath}rezult/gs14-round.svg`,
  },
  {
    bodyStyle: "standard",
    boomShape: "square",
    title: "Шлагбаум GS14&nbsp;со стрелой прямоугольного сечения",
    img: `${imgPath}rezult/gs14-square.svg`,
  },
  {
    bodyStyle: "standard",
    boomShape: "foldable",
    title: "Шлагбаум GS14&nbsp;со складной стрелой прямоугольного сечения",
    img: `${imgPath}rezult/gs14-foldable.svg`,
  },
  {
    bodyStyle: "standard",
    boomShape: "soft",
    title: "Скоростной шлагбаум GF13&nbsp;со стрелой круглого сечения",
    img: `${imgPath}rezult/gs14-soft.svg`,
  },
  {
    bodyStyle: "premium",
    boomShape: "round",
    title: "Шлагбаум GS04.1&nbsp;со стрелой круглого сечения",
    img: `${imgPath}rezult/gs04-round.svg`,
  },
  {
    bodyStyle: "premium",
    boomShape: "square",
    title: "Шлагбаум GS04.1&nbsp;со стрелой прямоугольного сечения",
    img: `${imgPath}rezult/gs04-square.svg`,
  },
  {
    bodyStyle: "premium",
    boomShape: "foldable",
    title: "Шлагбаум GS04.1&nbsp;со складной стрелой прямоугольного сечения",
    img: `${imgPath}rezult/gs04-foldable.svg`,
  },
  {
    bodyStyle: "premium",
    boomShape: "soft",
    title: "Скоростной шлагбаум GF03.1&nbsp;со стрелой круглого сечения",
    img: `${imgPath}rezult/gs04-soft.svg`,
  },
];

// Для фильтра десктопа
const radioItemsType: {
  value: BoomShape;
  title: string;
  img: string;
  size: { width: number; height: number };
}[] = [
  {
    value: "square",
    title: "Прямоугольная",
    img: `${imgPath}options/rectangular.webp`,
    size: { width: 222, height: 72 },
  },
  {
    value: "foldable",
    title: "Прямоугольная складная",
    img: `${imgPath}options/rectangular-folding.webp`,
    size: { width: 222, height: 62 },
  },
  {
    value: "round",
    title: "Круглая",
    img: `${imgPath}options/round.webp`,
    size: { width: 222, height: 60 },
  },
  {
    value: "soft",
    title: "Круглая с буфером для скоростного шлагбаума",
    img: `${imgPath}options/high-speed.webp`,
    size: { width: 222, height: 60 },
  },
];

const radioItemsDesign: {
  value: BodyStyle;
  title: string;
  img: string;
  size: { width: number; height: number };
}[] = [
  {
    value: "standard",
    title: "Стандартное",
    img: `${imgPath}options/standart.webp`,
    size: { width: 222, height: 170 },
  },
  {
    value: "premium",
    title: "Премиум",
    img: `${imgPath}options/premium.webp`,
    size: { width: 222, height: 170 },
  },
];

// Для мобильной версии фильтр
const compactTypeItems = [
  { value: "round", label: "круглая" },
  { value: "square", label: "прямоугольная с буферной накладкой" },
  { value: "foldable", label: "складная прямоугольная с буферной накладкой" },
] as const;

const compactDesignItems = [
  { value: "standard", label: "стандартное" },
  { value: "premium", label: "премиум" },
] as const;

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
      <span className="flex items-center gap-2 perco-icons">
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
        <span className="text-sm/5 4xl:text-md/5">{item.title}</span>
      </span>
    </label>
  );
}

function CompactOptionList<T extends string>({
  items,
  name,
  selectedValue,
  onSelect,
}: {
  items: readonly { value: T; label: string }[];
  name: string;
  selectedValue: T;
  onSelect: (value: T) => void;
}): JSX.Element {
  return (
    <ul className="sm:ml-6 space-y-4 sm:space-y-5 list-none">
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
 * Компонент SelectionStepHeading представляет собой заголовок с номером шага и названием.
 * @param param step - Номер шага.
 * @param param title - Название шага.
 * @param param className - Дополнительные классы для стилизации.
 * 
 * @return {JSX.Element} JSX-элемент, представляющий заголовок с номером шага и названием.
 */

function SelectionStepHeading({
  step,
  title,
  className,
}: {
  step: number;
  title: string;
  className: string;
}): JSX.Element {
  return (
    <h3 className={'flex items-center font-manrope-semibold ' + className}>
      <span className="text-xl/normal md:text-2xl/normal">{step}. </span>
      {title}
    </h3>
  );
}

/**
 * Компонент Hero7 представляет собой секцию с вариантами комплектации.
 * Пользователь может выбрать тип стрелы и исполнение корпуса, после чего отображается соответствующая иллюстрация.
 *
 * @return {JSX.Element} JSX-элемент, представляющий секцию с вариантами комплектации.
 */
export default function Hero7(): JSX.Element {
  const screen = useBreakpoint();
  const [selectedType, setSelectedType] = useState<BoomShape>("square");
  const [selectedDesign, setSelectedDesign] = useState<BodyStyle>("standard");
  const [zoomedVariant, setZoomedVariant] = useState<IllustrationItem | null>(null);

  // Отфильтрованный список вариантов комплектации
  const currentVariant = useMemo(
    () =>
      illustrationItems.find(
        (item) =>
          item.boomShape === selectedType && item.bodyStyle === selectedDesign,
      ) ?? illustrationItems[0],
    [selectedType, selectedDesign],
  );

  return (
    <section
      id="complectation"
      aria-label="Комплектация"
      className="py-10 bg-grey-400 sm:py-15 xl:p-[80px_0_100px]"
    >
      <div className="container">
        <h2 className="mb-6 h2 xl:mb-8">Комплектация</h2>

        <div className="grid gap-0 grid-cols-16 4xl:grid-cols-12">
          <div className="col-span-16 mb-5 sm:mb-6 lg:mb-8 2xl:mb-0 rounded-6 2xl:col-span-6 4xl:col-span-4 3xl:block 3xl:overflow-hidden">
            {!screen["2xl"] && (
              <div className="grid grid-cols-1 mb-3 gap-y-5 md:grid-cols-2">
                <div>
                  <SelectionStepHeading
                    step={1}
                    title="Выберите тип стрелы"
                    className="mb-4 gap-x-2 text-xl/6"
                  />
                  <CompactOptionList
                    items={compactTypeItems}
                    name="compact-type"
                    selectedValue={selectedType}
                    onSelect={setSelectedType}
                  />
                </div>
                <div>
                  <SelectionStepHeading
                    step={2}
                    title="Выберите исполнение корпуса"
                    className="mb-4 gap-x-2 text-xl/6"
                  />
                  <CompactOptionList
                    items={compactDesignItems}
                    name="compact-design"
                    selectedValue={selectedDesign}
                    onSelect={setSelectedDesign}
                  />
                </div>
              </div>
            )}

            {screen["2xl"] && (
              <div>
                <div className="mb-8">
                  <SelectionStepHeading
                    step={1}
                    title="Выберите тип стрелы"
                    className="mb-5 text-xl/6 gap-x-2"
                  />
                  <div className="grid grid-cols-2 grid-rows-2 gap-3 4xl:gap-5">
                    {radioItemsType.map((item) => {
                      const isActive = selectedType === item.value;

                      return (
                        <OptionCard
                          key={item.title}
                          item={item}
                          isActive={isActive}
                          name="type"
                          onSelect={() => setSelectedType(item.value)}
                          className="h-[140px]"
                          size={item.size}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <SelectionStepHeading
                    step={2}
                    title="Выберите исполнение корпуса"
                    className="mb-5 text-xl/6 gap-x-2"
                  />
                  <div className="grid grid-cols-2 gap-3 4xl:gap-5">
                    {radioItemsDesign.map((item) => {
                      const isActive = selectedDesign === item.value;

                      return (
                        <OptionCard
                          key={item.title}
                          item={item}
                          isActive={isActive}
                          name="design"
                          onSelect={() => setSelectedDesign(item.value)}
                          className="h-[230px] 4xl:h-[262px]"
                          size={item.size}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-[20px_8px] md:p-[40px_20px] lg:p-[40px_32px] xl:p-10 2xl:p-5 3xl:p-8 4xl:p-[40px_40px_15px_40px] relative flex items-center mt-0 overflow-x-auto bg-white col-span-16 rounded-xl md:rounded-2xl 2xl:col-span-10 4xl:col-span-8 lg:ml-4 2xl:ml-8 4xl:ml-15">
            <div className="w-full">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setZoomedVariant(currentVariant)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setZoomedVariant(currentVariant);
                  }
                }}
                className="absolute text-2xl text-right transition-all duration-300 ease-out perco-icons inset-3 md:inset-6 xl:h-13 text-grey-500 hover:text-grey-800 cursor-zoom-in"
              >
                <i className="!hidden md:!block perco-icon-control-fullscreen xl:float-right" />
                <span className="text-2xl md:hidden text-grey-500">
                  <i className="perco-icon-control-fullscreen-mobile xl:float-right" />
                </span>
              </div>
              <h4
                className="pr-8 mb-6 text-[12px]/4 md:text-lg/normal xl:text-xl font-manrope-semibold text-grey-700 text-center"
                dangerouslySetInnerHTML={{ __html: currentVariant.title }}
              />
              <img
                className="object-contain shrink-0"
                src={currentVariant.img}
                alt={currentVariant.title}
                data-iframe-title={currentVariant.title}
                width="1000"
                height="520"
              />
            </div>
          </div>
        </div>
      </div>
      <ZoomModal
        isOpen={zoomedVariant !== null}
        onClose={() => setZoomedVariant(null)}
        contentClassName="flex sm:block w-full sm:container h-full sm:h-fit items-center justify-center overflow-hidden sm:rounded-2xl bg-white p-4 sm:p-6 md:p-7 lg:p-10 3xl:p-24 shadow-2xl"
      >
        {zoomedVariant && (
          <ZoomableImage
            src={zoomedVariant.img}
            alt={zoomedVariant.title.replace(/&nbsp;/g, " ")}
            title={zoomedVariant.title.replace(/&nbsp;/g, " ")}
            className="w-full h-full max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-2rem)] overflow-y-auto"
            imgClassName="max-h-full max-w-full mx-auto sm:max-h-[312px] md:max-h-[426px] lg:max-h-[426px] xl:max-h-[478px] 2xl:max-h-[520px] 3xl:max-h-[624px] 4xl:max-h-[712px]"
          />
        )}
      </ZoomModal>
    </section>
  );
}
