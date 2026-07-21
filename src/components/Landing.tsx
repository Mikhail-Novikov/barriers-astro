import { useIntersectionObserverArray } from "@hooks/useIntersectionObserver";

import "@styles/global.css";
import "swiper/swiper.css";

export const Heroes = () => {
  const { refs, setRef } = useIntersectionObserverArray(7, { threshold: 0.1 });

  return (
    <main className="relative">
    </main>
  );
};

export default Heroes;
