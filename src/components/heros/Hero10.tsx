import { useState } from 'react';
import Select, { type SingleValue } from 'react-select';
import { publicAsset } from '../../utils/publicAsset';
import { HtmlContent } from '@utils/HtmlContent';
import { useBreakpoint } from '@hooks/useBreakpoint';

type Solution = {
  tag: string;
  title: string;
  image: string;
  price: string;
  description: string;
  specifics: string;
  important?: string;
  additions: string[];
  alternative?: {
    price: string;
    description: string;
    additions?: string[];
  };
};

type SolutionOption = {
  value: number;
  label: string;
};

const solutions: Solution[] = [
  {
    tag: "Бизнес-центр, офис",
    title: "Бизнес-центр или офис",
    image: publicAsset("/img/ready‑made-solutions/business-center.webp"),
    price: "151 020 ₽",
    description: "GS04.1: прямоугольная стрела 4,3 м, опорная стойка GBS1",
    specifics:
      "Презентабельный внешний вид, удобный доступ сотрудников и посетителей, средний поток, работа в составе СКУД или парковочной системы.",
    important: "Доступ сотрудников и посетителей по картам и брелокам.",
    additions: [
      "Светодиодная лента GBL4.3 для дополнительной подсветки стрелы шлагбаума PERCo-GBO4.3",
      "Брелок-передатчик радиоуправления YET2129 четырехкнопочный с&nbsp;динамическим кодом",
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
      "GS14:круглая стрела 4,3&nbsp;м, опорная стойка GBS1, комплект фотоэлементов GD1",
    specifics: "Въезд для своих, бюджетное решение, низкий поток.",
    important:
      "Доступ по брелокам; GSM-модуль не используется, чтобы не провоцировать утечку номера.",
    additions: [
      "Брелок-передатчик радиоуправления YET2129 четырехкнопочный с&nbsp;динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Лампа сигнальная со&nbsp;встроенной антенной SL-U",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
    ],
  },
  {
    tag: "МКД, ЖК",
    title: "Двор многоквартирного дома, ЖК",
    image: publicAsset("/img/ready‑made-solutions/parking-space.webp"),
    price: "121 862 ₽",
    description:
      "GS14: круглая стрела 4,3&nbsp;м, опорная стойка GBS1, комплект фотоэлементов GD1",
    specifics:
      "Бюджетное решение, удобный доступ жильцам и возможность пропускать доставку в закрытый двор.",
    additions: [
      "GSM / BLE модуль управления шлагбаумом PERCo-GCM1",
      "Брелок-передатчик радиоуправления YET2129 четырехкнопочный с&nbsp;динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Лампа сигнальная со встроенной антенной SL-U",
      "Стойка для фотоэлемента безопасности GDS1",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
    ],
  },
  {
    tag: "Коттеджный поселок, СНТ, дача",
    title: "Коттеджный поселок, СНТ, дача",
    image: publicAsset("/img/ready‑made-solutions/snt.webp"),
    price: "141 871 ₽",
    description:
      "GS16: круглая стрела 6,3&nbsp;м, опорная стойка GBS1, комплект фотоэлементов GD1",
    specifics: "Бюджетное решение, широкий проезд для техники, низкий поток.",
    additions: [
      "GSM / BLE модуль управления шлагбаумом PERCo-GCM1",
      "Брелок-передатчик радиоуправления YET2129 четырехкнопочный с динамическим кодом",
      "Устройство радиоуправления YET404PC",
      "Лампа сигнальная со&nbsp;встроенной антенной SL-U",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
  },
  {
    tag: "Парковка",
    title: "Парковка",
    image: publicAsset("/img/ready‑made-solutions/parking-space.webp"),
    price: "183 297 ₽",
    description: "GF03.1: круглая стрела с&nbsp;буфером 3&nbsp;м",
    specifics:
      "Быстрое освобождение проезда, препятствие &laquo;паровозикам&raquo;, высокий поток, работа в&nbsp;составе парковочной системы.",
    additions: [
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
    ],
    alternative: {
      price: "252 017 ₽",
      description:
        "GF13N: для регионов с&nbsp;экстремально низкими температурами: круглая стрела с&nbsp;буфером 3&nbsp;м",
      additions: [
        "Островок безопасности PI-0",
        "Ограждение для стойки шлагбаума GM3",
      ],
    },
  },
  {
    tag: "Парковка подземная",
    title: "Парковка подземная",
    image: publicAsset("/img/ready‑made-solutions/underground-parking.webp"),
    price: "159 706 ₽",
    description:
      "GS04.1: прямоугольная стрела 3 м, шарнир GBF1, опорная стойка GBS1",
    specifics:
      "Ограниченное пространство, работа в составе парковочной системы.",
    important: "Нужны элементы подсветки, чтобы избежать аварий.",
    additions: [
      "Светодиодная лента GBL4.3",
      "Стойка для фотоэлемента GDS1",
      "Островок безопасности PI-01",
      "Ограждение GM3",
    ],
  },
  {
    tag: "КПП, транспортная проходная",
    title: "КПП, транспортная проходная",
    image: publicAsset("/img/ready‑made-solutions/checkpoint.webp"),
    price: "164 186 ₽",
    description: "GS06.1: круглая стрела 6,3 м, опорная стойка GBS1",
    specifics:
      "Широкий проезд, удобный доступ сотрудникам, высокий поток посетителей, работа в составе СКУД.",
    important:
      "Возможна работа в регионах с экстремально низкими температурами.",
    additions: [
      "Считыватель IR10.1 (EMM)",
      "Стойка для фотоэлемента безопасности GDS1",
      "Островок безопасности PI-01",
      "Ограждение для стойки шлагбаума GM3",
      "Стойка для считывателя GM5",
      "Стойка для установки оборудования (2,2 м) BH04",
    ],
    alternative: {
      price: "202 515 ₽",
      description:
        "GS14N для промышленных предприятий в регионах с экстремально низкими температурами: круглая стрела 4,3 м, опорная стойка GBS1",
              additions: [
        "Считыватель дальнего действия IR10.1 (EMM)",
        "Островок безопасности PI-01",
        "Ограждение для стойки шлагбаума GM3",
        "Стойка для считывателя GM5",
        "Стойка для установки оборудования (2,2 м) BH04",
      ],
    },
  },
];

export default function Hero10(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const screen = useBreakpoint();
  const activeSolution = solutions[activeIndex];
  const solutionOptions: SolutionOption[] = solutions.map((solution, index) => ({
    value: index,
    label: solution.tag,
  }));

  const handleSolutionChange = (option: SingleValue<SolutionOption>) => {
    if (option) setActiveIndex(option.value);
  };

  return (
    <section aria-label="Готовые решения" className="bg-white pt-10 md:pt-15 xl:pt-20 pb-10 md:pb-15 lg:pb-20 xl:pb-25">
      <div className="container">
        <div className="flex flex-col gap-9">
          <h3 className="h2">Готовые решения</h3>

          {!screen.md && (
            <div className="md:hidden" aria-label="Варианты объектов">
              <Select<SolutionOption, false>
                instanceId="solution-select"
                inputId="solution-select"
                aria-label="Варианты объектов"
                options={solutionOptions}
                value={solutionOptions[activeIndex]}
                onChange={handleSolutionChange}
                isSearchable={false}
                classNamePrefix="solution-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: 44,
                    borderRadius: 8,
                    borderColor: '#AEAFBF',
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

          <div className="perco-icons hidden flex-wrap gap-2 lg:gap-3 md:flex" role="tablist" aria-label="Варианты объектов">
            {solutions.map((solution, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={solution.tag}
                  type="button"
                  id={`solution-tab-${index}`}
                  className={`solution-tab flex cursor-pointer items-center rounded-xl border px-3.5 h-12 hover:bg-grey-300 font-manrope-semibold text-left text-lg/6 transition-colors ${isActive ? 'border-cta bg-grey-200 text-grey-1000' : 'border-transparent bg-grey-200 text-grey-800'}`}
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

          <div
            id={`solution-panel-${activeIndex}`}
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-15"
            role="tabpanel"
            aria-labelledby={`solution-tab-${activeIndex}`}
          >
            <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl bg-grey-200 lg:col-span-7 lg:min-h-[560px]">
              <img className="h-full w-full object-contain" src={activeSolution.image} alt={activeSolution.description} />
            </div>

            <div className="flex flex-col items-start max-w-[470px] text-grey-1000 lg:col-span-5">
              <h4 className="mb-5 text-3xl/10 font-bold lg:text-3xl/10">{activeSolution.title}</h4>
              <p className="mb-4 text-md/6 text-grey-800"><HtmlContent>{activeSolution.specifics}</HtmlContent></p>
              {activeSolution.important && (
                <p className="mb-5 text-md/6 text-grey-800"><strong>Важно: </strong><HtmlContent>{activeSolution.important}</HtmlContent></p>
              )}
              <div className="mb-5 flex w-full items-center gap-5 rounded-3xl bg-grey-200 px-6 py-4 lg:px-5">
                <strong className="shrink-0 ml-5 text-xl/8 font-manrope-semibold text-cta lg:text-2xl/7">{activeSolution.price}</strong>
                <span className="font-manrope-semibold text-md/5"><HtmlContent>{activeSolution.description}</HtmlContent></span>
              </div>
              <p className="mb-3 ml-4 text-xl/7 text-grey-800">Что можно добавить:</p>
              <ul className="mb-6 sm:mb-10  list-disc marker:text-[12px] space-y-1 ml-4 pl-3 sm:pl-6 text-md/6">
                {activeSolution.additions.map((addition) => <li key={addition}><HtmlContent>{addition}</HtmlContent></li>)}
              </ul>
              {activeSolution.alternative && (
                <>
                  <div className="mb-5 flex w-full items-center gap-5 rounded-3xl bg-grey-200 px-6 py-4 lg:px-5">
                    <strong className="shrink-0 ml-5 text-xl/8 font-manrope-semibold text-cta lg:text-2xl/7">{activeSolution.alternative.price}</strong>
                    <span className="font-manrope-semibold text-md/5"><HtmlContent>{activeSolution.alternative.description}</HtmlContent></span>
                  </div>
                  <p className="mb-3 ml-4 text-xl/7 text-grey-800">Что можно добавить:</p>
                  <ul className="mb-6 sm:mb-10 list-disc marker:text-[12px] space-y-1 ml-4 pl-3 sm:pl-6 text-md/6">
                    {activeSolution.alternative.additions && activeSolution.alternative.additions.map((addition) => <li key={addition}><HtmlContent>{addition}</HtmlContent></li>)}
                  </ul>
                </>
              )}
              <button type="button" className="min-w-[232px] cursor-pointer rounded-2xl bg-cta px-8 h-12 text-lg text-white transition-colors hover:bg-cta-hover">Заказать</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
