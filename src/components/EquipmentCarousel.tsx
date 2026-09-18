import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useEffect, useRef } from "react";
import "@splidejs/react-splide/css";
import { publicAsset } from "@utils/publicAsset";
import { useBreakpoint } from "@hooks/useBreakpoint";
import CarouselControls from "./CarouselControls";

type EquipmentCarouselProps = {
  cards: { id: number; title: string }[];
};

const EquipmentCarousel = ({ cards }: EquipmentCarouselProps) => {
  const screen = useBreakpoint();
  const splideRef = useRef<{
    splide?: { go: (direction: "-1" | "+1") => void };
  }>(null);

  const move = (direction: "-1" | "+1") => {
    splideRef.current?.splide?.go(direction);
  };

  useEffect(() => {
    const movePrevious = () => move("-1");
    const moveNext = () => move("+1");

    window.addEventListener("equipment-carousel:previous", movePrevious);
    window.addEventListener("equipment-carousel:next", moveNext);

    return () => {
      window.removeEventListener("equipment-carousel:previous", movePrevious);
      window.removeEventListener("equipment-carousel:next", moveNext);
    };
  }, []);

  return (
    <div className="flex min-w-0 w-full gap-4 overflow-hidden">
      {screen.md && (
        <CarouselControls
          onPrevious={() => move("-1")}
          onNext={() => move("+1")}
          previousLabel="Предыдущие товары"
          nextLabel="Следующие товары"
        />
      )}
      <div className="min-w-0 flex-1 overflow-hidden">
        <Splide
          ref={splideRef}
          aria-label="Дополнительное оборудование"
          options={{
            arrows: false,
            rewind: false,
            loop: false,
            // fixedWidth: "352px",
            perPage: 3.2,
            breakpoints: {
              600: { perPage: 1.3 },
              712: { perPage: 1.8 },
              1200: { perPage: 1.7 },
              1400: { perPage: 2.3 },
              1600: { perPage: 2.4 },
            },
            gap: 12,
            pagination: false,
          }}
          className="equipment-carousel"
        >
          {cards.map((card) => (
            <SplideSlide key={`${card.id}-${card.title}`}>
              <article>
                <img
                  className="rounded-3xl bg-grey-200 object-contain"
                  src={publicAsset(
                    `/img/configuration-additional-equipment/gallery/dop-${card.id}.webp`,
                  )}
                  alt={card.title}
                  loading="lazy"
                />
                <h4 className="pt-2 text-lg/6 font-manrope-semibold text-grey-1000">
                  {card.title}
                </h4>
              </article>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </div>
  );
};

export default EquipmentCarousel;
