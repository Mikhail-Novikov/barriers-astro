import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { useEffect, useRef } from "react";

import { HtmlContent } from "@utils/HtmlContent";
import { publicAsset } from "@utils/publicAsset";
import { useBreakpoint } from "@hooks/useBreakpoint";

import CarouselControls from "./CarouselControls";

import "swiper/css";

/**
 * Описывает одну карточку дополнительного оборудования.
 */
type EquipmentCard = {
  /**
   * Уникальный идентификатор карточки.
   */
  id: number;

  /**
   * Название оборудования.
   */
  title: string;
};

/**
 * Пропсы компонента карусели дополнительного оборудования.
 */
type EquipmentCarouselProps = {
  /**
   * Список карточек, которые нужно отрисовать в карусели.
   */
  cards: EquipmentCard[];
};

/**
 * Карточка с горизонтальной каруселью дополнительного оборудования.
 *
 * @param props - Пропсы компонента.
 * @returns Компонент карусели с контролами и слайдами.
 */
const EquipmentCarousel = ({ cards }: EquipmentCarouselProps): JSX.Element => {
  const screen = useBreakpoint();
  const swiperRef = useRef<SwiperInstance | null>(null);

  /**
   * Перемещает карусель влево или вправо.
   *
   * @param direction - Направление перемещения: "-1" назад, "+1" вперед.
   */
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
    <div className="flex w-full min-w-0 gap-2 overflow-hidden lg:gap-5">
      {screen.lg && (
        <CarouselControls
          onPrevious={() => move("-1")}
          onNext={() => move("+1")}
          previousLabel="Предыдущие товары"
          nextLabel="Следующие товары"
        />
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          aria-label="Дополнительное оборудование"
          slidesPerView="auto"
          loop
          spaceBetween={12}
          className="equipment-carousel"
        >
          {cards.map((card) => (
            <SwiperSlide
              key={`${card.id}-${card.title}`}
              className="!w-[270px] md:!w-[352px]"
            >
              <article className="swiper-slide-transform">
                <img
                  className="object-contain rounded-3xl bg-grey-200 aspect-15/10"
                  src={publicAsset(
                    `/img/configuration-additional-equipment/gallery/dop-${card.id}.webp`,
                  )}
                  alt={card.title}
                  loading="lazy"
                />
                <h4 className="pt-2 text-md/normal md:text-lg/5 xl:text-xl/6 font-manrope-semibold">
                  <HtmlContent>{card.title}</HtmlContent>
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
