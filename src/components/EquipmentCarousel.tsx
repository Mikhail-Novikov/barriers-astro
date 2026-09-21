import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { useEffect, useRef } from "react";
import "swiper/css";
import { publicAsset } from "@utils/publicAsset";
import { useBreakpoint } from "@hooks/useBreakpoint";
import CarouselControls from "./CarouselControls";

type EquipmentCarouselProps = {
  cards: { id: number; title: string }[];
};

const EquipmentCarousel = ({ cards }: EquipmentCarouselProps) => {
  const screen = useBreakpoint();
  const swiperRef = useRef<SwiperInstance | null>(null);

  const move = (direction: "-1" | "+1") => {
    if (direction === "+1") {
      swiperRef.current?.slideNext();
    } else {
      swiperRef.current?.slidePrev();
    }
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
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          aria-label="Дополнительное оборудование"
          slidesPerView={3.2}
          breakpoints={{
            600: { slidesPerView: 1.3 },
            712: { slidesPerView: 1.8 },
            1200: { slidesPerView: 1.7 },
            1400: { slidesPerView: 2.3 },
            1600: { slidesPerView: 2.4 },
          }}
          spaceBetween={12}
          className="equipment-carousel"
        >
          {cards.map((card) => (
            <SwiperSlide key={`${card.id}-${card.title}`}>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default EquipmentCarousel;
