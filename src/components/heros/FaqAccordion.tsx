import { Fragment, useState } from "react";

type FaqItem = {
  title: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <Fragment key={item.title}>
            <button
              type="button"
              className="flex w-full flex-col text-left text-grey-900 not-first:mt-4"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <div className="collapse-header flex items-center gap-4 border-b border-grey-500 pb-4">
                <div className="flex shrink-0 text-4xl text-gray-500">
                  {isOpen ? <i className="icon-minus-circle-outline" /> : <i className="icon-plus-circle-outline" />}
                </div>
                <p className="text-lg/6 font-semibold">{item.title}</p>
              </div>

              {isOpen && (
                <div className="px-4 pb-3 pt-3 text-left">
                  <p className="text-md/6">{item.answer}</p>
                </div>
              )}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
