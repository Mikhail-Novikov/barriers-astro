import { useState } from "react";

type FaqItem = {
  title: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

/**
 * Компонент аккордеона для FAQ
 * @param items - массив вопросов и ответов
 * @return {JSX.Element}
 */
export default function FaqAccordion({ items }: FaqAccordionProps): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="lg:space-y-4">
      {items.map((item, index): JSX.Element => {
        const isOpen = openIndex === index;

        return (
          <details
            key={item.title}
            open={isOpen}
            className="flex w-full flex-col perco-icons text-left text-grey-1000 not-first:mt-6"
          >
            <summary
              className={`collapse-header flex list-none items-center gap-4 border-b border-grey-500 pb-4 cursor-pointer ${
                index === items.length - 1 && !isOpen ? "border-b-0" : ""
              }`}
              onClick={(event) => {
                event.preventDefault();
                setOpenIndex(isOpen ? null : index);
              }}
            >
              <span className="flex shrink-0 text-3xl text-grey-700">
                {isOpen ? <i className="perco-icon-minus-circle-outline" /> : <i className="perco-icon-plus-circle-outline" />}
              </span>
              <span className="text-lg/6 font-manrope-semibold" dangerouslySetInnerHTML={{__html: item.title}} />
            </summary>

            <div className="max-w-[690px] space-y-2 px-4 pb-3 pt-3 text-left text-md/6" dangerouslySetInnerHTML={{ __html: item.answer }} />
          </details>
        );
      })}
    </div>
  );
}
