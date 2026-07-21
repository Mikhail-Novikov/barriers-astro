import { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LottieAnimation = ({ animasi }: { animasi: any }) => {
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
