import { useBreakpoint } from "@hooks/useBreakpoint";
import FilterCheckbox from "@components/FilterCheckbox";
import { useMemo, useState } from "react";
import { publicAsset } from "@utils/publicAsset";
import { ZoomModal, ZoomableImage } from "./ZoomModal";
import Modal from "./Modal";
import ModalFeedbackForm from "./ModalFeedbackForm";

/** Доступные исполнения корпуса шлагбаума. */
type BodyStyle = "standard" | "premium";
/** Доступные формы стрелы шлагбаума. */
type BoomShape = "round" | "square" | "foldable" | "soft";

/** Иллюстрация результата для выбранного корпуса и формы стрелы. */
type IllustrationItem = {
  /** Выбранное исполнение корпуса. */
  bodyStyle: BodyStyle;
  /** Выбранная форма стрелы. */
  boomShape: BoomShape;
  /** Подпись выбранной конфигурации. */
  title: string;
  /** URL иллюстрации конфигурации. */
  img: string;
};

/** Путь к каталогу изображений подборщика. */
const imgPath = publicAsset("/img/picking/");

/** Иллюстрации доступных сочетаний корпуса и формы стрелы. */
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

/** Размеры изображения опции в пикселях. */
type OptionImageSize = {
  /** Ширина изображения. */
  width: number;
  /** Высота изображения. */
  height: number;
};

/** Данные радиоопции с иллюстрацией. */
type RadioOption<T extends string> = {
  /** Значение опции. */
  value: T;
  /** Подпись опции. */
  title: string;
  /** URL изображения опции. */
  img: string;
  /** Размеры изображения опции. */
  size: OptionImageSize;
};

/** Варианты формы стрелы для десктопного фильтра. */
const radioItemsType: RadioOption<BoomShape>[] = [
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

/** Варианты исполнения корпуса для десктопного фильтра. */
const radioItemsDesign: RadioOption<BodyStyle>[] = [
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

/** Варианты формы стрелы для компактного мобильного фильтра. */
const compactTypeItems = [
  { value: "round", label: "круглая" },
  { value: "square", label: "прямоугольная с буферной накладкой" },
  { value: "foldable", label: "складная прямоугольная с буферной накладкой" },
] as const;

/** Варианты исполнения корпуса для компактного мобильного фильтра. */
const compactDesignItems = [
  { value: "standard", label: "стандартное" },
  { value: "premium", label: "премиум" },
] as const;

/** Подпись и изображение, отображаемые в карточке опции. */
type OptionCardItem = {
  /** Название опции. */
  title: string;
  /** URL изображения опции. */
  img: string;
};

/** Необязательные размеры изображения карточки. */
type OptionCardSize = {
  /** Ширина изображения. */
  width?: number;
  /** Высота изображения. */
  height?: number;
};

/** Пропсы карточки радиоопции. */
type OptionCardProps = {
  /** Подпись и изображение опции. */
  item: OptionCardItem;
  /** Указывает, выбрана ли эта опция. */
  isActive: boolean;
  /** Имя группы радиокнопок. */
  name: string;
  /** Вызывается при выборе опции. */
  onSelect: () => void;
  /** Дополнительные CSS-классы карточки. */
  className?: string;
  /** Необязательные размеры изображения. */
  size?: OptionCardSize;
};

/**
 * Компонент OptionCard представляет собой карточку с опцией выбора.
 * @param props - Опция, её состояние, обработчик выбора и оформление.
 * @returns Карточка с радиокнопкой, названием и изображением опции.
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
      className={`relative border bg-white rounded-2xl p-4 flex flex-col justify-between cursor-pointer ${className} ${isActive ? "border-cta" : "border-transparent"}`}
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

/** Пропсы списка компактных радиоопций. */
type CompactOptionListProps<T extends string> = {
  /** Значения и подписи доступных опций. */
  items: readonly { value: T; label: string }[];
  /** Имя группы радиокнопок. */
  name: string;
  /** Текущее выбранное значение. */
  selectedValue: T;
  /** Вызывается с новым значением при выборе опции. */
  onSelect: (value: T) => void;
};

/**
 * Отображает компактный список радиоопций и сохраняет тип их значений.
 *
 * @param props - Опции, имя радиогруппы, выбранное значение и обработчик.
 * @returns Список переключаемых опций.
 */
function CompactOptionList<T extends string>({
  items,
  name,
  selectedValue,
  onSelect,
}: CompactOptionListProps<T>): JSX.Element {
  return (
    <ul className="space-y-4 list-none sm:ml-6 sm:space-y-5">
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

/** Пропсы заголовка шага выбора комплектации. */
type SelectionStepHeadingProps = {
  /** Порядковый номер шага. */
  step: number;
  /** Название шага. */
  title: string;
  /** CSS-классы заголовка. */
  className: string;
};

/**
 * Отображает заголовок шага с номером и названием.
 *
 * @param props - Номер шага, его название и CSS-классы заголовка.
 * @returns Заголовок шага выбора комплектации.
 */
function SelectionStepHeading({
  step,
  title,
  className,
}: SelectionStepHeadingProps): JSX.Element {
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
          <div className="mb-5 col-span-16 sm:mb-6 lg:mb-8 2xl:mb-0 rounded-6 2xl:col-span-6 4xl:col-span-4 3xl:block 3xl:overflow-hidden">
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
            <div
              className="w-full group cursor-zoom-in"
              role="button"
              tabIndex={0}
              onClick={() => setZoomedVariant(currentVariant)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setZoomedVariant(currentVariant);
                }
              }}
            >
              <div
                aria-hidden="true"
                className="absolute text-2xl text-right transition-all duration-300 ease-out perco-icons inset-3 md:inset-6 xl:h-13 text-grey-500 group-hover:text-grey-800"
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
        <Modal
          triggerLabel="Получить консультацию"
          title="Форма обратной связи"
          triggerClassName="mt-5 md:mt-8"
          triggerVariant="primary"
          initialMessage={`Интересует комплектация: ${currentVariant.title.replace(/&nbsp;/g, " ")}`}
        >
          <ModalFeedbackForm idPrefix="open-modal-sale-barrier" />
        </Modal>
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
            className="w-full h-full max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] md:max-h-[calc(100dvh-2rem)] overflow-hidden"
            imgClassName="max-h-full max-w-full mx-auto sm:max-h-[312px] md:max-h-[426px] lg:max-h-[426px] xl:max-h-[478px] 2xl:max-h-[520px] 3xl:max-h-[624px] 4xl:max-h-[712px]"
          />
        )}
      </ZoomModal>
    </section>
  );
}
