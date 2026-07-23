import { useEffect, useRef, useState } from "react";

export default function Promo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    setIsMounted(true);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isMounted) return;

    video.load();
    video.play().catch(() => {});
  }, [isMobile, isMounted]);

  console.log(isMobile);
  const src = isMobile
    ? "/video/promo-mobile.mp4"
    : "/video/promo-desktop.mp4";

  return (
    <section className="relative">
      <video
        ref={videoRef}
        key={src}
        className="w-full"
        muted
        autoPlay
        preload="auto"
        playsInline
        loop
        poster="/img/preview-promo.webp"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="container">
        <div className="flex flex-col justify-between h-full absolute top-0 pt-10 pb-23 max-w-[500px] text-left text-white">
          <ul className="flex flex-col gap-2 font-semibold">
            <li>
              <i className=" "></i>
              <p className="text-md">СДЕЛАНО В РОССИИ</p>
            </li>
            <li>
              <p className="text-md">
                <span className="text-2xl font-bold">5 </span>ЛЕТ ГАРАНТИИ
              </p>
            </li>
            <li>
              <p className="text-md">
                <span className="text-2xl font-bold">38 </span>ЛЕТ НА РЫНКЕ
              </p>
            </li>
          </ul>
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-6xl/14 font-semibold">
            Автоматические шлагбаумы
          </h1>
        </div>
      </div>
    </section>
  );
}