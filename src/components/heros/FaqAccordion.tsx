import { useEffect, useRef, useState } from "react";
import scrollElementBelowStickyHeader from "@utils/scrollElementBelowStickyHeader";

/**
 * Элемент списка часто задаваемых вопросов.
 */
type FaqItem = {
  /** Текст вопроса. */
  title: string;
  /** Ответ на вопрос; допускает HTML-разметку. */
  answer: string;
};

/**
 * Пропсы аккордеона часто задаваемых вопросов.
 */
type FaqAccordionProps = {
  /** Вопросы и ответы, отображаемые в аккордеоне. */
  items: FaqItem[];
};

/** Пропсы кнопки для сворачивания открытого элемента аккордеона. */
type CollapseButtonProps = {
  onClick: () => void;
};

/**
 * Кнопка для сворачивания открытого элемента аккордеона.
 * @param onClick - Функция, вызываемая при клике на кнопку.
 * @returns Кнопка для сворачивания открытого элемента аккордеона.
 */
function CollapseButton({ onClick }: CollapseButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="flex items-center w-full gap-2 px-4 pt-3 pb-4 mb-2 cursor-pointer text-md/6 font-manrope-semibold text-cta md:hidden"
      onClick={onClick}
    >
      Свернуть
      <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 15 7-7 7 7" />
      </svg>
    </button>
  );
}

/**
 * Компонент аккордеона для FAQ
 * @param props - Список вопросов и ответов для отображения.
 * @returns Аккордеон с вопросами и ответами.
 */
export default function FaqAccordion({ items }: FaqAccordionProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const summaryRefs = useRef<(HTMLElement | null)[]>([]);
  const previousOpenIndex = useRef<number | null>(null);

  useEffect(() => {
    if (previousOpenIndex.current !== null && openIndex === null) {
      scrollElementBelowStickyHeader(summaryRefs.current[previousOpenIndex.current]);
    }

    previousOpenIndex.current = openIndex;
  }, [openIndex]);

  return (
    <div>
      {items.map((item, index): JSX.Element => {
        const isOpen = openIndex === index;

        return (
          <details
            key={item.title}
            open={isOpen}
            className="flex flex-col w-full text-left perco-icons not-last:border-b border-grey-500 text-grey-1000 not-first:my-3.5 2xl:not-first:my-5"
          >
            <summary
              ref={(element) => {
                summaryRefs.current[index] = element;
              }}
              className={`collapse-header flex list-none items-center gap-4 pb-3.5 2xl:pb-5 cursor-pointer ${
                isOpen ? "border-b border-grey-500/50" : "border-b-0"
              }`}
              onClick={(event) => {
                event.preventDefault();
                setOpenIndex(isOpen ? null : index);
              }}
            >
              <span className="flex text-3xl shrink-0 text-grey-700">
                {isOpen ? <i className="perco-icon-minus-circle-outline" /> : <i className="perco-icon-plus-circle-outline" />}
              </span>
              <span className="text-md/6 2xl:text-lg/6 font-manrope-semibold" dangerouslySetInnerHTML={{__html: item.title}} />
            </summary>

            <div className="max-w-[690px]">
              <div
                className="px-4 pt-3 pb-3 space-y-2 text-left text-md/6"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
              {isOpen && <CollapseButton onClick={() => setOpenIndex(null)} />}
            </div>
          </details>
        );
      })}
    </div>
  );
}
