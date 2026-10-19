import { useEffect, useRef } from "react";
import lottie from "lottie-web";

/**
 * Пропсы анимации Lottie.
 */
type LottieAnimationProps = {
  /** Данные Lottie-анимации, передаваемые библиотеке lottie-web. */
  animasi: object;
};

/**
 * Загружает и отображает зацикленную Lottie-анимацию.
 *
 * @param props - Данные анимации для отображения.
 * @returns Контейнер, в который монтируется SVG-анимация.
 */
const LottieAnimation = ({ animasi }: LottieAnimationProps): JSX.Element => {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const anim = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animasi,
    })

    return () => anim.destroy()
  }, [animasi])

  return <div ref={container} className="w-full h-full"></div>
}

export default LottieAnimation;
