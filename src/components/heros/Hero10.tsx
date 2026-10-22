import { useEffect, useState } from 'react';
import Select, { type SingleValue } from 'react-select';

import { HtmlContent } from '@utils/HtmlContent';
import Modal from '@components/heros/Modal';
import ModalFeedbackForm from '@components/heros/ModalFeedbackForm';

import { publicAsset } from '../../utils/publicAsset';

/**
 * Данные готового решения для объекта.
 */
type Solution = {
  /** Краткое обозначение решения для вкладки и селектора. */
  tag: string;
  /** Заголовок выбранного решения. */
  title: string;
  /** URL иллюстрации решения. */
  image: string;
  /** Цена комплектации. */
  price: string;
  /** HTML-описание основного комплекта. */
  description: string;
  /** Дополнительные сведения о применении решения. */
  specifics: string;
  /** Важное замечание о доступе или эксплуатации, если есть. */
  important?: string;
  /** Список оборудования, которое можно добавить к комплекту. */
  additions: string[];
  /** Альтернативный вариант комплектации, если предусмотрен. */
  alternative?: {
    /** Цена альтернативной комплектации. */
    price: string;
    /** HTML-описание альтернативной комплектации. */
    description: string;
    /** Дополнения к альтернативной комплектации. */
    additions?: string[];
  };
};

/**
 * Опция готового решения в селекторе.
 */
type SolutionOption = {
  /** Индекс решения в исходном списке. */
  value: number;
  /** Подпись решения в списке выбора. */
  label: string;
};

/**
 * Пропсы блока с ценой и описанием комплектации.
 */
type SolutionPriceProps = {
  /** Цена комплектации. */
  price: string;
  /** Описание комплектации; может содержать HTML-сущности. */
  description: string;
  /** Дополнительные CSS-классы контейнера. */
  classNameWrapper: string;
};

/**
 * Компонент SolutionPrice отображает цену и описание готового решения.
 *
 * @param props - Цена, описание и дополнительные классы контейнера.
 * @returns Блок с ценой и описанием готового решения.
 * @example
 * <SolutionPrice price="151 020 ₽" description="GS04.1: прямоугольная стрела 4,3 м, опорная стойка GBS1" />
 */
function SolutionPrice({ price, description, classNameWrapper }: SolutionPriceProps): JSX.Element {
  return (
    <div className={`xl:mb-5 sm:flex w-full items-center gap-5 rounded-[16px] xl:rounded-3xl bg-grey-200 py-3 md:py-4 px-5 ${classNameWrapper}`}>
      <p className="order-1 mb-4 sm:mb-0 font-manrope-semibold text-md/5"><HtmlContent>{description}</HtmlContent></p>
      <strong className="sm:ml-4 md:ml-5 shrink-0 text-xl/8 font-manrope-bold text-cta xl:text-2xl/7">{price}</strong>
    </div>
  );
}

/**
 * Пропсы списка дополнительных опций готового решения.
 */
type SolutionAdditionsProps = {
  /** Наименования дополнительных опций; при пустом списке блок не отображается. */
  additions?: string[];
};

/**
 * Отображает список дополнений для готового решения.
 *
 * @param props - Дополнительные опции выбранного решения.
 * @returns Список дополнений или null, если дополнений нет.
 */
function SolutionAdditions({ additions }: SolutionAdditionsProps): JSX.Element | null {
  if (!additions?.length) return null;

  return (
    <>
      <p className="mb-1 sm:mb-3 text-lg/6 text-grey-1000 xl:text-grey-800 font-manrope-semibold">Что можно добавить:</p>
      <ul className="mb-7 lg:mb-10 list-disc marker:text-[12px] space-y-1 pl-3 sm:pl-6 text-md/6">
        {additions.map((addition) => <li key={addition}><HtmlContent>{addition}</HtmlContent></li>)}
      </ul>
    </>
  );
}

/** Готовые комплектации, отображаемые для разных типов объектов. */
const solutions: Solution[] = [
  {
    tag: "Бизнес-центр, офис",
    title: "Бизнес-центр или офис",
    image: publicAsset("/img/ready‑made-solutions/business-center.webp"),
    price: "151 020 ₽",
    description: "Шлагбаум GS04.1&nbsp;с прямоугольной стрелой 4,3&nbsp;м и&nbsp;опорной стойкой GBS1",
    specifics:
      "Презентабельный внешний вид, удобный доступ сотрудников и посетителей, средний поток, работа в составе СКУД или парковочной системы.",
    important: "Доступ сотрудников и посетителей по картам и брелокам.",
    additions: [
      "Светодиодная лента GBL4.3 для дополнительной подсветки стрелы шлагбаума GBO4.3",
      "Брелок-передатчик радиоуправления YET2129&nbsp;с динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Считыватель дальнего действия RU5306T",
      "Стойка для установки оборудования (2,2 м) BH04",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
  },
  {
    tag: "Гараж, ГСК",
    title: "Гараж или ГСК",
    image: publicAsset("/img/ready‑made-solutions/residential-garage.webp"),
    price: "121 862 ₽",
    description:
      "Шлагбаум GS14 с круглой стрелой 4,3&nbsp;м, опорной стойка GBS1 и комплектом фотоэлементов GD1",
    specifics: "Въезд для своих, бюджетное решение, низкий поток.",
    important:
      "Доступ по брелокам; GSM-модуль не используется, чтобы не провоцировать утечку номера.",
    additions: [
      "Брелок-передатчик радиоуправления YET2129&nbsp;с динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Лампа сигнальная со&nbsp;встроенной антенной SL-U",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
    ],
  },
  {
    tag: "Двор ЖК",
    title: "Двор многоквартирного дома, ЖК",
    image: publicAsset("/img/ready‑made-solutions/residential-garage.webp"),
    price: "121 862 ₽",
    description:
      "Шлагбаум GS14 с круглой стрелой 4,3&nbsp;м, опорной стойкой GBS1 и комплектом фотоэлементов GD1",
    specifics:
      "Бюджетное решение, удобный доступ жильцам и возможность пропускать доставку в закрытый двор.",
    additions: [
      "GSM / BLE модуль управления шлагбаумом GCM1",
      "Брелок-передатчик радиоуправления YET2129&nbsp;с динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Лампа сигнальная со встроенной антенной SL-U",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
    ],
  },
  {
    tag: "СНТ, коттеджный поселок",
    title: "Коттеджный поселок, СНТ, дача",
    image: publicAsset("/img/ready‑made-solutions/snt.webp"),
    price: "141 871 ₽",
    description:
      "Шлагбаум GS16 с круглой стрелой 6,3&nbsp;м, опорной стойкой GBS1 и комплектом фотоэлементов GD1",
    specifics:
      "Бюджетное решение, удобный доступ жильцам и возможность пропускать доставку в закрытый двор.",
    additions: [
      "GSM / BLE модуль управления шлагбаумом GCM1",
      "Брелок-передатчик радиоуправления YET2129&nbsp;с динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Лампа сигнальная со встроенной антенной SL-U",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
  },
  {
    tag: "Крытая парковка",
    title: "Крытая парковка",
    image: publicAsset("/img/ready‑made-solutions/underground-parking.webp"),
    price: "159 706 ₽",
    description:
      "Шлагбаум GS04.1 с прямоугольной стрелой 3&nbsp;м и шарниром для складной стрелы GBF1",
    specifics:
      "Бюджетное решение, удобный доступ жильцам и возможность пропускать доставку в закрытый двор.",
    additions: [
      "Светодиодная лента GBL4.3 для дополнительной подсветки стрелы шлагбаума GBO4.3",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
  },
  {
    tag: "Открытая парковка",
    title: "Открытая парковка",
    image: publicAsset("/img/ready‑made-solutions/parking-space.webp"),
    price: "183 297 ₽",
    description:
      "Шлагбаум GF03.1&nbsp;с круглой стрелой 3&nbsp;м и&nbsp;буфером",
    specifics: "Бюджетное решение, широкий проезд для техники, низкий поток.",
    additions: [
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
  },
  {
    tag: "КПП",
    title: "КПП, транспортная проходная",
    image: publicAsset("/img/ready‑made-solutions/checkpoint.webp"),
    price: "164 186 ₽",
    description:
      "Шлагбаум GS06.1 с круглой стрелой 6,3 м и опорной стойкой GBS1",
    specifics:
      "Ограниченное пространство, работа в составе парковочной системы.",
    important: "Нужны элементы подсветки, чтобы избежать аварий.",
    additions: [
      "Считыватель дальнего действия IR10.1 (EMM)",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
      "Стойка для установки оборудования (2,2 м) BH04",
    ],
  },
  {
    tag: "КПП — холодный климат",
    title: "КПП — холодный климат",
    image: publicAsset("/img/ready‑made-solutions/checkpoint-north.webp"),
    price: "202 515 ₽",
    description: "Шлагбаум GS14N с круглой стрелой 4,3&nbsp;м и опорной стойкой GBS1",
    specifics:
      "Широкий проезд, удобный доступ сотрудникам, высокий поток посетителей, работа в составе СКУД.",
    important:
      "Возможна работа в регионах с экстремально низкими температурами.",
    additions: [
      "Считыватель дальнего действия IR10.1 (EMM)",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
      "Стойка для установки оборудования (2,2 м) BH04",
    ],
  },
  {
    tag: "Открытая парковка — холодный климат",
    title: "Открытая парковка — холодный климат",
    image: publicAsset("/img/ready‑made-solutions/parking-north.webp"),
    price: "252 017 ₽",
    description: "Шлагбаум GF13N с круглой стрелой 3&nbsp;м и буфером",
    specifics:
      "Широкий проезд, удобный доступ сотрудникам, высокий поток посетителей, работа в&nbsp;составе СКУД.",
    important:
      "Возможна работа в регионах с экстремально низкими температурами.",
    additions: [
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
  },
];

/**
 * Отображает готовые решения для разных типов объектов с выбором комплектации.
 *
 * @returns Секция готовых решений с описанием, ценой и формой заказа.
 */
export default function Hero10(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const activeSolution = solutions[activeIndex];
  const solutionOptions: SolutionOption[] = solutions.map((solution, index) => ({
    value: index,
    label: solution.tag,
  }));

  const handleSolutionChange = (option: SingleValue<SolutionOption>) => {
    if (option) setActiveIndex(option.value);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section aria-label="Готовые решения" className="bg-white p-[40px_0_60px] sm:p-[60px_0_80px] 4xl:pb-30">
      <div className="container">
        <h3 className="mb-6 h2 xl:mb-8">Готовые решения</h3>

        {isMounted && (
          <div className="mb-6 lg:hidden" aria-label="Варианты объектов">
            <Select<SolutionOption, false>
              instanceId="solution-select"
              inputId="solution-select"
              aria-label="Варианты объектов"
              options={solutionOptions}
              value={solutionOptions[activeIndex]}
              onChange={handleSolutionChange}
              isSearchable={false}
              className='sm:max-w-[340px]'
              classNamePrefix="solution-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: 44,
                  borderRadius: 8,
                  borderColor: '#E1E3E6',
                  backgroundColor: '#F3F4F8',
                  boxShadow: 'none',
                }),
                option: (base, state) => ({
                  ...base,
                  color: '#22252F',
                  backgroundColor: state.isSelected ? '#E2E3EA' : state.isFocused ? '#F3F4F8' : '#FFFFFF',
                  borderColor: state.isSelected ? '#003067' : '',
                }),
                indicatorSeparator: (base) => ({
                  ...base,
                  display: 'none',
                }),
              }}
            />
          </div>
        )}

        <div className="flex-wrap hidden gap-2 mb-8 perco-icons xl:gap-3 lg:flex" role="tablist" aria-label="Варианты объектов">
          {solutions.map((solution, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={solution.tag}
                type="button"
                id={`solution-tab-${index}`}
                className={`solution-tab flex cursor-pointer items-center rounded-xl border px-3 h-12 hover:bg-grey-300 font-manrope-semibold text-left text-lg/6 transition-colors ${isActive ? 'border-cta bg-grey-200 text-grey-1000' : 'border-transparent bg-grey-200 text-grey-800'}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`solution-panel-${index}`}
                onClick={() => setActiveIndex(index)}
              >
                <span aria-hidden="true" className={`mr-1 text-xl/4 ${isActive ? ' text-cta' : ''}`}>
                  <i className={isActive ? 'perco-icon-check-tag' : 'perco-icon-plus-tag'} />
                </span>
                {solution.tag}
              </button>
            );
          })}
        </div>

        <div className="md:max-w-[480px] lg:max-w-full">
          <div className='block lg:w-6/12 2xl:hidden'>
            <h4 className="mb-4 xl:mb-5 font-manrope-bold text-[20px]/6 lg:text-[24px]/7 xl:text-[32px]/10">{activeSolution.title}</h4>
            <SolutionPrice classNameWrapper="mb-4 hidden sm:flex" price={activeSolution.price} description={activeSolution.description} />
          </div>

          <div
            id={`solution-panel-${activeIndex}`}
            className="flex flex-col lg:flex-row lg:gap-8 xl:gap-10"
            role="tabpanel"
            aria-labelledby={`solution-tab-${activeIndex}`}
          >
            <div className="lg:w-6/12 flex items-center justify-center overflow-hidden rounded-[16px] 2xl:rounded-2xl 3xl:rounded-3xl bg-grey-200 h-[280px] sm:h-[300px] xl:h-[376px] 2xl:h-[424px] 3xl:h-[512px]">
              <img className="object-contain w-full h-full" src={activeSolution.image} alt={activeSolution.description} />
            </div>
            <SolutionPrice classNameWrapper="mt-1 sm:hidden" price={activeSolution.price} description={activeSolution.description} />

            <div className="flex flex-col items-start mt-8 text-grey-1000 lg:w-5/12 lg:mt-0">
              <div className='hidden 2xl:block'>
                <h4 className="mb-4 xl:mb-5 h3">{activeSolution.title}</h4>
                <SolutionPrice classNameWrapper="mb-4" price={activeSolution.price} description={activeSolution.description} />
              </div>
              <SolutionAdditions additions={activeSolution.additions} />

              <Modal
                triggerLabel="Заказать"
                title="Форма обратной связи"
                triggerClassName="w-full sm:w-[232px]"
                triggerVariant="primary"
                initialMessage={`Нужна консультация по готовому решению: <strong class="font-manrope-semibold">${activeSolution.title}</strong><br />Комплектация: <strong class="font-manrope-semibold">${activeSolution.description}</strong><br />${activeSolution.alternative ?` <strong class="font-manrope-semibold">${activeSolution.alternative.description}</strong>` : ''}`}
              >
                <ModalFeedbackForm idPrefix="open-modal-sale-barrier" />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
